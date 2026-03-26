---
phase: 9
slug: visual-redesign
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Lighthouse CI (lhci) + custom AEO audit script |
| **Config file** | `.lighthouserc.cjs` |
| **Quick run command** | `npm run build && npm run test:lhci` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~60 seconds |

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
| 09-01-01 | 01 | 1 | VISUAL-01 | build check | `npm run build` — verify no fontsource open-sans/playfair in dist | N/A | ⬜ pending |
| 09-01-02 | 01 | 1 | VISUAL-04 | CSS verify | `grep '@utility display-lg' src/styles/globals.css` | N/A | ⬜ pending |
| 09-01-03 | 01 | 1 | VISUAL-05 | static check | `grep '@utility glass' src/styles/globals.css` | ✅ | ⬜ pending |
| 09-02-01 | 02 | 1 | VISUAL-02 | manual visual | DevTools — check backdrop-filter only on Header/Sheet/Dropdown | N/A | ⬜ pending |
| 09-02-02 | 02 | 1 | VISUAL-03 | manual visual | DevTools — search for border-outline-variant in rendered DOM | N/A | ⬜ pending |
| 09-02-03 | 02 | 1 | VISUAL-10 | manual audit | Count orange elements — must be ≤ 4 contexts | N/A | ⬜ pending |
| 09-03-01 | 03 | 2 | VISUAL-06 | manual visual | `npm run dev` — visual scan home page light + dark | N/A | ⬜ pending |
| 09-03-02 | 03 | 2 | VISUAL-07 | manual visual | `npm run dev` — visual scan FAQ page | N/A | ⬜ pending |
| 09-03-03 | 03 | 2 | VISUAL-08 | manual visual | `npm run dev` — visual scan Near Grand Canyon page | N/A | ⬜ pending |
| 09-03-04 | 03 | 2 | VISUAL-09 | manual visual | `npm run dev` — visual scan Directions page | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements.
- Lighthouse CI catches accessibility regressions (heading hierarchy, contrast ratios)
- `npm run test:aeo` catches SEO regressions (crawlable hero content, H1 presence)
- No automated visual regression test files needed — phase relies on manual visual verification + LHCI

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Glassmorphism only on Header/Sheet/Dropdown | VISUAL-02 | Visual appearance requires human eye | DevTools: search for `backdrop-filter` in computed styles across all elements |
| No visible borders between sections/cards | VISUAL-03 | Border visibility is visual judgment | Scan all 4 pages in both light and dark mode |
| Surface hierarchy matches DESIGN.md | VISUAL-06/07/08/09 | Design consistency is visual | Compare rendered pages against UI-SPEC section flow diagram |
| Orange in ≤ 4 visual contexts | VISUAL-10 | Counting distinct visual contexts requires visual scan | DevTools color picker on all orange elements site-wide |
| Header glass uses warm-tinted blur | Success-5 | Visual warmth assessment | Inspect Header backdrop-filter on scroll |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
