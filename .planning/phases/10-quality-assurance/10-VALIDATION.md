---
phase: 10
slug: quality-assurance
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `@playwright/test` 1.58.2 (Wave 0 install) + `@lhci/cli` 0.15.1 (existing) + `@axe-core/cli` 4.11.0 (existing) |
| **Config file** | `playwright.config.ts` (Wave 0 creates) + `.lighthouserc.json` (existing) + `.lighthouserc.dark.json` (Wave 0 creates) |
| **Quick run command** | `npm run test:lhci` |
| **Full suite command** | `npm run test:lhci && npm run test:lhci:dark && npm run test:axe && npm run test:axe:dark && npm run test:e2e` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:lhci`
- **After every plan wave:** Run full suite (all 5 commands)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 0 | QA-03 | setup | `npx playwright test --list` | No — Wave 0 | ⬜ pending |
| 10-01-02 | 01 | 0 | QA-01 | setup | `cat .lighthouserc.dark.json` | No — Wave 0 | ⬜ pending |
| 10-01-03 | 01 | 0 | QA-02 | setup | `cat scripts/axe-dark.mjs` | No — Wave 0 | ⬜ pending |
| 10-02-01 | 02 | 1 | QA-01 | performance | `npm run test:lhci` | ✅ | ⬜ pending |
| 10-02-02 | 02 | 1 | QA-01 | performance | `npm run test:lhci:dark` | No — Wave 0 | ⬜ pending |
| 10-03-01 | 03 | 1 | QA-02 | accessibility | `npm run test:axe` | ✅ | ⬜ pending |
| 10-03-02 | 03 | 1 | QA-02 | accessibility | `npm run test:axe:dark` | No — Wave 0 | ⬜ pending |
| 10-04-01 | 04 | 2 | QA-03 | e2e | `npm run test:e2e` | No — Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `@playwright/test` — Install: `npm install --save-dev @playwright/test && npx playwright install chromium`
- [ ] `playwright.config.ts` — Playwright config targeting `localhost:4321` with `webServer` autostart
- [ ] `e2e/animations.spec.ts` — Stubs for Sheet, DropdownMenu, MobileActionButtons animation tests
- [ ] `.lighthouserc.dark.json` — LHCI config for dark mode using `staticDistDir: ./dist-dark`
- [ ] `scripts/build-dark.mjs` — Post-build script to create `./dist-dark/` with `.dark` class injected
- [ ] `scripts/axe-dark.mjs` — Dark mode contrast audit using Playwright + axe-core injection
- [ ] `package.json` script additions: `test:e2e`, `test:lhci:dark`, `test:axe:dark`, `build:dark`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Animation smoothness (visual quality) | QA-03 | Playwright can verify open/close state + CSS classes, but visual smoothness/jank requires human eye | Open mobile nav, trigger DropdownMenu — visually confirm smooth transitions |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
