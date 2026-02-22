---
phase: 02-schema-additions
plan: 01
subsystem: seo
tags: [schema-dts, json-ld, schema.org, local-seo, aeo, geo-coordinates, aggregate-rating]

# Dependency graph
requires:
  - phase: 01-schema-fixes
    provides: Corrected RestaurantSchema with valid hours and NAP data

provides:
  - RestaurantSchema JSON-LD with GeoCoordinates, 12-entry areaServed array, build-time aggregateRating, hasMap, OrderAction, and containedInPlace
  - aggregateRating computed from reviews.json import (not hardcoded)

affects:
  - 02-schema-additions (plans 02, 03 also modify schema components)
  - 05-content-pages (distance/directions content that references service area)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Import reviews.json in Astro frontmatter to compute aggregateRating at build time
    - Use schema-dts types (GeoCoordinates, AggregateRating, OrderAction) inline without explicit sub-type imports
    - areaServed as array of City/Place objects with @id Wikipedia links for known towns

key-files:
  created: []
  modified:
    - src/components/schema/RestaurantSchema.astro

key-decisions:
  - 'aggregateRating computed at build time from reviews.json filter/reduce — not hardcoded; refreshes on each build as reviews.json updates'
  - 'areaServed uses @type City for municipalities and @type Place for route/corridor concepts (I-40 Corridor, Historic Route 66, Grand Canyon South Rim)'
  - 'Wikipedia @id added for 6 towns with known articles (Ash Fork, Williams, Seligman, Prescott, Prescott Valley, Sedona); omitted for unverifiable entries'
  - 'Flagstaff explicitly excluded from areaServed per user decision in CONTEXT.md'
  - 'hasMap uses short Google Maps URL (maps.app.goo.gl) per confirmed URL from CONTEXT.md'

patterns-established:
  - 'Pattern 1: Build-time aggregateRating — filter reviews for numeric rating, reduce to mean, parseFloat to 1 decimal'
  - 'Pattern 2: areaServed modeling — City @type for towns, Place @type for geographic corridors/landmarks'

requirements-completed: [SCHM-05, SCHM-06, SCHM-07, SCHM-08]

# Metrics
duration: 2min
completed: 2026-02-21
---

# Phase 02 Plan 01: Restaurant Schema Local SEO Enrichment Summary

**GeoCoordinates, 12-entry areaServed array, build-time aggregateRating from reviews.json, hasMap, OrderAction (Toast), and containedInPlace added to RestaurantSchema JSON-LD**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-21T03:42:09Z
- **Completed:** 2026-02-21T03:44:19Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments

- Added GeoCoordinates (lat 35.22291449138381, lon -112.47815397255074) as `geo` property
- Expanded `areaServed` from plain string "Ash Fork" to 12-entry array covering service area towns (City @type) and traveler corridors (Place @type), with Wikipedia @id on 6 confirmed entries
- Added `aggregateRating` computed at build time from reviews.json (ratingValue: 5, reviewCount: 7 from 7 five-star reviews)
- Added `hasMap`, `potentialAction` (OrderAction with Toast URL), and `containedInPlace` (Historic Route 66)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add geo, areaServed, aggregateRating, hasMap, potentialAction, containedInPlace** - `48b79be` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/components/schema/RestaurantSchema.astro` - Added 6 new schema.org properties; imports reviews.json for build-time rating computation

## Decisions Made

- Build-time `aggregateRating` computation: filter reviews by numeric rating, reduce to arithmetic mean, round to 1 decimal place. This refreshes automatically whenever reviews.json is updated (weekly via GitHub Actions).
- `areaServed` uses `@type: 'City'` for municipalities and `@type: 'Place'` for geographic corridors (I-40 Corridor, Historic Route 66, Grand Canyon South Rim) per schema.org conventions.
- Wikipedia `@id` links added only for 6 towns with known Wikipedia articles. Omitted for Kaibab Estates West, Crookton, Paulden, Grand Canyon South Rim, I-40 Corridor, Historic Route 66 to avoid broken entity links.
- `hasMap` uses the confirmed short Google Maps URL from CONTEXT.md rather than resolving to canonical form.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed import order to satisfy ESLint simple-import-sort rule**

- **Found during:** Task 1 (RestaurantSchema.astro edit)
- **Issue:** Initial import order placed `import type { Restaurant, WithContext }` before `import reviewsData` — violated simple-import-sort ESLint rule
- **Fix:** Ran `npm run lint:fix` to auto-sort imports; pre-commit hook also applied the fix during commit
- **Files modified:** src/components/schema/RestaurantSchema.astro
- **Verification:** `npm run test:quality` passed with 0 lint errors
- **Committed in:** 48b79be (part of Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - import sort lint error)
**Impact on plan:** Trivial auto-fix. No scope creep, no functional change.

## Issues Encountered

- First commit attempt failed commitlint: header too long (116 chars vs 100 max) and body line too long. Rewrote commit message with shorter header and wrapped body lines to comply with project conventions.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- RestaurantSchema now has all six new local SEO signals required for Phase 2
- Remaining Phase 2 plans (02-02 OrganizationSchema sameAs enrichment, 02-03 WebSiteSchema description) can proceed independently
- Phase 5 content pages (distance/directions) can reference the confirmed 12-entry areaServed list for consistent geographic targeting

---

_Phase: 02-schema-additions_
_Completed: 2026-02-21_

## Self-Check: PASSED

- FOUND: src/components/schema/RestaurantSchema.astro
- FOUND: .planning/phases/02-schema-additions/02-01-SUMMARY.md
- FOUND: commit 48b79be
