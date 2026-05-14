---
phase: 13
slug: faqpage-schema-compliance
status: verified
threats_open: 0
asvs_level: 1
created: 2026-05-14
---

# Phase 13 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Build-time JSON-LD serialisation | `faq.json` → `faqPageSchema` array → inlined into `dist/index.html` | Public FAQ Q&A text and schema metadata (intentionally public) |
| CI audit script | `aeo-audit.mjs` reads `dist/index.html` at CI time | Generated build artifact (no user input, no network path) |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-13-01 | Tampering | `src/data/faq.json` (build-time input to `faqPageSchema`) | accept | Source-controlled file; only modified via PR review or the Gemini reviews GitHub Action (which never touches `faq.json`). RESEARCH.md A1 confirms 8 indices stay valid. No runtime tampering surface. | closed |
| T-13-02 | Information Disclosure | Inline JSON-LD in `dist/index.html` | accept | Schema content (FAQ Q&A, geo coordinates, public profile URLs) is intentionally public SEO/AEO data. Nothing sensitive is exposed. | closed |
| T-13-03 | Denial of Service | Astro build / `JSON.stringify(faqPageSchema)` | accept | Build-time only, fixed 8-entry array, bounded output. No runtime path, no user-triggerable code. | closed |
| T-13-04 | Tampering | `dist/index.html` (read by the audit gate) | accept | `dist/` is a generated build artifact, not a network-exposed input. A tampered `dist/` only affects a local audit run; the canonical check runs in CI on a fresh build. No mitigation warranted. | closed |
| T-13-05 | Denial of Service | `aeo-audit.mjs` regex over `dist/index.html` | accept | Single bounded `String.match` over one local file; no user-controlled size or runtime path. Negligible. | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-13-01 | faq.json is source-controlled; no runtime tampering surface. 8-index slice is validated by CI gate (T-13-05 gate). | Plan-time design review | 2026-05-14 |
| AR-02 | T-13-02 | All inlined schema data (FAQ text, geo, URLs) is intentionally public AEO/SEO content. No PII or secrets. | Plan-time design review | 2026-05-14 |
| AR-03 | T-13-03 | Build-time only, bounded fixed array. No runtime DoS surface. | Plan-time design review | 2026-05-14 |
| AR-04 | T-13-04 | CI runs on fresh build; local dist/ tampering has no production impact. | Plan-time design review | 2026-05-14 |
| AR-05 | T-13-05 | Single bounded file read with no user-controlled input. | Plan-time design review | 2026-05-14 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-05-14 | 5 | 5 | 0 | gsd-secure-phase (plan-time register, short-circuit verified) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-05-14
