# What Men Carry

A community for men. Stories about the weight we carry. Mental health through cinematic video.

Built by LIMEN Helix.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Videos

Copy your Grok-generated video files into the `/Desktop/GROK Videos` folder on your computer, then run:

```bash
npm run sync-videos
```

This will:
- Copy new videos to `/public/videos/`
- Generate poster/thumbnail images (if ffmpeg is available)
- Add a stub entry to `/content/videos.json`

### 3. Update Video Metadata

Edit `/content/videos.json` and fill in the `title`, `theme`, and `youtubeId` for each video.

**Example:**

```json
{
  "slug": "she-held-his-hand",
  "file": "she-held-his-hand.mp4",
  "title": "She held his hand. He held the rest.",
  "theme": "responsibility",
  "date": "2026-08-20",
  "youtubeId": "ABC123DEF456"
}
```

**Available themes:** `responsibility`, `fatherhood`, `divorce`, `loss`, `work`, `ptsd`, `recovery`, `other`

### 4. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Deploy

```bash
npm run build
npm start
```

Or push to Vercel:

```bash
git push
```

## File Structure

```
what-men-carry/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home
│   ├── series/page.tsx    # Video library with filters
│   ├── brotherhood/page.tsx
│   ├── talk/page.tsx      # Talk space signup
│   ├── resources/page.tsx  # Crisis resources
│   ├── about/page.tsx
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── VideoCard.tsx      # Single video card
│   └── VideoGrid.tsx      # Video grid with filtering
├── content/
│   ├── videos.json        # Video metadata (title, theme, YouTube ID)
│   └── events.json        # Events/meetups
├── public/
│   └── videos/            # Video files and posters
├── scripts/
│   └── sync-videos.js     # Sync videos from Desktop/GROK Videos
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## Editing Events

To add a meetup, run, or talk space, edit `/content/events.json`:

```json
{
  "id": "example-run-kc",
  "title": "Weekly Thursday Run — Kansas City",
  "type": "run",
  "location": "Kansas City, MO",
  "date": "2026-08-21",
  "time": "6:00 PM",
  "description": "Weekly running group. All paces welcome.",
  "contact": "contact@example.com",
  "rsvp": "https://example.com"
}
```

## Adding a New Video (Workflow)

1. Record or generate video in Grok
2. Save to `Desktop/GROK Videos/`
3. Run `npm run sync-videos`
4. Edit `/content/videos.json`:
   - Change `title` to your one-line story
   - Set `theme` to match the story
   - Add `youtubeId` if uploaded to YouTube
5. Push to git and deploy

## Design Notes

- **Dark, cinematic palette** — near-black backgrounds, muted steel/amber accents
- **Minimal copy** — titles do the emotional work
- **Silent autoplay** — videos muted, loop on scroll-into-view
- **Mobile-first** — most traffic from Instagram/Facebook/YouTube
- **Crisis numbers always visible** — persistent footer link to 988

## SEO & Social Sharing

Each video page includes Open Graph metadata. When shared on Facebook/Twitter/LinkedIn, the poster image and title will appear as a card.

To optimize:
- Keep titles under 100 characters
- Ensure poster images are high-quality (ffmpeg generates them, or add manually)
- Include YouTube video IDs so links to social channels work

## Performance

- Videos lazy-load as you scroll
- Poster images prevent layout shift
- Next.js handles code splitting automatically
- Deploy to Vercel for global CDN

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project into Vercel
3. Set environment variables (if any)
4. Deploy

### Manual

```bash
npm run build
npm start
```

## Support

For questions or issues, contact: `hi@limenhelix.com`

---

**What Men Carry** — Stories $0.99. A community. Real voices.
