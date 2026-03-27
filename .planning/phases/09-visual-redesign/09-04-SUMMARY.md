---
phase: 09-visual-redesign
plan: 04
subsystem: ui
tags: [react, astro, menu, header, tokens, glass-budget]

requires:
  - phase: 09-01
    provides: Typography @utility classes
provides:
  - Reskinned MenuSection with tonal sidebar, no glass or borders
  - Reskinned OrderSection with cta-gradient, no Unsplash image
  - Reskinned LocationSection with tonal map container
  - Updated Header typography and SheetContent glass-card
affects: [09-05]

tech-stack:
  added: []
  patterns: [glass-budget-enforcement, tonal-sidebar]

key-files:
  created: []
  modified:
    - src/components/MenuSection.tsx
    - src/components/OrderSection.astro
    - src/components/LocationSection.astro
    - src/components/Header.tsx

key-decisions:
  - "Menu sidebar uses bg-surface-container-high instead of .glass (not on glass budget)"
  - "OrderSection Unsplash background removed, cta-gradient is the intended background"
  - "Header desktop separator border-l kept (functional chrome separator per research)"

patterns-established:
  - "Glass budget: backdrop-blur only on Header, Sheet, Dropdown, OrderSection card, OurStory caption"

requirements-completed: [VISUAL-02, VISUAL-03, VISUAL-06]

duration: 5min
completed: 2026-03-27
---

# Plan 09-04: Menu/Order/Location/Header Reskin Summary

**Glass budget enforced across 4 components — sidebar tonal, Unsplash removed, header typography updated**

## Performance

- **Duration:** 5 min
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- MenuSection: bg-surface-container-low, tonal sidebar/nav, heading-md category headings, primary-container prices
- OrderSection: bg-surface-dim + cta-gradient, removed Unsplash background, text-display-md heading
- LocationSection: bg-surface-container, tonal map container (glass-card removed)
- Header: text-label-sm uppercase logo, text-body-md nav links, SheetContent glass-card (no border-l)

## Task Commits

1. **Tasks 1-2: Menu + Order/Location/Header reskin** - `0ceaedd` (feat)

## Files Created/Modified
- `src/components/MenuSection.tsx` - Tonal sidebar, no glass/borders, editorial typography
- `src/components/OrderSection.astro` - cta-gradient background, removed Unsplash URL
- `src/components/LocationSection.astro` - bg-surface-container, tonal map container
- `src/components/Header.tsx` - text-label-sm logo, text-body-md nav, glass-card SheetContent

## Decisions Made
- Kept Header desktop separator border-l (functional chrome separator, not structural)
- Menu sidebar uses bg-surface-container-high (ambient card, not glass budget)

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
None

---
*Phase: 09-visual-redesign*
*Completed: 2026-03-27*
