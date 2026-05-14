# Roadmap: Spice Grill & Bar Website

## Milestones

- ✅ **v1.0 SEO/GEO/AEO Optimization** — Phases 1-6 (shipped 2026-02-22)
- ✅ **v2.0 UI Facelift — The Radiant Sommelier** — Phases 7-10 (shipped 2026-03-28)
- ✅ **v3.0 AEO/GEO Refinement** — Phase 11 (shipped 2026-05-14)
- 🔄 **v3.1 AEO Gap Fixes** — Phases 12-15 (in progress)

## Phases

<details>
<summary>✅ v1.0 SEO/GEO/AEO Optimization (Phases 1-6) — SHIPPED 2026-02-22</summary>

- [x] Phase 1: Schema Fixes (1/1 plans) — completed 2026-02-21
- [x] Phase 2: Schema Additions (2/2 plans) — completed 2026-02-21
- [x] Phase 3: FAQ Expansion (1/1 plans) — completed 2026-02-21
- [x] Phase 4: Content Infrastructure (1/1 plans) — completed 2026-02-21
- [x] Phase 5: GEO Content Pages (2/2 plans) — completed 2026-02-21
- [x] Phase 6: Data Consistency & Lighthouse Coverage (1/1 plans) — completed 2026-02-22

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

<details>
<summary>✅ v2.0 UI Facelift — The Radiant Sommelier (Phases 7-10) — SHIPPED 2026-03-28</summary>

- [x] Phase 7: Infrastructure (2/2 plans) — completed 2026-03-25
- [x] Phase 8: Token System (5/5 plans) — completed 2026-03-26
- [x] Phase 9: Visual Redesign (5/5 plans) — completed 2026-03-27
- [x] Phase 10: Quality Assurance (3/3 plans) — completed 2026-03-28

Full details: `.planning/milestones/v2.0-REQUIREMENTS.md` | Audit: `.planning/v2.0-MILESTONE-AUDIT.md`

</details>

<details>
<summary>✅ v3.0 AEO/GEO Refinement (Phase 11) — SHIPPED 2026-05-14</summary>

- [x] Phase 11: AEO/GEO Refinement (8/8 plans) — completed 2026-05-07

Full details: `.planning/milestones/v3.0-ROADMAP.md` | Audit: `.planning/milestones/v3.0-MILESTONE-AUDIT.md`

</details>

### v3.1 AEO Gap Fixes (Phases 12-15)

- [ ] **Phase 12: Schema Entity Disambiguation** — Establish distinct @id fragments on Restaurant/Organization schemas and wire AI crawler discovery links in Layout.astro head
- [ ] **Phase 13: FAQPage Schema Compliance** — Atomic fix aligning home page FAQPage schema to exactly the 8 visible DOM questions
- [ ] **Phase 14: Speakable Coverage** — Add Speakable annotation to /faq/ intro and extend Directions Speakable to cover per-city sections
- [ ] **Phase 15: Voice Directions + Content Polish** — Add HowTo schema for 3 cities on /directions/ and expand FAQ meta description to reflect all 34 topic clusters

## Phase Details

### Phase 12: Schema Entity Disambiguation
**Goal**: AI engines and Google's Knowledge Graph can unambiguously resolve the restaurant as a distinct entity from its organization record, and AI crawlers can discover the full plain-text site content
**Depends on**: Nothing (first phase of v3.1)
**Requirements**: AEO-11, AEO-16
**Success Criteria** (what must be TRUE):
  1. `RestaurantSchema.astro` JSON-LD contains `@id: "https://spicegrillbar66.com/#restaurant"` and a `sameAs` array with all 5 profile URLs
  2. `OrganizationSchema.astro` JSON-LD contains `@id: "https://spicegrillbar66.com/#organization"` — distinct fragment from the Restaurant `@id`
  3. `Layout.astro` `<head>` contains `<link rel="alternate" type="text/plain" href="/llms.txt" />` (not `rel="help"`)
  4. `Layout.astro` `<head>` contains a second `<link rel="alternate" type="text/plain" href="/llms-full.txt" />`
  5. Google Rich Results Test shows no entity collision warning; Lighthouse SEO score does not degrade
**Plans**: 2 plans
Plans:
- [ ] 12-01-PLAN.md — RestaurantSchema + OrganizationSchema @id fragments and sameAs canonicalization (AEO-11)
- [ ] 12-02-PLAN.md — Layout.astro AI crawler discovery links + aeo-audit.mjs @id fragment gate (AEO-16)

