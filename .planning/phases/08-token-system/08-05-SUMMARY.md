---
phase: 08-token-system
plan: "05"
subsystem: styling
tags: [css, tokens, material-design-3, tailwindcss, gap-closure, zinc-migration, orange-migration, dark-override-removal]
dependency_graph:
  requires: [08-01, 08-02, 08-03, 08-04]
  provides: [TOKEN-03-complete, TOKEN-01-complete, TOKEN-02-complete, TOKEN-04-complete, TOKEN-05-complete]
  affects: [Hero, ReviewsSection, near-grand-canyon, MobileActionButtons]
tech_stack:
  added: []
  patterns: [M3-token-classes, surface-container-tokens, on-surface-tokens, glass-budget-compliance]
key_files:
  created: []
  modified:
    - src/components/Hero.astro
    - src/components/ReviewsSection.astro
    - src/pages/near-grand-canyon.astro
    - src/components/MobileActionButtons.astro
decisions:
  - "ReviewsSection review cards use bg-surface-container/border-outline-variant (no backdrop-blur) per D-15 glass budget — cards use tonal surface treatment, not blur"
  - "MobileActionButtons redundant bg-white/60 dark:bg-black/60 backdrop-blur-xl fallback layer removed entirely — parent .glass class already provides background and blur via --glass-bg"
  - "ReviewsSection Google/Yelp brand badge dark: overrides (blue-/red-) left intentionally — platform identity colors are out of scope per plan specification"
  - "Hero gradient overlay simplified to from-surface via-surface/10 to-transparent — surface token auto-adapts in dark mode, eliminating need for dark: prefix"
metrics:
  duration: "~8m"
  completed: "2026-03-25"
  tasks_completed: 2
  files_modified: 4
---

# Phase 08 Plan 05: Gap Closure — Remaining zinc/orange/dark Token Migration Summary

**One-liner:** Closed TOKEN-03 verification gaps by migrating all remaining hardcoded zinc-, orange-, and dark: color override classes in Hero.astro, ReviewsSection.astro, near-grand-canyon.astro, and MobileActionButtons.astro to M3 semantic token utility classes, with zero zinc-, orange-, or dark: color overrides remaining across all 4 files.

## What Was Built

### Task 1: Hero.astro and ReviewsSection.astro Migration

**Hero.astro — 5 replacements:**
- Section background: `bg-zinc-50 dark:bg-black` → `bg-surface`
- Gradient overlay: `from-white via-white/10 to-transparent dark:from-black dark:via-black/40 dark:to-transparent` → `from-surface via-surface/10 to-transparent` (surface token auto-adapts in dark mode)
- EST.2024 badge: `border-zinc-200 dark:border-white/20 bg-white/50 dark:bg-white/5 text-orange-700 dark:text-orange-300` → `border-outline-variant/30 bg-surface-container-high/50 text-primary-container`
- h1 text: `text-zinc-900 dark:text-white` → `text-on-surface`
- Body paragraph: `text-zinc-600 dark:text-zinc-400` → `text-on-surface-variant`

**ReviewsSection.astro — 10 replacements across review card interior (lines 57-109):**
- Card container: Replaced `bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-zinc-200 dark:border-white/10 shadow-zinc-200/50 dark:shadow-black/20 hover:border-orange-500/50 dark:hover:border-orange-500/40` with `bg-surface-container/80 border-outline-variant hover:border-primary-container/50` — `backdrop-blur-xl` removed (glass budget compliance per D-15)
- Quote icon: `text-orange-500/15 dark:text-orange-500/10 group-hover:text-orange-500/25 dark:group-hover:text-orange-500/20` → `text-primary-container/15 group-hover:text-primary-container/25`
- Gradient overlay: `from-orange-500/0 to-yellow-500/0 group-hover:from-orange-500/5 group-hover:to-yellow-500/5` → `from-primary-container/0 to-secondary-container/0 group-hover:from-primary-container/5 group-hover:to-secondary-container/5`
- Avatar border: `border-2 border-white/30 dark:border-white/20` → `border-2 border-outline-variant/30`
- Author name: `text-zinc-900 dark:text-zinc-100` → `text-on-surface`
- Review date: `text-zinc-500 dark:text-zinc-400` → `text-on-surface-variant`
- Star rating (filled): `fill-orange-500 text-orange-500` → `fill-primary-container text-primary-container`
- Star rating (empty): `text-zinc-300 dark:text-zinc-600` → `text-outline-variant`
- Review text: `text-zinc-700 dark:text-zinc-200` → `text-on-surface-variant`
- Bottom fade gradient: `from-white/90 dark:from-zinc-900/90` → `from-surface-container/90`

