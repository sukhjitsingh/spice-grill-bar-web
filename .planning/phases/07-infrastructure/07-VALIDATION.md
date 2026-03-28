---
phase: 7
slug: infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Lighthouse CI + ESLint + knip + tsc (no unit test framework for this phase) |
| **Config file** | `.lighthouserc.json`, `.eslintrc.cjs`, `tsconfig.json` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run qa`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 07-01-01 | 01 | 1 | INFRA-01 | build | `npm run build` | ✅ | ⬜ pending |
| 07-01-02 | 01 | 1 | INFRA-02 | build+grep | `npm run build && grep "@import \"tailwindcss\"" src/styles/globals.css` | ✅ | ⬜ pending |
| 07-01-03 | 01 | 1 | INFRA-05 | grep | `node -e "const p=require('./package.json');console.log(p.devDependencies?.autoprefixer?'FAIL':'OK')"` | ✅ | ⬜ pending |
| 07-02-01 | 02 | 1 | INFRA-03 | grep | `grep -rn "shadow-sm" src/ --include="*.tsx" --include="*.astro"` (zero matches = pass) | ✅ | ⬜ pending |
| 07-02-02 | 02 | 1 | INFRA-04 | grep+manual | `grep "@custom-variant dark" src/styles/globals.css` + manual dark toggle | ✅ | ⬜ pending |
| 07-03-01 | 03 | 1 | INFRA-06 | build+manual | `npm run build` + manual animation check | ✅ | ⬜ pending |
| 07-04-01 | 04 | 2 | INFRA-01 | lhci | `npm run test:lhci` (CLS < 0.1, all scores hold) | ✅ | ⬜ pending |
| 07-04-02 | 04 | 2 | ALL | qa | `npm run qa` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No new test framework needed — this phase validates via build tools, grep checks, Lighthouse CI, and manual verification.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark mode toggle | INFRA-04 | Visual rendering requires browser | Add `class="dark"` to `<html>` in DevTools; verify Header and Sheet backgrounds change |
| Sheet slide animation | INFRA-06 | Animation timing is visual | Open hamburger menu on mobile viewport; Sheet must slide in/out with motion |
| DropdownMenu animation | INFRA-06 | Animation timing is visual | Click mode-toggle; menu must fade/zoom in/out |
| MobileActionButtons animation | INFRA-06 | Animation on load is visual | Load page on mobile; bottom bar must slide up with fade |
| Font rendering | INFRA-01 | Layout shift requires visual inspection | Check Network tab for .woff2 files; verify no text reflow during load |
| Border color changes | INFRA-03 | Subtle visual difference | Inspect Sheet and DropdownMenu borders after migration; ensure visible in both light/dark |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
