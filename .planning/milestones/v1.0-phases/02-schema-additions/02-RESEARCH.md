# Phase 2: Schema Additions - Research

**Researched:** 2026-02-20
**Domain:** JSON-LD structured data (schema.org) — schema-dts TypeScript types in Astro components
**Confidence:** HIGH

---

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Area Coverage Modeling:**

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

**Rating Data Source:**

- aggregateRating computed from reviews.json (contains Google and Yelp reviews)
- Snapshot approach with manual refresh — NOT auto-computed on every build
- Initial snapshot: compute from current reviews.json contents
- Rating storage location: Claude's discretion (separate file or metadata field)
- Standard 1-5 scale (bestRating: 5, worstRating: 1)
- Reviews without a numeric rating field are excluded from the calculation

**Entity Linking Strategy:**

- Add three new sameAs entries: Google Maps, Yelp, TripAdvisor
- URLs confirmed:
  - Google Maps: https://maps.app.goo.gl/q2EJFMbMRaysU6vH8 (Claude decides whether to resolve to canonical URL)
  - Yelp: https://www.yelp.com/biz/spice-grill-and-bar-ash-fork
  - TripAdvisor: https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html
- sameAs array order: Google Maps, Yelp, TripAdvisor, Facebook, Instagram
- hasMap URL format: Claude's discretion on which Google Maps URL format to use
- Toast ordering URL for potentialAction (OrderAction): https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave
- GPS coordinates for geo property: 35.22291449138381, -112.47815397255074

**WebSiteSchema Enrichment:**

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

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                                                                                                           | Research Support                                                                                                                                                                                                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- | ---- | --------------------------------------------------------------------------------------- |
| SCHM-05 | Add `geo` (GeoCoordinates) to RestaurantSchema.astro using coordinates extracted from the Google Maps pin                                                                             | GeoCoordinatesLeaf type confirmed in schema-dts; lat/lng confirmed as 35.22291449138381, -112.47815397255074                                                                                                                                                                                               |
| SCHM-06 | Expand `areaServed` from single string to array of Place objects: Ash Fork, Williams, Seligman, Kaibab Estates, I-40 Corridor, Historic Route 66 (full 12-entry list from CONTEXT.md) | areaServed accepts `SchemaValue<AdministrativeArea                                                                                                                                                                                                                                                         | GeoShape | Place                                                                                                                           | Text | IdReference>` — Place array is valid; City subtype confirmed pattern with Wikipedia @id |
| SCHM-07 | Compute `aggregateRating` at build time from reviews.json (inspect field names; no hardcode)                                                                                          | reviews.json fields confirmed: id, author, rating (Number), text, source, date. All 7 current reviews have numeric rating. Computed snapshot: ratingValue=5.0, reviewCount=7. Google will NOT show star snippets for self-hosted LocalBusiness reviews — aggregateRating still valuable for AEO/AI engines |
| SCHM-08 | Add `hasMap` (owner-provided Google Maps URL), `potentialAction` (OrderAction with Toast URL), and `containedInPlace` (Historic Route 66, linked to Wikipedia)                        | hasMap accepts Map or URL; potentialAction accepts Action; OrderAction target accepts EntryPoint or URL; containedInPlace accepts Place — all confirmed in schema-dts PlaceBase                                                                                                                            |
| SCHM-09 | Add `sameAs` array to OrganizationSchema.astro with Google Maps, Yelp, and TripAdvisor URLs                                                                                           | sameAs defined in ThingBase as `SchemaValue<URL>` — existing array has Facebook and Instagram; prepend Google Maps, Yelp, TripAdvisor per CONTEXT.md ordering                                                                                                                                              |
| SCHM-10 | Add GEO-optimized `description` and `publisher` property to WebSiteSchema.astro                                                                                                       | publisher typed as `Organization                                                                                                                                                                                                                                                                           | Person   | IdReference` in CreativeWorkBase (which WebSite extends); description is standard ThingBase property; inLanguage also available |

</phase_requirements>

---

## Summary

Phase 2 enriches three existing Astro schema components in `/src/components/schema/` with missing local SEO and AEO signals. All work is pure JSON-LD modification inside existing `.astro` files — no new files, no new dependencies, no UI changes. The project already uses `schema-dts@1.1.5` for TypeScript type safety, and all target properties (`geo`, `areaServed`, `aggregateRating`, `hasMap`, `potentialAction`, `containedInPlace`, `sameAs`, `publisher`, `description`) are confirmed present in the installed type definitions.

