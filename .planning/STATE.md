# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-20)

**Core value:** AI engines and Google must surface Spice Grill & Bar as the answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.
**Current focus:** Phase 5 — GEO Content Pages

## Current Position

Phase: 5 of 5 (GEO Content Pages)
Plan: 1 of 2 in current phase (complete)
Status: Phase 5 in progress — 05-01 executed (/near-grand-canyon/ page, Layout.astro OG props, llms.txt fixes, faq.json distance corrections)
Last activity: 2026-02-21 — Plan 05-01 executed (/near-grand-canyon/ AEO page, extended Layout.astro with ogTitle/ogDescription/ogUrl props, fixed Monday hours in llms.txt and llms-full.txt, corrected Grand Canyon distance to 78 miles in faq.json)

Progress: [█████████░] 90%

## Performance Metrics

**Velocity:**

- Total plans completed: 6
- Average duration: 3.8 min
- Total execution time: ~24 min

**By Phase:**

| Phase                     | Plans | Total | Avg/Plan |
| ------------------------- | ----- | ----- | -------- |
| 01-schema-fixes           | 1/1   | 4 min | 4 min    |
| 02-schema-additions       | 2/2   | 7 min | 3.5 min  |
| 03-faq-expansion          | 1/1   | 2 min | 2 min    |
| 04-content-infrastructure | 1/1   | 4 min | 4 min    |
| 05-geo-content-pages      | 1/2   | 7 min | 7 min    |

**Recent Trend:**

- Last 6 plans: 01-01 (4 min), 02-01 (4 min), 02-02 (3 min), 03-01 (2 min), 04-01 (4 min), 05-01 (7 min)
- Trend: Stable (05-01 longer due to larger page creation task)

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

### Pending Todos

None.

### Blockers/Concerns

- Phase 5: LHCI will fail on /directions/ until 05-02 is executed (expected — /near-grand-canyon/ now passes)
- Future: FAQSchema injected on all pages via Layout.astro — Google may flag FAQ schema on pages where FAQ content is not visible

## Session Continuity

Last session: 2026-02-21
Stopped at: Completed 05-01-PLAN.md — Phase 5 plan 01 (/near-grand-canyon/ AEO page, Layout.astro OG props, llms.txt/llms-full.txt Monday hours fix and proximity data, faq.json 78-mile distance corrections)
Resume file: None
