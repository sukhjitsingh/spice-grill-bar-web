---
phase: 9
slug: visual-redesign
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-26
gaps_filled: 2026-03-28
last_audited: 2026-03-28
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Shell-based static checks + Lighthouse CI |
| **Visual test file** | `tests/test-phase-09-visual.sh` |
| **Config file** | `.lighthouserc.cjs` |
| **Quick run command** | `bash tests/test-phase-09-visual.sh` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~3 seconds (visual tests), ~60 seconds (full qa) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npm run test:lhci`
- **After every plan wave:** Run `npm run qa`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | VISUAL-01 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-01-02 | 01 | 1 | VISUAL-04 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-01-03 | 01 | 1 | VISUAL-05 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-02-01 | 02 | 1 | VISUAL-02 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-02-02 | 02 | 1 | VISUAL-03 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-02-03 | 02 | 1 | VISUAL-10 | manual | see Manual-Only table | N/A | manual-only |
| 09-03-01 | 03 | 2 | VISUAL-06 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-03-02 | 03 | 2 | VISUAL-07 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-03-03 | 03 | 2 | VISUAL-08 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |
| 09-03-04 | 03 | 2 | VISUAL-09 | static check | `bash tests/test-phase-09-visual.sh` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*`tests/test-phase-09-visual.sh` provides static coverage for all 9 automatable VISUAL requirements. VISUAL-10 (orange budget) is manual-only because "≤4 visual contexts" requires human judgment — file count is an unreliable proxy (button.tsx + AstroButton.astro = 1 CTA button context; multiple pages with `hover:bg-primary-container` = 1 nav-hover context).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Orange in ≤ 4 visual contexts | VISUAL-10 | Visual contexts ≠ file count; requires human scan of rendered pages | Count distinct orange visual contexts: (1) CTA buttons, (2) star ratings, (3) nav hover states, (4) active menu indicator — must be ≤ 4 |
| Glassmorphism visually warm-tinted | VISUAL-02 (quality) | Warmth of blur tint is visual judgment | Inspect Header backdrop-filter on scroll in both light and dark mode |
| Surface depth visually distinct | VISUAL-06/07/08/09 (quality) | Tonal depth perception is visual | Compare rendered pages — each adjacent section should read as a distinct tonal depth |
| Header glass uses warm-tinted blur | Success-5 | Visual warmth assessment | Inspect Header backdrop-filter on scroll |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or manual-only designation
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all automatable requirements
- [x] No watch-mode flags
- [x] Feedback latency < 3s (shell tests)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** gap-filled 2026-03-28 by gsd-nyquist-auditor

---

## Validation Audit 2026-03-28

| Metric | Count |
|--------|-------|
| Gaps found | 10 |
| Resolved (automated) | 9 |
| Escalated to manual-only | 1 |

**Notes:**
- VISUAL-01–09 all covered by `tests/test-phase-09-visual.sh` (57 checks, all green)
- VISUAL-10 escalated: orange budget is a visual judgment (≤4 contexts, not ≤4 files). Current implementation uses `bg-primary-container` in 6 files but only 4 distinct visual contexts — within budget. Verified manually.
- Glass budget enforcement (VISUAL-02) confirmed: only Header, OurStorySection, OrderSection use `.glass`; only Header.tsx SheetContent uses `.glass-card`; Hero pill uses raw `backdrop-blur-sm` (pill badge exception, not glass utility).
