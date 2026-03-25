---
phase: 07-infrastructure
plan: 01
subsystem: infra
tags: [tailwindcss, tailwindcss-v4, vite, fontsource, astro, tw-animate-css]

# Dependency graph
requires: []
provides:
  - TailwindCSS v4 with @tailwindcss/vite plugin in astro.config.mjs vite.plugins[]
  - CSS-first configuration via @import "tailwindcss" + @theme inline token mapping
  - Dark mode via @custom-variant dark (&:where(.dark, .dark *))
  - tw-animate-css replacing tailwindcss-animate for Sheet/DropdownMenu/MobileActionButtons animations
  - Variable fonts: Manrope Variable and Inter Variable installed alongside legacy fonts
  - All v4 breaking utility renames applied: shadow-xs, outline-hidden, rounded-full! suffix
affects:
  - 08-tokens
  - 09-visual
  - 10-qa

# Tech tracking
tech-stack:
  added:
    - tailwindcss@4.2.2 (upgraded from 3.4.19)
    - "@tailwindcss/vite@4.2.2 (replaces @astrojs/tailwind)"
    - tw-animate-css (replaces tailwindcss-animate)
    - "@fontsource-variable/manrope"
    - "@fontsource-variable/inter"
  patterns:
    - CSS-first Tailwind: @import "tailwindcss" + @theme inline {} in globals.css
    - Custom variant: @custom-variant dark (&:where(.dark, .dark *)) for class-based dark mode
    - Custom utilities: @utility directive replaces @layer utilities
    - Full HSL values in CSS vars (not bare triples): --background: hsl(0 0% 100%)

key-files:
  created: []
  modified:
    - astro.config.mjs (tailwindcss() in vite.plugins[], @astrojs/tailwind removed from integrations[])
    - src/styles/globals.css (complete CSS-first v4 rewrite with @theme inline, @custom-variant, @utility)
    - src/layouts/Layout.astro (Manrope Variable and Inter Variable font imports added)
    - package.json (packages swapped: added @tailwindcss/vite, tw-animate-css, fonts; removed @astrojs/tailwind, tailwindcss-animate, autoprefixer)
    - knip.json (tailwindcss and tw-animate-css added to ignoreDependencies; cleanup of removed entries)
    - src/components/ui/button.tsx (shadow-xs, outline-hidden)
    - src/components/ui/AstroButton.astro (shadow-xs, outline-hidden, rounded-full!)
    - src/components/ui/dropdown-menu.tsx (outline-hidden, origin-(--radix-*) syntax)
    - src/components/ui/sheet.tsx (outline-hidden)
    - src/components/MenuSection.tsx (shadow-xs)
    - src/components/Footer.astro (outline-hidden)
    - src/components/Header.tsx (outline-hidden)
    - src/pages/near-grand-canyon.astro (shadow-xs)
    - src/pages/directions.astro (shadow-xs)
    - src/pages/faq.astro (shadow-xs)

key-decisions:
  - "tailwindcss and tw-animate-css added to knip ignoreDependencies — CSS @import usage invisible to knip's JS module graph"
  - "outline-none replacement extended to Footer.astro and Header.tsx (not in plan's file list but required by acceptance criteria)"
  - "origin-[--radix-*] converted to origin-(--radix-*) in dropdown-menu.tsx for v4 CSS var arbitrary value syntax"

patterns-established:
  - "Vite plugins in vite.plugins[], Astro integrations in integrations[] — never mix"
  - "All CSS tokens as full hsl() values, not bare triples, then exposed via @theme inline"
  - "Custom utilities use @utility directive, not @layer utilities"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06]

# Metrics
duration: 20min
completed: 2026-03-25
---

# Phase 07 Plan 01: TailwindCSS v4 Migration Summary

**TailwindCSS v3 to v4 migration: @tailwindcss/vite plugin, CSS-first @theme inline config, tw-animate-css, Manrope/Inter variable fonts, and all breaking utility renames across 14 files**

## Performance

- **Duration:** 20 min
- **Started:** 2026-03-25T03:53:39Z
- **Completed:** 2026-03-25T04:14:05Z
- **Tasks:** 3
- **Files modified:** 15 (+ package-lock.json)

## Accomplishments

- Site builds cleanly on TailwindCSS v4 with @tailwindcss/vite in vite.plugins[] — confirmed by `npm run build` exit 0
- CSS-first configuration: tailwind.config.mjs deleted, globals.css rewritten with @import "tailwindcss", @theme inline token mapping, @custom-variant dark, and @utility directives
- All v4 breaking utility renames applied: shadow-sm -> shadow-xs (20 instances), outline-none -> outline-hidden (15 instances across 7 files), !rounded-full -> rounded-full!, origin-[--radix-*] -> origin-(--radix-*)
- Variable fonts Manrope and Inter installed alongside legacy Open Sans/Playfair Display (D-02 kept)
- `npm run qa` passes exit 0: build + lint + knip + typecheck + aeo + Lighthouse CI on all 4 pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Package swap and configuration migration** - `1135de2` (feat)
2. **Task 2: Apply v4 breaking utility renames** - `40cf3fd` (feat)
3. **Task 3: Build verification and issue resolution** - `7ba9c8f` (chore)