### Phase 13: FAQPage Schema Compliance
**Goal**: The home page FAQPage JSON-LD matches exactly the 8 questions visible in the DOM, eliminating the Google policy violation caused by the schema/DOM mismatch
**Depends on**: Phase 12
**Requirements**: AEO-10
**Success Criteria** (what must be TRUE):
  1. `Layout.astro` FAQSchema gate is scoped to `/faq/` only — the home page no longer receives the 34-question global FAQSchema block
  2. `index.astro` contains an inline `FAQPage` JSON-LD block with exactly the same 8 questions rendered in the visible home page FAQ section (no more, no fewer)
  3. Both file changes ship in a single atomic commit — no intermediate state where schema is absent from `/` or duplicated
  4. Google Rich Results Test on `/` shows FAQPage with 8 entries only; test on `/faq/` still shows full FAQ schema
**Plans**: TBD

### Phase 14: Speakable Coverage
**Goal**: Voice assistants can extract a concise, authoritative spoken snippet from both the /faq/ page and the per-city direction sections on /directions/
**Depends on**: Phase 13
**Requirements**: AEO-12, AEO-13
**Success Criteria** (what must be TRUE):
  1. `faq.astro` has a short intro paragraph (2-3 sentences) above the Q&A list with an `id` on the outer FAQ container `div`
  2. `faq.astro` contains a `WebPage` + `SpeakableSpecification` inline schema block targeting that intro paragraph — Google Rich Results Test validates the Speakable markup
  3. `directions.astro` per-city direction paragraphs for Flagstaff, Williams, and Las Vegas carry a `speakable-city-directions` class (or equivalent)
  4. `directions.astro` Speakable `cssSelector` array includes class-based selectors for all three newly annotated city sections
**Plans**: TBD

### Phase 15: Voice Directions + Content Polish
**Goal**: Voice assistants can respond to "how do I get to Spice Grill & Bar from [city]" for the 3 highest-traffic origin cities, and the /faq/ page description accurately represents its full 34-topic breadth
**Depends on**: Phase 14
**Requirements**: AEO-14, AEO-15
**Success Criteria** (what must be TRUE):
  1. `directions.astro` contains a `HowTo` schema `@graph` with three `HowTo` objects (Flagstaff PT46M, Williams PT18M, Las Vegas PT3H)
  2. Each `HowToStep.text` is verbatim or near-verbatim from the corresponding DOM paragraph — no AEO text/DOM misalignment
  3. `faq.astro` `description` meta tag is at least 150 characters and references hours, location (I-40 Exit 146, Ash Fork, AZ), menu, vegetarian/vegan, takeout, payment, parking, bikers, Route 66, and Grand Canyon proximity
  4. All 5 Lighthouse-audited pages pass CI thresholds (LCP < 4s, TBT < 600ms, CLS < 0.105, A11y ≥ 90, SEO ≥ 90) after all v3.1 changes
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
| --- | --- | --- | --- | --- |
| 1. Schema Fixes | v1.0 | 1/1 | Complete | 2026-02-21 |
| 2. Schema Additions | v1.0 | 2/2 | Complete | 2026-02-21 |
| 3. FAQ Expansion | v1.0 | 1/1 | Complete | 2026-02-21 |
| 4. Content Infrastructure | v1.0 | 1/1 | Complete | 2026-02-21 |
| 5. GEO Content Pages | v1.0 | 2/2 | Complete | 2026-02-21 |
| 6. Data Consistency & LH Coverage | v1.0 | 1/1 | Complete | 2026-02-22 |
| 7. Infrastructure | v2.0 | 2/2 | Complete | 2026-03-25 |
| 8. Token System | v2.0 | 5/5 | Complete | 2026-03-26 |
| 9. Visual Redesign | v2.0 | 5/5 | Complete | 2026-03-27 |
| 10. Quality Assurance | v2.0 | 3/3 | Complete | 2026-03-28 |
| 11. AEO/GEO Refinement | v3.0 | 8/8 | Complete | 2026-05-07 |
| 12. Schema Entity Disambiguation | v3.1 | 0/2 | Not started | - |
| 13. FAQPage Schema Compliance | v3.1 | 0/TBD | Not started | - |
| 14. Speakable Coverage | v3.1 | 0/TBD | Not started | - |
| 15. Voice Directions + Content Polish | v3.1 | 0/TBD | Not started | - |