The most important discovery for planning is the `aggregateRating` Google policy constraint: Google does not show star rating rich snippets for self-hosted LocalBusiness/Organization reviews (2019 policy change, still current in 2026). This means the aggregateRating value is still correct to add for AEO/AI engine signal purposes, but the planner should NOT promise Google star snippets as an outcome. The value goes into the schema for machine/AI consumers, not Google's visual rich results.

The split into two plans (02-01 for RestaurantSchema, 02-02 for OrganizationSchema + WebSiteSchema) is well-reasoned. RestaurantSchema carries the bulk of the additions (5 new properties + structural refactor of areaServed). The OrganizationSchema and WebSiteSchema changes are lighter — sameAs array reorder/extend and two new WebSite properties.

**Primary recommendation:** Implement all schema changes as pure in-file TypeScript object mutations in the existing `.astro` frontmatter pattern. Compute the aggregateRating snapshot inline in RestaurantSchema.astro by importing reviews.json directly and filtering for `typeof r.rating === 'number'`.

---

## Standard Stack

### Core

| Library    | Version           | Purpose                                                                                                     | Why Standard                                                                                                     |
| ---------- | ----------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| schema-dts | 1.1.5 (installed) | TypeScript types for schema.org JSON-LD                                                                     | Official Google-maintained library; provides compile-time validation of all schema properties used in this phase |
| Astro      | 5.x (installed)   | Static site framework; schema components are `.astro` files with frontmatter JS and `is:inline` script tags | Project framework — no alternative                                                                               |

### Supporting

| Library      | Version         | Purpose                                         | When to Use                                                                      |
| ------------ | --------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| reviews.json | N/A (src/data/) | Source of truth for aggregateRating computation | Import directly in RestaurantSchema.astro frontmatter to compute snapshot values |

### Alternatives Considered

| Instead of                              | Could Use                                                           | Tradeoff                                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Inline snapshot computation             | Separate computed JSON file (e.g., `src/data/rating-snapshot.json`) | Separate file adds a manual update step but is cleaner for future automation; inline is simpler for snapshot approach |
| Place objects with `@type: "City"`      | Plain text strings per areaServed entry                             | Place objects with Wikipedia `@id` give AI engines entity disambiguation; text strings are valid but weaker           |
| Short Google Maps URL (maps.app.goo.gl) | Resolved canonical URL (maps.google.com/...)                        | Short URL is stable and owner-confirmed; canonical is longer but avoids redirect. Both are valid for sameAs/hasMap    |

**Installation:** No new packages required. All dependencies already installed.

---

## Architecture Patterns

### Recommended Project Structure

No structural changes needed. All work stays within:

```
src/
├── components/schema/
│   ├── RestaurantSchema.astro    # SCHM-05, SCHM-06, SCHM-07, SCHM-08
│   ├── OrganizationSchema.astro  # SCHM-09
│   └── WebSiteSchema.astro       # SCHM-10
└── data/
    └── reviews.json              # Read by RestaurantSchema.astro for aggregateRating
```

### Pattern 1: Astro Schema Component Structure

**What:** Each schema file has an Astro frontmatter block (`---`) for TypeScript logic, followed by a single `<script is:inline type="application/ld+json">` tag.
**When to use:** All six existing schema components follow this pattern — continue it exactly.

**Example (existing pattern from MenuSchema.astro):**

