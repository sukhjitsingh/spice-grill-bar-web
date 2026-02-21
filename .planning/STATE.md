# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-20)

**Core value:** AI engines and Google must surface Spice Grill & Bar as the answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.
**Current focus:** Phase 5 — GEO Content Pages

## Current Position

Phase: 4 of 5 (Content Infrastructure)
Plan: 1 of 1 in current phase (complete)
Status: Phase 4 complete — 04-01 executed (breadcrumb label fix, LHCI URLs, Footer Explore section)
Last activity: 2026-02-21 — Plan 04-01 executed (slugToLabel + BREADCRUMB_ACRONYMS, Footer 4-column grid with Explore section, LHCI extended to /near-grand-canyon/ and /directions/)

Progress: [████████░░] 80%

## Performance Metrics

**Velocity:**

- Total plans completed: 5
- Average duration: 3.4 min
- Total execution time: ~17 min

**By Phase:**

| Phase                     | Plans | Total | Avg/Plan |
| ------------------------- | ----- | ----- | -------- |
| 01-schema-fixes           | 1/1   | 4 min | 4 min    |
| 02-schema-additions       | 2/2   | 7 min | 3.5 min  |
| 03-faq-expansion          | 1/1   | 2 min | 2 min    |
| 04-content-infrastructure | 1/1   | 4 min | 4 min    |

**Recent Trend:**

- Last 5 plans: 01-01 (4 min), 02-01 (4 min), 02-02 (3 min), 03-01 (2 min), 04-01 (4 min)
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

### Pending Todos

None yet.

### Blockers/Concerns

- Phase 5: All distance/drive-time figures for /near-grand-canyon/ and /directions/ must be verified against Google Maps before publishing
- Phase 5: LHCI will fail on /near-grand-canyon/ and /directions/ until pages are built (expected)
- Future: FAQSchema injected on all pages via Layout.astro — Google may flag FAQ schema on pages where FAQ content is not visible

## Session Continuity

Last session: 2026-02-21
Stopped at: Completed 04-01-PLAN.md — Phase 4 plan 01 (slugToLabel breadcrumb fix, LHCI extended to Phase 5 URLs, Footer Explore section with page links and social links)
Resume file: None
