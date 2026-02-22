---
phase: 06-data-consistency-lighthouse
plan: 01
subsystem: seo
tags: [faq, schema, lighthouse-ci, tel-uri, e164, data-consistency]

# Dependency graph
requires:
  - phase: 05-geo-content-pages
    provides: directions.astro with existing E.164 tel: URIs; faq.json with prior distance corrections
provides:
  - Corrected Flagstaff distance in faq.json (51 miles / 46 minutes)
  - All tel: URIs in codebase standardized to E.164 format (tel:+19282771292)
  - Full Lighthouse CI coverage for all 4 live pages
affects: [future seo phases, lhci reporting, faq data consumers]

# Tech tracking
tech-stack:
  added: []
  patterns: [E.164 tel: URI format for all phone href attributes]

key-files:
  created: []
  modified:
    - src/data/faq.json
    - src/components/Footer.astro
    - src/components/Header.tsx
    - src/components/MobileActionButtons.astro
    - .lighthouserc.json

key-decisions:
  - "faq.json Flagstaff entry corrected: 50 miles → 51 miles, 40-minute → 46-minute (matches near-grand-canyon.astro and 06-RESEARCH.md)"
  - "tel: URI standardization applies href only — visible display text (928) 277-1292 unchanged"
  - "/faq/ added to .lighthouserc.json completing 4-URL LHCI coverage for all live pages"

patterns-established:
  - "All phone href attributes use E.164 format: tel:+19282771292 (not bare tel:9282771292)"
  - "Lighthouse CI url array must include every live page routed in src/pages/"

requirements-completed: [FAQ-01, CONT-02, CONT-05]

# Metrics
duration: 5min
completed: 2026-02-22
---

# Phase 6 Plan 01: Data Consistency and Lighthouse Coverage Summary

**Corrected Flagstaff distance drift (50→51 miles, 40→46 min) in faq.json, standardized all tel: URIs to E.164 (tel:+19282771292) across 3 components, and expanded Lighthouse CI to audit all 4 live pages**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-22T00:29:00Z
- **Completed:** 2026-02-22T00:34:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- faq.json Flagstaff entry now reads "51 miles west of Flagstaff" and "46-minute drive" — consistent with near-grand-canyon.astro and directions.astro data surfaces
- All bare tel:9282771292 links eliminated from src/ — Footer.astro, Header.tsx, and MobileActionButtons.astro now use tel:+19282771292 (E.164 standard)
- .lighthouserc.json url array expanded from 3 to 4 URLs, adding /faq/ — all live pages now audited on every push
- npm run qa passed clean: build + lint + typecheck + AEO audit + Lighthouse CI across all 4 pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix faq.json Flagstaff distance and standardize tel: URIs across 3 components** - `10924f8` (fix)
2. **Task 2: Add /faq/ to Lighthouse CI and run full QA** - `5aedf1b` (chore)

## Files Created/Modified

- `src/data/faq.json` - Flagstaff entry: "about 50 miles" → "about 51 miles", "40-minute" → "46-minute drive"
- `src/components/Footer.astro` - Phone href: tel:9282771292 → tel:+19282771292
- `src/components/Header.tsx` - Phone href: tel:9282771292 → tel:+19282771292
- `src/components/MobileActionButtons.astro` - Phone href: tel:9282771292 → tel:+19282771292
- `.lighthouserc.json` - url array: added "/faq/" as 4th entry

## Decisions Made

None - followed plan as specified. All changes were direct data corrections with no ambiguity.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- First commit attempt failed commitlint validation: subject-case rule requires sentence-case. Fixed by capitalizing first word of commit subject ("Correct" instead of "correct"). Both commits succeeded on second attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All known data inconsistencies from the v1.0 milestone audit are resolved
- Lighthouse CI now audits all 4 live pages — full coverage gap closed
- Phase 6 plan 01 is the only plan in this phase — phase complete

---
*Phase: 06-data-consistency-lighthouse*
*Completed: 2026-02-22*
