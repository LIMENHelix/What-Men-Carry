const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GROK_VIDEOS_PATH = path.join(process.env.USERPROFILE, 'Desktop', 'GROK Videos');
const PUBLIC_VIDEOS_PATH = path.join(__dirname, '..', 'public', 'videos');
const VIDEOS_JSON_PATH = path.join(__dirname, '..', 'content', 'videos.json');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_VIDEOS_PATH)) {
  fs.mkdirSync(PUBLIC_VIDEOS_PATH, { recursive: true });
}

// Read existing videos.json
let videosData = { videos: [] };
if (fs.existsSync(VIDEOS_JSON_PATH)) {
  videosData = JSON.parse(fs.readFileSync(VIDEOS_JSON_PATH, 'utf8'));
}

// Scan Grok Videos folder
if (!fs.existsSync(GROK_VIDEOS_PATH)) {
  console.log(`❌ Grok Videos folder not found at: ${GROK_VIDEOS_PATH}`);
  process.exit(1);
}

const videoFiles = fs.readdirSync(GROK_VIDEOS_PATH).filter((f) => {
  const ext = path.extname(f).toLowerCase();
  return ['.mp4', '.mov', '.avi', '.webm'].includes(ext);
});

console.log(`📹 Found ${videoFiles.length} video files in ${GROK_VIDEOS_PATH}`);

videoFiles.forEach((file) => {
  const sourceFile = path.join(GROK_VIDEOS_PATH, file);
  const slug = path.basename(file, path.extname(file))
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  const destFile = `${slug}.mp4`;
  const destPath = path.join(PUBLIC_VIDEOS_PATH, destFile);
  const posterPath = path.join(PUBLIC_VIDEOS_PATH, `${slug}-poster.jpg`);

  // Check if video already synced
  const alreadySynced = videosData.videos.some((v) => v.slug === slug);
  
  if (alreadySynced) {
    console.log(`✓ Already synced: ${slug}`);
    return;
  }

  // Copy video file
  console.log(`📋 Copying: ${file} → ${destFile}`);
  fs.copyFileSync(sourceFile, destPath);

  // Try to generate poster with ffmpeg
  try {
    execSync(`ffmpeg -i "${destPath}" -ss 00:00:01 -vf scale=1280:-1 -q:v 5 "${posterPath}" 2>nul`, {
      stdio: 'pipe',
    });
    console.log(`🖼️  Generated poster: ${slug}-poster.jpg`);
  } catch (e) {
    console.log(`ℹ️  ffmpeg not available; posterImage will load on client`);
  }

  // Add stub to videos.json
  const newVideo = {
    slug,
    file: destFile,
    title: 'ADD TITLE HERE',
    theme: 'other',
    date: new Date().toISOString().split('T')[0],
    youtubeId: '',
  };
  videosData.videos.push(newVideo);
  console.log(`✅ Added to videos.json: ${slug}`);
});

// Write updated videos.json
fs.writeFileSync(VIDEOS_JSON_PATH, JSON.stringify(videosData, null, 2));
console.log(`\n✨ Done. Updated ${VIDEOS_JSON_PATH}`);
console.log('📝 Edit videos.json to add titles, themes, and YouTube IDs for new videos.');
