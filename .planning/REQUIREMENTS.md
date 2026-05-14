# Requirements — v3.1 AEO Gap Fixes

**Defined:** 2026-05-13
**Core Value:** AI engines and Google must surface Spice Grill & Bar as _the_ answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.

> Past milestone requirements archived under `.planning/milestones/v3.0-REQUIREMENTS.md`, `.planning/milestones/v2.0-REQUIREMENTS.md`, and `.planning/milestones/v1.0-REQUIREMENTS.md`.

## Research Summary

**Stack:** Zero new npm packages required. schema-dts v1.1.5 (installed) covers `HowTo`, `HowToStep`, `@id`, and `sameAs` on Restaurant without any workaround or upgrade.

**Key research findings:**
- FAQPage schema/DOM mismatch on `/` is a Google policy violation — fix must ship as a single atomic commit (Layout.astro + index.astro together)
- HowTo rich results were deprecated September 2023 — HowTo schema value is AEO/voice-only (AI engines still parse it)
- `@id` fragments must be distinct: `#restaurant` for RestaurantSchema, `#organization` for OrganizationSchema — shared bare domain `@id` causes graph conflict
- Speakable on `/faq/` should target a short intro paragraph (not the full 68-element Q&A grid) to stay within the 20-30 second voice window
- Class-based speakable selectors for per-city directions are safer than compound ID+descendant CSS selectors
- GBP CID URL for `sameAs` requires manual lookup (expand the `maps.app.goo.gl` short link)

## v3.1 Requirements

### Schema Compliance

- [ ] **AEO-10**: `src/layouts/Layout.astro` FAQSchema gate is narrowed from `currentPath === '/'` to `/faq/` only. `src/pages/index.astro` gains an inline `FAQPage` schema block built from `faqData[homeFaqIndices]` at build time, containing exactly the 8 questions rendered in the visible DOM. Both files change in a single atomic commit to prevent a duplicate-or-missing schema window.

- [ ] **AEO-11**: `src/components/schema/RestaurantSchema.astro` adds `'@id': 'https://spicegrillbar66.com/#restaurant'` and `sameAs` (same 5 URLs as OrganizationSchema: Google Maps, Yelp, TripAdvisor, Facebook, Instagram). `src/components/schema/OrganizationSchema.astro` adds `'@id': 'https://spicegrillbar66.com/#organization'` to prevent entity graph collision between the two schemas.

### Speakable Coverage

- [ ] **AEO-12**: `src/pages/faq.astro` adds `id="faq-list"` to the outer FAQ container `div`. A short intro paragraph (2-3 sentences) is added above the Q&A list to serve as the Speakable target. A `WebPage` + `SpeakableSpecification` inline schema block is injected after `</main>` targeting the intro paragraph.

- [ ] **AEO-13**: `src/pages/directions.astro` Speakable `cssSelector` array is extended with class-based selectors covering the Flagstaff, Williams, and Las Vegas per-city direction paragraphs. A `speakable-city-directions` class (or equivalent per-city classes) is added to the key direction `<p>` elements in those three city sections.

### Voice Directions

- [ ] **AEO-14**: `src/pages/directions.astro` adds a `HowTo` schema block (three `HowTo` objects in a single `@graph`) for Flagstaff (PT46M), Williams (PT18M), and Las Vegas (PT3H). Each `HowToStep.text` must be verbatim or near-verbatim from the corresponding DOM paragraph to pass AEO text-DOM alignment policy. `supply` and `tool` fields are omitted (irrelevant for driving directions).

### Content & Discovery

- [ ] **AEO-15**: `src/pages/faq.astro` `description` prop is rewritten to at least 150 characters covering the breadth of all 34 FAQ topic clusters: hours, location, menu, vegetarian/vegan, takeout, payment, parking, bikers, Route 66, Grand Canyon proximity, and price range. Anchor phrase includes "I-40 Exit 146, Ash Fork, AZ".

- [ ] **AEO-16**: `src/layouts/Layout.astro` `<head>` link for `llms.txt` is updated from `rel="help"` to `rel="alternate" type="text/plain"`. A second `<link rel="alternate" type="text/plain" href="/llms-full.txt" />` is added immediately after.

## Future Requirements (deferred)

- Additional HowTo schemas for remaining 4 cities on `/directions/` (Seligman, Kingman, Phoenix, Los Angeles)
- `/about/` page — full brand narrative with extractable AI passages, Punjabi cuisine context, Ash Fork location identity
- `/route-66-dining/` page — Route 66 heritage content, road-tripper dining context
- Halal messaging revision across `llms.txt`, `llms-full.txt`, and `OurStorySection.astro` (wording TBD with owner)
- Apple Maps Business Connect profile optimization — manual, off-site
- Automated KPI tracker (AI citation frequency, GBP direction requests, review velocity)

## Out of Scope

| Item | Reason |
|------|--------|
| Remove Beer/Wine from `servesCuisine` | Owner confirmed full bar — beverage entries are correct and intentional |
| New npm packages | Bundle size and Lighthouse TBT scores are non-negotiable constraints |
| Server-side rendering | Site must stay fully static (Apache hosting, no runtime) |
| HowTo for all 7 directions cities | Deferred — 3 highest-traffic cities cover the AEO voice use case for this milestone |
| Yelp/TripAdvisor/Reddit engagement | Manual off-site work, not automated by this codebase |

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| AEO-10 | Phase 13 | Pending |
| AEO-11 | Phase 12 | Pending |
| AEO-12 | Phase 14 | Pending |
| AEO-13 | Phase 14 | Pending |
| AEO-14 | Phase 15 | Pending |
| AEO-15 | Phase 15 | Pending |
| AEO-16 | Phase 12 | Pending |
