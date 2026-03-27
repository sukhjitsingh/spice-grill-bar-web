# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for **Spice Grill & Bar**, a restaurant in Ash Fork, Arizona on Route 66/I-40 Exit 146. The project is an **Astro 5** static site. The primary technical goals are local SEO (GEO), AI/Answer Engine Optimization (AEO), and Lighthouse performance scores.

## Common Commands

```bash
npm run dev           # Start dev server at http://localhost:4321
npm run build         # Build to ./dist/ (also copies sitemap-index.xml → sitemap.xml)
npm run preview       # Preview production build locally
npm run lint          # ESLint on .js/.ts/.astro files
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format all files with Prettier
npm run typecheck     # TypeScript + Astro type checking
npm run test:aeo      # Voice/answer engine optimization audit
npm run test:lhci     # Lighthouse CI (performance, accessibility, SEO)
npm run test:quality  # lint + knip + typecheck + AEO audit combined
npm run qa            # Full QA: build + test:quality + test:lhci (runs on pre-push hook)
```

## Architecture

### Framework Split: Astro + React

The codebase deliberately splits between two component types:

- **Astro components** (`.astro`) — Server-rendered, zero JS by default. Used for all layout, content sections, schema markup, and static page structure.
- **React components** (`.tsx`) — Used only for interactive UI. Hydrated with `client:visible` (MenuSection) or `client:load` (Header). React components live alongside Astro components in `/src/components/`.

### Routing & Pages

File-based routing via `/src/pages/`. Four pages:

- `index.astro` — Home page (one-page site with multiple sections)
- `faq.astro` — FAQ page for voice search / AEO
- `near-grand-canyon.astro` — GEO page targeting Grand Canyon / proximity queries
- `directions.astro` — GEO page with per-city driving directions and Maps embed

### Data Layer

Static JSON files in `/src/data/` are the source of truth:

- `menu.json` — All menu categories and items with prices
- `faq.json` — Q&A pairs for structured data and AEO
- `reviews.json` — Customer reviews, auto-updated weekly via GitHub Actions (Gemini API scrapes and summarizes new reviews)

### Schema / SEO Components

Six JSON-LD schema components in `/src/components/schema/` are injected via `Layout.astro`:

- `RestaurantSchema.astro`, `FAQSchema.astro`, `MenuSchema.astro`, `OrganizationSchema.astro`, `WebSiteSchema.astro`, `BreadcrumbSchema.astro`

These are critical for local SEO and AEO. Changes to menu, hours, or contact info must be reflected in both the data files and schema components.

### Styling — "The Radiant Sommelier" Design System

**TailwindCSS v4** with CSS-first configuration (`@import 'tailwindcss'` + `@theme inline`). No `tailwind.config.mjs` — all tokens live in `src/styles/globals.css`.

**Color system:** Material Design 3 (M3) token hierarchy seeded from `#FF4B12`. All colors defined as CSS custom properties in `:root` (light) and `.dark` (dark). Key token families:

- **Surface hierarchy** (5 depth levels): `bg-surface-dim`, `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-bright` — used for tonal separation between sections (no hard borders).
- **Semantic tokens**: `text-on-surface`, `text-on-surface-variant`, `bg-primary-container`, `text-on-primary-container`, etc.
- **shadcn bridge**: Radix/shadcn tokens (`--background`, `--foreground`, `--card`, etc.) remapped to M3 values via `@theme inline` so existing shadcn components work without class changes.

**Design rules:**

- **No hard borders** between sections or cards. All visual separation comes from background tonal shifts.
- **Orange sparingly**: `#FF4B12` (primary-container) appears in max 4 contexts — CTA buttons, star ratings, nav hover, accent details.
- **Glass budget**: Only Header, Sheet (mobile nav), and DropdownMenu get `backdrop-blur` via `.glass` / `.glass-card` utilities. Cards use tonal backgrounds only.

**Typography:** Manrope Variable (headings/display via `font-display`) + Inter Variable (body via `font-sans`). Seven editorial `@utility` classes: `text-display-lg`, `text-display-md`, `text-heading-lg`, `text-heading-md`, `text-body-lg`, `text-body-md`, `text-label-sm`.

**Dark mode:** `@custom-variant dark (&:where(.dark, .dark *))`. All M3 tokens have dark-mode counterparts in `.dark {}` block. Light is default.

**Animation:** `tw-animate-css` package (TailwindCSS v4 compatible replacement for `tailwindcss-animate`).

Import alias `@/*` resolves to `src/*`.

### Analytics & Scripts

Google Analytics runs via GTM with **Partytown** for off-main-thread execution. The GTM script is in `/public/scripts/gtm.js`. Never block the main thread with analytics — keep Partytown configuration in `astro.config.mjs`.

### Deployment

The site is served from Apache. `.htaccess` forces HTTPS and rewrites all requests to serve from `dist/`. The production build must be committed or deployed to `dist/` on the server.

## Git Conventions

Conventional commits are enforced via commitlint (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, etc.). The pre-push hook runs `npm run qa` (full build + quality checks). Do not skip hooks with `--no-verify`.

## Lighthouse CI Thresholds

Code changes must not degrade:

- LCP < 4000ms, TBT < 600ms, CLS < 0.1
- Accessibility ≥ 90, Best Practices ≥ 80, SEO ≥ 90

## Environment Variables

`PUBLIC_GOOGLE_MAPS_API_KEY` — required in `.env` for the lazy-loaded Google Maps component.
