#!/usr/bin/env node

/**
 * Interactive still selection
 * Usage: npm run pick-stills
 *
 * For each entry with status "stills_ready":
 * 1. Display 4 candidate images (paths listed)
 * 2. Prompt to pick 1-4 or reject all
 * 3. Pick → candidate copied to approved.png, status "still_approved"
 * 4. Reject → status back to "queued" with option to edit videoPrompt
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const queuePath = path.join(__dirname, '..', 'staging', 'prompts', 'queue.json');
const stillsBaseDir = path.join(__dirname, '..', 'staging', 'stills');

if (!fs.existsSync(queuePath)) {
  console.log('📭 No queue found.');
  process.exit(0);
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
const readyEntries = queue.entries.filter((e) => e.status === 'stills_ready');

if (readyEntries.length === 0) {
  console.log('📭 No stills ready. Run "npm run gen-stills" first.');
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function pickStill(entry, index, total) {
  const slug = entry.id.split('-').slice(0, -2).join('-') || entry.id;
  const stillDir = path.join(stillsBaseDir, slug);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Still ${index}/${total}: ${slug}`);
  console.log(`=`.repeat(60));
  console.log(`\n📌 Quote: "${entry.quote}"`);
  console.log(`📝 VideoPrompt: ${entry.videoPrompt.slice(0, 80)}...`);

  // Check which candidates exist
  const candidates = [];
  for (let i = 1; i <= 4; i++) {
    const candidatePath = path.join(stillDir, `candidate-${i}.png`);
    if (fs.existsSync(candidatePath)) {
      candidates.push(i);
    }
  }

  console.log(`\n🖼️  Candidates available: ${candidates.join(', ')}`);
  console.log(`📂 Location: ${stillDir}`);

  let response = '';
  while (!['1', '2', '3', '4', 'r'].includes(response)) {
    response = await question(`\nPick candidate [1-4] or [R]eject all? `);
  }

  if (response === 'r') {
    console.log(`\nRegenerate this still? (y/n)`);
    const regen = await question('> ');

    if (regen.toLowerCase() === 'y') {
      entry.status = 'queued';
      console.log('⏭️  Returned to queued for regeneration');
    } else {
      console.log('❓ Status: stills_ready (pick later)');
    }
    return;
  }

  // Copy selected candidate to approved.png
  const candidateNum = parseInt(response, 10);
  const candidatePath = path.join(stillDir, `candidate-${candidateNum}.png`);
  const approvedPath = path.join(stillDir, 'approved.png');

  fs.copyFileSync(candidatePath, approvedPath);
  entry.status = 'still_approved';
  entry.pickedCandidate = candidateNum;
  entry.updatedAt = new Date().toISOString();

  console.log(`✅ Picked candidate ${candidateNum}`);
  console.log(`📂 Saved to: ${approvedPath}`);
}

async function main() {
  console.log(`\n🖼️  Picking stills for ${readyEntries.length} entry(ies)\n`);
  console.log(`📍 Open this directory in an image viewer to see candidates:`);
  console.log(`   ${stillsBaseDir}\n`);
  console.log(`Then return here and select candidates interactively.\n`);

  for (let i = 0; i < readyEntries.length; i++) {
    const entry = readyEntries[i];
    await pickStill(entry, i + 1, readyEntries.length);
  }

  // Update queue
  queue.updatedAt = new Date().toISOString();
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));

  const approved = readyEntries.filter((e) => e.status === 'still_approved').length;
  const queued = readyEntries.filter((e) => e.status === 'queued').length;
  const ready = readyEntries.filter((e) => e.status === 'stills_ready').length;

  console.log(`\n✨ Done!`);
  console.log(`✅ ${approved} approved | ⏭️  ${queued} requeued | ⏸️  ${ready} skipped`);

  if (approved > 0) {
    console.log(`\n🎬 Next step: npm run gen-videos`);
  }

  rl.close();
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  rl.close();
  process.exit(1);
});
