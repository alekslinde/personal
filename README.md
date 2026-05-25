# Aleks Linde — Portfolio

A single-page portfolio built with Astro featuring dual "human" and "robot" modes with interactive visual effects.

## Setup

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Push this repo to GitHub as `aleks-linde.github.io` (for root domain) or any repo name
2. Go to **Settings → Pages → Source** and select **GitHub Actions**
3. Push to `main` — the workflow handles the rest

If deploying to a sub-path (e.g. `github.com/alekslinde/portfolio`), update `astro.config.mjs`:
```js
base: '/portfolio',
```

## Content

All text content lives in `src/content.ts` under the `COPY` object:

```ts
export const COPY = {
  human: { /* human-readable version */ },
  robot: { /* robot/encoded version */ }
}
```

Edit the `human` and `robot` objects to update:
- `tagline` — biography text
- `projectsLabel` — section heading
- `projects` — array of project objects (name, description, URL, optional WIP flag)
- `contact` — labels for email, LinkedIn, GitHub links
- `footerNote` — copyright text

The UI will automatically reflect changes in both modes.

## Architecture

**Pages**
- `src/pages/index.astro` — Main page with mode switcher and content layout

**Components**
- `Name.astro` — Name header with animated cursor
- `Tagline.astro` — Biography text
- `Projects.astro` — Project list with links
- `Contact.astro` — Contact links with obfuscation toggles
- `ModeSwitcher.astro` — Mode toggle button
- `Base.astro` — HTML shell + SEO tags

**Logic & Utilities**
- `ModeController.ts` — State management for human/robot mode toggle
- `RobotAnimation.ts` — Text encoding/decoding for robot mode
- `PixelRain.ts` — Pixel rain visual effect (optional)
- `PixelRipple.ts` — Ripple animation effect (optional)

**Content**
- `content.ts` — All copy and project data (COPY object + types)
- `styles/global.css` — All styles and CSS tokens
