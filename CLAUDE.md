# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Praseeda P Rao's personal link hub — a standalone Next.js site with iOS 26-inspired liquid glass UI. Deployed as a subdomain (e.g., `praseeda.circle13.space`) on Vercel. Forked from the Circle13 team hub template.

## Commands

- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run start` — Run production server
- `npm run lint` — ESLint (next/core-web-vitals + TypeScript)

No test framework is configured.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, Framer Motion, vanilla-tilt.js

**Data flow — GitHub as CMS:**
1. Praseeda's profile data lives in `src/data/praseeda.ts`
2. `src/data/team.ts` is the registry that imports and exports members
3. `src/lib/data.ts` provides runtime access (`getMember`, `getAllMembers`) and GitHub API helpers (`saveMemberToGitHub`)
4. Admin saves → POST `/api/members` (PIN-authenticated) → commits to GitHub → Vercel auto-rebuilds

**Routing:**
- `/` redirects to `/praseeda`
- `/[slug]` — Public profile page (server component, `force-dynamic`)
- `/admin` — PIN-protected admin home
- `/admin/[slug]` — Member editor with drag-and-drop link reordering (@dnd-kit)
- `/api/members` — GET/POST API for member data

**Theming system (`src/lib/themes.ts`):**
- 7 themes (noir, midnight, ember, forest, royal, ivory, monochrome) defined as CSS custom property sets
- Applied via `ThemeProvider` component using inline style variables
- Praseeda's site uses the "royal" (purple/violet) theme

**Liquid glass UI (`src/app/globals.css`):**
- 3-layer technique: SVG displacement filter (`LiquidGlassFilter` component) + inset box-shadows + vanilla-tilt 3D glare
- `GlassCard` component wraps all interactive cards with tilt, haptic tap sound, and glass styling
- Materialize keyframe animation sequences profile elements on load with staggered delays

**Key patterns:**
- Server components by default; client components only for interactivity (tilt, animations, admin forms)
- Path alias: `@/*` maps to `src/*`
- Icons: custom brand SVGs in `src/lib/icons.tsx` with Lucide React fallback
- Fonts: local Satoshi WOFF2 files loaded in `src/lib/fonts.ts` via `--font-body` CSS variable
- Haptic tap sound: white noise burst via Web Audio API (`src/lib/sound.ts`)
- Photos go in `public/images/team/` — expects `praseeda.jpeg` and `praseeda-cover.jpeg`

## Environment Variables

```
GITHUB_TOKEN    # Required for admin saves to GitHub
GITHUB_REPO     # Default: nbharath1306/Praseeda-Cygnal-Circle13
GITHUB_BRANCH   # Default: main
ADMIN_PIN       # Required for admin API authentication
```