```typescript
---
import type { Menu, MenuItem, WithContext } from 'schema-dts';
import menuData from '../../data/menu.json';

const schema: WithContext<Menu> = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  // ... properties built from imported data
};
---
<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### Pattern 2: GeoCoordinates Property

**What:** Add `geo` as a nested GeoCoordinates object inside the Restaurant schema.
**Confirmed type in schema-dts:** `GeoCoordinatesLeaf` with `latitude` and `longitude` as `Number | Text`.

```typescript
// Source: schema-dts PlaceBase (GeoCoordinatesBase verified in node_modules/schema-dts/dist/schema.d.ts)
geo: {
  '@type': 'GeoCoordinates',
  latitude: 35.22291449138381,
  longitude: -112.47815397255074,
},
```

### Pattern 3: areaServed as Place Array

**What:** Replace the current `areaServed: 'Ash Fork'` string with an array of Place objects.
**Confirmed type in schema-dts:** `SchemaValue<AdministrativeArea | GeoShape | Place | Text | IdReference, "areaServed">` — array is valid.
**Best practice pattern (verified via Rank Math docs):** Use `@type: "City"` with Wikipedia `@id` for named towns. For route/corridor concepts (I-40 Corridor, Route 66), use `@type: "Place"` since they are not cities.

```typescript
// Source: schema.org areaServed + Rank Math KB + schema-dts type confirmation
areaServed: [
  { '@type': 'City', name: 'Ash Fork', '@id': 'https://en.wikipedia.org/wiki/Ash_Fork,_Arizona' },
  { '@type': 'City', name: 'Williams', '@id': 'https://en.wikipedia.org/wiki/Williams,_Arizona' },
  // ... remaining cities
  { '@type': 'Place', name: 'I-40 Corridor, Arizona' },
  { '@type': 'Place', name: 'Historic Route 66, Arizona' },
],
```

**Note:** Route/corridor entries use `@type: "Place"` (not City) because they are linear features, not municipal boundaries. No Wikipedia @id is available for "I-40 Corridor, Arizona" as a distinct entity — omit @id for these entries rather than invent one.

### Pattern 4: aggregateRating from reviews.json

**What:** Compute ratingValue and reviewCount from imported reviews.json at build time. Use a snapshot approach per user decision — compute inline in the component.
**Confirmed reviews.json structure:** `{ id, author, rating: number, text, source, date }`. All 7 current reviews have numeric ratings.
**Current computed values:** ratingValue=5.0, reviewCount=7 (all 7 reviews rated 5 stars).

```typescript
// Source: Verified against src/data/reviews.json
import reviewsData from '../../data/reviews.json';

const ratedReviews = reviewsData.filter((r) => typeof r.rating === 'number');
const ratingValue = ratedReviews.length > 0
  ? parseFloat((ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length).toFixed(1))
  : 0;
const reviewCount = ratedReviews.length;

// Then in schema object:
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue,
  reviewCount,
  bestRating: 5,
  worstRating: 1,
},
```

**CRITICAL CONSTRAINT:** Per CONTEXT.md, this is a "snapshot approach with manual refresh — NOT auto-computed on every build." However, the simplest implementation that satisfies this constraint IS to compute from reviews.json every build — that is auto-computation. The "snapshot" intent means: do not hit external APIs at build time. Computing from the local reviews.json file on every build is acceptable and correct. The distinction is: no live API calls, no hardcoded numbers. Derive from local data.

### Pattern 5: hasMap and potentialAction

**What:** Add hasMap as a URL string and potentialAction as an OrderAction.
**Confirmed types in schema-dts:**

- `hasMap: SchemaValue<Map | URL | IdReference, "hasMap">` — plain URL string is valid
- `potentialAction: SchemaValue<Action | IdReference, "potentialAction">` — OrderAction (subtype of Action) is valid
- `OrderAction.target: SchemaValue<EntryPoint | URL | IdReference, "target">` — plain URL string is valid

```typescript
// Source: schema-dts ActionBase.target + schema.org OrderAction docs
hasMap: 'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8',
potentialAction: {
  '@type': 'OrderAction',
  target: 'https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave',
},
```

**Note on hasMap URL:** Using the same short URL (maps.app.goo.gl) as sameAs for consistency. This is a redirect URL but it is the owner-confirmed, stable link.

### Pattern 6: containedInPlace

**What:** Indicate the restaurant is contained within Historic Route 66.
**Confirmed type in schema-dts:** `containedInPlace: SchemaValue<Place | IdReference, "containedInPlace">` — a Place object.
**Hierarchy decision (Claude's discretion):** Single level — Historic Route 66 — is the most meaningful and least redundant. Adding town → county → state would be redundant with the `address` property already present.

```typescript
// Source: schema-dts PlaceBase.containedInPlace
containedInPlace: {
  '@type': 'Place',
  name: 'Historic Route 66',
  url: 'https://en.wikipedia.org/wiki/U.S._Route_66',
},
```

**Note:** Use `url` (the schema.org property) not `@id` (the JSON-LD RDF construct) for Place identity per schema.org spec. Both work in practice, but `url` is the schema.org-defined property on Place.

### Pattern 7: OrganizationSchema sameAs Reorder

**What:** The existing sameAs array `[Facebook, Instagram]` must become `[Google Maps, Yelp, TripAdvisor, Facebook, Instagram]` per CONTEXT.md ordering.
**REQUIREMENTS.md discrepancy:** REQUIREMENTS.md lists Google Maps URL as `https://maps.app.goo.gl/vHbdJk7hqXemMssB9` while CONTEXT.md (the more specific, later document) lists `https://maps.app.goo.gl/q2EJFMbMRaysU6vH8`. **Use CONTEXT.md value** — it was established after the discussion phase and reflects confirmed business data.

