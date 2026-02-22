# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-20)

**Core value:** AI engines and Google must surface Spice Grill & Bar as the answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.
**Current focus:** Phase 6 complete — all data consistency and Lighthouse coverage gaps closed

## Current Position

Phase: 6 of 6 (Data Consistency and Lighthouse Coverage)
Plan: 1 of 1 in current phase (complete)
Status: Phase 6 complete — Flagstaff distance corrected in faq.json (51 miles/46 min), all tel: URIs standardized to E.164, Lighthouse CI expanded to 4 pages, npm run qa passes clean
Last activity: 2026-02-22 — Plan 06-01 executed (faq.json Flagstaff fix, E.164 tel: URI standardization across 3 components, /faq/ added to LHCI)

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 8
- Average duration: 3.9 min
- Total execution time: ~35 min

**By Phase:**

| Phase                             | Plans | Total  | Avg/Plan |
| --------------------------------- | ----- | ------ | -------- |
| 01-schema-fixes                   | 1/1   | 4 min  | 4 min    |
| 02-schema-additions               | 2/2   | 7 min  | 3.5 min  |
| 03-faq-expansion                  | 1/1   | 2 min  | 2 min    |
| 04-content-infrastructure         | 1/1   | 4 min  | 4 min    |
| 05-geo-content-pages              | 2/2   | 13 min | 6.5 min  |
| 06-data-consistency-lighthouse    | 1/1   | 5 min  | 5 min    |

**Recent Trend:**

- Last 8 plans: 01-01 (4 min), 02-01 (4 min), 02-02 (3 min), 03-01 (2 min), 04-01 (4 min), 05-01 (7 min), 05-02 (6 min), 06-01 (5 min)
- Trend: Stable

_Updated after each plan completion_

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 1: Fix schema bugs before any additions — hours conflict between RestaurantSchema (07:00-22:00 daily) and faq.json (8AM-9PM weekday) is a blocking inconsistency
- Phase 1: Confirmed business hours from REQUIREMENTS.md: Monday closed, Tue-Thu 08:00-21:00, Fri-Sun 08:00-22:00
- 01-01: Monday omitted from openingHoursSpecification (schema.org convention: omission = closed)
- 01-01: FAQ hours answer uses 12-hour format with no CTA per user decision
- 01-01: faq.json NAP audit confirmed no other entries contain phone, URL, or hours data
- 02-01: aggregateRating computed at build time from reviews.json (ratingValue: 5, reviewCount: 7) — not hardcoded
- 02-01: areaServed uses @type City for municipalities, @type Place for corridors/landmarks; Wikipedia @id on 6 confirmed towns
- 02-01: Flagstaff excluded from areaServed per user decision in CONTEXT.md
- 02-02: CONTEXT.md is authoritative over REQUIREMENTS.md for Google Maps URL (q2EJFMbMRaysU6vH8)
- 02-02: inLanguage added to WebSiteSchema (Claude discretion — minor signal, zero cost)
- 02-02: publisher uses minimal inline Organization object (avoids duplicating full schema)
- 02-02: No SearchAction on WebSiteSchema (user decision: site has no search functionality)
- 03-01: RV/truck parking merged into single comprehensive parking entry; freed slot for alcohol entry
- 03-01: FAQSchema injected globally via Layout.astro — all pages emit 20 FAQ schema entries (future scope: restrict to faq.astro only)
- 03-01: Call-ahead pickup for Williams/Seligman explicitly states no delivery, food ready at Ash Fork restaurant
- 04-01: slugToLabel() uses BREADCRUMB_ACRONYMS map keyed on lowercase word for slug-to-label overrides
- 04-01: Footer social links moved from bottom bar to Explore section with icon+text labels
- 04-01: Header navigation unchanged per user decision (CONTEXT.md locked)
- 04-01: LHCI includes Phase 5 URLs before pages exist — will 404 until Phase 5 completes
- 05-01: Layout.astro og:url fallback uses canonicalURL (not hardcoded homepage URL) for correctness
- 05-01: Page-specific inline FAQPage schema placed inside Layout slot (not <head>) — separate from global FAQSchema
- 05-01: Kingman distance corrected from 80 miles to 97 miles (verified from 05-RESEARCH.md data)
- 05-01: faq.json Grand Canyon distance corrected from 70 miles to 78 miles with updated drive time
- [Phase 05-geo-content-pages]: near-grand-canyon.astro cross-link to /directions/ was already keyword-rich from 05-01 — no changes needed in 05-02
- [Phase 05-geo-content-pages]: Directions page anchor navigation uses pure HTML anchor links (no JS) — consistent with Astro static site pattern
- 06-01: faq.json Flagstaff entry corrected: 50 miles → 51 miles, 40-minute → 46-minute (matches near-grand-canyon.astro and 06-RESEARCH.md)
- 06-01: All tel: URI href attributes use E.164 format tel:+19282771292 (visible display text unchanged)
- 06-01: /faq/ added to .lighthouserc.json url array — all 4 live pages now audited on every push

### Pending Todos

None.

### Blockers/Concerns

- Future: FAQSchema injected on all pages via Layout.astro — Google may flag FAQ schema on pages where FAQ content is not visible

## Session Continuity

Last session: 2026-02-22
Stopped at: Completed 06-01-PLAN.md — Phase 6 plan 01 (Flagstaff distance fix in faq.json, E.164 tel: URI standardization across 3 components, /faq/ added to LHCI — Phase 6 complete)
Resume file: None
