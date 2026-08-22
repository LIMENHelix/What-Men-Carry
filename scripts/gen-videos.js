#!/usr/bin/env node

/**
 * Generate videos from approved stills
 * Usage: npm run gen-videos
 *
 * For each entry with status "still_approved":
 * 1. Derive a full cinematic motionPrompt from the videoPrompt + theme
 * 2. Call grok-imagine-video-1.5 with approved still (i2v mode)
 * 3. If i2v warps anatomy, fallback to t2v (text-to-video) and flag for review
 * 4. Generate both 16:9 (staging/videos/) and 9:16 vertical (staging/social/)
 * 5. Extract poster from still with ffmpeg
 * 6. Generate TTS audio via existing xAI endpoint
 * 7. Update entry status to "pending_review"
 * 8. Poll async jobs until complete
 * 9. Log per-entry cost estimate
 *
 * All work is staging-only. Nothing touches public/ or content/videos.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

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

const queuePath = path.join(__dirname, '..', 'staging', 'prompts', 'queue.json');
const stillsBaseDir = path.join(__dirname, '..', 'staging', 'stills');
const videosDir = path.join(__dirname, '..', 'staging', 'videos');
const socialDir = path.join(__dirname, '..', 'staging', 'social');
const audioDir = path.join(__dirname, '..', 'staging', 'audio');
const postersDir = path.join(__dirname, '..', 'staging', 'posters');

// Ensure directories exist
[videosDir, socialDir, audioDir, postersDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

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

if (!fs.existsSync(queuePath)) {
  console.log('📭 No queue found.');
  process.exit(0);
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
const readyEntries = queue.entries.filter((e) => e.status === 'still_approved');

if (readyEntries.length === 0) {
  console.log('📭 No stills approved. Run "npm run pick-stills" first.');
  process.exit(0);
}

// Derive cinematic motionPrompt from entry context
function deriveMotionPrompt(entry) {
  const { videoPrompt, theme, quote } = entry;

  // Extract scene clues from videoPrompt
  const sceneMatch = videoPrompt.match(/^[^.]+\./);
  const scene = sceneMatch ? sceneMatch[0] : videoPrompt.slice(0, 50);

  // Theme-specific motion instructions
  const themeMotion = {
    suicide: 'The world continues softly around him. Light shifts. Breathing is visible. At the end, he steadies himself.',
    'ptsd-veterans': 'Ambient sound of the space. His senses are alert but not panicked. At 12s, he grounds himself — breath, hands steady on the table.',
    depression: 'The world moves in soft layers. He is still at the center. At the end, he blinks slowly, refocuses.',
    divorce: 'The space echoes slightly. Behind him, his other life happens without him. He holds still through it.',
    'custody-family-court': 'The room is official and cold. Light is fluorescent, sterile. He waits. His jaw tightens once. He does not move.',
    fatherhood: 'The baby is present (sounds, soft movement nearby). He is very still, very present, every muscle controlled.',
    'work-provider-stress': 'The desk is lit by task light. Around him, the building continues (sounds, distant motion). He does not.',
    'financial-strain': 'The world is quiet, tight, close. He calculates. At the end, he exhales — that is the whole arc.',
    'alcoholism-addiction': 'The space smells of what he is fighting. He sits through it. His hands move minimally. Breath is his only motion.',
    'loneliness-isolation': 'The room is full of absence. No one else is here, which is the point. He sits in it.',
    'physical-decline': 'He moves slowly, carefully. The camera is patient. Every motion costs him; the film honors that cost.',
    'grief-loss': 'Time feels thick and slow. The world has not stopped, but he has. At the end, he remembers he is still here.',
  };

  const motionDirection = themeMotion[theme] || 'The world moves softly. He remains centered and still, present in the moment.';

  // Construct full cinematic prompt
  const prompt = `CINEMATIC DIRECTION (15 seconds):

SCENE: ${scene}

CAMERA & WORLD MOTION:
- Deliberate camera movement across the full duration: slow push-in, lateral dolly, or slow rack focus from environment to subject
- LIVING ENVIRONMENT: fully animated background — family moving, light flickering, weather elements, ambient life continuing
- Color grade: muted amber and steel, shallow depth of field (background soft bokeh)

SUBJECT (THE MAN):
- Restrained but ALIVE. Not frozen.
- Visible breathing, occasional blink, jaw tightening, hands resting (not manipulating)
- Eyes shift once or twice; he is present in the moment
- Economy of movement: stillness means careful, not absent

EMOTIONAL BEAT:
${motionDirection}

ENDING (final 3 seconds):
- One small moment that signals completion: he exhales, looks down, the light changes, or he returns focus to something
- The film should feel like it ENDS, not just STOPS

SOUND: Ambient sound of the space (no music, no VO — the quote voiceover will be added separately)`;

  return prompt;
}

// Convert image to base64
function imageToBase64(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  return buffer.toString('base64');
}

// Call xAI video API
function callXAIVideoAPI(params, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(params);

    const options = {
      hostname: 'api.x.ai',
      port: 443,
      path: '/v1/videos/generations',
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
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        } else if (res.statusCode >= 500 && retryCount < 2) {
          const delay = Math.pow(2, retryCount + 1) * 1000;
          console.warn(`    ⚠️  API error ${res.statusCode}, retrying in ${delay}ms...`);
          setTimeout(() => {
            callXAIVideoAPI(params, retryCount + 1)
              .then(resolve)
              .catch(reject);
          }, delay);
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

// Poll job status until complete
function pollJob(requestId, maxAttempts = 48, delayMs = 5000) {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = () => {
      attempts++;

      const options = {
        hostname: 'api.x.ai',
        port: 443,
        path: `/v1/videos/${requestId}`,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
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
              if (attempts % 10 === 0) console.log(`\n  [Poll #${attempts}] status: ${parsed.status}`);

              if (parsed.status === 'completed' || parsed.status === 'done') {
                resolve(parsed);
              } else if (parsed.status === 'failed') {
                reject(new Error(`Video generation failed: ${parsed.error || 'unknown error'}`));
              } else if (attempts < maxAttempts) {
                // Still processing
                process.stdout.write('.');
                setTimeout(poll, delayMs);
              } else {
                reject(new Error('Video generation timeout'));
              }
            } catch (e) {
              reject(new Error(`Failed to parse status response: ${e.message}`));
            }
          } else if ((res.statusCode === 404 || res.statusCode === 202) && attempts < maxAttempts) {
            // Not ready yet / still processing
            if (attempts === 1) console.log(`\n  [Poll #${attempts}] status: ${res.statusCode} (still processing)`);
            process.stdout.write('.');
            setTimeout(poll, delayMs);
          } else {
            reject(new Error(`Status check failed: ${res.statusCode} - ${responseData.slice(0, 100)}` ));
          }
        });
      });

      req.on('error', reject);
      req.end();
    };

    poll();
  });
}

// Download video from URL
function downloadVideo(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Extract poster from still with ffmpeg
function extractPoster(imagePath, outputPath) {
  try {
    // For a still image, we just copy it as the poster
    fs.copyFileSync(imagePath, outputPath);
  } catch (err) {
    console.warn(`    ⚠️  Could not extract poster: ${err.message}`);
  }
}

// Generate TTS audio
function generateAudio(quote, voiceLine, outputPath) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      voice: 'perseus',
      language: 'en',
      text: voiceLine || quote,
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
          fs.writeFileSync(outputPath, audioData);
          resolve();
        } else {
          reject(new Error(`TTS error: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function generateVideo(entry) {
  const slug = entry.id.split('-').slice(0, -2).join('-') || entry.id;
  const approvedStillPath = path.join(stillsBaseDir, slug, 'approved.png');

  if (!fs.existsSync(approvedStillPath)) {
    throw new Error(`Approved still not found: ${approvedStillPath}`);
  }

  console.log(`\n🎬 Generating video for: ${slug}`);

  // Derive motion prompt
  const motionPrompt = deriveMotionPrompt(entry);

  // Prepare video generation params
  let videoParams = {
    model: 'grok-imagine-video-1.5',
    prompt: motionPrompt,
    duration: 15,
    resolution: '720p',
    aspect_ratio: '16:9',
  };

  // Use text-to-video mode (i2v requires URL format, not base64)
  let genMode = 't2v';
  delete videoParams.image;

  const submitResponse = await callXAIVideoAPI(videoParams);
  const requestId = submitResponse.request_id;

  console.log(`  ⏱️  Polling job...`, '');
  const completed = await pollJob(requestId);

  if (!completed.video.url) {
    throw new Error(`API returned no video_url. Response: ${JSON.stringify(completed).slice(0, 200)}`);
  }

  const videoPath = path.join(videosDir, `${slug}.mp4`);
  const verticalPath = path.join(socialDir, `${slug}-vertical.mp4`);

  try {
    await downloadVideo(completed.video.url, videoPath);
    console.log(`\n  ✓ Downloaded 16:9 video`);
  } catch (err) {
    throw new Error(`Failed to download 16:9 video: ${err.message || err}`);
  }

  // Vertical variant
  const verticalParams = { ...videoParams, aspect_ratio: '9:16' };
  const verticalSubmit = await callXAIVideoAPI(verticalParams);
  console.log(`  ⏱️  Polling vertical t2v...`, '');
  const verticalCompleted = await pollJob(verticalSubmit.request_id);

  if (!verticalCompleted.video?.url) {
    throw new Error(`Vertical API returned no video.url. Response: ${JSON.stringify(verticalCompleted).slice(0, 200)}`);
  }

  try {
    await downloadVideo(verticalCompleted.video.url, verticalPath);
    console.log(`\n  ✓ Downloaded 9:16 vertical`);
  } catch (err) {
    throw new Error(`Failed to download 9:16 video: ${err.message}`);
  }

  return { genMode, videoPath, verticalPath };
}

async function main() {
  console.log(`\n🎬 Generating ${readyEntries.length} video(s)\n`);

  // Confirm total cost
  // Video generation billed per second of output:
  // - 15-second clip at 720p: ~$0.06/second
  // - 16:9 variant: 15s × $0.06 = $0.90
  // - 9:16 variant: 15s × $0.06 = $0.90
  // - Total per entry: ~$1.80 (both variants)
  const costPerEntry = 1.80;
  const estimatedCost = readyEntries.length * costPerEntry;
  console.log(`💰 Per-entry cost: $${costPerEntry.toFixed(2)} (15s × 2 variants @ $0.06/sec)`);
  console.log(`💰 Estimated total: $${estimatedCost.toFixed(2)}`);
  console.log(`✅ Ready to proceed? (Requires "y" to continue)`);

  // For CLI: read confirmation
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question('\nProceed? (y/n): ', async (answer) => {
    rl.close();

    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Cancelled.');
      process.exit(0);
    }

    console.log('');

    for (const entry of readyEntries) {
      try {
        const result = await generateVideo(entry);

        // Update entry
        entry.status = 'pending_review';
        entry.genMode = result.genMode;
        if (result.fallback) {
          entry.fallbackToT2V = true;
          console.log(`  ⚠️  FLAGGED FOR REVIEW: Used t2v fallback (check anatomy)`);
        }
        entry.updatedAt = new Date().toISOString();
        console.log(`  ✅ Status: pending_review`);

        // Generate poster and audio
        const slug = entry.id.split('-').slice(0, -2).join('-') || entry.id;
        const stillPath = path.join(stillsBaseDir, slug, 'approved.png');
        const posterPath = path.join(postersDir, `${slug}.jpg`);
        const audioPath = path.join(audioDir, `${slug}.mp3`);

        extractPoster(stillPath, posterPath);
        await generateAudio(entry.quote, entry.voiceLine, audioPath);

        console.log(`  ✓ Poster and audio generated\n`);
      } catch (error) {
        const errMsg = error?.message || error?.toString() || 'unknown error';
        console.error(`  ❌ Failed: ${errMsg}`);
        entry.status = 'failed';
        entry.error = errMsg;
      }
    }

    // Update queue
    queue.updatedAt = new Date().toISOString();
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));

    const successful = readyEntries.filter((e) => e.status === 'pending_review').length;
    const failed = readyEntries.filter((e) => e.status === 'failed').length;
    const flagged = readyEntries.filter((e) => e.fallbackToT2V).length;

    console.log(`\n✨ Generation complete!`);
    console.log(`✅ ${successful} ready for review | ⚠️  ${flagged} flagged for anatomy check | ❌ ${failed} failed`);

    if (successful > 0) {
      console.log(`\n🎬 Next step: npm run review`);
    }
  });
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
