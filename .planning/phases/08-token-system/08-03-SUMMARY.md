---
phase: 08-token-system
plan: "03"
subsystem: styling
tags: [css, tokens, material-design-3, tailwindcss, components, migration]
dependency_graph:
  requires: [08-01]
  provides: [M3-component-migration-footer-story-location-order-map-button]
  affects: [Footer, OurStorySection, LocationSection, OrderSection, GoogleMap, AstroButton]
tech_stack:
  added: []
  patterns: [M3-token-classes, glass-utility, no-dark-prefix-overrides]
key_files:
  created: []
  modified:
    - src/components/Footer.astro
    - src/components/OurStorySection.astro
    - src/components/LocationSection.astro
    - src/components/OrderSection.astro
    - src/components/GoogleMap.tsx
    - src/components/ui/AstroButton.astro
decisions:
  - "OrderSection glassmorphism container uses glass utility class (not hardcoded backdrop-blur-xl) per D-14"
  - "AstroButton primary variant uses bg-primary-container/text-on-primary-container mirroring button.tsx pattern from Plan 02"
  - "Plan 01 foundation cherry-picked into worktree since parallel execution: worktree-agent-a8a61323 branched from main, not from worktree-agent-a4040b33"
metrics:
  duration: "~4m"
  completed: "2026-03-26"
  tasks_completed: 2
  files_modified: 6
---

# Phase 08 Plan 03: Gap Closure — Missed Component Migration Summary

**One-liner:** Migrated 6 remaining components (Footer, OurStorySection, LocationSection, OrderSection, GoogleMap, AstroButton) from hardcoded zinc/neutral/orange/dark: classes to M3 token utility classes, completing TOKEN-03 coverage.

## What Was Built

Completed the M3 token migration for the 6 component files that Plan 02 missed. All files now use M3 token utility classes exclusively with zero hardcoded zinc/neutral/orange color references and zero dark: prefix overrides.

### Task 1: Footer, OurStorySection, LocationSection

**Footer.astro** — 30+ zinc/orange class references replaced:
- Section background: `bg-surface`
- Section border: `border-outline-variant`
- Brand link text: `text-on-surface`
- Paragraph/address/phone/list text: `text-on-surface-variant`
- All hover states: `hover:text-on-surface`
- All focus rings: `focus-visible:ring-outline`
- Social divider and bottom bar borders: `border-outline-variant`
- Bottom bar text: `text-on-surface-variant`

**OurStorySection.astro** — orange-700/dark:orange-400 and zinc-700/dark:zinc-300 patterns replaced:
- Section background: `bg-surface`
- Heading: `text-on-surface`
- Body text paragraphs: `text-on-surface-variant`
- Stat numbers (25+, 900°F): `text-primary-container`
- Stat labels: `text-on-surface-variant`
- Glass overlay text: `text-on-surface` / `text-on-surface-variant`
- Mission/Vision/Values headings: `text-primary-container`
- Mission/Vision/Values body: `text-on-surface-variant`

**LocationSection.astro** — zinc-50/dark:bg-black and orange accent replaced:
- Section background: `bg-surface-container-low`
- Heading: `text-on-surface`
- Description: `text-on-surface-variant`
- Accent span ("Biker and Family Friendly!"): `text-primary-container`

### Task 2: OrderSection, GoogleMap, AstroButton

**OrderSection.astro** — Critical glassmorphism fix + color replacement:
- Section background: `bg-surface-container-low`
- Glassmorphism container: `glass` utility (was `bg-white/30 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10`) — now uses Plan 01's `glass` utility with `--glass-bg` and `--glass-border` CSS variables, auto-adapts per mode
- Heading: `text-on-surface`
- Body text: `text-on-surface-variant`
- Accent spans (Pickup, Curbside): `text-primary-container`
- Fine print: `text-on-surface-variant`
- Background image opacity: removed `dark:opacity-20` variant

**GoogleMap.tsx** — React component color replacement:
- Placeholder container: `bg-surface-container`
- Loading text: `text-on-surface-variant`

