# What Men Carry — Content Generation Workflow

This document describes the complete workflow for generating, reviewing, and publishing What Men Carry video quotes and content.

## Overview

The pipeline has three stages:

1. **GENERATION** — AI-assisted draft creation from dossiers
2. **REVIEW** — Human approval gate (required; nothing auto-publishes)
3. **PUBLISHING** — Video generation, staging, and deployment to production

All stages maintain strict separation between working directories (staging) and production directories (public/content).

---

## Stage 1: Generation (`npm run new-batch`)

### Input
- Theme (one of 12 dossiers)
- Count (1–5 entries per batch)

### Process

```bash
npm run new-batch -- --theme suicide --count 3
```

This script:
1. Reads the theme dossier (e.g., `/dossiers/suicide.md`)
2. Reads `/craft/quote-rules.md` (the 5-point quote standard)
3. Reads `/craft/video-style.md` (the visual grammar)
4. Calls the xAI chat API (Grok model) with these as context
5. Requests N unique quotes + video prompts + voice directions
6. Validates each quote against the 5-gate standard
7. Filters for kill-list words
8. For suicide dossier: ensures quotes land on "still-here"
9. Writes validated entries to `/staging/proposed/proposed-batch.json` with status: "draft"

### Output

`staging/proposed/proposed-batch.json`:
```json
{
  "entries": [
    {
      "id": "suicide-1725123456-abc123",
      "theme": "suicide",
      "quote": "He decides to stay.",
      "videoPrompt": "A man's hands on a kitchen table at midnight...",
      "voiceLine": "Slow, quiet, flat-calm: 'He decides to stay.'",
      "status": "draft",
      "generatedAt": "2026-08-22T..."
    }
  ],
  "generatedAt": "2026-08-22T..."
}
```

### Safeguards

- Batch size capped at 5 (cost control)
- Kill-list words auto-rejected
- Quote length validated (≤14 words)
- Suicide safety rule enforced
- No direct issue naming allowed
- All quotes must be original and pass 5 gates

---

## Stage 2: Review (`npm run review`)

### Input
`staging/proposed/proposed-batch.json` (drafts to review)

### Process

```bash
npm run review
```

This script:
1. Loads proposed batch
2. Displays each entry: quote, video prompt, voice direction
3. Prompts YOU: [A]pprove, [R]eject, [S]kip
4. For APPROVED: moves to `staging/prompts/queue.json` with status: "queued"
5. For REJECTED: archives to `staging/rejected/<timestamp>.json` for analysis
6. For SKIPPED: leaves in proposed batch for later review

### Output

**Approved entries** → `staging/prompts/queue.json`:
```json
{
  "entries": [
    {
      "id": "suicide-...",
      "theme": "suicide",
      "quote": "He decides to stay.",
      "videoPrompt": "...",
      "voiceLine": "...",
      "status": "queued",
      "promotedAt": "2026-08-22T..."
    }
  ]
}
```

**Rejected entries** → `staging/rejected/rejected-<timestamp>.json`

### Safeguards

- **NOTHING goes live without human approval.** This gate is non-negotiable.
- Rejected entries are archived for analysis; failed themes show patterns.
- Skipped entries remain for later review; no entry is lost.

---

## Stage 3: Publishing (Post-Video Generation)

**NOTE:** This stage is implemented but requires Phase 1 (xAI video generation) to complete first.

After videos are generated and staged in `staging/videos/`, the publish workflow:

```bash
npm run publish
```

This script:
1. Reads `staging/prompts/queue.json` (queued entries)
2. For each entry:
   - Verifies video file exists: `staging/videos/<slug>.mp4`
   - Verifies audio file exists: `staging/videos/<slug>.mp3`
   - Verifies poster exists: `staging/videos/<slug>-poster.jpg`
3. Copies files to production: `public/videos/`
4. Adds entry to `content/videos.json`
5. Commits with message: `Add video: <slug>`
6. Pushes to origin main (triggers Vercel deploy)
7. Waits for deploy, verifies HTTP 200 on new video files

### Output

**Production** — `content/videos.json`:
```json
{
  "videos": [
    {
      "slug": "he-decides-to-stay",
      "file": "he-decides-to-stay.mp4",
      "quote": "He decides to stay.",
      "audio": "he-decides-to-stay.mp3",
      "theme": "suicide",
      "date": "2026-08-22",
      "youtubeId": ""
    }
  ]
}
```

