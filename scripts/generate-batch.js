#!/usr/bin/env node

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

// Parse CLI arguments
const args = process.argv.slice(2);
let theme = null;
let count = 3;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--theme' && i + 1 < args.length) {
    theme = args[i + 1];
  }
  if (args[i] === '--count' && i + 1 < args.length) {
    count = Math.min(parseInt(args[i + 1], 10), 5); // Cap at 5
  }
  if (args[i] === '--max') {
    count = 5;
  }
}

if (!theme) {
  console.error('❌ Usage: npm run new-batch -- --theme <theme-name> [--count N]');
  console.error('   Available themes: suicide, ptsd-veterans, depression, divorce, custody-family-court, fatherhood, work-provider-stress, financial-strain, alcoholism-addiction, loneliness-isolation, physical-decline, grief-loss');
  process.exit(1);
}

// Load API key with fallback chain: .env.local → process.env → Windows user env
function loadApiKey() {
  // Try process.env first (loaded from .env.local by node)
  if (process.env.XAI_API_KEY) {
    return { key: process.env.XAI_API_KEY, source: '.env.local (or process.env)' };
  }
  if (process.env.GROK_API_KEY) {
    return { key: process.env.GROK_API_KEY, source: 'process.env GROK_API_KEY' };
  }

  // Try Windows user environment variable (requires new process, so fallback)
  // This won't work in current process but documents the chain for new shells
  return null;
}

const apiKeyResult = loadApiKey();
if (!apiKeyResult || !apiKeyResult.key) {
  console.error('❌ Error: XAI_API_KEY not found');
  console.error('   Checked: .env.local, process.env.XAI_API_KEY, process.env.GROK_API_KEY');
  console.error('   To fix: Add XAI_API_KEY to .env.local or set as Windows user environment variable');
  process.exit(1);
}

const API_KEY = apiKeyResult.key;
console.log(`✓ XAI_API_KEY loaded from ${apiKeyResult.source}`);

const validThemes = [
  'suicide',
  'ptsd-veterans',
  'depression',
  'divorce',
  'custody-family-court',
  'fatherhood',
  'work-provider-stress',
  'financial-strain',
  'alcoholism-addiction',
  'loneliness-isolation',
  'physical-decline',
  'grief-loss',
];

if (!validThemes.includes(theme)) {
  console.error(`❌ Invalid theme: ${theme}`);
  console.error(`   Available: ${validThemes.join(', ')}`);
  process.exit(1);
}

// Paths
const dossierPath = path.join(__dirname, '..', 'content-engine', 'dossiers', `${theme}.md`);
const rulesPath = path.join(__dirname, '..', 'content-engine', 'craft', 'quote-rules.md');
const stylePath = path.join(__dirname, '..', 'content-engine', 'craft', 'video-style.md');
const stagingDir = path.join(__dirname, '..', 'staging', 'proposed');
const batchFile = path.join(stagingDir, 'proposed-batch.json');

// Ensure staging directory exists
if (!fs.existsSync(stagingDir)) {
  fs.mkdirSync(stagingDir, { recursive: true });
}

// Read context files
if (!fs.existsSync(dossierPath)) {
  console.error(`❌ Dossier not found: ${dossierPath}`);
  process.exit(1);
}

const dossier = fs.readFileSync(dossierPath, 'utf-8');
const rules = fs.readFileSync(rulesPath, 'utf-8');
const style = fs.readFileSync(stylePath, 'utf-8');

// Generate unique IDs
function generateId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${theme}-${timestamp}-${random}`;
}

// Call xAI API
function callXAI(prompt) {
  return new Promise((resolve, reject) => {
    // Ensure prompt is properly escaped for JSON
    const safePrompt = typeof prompt === 'string' ? prompt : String(prompt);
    const requestBody = {
      model: 'grok-3',
      messages: [
        {
          role: 'user',
          content: safePrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };

    let data;
    try {
      data = JSON.stringify(requestBody);
    } catch (e) {
      reject(new Error(`Failed to encode request: ${e.message}`));
      return;
    }

    const options = {
      hostname: 'api.x.ai',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data, 'utf8'),
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
            // Find the text content (skip thinking/other types)
            const textContent = parsed.content.find(c => c.type === 'text');
            if (!textContent || !textContent.text) {
              throw new Error('No text content in response');
            }
            resolve(textContent.text);
          } catch (e) {
            reject(new Error(`Failed to parse API response: ${e.message}`));
          }
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

async function main() {
  console.log(`\n🎬 Generating ${count} What Men Carry drafts for theme: ${theme}\n`);

  const prompt = `You are generating content for What Men Carry — a site of quotes and short videos about men carrying invisible weight.

THEME DOSSIER:
${dossier}

QUOTE STANDARD (all quotes MUST pass these 5 gates):
${rules}

VIDEO VISUAL GRAMMAR (describe one ordinary moment, never the crisis itself):
${style}

