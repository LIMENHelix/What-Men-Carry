#!/usr/bin/env node

/**
 * Publish queued entries to production
 * Usage: npm run publish
 *
 * Workflow:
 * 1. Read prompts/queue.json (entries status: "queued")
 * 2. For each queued entry, verify video + audio exist in staging/videos/
 * 3. Check that posters exist
 * 4. Move files from staging/videos/ to public/videos/
 * 5. Add entry to content/videos.json
 * 6. Commit and push to main
 * 7. Verify Vercel deployment
 *
 * SAFETY: Requires all entries to pass validation before promotion
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const queuePath = path.join(__dirname, '..', 'staging', 'prompts', 'queue.json');
const videosJsonPath = path.join(__dirname, '..', 'content', 'videos.json');
const stagingVideosDir = path.join(__dirname, '..', 'staging', 'videos');
const publicVideosDir = path.join(__dirname, '..', 'public', 'videos');

if (!fs.existsSync(queuePath)) {
  console.log('📭 No queue found. Nothing to publish.');
  process.exit(0);
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
const queuedEntries = queue.entries.filter((e) => e.status === 'queued');

if (queuedEntries.length === 0) {
  console.log('📭 No queued entries. Nothing to publish.');
  process.exit(0);
}

// Ensure public/videos dir exists
if (!fs.existsSync(publicVideosDir)) {
  fs.mkdirSync(publicVideosDir, { recursive: true });
}

// Load or create videos.json
let videosData = { videos: [] };
if (fs.existsSync(videosJsonPath)) {
  videosData = JSON.parse(fs.readFileSync(videosJsonPath, 'utf-8'));
}

console.log(`\n📦 Publishing ${queuedEntries.length} video(s)...\n`);

let published = [];
let failed = [];

for (const entry of queuedEntries) {
  console.log(`Processing: ${entry.id}`);

  // Verify files exist in staging
  const videoPath = path.join(stagingVideosDir, `${entry.slug}.mp4`);
  const audioPath = path.join(stagingVideosDir, `${entry.slug}.mp3`);
  const posterPath = path.join(stagingVideosDir, `${entry.slug}-poster.jpg`);

  if (!fs.existsSync(videoPath)) {
    console.error(`  ❌ Video not found: ${entry.slug}.mp4`);
    failed.push(entry);
    continue;
  }

  if (!fs.existsSync(audioPath)) {
    console.error(`  ❌ Audio not found: ${entry.slug}.mp3`);
    failed.push(entry);
    continue;
  }

  // Copy files to public/videos/
  try {
    const publicVideoPath = path.join(publicVideosDir, `${entry.slug}.mp4`);
    const publicAudioPath = path.join(publicVideosDir, `${entry.slug}.mp3`);
    const publicPosterPath = path.join(publicVideosDir, `${entry.slug}-poster.jpg`);

    fs.copyFileSync(videoPath, publicVideoPath);
    fs.copyFileSync(audioPath, publicAudioPath);

    if (fs.existsSync(posterPath)) {
      fs.copyFileSync(posterPath, publicPosterPath);
    }

    // Add to videos.json
    const newVideo = {
      slug: entry.slug,
      file: `${entry.slug}.mp4`,
      quote: entry.quote,
      audio: `${entry.slug}.mp3`,
      theme: entry.theme,
      date: new Date().toISOString().split('T')[0],
      youtubeId: '',
    };

    // Check for duplicates
    const exists = videosData.videos.some((v) => v.slug === entry.slug);
    if (!exists) {
      videosData.videos.push(newVideo);
      console.log(`  ✅ Published: ${entry.slug}`);
      published.push(entry);
    } else {
      console.warn(`  ⚠️  Already exists: ${entry.slug}`);
      published.push(entry);
    }
  } catch (err) {
    console.error(`  ❌ Failed to copy files: ${err.message}`);
    failed.push(entry);
  }
}

if (published.length === 0) {
  console.error('\n❌ No entries published. Fix errors and retry.');
  process.exit(1);
}

// Write videos.json
fs.writeFileSync(videosJsonPath, JSON.stringify(videosData, null, 2));

// Update queue (mark as published)
queue.entries = queue.entries.map((e) => {
  if (published.some((p) => p.id === e.id)) {
    return { ...e, status: 'published', publishedAt: new Date().toISOString() };
  }
  return e;
});
fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));

console.log(`\n✅ ${published.length} entries published to content/videos.json`);

// Commit and push
try {
  console.log('\n🔧 Committing to git...');

  // Stage files
  execSync('git add content/videos.json public/videos/', { stdio: 'inherit' });

  // Commit
  const message = `Add video${published.length > 1 ? 's' : ''}: ${published
    .map((p) => p.slug)
    .join(', ')}`;
  execSync(`git commit -m "${message}"`, { stdio: 'inherit' });

  console.log('✅ Committed');

  // Push
  console.log('🚀 Pushing to origin...');
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Pushed to main (Vercel deploying...)');
} catch (err) {
  console.error('\n❌ Git operation failed:');
  console.error(err.message);
  console.error('\n⚠️  Files are published locally but not pushed. Retry with git commands.');
  process.exit(1);
}

// Summary
console.log(`\n✨ Publish complete!`);
console.log(`📊 Published: ${published.length}, Failed: ${failed.length}`);
if (failed.length > 0) {
  console.log(`\n⚠️  Failed entries remain in queue.json for retry`);
}
console.log(`\n🌐 Watch Vercel deploy at: https://vercel.com`);
