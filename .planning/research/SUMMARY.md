# Project Research Summary

**Project:** Spice Grill & Bar — GEO/AEO SEO Enhancement
**Domain:** Local restaurant SEO, Geographic SEO (GEO), AI Answer Engine Optimization (AEO), Astro 5 static site
**Researched:** 2026-02-20
**Confidence:** HIGH

## Executive Summary

Spice Grill & Bar sits in a rare competitive position: it is the only Indian restaurant within 70 miles of Grand Canyon National Park, located directly on I-40 Exit 146 in Ash Fork, Arizona, yet its web presence does not currently capture the high-commercial-intent queries that highway road-trippers and Grand Canyon visitors ask AI engines and voice assistants. The existing Astro 5 site has a strong technical foundation — correct JSON-LD injection patterns, Partytown analytics, enforced Lighthouse thresholds, and a weekly review pipeline — but the schema is incomplete and inconsistent in ways that actively suppress local pack rankings and AI citation. The highest-leverage work is not building new features; it is fixing two data integrity problems first (schema-to-FAQ hours conflict, telephone format inconsistency), then layering on schema enhancements and four targeted content pages.

The recommended approach is a sequenced three-phase delivery: (1) fix all existing schema bugs and data conflicts before adding any new signals — a broken foundation invalidates everything built on top of it; (2) create the four GEO content pages (`/about/`, `/directions/`, `/near-grand-canyon/`, `/route-66-dining/`) using the answer-first passage structure that AI extraction systems favor, deploying one page at a time with Lighthouse CI coverage for each; (3) complete off-site profile optimization (Yelp, TripAdvisor, Google Business Profile) and `sameAs` linking only after on-site NAP is clean and profiles are verified to be consistent. All four new pages can be built without any new npm dependencies, new layout wrappers, or changes to the build system — the existing `Layout.astro` pattern and `faq.astro` structure serve as direct templates.

The primary risk is treating schema additions and content page creation as independent tracks. They are not: `RestaurantSchema.astro` currently states hours of `07:00–22:00` daily while `faq.json` states `8:00 AM–9:00 PM` weekday / `8:00 AM–10:00 PM` weekend. Publishing new pages while this conflict exists will cause Google to ignore structured data and AI engines to cite contradictory answers. This must be resolved — with confirmed hours from the restaurant owner — before any other work deploys. The mitigation is to extract all NAP data to a single `src/data/business.json` source-of-truth file, then import it everywhere.

---

## Key Findings

### Recommended Stack

The existing stack requires no changes. The `schema-dts` TypeScript library (v1.1.5, already installed) provides full type coverage for all planned schema additions including `GeoCoordinates`, `AggregateRating`, `OrderAction`, and `EntryPoint`. The current `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />` injection pattern is optimal for static Astro sites and must not be changed. No new npm packages are needed.

**Core technologies:**

- `schema-dts` v1.1.5: TypeScript types for all schema.org properties — already installed, covers all planned additions
- Astro 5 `Layout.astro`: universal page wrapper — new pages inherit canonical URLs, breadcrumbs, and all six schema components for free
- `src/data/*.json` files: source-of-truth pattern — extending to `business.json` for NAP data eliminates inconsistency
- `GoogleMap.tsx` with `client:visible`: existing lazy-loaded map component — reusable on `/directions/` with zero new code
- `@astrojs/sitemap`: auto-generates sitemap entries for all new pages — no configuration changes needed

**Do not add:**

- `next-seo`, `astro-seo`, `react-schemaorg`, or any schema validation npm packages — external tools (Google Rich Results Test) cover validation at zero bundle cost

### Expected Features

**Must have (table stakes):**

