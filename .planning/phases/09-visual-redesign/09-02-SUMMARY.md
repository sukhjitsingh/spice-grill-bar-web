---
phase: 09-visual-redesign
plan: 02
subsystem: ui
tags: [hero, seo, aeo, astro, typography]

requires:
  - phase: 09-01
    provides: Typography @utility classes (text-display-lg, text-body-lg, text-label-sm)
provides:
  - Info-rich Hero with crawlable business data above the fold
  - D-08 story-driven section order on home page
affects: [09-05]

tech-stack:
  added: []
  patterns: [info-rich-hero, story-driven-flow]

key-files:
  created: []
  modified:
    - src/components/Hero.astro
    - src/pages/index.astro

key-decisions:
  - "Hero CTA points to Toast ordering URL (consistent with OrderSection, Header, MobileActionButtons)"
  - "Star rating uses 5 individual Star icons rather than a map loop for Astro SSR compatibility"

patterns-established:
  - "Info-rich hero: business name H1 + cuisine + location + hours + phone + rating + dual CTAs"

requirements-completed: [VISUAL-06, VISUAL-10]

duration: 3min
completed: 2026-03-26
---

# Plan 09-02: Hero Redesign Summary

**Info-rich Hero with crawlable SEO data (name, hours, phone, rating) and D-08 story-driven section order**

## Performance

- **Duration:** 3 min
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Rewrote Hero.astro with "Spice Grill & Bar" H1 in text-display-lg, no orange text on heading
- Added hours, phone link, star rating (4.8/5), and dual CTAs (ORDER NOW + VIEW MENU) above fold
- Reordered index.astro: Hero > OurStory > Reviews > Menu > Order > Location per D-08
- Replaced manual gradients with hero-gradient utility, bg-surface-dim background

## Task Commits

1. **Task 1+2: Hero rewrite + section reorder** - `f1a09e5` (feat)

## Files Created/Modified
- `src/components/Hero.astro` - Complete rewrite with info-rich SEO layout
- `src/pages/index.astro` - Section render order changed to D-08 flow

## Decisions Made
- Used Toast ordering URL from existing OrderSection for ORDER NOW CTA
- Star icons rendered individually (not via Array.map) for Astro SSR

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
None

## Next Phase Readiness
- Hero complete, all remaining home sections ready for reskinning in 09-03 and 09-04

---
*Phase: 09-visual-redesign*
*Completed: 2026-03-26*
