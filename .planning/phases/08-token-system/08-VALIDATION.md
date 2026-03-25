---
phase: 8
slug: token-system
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Astro build + Lighthouse CI (vitest not configured) |
| **Config file** | `lighthouserc.cjs`, `astro.config.mjs` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~30 seconds |

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
| 08-01-01 | 01 | 1 | TOKEN-01 | build | `npm run build` | ✅ | ⬜ pending |
| 08-01-02 | 01 | 1 | TOKEN-02 | build | `npm run build` | ✅ | ⬜ pending |
| 08-01-03 | 01 | 1 | TOKEN-03 | build | `npm run build` | ✅ | ⬜ pending |
| 08-02-01 | 02 | 2 | TOKEN-04 | build | `npm run build` | ✅ | ⬜ pending |
| 08-02-02 | 02 | 2 | TOKEN-05 | build+grep | `npm run build && grep -r "brand-orange" src/` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements — `npm run build` validates CSS syntax, Tailwind token resolution, and component compilation.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Warm tones visually distinct in both modes | TOKEN-01 | Visual comparison | Apply `bg-surface-dim`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-bright` to test elements, toggle dark mode, verify distinct warm tones |
| Glass utilities produce warm-tinted blur | TOKEN-05 | Visual effect | Apply `.glass` to a header element, verify warm brown tint (dark) / cream tint (light) with inner glow |
| Font families render correctly | TOKEN-04 | Font rendering | Verify headings show Manrope, body shows Inter in browser dev tools |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
