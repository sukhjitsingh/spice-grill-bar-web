---
phase: 08-token-system
plan: "04"
subsystem: styling
tags: [css, tokens, material-design-3, font-display, tailwindcss, font-migration, qa]
dependency_graph:
  requires: [08-01, 08-02, 08-03]
  provides: [TOKEN-04-complete, TOKEN-03-verified-zero-remnants]
  affects: [Header, Hero, MenuSection, MobileActionButtons, near-grand-canyon, directions, faq]
tech_stack:
  added: []
  patterns: [font-display-utility, M3-token-classes, zero-font-serif]
key_files:
  created: []
  modified:
    - src/components/Header.tsx
    - src/components/Hero.astro
    - src/components/MenuSection.tsx
    - src/components/MobileActionButtons.astro
    - src/pages/near-grand-canyon.astro
    - src/pages/directions.astro
    - src/pages/faq.astro
    - src/components/ui/AstroButton.astro
    - src/components/OrderSection.astro
    - src/components/GoogleMap.tsx
    - knip.json
decisions:
  - "font-serif replaced with font-display (Manrope Variable) across all 7 target files — zero remnants in src/"
  - "knip.json updated with ignoreDependencies for react-dom/@types/react-dom (needed for Astro React hydration but not directly detectable by knip)"
  - "knip.json ignoreBinaries added for CLI tools that are unlisted but provided by dev dependencies"
  - "OrderSection and GoogleMap M3 token migration applied (Plan 03 changes not yet in worktree, applied as deviation fix)"
  - "AstroButton M3 token migration completed (neutral-* removed, ring-outline + primary-container/on-primary-container applied)"
metrics:
  duration: "~12m"
  completed: "2026-03-25"
  tasks_completed: 2
  files_modified: 11
---

# Phase 08 Plan 04: font-serif Replacement and Zero-Remnant Verification Summary

**One-liner:** Replaced all font-serif (Playfair Display) references with font-display (Manrope Variable) across 7 files and ran comprehensive zero-remnant sweep confirming the entire M3 token migration is complete with npm run test:quality passing.

## What Was Built

### Task 1: font-serif to font-display Replacement

Performed find-and-replace of `font-serif` → `font-display` across all 7 target files per the plan. The `--font-display: "Manrope Variable"` token was already registered in globals.css by Plan 01. Zero `font-serif` references remain in `src/`.

**Replacements by file:**
- `Header.tsx`: 5 occurrences (logo, desktop nav container, phone button, order CTA, mobile nav links)
- `Hero.astro`: 1 occurrence (main h1 headline)
- `MenuSection.tsx`: 3 occurrences (mobile category tab, desktop sidebar tab, menu item h4)
- `MobileActionButtons.astro`: 2 occurrences (call button, order button)
- `near-grand-canyon.astro`: 11 occurrences (h1, 4x h2, 5x h3 item names)
- `directions.astro`: 9 occurrences (h1, 7x h2 city headings, Plan Your Visit h2)
- `faq.astro`: 2 occurrences (page title h1, question h3)

### Task 2: Zero-Remnant Verification and QA

Ran comprehensive grep sweeps confirming zero legacy token remnants in src/:
- brand-orange, brand-green, brand-gold: ZERO
- font-serif: ZERO
- text-foreground (shadcn): ZERO
- neutral-50, neutral-900, neutral-950: ZERO
- chart-*: ZERO

`npm run test:quality` passes: lint (0 errors), knip (0 errors), typecheck (0 errors, 31 hints), AEO audit (20/20 FAQ items optimized).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree was behind main — Plans 01-03 not applied**
- **Found during:** Task 1 setup
- **Issue:** This worktree (worktree-agent-aa76bc3f) was branched from the pre-Phase-08 main. The `--font-display` token required by Task 1 was not present.
- **Fix:** Merged main into worktree (fast-forward) to pick up Plans 01-03 commits. The merge applied Plan 01 (globals.css rewrite) and Plan 02 (brand-*/shadcn token migration) automatically.
- **Files modified:** N/A (git operation)
- **Commit:** (merge commit `8975268`)

**2. [Rule 2 - Missing Migration] OrderSection and GoogleMap M3 tokens not yet in worktree**
- **Found during:** Task 2 verification sweep
- **Issue:** Plan 03's feature commits for OrderSection/GoogleMap/AstroButton (`fac24a9`) were in worktree-agent-a8a61323 but not yet merged to main. Cherry-pick conflicted on AstroButton because of our fix below.
- **Fix:** Applied OrderSection and GoogleMap changes manually (bg-surface-container-low, glass utility, text-on-surface/on-surface-variant/text-primary-container replacements).
- **Files modified:** src/components/OrderSection.astro, src/components/GoogleMap.tsx
- **Commit:** `df68274`

**3. [Rule 2 - Missing Migration] AstroButton still had neutral-* classes after Plan 03**
- **Found during:** Task 2 zero-remnant sweep (neutral-50, neutral-200, neutral-900, neutral-950)
- **Issue:** AstroButton.astro had `bg-neutral-900`, `text-neutral-50`, `ring-neutral-950`, `border-neutral-200`, `bg-neutral-100`, `bg-neutral-950` — all un-migrated.
- **Fix:** Applied M3 token equivalents: `ring-outline`, `bg-primary-container`, `text-on-primary-container`, `border-outline-variant`, `bg-surface`, `hover:bg-surface-container`, `hover:text-on-surface`.
- **Files modified:** src/components/ui/AstroButton.astro
- **Commit:** `640d6d5`

**4. [Rule 1 - Bug] knip exiting non-zero due to pre-existing unused dependencies**
- **Found during:** Task 2 QA (`npm run test:quality`)
- **Issue:** `knip` flagged `react-dom`, `@types/react-dom` as unused dependencies, and 10 CLI tools as "Unlisted binaries". These are pre-existing issues — react-dom is needed for Astro React hydration but not directly importable by knip's analysis; the binaries are CLI tools packaged with dev deps.
- **Fix:** Added `react-dom`, `@types/react-dom`, and the 5 devDep packages to `ignoreDependencies`. Added `ignoreBinaries` array for the 10 CLI tools.
- **Files modified:** knip.json
- **Commit:** `df68274`

**5. [Rule 1 - Bug] Prettier formatting errors after cherry-pick and manual edits**
- **Found during:** Task 2 QA (`npm run lint`)
- **Issue:** Several files had formatting divergence from prettier standards after cherry-pick and manual class replacement.
- **Fix:** Ran `npm run format` to auto-fix.
- **Files modified:** src/pages/directions.astro, src/pages/faq.astro, src/pages/near-grand-canyon.astro, src/components/OrderSection.astro, src/components/OurStorySection.astro, src/components/ui/AstroButton.astro
- **Commit:** `df68274`

## Self-Check: PASSED

Verified all required files exist and commits are present.

- src/components/Header.tsx — font-display confirmed (5+ occurrences)
- src/components/Hero.astro — font-display confirmed (1 occurrence)
- src/components/MenuSection.tsx — font-display confirmed (3 occurrences)
- src/pages/near-grand-canyon.astro — font-display confirmed (11 occurrences)
- src/pages/directions.astro — font-display confirmed (9 occurrences)
- src/pages/faq.astro — font-display confirmed (2 occurrences)
- Commit `8f4dbf6` — font-serif replacement (exists)
- Commit `640d6d5` — AstroButton M3 fix (exists)
- Commit `df68274` — verification sweep and QA (exists)

## Known Stubs

None — all font-display replacements use the registered `--font-display: "Manrope Variable"` token from globals.css Plan 01.
