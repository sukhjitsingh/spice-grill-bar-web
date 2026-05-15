---
phase: 15
slug: voice-directions-content-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-15
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Custom Node.js AEO audit script (`scripts/aeo-audit.mjs`) + Lighthouse CI |
| **Config file** | `.lighthouserc.json` |
| **Quick run command** | `npm run test:aeo` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~10 seconds (aeo only); ~90 seconds (full qa with build + Lighthouse) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npm run test:aeo` (skips gracefully if dist/ absent)
- **After every plan wave:** Run `npm run build && npm run test:aeo`
- **Before `/gsd-verify-work`:** `npm run qa` must be green (all 6 AEO gates + Lighthouse CI)
- **Max feedback latency:** ~90 seconds (full qa)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | AEO-14 | — | N/A (static markup) | source grep | `grep -c 'I-40 Exit 146' src/pages/directions.astro` → 7 | ✅ | ⬜ pending |
| 15-01-02 | 01 | 1 | AEO-14 | — | N/A (static markup) | build output string-match | `npm run build && npm run test:aeo` | ❌ Wave 0 (gate added in 15-03 Task 1) | ⬜ pending |
| 15-02-01 | 02 | 1 | AEO-15 | — | N/A (static markup) | source grep | `grep -c 'I-40 Exit 146, Ash Fork, AZ' src/pages/faq.astro` → 1 | ✅ | ⬜ pending |
| 15-03-01 | 03 | 2 | AEO-14 | — | N/A (read-only CI script) | build output string-match | `npm run build && npm run test:aeo` | ❌ Wave 0 (this task adds the gate) | ⬜ pending |
| 15-03-02 | 03 | 2 | AEO-14, AEO-15 | — | N/A (CI runner) | full suite | `npm run qa` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/aeo-audit.mjs` Section 6 HowTo gate — added as part of 15-03 Task 1 (this IS the task, not a separate stub). The gate checks `"@type":"HowTo"` in `dist/directions/index.html` using the existsSync-guard pattern from sections 4 and 5.

*Note: The existing aeo-audit.mjs infrastructure already has 5 passing gates (sections 1–5). No framework installation needed — Node.js fs/path built-ins used throughout. Section 6 follows the identical pattern.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| HowToStep.text matches DOM paragraph verbatim | AEO-14 | Text-DOM alignment cannot be checked with a simple gate | After build: compare HowToStep.text values in `dist/directions/index.html` against the three updated city `<p>` elements — texts must be near-verbatim (plain `&`, not `&amp;`) |
| Description ≥150 chars and covers all 34 topic clusters | AEO-15 | Character count and topic coverage not fully automatable | `python3 -c "s='34 FAQs covering hours, menu, vegetarian and vegan options, takeout, payment, parking, and prices at Spice Grill & Bar — I-40 Exit 146, Ash Fork, AZ. Biker-friendly Indian restaurant on Route 66, 78 miles from the Grand Canyon.'; print(len(s))"` → 228 |
| Phase 14 speakable-city-directions class preserved | AEO-13 (non-regression) | Phase 14 coverage, not Phase 15 requirement | After build: `grep -c 'speakable-city-directions' dist/directions/index.html` → 3 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
