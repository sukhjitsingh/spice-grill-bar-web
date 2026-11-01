# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for **Spice Grill & Bar**, a restaurant in Ash Fork, Arizona on Route 66/I-40 Exit 146. The project is an **Astro 7** static site. The primary technical goals are local SEO (GEO), AI/Answer Engine Optimization (AEO), and Lighthouse performance scores.

## Common Commands

Requires **Node 24.22.2**, pinned in `.nvmrc` (run `nvm use`). `package.json` `engines` and the GitHub workflow use the same version.

```bash
npm run dev           # Start dev server at http://localhost:4321
npm run build         # Build to ./dist/ (postbuild copies sitemap-index.xml → sitemap.xml and checks dist/.htaccess)
npm run preview       # Preview production build locally
npm run lint          # ESLint on .js/.ts/.astro files
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format all files with Prettier
npm run typecheck     # TypeScript + Astro type checking
npm run test:aeo      # AEO audit (FAQ, llms.txt format, robots.txt, schema, claims, links, rating); run after build
npm run test:axe      # Contrast + WCAG 2.1 A/AA axe audit, light mode (needs `npm run dev` on :4321)
npm run test:axe:dark # Same audit in dark mode
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

File-based routing via `/src/pages/`. Pages:

- `index.astro` — Home page (hero, story, reviews, All-Time Favorites teaser, FAQ, order, location). Old `/#menu` links redirect to `/menu/`
- `menu.astro` — Full menu with prices (`MenuSection.tsx` island, grouped by the print menu's sections); the only page that emits Menu JSON-LD
- `faq.astro` — FAQ page for voice search / AEO
- `near-grand-canyon.astro` — GEO page targeting Grand Canyon / proximity queries
- `directions.astro` — GEO page with per-city driving directions and Maps embed
- `near-williams.astro` — GEO page targeting Williams / Kaibab Estates queries
- `events.astro` — Karaoke (biweekly, computed from `anchorDate`) and Paint & Sip (dated entries) from `src/data/events.json`; emits Event JSON-LD via `EventSchema.astro`

### Data Layer

Static JSON files in `/src/data/` are the source of truth:

- `menu.json` — Menu categories (with `section` grouping matching the printed dine-in menu) and items with prices, `veg`, `favorite`, `isNew` and optional `note`. Source of truth for every price on the site, `MenuSchema` and the `llms-full.txt` menu section
- `faq.json` — Q&A pairs for structured data and AEO
- `events.json` — Recurring and dated events. To post a new Paint & Sip, add an entry to `events` (date, time, optional price/theme/signupUrl), then rebuild and deploy. Past dates hide automatically in the browser.
- `reviews.json` — Customer reviews, newest first. Updated monthly by `.github/workflows/update-reviews.yml`, which runs `npm run ingest:reviews` (`scripts/ingest-reviews.mjs`: Puppeteer scrapes Google Maps + Yelp, Gemini extracts reviews; needs `GEMINI_API_KEY`). The script only appends new reviews (deduped by source + author or opening text) and never edits or removes existing ones; any failure leaves the file untouched. `ReviewsSection.astro` shows the 12 newest by date.
- `rating.json` — Google's overall rating and total review count (`ratingValue`, `reviewCount`, `source`, `asOf`). Single source for the hero badge and `RestaurantSchema`'s `aggregateRating`, read through `src/lib/rating.ts`. The same monthly workflow refreshes it from the scraped Google listing, but only when the new values are plausible (rating 1–5, count within 0.9×–3× of the stored count). Never compute the rating from `reviews.json`; that file is a sample.

### Schema / SEO Components

Eight JSON-LD schema components in `/src/components/schema/` are injected via `Layout.astro`:

- `RestaurantSchema.astro`, `ServiceSchema.astro`, `OrganizationSchema.astro`, `WebSiteSchema.astro`, `BreadcrumbSchema.astro` on every page
- `FAQSchema.astro` on `/faq/` only (the home page emits its own 8-question FAQPage matching its visible FAQ section), `MenuSchema.astro` on `/menu/` only, `EventSchema.astro` on `/events/` only

These are critical for local SEO and AEO. Changes to menu, hours, or contact info must be reflected in both the data files and schema components.

**AEO content rules** (enforced by `scripts/aeo-audit.mjs`):

- No "closest / nearest / only" Indian or Punjabi restaurant claims about Williams, the Grand Canyon or I-40: Taj Mahal Indian Restaurant operates in Williams. "Closest Indian restaurant to Kaibab Estates West" is allowed.
- Every page needs at least two inline links in its `<main>` prose (class `text-primary-container underline underline-offset-2 …`), not just nav, footer and CTA buttons.
- `public/llms.txt` and `public/llms-full.txt` follow the llmstxt.org Markdown format: H1 first, a `> ` summary, links as `[text](url)` (never bare URLs). The `## Full Menu` section of `llms-full.txt` is generated from `menu.json` by `prebuild`; don't edit it by hand.

### Styling — "The Radiant Sommelier" Design System

**TailwindCSS v4** with CSS-first configuration (`@import 'tailwindcss'` + `@theme inline`). No `tailwind.config.mjs` — all tokens live in `src/styles/globals.css`.

**Color system:** Material Design 3 (M3) token hierarchy seeded from `#FF4B12`. All colors defined as CSS custom properties in `:root` (light) and `.dark` (dark). Key token families:

- **Surface hierarchy** (5 depth levels): `bg-surface-dim`, `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-bright` — used for tonal separation between sections (no hard borders).
- **Semantic tokens**: `text-on-surface`, `text-on-surface-variant`, `bg-primary-container`, `text-on-primary-container`, etc.
- **shadcn bridge**: Radix/shadcn tokens (`--background`, `--foreground`, `--card`, etc.) remapped to M3 values via `@theme inline` so existing shadcn components work without class changes.

**Design rules:**

- **No hard borders** between sections or cards. All visual separation comes from background tonal shifts.
- **Orange sparingly**: `#FF4B12` (primary-container) appears in max 4 contexts — CTA buttons, star ratings, nav hover, accent details.
- **Glass budget**: `backdrop-blur` via `.glass` / `.glass-card` is used by Header (on scroll), Sheet (mobile nav), OrderSection CTA card, and MobileActionButtons. Minor `backdrop-blur-sm` on Hero tag chip. Cards elsewhere use tonal backgrounds only — no additional glass consumers should be added without design review.

**Typography:** Manrope Variable (headings/display via `font-display`) + Inter Variable (body via `font-sans`). Seven editorial `@utility` classes: `text-display-lg`, `text-display-md`, `text-heading-lg`, `text-heading-md`, `text-body-lg`, `text-body-md`, `text-label-sm`.

**Dark mode:** `@custom-variant dark (&:where(.dark, .dark *))`. All M3 tokens have dark-mode counterparts in `.dark {}` block. Light is default.

**Animation:** `tw-animate-css` package (TailwindCSS v4 compatible replacement for `tailwindcss-animate`).

Import alias `@/*` resolves to `src/*`.

### Analytics & Scripts

Google Analytics runs via GTM with **Partytown** for off-main-thread execution. The GTM script is in `/public/scripts/gtm.js`. Never block the main thread with analytics — keep Partytown configuration in `astro.config.mjs`.

### Deployment

The site is served from Apache on Hostinger. `public/.htaccess` (copied into `dist/` by the build) strips `www` and forces HTTPS in a single 301. Deploy by uploading the **contents** of `dist/`, including the hidden `.htaccess`, into `public_html/`. `postbuild` fails the build if `dist/.htaccess` is missing or if any sitemap URL lacks `<lastmod>` (set from each page's last git commit in `astro.config.mjs`).

`astro-indexnow` pings IndexNow **during `npm run build`**, before the upload. Bing may therefore fetch the old pages; after uploading a content change, re-submit the changed URLs (Bing Webmaster Tools → URL Submission, or IndexNow).

## Git Conventions

Conventional commits are enforced via commitlint (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, etc.). The pre-push hook runs `npm run qa` (full build + quality checks). Do not skip hooks with `--no-verify`.

## Lighthouse CI Thresholds

Code changes must not degrade:

- LCP < 4000ms, TBT < 600ms, CLS < 0.105
- Accessibility ≥ 90, Best Practices ≥ 80, SEO ≥ 90

## Environment Variables

`PUBLIC_GOOGLE_MAPS_API_KEY` — required in `.env` for the lazy-loaded Google Maps component.
