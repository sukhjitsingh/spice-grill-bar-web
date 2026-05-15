---
phase: 14
slug: speakable-coverage
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-14
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Custom Node.js AEO audit script (`scripts/aeo-audit.mjs`) |
| **Config file** | none — self-contained script |
| **Quick run command** | `npm run test:aeo` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~10 seconds (aeo only); ~60 seconds (full qa with build) |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:aeo` (skips gracefully if dist/ absent)
- **After every plan wave:** Run `npm run build && npm run test:aeo`
- **Before `/gsd-verify-work`:** `npm run qa` must be green
- **Max feedback latency:** ~60 seconds (full qa)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | AEO-12 | — | N/A (static markup) | build output string-match | `npm run build && npm run test:aeo` | ❌ Wave 0 (gate added in this task) | ⬜ pending |
| 14-01-02 | 01 | 1 | AEO-13 | — | N/A (static markup) | manual grep | `grep "speakable-city-directions" dist/directions/index.html` | ✅ dist exists after build | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/aeo-audit.mjs` FAQ Speakable gate — added as part of AEO-12 implementation (this IS the task, not a separate stub)

*Note: The existing aeo-audit.mjs infrastructure already has 4 passing gates. No framework installation needed — Node.js fs/path built-ins are used throughout.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `speakable-city-directions` class on Flagstaff/Williams/Las Vegas `<p>` elements | AEO-13 | D-08 explicitly excludes directions from aeo-audit CI gate | After build: `grep "speakable-city-directions" dist/directions/index.html` — must match 3 occurrences |
| `cssSelector` array has 4 entries including `.speakable-city-directions` | AEO-13 | JSON-LD output not separately gated for directions | After build: `grep -A5 "SpeakableSpecification" dist/directions/index.html` — verify 4th selector present |
| Google Rich Results Test validates FAQ Speakable markup | AEO-12 | External validator, not CI-automatable | Post-deploy: test `/faq/` URL in Google Rich Results Test; Speakable item should appear |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