CRITICAL ARTIFACT DEFENSE RULES FOR VIDEO PROMPTS:
- Minimize hands in motion. Resting hands on table/wheel/lap are safe; avoid pouring, typing, buttoning, reaching.
- One human subject in sharp focus. Background figures soft-blurred only.
- Stillness is safety. One breath of motion, held. Camera moves; subject barely moves. Never prompt: walking, running, eating, climbing, reaching, complex sequences.
- Avoid: complex furniture, mirrors, reflections, text, clocks, patterned objects in focus.
- COUNT NOTHING. Never specify numbers (avoid "three," "two," "four"). Say "cups on the table" not "three coffee cups."
- Described action: 5–8 seconds max. One moment, then hold still.
- Profile or three-quarter face renders better than full-frontal close-up emotion.

YOUR TASK:
Generate ${count} entries. Each entry must have:
1. quote — A quote under 14 words that passes all 5 gates of the quote standard
2. videoPrompt — A detailed prompt for video generation (describe one specific ordinary moment, shallow depth of field, him still and sharp, world soft, muted amber-and-steel grade)
3. voiceLine — The quote as a voiceover direction (slow, quiet, flat-calm male voice reading the quote once)

Return ONLY valid JSON in this exact format (no markdown, no explanation):
[
  {
    "quote": "exact quote under 14 words",
    "videoPrompt": "detailed video description of one ordinary moment",
    "voiceLine": "slow, quiet direction: quote read once with flat calm male voice"
  }
]

CRITICAL: Every quote must be original and different from the others. Avoid the kill-list words (journey, battle, warrior, struggle, healing, broken, demons, darkness, silence, mask, storm).
${theme === 'suicide' ? '\nSUICIDE SAFETY: All quotes must land on "still-here" — weight carried, watch kept, the decision to stay. Never romanticize exit.' : ''}`;

  let drafts = [];
  let retries = 0;
  const maxRetries = 2;

  while (drafts.length < count && retries <= maxRetries) {
    try {
      console.log(`📝 Requesting ${count} quotes from Grok...`);
      const response = await callXAI(prompt);

      // Parse JSON from response
      const jsonMatch = response.match(/\[\s*\{[\s\S]*?\}\s*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate each entry
      for (const entry of parsed) {
        if (!entry.quote || !entry.videoPrompt || !entry.voiceLine) {
          console.warn('⚠️  Skipping invalid entry (missing required fields)');
          continue;
        }

        // Count words in quote
        const wordCount = entry.quote.split(/\s+/).length;
        if (wordCount > 14) {
          console.warn(`⚠️  Skipping quote (${wordCount} words > 14 max): "${entry.quote}"`);
          continue;
        }

        // Check kill-list words
        const killList = ['journey', 'battle', 'warrior', 'struggle', 'healing', 'broken', 'demons', 'darkness', 'silence', 'mask', 'storm'];
        const hasKillWord = killList.some(word => entry.quote.toLowerCase().includes(word));
        if (hasKillWord) {
          console.warn(`⚠️  Skipping quote (contains kill-list word): "${entry.quote}"`);
          continue;
        }

        // Check suicide safety rule
        if (theme === 'suicide') {
          const exitWords = ['peace', 'end', 'finally', 'relief', 'escape', 'away'];
          const hasExitWord = exitWords.some(word => entry.quote.toLowerCase().includes(word));
          if (hasExitWord) {
            console.warn(`⚠️  Skipping quote (romanticizes exit): "${entry.quote}"`);
            continue;
          }
        }

        drafts.push({
          id: generateId(),
          theme,
          quote: entry.quote,
          videoPrompt: entry.videoPrompt,
          voiceLine: entry.voiceLine,
          status: 'draft',
          generatedAt: new Date().toISOString(),
        });

        console.log(`✅ "${entry.quote}"`);
      }

      if (drafts.length >= count) {
        break;
      }

      // If we didn't get enough, retry
      if (drafts.length < count && retries < maxRetries) {
        console.log(`⚠️  Got ${drafts.length}/${count} valid quotes, retrying...\n`);
        retries++;
      }
    } catch (error) {
      console.error(`✗ Generation failed: ${error.message}`);
      if (retries < maxRetries) {
        console.log(`Retrying (${retries + 1}/${maxRetries})...\n`);
        retries++;
      } else {
        process.exit(1);
      }
    }
  }

  if (drafts.length === 0) {
    console.error('\n❌ Failed to generate any valid drafts.');
    process.exit(1);
  }

  // Load existing proposed batch or create new
  let batch = { entries: [], generatedAt: new Date().toISOString() };
  if (fs.existsSync(batchFile)) {
    batch = JSON.parse(fs.readFileSync(batchFile, 'utf-8'));
  }

  // Ensure entries array exists
  if (!batch.entries) {
    batch.entries = [];
  }

  // Add new drafts
  batch.entries.push(...drafts);
  batch.updatedAt = new Date().toISOString();

  // Write to staging
  fs.writeFileSync(batchFile, JSON.stringify(batch, null, 2));

  console.log(`\n✨ Batch written to: ${batchFile}`);
  console.log(`📊 Total entries in batch: ${batch.entries.length}`);
  console.log(`💰 Estimated cost: $0.01 per 1K input tokens (~$0.05 per batch of 3)`);
  console.log('\n📋 Next step: Review with npm run review');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