- NAP consistency across all schema components, FAQ answers, and page copy — current inconsistency is an active suppressor
- `RestaurantSchema` with correct `geo`, `areaServed` (expanded), `aggregateRating`, and `potentialAction` (OrderAction) — these are the missing local SEO signals
- `OrganizationSchema` with `sameAs` links to Google Maps, Yelp, and TripAdvisor — entity disambiguation across knowledge graphs
- FAQ expansion from 9 to 20 questions targeting distance, exit number, food type, and operational queries — FAQ schema is the highest-signal AEO property
- Canonical `<title>` and `<meta description>` unique per page — current defaults leak onto sub-pages
- `llms.txt` and `llms-full.txt` updated with geographic distance facts and highway exit information

**Should have (competitive differentiators):**

- `/near-grand-canyon/` page with answer-first passage structure — highest-ROI single page, zero competition
- `/directions/` page with per-city driving distance facts — captures navigation queries from all I-40 origin cities
- `/about/` page with full entity narrative — canonical source for AI "tell me about" queries
- `/route-66-dining/` page with Ash Fork heritage content — captures Route 66 travel query traffic
- Per-page `BreadcrumbSchema` with human-readable labels (fix current hyphenated label generation)
- Schema scoping per page — FAQSchema and MenuSchema should not emit on GEO pages where they are irrelevant

**Defer (v2+):**

- `SearchAction` in `WebSiteSchema` — requires actual client-side search implementation on the FAQ page
- `founder`/`employee` entity schemas — requires chef/founder details from restaurant owner; low SEO value without confirmed data
- Event schema for specials — only applicable if the restaurant runs ticketed events
- Additional content pages targeting individual city names (e.g., `/indian-food-williams-az/`) — these risk doorway page penalty; the `/directions/` hub page covers the geographic spread without fragmentation

**Anti-features (do not build):**

- AI-generated bulk content pages — Google's Helpful Content System actively suppresses thin AI-generated pages
- Keyword stuffing in FAQ answers — AI engines skip answers that repeat location terms rather than stating a clean fact
- Doorway pages with near-identical content differing only by city name — explicit Google penalty
- Schema markup describing content not visible on the page — structured data violation, risks manual action
- Dynamic routes or SSR pages — Apache-hosted static site; Node.js runtime not available

### Architecture Approach

All four new content pages follow the identical pattern already established by `faq.astro`: a single Astro file in `src/pages/`, wrapping content in `Layout.astro` with page-specific `title` and `description` props. No new layout wrappers, sub-layouts, or data layer files are required (except optionally `src/data/directions.json` for reuse). Every new page automatically inherits canonical URL derivation, breadcrumbs, all six schema components, Partytown analytics, and the Header/Footer/MobileActionButtons. The only structural changes to shared components are: (1) add two nav entries to `Header.tsx` navigation array; (2) add four page links to `Footer.astro`; (3) fix `BreadcrumbSchema` label derivation for hyphenated slugs; (4) add schema control props (`showFAQSchema`, `showMenuSchema`) to `Layout.astro` so GEO pages do not emit irrelevant schema.

**Major components:**

1. `Layout.astro` — universal page shell; needs minor extension for schema scoping and breadcrumb label prop
2. `src/components/schema/*.astro` — JSON-LD components; `RestaurantSchema`, `OrganizationSchema`, `WebSiteSchema` need targeted property additions
3. `src/data/business.json` (new) — single source-of-truth for NAP data; imported by all schema components and page copy
4. `src/pages/{about,directions,near-grand-canyon,route-66-dining}.astro` (new) — four static content pages, each with answer-first passage structure
5. `Header.tsx` + `Footer.astro` — nav array and footer links extended to include new pages
6. `.lighthouserc.json` — must be updated to include each new page URL as it is created

**Hub-and-spoke internal linking:** Homepage and `/about/` are hubs; all other pages link back to them and cross-link contextually. Anchor text must be keyword-containing, not generic.

### Critical Pitfalls

1. **Hours conflict between schema and FAQ (blocking)** — `RestaurantSchema.astro` says `07:00–22:00` daily; `faq.json` says `8:00 AM–9:00 PM` weekday / `8:00 AM–10:00 PM` weekend. This must be resolved with confirmed hours from the owner before any other schema work or content deploys. Extract all NAP to `src/data/business.json` to prevent recurrence.

