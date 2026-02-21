# Research: Local Restaurant GEO/AEO Schema Stack

**Research Date:** 2026-02-20
**Research Type:** Project Research — Stack dimension for local restaurant SEO/GEO/AEO optimization on an Astro 5 static site
**Milestone Context:** Subsequent — Astro 5 migration complete. Adding local SEO schema enhancements, content pages, and AEO optimization to the existing site at spicegrillbar66.com.
**Knowledge Basis:** Training data through August 2025; no live web access available for this session. All schema.org property definitions are stable and version-tracked; Google structured data guidelines are stable but evolve — verify against https://developers.google.com/search/docs/appearance/structured-data before implementation.

---

## Executive Summary

The existing schema foundation is solid but incomplete for local SEO and AI citation. The six JSON-LD schema components are correctly typed using `schema-dts` and injected via `is:inline` (bypasses Astro's JS bundling — correct). The critical gaps are: `RestaurantSchema` missing `geo`, `hasMap`, `aggregateRating`, `potentialAction` (OrderAction), and a narrow `areaServed`; `OrganizationSchema` missing third-party directory `sameAs` links; `WebSiteSchema` missing `description` and `publisher`. No Astro-specific schema library is needed — `schema-dts` already provides full type coverage and the current pattern of `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />` is optimal for a static Astro site.

---

## Section 1: Schema.org Restaurant Type — Property Priority Matrix

### 1.1 Required / Near-Required (Google processes these for Knowledge Panel and Local Pack)

| Property                    | Format                                                                                                | Current Status                                                     | Confidence |
| --------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| `@type`                     | `"Restaurant"`                                                                                        | Present                                                            | High       |
| `name`                      | Exact legal/GBP name                                                                                  | Present                                                            | High       |
| `address` (PostalAddress)   | Full address with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry` | Present                                                            | High       |
| `telephone`                 | E.164 format `+1-928-277-1292`                                                                        | Present (wrong in RestaurantSchema — uses `(928)` format)          | High       |
| `url`                       | Canonical URL of business website                                                                     | Present (note: RestaurantSchema uses `www.` prefix inconsistently) | High       |
| `openingHoursSpecification` | Array of `OpeningHoursSpecification` with full schema.org day URIs                                    | Present                                                            | High       |

**Issue found:** `RestaurantSchema.astro` uses `(928) 277-1292` for telephone but `OrganizationSchema.astro` uses `+1-928-277-1292`. Google's structured data guidelines specify E.164 format (`+19282771292` or `+1-928-277-1292`). RestaurantSchema should be normalized to match.

**Issue found:** `RestaurantSchema.astro` URL is `https://www.spicegrillbar66.com` (with www) but `OrganizationSchema.astro` and all other references use `https://spicegrillbar66.com` (without www). These must be consistent and match the canonical URL in `astro.config.mjs` (`https://spicegrillbar66.com`).

### 1.2 High-Impact for Local SEO (Google Local Pack, AI citation, Google Maps integration)

#### `geo` — GeoCoordinates

**Why it matters:** Google uses `geo` to confirm physical location and improve placement in proximity-based queries. AI engines that synthesize location-aware answers (Perplexity, Google AI Overviews) read geo coordinates to establish geographic relevance. Missing `geo` is the single biggest gap for a highway-corridor restaurant where users are asking "what's near I-40 exit 146."

**Format:**

```json
"geo": {
  "@type": "GeoCoordinates",
  "latitude": 35.5022,
  "longitude": -112.4874
}
```

**Ash Fork, AZ approximate coordinates:** latitude `35.5022`, longitude `-112.4874`. Verify against Google Maps pin for 33 Lewis Ave before committing.

**Confidence:** High — `geo` is a stable, well-documented property; Google's local business structured data documentation explicitly lists it.

---

#### `hasMap` — URL to Google Maps listing

**Why it matters:** `hasMap` creates a machine-readable link between the schema entity and the business's Google Maps presence. This helps Google associate the structured data with the GBP listing and improves Knowledge Panel completeness.

**Format:**

```json
"hasMap": "https://maps.google.com/?cid=GOOGLE_CID"
```

Use the Google Maps CID (Customer ID) URL, not a search URL. The CID URL is stable and canonical. Get it by searching the restaurant in Google Maps and copying the link when the business card appears.

**Confidence:** High — documented schema.org property. Effect on ranking is indirect (entity association) rather than direct signal.

---

#### `aggregateRating` — Review score

**Why it matters:** `aggregateRating` is one of the most powerful properties for AI citation and rich results. Perplexity, ChatGPT, and Google AI Overviews explicitly surface ratings when answering "best Indian restaurant near X" queries. Google does NOT show star ratings in search results from JSON-LD alone — they require an approved review platform — but AI engines do use the schema-embedded rating for answer synthesis.

**Format:**

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.5",
  "reviewCount": "127",
  "bestRating": "5",
  "worstRating": "1"
}
```

**Important constraint:** Google's guidelines prohibit self-serving ratings (you cannot make up a rating). The value must reflect actual reviews from a recognized platform. Since `reviews.json` is auto-updated weekly via GitHub Actions from real review data, derive `ratingValue` and `reviewCount` dynamically from that file. This keeps it accurate and automated.

**Data source in codebase:** `/src/data/reviews.json` — the Gemini pipeline already aggregates this data. The `RestaurantSchema.astro` should import `reviews.json` and compute average/count at build time.

**Confidence:** High for the property format. High that AI engines use it. Medium for Google rich results (Google has tightened eligibility — restaurant self-hosted ratings rarely qualify for gold stars in SERPs, but AI engines still use the data).

---

#### `areaServed` — Geographic service area

**Why it matters:** This is the primary signal for GEO (Geographic SEO). It tells search engines and AI crawlers which geographic areas the business explicitly serves. For a highway-corridor restaurant, the service area is not just the town — it's the full corridor of potential customers.

**Current value:** `"Ash Fork"` — far too narrow.

**Recommended format (array of Place or City objects):**

```json
"areaServed": [
  {
    "@type": "City",
    "name": "Ash Fork",
    "sameAs": "https://en.wikipedia.org/wiki/Ash_Fork,_Arizona"
  },
  {
    "@type": "City",
    "name": "Williams",
    "sameAs": "https://en.wikipedia.org/wiki/Williams,_Arizona"
  },
  {
    "@type": "City",
    "name": "Seligman",
    "sameAs": "https://en.wikipedia.org/wiki/Seligman,_Arizona"
  },
  {
    "@type": "AdministrativeArea",
    "name": "Kaibab Estates"
  },
  {
    "@type": "AdministrativeArea",
    "name": "I-40 Corridor, Arizona"
  },
  {
    "@type": "AdministrativeArea",
    "name": "Route 66, Arizona"
  }
]
```

**Why Wikipedia `sameAs`:** Linking `City` entities to their Wikipedia pages provides entity disambiguation — this is how knowledge graphs confirm the specific "Williams, AZ" rather than Williams in another state. This is a known AEO signal.

**Confidence:** High that expanding `areaServed` to an array is correct and beneficial. Medium that the specific format with Wikipedia `sameAs` on City entities is commonly used (it is valid schema.org and commonly recommended in local SEO literature, but Google's official docs don't explicitly require it).

---

#### `potentialAction` — OrderAction

**Why it matters:** `OrderAction` declares that the restaurant has online ordering capability. AI engines (especially Google Assistant and ChatGPT when using plugins) use this to answer "can I order from Spice Grill & Bar online?" affirmatively. It also surfaces in Google's own food ordering features.

**Format:**

```json
"potentialAction": {
  "@type": "OrderAction",
  "target": {
    "@type": "EntryPoint",
    "urlTemplate": "https://www.toasttab.com/spice-grill-and-bar",
    "actionPlatform": [
      "http://schema.org/DesktopWebPlatform",
      "http://schema.org/MobileWebPlatform"
    ]
  },
  "deliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModePickUp"
}
```

**Note:** Since the restaurant uses Toast for ordering but does NOT offer delivery (takeout/pickup only), use `DeliveryModePickUp`. Do not claim `DeliveryModeMail` or home delivery. Verify the exact Toast URL for this restaurant — it should be the direct ordering URL, not a search page.

**Alternative approach:** If the Toast ordering URL is unknown or may change, use `ReservationAction` (for table reservations) paired with a `telephone` action as a fallback. However, if ordering is available, `OrderAction` is more valuable.

**Confidence:** High for the property format and AEO signal. Medium for direct effect on Google rich results (Google's food ordering feature has specific eligibility requirements and partnerships — schema alone may not unlock the feature, but it doesn't hurt and does help AI citation).

---

#### `containedInPlace` — Parent location context

**Why it matters:** For a restaurant on a named highway/route, `containedInPlace` signals the broader geographic context to knowledge graphs. This is particularly valuable for AI engines synthesizing "restaurants on Route 66" queries.

**Format:**

```json
"containedInPlace": {
  "@type": "Place",
  "name": "Historic Route 66",
  "sameAs": "https://en.wikipedia.org/wiki/U.S._Route_66"
}
```

**Confidence:** Medium — `containedInPlace` is a valid schema.org property but is less commonly implemented for restaurants and less directly validated by Google's documentation. It is likely used by AI engines for entity relationship building. Low implementation cost, medium expected benefit.

---

### 1.3 High-Impact for AEO (AI/Answer Engine Citation)

#### `description` — Business description

**Why it matters:** AI engines (Perplexity, ChatGPT, Google AI Overviews) frequently extract the `description` property directly into answers when no better passage is available on the page. The current description is: `"Authentic Indian Restaurant in Ash Fork, AZ. Located on Historic Route 66, the perfect pitstop for Grand Canyon travelers."` — this is usable but should include more extractable facts.

**Recommended format:**

```json
"description": "Spice Grill & Bar is an authentic Punjabi Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona on Historic Route 66, approximately 70 miles from the Grand Canyon South Rim. Open daily 7 AM – 10 PM, serving Tandoori specialties, Butter Chicken, Goat Curry, Garlic Naan, and vegetarian/vegan dishes. Beer, wine, and cocktails available. Takeout and curbside pickup via Toast. Family-friendly with motorcycle parking."
```

**Key AEO writing principles applied:**

- Lead with the most extractable fact (location + exit number)
- Include distance anchor (70 miles / Grand Canyon)
- List specific dishes AI engines can cite
- Include hours (hours are a top query type)
- Mention services and dietary options

**Confidence:** High — description is a consistently cited AEO property. The writing style mirrors established AEO content patterns.

---

#### `servesCuisine` — Cuisine types

**Current value:** Array including `"Beer"`, `"Wine"`, `"Soft Drinks"`, `"Alcoholic Beverages"` alongside cuisine types. This is incorrect usage — `servesCuisine` should only contain cuisine/food category strings, not beverage categories.

**Recommended correction:**

```json
"servesCuisine": ["Indian", "Punjabi", "North Indian", "Tandoori"]
```

Beverage offerings should be expressed via `"amenityFeature"` or the `description` field. Mixing beverages into `servesCuisine` may confuse classifiers.

**Confidence:** High — this is clearly incorrect usage based on schema.org's definition of `servesCuisine` as food/cuisine categories only.

---

#### `image` — Business image

**Current value:** `"https://spicegrillbar66.com/HomePageBackground.webp"` — single string.

**Recommended format:**

```json
"image": [
  "https://spicegrillbar66.com/HomePageBackground.webp",
  "https://spicegrillbar66.com/og-image.jpg"
]
```

Google recommends providing multiple images when available (16:9, 4:3, and 1:1 aspect ratios). AI engines prefer multiple images for richer entity profiles.

**Confidence:** Medium — multiple images are documented as Google's preference; single image is acceptable and functional.

---

### 1.4 Properties to NOT Add (or Add with Caution)

| Property                       | Reason to Avoid/Defer                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `starRating`                   | This is for hotels, not restaurants. Use `aggregateRating` instead.                                                                             |
| `acceptsReservations`          | Valid if table reservations are accepted. If walk-in only, omit — do not set to `false` as this may discourage bookings. Add only if confirmed. |
| `menu` (as URL)                | Current `hasMenu` is correct. Do not duplicate with `menu` property — schema-dts types them identically but Google may count as redundant.      |
| `branchOf`                     | Deprecated — do not use. Restaurant is standalone, not a franchise branch.                                                                      |
| `openingHours` (string format) | Deprecated in favor of `openingHoursSpecification`. Current implementation is correct. Do not add the simple string format.                     |
| `founder` / `employee`         | No local SEO benefit for a restaurant. Adds payload without benefit.                                                                            |
| `numberOfEmployees`            | No local SEO benefit.                                                                                                                           |
| `legalName`                    | Add only if the legal business name differs from the operating name. If DBA matches legal name, omit.                                           |
| `paymentAccepted`              | Low local SEO value. Only add if specifically asked about payment methods in FAQ.                                                               |
| `SpecialAnnouncement`          | COVID-era schema. Do not use.                                                                                                                   |
| `Event` schema for specials    | Only if the restaurant runs ticketed events. Weekly specials are not Events in schema.org's definition.                                         |

---

## Section 2: OrganizationSchema — `sameAs` Property

**Why it matters:** `sameAs` is the primary mechanism for entity disambiguation across knowledge graphs. When Google, Perplexity, and other AI systems see matching `sameAs` links across multiple sources, they consolidate entity signals and build higher confidence in the business's identity. This directly affects Knowledge Panel richness and AI citation frequency.

**Current `sameAs` links:** Facebook, Instagram.

**Required additions (pending URLs from client):**

```json
"sameAs": [
  "https://www.facebook.com/profile.php?id=61566349169122",
  "https://www.instagram.com/panjabi_dhaba_sgb",
  "https://www.google.com/maps/place/?q=place_id:PLACE_ID_HERE",
  "https://www.yelp.com/biz/BUSINESS_SLUG_HERE",
  "https://www.tripadvisor.com/Restaurant_Review-REVIEW_ID_HERE"
]
```

**Format guidance:**

- Google Maps URL: Use the `place_id` parameter URL, not a search URL (`maps.app.goo.gl` short links are not canonical and may break). Find the Place ID at https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder.
- Yelp URL: Use the canonical business URL (e.g., `https://www.yelp.com/biz/spice-grill-and-bar-ash-fork`), not a search result URL.
- TripAdvisor URL: Use the full restaurant listing URL, not a mobile or shortened URL.

