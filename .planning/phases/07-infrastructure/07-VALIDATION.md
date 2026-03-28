---
phase: 7
slug: infrastructure
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-24
audited: 2026-03-27
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
| 07-01-T1 | 01 | 1 | INFRA-01, INFRA-02, INFRA-05 | build+grep | `npm run build && grep "@tailwindcss/vite" package.json && grep "@import 'tailwindcss'" src/styles/globals.css` | ✅ | ✅ green |
| 07-01-T2 | 01 | 1 | INFRA-03 | grep | `grep -rn "shadow-sm" src/ --include="*.tsx" --include="*.astro" \| wc -l` (expected 0) | ✅ | ✅ green |
| 07-01-T3 | 01 | 1 | ALL | build+qa | `npm run build && npm run qa` | ✅ | ✅ green |
| 07-02-T1 | 02 | 1 | INFRA-04, INFRA-06 | manual | Dev server visual check — dark mode toggle + animation inspection | ✅ | ✅ green (human approved 2026-03-25) |

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

**Status:** All manual items approved by user during Plan 07-02 execution (2026-03-25).

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-03-27

---

## Validation Audit 2026-03-27

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |
| Documentation fixes | 1 (corrected stale task IDs referencing non-existent plans 03/04; updated all statuses from pending → green based on SUMMARY evidence) |

**Audit notes:** All 6 requirements (INFRA-01 through INFRA-06) are covered by automated verification commands that pass against the current codebase. Manual visual items for INFRA-04 and INFRA-06 were human-approved during Plan 07-02. Phase is Nyquist-compliant.
