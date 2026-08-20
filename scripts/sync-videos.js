const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const GROK_VIDEOS_PATH = 'C:\\Users\\Chris\\Desktop\\GROK Videos';
const PUBLIC_VIDEOS_PATH = path.join(process.cwd(), 'public', 'videos');
const POSTERS_PATH = path.join(process.cwd(), 'public', 'posters');
const AUDIO_PATH = path.join(process.cwd(), 'public', 'audio');
const VIDEOS_JSON = path.join(process.cwd(), 'content', 'videos.json');

// Grok API configuration
const GROK_API_KEY = process.env.GROK_API_KEY;

// Ensure directories exist
[PUBLIC_VIDEOS_PATH, POSTERS_PATH, AUDIO_PATH].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Convert filename to slug
function toSlug(filename) {
  return filename
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Generate voiceover using Grok API
async function generateVoiceover(quote, slug) {
  const audioPath = path.join(AUDIO_PATH, `${slug}-voiceover.mp3`);

  if (fs.existsSync(audioPath)) {
    console.log(`✓ Voiceover already exists: ${slug}-voiceover.mp3`);
    return true;
  }

  if (!GROK_API_KEY) {
    console.log(`⚠ Skipping voiceover: GROK_API_KEY not set`);
    console.log(`  To generate audio, set: export GROK_API_KEY=your_key && npm run sync-videos`);
    return false;
  }

  try {
    const requestBody = JSON.stringify({
      model: 'grok-2-vision-1212',
      input: quote,
      voice: 'onyx',
      response_format: 'mp3',
      speed: 0.95,
    });

    return new Promise((resolve) => {
      const options = {
        hostname: 'api.x.ai',
        path: '/v1/audio/speech',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let data = Buffer.alloc(0);

        res.on('data', (chunk) => {
          data = Buffer.concat([data, chunk]);
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            fs.writeFileSync(audioPath, data);
            console.log(`✓ Generated voiceover: ${slug}-voiceover.mp3`);
            resolve(true);
          } else {
            console.log(`⚠ Grok API error (${res.statusCode}): could not generate audio for ${slug}`);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log(`⚠ Network error: ${error.message}`);
        resolve(false);
      });

      req.write(requestBody);
      req.end();
    });
  } catch (error) {
    console.log(`⚠ Error generating voiceover: ${error.message}`);
    return false;
  }
}

// Copy video file
function copyVideo(sourcePath, slug) {
  const destPath = path.join(PUBLIC_VIDEOS_PATH, `${slug}.mp4`);
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Copied: ${slug}.mp4`);
    return true;
  }
  return false;
}

// Generate poster image using ffmpeg
function generatePoster(videoFile, slug) {
  const posterPath = path.join(POSTERS_PATH, `${slug}.jpg`);
  if (fs.existsSync(posterPath)) {
    return false;
  }

  try {
    const videoPath = path.join(PUBLIC_VIDEOS_PATH, videoFile);
    execSync(
      `ffmpeg -i "${videoPath}" -ss 0 -vframes 1 -q:v 2 "${posterPath}"`,
      { stdio: 'pipe' }
    );
    console.log(`✓ Generated poster: ${slug}.jpg`);
    return true;
  } catch (error) {
    console.log(`⚠ Could not generate poster for ${slug} (ffmpeg may not be available)`);
    return false;
  }
}

// Optimize video for web (optional)
function optimizeVideo(videoFile, slug) {
  try {
    const sourcePath = path.join(PUBLIC_VIDEOS_PATH, videoFile);
    const optimizedPath = path.join(PUBLIC_VIDEOS_PATH, `${slug}-optimized.mp4`);

    if (fs.existsSync(optimizedPath)) {
      return false;
    }

    execSync(
      `ffmpeg -i "${sourcePath}" -c:v libx264 -crf 23 -c:a aac -b:a 128k -movflags +faststart "${optimizedPath}"`,
      { stdio: 'pipe' }
    );
    console.log(`✓ Optimized: ${slug}-optimized.mp4`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main sync function
async function syncVideos() {
  if (!fs.existsSync(GROK_VIDEOS_PATH)) {
    console.error(`Error: Grok Videos folder not found at ${GROK_VIDEOS_PATH}`);
    process.exit(1);
  }

  const sourceFiles = fs.readdirSync(GROK_VIDEOS_PATH);
  const videoFiles = sourceFiles.filter((f) =>
    /\.(mp4|mov|webm)$/i.test(f)
  );

  if (videoFiles.length === 0) {
    console.log('No video files found in Grok Videos folder.');
    return;
  }

  console.log(`Found ${videoFiles.length} video file(s).\n`);

  // Load existing videos.json
  let videosData = [];
  if (fs.existsSync(VIDEOS_JSON)) {
    try {
      videosData = JSON.parse(fs.readFileSync(VIDEOS_JSON, 'utf-8'));
    } catch (error) {
      console.error('Error reading videos.json:', error.message);
    }
  }

  const existingSlugs = new Set(videosData.map((v) => v.slug));
  let newVideosAdded = 0;

  // Process each video
  for (const file of videoFiles) {
    const slug = toSlug(path.parse(file).name);
    const sourcePath = path.join(GROK_VIDEOS_PATH, file);

    if (existingSlugs.has(slug)) {
      console.log(`Already synced: ${slug}`);
      continue;
    }

    console.log(`\nProcessing: ${file}`);

    if (copyVideo(sourcePath, slug)) {
      generatePoster(`${slug}.mp4`, slug);
      optimizeVideo(`${slug}.mp4`, slug);

      const newVideo = {
        slug,
        file: `${slug}.mp4`,
        quote: `[Add quote here] "${slug}"`,
        theme: '[Add theme here]',
        poster: `/posters/${slug}.jpg`,
        audioFile: `${slug}-voiceover.mp3`,
        youtubeId: '',
        date: new Date().toISOString().split('T')[0],
      };

      videosData.push(newVideo);
      newVideosAdded++;
      console.log(`→ Added to videos.json (edit the quote and theme)`);
    }
  }

  // Write updated videos.json
  if (newVideosAdded > 0) {
    fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videosData, null, 2));
    console.log(`\n✓ Updated videos.json (${newVideosAdded} new video${newVideosAdded !== 1 ? 's' : ''})`);
  } else {
    console.log('\nNo new videos to sync.');
  }

  // Generate voiceovers for all videos that have quotes
  console.log('\n--- Generating voiceovers ---');
  for (const video of videosData) {
    if (video.quote && !video.quote.includes('[Add quote')) {
      await generateVoiceover(video.quote, video.slug);
    }
  }

  console.log('\n✓ Sync complete.');
}

syncVideos().catch((error) => {
  console.error('Sync failed:', error);
  process.exit(1);
});
