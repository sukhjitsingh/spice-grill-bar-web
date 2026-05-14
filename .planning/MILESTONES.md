# Milestones

## v3.0 AEO/GEO Refinement (Shipped: 2026-05-14)

**Phases completed:** 1 phase (Phase 11), 8 plans

**Key accomplishments:**

- Locked all owner-confirmed business-data values (8 payment methods, walk-in-only reservations, 7 amenities) and corrected Kaibab Estates West direction from "east on I-40" to "north of Ash Fork" — unblocking all downstream schema/content writes
- Closed AEO-01 P0 hours drift: Monday added to RestaurantSchema.astro openingHoursSpecification; Monday-closed strings eliminated across schema, llms.txt, and llms-full.txt
- Eliminated Monday-closed drift in AI-crawler docs and added 5 H2 sections (Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, Dietary Options) using owner-confirmed values — AI agents now see authoritative prose for the highest-volume voice queries
- Added `paymentAccepted`, `acceptsReservations` (false), and `amenityFeature` (7 entries) to RestaurantSchema.astro — schema-dts strictly typed, owner-confirmed values, Wi-Fi excluded
- Broadened FAQSchema gate to home page + added visible 8-Q FAQ section + SpeakableSpecification for Google voice extraction (AEO-05, AEO-06)
- Expanded `src/data/faq.json` from 21 to 34 voice-optimized entries covering Williams, Kaibab, payment, reservations, pricing, delivery/takeout, Butter Chicken/Tandoori, spice level, and Route 66 — all under 50-word ceiling
- Created `/near-williams/` GEO landing page targeting Williams tourists (18 mi east on I-40) and Kaibab Estates West residents (5 mi north of Ash Fork), wired to Footer, sitemap, and Lighthouse CI
- Added 3 fail-fast gates to `scripts/aeo-audit.mjs` (FAQ count ≥34, llms.txt required sections, robots.txt AI-bot allowlist) — future AEO drift now fails CI before deploy

**Stats:** 29 files changed, +2158/−110 lines | 1 day execution (2026-05-06)
**Audit:** tech_debt — 9/9 requirements satisfied, 6 non-critical tech-debt items (see `.planning/milestones/v3.0-MILESTONE-AUDIT.md`)

---

## v2.0 UI Facelift — The Radiant Sommelier (Shipped: 2026-03-28)

**Phases completed:** 4 phases, 15 plans

**Key accomplishments:**

- Migrated TailwindCSS 3 → v4 (CSS-first config, `@tailwindcss/vite`, `@theme` directive)
- Established M3 surface hierarchy + semantic token system in `globals.css` (5 depth levels, light + dark)
- Swapped fonts to Manrope Variable (`font-display`) + Inter Variable (`font-sans`)
- Reskinned all 4 pages following the Radiant Sommelier aesthetic with no-line rule and tonal separation
- Replaced `tailwindcss-animate` with `tw-animate-css`; verified Sheet, DropdownMenu, MobileActionButtons animations
- Lighthouse CI green (LCP < 4s, TBT < 600ms, CLS < 0.105, A11y ≥ 90, SEO ≥ 90) on all 4 pages, both modes
- WCAG AA contrast verified across light + dark via axe-core sweep

**Audit:** see `.planning/v2.0-MILESTONE-AUDIT.md` — 24/24 requirements satisfied, 3 minor tech-debt items.

---

## v1.0 SEO/GEO/AEO Optimization (Shipped: 2026-02-22)

**Phases completed:** 6 phases, 8 plans, 5 tasks

**Key accomplishments:**

- Fixed all NAP data (hours, phone, URL) in RestaurantSchema and synced across faq.json and Footer
- Added 6 local SEO schema signals (geo, areaServed, aggregateRating, hasMap, OrderAction, sameAs)
- Expanded FAQ from 9 to 20 highway-targeted AEO entries passing 50-word audit
- Created /near-grand-canyon/ page with AEO answer-first passage structure and speakable schema
- Created /directions/ page with 7 per-city H2 sections, NAP address blocks, and Google Maps embed
- Eliminated cross-phase data drift (distances, tel: URIs) and achieved full 4-page Lighthouse CI coverage

**Stats:** 52 files changed, 7139 insertions, 2412 LOC (Astro/TS/TSX), 2-day sprint
**Git range:** f929e5c (fix(01-01)) → 5aedf1b (chore(06-01))
**Audit:** tech_debt — 17/17 requirements satisfied, 9 non-critical tech debt items (see milestones/v1.0-MILESTONE-AUDIT.md)

---
