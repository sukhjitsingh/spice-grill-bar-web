---
phase: 10-quality-assurance
plan: 02
subsystem: quality-gates
tags: [lighthouse, axe-core, contrast, wcag-aa, m3-tokens]
dependency_graph:
  requires: [10-01]
  provides: [passing-lhci-light, passing-lhci-dark, passing-axe-light, passing-axe-dark]
  affects: [src/styles/globals.css, scripts/axe-light.mjs, package.json, .lighthouserc.json, .lighthouserc.dark.json]
tech_stack:
  added: []
  patterns: [playwright-axe-audit, token-level-contrast-fix]
key_files:
  created:
    - scripts/axe-light.mjs
  modified:
    - src/styles/globals.css
    - package.json
    - .lighthouserc.json
    - .lighthouserc.dark.json
    - CLAUDE.md
---

## What was built

Ran Lighthouse CI and axe-core contrast audits on all 4 pages in both light and dark mode. Found and fixed 6 contrast violations in light mode.

## Key Changes

1. **Contrast fix**: Darkened `--primary-container` from `#d93900` to `#c03200` in `:root` block of globals.css. This brings the minimum contrast ratio to 4.88:1 on surface-container backgrounds (was 3.97:1). Dark mode `--primary-container` (`#ff5626`) already passed.

2. **axe-light.mjs**: Created Playwright-based light mode contrast audit script (matching axe-dark.mjs pattern) to replace the chromedriver-dependent `axe` CLI which was failing with ENOENT. Updated `test:axe` npm script to use it.

3. **CLS threshold**: Relaxed cumulative-layout-shift from 0.1 to 0.105 in both `.lighthouserc.json` and `.lighthouserc.dark.json` per user request. Updated CLAUDE.md to match.

## Audit Results

- `npm run test:lhci` — All 4 pages pass (light mode)
- `npm run test:lhci:dark` — All 4 pages pass (dark mode)
- `npm run test:axe` — Zero contrast violations (light mode)
- `npm run test:axe:dark` — Zero contrast violations (dark mode)

## Decisions

- D-02 upheld: All contrast fixes applied at token level in globals.css `:root` block only — no per-component overrides
- Replaced axe CLI with Playwright-based script for consistency with axe-dark.mjs and to avoid chromedriver dependency

## Self-Check: PASSED

All 4 audit commands exit 0. No regressions introduced.
