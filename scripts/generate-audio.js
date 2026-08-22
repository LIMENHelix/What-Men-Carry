const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.XAI_API_KEY;
if (!API_KEY) {
  console.error('Error: XAI_API_KEY environment variable not set');
  process.exit(1);
}

const videosPath = path.join(__dirname, '../public/videos.json');
const outputDir = path.join(__dirname, '../public/videos');

async function generateAudio(text, filename) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'grok-2-voice-latest',
      input: text,
      voice: 'onyx',
    });

    const options = {
      hostname: 'api.x.ai',
      port: 443,
      path: '/v1/audio/speech',
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
          reject(new Error(`API error: ${res.statusCode} - ${res.statusMessage}`));
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

    console.log(`Generating audio for ${videos.length} video(s)...`);

    for (const video of videos) {
      if (!video.quote || !video.audio) {
        console.warn(`⚠ Skipping ${video.name}: missing quote or audio field`);
        continue;
      }

      try {
        await generateAudio(video.quote, video.audio);
      } catch (error) {
        console.error(`✗ Failed to generate audio for ${video.name}: ${error.message}`);
      }
    }

    console.log('\nAudio generation complete!');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

main();
