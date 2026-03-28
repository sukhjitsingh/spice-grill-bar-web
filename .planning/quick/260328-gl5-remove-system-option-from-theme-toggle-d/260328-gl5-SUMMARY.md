---
phase: quick
plan: 260328-gl5
subsystem: ui/theme
tags: [theme-toggle, ux, dark-mode]
dependency_graph:
  requires: []
  provides: [two-option-theme-toggle]
  affects: [src/components/mode-toggle.tsx, public/scripts/theme.js]
tech_stack:
  added: []
  patterns: [localStorage-only theme persistence]
key_files:
  created: []
  modified:
    - src/components/mode-toggle.tsx
    - public/scripts/theme.js
decisions:
  - Default theme is light when no localStorage value is stored (no OS preference detection)
metrics:
  duration: ~8min
  completed: 2026-03-28
  tasks_completed: 1
  files_modified: 2
---

# Quick Task 260328-gl5: Remove System Option from Theme Toggle Summary

**One-liner:** Simplified theme toggle to Light/Dark only by removing system/prefers-color-scheme detection; defaults to light when no preference is stored.

## What Was Done

Removed the "System" third option from the theme toggle dropdown. The toggle now presents exactly two choices: Light and Dark.

**mode-toggle.tsx:**
- Removed the `DropdownMenuItem` calling `setTheme('system')`
- Changed `setTheme` parameter type from `'light' | 'dark' | 'system'` to `'light' | 'dark'`
- Removed the `window.matchMedia('(prefers-color-scheme: dark)')` check from `isDark` calculation
- Removed the `if (newTheme === 'system') localStorage.removeItem('theme')` branch
- Simplified `isDark` to `const isDark = newTheme === 'dark'`
- Updated useState type from `'theme-light' | 'dark' | 'system'` to `'theme-light' | 'dark'`

**public/scripts/theme.js:**
- Removed `(!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)` fallback
- Init script now reads localStorage only: dark class applied if `theme === 'dark'`, otherwise removed (light default)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree config diverged from main repo**
- **Found during:** Task 1 build verification
- **Issue:** The worktree was created from an old branch commit (pre-v2.0 UI Facelift). Three files were incompatible with the installed TailwindCSS v4 / @fontsource-variable packages: `astro.config.mjs` (imported `@astrojs/tailwind` which doesn't exist), `src/styles/globals.css` (100-line TailwindCSS v3 file with `@tailwind base/components/utilities` and `border-border` apply), `src/layouts/Layout.astro` (imported `@fontsource/open-sans` and `@fontsource/playfair-display` which don't exist)
- **Fix:** Synced all three files to match the current main repo state
- **Files modified:** `astro.config.mjs`, `src/styles/globals.css`, `src/layouts/Layout.astro`
- **Commit:** eeb480e (included in task commit)

## Verification

- `npm run build` passes
- `grep -c "system" src/components/mode-toggle.tsx` → 0
- `grep -c "prefers-color-scheme" public/scripts/theme.js` → 0
- `npm run lint` passes (no errors)

## Known Stubs

None.

## Self-Check: PASSED

- `src/components/mode-toggle.tsx` — exists, no "system" string
- `public/scripts/theme.js` — exists, no "prefers-color-scheme"
- Commit eeb480e — verified in git log
