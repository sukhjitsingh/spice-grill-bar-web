# Milestones

## v3.0 AEO/GEO Refinement (Active — started 2026-05-05)

**Goal:** Strengthen AI/Answer Engine Optimization (AEO) and local SEO so Spice Grill & Bar surfaces correctly in voice search, ChatGPT, Gemini, and similar assistants. Fix data drift (Monday hours), enrich structured data with payment/amenity/reservation signals, expand AI-readable files, add a home-page voice-ready FAQ, expand FAQ data, add a `/near-williams/` GEO page, and strengthen the AEO audit script.

**Phase plan:** Phase 11 — AEO/GEO Refinement (single phase, multi-wave).

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
