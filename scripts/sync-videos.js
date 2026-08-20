const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GROK_VIDEOS_PATH = 'C:\\Users\\Chris\\Desktop\\GROK Videos';
const PUBLIC_VIDEOS_PATH = path.join(process.cwd(), 'public', 'videos');
const POSTERS_PATH = path.join(process.cwd(), 'public', 'posters');
const VIDEOS_JSON = path.join(process.cwd(), 'content', 'videos.json');

// Ensure directories exist
[PUBLIC_VIDEOS_PATH, POSTERS_PATH].forEach((dir) => {
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
    return false; // Already exists
  }

  try {
    const videoPath = path.join(PUBLIC_VIDEOS_PATH, videoFile);
    // Extract first frame at 1 second or beginning
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

// Optimize video for web (optional, if ffmpeg available)
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
    // Optimization failed, use original
    return false;
  }
}

// Main sync function
function syncVideos() {
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
  videoFiles.forEach((file) => {
    const slug = toSlug(path.parse(file).name);
    const sourcePath = path.join(GROK_VIDEOS_PATH, file);

    if (existingSlugs.has(slug)) {
      console.log(`Already synced: ${slug}`);
      return;
    }

    console.log(`\nProcessing: ${file}`);

    // Copy video
    if (copyVideo(sourcePath, slug)) {
      // Generate poster
      generatePoster(`${slug}.mp4`, slug);

      // Try to optimize (optional)
      optimizeVideo(`${slug}.mp4`, slug);

      // Add to videos.json
      const newVideo = {
        slug,
        file: `${slug}.mp4`,
        quote: `[Add quote here] "${slug}"`,
        theme: '[Add theme here]',
        poster: `/posters/${slug}.jpg`,
        youtubeId: '',
        date: new Date().toISOString().split('T')[0],
      };

      videosData.push(newVideo);
      newVideosAdded++;

      console.log(`→ Added to videos.json (edit the quote and theme)`);
    }
  });

  // Write updated videos.json
  if (newVideosAdded > 0) {
    fs.writeFileSync(VIDEOS_JSON, JSON.stringify(videosData, null, 2));
    console.log(`\n✓ Updated videos.json (${newVideosAdded} new video${newVideosAdded !== 1 ? 's' : ''})`);
  } else {
    console.log('\nNo new videos to sync.');
  }

  console.log('\nNext steps:');
  console.log('1. Edit content/videos.json and fill in the title and theme for new videos');
  console.log('2. Add youtubeId if the video is on YouTube');
  console.log('3. Run: npm run dev');
}

syncVideos();