2. **Schema over-engineering with unverifiable data** — `aggregateRating` must be sourced from a verifiable review count (Google Business Profile or a manually documented snapshot), not from the Gemini-summarized `reviews.json` content. `containedInPlace` must not be used for Route 66 corridor identity — it is for physical containment. `servesCuisine` must not include beverage categories (`"Beer"`, `"Wine"`).

3. **GEO pages shipping thin content** — each new page must contain 5+ unique facts not found elsewhere on the site and a minimum of 300 words. The failure mode is wrapping homepage content in new headings. Before writing any page, list the unique facts it will contain.

4. **Lighthouse CI coverage gap for new pages** — `.lighthouserc.json` currently only audits `/`. Every new page must be added to the URL list in the same commit that creates the page. Running the QA hook without this update gives a false pass while regressions ship undetected.

5. **BreadcrumbSchema label generation for hyphenated slugs** — the current logic produces "Near-grand-canyon" and "Route-66-dining" as breadcrumb labels in search results. Fix the derivation in `Layout.astro` (add `breadcrumbLabel` prop or a proper slug-to-title converter) before creating any new page.

---

## Implications for Roadmap

### Phase 1: Schema Data Integrity and Fixes

**Rationale:** The hours conflict and NAP inconsistencies are not a cleanup task — they are a blocking prerequisite. Any new schema additions or content pages deployed while contradictory data exists will have those contradictions amplified, not resolved. This must ship and be verified in Google Search Console before Phase 2 begins.

**Delivers:** Clean, consistent, validated schema with no warnings in Google Rich Results Test. Correct NAP data flowing from a single source file. `RestaurantSchema` with the five missing high-impact properties added. `servesCuisine` corrected.

