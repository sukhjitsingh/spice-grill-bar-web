---
phase: 10
slug: quality-assurance
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-27
gaps_filled: 2026-03-28
last_audited: 2026-03-28
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `@playwright/test` 1.58.2 + `@lhci/cli` 0.15.1 + Playwright axe-core scripts |
| **Config file** | `playwright.config.ts`, `.lighthouserc.json`, `.lighthouserc.dark.json` |
| **E2E tests** | `e2e/animations.spec.ts` (3 tests) |
| **Axe scripts** | `scripts/axe-light.mjs`, `scripts/axe-dark.mjs` |
| **Quick run command** | `npm run test:lhci` |
| **Full suite command** | `npm run test:lhci && npm run test:lhci:dark && npm run test:axe && npm run test:axe:dark && npm run test:e2e` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:lhci`
- **After every plan wave:** Run full suite (all 5 commands above)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 0 | QA-03 | setup | `npx playwright test --list` — 3 tests discoverable | ✅ | ✅ green |
| 10-01-02 | 01 | 0 | QA-01 | setup | `cat .lighthouserc.dark.json` — staticDistDir is ./dist-dark | ✅ | ✅ green |
| 10-01-03 | 01 | 0 | QA-02 | setup | `node -c scripts/axe-dark.mjs` — valid syntax | ✅ | ✅ green |
| 10-02-01 | 02 | 1 | QA-01 | performance | `npm run test:lhci` — light mode all 4 pages | ✅ | ✅ green |
| 10-02-02 | 02 | 1 | QA-01 | performance | `npm run test:lhci:dark` — dark mode all 4 pages | ✅ | ✅ green |
| 10-03-01 | 02 | 1 | QA-02 | accessibility | `npm run test:axe` — light mode contrast | ✅ | ✅ green |
| 10-03-02 | 02 | 1 | QA-02 | accessibility | `npm run test:axe:dark` — dark mode contrast | ✅ | ✅ green |
| 10-03-03 | 03 | 1 | QA-03 | e2e | `npm run test:e2e` — Sheet, DropdownMenu, MobileActionButtons | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Note:** VALIDATION.md was initially drafted for a 4-plan structure; execution completed in 3 plans. Plan 02 consolidated all audit passes; Plan 03 delivered E2E tests.

---

## Wave 0 Requirements

All Wave 0 infrastructure created in Plan 01:

- [x] `@playwright/test` 1.58.2 installed + chromium browser
- [x] `playwright.config.ts` — e2e testDir, webServer auto-start localhost:4321, reducedMotion in contextOptions
- [x] `e2e/animations.spec.ts` — 3 tests for Sheet, DropdownMenu, MobileActionButtons
- [x] `.lighthouserc.dark.json` — LHCI dark mode targeting `./dist-dark`
- [x] `scripts/build-dark.mjs` — copies dist/ → dist-dark/, injects `.dark` class on all HTML
- [x] `scripts/axe-dark.mjs` — Playwright axe-core contrast audit, dark mode, all 4 pages
- [x] `scripts/axe-light.mjs` — Playwright axe-core contrast audit, light mode (replaces axe CLI)
- [x] `package.json` scripts: `test:e2e`, `test:lhci:dark`, `test:axe:dark`, `test:axe`, `build:dark`

---

## Lighthouse CI Thresholds (as enforced)

| Metric | Threshold |
|--------|-----------|
| LCP | < 4000ms |
| TBT | < 600ms |
| CLS | < 0.105 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 80 |
| SEO | ≥ 90 |

*CLS relaxed from 0.1 → 0.105 in Plan 02 (user decision). CLAUDE.md updated to match.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Animation smoothness (visual quality) | QA-03 | Playwright verifies open/close state + CSS classes; visual smoothness/jank requires human eye | Open mobile nav, trigger DropdownMenu — visually confirm smooth, non-janky transitions in both light and dark mode |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** gap-filled 2026-03-28 by validate-phase audit

---

## Validation Audit 2026-03-28

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |

**Notes:**
- All 3 QA requirements (QA-01, QA-02, QA-03) had complete automated coverage at execution time — VALIDATION.md simply never updated from `draft` status.
- Execution consolidated from 4 planned → 3 actual plans. Plan 02 delivered both LHCI + axe audit passes; Plan 03 delivered E2E tests. Task map reconciled above.
- Contrast fix in Plan 02: `--primary-container` darkened `#d93900` → `#c03200` (light mode) to achieve 4.88:1 contrast ratio (was 3.97:1). This is also reflected in Phase 8 validation update from 2026-03-27.
- 3 Playwright E2E tests all passing (last verified: 2026-03-28 per 10-03-SUMMARY.md).
