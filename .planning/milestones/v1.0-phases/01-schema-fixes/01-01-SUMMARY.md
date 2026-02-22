---
phase: 01-schema-fixes
plan: 01
subsystem: seo
tags: [schema-org, json-ld, structured-data, nap, local-seo]

# Dependency graph
requires: []
provides:
  - Corrected RestaurantSchema JSON-LD with valid E.164 telephone, canonical URL (no www), and accurate openingHoursSpecification (Mon closed, Tue-Thu 08:00-21:00, Fri-Sun 08:00-22:00)
  - Corrected faq.json hours answer explicitly stating closed Mondays, Tue-Thu/Fri-Sun split in 12-hour format
  - Corrected Footer.astro visible hours with Monday as Closed row, Tue-Thu and Fri-Sun rows
affects: [02-schema-additions, 03-content-pages, 04-aeo-content, 05-geo-landing-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'NAP consistency: E.164 format (+1-xxx-xxx-xxxx) in JSON-LD schema, display format (xxx) xxx-xxxx in human-readable text'
    - 'openingHoursSpecification omits closed days entirely (Monday not listed = closed)'

key-files:
  created: []
  modified:
    - src/components/schema/RestaurantSchema.astro
    - src/data/faq.json
    - src/components/Footer.astro

key-decisions:
  - 'Monday omitted from openingHoursSpecification (schema.org convention: omission = closed, not explicit closed entry)'
  - 'FAQ hours answer uses 12-hour format with no CTA per user decision'
  - 'faq.json NAP audit: no other entries contained phone, URL, or hours data — no additional fixes required'

patterns-established:
  - 'NAP data flows from confirmed business data → JSON-LD schema (E.164 phone, no-www URL) → faq.json (human-readable display format) → Footer.astro (visible UI)'

requirements-completed: [SCHM-01, SCHM-02, SCHM-03, SCHM-04]

# Metrics
duration: 4min
completed: 2026-02-21
---

# Phase 1 Plan 01: Schema NAP Fixes Summary

**Corrected three critical NAP data points in RestaurantSchema (E.164 phone, no-www URL, accurate Mon-closed/Tue-Thu/Fri-Sun hours), synced faq.json and Footer.astro to match confirmed business hours**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-21T01:43:06Z
- **Completed:** 2026-02-21T01:47:06Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- RestaurantSchema.astro: all three NAP fields corrected — url (www removed), telephone (E.164), openingHoursSpecification (Mon closed, correct split hours)
- faq.json hours answer: replaced incorrect Monday-Thursday wording with "Tue-Thu 8am-9pm, Fri-Sun 8am-10pm, closed Mondays." in 12-hour format
- faq.json full audit: confirmed no other of the 9 entries contain any NAP data (phone, URL, or hours) — zero additional fixes required
- Footer.astro: replaced two-row Mon-Thurs/Fri-Sun display with three-row Monday/Closed, Tue-Thu/8AM-9PM, Fri-Sun/8AM-10PM

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix RestaurantSchema — hours, telephone, url** - `f929e5c` (fix)
2. **Task 2: Fix faq.json hours entry, audit all entries for NAP consistency, fix Footer.astro visible hours** - `6010c23` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/components/schema/RestaurantSchema.astro` — url, telephone, openingHoursSpecification all corrected
- `src/data/faq.json` — hours answer updated; all 9 entries audited for NAP consistency
- `src/components/Footer.astro` — hours display updated to show Monday as Closed, three-row layout

## Decisions Made

- Monday omitted from openingHoursSpecification entirely — schema.org convention is that omission = closed, not an explicit closed entry. This is simpler and correct.
- FAQ hours answer uses 12-hour format (8am-9pm, not 08:00) with no CTA per user decision from plan context.
- faq.json NAP audit result: entries 1, 3-9 contain no phone, URL, or hours references — the only NAP-bearing entry was entry 2 (hours), which was fixed.

## Actual Values Before and After

### RestaurantSchema.astro

| Field                     | Before                                                                          | After                                                                |
| ------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| url                       | `https://www.spicegrillbar66.com`                                               | `https://spicegrillbar66.com`                                        |
| telephone                 | `(928) 277-1292`                                                                | `+1-928-277-1292`                                                    |
| openingHoursSpecification | Mon-Fri 07:00-22:00 + Sat-Sun 07:00-22:00 (2 entries, Monday open, wrong times) | Tue-Thu 08:00-21:00 + Fri-Sun 08:00-22:00 (2 entries, Monday absent) |

### faq.json hours answer

| Before                                                                                                             | After                                                |
| ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| "We are open Monday through Thursday from 8:00 AM to 9:00 PM, and Friday through Sunday from 8:00 AM to 10:00 PM." | "Tue-Thu 8am-9pm, Fri-Sun 8am-10pm, closed Mondays." |

### Footer.astro hours display

| Before                                                  | After                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| Mon - Thurs: 8AM - 9PM / Fri - Sun: 8AM - 10PM (2 rows) | Monday: Closed / Tue - Thu: 8AM - 9PM / Fri - Sun: 8AM - 10PM (3 rows) |

## faq.json NAP Audit Results

All 9 FAQ entries reviewed for NAP inconsistencies:

| #   | Question           | NAP Data?     | Issues Found                                      | Fixed? |
| --- | ------------------ | ------------- | ------------------------------------------------- | ------ |
| 1   | Food type          | No            | None                                              | N/A    |
| 2   | Operating hours    | Yes (hours)   | Monday listed as open                             | Yes    |
| 3   | Vegetarian options | No            | None                                              | N/A    |
| 4   | Location           | Yes (address) | Address correct: 33 Lewis Ave, Ash Fork, AZ 86320 | N/A    |
| 5   | Takeout/delivery   | No            | None                                              | N/A    |
| 6   | Parking            | No            | None                                              | N/A    |
| 7   | Alcohol            | No            | None                                              | N/A    |
| 8   | Popular dishes     | No            | None                                              | N/A    |
| 9   | Kid-friendly       | No            | None                                              | N/A    |

**Result:** Only entry 2 required changes. No phone numbers or URLs appeared in any FAQ answer.

## Build and Test Results

- `npm run build` — PASSED (2 pages built)
- `npm run typecheck` — PASSED (0 errors, 0 warnings)
- `npm run lint` — PASSED (clean)
- `npm run test:aeo` — PASSED (all 9 FAQ items optimized, AEO audit passed)
- Built HTML spot-check: `"telephone":"+1-928-277-1292"`, `"url":"https://spicegrillbar66.com"` confirmed; `schema.org/Monday` absent from openingHoursSpecification

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- First commit attempt failed due to commitlint `subject-case` rule — subject must be sentence-case. Fixed by capitalizing the first word of the commit subject. All subsequent commits passed on first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All three NAP data sources (RestaurantSchema, faq.json, Footer.astro) now agree on confirmed business hours, E.164 phone, and canonical URL
- Google Rich Results Test should now show zero errors for RestaurantSchema
- Phase 2 (schema additions: aggregateRating, potentialAction, priceRange) can proceed on a clean foundation
- Phase 2 blockers from STATE.md still apply: reviews.json field structure must be verified before aggregateRating, Toast ordering URL must be confirmed

---

_Phase: 01-schema-fixes_
_Completed: 2026-02-21_

## Self-Check: PASSED

- FOUND: src/components/schema/RestaurantSchema.astro
- FOUND: src/data/faq.json
- FOUND: src/components/Footer.astro
- FOUND: .planning/phases/01-schema-fixes/01-01-SUMMARY.md
- FOUND: commit f929e5c (Task 1)
- FOUND: commit 6010c23 (Task 2)