**Addresses:** NAP consistency (FEATURES table stake #1), `geo`/`areaServed`/`aggregateRating`/`potentialAction` (FEATURES table stakes #2 and #7), `servesCuisine` correction (STACK audit bug #3)

**Avoids:** Hours conflict pitfall (PITFALLS #1), schema over-engineering pitfall (PITFALLS #2)

**Key tasks:**

- Confirm canonical hours with restaurant owner
- Extract NAP to `src/data/business.json`; update all imports
- Fix `RestaurantSchema`: telephone format, URL consistency, remove beverages from `servesCuisine`, add `geo`, `aggregateRating` (from verified source), `areaServed` array, `potentialAction` (OrderAction with Toast URL)
- Update `WebSiteSchema`: add `description` and `publisher`
- Validate with Google Rich Results Test before merging

### Phase 2: FAQ Expansion

**Rationale:** FAQ expansion is a data-only change (`faq.json`) with zero schema code changes and zero Lighthouse risk. It delivers immediate AEO signal improvement and can deploy rapidly once Phase 1 hours data is confirmed (since FAQ hours must match schema hours). It is isolated from Phase 3 page creation and can run in parallel with early Phase 3 prep.

**Delivers:** 20 FAQ entries covering the five high-value question patterns: distance/travel time, exit/navigation, food type by location, dietary accommodation, and operational queries. Each answer is 60 words or fewer, fact-first, with no repeated keyword stuffing.

**Addresses:** FAQ expansion from 9 to 20 questions (FEATURES table stake #5), route-specific FAQ patterns (FEATURES differentiator patterns 1-6)

**Avoids:** FAQ keyword stuffing pitfall (PITFALLS #3)

**Key tasks:**

- Write 11 new FAQ entries following the answer-first pattern documented in PITFALLS #3
- Ensure hours in new FAQ answers match the canonical hours confirmed in Phase 1
- Run `npm run test:aeo` against the FAQ page after build

### Phase 3: GEO Content Pages

**Rationale:** Pages build on the clean schema foundation from Phase 1. Deploy one page per commit in priority order: `/about/` first (canonical entity page that all others link to), then `/directions/` (reuses existing `GoogleMap.tsx`), then `/near-grand-canyon/` (highest-value SEO page, zero competition), then `/route-66-dining/` (contextual/editorial, benefits from other pages being live first). Each page gets its own Lighthouse CI audit entry and is validated before the next page begins.

**Delivers:** Four content pages with unique, AI-extractable passage content. Hub-and-spoke internal linking structure. Breadcrumb schema fix. Schema scoping to prevent FAQ/Menu schema dilution on GEO pages. Navigation and footer updates linking all pages.

**Addresses:** All four differentiator content pages (FEATURES differentiators #2-5), per-page BreadcrumbSchema (FEATURES differentiator #6), `llms.txt` update with distance facts (FEATURES table stake #4)

**Avoids:** Thin content pitfall (PITFALLS #4), Lighthouse regression pitfall (PITFALLS #5), schema on wrong pages pitfall (PITFALLS #6), commit-batching QA bypass pitfall (PITFALLS #8)

**Key tasks for each page (in order):**

- List 5+ unique facts before writing
- Add page URL to `.lighthouserc.json` first
- Fix `BreadcrumbSchema` label logic before creating first page
- Add schema control props to `Layout.astro` before creating first page
- Write content with answer-first paragraph structure per ARCHITECTURE HTML rules
- Run `npm run build && npm run test:lhci` locally after each page before push
- Validate schema in Rich Results Test before merging

### Phase 4: Off-Site Profile Optimization and `sameAs` Linking

**Rationale:** `sameAs` links must not be added until off-site profiles (Yelp, TripAdvisor, Google Maps) are verified to have consistent NAP matching the Phase 1 canonical data. Adding `sameAs` links to inconsistent profiles weakens citation authority rather than strengthening it. This phase must be treated as a single atomic unit: profiles updated and verified, then `sameAs` added to `OrganizationSchema` in one commit.

**Delivers:** Complete entity graph linking across major review platforms. Knowledge Panel enrichment. AI citation cross-referencing between site entity and review site entities.

**Addresses:** `sameAs` links in OrganizationSchema (FEATURES table stake #3), off-site profile consistency (PITFALLS #7)

**Avoids:** `sameAs` pointing to inconsistent or unverified profiles (PITFALLS #7)

**Blocked on:** Restaurant owner providing Yelp, TripAdvisor, and Google Maps business profile URLs

### Phase Ordering Rationale

- Phase 1 before everything: data conflicts make all subsequent work unreliable. This is the single non-negotiable dependency.
- Phase 2 before Phase 3: FAQ hours must match schema hours (Phase 1); FAQ content feeds into page cross-links in Phase 3.
- Phase 3 pages in specified order: `/about/` is the entity hub that other pages link to for authority; `/near-grand-canyon/` is highest-value and should index as early as possible.
- Phase 4 last: requires owner-provided profile URLs and external profile consistency that cannot be self-verified.

### Research Flags

Phases needing deeper research during planning:

- **Phase 1 (aggregateRating):** Requires verification of the exact field structure in `reviews.json` (does it store a numeric `rating` per review, a pre-computed average, or a Gemini summary string?). The implementation pattern depends entirely on the actual schema. Do not assume — read the file first.
- **Phase 3 (near-grand-canyon distances):** All distance and drive time figures must be verified against Google Maps before publishing. The research documents approximate values that are directionally correct but should not be published as facts without verification.
- **Phase 4 (sameAs URLs):** Fully blocked on owner providing URLs. No research substitute for confirmed business profile links.

Phases with standard patterns (skip `/gsd:research-phase`):

- **Phase 2 (FAQ expansion):** Writing factual FAQ answers is a content task, not a technical one. The patterns are fully documented in PITFALLS #3 and FEATURES FAQ Patterns sections.
- **Phase 3 (page architecture):** The Astro page structure is fully specified in ARCHITECTURE.md with exact file paths, HTML structure, component imports, and Layout props for each page. No ambiguity.
- **Phase 1 (schema property formats):** All schema.org property formats are documented in STACK.md with exact JSON examples. No new research needed.

---

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                                                                                                                                                             |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | schema-dts + is:inline pattern confirmed as optimal for Astro static sites; no new packages needed; all property formats documented against stable schema.org spec                                                                                                                |
| Features     | HIGH       | Table stakes (NAP, geo, FAQPage, sameAs) are well-established local SEO signals; anti-features (doorway pages, thin content) are explicitly documented in Google guidelines; medium confidence on AI engine citation specifics (no A/B test data for single-location restaurants) |
| Architecture | HIGH       | Based on direct codebase analysis of existing files; new page patterns are direct extensions of faq.astro with no ambiguity; component boundaries and data flow fully mapped                                                                                                      |
| Pitfalls     | HIGH       | Pitfalls are grounded in specific codebase issues found during research (hours conflict, telephone format, servesCuisine misuse) — not generic warnings; phase mapping is concrete                                                                                                |

**Overall confidence:** HIGH

### Gaps to Address

- **Canonical business hours:** The hours discrepancy (`07:00–22:00` in schema vs. `8 AM–9 PM weekday / 8 AM–10 PM weekend` in FAQ) cannot be resolved by research — it requires a direct answer from the restaurant owner. All other Phase 1 work can begin, but nothing with hours data can deploy until this is confirmed.

- **`reviews.json` field structure:** The exact structure of `reviews.json` determines how `aggregateRating` is computed at build time. The research assumes a numeric `rating` field per review entry but this must be verified before implementing the import in `RestaurantSchema.astro`.

- **Toast ordering URL:** FEATURES.md documents the Toast URL as `https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave` — this must be verified as the correct, current direct-ordering URL before adding `potentialAction` to `RestaurantSchema`.

- **Google Maps CID for `hasMap`:** Requires manually fetching the canonical CID URL from Google Maps (not the short link) — a one-time manual verification step.

- **Off-site profile URLs:** Phase 4 is entirely blocked on the restaurant owner providing verified Yelp, TripAdvisor, and Google Maps profile URLs. No surrogate is available.

- **`llms.txt` Halal messaging:** FEATURES.md notes the Halal certification wording (`100% Halal Certified`) may need revision, tracked as a separate concern. This should be resolved with the owner before `llms.txt` is updated with distance/exit facts.

---

## Sources

### Primary (HIGH confidence)

- `schema.org` specification — all property formats and type definitions for `Restaurant`, `GeoCoordinates`, `AggregateRating`, `OrderAction`, `FAQPage`, `BreadcrumbList`
- Google Search Central structured data documentation — `openingHoursSpecification`, `aggregateRating` eligibility, `potentialAction` patterns, NAP consistency requirements
- Astro 5 documentation — `is:inline`, `set:html`, `build.format: 'directory'`, `trailingSlash`, `@astrojs/sitemap` behavior
- Direct codebase analysis — `RestaurantSchema.astro`, `OrganizationSchema.astro`, `WebSiteSchema.astro`, `FAQSchema.astro`, `Layout.astro`, `BreadcrumbSchema.astro`, `faq.json`, `Header.tsx`, `Footer.astro`, `.lighthouserc.json`

### Secondary (MEDIUM confidence)

- Google AI Overviews behavior with FAQPage schema — evidenced in 2024-2025 SEO literature but not officially documented by Google
- Perplexity and ChatGPT citation behavior for local business structured data — documented by Perplexity's published crawler documentation and SEO community research through August 2025
- `llms.txt` standard — proposed by Answer.ai, confirmed adopted by Anthropic and Perplexity; OpenAI/Google status unconfirmed

### Tertiary (LOWER confidence)

- `aggregateRating` enabling Google star rich results for restaurant self-hosted ratings — Google has tightened eligibility; benefit is primarily for AI engines, not SERP star display
- `containedInPlace` for geographic corridor identity — valid schema.org property but uncommon for restaurants; medium expected benefit
- Specific distance figures (68 miles Grand Canyon, 185 miles Las Vegas, etc.) — approximate based on geographic knowledge; must be verified against Google Maps before publishing

---

_Research completed: 2026-02-20_
_Ready for roadmap: yes_
