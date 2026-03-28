---
phase: 10-quality-assurance
plan: 01
subsystem: test-infrastructure
tags: [playwright, axe-core, dark-mode, lhci, testing]
dependency_graph:
  requires: []
  provides: [playwright-config, dark-lhci-config, dark-axe-script, test-npm-scripts]
  affects: [package.json, knip.json, .gitignore]
tech_stack:
  added: ["@playwright/test@1.58.2", "playwright", "axe-core@4.11.1", "glob"]
  patterns: [playwright-script-audit, dark-mode-dist-injection]
key_files:
  created:
    - playwright.config.ts
    - .lighthouserc.dark.json
    - scripts/build-dark.mjs
    - scripts/axe-dark.mjs
  modified:
    - package.json
    - knip.json
    - .gitignore
    - package-lock.json
decisions:
  - "reducedMotion placed in contextOptions per Playwright v1.58 type system (not directly in use)"
  - "playwright and glob installed as explicit devDependencies since scripts/ imports them directly"
metrics:
  duration: "8 min"
  completed: "2026-03-27"
  tasks_completed: 2
  tasks_total: 2
---

# Phase 10 Plan 01: Test Infrastructure Setup Summary

Playwright installed with chromium, 4 new npm scripts wired (test:e2e, build:dark, test:lhci:dark, test:axe:dark), dark LHCI config targeting dist-dark, axe-core contrast audit script for dark mode on all 4 pages.

## What Was Done

### Task 1: Install Playwright and create config + dark LHCI infrastructure

- Installed `@playwright/test`, `playwright`, `axe-core`, and `glob` as devDependencies
- Installed Playwright chromium browser via `npx playwright install chromium`
- Created `playwright.config.ts` with e2e testDir, webServer auto-start on localhost:4321, and reducedMotion context option
- Created `.lighthouserc.dark.json` mirroring the existing LHCI config but targeting `./dist-dark`
- Created `scripts/build-dark.mjs` that copies dist/ to dist-dark/ and injects `class="dark"` on all HTML files
- Added 4 npm scripts to package.json: test:e2e, build:dark, test:lhci:dark, test:axe:dark
- Updated knip.json with ignoreDependencies for @playwright/test, playwright, axe-core, glob
- Updated knip.json ignoreBinaries with playwright
- Added dist-dark/, test-results/, playwright-report/ to .gitignore
- Verified `qa` script unchanged

### Task 2: Create dark mode axe-core audit script

- Created `scripts/axe-dark.mjs` using Playwright (not @playwright/test) to launch chromium
- Script loads all 4 pages (/, /near-grand-canyon/, /directions/, /faq/) on localhost:4321
- Injects `.dark` class via `classList.add('dark')` and sets localStorage theme
- Runs axe-core with `runOnly: ['color-contrast']` for focused contrast checking
- Reports element HTML and failure summary per violation
- Exits non-zero on any violation for CI compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed reducedMotion placement in playwright.config.ts**
- **Found during:** Task 1 verification (npm run test:quality)
- **Issue:** Playwright v1.58 types require `reducedMotion` inside `contextOptions`, not directly in `use`
- **Fix:** Moved `reducedMotion: 'no-preference'` into `use.contextOptions`
- **Files modified:** playwright.config.ts
- **Commit:** 428b07f

**2. [Rule 3 - Blocking] Added missing devDependencies for scripts**
- **Found during:** Task 1 verification (knip flagged unlisted deps)
- **Issue:** `playwright` and `glob` used as direct imports in scripts/ but not listed in devDependencies
- **Fix:** Installed both as explicit devDependencies, added to knip ignoreDependencies
- **Files modified:** package.json, package-lock.json, knip.json
- **Commit:** 428b07f

## Verification Results

- `npx playwright --version` returns 1.58.2
- `node -c scripts/build-dark.mjs` passes (valid syntax)
- `node -c scripts/axe-dark.mjs` passes (valid syntax)
- `.lighthouserc.dark.json` staticDistDir is `./dist-dark`
- `npm run test:quality` passes (lint, knip, typecheck, AEO audit all green)
- `qa` script unchanged: `npm run build && npm run test:quality && npm run test:lhci`

## Known Stubs

None - all scripts are fully implemented and wired.

## Commits

| Hash | Message |
|------|---------|
| c559067 | chore(10-01): Install Playwright and create dark mode test infrastructure |
| 6736603 | feat(10-01): Create dark mode axe-core contrast audit script |
| 428b07f | fix(10-01): Fix knip and typecheck issues in test infrastructure |
