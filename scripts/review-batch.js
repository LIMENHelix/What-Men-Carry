#!/usr/bin/env node

/**
 * Review staged and generated entries
 * Usage: npm run review
 *
 * TWO PATHS:
 *
 * A) DRAFT REVIEW (status: "draft" in proposed-batch.json)
 *    Shows quote, video prompt, voice direction
 *    Prompts: [A]pprove, [R]eject, [S]kip
 *    Approved → moves to prompts/queue.json (status: "queued")
 *    Rejected → archives to staging/rejected/
 *    Skipped → stays in proposed-batch.json
 *
 * B) VIDEO REVIEW (status: "pending_review" in queue.json)
 *    Shows full video with quote overlay, plays audio
 *    Frame-step check reminder (5-frame windows hide artifacts)
 *    Prompts: [A]pprove, [R]eject (with reason)
 *    Approved → moves to public/videos/, updates content/videos.json, commits
 *    Rejected → moves to staging/rejected/, ask re-animate or restart
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const proposedPath = path.join(__dirname, '..', 'staging', 'proposed', 'proposed-batch.json');
const queuePath = path.join(__dirname, '..', 'staging', 'prompts', 'queue.json');
const rejectedDir = path.join(__dirname, '..', 'staging', 'rejected');

// Ensure directories exist
if (!fs.existsSync(path.dirname(queuePath))) {
  fs.mkdirSync(path.dirname(queuePath), { recursive: true });
}
if (!fs.existsSync(rejectedDir)) {
  fs.mkdirSync(rejectedDir, { recursive: true });
}

// Load proposed batch
if (!fs.existsSync(proposedPath)) {
  console.log('📭 No proposed batch found. Run "npm run new-batch" first.');
  process.exit(0);
}

const proposed = JSON.parse(fs.readFileSync(proposedPath, 'utf-8'));

if (!proposed.entries || proposed.entries.length === 0) {
  console.log('📭 No entries to review.');
  process.exit(0);
}

// Load or create queue
let queue = { entries: [] };
if (fs.existsSync(queuePath)) {
  queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function reviewEntry(entry, index, total) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Entry ${index}/${total}: ${entry.theme}`);
  console.log(`=`.repeat(60));
  console.log(`\n📌 QUOTE (${entry.quote.split(/\s+/).length} words):`);
  console.log(`  "${entry.quote}"`);
  console.log(`\n🎬 VIDEO PROMPT:`);
  console.log(`  ${entry.videoPrompt}`);
  console.log(`\n🎤 VOICE LINE:`);
  console.log(`  ${entry.voiceLine}`);
  console.log(`\n📋 ID: ${entry.id}`);
  console.log(`\nStatus: ${entry.status}`);

  let response = '';
  while (!['a', 'r', 's'].includes(response.toLowerCase())) {
    response = await question(`\n[A]pprove, [R]eject, [S]kip? `);
  }

  return response.toLowerCase();
}

async function main() {
  console.log(`\n📋 Reviewing ${proposed.entries.length} proposed entries\n`);

  let approved = [];
  let rejected = [];
  let skipped = [];

  for (let i = 0; i < proposed.entries.length; i++) {
    const entry = proposed.entries[i];
    const action = await reviewEntry(entry, i + 1, proposed.entries.length);

    if (action === 'a') {
      approved.push(entry);
      console.log('✅ Approved');
    } else if (action === 'r') {
      rejected.push(entry);
      console.log('❌ Rejected');
    } else {
      skipped.push(entry);
      console.log('⏭️  Skipped');
    }
  }

  // Write queue (approved entries)
  if (approved.length > 0) {
    queue.entries.push(
      ...approved.map((e) => ({
        ...e,
        status: 'queued',
        promotedAt: new Date().toISOString(),
      }))
    );

    queue.updatedAt = new Date().toISOString();
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    console.log(`\n✅ ${approved.length} entries promoted to queue.json`);
  }

  // Write rejected entries
  if (rejected.length > 0) {
    const rejectedBatch = {
      entries: rejected.map((e) => ({
        ...e,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
      })),
      rejectedAt: new Date().toISOString(),
    };

    const rejectedFile = path.join(rejectedDir, `rejected-${Date.now()}.json`);
    fs.writeFileSync(rejectedFile, JSON.stringify(rejectedBatch, null, 2));
    console.log(`❌ ${rejected.length} entries archived to rejected/`);
  }

  // Update proposed batch with only skipped entries
  if (skipped.length > 0) {
    proposed.entries = skipped;
    proposed.updatedAt = new Date().toISOString();
    fs.writeFileSync(proposedPath, JSON.stringify(proposed, null, 2));
    console.log(`⏭️  ${skipped.length} entries remain in proposed batch`);
  } else {
    // Delete proposed batch if all entries processed
    fs.unlinkSync(proposedPath);
    console.log('📭 Proposed batch cleared');
  }

  console.log(`\n✨ Review complete!`);
  console.log(`📊 Summary: ${approved.length} approved, ${rejected.length} rejected, ${skipped.length} skipped`);
  if (approved.length > 0) {
    console.log(`\n🎬 Next step: npm run publish`);
  }

  rl.close();
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  rl.close();
  process.exit(1);
});