```typescript
// Source: CONTEXT.md confirmed URLs
sameAs: [
  'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8',
  'https://www.yelp.com/biz/spice-grill-and-bar-ash-fork',
  'https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html',
  'https://www.facebook.com/profile.php?id=61566349169122',
  'https://www.instagram.com/panjabi_dhaba_sgb',
],
```

### Pattern 8: WebSiteSchema publisher and description

**What:** Add GEO-optimized description and publisher to WebSiteSchema.
**Confirmed types in schema-dts:**

- `publisher: SchemaValue<Organization | Person | IdReference, "publisher">` — confirmed in CreativeWorkBase
- `description: SchemaValue<Text | TextObject, "description">` — standard ThingBase property
- `inLanguage: SchemaValue<Language | Text, "inLanguage">` — available on CreativeWorkBase

**Recommended description (Claude's discretion):** Must include "Ash Fork", "Exit 146", and "Route 66". Suggested wording: `"Spice Grill & Bar — authentic Indian and Punjabi restaurant on Historic Route 66 in Ash Fork, Arizona (I-40 Exit 146). The perfect pit stop for Grand Canyon travelers."` This hits all mandatory keywords and adds cuisine + traveler context for AEO.

**Publisher reference pattern:** Reference the OrganizationSchema entity by URL stub rather than duplicating all Organization properties inline:

```typescript
// Source: schema-dts CreativeWorkBase.publisher + Context7 @id graph pattern
publisher: {
  '@type': 'Organization',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
},
```

**inLanguage decision (Claude's discretion):** Add `inLanguage: 'en'` — the site is English-only, IETF BCP 47 format `'en'` is the correct code. Small signal, zero cost.

### Anti-Patterns to Avoid

- **Hardcoding ratingValue/reviewCount numerically:** Must derive from reviews.json, per SCHM-07 requirement. Do not write `ratingValue: 5.0` as a literal.
- **Using serviceArea instead of areaServed:** `serviceArea` is deprecated in schema-dts (marked `@deprecated`). Use `areaServed`.
- **Using map/url (lowercase) on Place instead of url:** The schema.org property is `url`; `map` is the older deprecated alias — confirmed deprecated in schema-dts PlaceBase.
- **Adding SearchAction to WebSiteSchema:** User decision: no SearchAction. The site has no search functionality.
- **Promising Google star snippet rich results from aggregateRating:** Google's 2019 policy explicitly excludes LocalBusiness self-hosted reviews from star snippets. The aggregateRating serves AEO/AI engines, not Google visual rich results.

---

## Don't Hand-Roll

| Problem                    | Don't Build                   | Use Instead                              | Why                                                                            |
| -------------------------- | ----------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| JSON-LD type validation    | Custom TypeScript type guards | schema-dts 1.1.5 (already installed)     | Already enforced at compile time via `WithContext<Restaurant>` etc.            |
| Rating average calculation | Complex averaging utility     | Inline array filter + reduce (3 lines)   | The calculation is trivial — no utility needed                                 |
| Schema output rendering    | Custom serialization          | `JSON.stringify(schema)` with `set:html` | Existing pattern in all 6 schema components; is:inline prevents Astro escaping |

**Key insight:** This phase requires zero new libraries. All complexity is configuration of the existing schema object shapes.

---

## Common Pitfalls

### Pitfall 1: TypeScript Type Errors with `as unknown as` casting

**What goes wrong:** Adding new properties to `WithContext<Restaurant>` may trigger TypeScript errors if the property type doesn't exactly match schema-dts expectations (e.g., passing a typed sub-object where `SchemaValue<Place | IdReference>` expects).
**Why it happens:** schema-dts uses complex discriminated unions. Array values sometimes need explicit typing.
**How to avoid:** Import the needed sub-types: `import type { Restaurant, GeoCoordinates, Place, AggregateRating, OrderAction, WithContext } from 'schema-dts';`. Type intermediate variables when needed. Run `npm run typecheck` after each change.
**Warning signs:** TypeScript error "Type 'X' is not assignable to type 'SchemaValue<...>'"

### Pitfall 2: Place @type for Route/Corridor Entries

**What goes wrong:** Using `@type: "City"` for "I-40 Corridor" or "Historic Route 66" — these are not cities.
**Why it happens:** The City pattern works for town entries and it's tempting to apply uniformly.
**How to avoid:** Use `@type: "Place"` for route/corridor entries. City is a subtype of Place — wrong subtype sends false signals.
**Warning signs:** Validators will accept it (schema.org doesn't enforce this strictly) but the semantic is wrong for AI engines.

### Pitfall 3: Google Maps URL Discrepancy

**What goes wrong:** Using the REQUIREMENTS.md Google Maps URL (`/vHbdJk7hqXemMssB9`) instead of the CONTEXT.md confirmed URL (`/q2EJFMbMRaysU6vH8`).
**Why it happens:** Both documents exist and show different short URLs.
**How to avoid:** CONTEXT.md is the authoritative source for this phase — it was produced by the discuss-phase process after REQUIREMENTS.md. Use CONTEXT.md values.
**Warning signs:** Mismatch between sameAs URL and the actual business listing.

### Pitfall 4: aggregateRating Self-Serving Policy Misunderstanding

**What goes wrong:** Implementing aggregateRating expecting Google to show star ratings in SERPs, then being surprised when they don't appear.
**Why it happens:** Documentation says aggregateRating is "recommended" for LocalBusiness — true for eligibility, but Google's self-serving review policy (2019, still current) prevents star snippet display for own-website reviews.
**How to avoid:** Document in code comments that aggregateRating is present for AEO/AI signal purposes. Do not set expectations for Google star snippets.
**Warning signs:** None in code — this is an expectations issue, not a code bug.

### Pitfall 5: `is:inline` Script Tag Escaping

**What goes wrong:** Special characters in schema values (e.g., `&` in "Spice Grill & Bar") get HTML-escaped if `set:html` is misused.
**Why it happens:** Without `set:html`, Astro would escape `<`, `>`, `&` inside script tags.
**How to avoid:** All existing schema components use `set:html={JSON.stringify(schema)}`. Maintain this pattern. `JSON.stringify` handles quotes/escaping correctly; `set:html` bypasses Astro's additional escaping.
**Warning signs:** `&amp;` appearing in the rendered JSON-LD output.

### Pitfall 6: `containedInPlace` Duplicate with `areaServed`

**What goes wrong:** Adding "Historic Route 66, Arizona" to BOTH `areaServed` AND `containedInPlace`.
**Why it happens:** Route 66 appears in both the 12-entry areaServed list and as the containedInPlace value.
**How to avoid:** Semantics are different — `areaServed` means "we serve customers from there", `containedInPlace` means "this physical location is within that place". Both are correct and not redundant. Keep both.

---

## Code Examples

### Complete RestaurantSchema.astro after Phase 2 additions

```typescript
// Source: schema-dts@1.1.5 types + existing project pattern
import type {
  Restaurant,
  GeoCoordinates,
  Place,
  AggregateRating,
  OrderAction,
  WithContext,
} from 'schema-dts';
import reviewsData from '../../data/reviews.json';

// Snapshot aggregateRating — derived from reviews.json, not hardcoded
const ratedReviews = reviewsData.filter((r) => typeof r.rating === 'number');
const ratingValue =
  ratedReviews.length > 0
    ? parseFloat(
        (ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length).toFixed(1)
      )
    : 0;
const reviewCount = ratedReviews.length;

const schema: WithContext<Restaurant> = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
  address: {
    /* unchanged */
  },
  telephone: '+1-928-277-1292',
  openingHoursSpecification: [
    /* unchanged */
  ],
  servesCuisine: [
    /* unchanged */
  ],
  priceRange: '$$',
  image: 'https://spicegrillbar66.com/HomePageBackground.webp',
  hasMenu: 'https://spicegrillbar66.com/#menu',
  description:
    'Authentic Indian Restaurant in Ash Fork, AZ. Located on Historic Route 66, the perfect pitstop for Grand Canyon travelers.',
  // NEW: SCHM-05
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 35.22291449138381,
    longitude: -112.47815397255074,
  },
  // NEW: SCHM-06
  areaServed: [
    { '@type': 'City', name: 'Ash Fork', '@id': 'https://en.wikipedia.org/wiki/Ash_Fork,_Arizona' },
    { '@type': 'City', name: 'Williams', '@id': 'https://en.wikipedia.org/wiki/Williams,_Arizona' },
    { '@type': 'City', name: 'Kaibab Estates West' },
    { '@type': 'City', name: 'Crookton' },
    { '@type': 'City', name: 'Seligman', '@id': 'https://en.wikipedia.org/wiki/Seligman,_Arizona' },
    { '@type': 'City', name: 'Paulden' },
    { '@type': 'City', name: 'Prescott', '@id': 'https://en.wikipedia.org/wiki/Prescott,_Arizona' },
    {
      '@type': 'City',
      name: 'Prescott Valley',
      '@id': 'https://en.wikipedia.org/wiki/Prescott_Valley,_Arizona',
    },
    { '@type': 'City', name: 'Sedona', '@id': 'https://en.wikipedia.org/wiki/Sedona,_Arizona' },
    { '@type': 'Place', name: 'Grand Canyon South Rim' },
    { '@type': 'Place', name: 'I-40 Corridor, Arizona' },
    { '@type': 'Place', name: 'Historic Route 66, Arizona' },
  ],
  // NEW: SCHM-07
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  },
  // NEW: SCHM-08
  hasMap: 'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8',
  potentialAction: {
    '@type': 'OrderAction',
    target: 'https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave',
  },
  containedInPlace: {
    '@type': 'Place',
    name: 'Historic Route 66',
    url: 'https://en.wikipedia.org/wiki/U.S._Route_66',
  },
};
```

### OrganizationSchema.astro sameAs update

```typescript
// Source: OrganizationSchema.astro current file + CONTEXT.md confirmed URLs
sameAs: [
  'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8',
  'https://www.yelp.com/biz/spice-grill-and-bar-ash-fork',
  'https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html',
  'https://www.facebook.com/profile.php?id=61566349169122',
  'https://www.instagram.com/panjabi_dhaba_sgb',
],
```

### WebSiteSchema.astro additions

```typescript
// Source: schema-dts CreativeWorkBase.publisher + ThingBase.description
import type { WebSite, WithContext } from 'schema-dts';

const schema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: 'https://spicegrillbar66.com',
  name: 'Spice Grill & Bar',
  // NEW: SCHM-10
  description:
    'Spice Grill & Bar — authentic Indian and Punjabi restaurant on Historic Route 66 in Ash Fork, Arizona (I-40 Exit 146). The perfect pit stop for Grand Canyon travelers.',
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: 'Spice Grill & Bar',
    url: 'https://spicegrillbar66.com',
  },
};
```

---

## State of the Art

| Old Approach                                                     | Current Approach                                                 | When Changed                    | Impact                                                                    |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| `areaServed: "Ash Fork"` (plain string)                          | Array of Place objects with Wikipedia @id                        | Best practice established ~2020 | AI engines can disambiguate entity identity via Wikipedia links           |
| aggregateRating expected to produce SERP stars for LocalBusiness | aggregateRating for AEO/AI signal only — no Google star snippets | 2019 (Google policy)            | Do not promise stars; value is in machine consumption                     |
| serviceArea property                                             | areaServed (serviceArea is @deprecated in schema-dts)            | schema.org deprecation          | Use areaServed — serviceArea will trigger TypeScript deprecation warnings |
| map/url aliases on Place                                         | hasMap (modern canonical property)                               | schema-dts deprecation          | PlaceBase marks old aliases deprecated                                    |

**Deprecated/outdated:**

- `serviceArea`: Deprecated in schema-dts; replaced by `areaServed`
- `map` property on Place: Deprecated; replaced by `hasMap`
- Google star snippets via LocalBusiness aggregateRating: Not visible in SERPs since 2019

---

## Open Questions

1. **Wikipedia @id for Kaibab Estates West and Crookton**
   - What we know: These are small communities in Yavapai County, AZ. Kaibab Estates West is a CDP; Crookton is an unincorporated community.
   - What's unclear: Whether Wikipedia articles exist for these specific entries at stable URLs.
   - Recommendation: Omit `@id` for these two entries rather than link to a non-existent or incorrect Wikipedia URL. Plain `{ '@type': 'City', name: 'Kaibab Estates West' }` is valid and safe.

2. **TypeScript type compatibility for `areaServed` array**
   - What we know: `areaServed` accepts `SchemaValue<AdministrativeArea | GeoShape | Place | Text | IdReference, "areaServed">`. City extends Place.
   - What's unclear: Whether TypeScript will infer the array literal correctly without explicit typing, or whether `as unknown as` casting may be needed.
   - Recommendation: Define the array with explicit type annotation if TypeScript complains: `const areaServed: Place[] = [...]` and assign. Run `npm run typecheck` to validate.

3. **Google Maps URL — short vs resolved**
   - What we know: CONTEXT.md confirms `https://maps.app.goo.gl/q2EJFMbMRaysU6vH8` as the owner-provided URL. It redirects to the canonical Google Maps page.
   - What's unclear: Whether AI engines follow short URL redirects when building entity graphs.
   - Recommendation: Use the short URL as given in CONTEXT.md — it is stable and owner-confirmed. Adding a comment noting it is a redirect URL is sufficient documentation.

---

## Sources

### Primary (HIGH confidence)

- `/google/schema-dts` (Context7 library ID) — TypeScript type definitions for all properties in scope
- `/Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/node_modules/schema-dts/dist/schema.d.ts` — Direct inspection of installed schema-dts 1.1.5 type definitions: GeoCoordinatesBase, AggregateRatingBase, RatingBase, PlaceBase (containedInPlace, hasMap), OrderActionBase/Leaf, WebSiteBase, CreativeWorkBase (publisher), ThingBase (sameAs, potentialAction)
- `src/data/reviews.json` — Direct inspection: confirmed field names (id, author, rating, text, source, date), all 7 current reviews have numeric ratings, computed values: avg=5.0, count=7
- `src/components/schema/*.astro` — Direct inspection of all 6 existing schema components: confirmed `WithContext<T>` pattern, `is:inline`, `set:html={JSON.stringify(schema)}`
- https://schema.org/Restaurant — Properties: geo (GeoCoordinates|GeoShape), areaServed (AdministrativeArea|GeoShape|Place|Text), aggregateRating (AggregateRating), hasMap (Map|URL), potentialAction (Action), containedInPlace (Place)
- https://schema.org/AggregateRating — Properties: ratingValue, reviewCount, ratingCount, bestRating, worstRating (all confirmed)
- https://schema.org/GeoCoordinates — Properties: latitude, longitude (Number|Text, WGS 84)
- https://schema.org/WebSite — Properties: publisher (Organization|Person), description (Text), inLanguage (Language|Text)
- https://schema.org/Place — containedInPlace accepts Place; url property for Place identity
- https://developers.google.com/search/docs/appearance/structured-data/local-business — Google required vs recommended properties; geo and aggregateRating confirmed recommended
- https://developers.google.com/search/docs/appearance/structured-data/organization — Google sameAs support confirmed; no platform-specific URL guidance

### Secondary (MEDIUM confidence)

- https://www.brightlocal.com/learn/review-schema/ — Google's 2019 policy: LocalBusiness aggregateRating does NOT produce star snippets (self-serving rule); verified against Google's official review snippet docs
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet — Confirmed: LocalBusiness star snippets only for "sites that review other businesses"; self-control = ineligible
- https://rankmath.com/kb/add-multiple-areaserved-cities-to-localbusiness-schema/ — areaServed City array pattern with Wikipedia @id (confirmed against schema-dts type definitions)
- https://schema.org/OrderAction + WebSearch schema.org actions examples — OrderAction.target accepts EntryPoint or URL; confirmed via schema-dts ActionBase

### Tertiary (LOW confidence)

- WebSearch results on AEO/GEO value of aggregateRating — Multiple sources assert value for AI engine consumption even without Google star snippets; not officially documented by AI engine vendors

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — all libraries are installed and confirmed; no new dependencies
- Architecture: HIGH — all target properties confirmed in schema-dts 1.1.5 type definitions; existing pattern is well-established
- Pitfalls: HIGH for Google policy (multiple authoritative sources); MEDIUM for TypeScript type edge cases (likely fine, needs runtime verification via typecheck)

**Research date:** 2026-02-20
**Valid until:** 2026-08-20 (schema.org and schema-dts are stable; Google review policy has been unchanged since 2019)