### Task 2: near-grand-canyon.astro and MobileActionButtons.astro Migration

**near-grand-canyon.astro — 1 replacement:**
- Garlic Naan dish card: `bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10` → `bg-surface-container border-outline-variant`

**MobileActionButtons.astro — 2 replacements:**
- Glass container shadow/border: Removed `dark:shadow-black/50`; replaced `border-white/20 dark:border-white/10` with `border-outline-variant/20`
- Redundant fallback layer: Removed `<div class="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl -z-10">` entirely — the parent `.glass` class already provides background via `--glass-bg` and blur via `backdrop-filter: blur(32px)`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prettier formatting divergence in Hero.astro after gradient class change**
- **Found during:** Task 2 verification (lint run)
- **Issue:** The gradient overlay div reformatting produced a prettier error on line 26 (multi-line vs single-line div with short class string)
- **Fix:** Ran `npm run lint:fix` to auto-correct formatting
- **Files modified:** src/components/Hero.astro
- **Commit:** `3283b40`

## Verification Results

All acceptance criteria met:

| Check | Result |
|-------|--------|
| `grep -c "zinc-" src/components/Hero.astro` | 0 (PASS) |
| `grep -c "orange-" src/components/Hero.astro` | 0 (PASS) |
| `grep -cE "dark:bg-\|dark:text-\|dark:border-" src/components/Hero.astro` | 0 (PASS) |
| `grep -c "zinc-" src/components/ReviewsSection.astro` | 0 (PASS) |
| `grep -c "orange-" src/components/ReviewsSection.astro` | 0 (PASS) |
| `grep "backdrop-blur" src/components/ReviewsSection.astro` | 0 matches (PASS) |
| `grep "bg-surface" src/components/Hero.astro` | 2 matches (PASS) |
| `grep "text-on-surface" src/components/Hero.astro` | 2 matches (PASS) |
| `grep "bg-surface-container" src/components/ReviewsSection.astro` | 2 matches (PASS) |
| `grep "text-primary-container" src/components/ReviewsSection.astro` | 3 matches (PASS) |
| `grep -c "zinc-" src/pages/near-grand-canyon.astro` | 0 (PASS) |
| `grep -cE "dark:bg-\|dark:border-" src/pages/near-grand-canyon.astro` | 0 (PASS) |
| `grep -c "dark:" src/components/MobileActionButtons.astro` | 0 (PASS) |
| `npm run build` | 4 page(s) built (PASS) |
| `npm run lint` | 0 errors (PASS) |

## Self-Check: PASSED

Verified all modified files and commits exist:

- src/components/Hero.astro — `bg-surface` confirmed, `text-on-surface` confirmed, zero zinc-/orange-/dark:
- src/components/ReviewsSection.astro — `bg-surface-container` confirmed, `text-primary-container` confirmed, zero zinc-/orange-, no backdrop-blur
- src/pages/near-grand-canyon.astro — `bg-surface-container border-outline-variant` on dish card confirmed, zero zinc-/dark:
- src/components/MobileActionButtons.astro — `border-outline-variant/20` confirmed, zero dark:, redundant fallback div removed
- Commit `54a701f` — Hero.astro and ReviewsSection.astro migration (exists)
- Commit `3283b40` — near-grand-canyon.astro and MobileActionButtons.astro migration (exists)

## Known Stubs

None — all token references use M3 utility classes wired to `globals.css @theme inline` block.
