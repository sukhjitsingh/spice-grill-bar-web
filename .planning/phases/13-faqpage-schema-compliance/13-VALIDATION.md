---
phase: 13
slug: faqpage-schema-compliance
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-14
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Custom Node.js audit script (`aeo-audit.mjs`) + Playwright e2e |
| **Config file** | `scripts/aeo-audit.mjs` (AEO), `playwright.config.ts` (e2e) |
| **Quick run command** | `npm run build && npm run test:aeo` |
| **Full suite command** | `npm run qa` |
| **Estimated runtime** | ~90 seconds (build ~60s + aeo ~5s + lhci ~25s) |

---

## Sampling Rate

- **After every task commit:** Run `npm run build && npm run test:aeo`
- **After every plan wave:** Run `npm run qa`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | AEO-10 | — | N/A (static build-time change) | audit gate | `npm run build && npm run test:aeo` | ❌ W0 (gate added in this task) | ⬜ pending |
| 13-01-02 | 01 | 1 | AEO-10 | — | N/A | build + typecheck | `npm run build && npm run typecheck` | ✅ | ⬜ pending |
| 13-01-03 | 01 | 1 | AEO-10 | — | N/A | audit gate | `npm run build && npm run test:aeo` | ✅ (after W0) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/aeo-audit.mjs` — add FAQPage Question count gate (covers AEO-10); must be added before or alongside the inline FAQPage schema so the gate exists when verification runs

*All other test infrastructure (aeo-audit.mjs, Playwright, Lighthouse CI) already exists. No new test files, framework installs, or conftest equivalents needed.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `/faq/` page still shows full 34-question FAQPage schema in Google Rich Results Test | AEO-10 | Google Rich Results Test is an external tool; cannot be automated in CI | After build: visit https://search.google.com/test/rich-results, paste the `/faq/` URL, verify FAQPage with 34 entries appears |
| `/` home page shows exactly 8-question FAQPage in Google Rich Results Test | AEO-10 | Google Rich Results Test is an external tool | After build: visit https://search.google.com/test/rich-results, paste the home URL, verify FAQPage with exactly 8 entries appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
