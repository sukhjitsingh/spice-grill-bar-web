# Requirements: Spice Grill & Bar — SEO/GEO/AEO Optimization

**Defined:** 2026-02-20
**Core Value:** AI engines and Google must surface Spice Grill & Bar as the answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.

## Confirmed Business Data (source of truth for all schema)

| Field              | Value                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Hours              | Monday: Closed / Tuesday–Thursday: 8:00 AM–9:00 PM / Friday–Sunday: 8:00 AM–10:00 PM                         |
| Phone (E.164)      | +1-928-277-1292                                                                                              |
| Canonical URL      | https://spicegrillbar66.com (no www)                                                                         |
| Google Maps        | https://maps.app.goo.gl/vHbdJk7hqXemMssB9                                                                    |
| Yelp               | https://www.yelp.com/biz/spice-grill-and-bar-ash-fork                                                        |
| TripAdvisor        | https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html |
| Toast ordering URL | (verify current URL before Phase 1 schema task)                                                              |
| Geo coordinates    | (extract lat/lng from Google Maps pin — approximately 35.5022, -112.4874)                                    |

---

## v1 Requirements

### Schema Integrity — Fixes

- [x] **SCHM-01**: Correct `openingHoursSpecification` in `RestaurantSchema.astro` to match confirmed hours (Monday closed; Tuesday–Thursday 08:00–21:00; Friday–Sunday 08:00–22:00)
- [x] **SCHM-02**: Update hours answer in `faq.json` to match confirmed hours (currently states 8AM–9PM weekdays / 8AM–10PM weekends, which is partially correct but omits Monday closure)
- [x] **SCHM-03**: Fix `telephone` property to E.164 format (`+1-928-277-1292`) in `RestaurantSchema.astro`
- [x] **SCHM-04**: Fix `url` property in `RestaurantSchema.astro` from `www.spicegrillbar66.com` to `spicegrillbar66.com` (without www, matching canonical in `astro.config.mjs`)

### Schema Integrity — Additions

- [x] **SCHM-05**: Add `geo` (`GeoCoordinates`) to `RestaurantSchema.astro` using coordinates extracted from the Google Maps pin
- [x] **SCHM-06**: Expand `areaServed` from single string to array of `Place` objects: Ash Fork, Williams, Seligman, Kaibab Estates, I-40 Corridor, Historic Route 66
- [x] **SCHM-07**: Compute `aggregateRating` at Astro build time from `reviews.json` (inspect `reviews.json` field names during task; do not hardcode values)
- [x] **SCHM-08**: Add `hasMap` (owner-provided Google Maps URL), `potentialAction` (`OrderAction` with Toast ordering URL), and `containedInPlace` (Historic Route 66, linked to Wikipedia) to `RestaurantSchema.astro`
- [x] **SCHM-09**: Add `sameAs` array to `OrganizationSchema.astro` with Google Maps, Yelp, and TripAdvisor URLs (all URLs confirmed above)
- [x] **SCHM-10**: Add GEO-optimized `description` and `publisher` property to `WebSiteSchema.astro`

### FAQ Expansion

- [x] **FAQ-01**: Expand `faq.json` from 9 to 20 questions by adding 11 highway/route-specific entries covering: I-40 exit number (Exit 146), distance and drive time from Grand Canyon South Rim (~70 mi / ~1 hr), Las Vegas, Flagstaff, Phoenix, Kingman; whether it's a good I-40 pitstop; pickup availability for Williams/Seligman; what to order for road-trippers
- [x] **FAQ-02**: Verify `FAQSchema.astro` renders all `faq.json` entries dynamically (no hardcoded question count or index limit)

### Content Infrastructure

- [ ] **CONT-01**: Fix `BreadcrumbSchema` breadcrumb label generation in `Layout.astro` to produce human-readable labels for hyphenated slugs (e.g., `/near-grand-canyon/` → "Near Grand Canyon", not "Near-grand-canyon")
- [ ] **CONT-02**: Add `/near-grand-canyon/` and `/directions/` URLs to `.lighthouserc.json` so Lighthouse CI audits new pages on every push
- [ ] **CONT-03**: Update `Header.tsx` navigation array and `Footer.astro` links to include `/near-grand-canyon/` and `/directions/`

### GEO Content Pages

- [ ] **CONT-04**: Create `/near-grand-canyon/` page with: answer-first H1 stating distance and drive time, per-city distance facts as standalone extractable `<p>` sentences, dish recommendations for road-trippers, internal links to `/directions/` and homepage, page-specific `<title>` and meta description, and OpenGraph tags
- [ ] **CONT-05**: Create `/directions/` page with: per-city H2 sections (Las Vegas, Los Angeles, Flagstaff, Kingman, Phoenix, Williams, Seligman) each with turn-by-turn summary and "I-40 Exit 146" emphasized, `<address>` block with NAP data, Google Maps embed (`GoogleMap.tsx` with `client:visible`), and internal link to `/near-grand-canyon/`

---

## v2 Requirements

### Content Pages (Deferred)

- **CONT-V2-01**: Create `/about/` page — full brand narrative with extractable AI passages, Punjabi cuisine context, Ash Fork location identity, `<address>` NAP block
- **CONT-V2-02**: Create `/route-66-dining/` page — Route 66 heritage content, Ash Fork history, road-tripper dining context

### Schema (Deferred)

- **SCHM-V2-01**: Fix `servesCuisine` in `RestaurantSchema.astro` to remove beverage types (Beer, Wine, Soft Drinks, Alcoholic Beverages) — not cuisine types per schema.org

### Off-Site & Automation

- **OFfS-V2-01**: Apple Maps Business Connect profile optimization — categories, imagery, Toast integration (manual, off-site)
- **AUTO-V2-01**: Automated KPI tracker — AI citation frequency, GBP direction requests, review velocity

---

## Out of Scope

| Feature                                      | Reason                                                                       |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| Halal messaging refresh                      | Copy not decided — no code changes until replacement wording is confirmed    |
| New npm dependencies                         | Bundle size and Lighthouse scores are non-negotiable                         |
| `/about/` and `/route-66-dining/` pages (v1) | Deferred to v2; `/near-grand-canyon/` and `/directions/` are higher priority |
| Server-side rendering                        | Static hosting on Apache — must stay fully static                            |
| Online ordering system changes               | Toast integration is complete; out of scope                                  |
| Reddit / TripAdvisor engagement              | Manual off-site work, not automated by this codebase                         |
| Google Business Profile posts                | Manual, handled by owner                                                     |

---

## Traceability

| Requirement | Phase | Status   |
| ----------- | ----- | -------- |
| SCHM-01     | 1     | Complete |
| SCHM-02     | 1     | Complete |
| SCHM-03     | 1     | Complete |
| SCHM-04     | 1     | Complete |
| SCHM-05     | 2     | Complete |
| SCHM-06     | 2     | Complete |
| SCHM-07     | 2     | Complete |
| SCHM-08     | 2     | Complete |
| SCHM-09     | 2     | Complete |
| SCHM-10     | 2     | Complete |
| FAQ-01      | 3     | Complete |
| FAQ-02      | 3     | Complete |
| CONT-01     | 4     | Pending  |
| CONT-02     | 4     | Pending  |
| CONT-03     | 4     | Pending  |
| CONT-04     | 5     | Pending  |
| CONT-05     | 5     | Pending  |

**Coverage:**

- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0

---

_Requirements defined: 2026-02-20_
_Last updated: 2026-02-20 after roadmap creation — traceability complete_
