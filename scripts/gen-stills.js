#!/usr/bin/env node

/**
 * Generate candidate still images for queued entries
 * Usage: npm run gen-stills
 *
 * For each entry with status "queued":
 * 1. Call xAI grok-imagine-image-2.0 with videoPrompt
 * 2. Request 4 candidates at 16:9 aspect ratio
 * 3. Save to staging/stills/<slug>/candidate-N.png
 * 4. Update entry status to "stills_ready"
 * 5. Retry failures 2x with backoff; mark failed entries
 *
 * No entry is lost; all are logged.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load .env.local manually
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const queuePath = path.join(__dirname, '..', 'staging', 'prompts', 'queue.json');
const stillsBaseDir = path.join(__dirname, '..', 'staging', 'stills');

// Load API key with fallback chain
function loadApiKey() {
  if (process.env.XAI_API_KEY) {
    return { key: process.env.XAI_API_KEY, source: '.env.local (or process.env)' };
  }
  if (process.env.GROK_API_KEY) {
    return { key: process.env.GROK_API_KEY, source: 'process.env GROK_API_KEY' };
  }
  return null;
}

const apiKeyResult = loadApiKey();
if (!apiKeyResult || !apiKeyResult.key) {
  console.error('❌ Error: XAI_API_KEY not found');
  console.error('   Checked: .env.local, process.env.XAI_API_KEY, process.env.GROK_API_KEY');
  process.exit(1);
}

const API_KEY = apiKeyResult.key;
console.log(`✓ XAI_API_KEY loaded from ${apiKeyResult.source}`);

if (!fs.existsSync(queuePath)) {
  console.log('📭 No queue found. Run "npm run review" first.');
  process.exit(0);
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
const queuedEntries = queue.entries.filter((e) => e.status === 'queued');

if (queuedEntries.length === 0) {
  console.log('📭 No queued entries. Nothing to generate.');
  process.exit(0);
}

function callXAIImageAPI(prompt, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'grok-imagine-image-2.0',
      prompt: prompt,
      n: 4,
      aspect_ratio: '16:9',
      resolution: '1k',
      quality: 'medium',
      response_format: 'b64_json',
    });

    const options = {
      hostname: 'api.x.ai',
      port: 443,
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed.data); // Array of {b64_json: "..."}
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else if (res.statusCode >= 500 && retryCount < 2) {
          // Retry on server error
          const delay = Math.pow(2, retryCount + 1) * 1000; // 2s, 4s
          console.warn(`  ⚠️  API error ${res.statusCode}, retrying in ${delay}ms...`);
          setTimeout(() => {
            callXAIImageAPI(prompt, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, delay);
        } else {
          reject(new Error(`API error: ${res.statusCode} - ${responseData.slice(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function generateStills(entry) {
  const slug = entry.id.split('-').slice(0, -2).join('-') || entry.id; // Derive slug from id
  const stillDir = path.join(stillsBaseDir, slug);

  if (!fs.existsSync(stillDir)) {
    fs.mkdirSync(stillDir, { recursive: true });
  }

  try {
    console.log(`\n📸 Generating stills for: ${slug}`);
    const candidates = await callXAIImageAPI(entry.videoPrompt);

    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error('No candidates returned from API');
    }

    // Save each candidate
    for (let i = 0; i < Math.min(candidates.length, 4); i++) {
      const candidatePath = path.join(stillDir, `candidate-${i + 1}.png`);
      const imageBuffer = Buffer.from(candidates[i].b64_json, 'base64');
      fs.writeFileSync(candidatePath, imageBuffer);
      console.log(`  ✓ Saved candidate-${i + 1}.png`);
    }

    return { status: 'success', slug };
  } catch (error) {
    console.error(`  ❌ Failed: ${error.message}`);
    return { status: 'failed', slug, error: error.message };
  }
}

async function main() {
  console.log(`\n🎬 Generating stills for ${queuedEntries.length} entries\n`);
  console.log('⏱️  This may take a minute or two...\n');

  const results = [];

  for (const entry of queuedEntries) {
    const result = await generateStills(entry);
    results.push(result);
  }

  // Update queue status
  for (const result of results) {
    const entry = queue.entries.find((e) => e.id === result.slug || e.id.includes(result.slug));
    if (entry && result.status === 'success') {
      entry.status = 'stills_ready';
      entry.updatedAt = new Date().toISOString();
    } else if (entry && result.status === 'failed') {
      entry.status = 'failed';
      entry.error = result.error;
      entry.updatedAt = new Date().toISOString();
    }
  }

  queue.updatedAt = new Date().toISOString();
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));

  // Summary
  const successful = results.filter((r) => r.status === 'success').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  console.log(`\n✨ Generation complete!`);
  console.log(`✅ ${successful} successful | ❌ ${failed} failed`);

  if (successful > 0) {
    console.log(`\n🎨 Next step: npm run pick-stills`);
  }

  if (failed > 0) {
    console.log(`\n⚠️  Review failed entries in queue.json and retry with npm run gen-stills`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
