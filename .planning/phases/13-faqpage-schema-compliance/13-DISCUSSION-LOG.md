# Phase 13 Discussion Log

**Date:** 2026-05-14
**Phase:** 13 — FAQPage Schema Compliance

## Areas Discussed

### 1. CR Scope (Phase 12 code review findings)
**Question:** Should CR-01 (geo drift) and CR-02 (WebSiteSchema publisher @id) be folded into Phase 13?
**Options:** Fold both / CR-02 only / Keep Phase 13 minimal
**Decision:** Fold both into Phase 13

### 2. FAQPage Injection Method
**Question:** Inline script in index.astro vs extend FAQSchema.astro with items prop?
**Options:** Inline script (recommended) / Extend FAQSchema with prop
**Decision:** Inline script in index.astro — consistent with near-grand-canyon/near-williams pattern, no prop complexity risk

### 3. Authoritative Geo Coordinates (CR-01)
**Question:** Which source is authoritative for geo coordinates?
**Options:** RestaurantSchema / Layout.astro / Skip
**Decision:** User verified via CID Maps link — authoritative value is `35.222908, -112.4781558`. Both files updated to this value.

### 4. AEO Audit Gate
**Question:** Add gate checking exactly 8 FAQPage entries in dist/index.html?
**Options:** Yes — add gate (recommended) / No — skip
**Decision:** Yes — same pattern as Phase 12 @id gate

### 5. Schema Type for Inline FAQPage
**Question:** Raw JSON object vs schema-dts typed?
**Options:** Raw JSON (You decide) / WithContext<FAQPage> typed
**Decision:** Raw JSON object — consistent with existing inline schema pages

## Claude's Discretion Items
- Exact position of FAQPage inline script in index.astro (after existing SpeakableSpecification block)
- Whether to bundle AEO-10 traceability update in same commit