**Production files**:
- `public/videos/he-decides-to-stay.mp4`
- `public/videos/he-decides-to-stay.mp3`
- `public/videos/he-decides-to-stay-poster.jpg`

### Safeguards

- All files must exist before promotion
- Duplicate slugs are detected and rejected
- Every file move is logged
- Git commits are atomic per video
- Deploy verification confirms HTTP 200 before marking success

---

## Validation (`npm run validate`)

Runs as part of `npm run build` (pre-deployment).

Checks:
- Every entry in `content/videos.json` has matching files in `public/videos/`
- All audio files referenced exist
- All posters exist (or notes they'll load client-side)
- No orphaned files in `public/videos/`
- No required fields are missing

**If validation fails, the build exits with code 1 and deployment is blocked.**

---

## Directory Structure

```
what-men-carry/
├── content-engine/
│   ├── dossiers/
│   │   ├── suicide.md
│   │   ├── ptsd-veterans.md
│   │   ├── depression.md
│   │   ├── divorce.md
│   │   ├── custody-family-court.md
│   │   ├── fatherhood.md
│   │   ├── work-provider-stress.md
│   │   ├── financial-strain.md
│   │   ├── alcoholism-addiction.md
│   │   ├── loneliness-isolation.md
│   │   ├── physical-decline.md
│   │   └── grief-loss.md
│   ├── craft/
│   │   ├── quote-rules.md
│   │   └── video-style.md
│   └── WORKFLOW.md (this file)
├── scripts/
│   ├── generate-batch.js      # Stage 1: draft generation
│   ├── review-batch.js         # Stage 2: human review
│   ├── publish-batch.js        # Stage 3: production deployment
│   ├── validate-content.js     # Runs during build
│   ├── generate-audio.js       # TTS voice generation (existing)
│   └── sync-videos.js          # Video file sync from desktop (existing)
├── staging/
│   ├── proposed/               # Drafts awaiting review
│   │   └── proposed-batch.json
│   ├── prompts/                # Queued entries (private, gitignored)
│   │   └── queue.json
│   ├── videos/                 # Generated video files (private, gitignored)
│   ├── audio/                  # Generated audio files (private, gitignored)
│   ├── rejected/               # Archived rejected entries (private, gitignored)
│   └── social/                 # Vertical variants for social (for future)
├── content/
│   └── videos.json             # Production metadata (source of truth for site)
├── public/
│   └── videos/                 # Production video files (deployed with site)
└── components/
    └── VideoCard.tsx           # Renders videos from content/videos.json
```

---

## Cost Model

**Per batch (3–5 entries):**
- xAI Grok API call: ~$0.05 (input + output tokens)
- TTS audio generation (if run): ~$0.01 per entry = $0.03–$0.05
- **Total per batch: ~$0.05–$0.10**

**Monthly (assuming 8 batches/month):**
- ~$0.40–$0.80 for draft generation
- ~$0.24–$0.40 for audio generation
- **Total: ~$0.64–$1.20/month**

---

## Workflow Example

```bash
# 1. Generate 3 drafts for suicide theme
npm run new-batch -- --theme suicide --count 3
# Writes to staging/proposed/proposed-batch.json

# 2. Review and approve/reject
npm run review
# Approved entries move to staging/prompts/queue.json
# Rejected entries archived
# Skipped entries remain in proposed batch

# 3. [After Phase 1: Video generation runs, outputs to staging/videos/]

# 4. Publish approved entries to production
npm run publish
# Copies files from staging/ to public/videos/
# Updates content/videos.json
# Commits and pushes main branch
# Vercel deploys

# 5. Validation runs on build
npm run build
# Pre-build: npm run validate checks for mismatches
# Build fails if any inconsistencies found
```

---

## Rollback

If a published video needs to be removed:

1. Edit `content/videos.json` to remove the entry
2. Delete the files: `public/videos/<slug>.*`
3. Commit: `git commit -am "Remove video: <slug> (reason)"`
4. Push: `git push origin main`

---

## Future Extensions

- **Social variants:** Generate 9:16 vertical variants for Instagram/TikTok
- **Auto-social posting:** Automatically post to YouTube Shorts, Instagram Reels
- **A/B testing:** Measure quote performance before wide release
- **Bulk generation:** Run generation across multiple themes in parallel
- **Analytics:** Track view counts, engagement by theme
