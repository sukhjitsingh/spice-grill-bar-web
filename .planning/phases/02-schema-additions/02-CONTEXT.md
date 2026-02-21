# Phase 2: Schema Additions - Context

**Gathered:** 2026-02-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Enrich three existing JSON-LD schema components (RestaurantSchema, OrganizationSchema, WebSiteSchema) with missing local SEO signals. No new schema components, no new pages, no visible UI changes. All work is in structured data markup only.

</domain>

<decisions>
## Implementation Decisions

### Area Coverage Modeling

- areaServed expands from plain string "Ash Fork" to an array of Place objects
- Full town list (12 entries): Ash Fork, Williams, Kaibab Estates West, Crookton, Seligman, Paulden, Prescott, Prescott Valley, Sedona, Grand Canyon South Rim, I-40 Corridor (Arizona), Historic Route 66 (Arizona)
- Flagstaff explicitly excluded
- Grand Canyon listed as "Grand Canyon South Rim" (not generic "Grand Canyon")
- I-40 Corridor and Route 66 scoped to Arizona specifically
- Ordering: Ash Fork first (home base), then remaining by distance from restaurant
- Place names only — no distance or drive-time info in schema (that lives in Phase 5 content pages)
- Mix of active customer base (nearby towns) and traveler visibility (Prescott, Sedona, etc.)
- containedInPlace: Claude's discretion on hierarchy depth (town → county → state)
- State name format (AZ vs Arizona): Claude's discretion
- Address depth per entry: Claude's discretion (avoid redundancy with main schema address)
- Place vs text modeling for route/corridor entries: Claude's discretion

### Rating Data Source

- aggregateRating computed from reviews.json (contains Google and Yelp reviews)
- Snapshot approach with manual refresh — NOT auto-computed on every build
- Initial snapshot: compute from current reviews.json contents
- Rating storage location: Claude's discretion (separate file or metadata field)
- Standard 1-5 scale (bestRating: 5, worstRating: 1)
- Reviews without a numeric rating field are excluded from the calculation

### Entity Linking Strategy

- Add three new sameAs entries: Google Maps, Yelp, TripAdvisor
- URLs confirmed:
  - Google Maps: https://maps.app.goo.gl/q2EJFMbMRaysU6vH8 (Claude decides whether to resolve to canonical URL)
  - Yelp: https://www.yelp.com/biz/spice-grill-and-bar-ash-fork
  - TripAdvisor: https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html
- sameAs array order: Google Maps, Yelp, TripAdvisor, Facebook, Instagram
- hasMap URL format: Claude's discretion on which Google Maps URL format to use
- Toast ordering URL for potentialAction (OrderAction): https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave
- GPS coordinates for geo property: 35.22291449138381, -112.47815397255074

### WebSiteSchema Enrichment

- Add GEO-optimized description with mandatory keywords: "Ash Fork", "Exit 146", "Route 66"
- Description wording: Claude's discretion (balancing geo signals, cuisine, and AEO impact)
- publisher property references the Organization entity (Spice Grill & Bar)
- No SearchAction — site has no search functionality
- inLanguage property: Claude's discretion

### Claude's Discretion

- Place vs text modeling for route/corridor concepts (I-40 Corridor, Route 66)
- containedInPlace hierarchy depth
- State name format in Place objects
- Address detail level per areaServed entry
- Rating snapshot storage mechanism
- Google Maps URL format (short vs canonical) for sameAs and hasMap
- WebSiteSchema description wording
- Whether to add inLanguage to WebSiteSchema

</decisions>

<specifics>
## Specific Ideas

- GPS coordinates confirmed from Google Maps pin: 35.22291449138381, -112.47815397255074
- Toast ordering URL confirmed: https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave
- sameAs ordering reflects business priority: Google first, then review platforms, then social media
- "Grand Canyon South Rim" preferred over generic "Grand Canyon" — matches Phase 5 content page targeting

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-schema-additions_
_Context gathered: 2026-02-20_