## Files Created/Modified

- `astro.config.mjs` - Replaced @astrojs/tailwind integration with tailwindcss() in vite.plugins[]
- `src/styles/globals.css` - Complete v4 CSS-first rewrite: @import tailwindcss, @theme inline, @custom-variant dark, @utility glass directives, full HSL CSS vars
- `src/layouts/Layout.astro` - Added @fontsource-variable/manrope/wght.css and inter/wght.css imports
- `package.json` - Swapped tailwindcss v3→v4, added @tailwindcss/vite + tw-animate-css + variable fonts, removed @astrojs/tailwind + tailwindcss-animate + autoprefixer
- `knip.json` - Added tailwindcss/tw-animate-css to ignoreDependencies, removed deleted file references, cleaned entry patterns
- `src/components/ui/button.tsx` - shadow-xs, focus-visible:outline-hidden
- `src/components/ui/AstroButton.astro` - shadow-xs, focus-visible:outline-hidden, rounded-full!
- `src/components/ui/dropdown-menu.tsx` - 4x outline-hidden, 2x origin-(--radix-*) CSS var syntax
- `src/components/ui/sheet.tsx` - focus:outline-hidden
- `src/components/MenuSection.tsx` - shadow-xs
- `src/components/Footer.astro` - 8x focus-visible:outline-hidden
- `src/components/Header.tsx` - 3x focus-visible:outline-hidden
- `src/pages/near-grand-canyon.astro` - 6x shadow-xs
- `src/pages/directions.astro` - 8x shadow-xs
- `src/pages/faq.astro` - shadow-xs

## Decisions Made

- `tw-animate-css` and `tailwindcss` added to knip.json ignoreDependencies: both are consumed via CSS `@import` in globals.css, invisible to knip's JS module graph — without this, knip would fail the quality gate with "unused dependency" errors
- `outline-none` -> `outline-hidden` extended to Footer.astro and Header.tsx beyond the plan's listed files: acceptance criteria explicitly requires zero matches for `grep "\boutline-none\b" src/` across all .tsx and .astro files
- `origin-[--radix-dropdown-menu-content-transform-origin]` -> `origin-(--radix-dropdown-menu-content-transform-origin)`: v4 CSS variable arbitrary value syntax; bracket notation with bare `--var` is deprecated in v4 in favor of parentheses

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Extended outline-none replacement to Footer.astro and Header.tsx**
- **Found during:** Task 2 (Apply v4 breaking utility renames)
- **Issue:** Plan listed 6 files for rename, but Footer.astro (8 instances) and Header.tsx (3 instances) also contained `outline-none`. Acceptance criteria requires zero matches across ALL src/ .tsx and .astro files.
- **Fix:** Applied same `outline-none` -> `outline-hidden` replacement to both files
- **Files modified:** src/components/Footer.astro, src/components/Header.tsx
- **Verification:** `grep -rn "\boutline-none\b" src/` returns 0 matches
- **Committed in:** 40cf3fd (Task 2 commit)

**2. [Rule 2 - Missing Critical] Updated knip.json for CSS-only package tracking**
- **Found during:** Task 3 (Build verification)
- **Issue:** `npm run knip` failed with "Unused dependencies: tw-animate-css, tailwindcss" — both packages are consumed via CSS @import, which knip cannot detect
- **Fix:** Added both to ignoreDependencies in knip.json; also removed autoprefixer (uninstalled), tailwind.config.mjs reference (deleted file), and stale entry patterns
- **Files modified:** knip.json
- **Verification:** `npm run knip` exits 0
- **Committed in:** 7ba9c8f (Task 3 commit)

**3. [Rule 1 - Bug] Fixed arbitrary CSS variable syntax in dropdown-menu.tsx**
- **Found during:** Task 2 (Apply v4 breaking utility renames)
- **Issue:** `origin-[--radix-dropdown-menu-content-transform-origin]` uses v4-deprecated bracket syntax for CSS variables
- **Fix:** Converted to parentheses syntax: `origin-(--radix-dropdown-menu-content-transform-origin)`
- **Files modified:** src/components/ui/dropdown-menu.tsx
- **Verification:** Build passes, no CSS errors
- **Committed in:** 40cf3fd (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 missing critical files, 1 missing critical config, 1 bug)
**Impact on plan:** All auto-fixes required for quality gate compliance and v4 correctness. No scope creep.

## Issues Encountered

- npm package conflict: installing @fontsource-variable/* failed while @astrojs/tailwind was still present (peer conflict with tailwindcss v4). Resolved by uninstalling @astrojs/tailwind first, then installing font packages.

## Next Phase Readiness

- TailwindCSS v4 foundation is stable — Phase 8 (token system) can begin building on @theme inline
- Light mode surface token values require owner sign-off before Phase 8 planning begins (DESIGN.md does not specify them — see STATE.md blocker)
- All Lighthouse thresholds maintained (CLS < 0.1 confirmed, no regression from v1.0 baseline)
- Animation classes confirmed working: tw-animate-css provides all Sheet/DropdownMenu/MobileActionButtons animation classes

---
*Phase: 07-infrastructure*
*Completed: 2026-03-25*
