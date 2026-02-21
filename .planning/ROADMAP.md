# Roadmap: Spice Grill & Bar — SEO/GEO/AEO Optimization

## Overview

The Astro 5 migration is complete. This project makes the site the authoritative answer when AI engines and Google are asked about an Indian restaurant near the Grand Canyon, an I-40 food stop, or a pitstop on Route 66. Work proceeds in a strict dependency order: fix broken schema data first (inconsistent hours, wrong phone format, non-canonical URL), then add the missing schema signals, then expand FAQ, then build the GEO content pages on top of a clean foundation. Nothing new ships on top of broken data.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Schema Fixes** - Correct broken hours, phone, and URL data in RestaurantSchema before any other work ships
- [ ] **Phase 2: Schema Additions** - Add the five missing local SEO signals (geo, areaServed, aggregateRating, OrderAction, sameAs) and expand WebSiteSchema
- [ ] **Phase 3: FAQ Expansion** - Grow faq.json from 9 to 20 route/highway-targeted entries and verify FAQSchema renders them all
- [ ] **Phase 4: Content Infrastructure** - Fix breadcrumb labels, add new pages to Lighthouse CI, and update nav/footer links before any content page goes live
- [ ] **Phase 5: GEO Content Pages** - Create /near-grand-canyon/ and /directions/ with answer-first AI-extractable passage structure

## Phase Details

### Phase 1: Schema Fixes

**Goal**: Correct, consistent, and validated NAP data flows through every schema component — no hours conflicts, no format errors, no non-canonical URLs
**Depends on**: Nothing (first phase)
**Requirements**: SCHM-01, SCHM-02, SCHM-03, SCHM-04
**Success Criteria** (what must be TRUE):

1. Google Rich Results Test shows zero errors and zero warnings for RestaurantSchema on the homepage
2. The hours displayed in structured data match confirmed business hours: Monday closed, Tuesday–Thursday 08:00–21:00, Friday–Sunday 08:00–22:00
3. The telephone field in structured data renders as +1-928-277-1292 (E.164 format)
4. The url field in RestaurantSchema resolves to https://spicegrillbar66.com (no www prefix)
5. The hours answer in faq.json matches the schema hours exactly (Monday closure is explicit)
   **Plans**: TBD

Plans:

- [ ] 01-01: Fix RestaurantSchema (hours, telephone, url) and update faq.json hours answer

### Phase 2: Schema Additions

**Goal**: RestaurantSchema carries all five missing local SEO signals, OrganizationSchema has sameAs entity links, and WebSiteSchema has a GEO-optimized description
**Depends on**: Phase 1
**Requirements**: SCHM-05, SCHM-06, SCHM-07, SCHM-08, SCHM-09, SCHM-10
**Success Criteria** (what must be TRUE):

1. RestaurantSchema includes a geo property with latitude and longitude extracted from the Google Maps pin
2. RestaurantSchema areaServed is an array of Place objects covering Ash Fork, Williams, Seligman, Kaibab Estates, I-40 Corridor, and Historic Route 66
3. RestaurantSchema includes aggregateRating computed at build time from reviews.json (no hardcoded values)
4. RestaurantSchema includes hasMap, potentialAction (OrderAction with Toast URL), and containedInPlace
5. OrganizationSchema sameAs array contains Google Maps, Yelp, and TripAdvisor profile URLs
6. WebSiteSchema carries a GEO-optimized description and publisher property
   **Plans**: TBD

Plans:

- [ ] 02-01: Add geo, areaServed, aggregateRating, hasMap, potentialAction, containedInPlace to RestaurantSchema
- [ ] 02-02: Add sameAs to OrganizationSchema and update WebSiteSchema description and publisher

### Phase 3: FAQ Expansion

**Goal**: faq.json covers the twenty most common road-tripper and local-resident queries, and FAQSchema renders every entry without a hardcoded limit
**Depends on**: Phase 1
**Requirements**: FAQ-01, FAQ-02
**Success Criteria** (what must be TRUE):

1. faq.json contains exactly 20 entries, including highway-specific queries (I-40 exit number, Grand Canyon distance/drive time, Las Vegas distance, Flagstaff, Phoenix, Kingman, pickup availability for Williams/Seligman)
2. Every FAQ answer is written answer-first with a fact in the first sentence and is 60 words or fewer
3. FAQSchema.astro emits structured data for all 20 entries (no hardcoded count, no index limit)
4. npm run test:aeo passes against the FAQ page after build with no regressions
   **Plans**: TBD

Plans:

- [ ] 03-01: Write 11 new faq.json entries and verify FAQSchema renders all entries dynamically

### Phase 4: Content Infrastructure

**Goal**: Shared scaffolding is correct and complete so every new content page inherits clean breadcrumbs, Lighthouse CI coverage, and navigation links from day one
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):

1. BreadcrumbSchema generates human-readable labels for hyphenated slugs (e.g., /near-grand-canyon/ shows "Near Grand Canyon" in search results, not "Near-grand-canyon")
2. .lighthouserc.json includes /near-grand-canyon/ and /directions/ so Lighthouse CI audits both pages on every push
3. Header navigation includes links to /near-grand-canyon/ and /directions/
4. Footer links include /near-grand-canyon/ and /directions/
   **Plans**: TBD

Plans:

- [ ] 04-01: Fix BreadcrumbSchema label generation, add pages to lighthouserc.json, update Header and Footer links

### Phase 5: GEO Content Pages

**Goal**: Two live content pages with AI-extractable passage structure capture Grand Canyon proximity and I-40 navigation queries
**Depends on**: Phase 4
**Requirements**: CONT-04, CONT-05
**Success Criteria** (what must be TRUE):

1. /near-grand-canyon/ is live with an answer-first H1 stating distance and drive time from Grand Canyon South Rim, per-city distance facts as standalone extractable paragraphs, dish recommendations for road-trippers, and page-specific title/meta/OpenGraph tags
2. /directions/ is live with per-city H2 sections (Las Vegas, Los Angeles, Flagstaff, Kingman, Phoenix, Williams, Seligman), each containing a turn-by-turn summary emphasizing I-40 Exit 146, an address block with NAP data, and a Google Maps embed
3. Both pages cross-link to each other and to the homepage with keyword-containing anchor text
4. Lighthouse CI passes for both new page URLs (LCP < 4000ms, Accessibility >= 90, SEO >= 90)
5. Schema in Rich Results Test shows no errors for either page
   **Plans**: TBD

Plans:

- [ ] 05-01: Create /near-grand-canyon/ page
- [ ] 05-02: Create /directions/ page

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

Note: Phase 3 (FAQ Expansion) and Phase 4 (Content Infrastructure) both depend only on Phase 1. They can be sequenced in any order, but Phase 4 must complete before Phase 5 begins.

| Phase                     | Plans Complete | Status      | Completed |
| ------------------------- | -------------- | ----------- | --------- |
| 1. Schema Fixes           | 0/1            | Not started | -         |
| 2. Schema Additions       | 0/2            | Not started | -         |
| 3. FAQ Expansion          | 0/1            | Not started | -         |
| 4. Content Infrastructure | 0/1            | Not started | -         |
| 5. GEO Content Pages      | 0/2            | Not started | -         |
