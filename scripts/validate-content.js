#!/usr/bin/env node

/**
 * Validate content consistency
 * Runs as part of npm run build
 *
 * Checks:
 * - Every video in videos.json has a matching file in public/videos/
 * - Every audio file is present
 * - Posters exist for each video
 * - No orphaned files in public/videos/
 * - All required fields are present
 *
 * Exits with code 1 if mismatches found (blocks build)
 */

const fs = require('fs');
const path = require('path');

const videosJsonPath = path.join(__dirname, '..', 'content', 'videos.json');
const videosDir = path.join(__dirname, '..', 'public', 'videos');

if (!fs.existsSync(videosJsonPath)) {
  console.log('⚠️  videos.json not found (OK if no videos yet)');
  process.exit(0);
}

const videosData = JSON.parse(fs.readFileSync(videosJsonPath, 'utf-8'));
const videos = videosData.videos || [];

if (videos.length === 0) {
  console.log('✓ No videos to validate (videos.json is empty)');
  process.exit(0);
}

console.log(`\n🔍 Validating ${videos.length} video(s)...\n`);

let errors = [];

// Get all files in videos directory
const videoFiles = fs.existsSync(videosDir)
  ? fs.readdirSync(videosDir)
  : [];

// Check each video in videos.json
for (const video of videos) {
  const videoPath = path.join(videosDir, video.file);
  const audioPath = video.audio ? path.join(videosDir, video.audio) : null;

  // Check required fields
  if (!video.slug || !video.file || !video.quote || !video.theme) {
    errors.push(`❌ Video missing required fields: ${JSON.stringify(video)}`);
  }

  // Check video file exists
  if (!fs.existsSync(videoPath)) {
    errors.push(`❌ Video file not found: ${video.file}`);
  }

  // Check audio file if specified
  if (audioPath && !fs.existsSync(audioPath)) {
    errors.push(`❌ Audio file not found: ${video.audio}`);
  }

  // Check poster exists (or note if missing)
  const posterPath = path.join(videosDir, `${video.slug}-poster.jpg`);
  if (!fs.existsSync(posterPath)) {
    console.warn(`⚠️  Poster missing: ${video.slug}-poster.jpg (will load client-side)`);
  }
}

// Check for orphaned files
const expectedFiles = new Set();
for (const video of videos) {
  expectedFiles.add(video.file);
  if (video.audio) {
    expectedFiles.add(video.audio);
  }
  expectedFiles.add(`${video.slug}-poster.jpg`);
}

for (const file of videoFiles) {
  if (!expectedFiles.has(file)) {
    console.warn(`⚠️  Orphaned file: ${file} (not referenced in videos.json)`);
  }
}

if (errors.length > 0) {
  console.error('\n❌ VALIDATION FAILED\n');
  errors.forEach((e) => console.error(e));
  console.error('\n🔧 Fix the errors above before deploying');
  process.exit(1);
}

console.log('✅ All videos validated successfully\n');
process.exit(0);
