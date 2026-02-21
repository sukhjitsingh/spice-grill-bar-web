# External Integrations

**Analysis Date:** 2026-02-20

## APIs & External Services

**Maps & Location:**

- Google Maps Embed API - Location display on `/` (home page)
  - SDK/Client: Embedded iframe via Google Maps Embed API
  - API Key: `PUBLIC_GOOGLE_MAPS_API_KEY` (stored in `.env`)
  - Implementation: `src/components/GoogleMap.tsx` - Lazy-loaded via IntersectionObserver
  - Query: Embeds map for "Spice Grill & Bar, Ash Fork, AZ"
  - Credentials location: `.env` file (PUBLIC prefix for client-side exposure)

**Social Media (External Links):**

- Instagram - `https://www.instagram.com/panjabi_dhaba_sgb`
- Facebook - `https://www.facebook.com/profile.php?id=61566349169122`
- Google Maps Search - `https://www.google.com/maps/search/?api=1&query=Spice+Grill+%26+Bar+33+Lewis+Ave+Ash+Fork+AZ+86320`
- Implementation: Footer social links (`src/components/Footer.astro`)

**Generative AI (Scheduled Jobs):**

- Google Gemini API - Review content generation/enhancement
  - API Key: `GEMINI_API_KEY` (GitHub secret, not in repo)
  - Usage: `scripts/ingest-reviews.js` (referenced in workflow but not committed to repo)
  - Trigger: Weekly scheduled job (Sundays at midnight UTC) via `.github/workflows/update-reviews.yml`
  - Browser automation: Puppeteer for headless Chrome (installed in CI)
  - Output: Updates `src/data/reviews.json`

## Data Storage

**Databases:**

- None - Static site with no backend database

**File Storage:**

- Local filesystem only
  - JSON data files in `src/data/`:
    - `src/data/reviews.json` - Customer reviews (auto-updated weekly)
    - `src/data/menu.json` - Restaurant menu items
    - `src/data/faq.json` - Frequently asked questions
  - Static assets in `public/`:
    - Images (WebP optimized): `location-preview.webp`, `opengraph-image.webp`
    - Metadata: `manifest.json` (PWA manifest)
    - SEO: `llms.txt`, `llms-full.txt` (AI agent discovery)
    - `robots.txt` - Search engine directives
    - Favicons: `favicon.ico`, `favicon.svg`

**Caching:**

- Browser caching via standard HTTP headers
- Partytown caching for third-party scripts
- No server-side caching system

## Authentication & Identity

**Auth Provider:**

- None - Public site with no user authentication

**Public Content:**

- Site is fully public and unauthenticated
- Static content only (no dynamic user-specific content)

## Monitoring & Observability

**Performance Monitoring:**

- Lighthouse CI - Automated performance testing
  - Integration: `@lhci/cli` via `.lighthouserc.json`
  - Metrics monitored:
    - LCP (Largest Contentful Paint): < 4000ms
    - TBT (Total Blocking Time): < 600ms
    - CLS (Cumulative Layout Shift): < 0.1
    - Accessibility score: >= 90%
    - Best Practices score: >= 80%
    - SEO score: >= 90%
  - Upload target: Temporary public storage (no persistent backend)
  - Config file: `.lighthouserc.json`

**Accessibility Audits:**

- axe-core - Automated accessibility testing
  - CLI: `@axe-core/cli`
  - Usage: `npm run test:axe` (requires running server on :4321)

**Error Tracking:**

- None - No error tracking service configured
- Security scan warnings logged to console via `scripts/security-scan.mjs`

**Logs:**

- Console output during build/audit phases
- No persistent log aggregation
- Local audit reports generated in `.lighthouseci/` (not committed)

## CI/CD & Deployment

**Hosting:**

- Apache-based shared hosting (inferred from `.htaccess`)
- Static file deployment to `dist/` directory
- Domain: `https://spicegrillbar66.com`

**CI Pipeline:**

- GitHub Actions - Workflow defined in `.github/workflows/update-reviews.yml`
  - Schedule: Weekly (Sundays at midnight UTC)
  - Manual trigger: Workflow dispatch
  - Steps:
    1. Checkout code
    2. Setup Node.js 20
    3. Install dependencies + Puppeteer browser
    4. Run `node scripts/ingest-reviews.js` with `GEMINI_API_KEY` secret
    5. Auto-commit updated `data/reviews.json` via Stefan Zweifel's git-auto-commit action
  - Commits skipped from CI: `[skip ci]` flag in commit message

**Build Commands:**

- `npm run build` - Production build (Astro build + sitemap post-processing)
- `npm run dev` - Development server
- `npm run preview` - Preview production build locally

**QA Pipeline:**

- `npm run qa` - Full quality assurance:
  1. Build site (`npm run build`)
  2. Run quality checks (`npm run test:quality`)
  3. Run Lighthouse CI (`npm run test:lhci`)

**Git Hooks:**

- Pre-commit: ESLint + Prettier formatting (via lint-staged)
- Commit-msg: Conventional commits validation (commitlint)
- Pre-push: Full `npm run qa` pipeline
- Hook manager: simple-git-hooks

## Environment Configuration

**Required env vars:**

- `PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps Embed API key (public, in `.env`)
- `GEMINI_API_KEY` - Google Gemini API key (secret, GitHub Actions only, not in repo)

**Secrets location:**

- GitHub Secrets:
  - `GEMINI_API_KEY` - Used by CI workflow for review generation
  - Accessed in workflow: `.github/workflows/update-reviews.yml`

**Non-Secret Config:**

- `.env` file contains:
  - `PUBLIC_GOOGLE_MAPS_API_KEY` - Public key (safe to commit)
  - No other environment variables

## Webhooks & Callbacks

**Incoming:**

- None - Static site has no webhook endpoints

**Outgoing:**

- Google Maps Embed - One-way integration only
- GitHub Actions auto-commit - Updates repository with new review data
- Optional: Review data could be enhanced via Gemini API (if script implemented)

## Review Data Pipeline

**Data Sources:**

- Manual reviews stored in `src/data/reviews.json`
- Fields per review:
  - `id` - Unique identifier
  - `author` - Reviewer name
  - `rating` - 5-star rating
  - `text` - Review content
  - `source` - Platform (Google, Yelp, etc.)
  - `date` - Review date

**Weekly Update Process:**

1. GitHub Actions triggers on schedule
2. Script `ingest-reviews.js` runs (location: scripts directory, not currently committed)
3. Puppeteer launches Chrome headless browser
4. Gemini API enhances/generates review content
5. Updated `src/data/reviews.json` committed back to repo
6. Next build includes latest reviews

## Security Considerations

**API Keys:**

- `PUBLIC_GOOGLE_MAPS_API_KEY` - Committed in `.env` (safe because it's public)
- `GEMINI_API_KEY` - Stored as GitHub Secret only (not in repo)
- Security scan enabled: `scripts/security-scan.mjs` checks for exposed secrets

**Data Privacy:**

- No user data collected or stored
- No analytics data collection (confirmed: no Google Analytics integration)
- Static site means no server logs of user activity

## Third-Party Scripts

**Optimization:**

- Partytown (@astrojs/partytown) - Off-thread script execution
  - Configured in `astro.config.mjs` with `dataLayer.push` forwarding
  - Purpose: Prevent third-party scripts from blocking main thread
  - Note: No actual GA/GTM script is currently loaded, configuration ready for future

---

_Integration audit: 2026-02-20_
