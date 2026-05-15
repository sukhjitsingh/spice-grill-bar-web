---
phase: 14-speakable-coverage
plan: "02"
subsystem: aeo
tags: [speakable, schema-org, structured-data, voice-search, directions, astro]

# Dependency graph
requires:
  - phase: 14-speakable-coverage
    provides: "Plan 01 FAQ Speakable coverage (independent — wave parallel)"
provides:
  - "speakable-city-directions class on Flagstaff, Williams, Las Vegas primary direction paragraphs"
  - "SpeakableSpecification cssSelector extended from 3 to 4 entries on /directions/ page"
affects: [aeo-audit, voice-search, speakable-coverage]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "speakable-city-directions CSS class on per-city direction <p> elements for voice extraction"
    - "cssSelector array extended in existing SpeakableSpecification block (not a new schema block)"

key-files:
  created: []
  modified:
    - src/pages/directions.astro

key-decisions:
  - "speakable-city-directions prepended as first class in class list (class order has no semantic effect)"
  - "Prettier required multi-line array format for cssSelector — applied as lint deviation Rule 1 auto-fix"

patterns-established:
  - "Class-based Speakable annotation pattern: add .speakable-* class to target element, add selector to cssSelector array in page-specific SpeakableSpecification block"

requirements-completed: [AEO-13]

# Metrics
duration: 5min
completed: 2026-05-14
---

# Phase 14 Plan 02: Speakable Coverage — Directions City Paragraphs Summary

**SpeakableSpecification on /directions/ extended with `.speakable-city-directions` class on Flagstaff, Williams, and Las Vegas primary direction paragraphs, enabling voice assistants to extract per-city driving instructions**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-14T17:55:00Z
- **Completed:** 2026-05-14T18:01:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Added `speakable-city-directions` class to primary `<p>` in `#flagstaff`, `#williams`, and `#las-vegas` sections of `directions.astro`
- Extended Speakable `cssSelector` array from 3 entries to 4 entries (`.speakable-city-directions` as 4th entry)
- Confirmed `dist/directions/index.html` contains exactly 4 occurrences of `speakable-city-directions` (3 on elements + 1 in JSON-LD)
- All excluded sections (Seligman, Kingman, Los Angeles, Phoenix) and all `<address>` blocks remain unannotated per D-05
- `npm run build`, `npm run lint`, and `npm run test:aeo` all exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Add speakable-city-directions class to Flagstaff, Williams, Las Vegas paragraphs and extend cssSelector** - `4889db5` (feat)

## Files Created/Modified

- `src/pages/directions.astro` — Added `speakable-city-directions` class to 3 city `<p>` elements; extended Speakable `cssSelector` array from 3 to 4 entries

## Decisions Made

- Prettier's lint-staged hook reformatted the inline `cssSelector` array to multi-line format (one selector per line) — accepted as correct formatting, consistent with project style
- `speakable-city-directions` prepended as first class per RESEARCH.md A1 assumption (class order has no semantic effect in HTML)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prettier formatting required multi-line cssSelector array**
- **Found during:** Task 1 (commit hook triggered lint-staged)
- **Issue:** Single-line `"cssSelector": [".speakable-heading", ".speakable-lead", ".speakable-exit", ".speakable-city-directions"]` exceeded Prettier's print width, causing lint-staged eslint/prettier check to fail on first commit attempt
- **Fix:** Reformatted cssSelector array to multi-line (one selector per line per Prettier convention)
- **Files modified:** `src/pages/directions.astro`
- **Verification:** `npm run lint` exits 0; dist output confirms all 4 selectors present in JSON-LD
- **Committed in:** `4889db5` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - formatting/lint)
**Impact on plan:** Cosmetic formatting change only. Functional output is identical. No scope creep.

## Issues Encountered

None beyond the Prettier formatting auto-fix above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- AEO-13 complete — voice assistants can now extract city-specific driving directions from /directions/ for Flagstaff, Williams, and Las Vegas
- Both Plan 01 (FAQ Speakable) and Plan 02 (Directions Speakable extension) are ready for wave merge
- Phase 14 is fully complete upon merge

---
*Phase: 14-speakable-coverage*
*Completed: 2026-05-14*
