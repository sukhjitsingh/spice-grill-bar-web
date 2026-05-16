---
phase: 12-schema-entity-disambiguation
plan: 02
subsystem: aeo
tags: [aeo, schema, llms-txt, ci-gate, astro]

# Dependency graph
requires:
  - phase: 12-schema-entity-disambiguation/plan-01
    provides: "@id fragments added to RestaurantSchema and OrganizationSchema"
provides:
  - "AI crawler discovery links for llms.txt and llms-full.txt via rel=alternate type=text/plain"
  - "@id fragment CI gate in aeo-audit.mjs enforcing #restaurant and #organization fragments in built output"
affects: [12-schema-entity-disambiguation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AEO gate pattern: path.join(ROOT_DIR, ...) + fs.existsSync guard + fs.readFileSync + .includes() literal string check"
    - "Graceful CI gate skip: warn without incrementing errors when optional build artifact absent"

key-files:
  created: []
  modified:
    - src/layouts/Layout.astro
    - scripts/aeo-audit.mjs

key-decisions:
  - "D-05: Replace rel=help with rel=alternate type=text/plain in-place at manifest link position; add llms-full.txt link immediately after"
  - "D-03: @id gate reads dist/index.html literal strings with JSON.stringify output format (no spaces around colon)"
  - "D-04: Gate skips gracefully with console.warn (not errors++) when dist/index.html absent so test:aeo runs standalone"

patterns-established:
  - "AEO gate pattern: check dist artifact existence before reading, warn on skip, error++ on missing content"
  - "AI crawler discovery: rel=alternate type=text/plain for plain-text content mirrors"

requirements-completed: [AEO-16]

# Metrics
duration: 8min
completed: 2026-05-14
---

# Phase 12 Plan 02: Schema Entity Disambiguation Summary

**AI crawler discovery wired via rel=alternate text/plain links for llms.txt + llms-full.txt, and @id fragment CI gate added to aeo-audit.mjs with graceful skip when dist/ absent**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-14T00:00:00Z
- **Completed:** 2026-05-14T00:08:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Replaced incorrect `rel="help"` with `rel="alternate" type="text/plain"` for llms.txt in Layout.astro `<head>` (per D-05, in-place at manifest link position)
- Added second `rel="alternate" type="text/plain"` link for llms-full.txt immediately after
- Added @id fragment gate to aeo-audit.mjs that reads dist/index.html after build and checks for both `#restaurant` and `#organization` @id fragment literal strings
- Gate skips gracefully with a warning (zero errors++) when dist/index.html is absent, enabling standalone `npm run test:aeo` without a prior build

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix llms.txt link relation and add llms-full.txt discovery link** - `524c322` (feat)
2. **Task 2: Add @id fragment gate to aeo-audit.mjs** - `14a114b` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `src/layouts/Layout.astro` - Replaced `rel="help"` with `rel="alternate" type="text/plain"` for llms.txt; added matching link for llms-full.txt
- `scripts/aeo-audit.mjs` - Added gate #4: reads dist/index.html for `@id` fragment validation

## Decisions Made
- Used exact JSON.stringify literal strings (`"@id":"https://spicegrillbar66.com/#restaurant"` with no spaces) per D-03 to match minified build output
- Gate placed as section #4 immediately before final summary block, consistent with existing gate ordering (FAQ -> llms.txt -> robots.txt -> @id)
- `console.warn` (not `console.error`) used for the skip message since no failure has occurred

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- First commit attempt failed commitlint `subject-case` check. Fixed by capitalizing subject: "Fix llms.txt..." not "fix llms.txt...". Pre-commit hook auto-formatted files via lint-staged (Prettier/ESLint) before validation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both llms.txt and llms-full.txt are now discoverable by AI crawlers via correct link relations
- @id fragment gate will enforce regression protection once Plan 01's @id additions are merged and a build is run
- `npm run test:aeo` passes standalone (without dist/) with a skip warning for the @id gate
- After Plan 01 merges and `npm run build` runs, `npm run test:aeo` will validate both `#restaurant` and `#organization` @id fragments in built output

## Self-Check

### Files exist
- `src/layouts/Layout.astro` - FOUND (verified via grep: 2 alternate links, 0 rel=help)
- `scripts/aeo-audit.mjs` - FOUND (verified via grep: both literal @id strings present)

### Commits exist
- `524c322` - feat(12-02): Fix llms.txt link relation and add llms-full.txt discovery link
- `14a114b` - feat(12-02): Add @id fragment gate to aeo-audit.mjs

## Self-Check: PASSED

---
*Phase: 12-schema-entity-disambiguation*
*Completed: 2026-05-14*
