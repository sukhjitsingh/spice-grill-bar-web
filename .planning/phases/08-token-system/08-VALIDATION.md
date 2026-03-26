---
phase: 8
slug: token-system
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-25
gaps_filled: 2026-03-25
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Shell-based behavioral tests + Astro build + Lighthouse CI |
| **Token test file** | `tests/test-phase-08-tokens.sh` |
| **Config file** | `lighthouserc.cjs`, `astro.config.mjs` |
| **Quick run command** | `bash tests/test-phase-08-tokens.sh` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~5 seconds (token tests), ~30 seconds (full qa) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run qa`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | TOKEN-01 | shell | `bash tests/test-phase-08-tokens.sh` | ✅ | ✅ green |
| 08-01-02 | 01 | 1 | TOKEN-02 | shell | `bash tests/test-phase-08-tokens.sh` | ✅ | ✅ green |
| 08-01-03 | 01 | 1 | TOKEN-03 | shell | `bash tests/test-phase-08-tokens.sh` | ✅ | ✅ green |
| 08-02-01 | 02 | 2 | TOKEN-04 | shell | `bash tests/test-phase-08-tokens.sh` | ✅ | ✅ green |
| 08-02-02 | 02 | 2 | TOKEN-05 | shell | `bash tests/test-phase-08-tokens.sh` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers CSS syntax, Tailwind token resolution, and component compilation via `npm run build`. The standalone shell test (`tests/test-phase-08-tokens.sh`) adds rerunnable behavioral verification for all 5 TOKEN requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Warm tones visually distinct in both modes | TOKEN-01 | Visual comparison | Apply `bg-surface-dim`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-bright` to test elements, toggle dark mode, verify distinct warm tones |
| Glass utilities produce warm-tinted blur | TOKEN-05 | Visual effect | Apply `.glass` to a header element, verify warm brown tint (dark) / cream tint (light) with inner glow |
| Font families render correctly | TOKEN-04 | Font rendering | Verify headings show Manrope, body shows Inter in browser dev tools |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** gap-filled 2026-03-25 by gsd-nyquist-auditor