**AstroButton.astro** — Full variant system migrated to mirror button.tsx:
- `baseStyles`: `focus-visible:ring-outline` (was `ring-neutral-950` + `ring-orange-500`)
- `primary` variant: `bg-primary-container text-on-primary-container shadow hover:bg-primary-container/90 shadow-lg` (was neutral-900/50 dark: pair)
- `outline` variant: `border border-outline-variant bg-surface shadow-xs hover:bg-surface-container hover:text-on-surface` (was neutral-200/800 dark: pair)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Plan 01 M3 token foundation not present in worktree**
- **Found during:** Pre-task setup
- **Issue:** This worktree (`worktree-agent-a8a61323`) was based on the `main` branch which predates the Plan 01 M3 token globals.css rewrite. The `globals.css` still contained the old shadcn/brand HSL token system without M3 `@theme inline` utilities — meaning M3 token classes like `bg-surface-container-low` would not exist.
- **Fix:** Cherry-picked commit `d606a08` (Plan 01's globals.css rewrite + Phase 7 baseline components) from `worktree-agent-a4040b33` branch into current worktree. Committed as baseline prerequisite.
- **Files modified:** `src/styles/globals.css`, `astro.config.mjs`, `package.json`, `package-lock.json`, `knip.json`, and all component baseline files
- **Commit:** 4457047

## Verification Results

All acceptance criteria met:

| Check | Result |
|-------|--------|
| `Footer.astro` contains `bg-surface` | PASS |
| `Footer.astro` contains `text-on-surface-variant` | PASS |
| `Footer.astro` contains `focus-visible:ring-outline` | PASS |
| `Footer.astro` contains `border-outline-variant` | PASS |
| `Footer.astro` - zero `zinc-` | PASS |
| `Footer.astro` - zero `orange-` | PASS |
| `Footer.astro` - zero `dark:` | PASS |
| `OurStorySection.astro` contains `bg-surface` | PASS |
| `OurStorySection.astro` contains `text-primary-container` | PASS |
| `OurStorySection.astro` - zero `zinc-` | PASS |
| `OurStorySection.astro` - zero `orange-` | PASS |
| `OurStorySection.astro` - zero `dark:` | PASS |
| `LocationSection.astro` contains `bg-surface-container-low` | PASS |
| `LocationSection.astro` contains `text-primary-container` | PASS |
| `LocationSection.astro` - zero `zinc-` | PASS |
| `LocationSection.astro` - zero `orange-` | PASS |
| `LocationSection.astro` - zero `dark:` | PASS |
| `OrderSection.astro` contains `bg-surface-container-low` | PASS |
| `OrderSection.astro` contains `glass` utility class | PASS |
| `OrderSection.astro` - zero `backdrop-blur` | PASS |
| `OrderSection.astro` contains `text-primary-container` | PASS |
| `OrderSection.astro` - zero `dark:` | PASS |
| `GoogleMap.tsx` contains `bg-surface-container` | PASS |
| `GoogleMap.tsx` contains `text-on-surface-variant` | PASS |
| `GoogleMap.tsx` - zero `zinc-` | PASS |
| `GoogleMap.tsx` - zero `dark:` | PASS |
| `AstroButton.astro` contains `bg-primary-container text-on-primary-container` | PASS |
| `AstroButton.astro` contains `bg-surface shadow-xs hover:bg-surface-container` | PASS |
| `AstroButton.astro` contains `focus-visible:ring-outline` | PASS |
| `AstroButton.astro` - zero `neutral-` | PASS |
| `AstroButton.astro` - zero `zinc-` | PASS |
| `AstroButton.astro` - zero `orange-` | PASS |
| `AstroButton.astro` - zero `dark:` | PASS |
| `npm run build` completes | PASS |

## Known Stubs

None. All 6 components are fully wired to M3 token utility classes. No hardcoded color values or placeholder tokens remain.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Prerequisite | 4457047 | feat(08-01): Apply Plan 01 M3 token foundation (globals.css rewrite + Phase 7 baseline) |
| Task 1 | 4e7aa42 | feat(08-03): Migrate Footer, OurStorySection, LocationSection to M3 tokens |
| Task 2 | fac24a9 | feat(08-03): Migrate OrderSection, GoogleMap, AstroButton to M3 tokens |

## Self-Check: PASSED