**Confidence:** High — `sameAs` for entity disambiguation is one of the most consistently validated knowledge graph signals in local SEO literature.

---

## Section 3: WebSiteSchema — Required Properties

**Current state:** Minimal — only `@type`, `url`, `name`.

**Recommended additions:**

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://spicegrillbar66.com",
  "name": "Spice Grill & Bar",
  "description": "Official website of Spice Grill & Bar — authentic Punjabi Indian restaurant at I-40 Exit 146, Ash Fork, Arizona on Historic Route 66.",
  "publisher": {
    "@type": "Organization",
    "name": "Spice Grill & Bar",
    "logo": {
      "@type": "ImageObject",
      "url": "https://spicegrillbar66.com/favicon.svg"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://spicegrillbar66.com/faq/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

**Note on `SearchAction`:** This enables a sitelinks searchbox in Google SERP for the brand query. The `urlTemplate` should point to a real search endpoint. If the site has no search functionality, omit `SearchAction` — do not point it to the FAQ page unless the FAQ page actually supports `?q=` query parameters. If implementing, a JavaScript-based client-side search (e.g., filtering FAQ items) would satisfy this requirement without breaking static hosting.

**Confidence:** High for `description` and `publisher`. Medium for `SearchAction` (requires actual search functionality on the target URL).

---

## Section 4: Astro-Specific Implementation Patterns

### 4.1 Current Pattern Assessment

The current pattern is optimal for a static Astro site:

```astro
<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**Why `is:inline` is correct:** Without `is:inline`, Astro may process the `<script>` tag through its bundler, which would break the JSON-LD (it's not JavaScript). `is:inline` emits the script tag verbatim.

**Why `set:html` is correct:** Astro escapes HTML by default. `set:html` bypasses escaping for the JSON content, which is necessary to prevent `&amp;` and similar HTML entities from corrupting the JSON.

**Do NOT use:** `set:text` (would escape the JSON), template literals inside the script tag (Astro won't process them), or external `.json` file references via `src` attribute (browsers don't load JSON-LD from external files).

### 4.2 No New npm Packages Needed

`schema-dts` (already installed at v1.1.5) provides TypeScript types for all schema.org types including `Restaurant`, `GeoCoordinates`, `AggregateRating`, `OrderAction`, and `EntryPoint`. No additional libraries are needed.

**Packages to NOT add:**

- `next-seo` — Next.js specific, incompatible
- `astro-seo` — Provides `<head>` meta tags only, not JSON-LD management; adds unnecessary abstraction over the current pattern
- `react-schemaorg` — React-specific, overkill for static JSON-LD
- Any schema validation npm packages — use Google's Rich Results Test and Schema.org Validator instead (external tools, no bundle impact)

**Confidence:** High — the current `schema-dts` + `is:inline` pattern is optimal and matches patterns used in production Astro sites with high Lighthouse scores.

### 4.3 Dynamic Data in Schema Components

For `aggregateRating` derived from `reviews.json`:

```astro
---
import reviewsData from '../../data/reviews.json';

// Compute at build time — no runtime cost
const totalRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
const avgRating = (totalRating / reviewsData.length).toFixed(1);
const reviewCount = reviewsData.length;
---
```

This approach has zero runtime cost (computed at build time by Astro), no bundle impact, and automatically stays current as the GitHub Actions workflow updates `reviews.json` weekly.

**Prerequisite:** Verify `reviews.json` structure includes a numeric `rating` field per review entry. If the Gemini pipeline stores ratings differently (e.g., as strings, or as a pre-computed average), adjust accordingly.

**Confidence:** High for the Astro build-time computation pattern. Medium for the specific field access (`r.rating`) pending verification of `reviews.json` schema.

---

## Section 5: AEO Content Patterns (Non-Schema)

### 5.1 FAQ Schema — AEO Signal

The current `FAQSchema.astro` implementation is correct. The expansion from 9 to 20 questions should follow these AEO writing rules:

**High-value question templates for I-40 corridor restaurants:**

- Distance/time questions: "How far is [restaurant] from [landmark]?" — AI engines answer these directly
- Exit/navigation questions: "What exit is [restaurant] on I-40?" — exact fact, highly extractable
- Hours questions: "Is [restaurant] open on [day]?" — verify FAQ hours match `openingHoursSpecification` exactly
- Cuisine/dietary questions: "Does [restaurant] have vegan options?" — must match actual offerings
- Pickup/ordering questions: "Can I order ahead from [restaurant]?" — link to Toast URL

**AEO writing rules for `faq.json` answers:**

1. State the core fact in the first sentence. AI engines extract the first sentence.
2. Include the business name and location in the answer (not just the question). Standalone extractability.
3. Include exact numbers where possible (distances, hours, prices).
4. Keep answers under 100 words. Longer answers are truncated by AI engines.
5. Do not use HTML in answers — `FAQSchema.astro` renders them as `text` not `html`.

### 5.2 `llms.txt` and `llms-full.txt`

These files are not schema but are directly relevant to AEO. AI crawlers (Anthropic's ClaudeBot, OpenAI's GPTBot, Google-Extended) read `llms.txt` as a machine-readable summary of the site's authoritative facts. The current `llms.txt` and `llms-full.txt` should contain:

- Exact address with exit number
- Operating hours
- Distance from key landmarks (Grand Canyon, Las Vegas, Flagstaff)
- Top dishes with descriptions
- Ordering methods
- The corrected Halal messaging (pending Phase 4)

**Confidence:** Medium-High — `llms.txt` is an emerging standard (proposed by Answer.ai) not universally adopted. Perplexity has confirmed it reads `llms.txt`. OpenAI and Google have not officially confirmed `llms.txt` support but do crawl the file.

---

## Section 6: Schema Consistency Audit — Bugs Found in Current Implementation

| File                            | Issue                                                                                                                                     | Fix Required                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `RestaurantSchema.astro` L8     | URL `https://www.spicegrillbar66.com` — `www.` prefix inconsistent with canonical                                                         | Remove `www.` to match canonical                                                                                |
| `RestaurantSchema.astro` L13    | `telephone: '(928) 277-1292'` — not E.164 format                                                                                          | Change to `'+1-928-277-1292'`                                                                                   |
| `RestaurantSchema.astro` L46-47 | `servesCuisine` includes beverages (`"Beer"`, `"Wine"`, etc.) — semantically incorrect                                                    | Move beverage info to `description`, keep only food cuisines in `servesCuisine`                                 |
| `RestaurantSchema.astro` L53    | `areaServed: 'Ash Fork'` — string, not array, too narrow                                                                                  | Expand to array of Place/City objects                                                                           |
| `RestaurantSchema.astro`        | Missing `geo`, `hasMap`, `aggregateRating`, `potentialAction`                                                                             | Add all four                                                                                                    |
| `WebSiteSchema.astro`           | Missing `description`, `publisher`                                                                                                        | Add both                                                                                                        |
| `OrganizationSchema.astro`      | `sameAs` missing Google Maps, Yelp, TripAdvisor                                                                                           | Blocked on client providing URLs                                                                                |
| All schemas                     | `openingHoursSpecification` hours (`07:00`–`22:00`) contradict FAQ answer (`8:00 AM to 9:00 PM` weekdays, `8:00 AM to 10:00 PM` weekends) | **Critical data conflict** — hours must be verified with client and unified across schema, FAQ, and all content |

**The hours conflict is a blocking issue.** RestaurantSchema says 7 AM–10 PM daily. FAQ says 8 AM–9 PM weekdays and 8 AM–10 PM weekends. These are different on both open time and close time. Google may penalize for inconsistent structured data. This must be resolved before any deployment.

---

## Section 7: Schema Types NOT Recommended for This Site

| Schema Type                      | Reason                                                                                                                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LocalBusiness` (standalone)     | `Restaurant` inherits from `FoodEstablishment` which inherits from `LocalBusiness`. Using bare `LocalBusiness` is a downgrade. Current `Restaurant` type is correct.                              |
| `FoodEstablishment` (standalone) | Same reason — `Restaurant` is more specific. More specific types are always preferred.                                                                                                            |
| `Store`                          | Incorrect type for a restaurant.                                                                                                                                                                  |
| `TouristAttraction`              | Not an attraction — a restaurant. Using incorrect type can confuse classifiers.                                                                                                                   |
| `Product` schema for dishes      | `MenuItem` (already used in `MenuSchema.astro`) is correct. `Product` schema for food items is an incorrect type.                                                                                 |
| `Event` for daily specials       | Only use for actual dated events with ticket/registration. Daily specials are not Events.                                                                                                         |
| `NewsArticle` / `Article`        | Only for blog posts. The GEO content pages (`/about/`, `/directions/`, etc.) should use `WebPage` with `breadcrumb`, not `Article`.                                                               |
| Multiple `@graph` consolidation  | Combining all schemas into a single `@graph` is sometimes recommended but adds complexity with no proven benefit for local SEO. Maintain separate schema components per the current architecture. |

---

## Section 8: Recommended Implementation Sequence

This sequence is prioritized by impact/effort ratio, not by the PROJECT.md phase order (defer to that for final ordering):

1. **Fix data conflict first** — Resolve hours discrepancy across schema, FAQ, and content. No other schema work should deploy until this is resolved.
2. **Fix `servesCuisine`** — Remove beverages. Zero-risk change, takes 5 minutes.
3. **Fix URL/telephone consistency** — Remove `www.`, normalize telephone to E.164 in `RestaurantSchema.astro`.
4. **Add `geo`** — Verify coordinates, add `GeoCoordinates` to `RestaurantSchema.astro`.
5. **Add `aggregateRating`** — Import from `reviews.json`, compute at build time. Verify `reviews.json` field structure first.
6. **Expand `areaServed`** — Replace string with array of `City`/`AdministrativeArea` objects.
7. **Add `hasMap`** — Requires Google Maps CID URL from client.
8. **Add `potentialAction` (OrderAction)** — Requires verified Toast ordering URL.
9. **Update `WebSiteSchema.astro`** — Add `description` and `publisher`. Defer `SearchAction` unless search is implemented.
10. **Expand `OrganizationSchema.astro` `sameAs`** — Blocked on client providing Yelp, TripAdvisor, Google Maps URLs.

---

## Confidence Level Summary

| Recommendation                                      | Confidence  | Basis                                                                 |
| --------------------------------------------------- | ----------- | --------------------------------------------------------------------- |
| `geo` GeoCoordinates format and value               | High        | Stable schema.org spec; Google local business docs                    |
| `aggregateRating` format                            | High        | Stable schema.org spec; Google rich results docs                      |
| `areaServed` array expansion                        | High        | Stable schema.org spec; well-documented local SEO practice            |
| `hasMap` format                                     | High        | Stable schema.org spec                                                |
| `potentialAction` OrderAction format                | High        | Stable schema.org spec                                                |
| `sameAs` for entity disambiguation                  | High        | Core knowledge graph principle; consistently validated                |
| `servesCuisine` correction                          | High        | Clear schema.org misuse                                               |
| URL/telephone normalization                         | High        | Google structured data guidelines                                     |
| `is:inline` + `set:html` pattern                    | High        | Astro documentation; no alternatives exist for JSON-LD                |
| No new npm packages needed                          | High        | schema-dts covers all required types                                  |
| `containedInPlace` for Route 66                     | Medium      | Valid schema.org; less validated for direct ranking impact            |
| `aggregateRating` enabling Google star rich results | Medium      | Google has tightened eligibility; benefit is primarily for AI engines |
| `SearchAction` in WebSiteSchema                     | Medium      | Requires actual search endpoint implementation                        |
| `llms.txt` AEO benefit                              | Medium-High | Perplexity confirmed; other AI engines unconfirmed                    |
| Wikipedia `sameAs` on City entities in `areaServed` | Medium      | Valid schema.org; common recommendation but not Google-official       |

---

_Research by: Claude Sonnet 4.6 (claude-sonnet-4-6)_
_Based on: schema.org specification, Google Search Central structured data documentation, AEO/GEO local SEO patterns — training data through August 2025. Verify Google's structured data guidelines at developers.google.com/search/docs before implementation as guidelines update periodically._
