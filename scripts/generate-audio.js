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

const videosPath = path.join(__dirname, '../content/videos.json');
const outputDir = path.join(__dirname, '../public/videos');
const VOICE = 'perseus'; // Deep, calm male voice suitable for storytelling

async function generateAudio(text, filename) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      voice: VOICE,
      language: 'en',
      text: text,
      format: 'mp3',
    });

    const options = {
      hostname: 'api.x.ai',
      port: 443,
      path: '/v1/tts',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let audioData = Buffer.alloc(0);

      res.on('data', (chunk) => {
        audioData = Buffer.concat([audioData, chunk]);
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const outputPath = path.join(outputDir, filename);
          fs.writeFileSync(outputPath, audioData);
          console.log(`✓ Generated: ${filename}`);
          resolve();
        } else {
          const error = audioData.toString().slice(0, 200);
          reject(new Error(`API error: ${res.statusCode} - ${error}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    if (!fs.existsSync(videosPath)) {
      console.error(`videos.json not found at ${videosPath}`);
      process.exit(1);
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const videosData = JSON.parse(fs.readFileSync(videosPath, 'utf-8'));
    const videos = videosData.videos || [];

    if (videos.length === 0) {
      console.log('No videos found in videos.json');
      return;
    }

    console.log(`Generating audio for ${videos.length} video(s) using voice: ${VOICE}...`);

    for (const video of videos) {
      if (!video.quote || !video.audio) {
        console.warn(`⚠ Skipping ${video.file}: missing quote or audio field`);
        continue;
      }

      try {
        await generateAudio(video.quote, video.audio);
      } catch (error) {
        console.error(`✗ Failed to generate audio for ${video.file}: ${error.message}`);
      }
    }

    console.log('\nAudio generation complete!');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
