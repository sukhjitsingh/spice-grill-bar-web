---
phase: 04-content-infrastructure
plan: 01
subsystem: seo
tags: [astro, breadcrumb, schema, footer, lighthouse-ci, tailwind]

# Dependency graph
requires:
  - phase: 01-schema-fixes
    provides: correct BreadcrumbSchema component accepting items prop
provides:
  - slugToLabel() function in Layout.astro for human-readable breadcrumb labels
  - .lighthouserc.json with /near-grand-canyon/ and /directions/ URLs
  - Footer Explore section with page links and social links
affects:
  - 05-geo-content-pages (inherits clean breadcrumbs, LHCI coverage, footer nav)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Acronym map pattern: BREADCRUMB_ACRONYMS Record<string, string> in Layout.astro for slug-to-label overrides"
    - "slugToLabel() splits on hyphen, title-cases each word, checks acronym map first"

key-files:
  created: []
  modified:
    - src/layouts/Layout.astro
    - src/components/Footer.astro
    - .lighthouserc.json
    - .planning/ROADMAP.md

key-decisions:
  - "slugToLabel uses BREADCRUMB_ACRONYMS map so 'faq' -> 'FAQ' without case-insensitive hacks"
  - "Footer social links moved from bottom bar to Explore section with icon+text labels"
  - "Bottom bar is now copyright-only (flex justify-center, no social links, no FAQ link)"
  - "LHCI URL array includes /near-grand-canyon/ and /directions/ even though pages do not exist until Phase 5"
  - "Header navigation unchanged per user decision in CONTEXT.md"

patterns-established:
  - "Breadcrumb label override: add entry to BREADCRUMB_ACRONYMS in Layout.astro frontmatter"
  - "Footer column pattern: grid-cols-1 sm:grid-cols-2 md:grid-cols-4 for 4 equal columns"

requirements-completed: [CONT-01, CONT-02, CONT-03]

# Metrics
duration: 4min
completed: 2026-02-21
---

# Phase 4 Plan 01: Content Infrastructure Summary

**slugToLabel() with acronym map in Layout.astro produces clean breadcrumb labels; Footer restructured with 4-column grid and Explore section (page links + social links with icon+text); LHCI URL list extended to cover Phase 5 pages**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-21T20:23:52Z
- **Completed:** 2026-02-21T20:27:50Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- BreadcrumbSchema now generates "FAQ" for /faq/, "Near Grand Canyon" for /near-grand-canyon/, "Directions" for /directions/ via slugToLabel() with BREADCRUMB_ACRONYMS map
- Footer restructured from 3-column (2+1+1) to 4-column (1+1+1+1) with new Explore section containing Near Grand Canyon, Directions, FAQ links plus Instagram and Facebook social links (icon+text labels)
- Bottom bar cleaned up to copyright-only (social links and FAQ link removed from bottom bar, moved to Explore section)
- .lighthouserc.json url array extended from ["/"] to ["/", "/near-grand-canyon/", "/directions/"] for Phase 5 Lighthouse CI coverage
- ROADMAP.md Phase 4 success criteria updated (header nav requirement removed per user decision)

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix breadcrumb label generation and add LHCI URLs** - `406ddb9` (feat)
2. **Task 2: Restructure footer with Explore section and update ROADMAP** - `f75fe29` (feat)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `src/layouts/Layout.astro` - Added BREADCRUMB_ACRONYMS map and slugToLabel() function; replaced manual string manipulation in BreadcrumbSchema call
- `src/components/Footer.astro` - Changed to 4-column grid; added Explore section with page links and social links; bottom bar is now copyright-only
- `.lighthouserc.json` - Added /near-grand-canyon/ and /directions/ to url array
- `.planning/ROADMAP.md` - Phase 4 success criteria updated; plans section updated; progress table updated to Complete

## Decisions Made

- slugToLabel() uses a BREADCRUMB_ACRONYMS map keyed on lowercase word so "faq" -> "FAQ" — this pattern is extensible (add "gtc": "GTC" etc.)
- Social links moved to Explore section with `<span>` text labels alongside icons for accessibility and discoverability
- Bottom bar changed from `flex-col md:flex-row justify-between` to `flex justify-center` since it now has only one element
- Header navigation explicitly left unchanged per CONTEXT.md locked decision

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Commitlint enforces sentence-case for the subject line. First commit attempt failed on "fix" subject starting with lowercase. Resolved by capitalizing subject on retry.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 5 (GEO Content Pages) can begin immediately
- /near-grand-canyon/ and /directions/ pages will automatically inherit clean breadcrumb labels, Lighthouse CI coverage, and footer navigation links
- LHCI will 404 on new URLs until Phase 5 pages are built (expected and acceptable per CONT-02)
- All distance/drive-time figures for Phase 5 pages must be verified against Google Maps before publishing (existing blocker in STATE.md)

---
*Phase: 04-content-infrastructure*
*Completed: 2026-02-21*
