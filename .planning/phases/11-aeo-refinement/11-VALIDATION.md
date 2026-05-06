---
phase: 11
slug: aeo-refinement
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-05
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Sourced from `11-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Mixed: `npm run test:aeo` (custom Node script in `scripts/aeo-audit.mjs`), Lighthouse CI (`@lhci/cli` 0.15.1), `astro check` for typecheck, ESLint for lint, Playwright 1.58.2 for e2e (animation tests — not used here) |
| **Config files** | `scripts/aeo-audit.mjs`, `.lighthouserc.json`, `eslint.config.*`, `playwright.config.ts` |
| **Quick run command** | `npm run test:aeo` (single Node script, ~2s) |
| **Full suite command** | `npm run qa` (build + lint + knip + typecheck + test:aeo + test:lhci) — runs on pre-push hook |
| **Estimated runtime** | ~2s quick, ~90s full |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:aeo`
- **After every plan wave:** Run `npm run build && npm run test:aeo` (adds full Astro build to surface schema rendering errors)
- **Before `/gsd:verify-work`:** Full `npm run qa` green (pre-push hook enforces anyway)
- **Max feedback latency:** ~2s for AEO audit, ~30s for build, ~90s for full QA

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command | File Exists |
|--------|----------|-----------|-------------------|-------------|
| AEO-01 | Monday OPEN in schema; no drift across 3 files | grep on built HTML | `npm run build && grep -c '"https://schema.org/Monday"' dist/index.html` (expect ≥1); `grep -iE 'mon[a-z]*: closed\|monday: closed\|closed mondays' public/llms.txt public/llms-full.txt` (expect 0) | ✅ existing audit + new grep |
| AEO-02 | `paymentAccepted` + `acceptsReservations` + `amenityFeature` in schema | grep on built HTML | `npm run build && grep -cE '"paymentAccepted"\|"acceptsReservations"\|"amenityFeature"' dist/index.html` (expect ≥3) | ✅ |
| AEO-03 | `Kaibab Estates West` in `areaServed` | grep | `grep -c '"Kaibab Estates West"' dist/index.html` (expect ≥1) | ✅ |
| AEO-04 | `llms.txt` + `llms-full.txt` show Monday open + 5 new sections | aeo-audit.mjs new gate | `npm run test:aeo` | ✅ existing script extended |
| AEO-05 | FAQSchema fires on `/` | grep on built HTML | `npm run build && grep -c '"@type":"FAQPage"' dist/index.html` (expect ≥1) | ✅ |
| AEO-06 | Visible 8-Q FAQ section + SpeakableSpecification on `/` | grep | `grep -c 'id="home-faq"' dist/index.html` (expect 1); `grep -c 'SpeakableSpecification' dist/index.html` (expect ≥1); `grep -c '"#home-faq h3"' dist/index.html` (expect 1) | ✅ |
| AEO-07 | `faq.json` ≥34 entries; all pass 50-word audit | aeo-audit.mjs new gate + existing | `npm run test:aeo` | ✅ |
| AEO-08 | `/near-williams/` builds, has canonical, in sitemap, in lhci config | build + grep | `npm run build && test -f dist/near-williams/index.html && grep -c '<link rel="canonical"' dist/near-williams/index.html` (expect 1); `grep -c 'near-williams' dist/sitemap-0.xml` (expect 1); `grep -c 'near-williams' .lighthouserc.json` (expect 1) | ✅ |
| AEO-09 | Audit script fails (exit 1) when intentionally broken | manual fail-injection | Temporarily delete a `## Payment Methods` line from llms.txt → `npm run test:aeo` should print error and exit 1, then restore | ⚠️ Manual smoke test — once during plan execution |

---

## Wave 0 Requirements

- [ ] `OWNER-CONFIRMATION.md` — Wave 1 task creates this file in phase dir; blocks until owner fills payment methods, reservation policy, amenity set, Wi-Fi availability, wheelchair access, outdoor seating
- [ ] No new test framework needed — existing infrastructure covers all phase requirements

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| FAQ answer wording naturalness | AEO-07 | "Sounds natural in a voice clip" is owner judgment | Read aloud; pre-push 50-word gate enforces length |
| Curated 8-FAQ home selection | AEO-06 | "Best 8 for highway/voice" is judgment-based | Research recommends defensible set; executor must not invent different ordering without rationale |
| `paymentAccepted` exact ordering | AEO-02 | Schema accepts any comma list; ordering is preference | Recommend most-common-first: cash → card → mobile pay |
| JSON-LD validation in production | AEO-01,02,03,05,06 | Live URL test only | Run https://validator.schema.org and https://search.google.com/test/rich-results on `/` and `/near-williams/` after deploy |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (owner-confirmation file)
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s for full suite
- [ ] `nyquist_compliant: true` set in frontmatter (after planner spawns)

**Approval:** pending
