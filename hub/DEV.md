# Hub — Local Dev Guide

## Quick start

```bash
npm install
npm run dev
```

Opens Vite dev server at http://localhost:5173 with all embedded prototypes (RHACS, OSAC, OME, hpux-prototypes) available in iframes.

## Dev scripts

| Command | What it does | When to use |
|---|---|---|
| `npm run dev` | Builds RHACS/OSAC/OME embeds, skips hpux-prototypes if already built, then starts Vite | Normal daily use — fast start once hpux-prototypes is cached |
| `npm run dev:full` | Rebuilds every embed including hpux-prototypes (~90s), then starts Vite | First time setup, or after pulling changes to hpux-prototypes |

## How the "skip if built" logic works

`build:hpux:if-missing` checks whether `public/hpux-prototypes/index.html` exists. If it does, the full webpack build (~60-90s) is skipped. If not, it runs `build:hpux`.

To force a fresh hpux-prototypes build without using `dev:full`, delete the cached output first:

```bash
rm -rf public/hpux-prototypes && npm run dev
```

## Embed build times (approximate)

- `build:rhacs` — ~1s (file copy only)
- `build:osac` — ~20-30s (Vite build)
- `build:ome` — ~20-30s (Vite build)
- `build:hpux` — ~60-90s (Webpack build + npm ci)
