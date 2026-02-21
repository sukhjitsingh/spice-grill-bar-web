# Architecture Research — GEO/AEO Content Pages

**Research Type:** Project Research — Architecture dimension
**Date:** 2026-02-20
**Question:** How should new GEO/AEO content pages be structured in this Astro 5 static site?

---

## Summary

Four new content pages (`/about/`, `/directions/`, `/near-grand-canyon/`, `/route-66-dining/`) can be added to this site without any new dependencies, new layout wrappers, or changes to the build system. Each page follows the identical pattern already established by `faq.astro`: a single Astro file in `src/pages/`, wrapping content in `Layout.astro` with page-specific `title` and `description` props. The primary implementation decisions concern: (1) how page-specific schema components are handled, (2) how the navigation array in `Header.tsx` is extended, (3) how content is structured at the HTML level to be extractable by AI passage-retrieval systems, and (4) what the internal linking graph looks like across the five content pages.

---

## Current Architecture — What New Pages Inherit for Free

### Layout.astro — The Universal Wrapper

All pages pass through `src/layouts/Layout.astro`. Reading the file confirms it:

- Accepts `title` and `description` as props (with site-wide defaults)
- Computes `currentPath = Astro.url.pathname` and derives a canonical URL automatically
- Injects all six JSON-LD schema components unconditionally in the `<body>`: `RestaurantSchema`, `FAQSchema`, `MenuSchema`, `OrganizationSchema`, `WebSiteSchema`, and `BreadcrumbSchema`
- Renders `<Header client:visible>`, `<Footer>`, and `<MobileActionButtons>` unconditionally
- Passes `currentPath` to `BreadcrumbSchema` which auto-generates a two-item breadcrumb (Home → Current Page) for any non-root path
- Sets geo meta tags (`geo.position`, `geo.placename`, `geo.region`) globally on every page

Every new page gets all of the above at zero implementation cost.

### BreadcrumbSchema — Auto-Derives from Path

`src/components/schema/BreadcrumbSchema.astro` is driven entirely by the `items` array passed from `Layout.astro`. The current `Layout.astro` code already handles arbitrary paths:

```astro
<BreadcrumbSchema
  items={[
    { name: 'Home', item: '/' },
    ...(currentPath !== '/'
      ? [
          {
            name:
              currentPath.replace(/\//g, '').charAt(0).toUpperCase() +
              currentPath.replace(/\//g, '').slice(1),
            item: currentPath,
          },
        ]
      : []),
  ]}
/>
```

For `/near-grand-canyon/` this produces `"Near-grand-canyon"` — adequate for schema validity but not ideal for human-readable breadcrumb labels. This is a known limitation to address in the `Layout.astro` breadcrumb derivation logic (or by passing an explicit `breadcrumbLabel` prop from the page).

### astro.config.mjs — Static Output Format

`build.format: 'directory'` and `trailingSlash: 'always'` are already set. Every new `src/pages/about.astro` file will build to `dist/about/index.html` automatically. No configuration changes needed.

### Sitemap — Auto-Generated

`@astrojs/sitemap` is configured with `site: 'https://spicegrillbar66.com'`. All new pages will be included in the generated sitemap automatically on the next build.

---

## Component Boundaries — Shared vs. Page-Owned

### What Each New Page Shares (from Layout.astro)

| Concern                                    | Component                   | Location                           |
| ------------------------------------------ | --------------------------- | ---------------------------------- |
| HTML document shell, `<head>`, fonts       | `Layout.astro`              | `src/layouts/`                     |
| Sticky navigation + mobile menu            | `Header.tsx`                | `src/components/`                  |
| Footer with contact + hours + social links | `Footer.astro`              | `src/components/`                  |
| Mobile CTA buttons (call + order)          | `MobileActionButtons.astro` | `src/components/`                  |
| RestaurantSchema JSON-LD                   | `RestaurantSchema.astro`    | `src/components/schema/`           |
| FAQSchema JSON-LD                          | `FAQSchema.astro`           | `src/components/schema/`           |
| MenuSchema JSON-LD                         | `MenuSchema.astro`          | `src/components/schema/`           |
| OrganizationSchema JSON-LD                 | `OrganizationSchema.astro`  | `src/components/schema/`           |
| WebSiteSchema JSON-LD                      | `WebSiteSchema.astro`       | `src/components/schema/`           |
| BreadcrumbSchema JSON-LD (auto)            | `BreadcrumbSchema.astro`    | `src/components/schema/`           |
| Canonical URL derivation                   | `Layout.astro`              | computed from `Astro.url.pathname` |
| Geo meta tags                              | `Layout.astro`              | hardcoded for Ash Fork, AZ         |
| Partytown analytics (GTM)                  | `Layout.astro`              | off-main-thread                    |
| Dark mode initialization                   | `/public/scripts/theme.js`  | injected inline                    |

### What Each New Page Owns

| Concern                                      | Owned By                                             |
| -------------------------------------------- | ---------------------------------------------------- |
| Page `<title>` tag value                     | Page-level prop to `Layout`                          |
| `<meta name="description">` value            | Page-level prop to `Layout`                          |
| Page content inside `<main>`                 | The `.astro` page file itself                        |
| `<h1>` heading                               | The `.astro` page file                               |
| Page-specific sections and prose             | The `.astro` page file (or sub-components if needed) |
| Page-specific schema (e.g., `WebPageSchema`) | Inline in the page file OR a new schema component    |
| Breadcrumb label string                      | Currently auto-derived; may need an explicit prop    |

### Interactive Components — When to Use React

The `GoogleMap.tsx` component already exists and uses `IntersectionObserver` + lazy iframe loading. The `/directions/` page will embed it. Use `client:visible` hydration directive (matching the existing pattern in `LocationSection.astro`) — no new React component is needed.

All other new page content is static prose, statistics, and links. Use Astro components or inline markup — no new React islands are needed for `/about/`, `/near-grand-canyon/`, or `/route-66-dining/`.

---

## Data Flow — How Page-Specific Metadata Flows Through Layout.astro

```
src/pages/about.astro
  │
  ├── Astro.props → Layout.astro
  │     title="About Spice Grill & Bar | Authentic Punjabi Cuisine, Ash Fork AZ"
  │     description="..."
  │
  └── Layout.astro reads Astro.url.pathname → "/about/"
        │
        ├── <title> rendered with page-specific title
        ├── <meta name="description"> rendered with page-specific description
        ├── <link rel="canonical"> computed as https://spicegrillbar66.com/about/
        ├── BreadcrumbSchema items=[Home, About] auto-derived
        │
        └── All 6 schema components render unconditionally
              (RestaurantSchema, FAQSchema, MenuSchema,
               OrganizationSchema, WebSiteSchema, BreadcrumbSchema)
```

**No new data layer files are required** for three of the four pages. Content lives as prose directly in the Astro page files or in dedicated section components. The exception is `/directions/` if driving distances/times are extracted to a data file for reuse.

**Optional pattern for `/directions/`:** If driving direction data (origin city, distance, drive time, highway) is repeated or consumed by schema, extract it to `src/data/directions.json`. This matches the existing `faq.json` / `menu.json` convention.

---

## HTML Structure for AI Passage Extraction

AI engines (ChatGPT, Perplexity, Gemini, Google AI Overviews) use passage-level indexing — they retrieve individual sentences or short paragraphs, not whole pages. The critical principle from `docs/ImprovementPlan.md`: "Content must be self-contained, extractable, and fact-stated upfront."

### Structural Rules for AEO-Optimized Pages

**1. Answer-first paragraph pattern**

The opening `<p>` of every content section must be a complete, standalone fact. AI extractors favor the first sentence of a paragraph.

```html
<!-- Good: fact stated immediately, self-contained -->
<p>
  Spice Grill &amp; Bar is located at I-40 Exit 146 in Ash Fork, Arizona, approximately 70 miles and
  one hour by car from the Grand Canyon South Rim.
</p>

<!-- Bad: teaser that requires reading more to get the fact -->
<p>If you're wondering where to eat near the Grand Canyon, we have the answer.</p>
```

**2. Semantic HTML hierarchy**

Each extractable passage should be wrapped in a semantically meaningful element:

```html
<article>
  <!-- page-level topic boundary -->
  <h1>...</h1>
  <!-- primary keyword topic -->
  <section>
    <!-- sub-topic boundary -->
    <h2>...</h2>
    <!-- sub-topic keyword -->
    <p>...</p>
    <!-- extractable passage — one fact per paragraph -->
  </section>
</article>
```

Use `<article>` as the outer wrapper for the main content container on each page. AI crawlers treat `<article>` as a document boundary for passage attribution.

**3. Fact density: one claim per paragraph**

Each `<p>` element should contain one primary factual claim with supporting detail. Avoid compound paragraphs that mix multiple facts.

```html
<!-- Good: one claim per paragraph -->
<p>Spice Grill &amp; Bar is open Monday through Thursday from 8:00 AM to 9:00 PM.</p>
<p>On Friday, Saturday, and Sunday, hours extend to 10:00 PM to accommodate Route 66 travelers.</p>

<!-- Less extractable: facts buried in compound sentences -->
<p>We're open all week with hours that vary by day, so call ahead if you're not sure.</p>
```

**4. Keyword-in-heading pattern**

Every `<h2>` and `<h3>` should contain the geographic or topical keyword the section answers. This is the passage anchor for AI extraction.

```html
<h2>How Far is Spice Grill &amp; Bar from the Grand Canyon?</h2>
<p>
  Spice Grill &amp; Bar is 70 miles from the Grand Canyon South Rim entrance, a roughly 60-minute
  drive north on Highway 64 from I-40 Exit 146 in Ash Fork, Arizona.
</p>
```

**5. Structured lists for multi-item facts**

Use `<ul>` or `<ol>` for facts that are naturally list-like (e.g., driving directions from multiple cities). AI extractors handle list items as individual passages.

```html
<ul>
  <li>From Las Vegas: 3 hours 15 minutes via I-40 East, Exit 146</li>
  <li>From Los Angeles: 5 hours 30 minutes via I-40 East, Exit 146</li>
  <li>From Flagstaff: 45 minutes via I-40 West, Exit 146</li>
</ul>
```

**6. `<address>` element for NAP data**

The `/about/` and `/directions/` pages must include a properly marked-up NAP block using `<address>`. This is machine-readable and signals to AI crawlers that the page contains authoritative location data.

```html
<address>
  Spice Grill &amp; Bar<br />
  33 Lewis Ave, Ash Fork, AZ 86320<br />
  I-40 Exit 146<br />
  Phone: <a href="tel:9282771292">(928) 277-1292</a>
</address>
```

---

## Page-by-Page Architecture Specification

### `/about/` — `src/pages/about.astro`

**Purpose:** Full entity page for AI citation; expands what `OurStorySection.astro` covers.

**Layout props:**

```
title: "About Spice Grill & Bar | Authentic Punjabi Cuisine, Ash Fork AZ"
description: "Spice Grill & Bar is an authentic Punjabi Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona on historic Route 66. Learn our story, mission, and what makes our tandoori cooking unique."
```

**HTML structure:**

```
<main>
  <article>
    <h1>About Spice Grill & Bar</h1>
    <p>[Opening: full entity description — who, what, where, when]</p>

    <section>
      <h2>Our Story</h2>
      <p>[Origin, founding year, Punjabi heritage]</p>
    </section>

    <section>
      <h2>Where We Are</h2>
      <p>[I-40 Exit 146, Ash Fork, Route 66 identity]</p>
      <address>[NAP block]</address>
    </section>

    <section>
      <h2>What We Cook</h2>
      <p>[Cuisine description: tandoor, curries, naan, clay oven]</p>
    </section>

    <section>
      <h2>Who We Serve</h2>
      <p>[Road-trippers, Grand Canyon visitors, local residents, bikers]</p>
    </section>
  </article>
</main>
```

**Components used:** Layout.astro (shared), no new sub-components needed unless content is extracted to a reusable section.

**Schema additions:** None required beyond what Layout.astro already injects. Optional: inline `WebPage` JSON-LD if `about` page needs its own schema identity.

---

### `/directions/` — `src/pages/directions.astro`

**Purpose:** Driving directions optimized for "how to get to" queries on I-40. Reuses the existing `GoogleMap.tsx` component.

**Layout props:**

```
title: "Directions to Spice Grill & Bar | I-40 Exit 146, Ash Fork AZ"
description: "Get driving directions to Spice Grill & Bar from Las Vegas, Los Angeles, Flagstaff, Kingman, and Phoenix. Located at I-40 Exit 146 in Ash Fork, Arizona."
```

**HTML structure:**

```
<main>
  <article>
    <h1>How to Find Spice Grill & Bar on I-40</h1>
    <p>[Primary fact: I-40 Exit 146, Ash Fork, AZ — directly off the highway]</p>

    <section>
      <h2>Our Address</h2>
      <address>[NAP block]</address>
    </section>

    <section>
      <h2>Driving Directions from Major Cities</h2>
      <h3>From Las Vegas, NV</h3>
      <p>[Distance, drive time, highway, exit number]</p>
      <h3>From Los Angeles, CA</h3>
      <p>[Distance, drive time, highway, exit number]</p>
      <h3>From Flagstaff, AZ</h3>
      <p>[Distance, drive time, highway, exit number]</p>
      <h3>From Kingman, AZ</h3>
      <p>[Distance, drive time, highway, exit number]</p>
      <h3>From Phoenix, AZ</h3>
      <p>[Distance, drive time, highway, exit number]</p>
    </section>

    <section>
      <h2>Interactive Map</h2>
      [GoogleMap component — client:visible]
    </section>
  </article>
</main>
```

**Components used:** Layout.astro (shared), GoogleMap.tsx (existing, `client:visible`). LocationSection.astro does NOT need to be imported — the GoogleMap component can be used directly.

**Import pattern (matching existing convention):**

```astro
---
import { GoogleMap } from '@/components/GoogleMap';
const API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
---
```

**Data pattern:** Direction facts can be hardcoded inline as prose (simplest, no dependency), or extracted to `src/data/directions.json` if they're referenced elsewhere or in schema.

---

### `/near-grand-canyon/` — `src/pages/near-grand-canyon.astro`

**Purpose:** Captures "Indian restaurant near Grand Canyon" queries from road-trippers and tourists. Highest-value GEO/AEO page for tourist audience.

**Layout props:**

```
title: "Indian Restaurant Near Grand Canyon | Spice Grill & Bar, Ash Fork AZ"
description: "Spice Grill & Bar is an authentic Indian restaurant 70 miles from the Grand Canyon South Rim. Located at I-40 Exit 146 in Ash Fork, AZ — the perfect dining stop on your Grand Canyon road trip."
```

**HTML structure:**

```
<main>
  <article>
    <h1>Indian Restaurant Near the Grand Canyon</h1>
    <p>[Primary fact: distance from Grand Canyon South Rim, drive time, highway route]</p>

    <section>
      <h2>How Far is Spice Grill & Bar from the Grand Canyon?</h2>
      <p>[70 miles / ~1 hour from South Rim entrance, via Highway 64 to I-40]</p>
    </section>

    <section>
      <h2>Why Stop at Spice Grill & Bar on Your Grand Canyon Trip</h2>
      <p>[Convenience on I-40, cuisine type, family/biker friendly, hours]</p>
    </section>

    <section>
      <h2>What to Order</h2>
      <p>[Recommended dishes for road-trippers: butter chicken, garlic naan, curry]</p>
    </section>

    <section>
      <h2>Getting Here from the Grand Canyon</h2>
      <p>[Specific driving route: South Rim → Highway 64 → I-40 West → Exit 146]</p>
    </section>
  </article>
</main>
```

**Components used:** Layout.astro (shared), no new sub-components needed.

**Schema opportunity:** This page benefits from a `TouristAttraction` or `LandmarkPage` JSON-LD note in a `WebPage` schema if the proximity relationship to the Grand Canyon needs explicit structured data.

---

### `/route-66-dining/` — `src/pages/route-66-dining.astro`

**Purpose:** Captures "Route 66 dining" and "where to eat on Route 66" queries. Targets the road-tripper audience researching the I-40/Route 66 corridor in advance.

**Layout props:**

```
title: "Dining on Route 66 in Ash Fork, AZ | Spice Grill & Bar"
description: "Discover authentic Punjabi Indian cuisine on historic Route 66 in Ash Fork, Arizona. Spice Grill & Bar sits at I-40 Exit 146, where Route 66 travelers have stopped since 2024."
```

**HTML structure:**

```
<main>
  <article>
    <h1>Route 66 Dining in Ash Fork, Arizona</h1>
    <p>[Primary fact: restaurant on Route 66, town identity, what kind of food]</p>

    <section>
      <h2>About Ash Fork on Route 66</h2>
      <p>[Ash Fork history, Route 66 heritage, I-40 Exit 146 location]</p>
    </section>

    <section>
      <h2>Spice Grill & Bar: A Unique Stop on the Mother Road</h2>
      <p>[Indian cuisine on Route 66 — unique dining context, biker friendly]</p>
    </section>

    <section>
      <h2>Where is Ash Fork on Route 66?</h2>
      <p>[Geographic context: between Seligman and Williams, mileage from each]</p>
    </section>

    <section>
      <h2>Hours and Reservations</h2>
      <p>[Hours, walk-in policy, online ordering link]</p>
    </section>
  </article>
</main>
```

**Components used:** Layout.astro (shared), no new sub-components needed.

---

## Navigation Updates — Header.tsx

The `navigation` array in `src/components/Header.tsx` is hardcoded:

```typescript
const navigation = [
  { name: 'Menu', href: '#menu' },
  { name: 'Philosophy', href: '#philosophy' },
  { name: 'FAQ', href: '/faq/' },
];
```

The `getHref()` function already handles non-hash links correctly — it returns the href unchanged for paths that start with `/`. New page links can be added directly to this array without any logic changes.

**Recommended additions:**

```typescript
const navigation = [
  { name: 'Menu', href: '#menu' },
  { name: 'Philosophy', href: '#philosophy' },
  { name: 'About', href: '/about/' },
  { name: 'Directions', href: '/directions/' },
  { name: 'FAQ', href: '/faq/' },
];
```

**Decision point:** Adding all four new pages to the main nav may crowd the desktop header. An alternative is to add only `/about/` and `/directions/` to the nav (highest utility for users) and link `/near-grand-canyon/` and `/route-66-dining/` only from the footer and from cross-links in page body content. This is the recommended approach.

**Footer.astro** currently links only to `/faq/`. All four new pages should be added to the footer link list. This is a low-risk change (static component, no logic).

---

## Internal Linking Structure for Local SEO

Internal links are a primary signal for both traditional Google PageRank and AI passage-retrieval attribution (a cited passage is more credible if linked from authoritative entity pages). The recommended linking graph:

### Hub-and-Spoke Pattern

The homepage (`/`) and `/about/` are the hub pages. All other pages are spokes. Every spoke page links back to the hub.

```
/ (Homepage — hub)
├── links to → /about/
├── links to → /directions/
├── links to → /near-grand-canyon/
├── links to → /route-66-dining/
└── links to → /faq/

/about/ (entity hub)
├── links to → / (homepage)
├── links to → /directions/
├── links to → /near-grand-canyon/
└── links to → /faq/

/directions/
├── links to → / (homepage)
├── links to → /about/
└── links to → /near-grand-canyon/ ("Learn about dining near the Grand Canyon")

/near-grand-canyon/
├── links to → / (homepage)
├── links to → /directions/ ("Get driving directions from the Grand Canyon")
└── links to → /faq/

/route-66-dining/
├── links to → / (homepage)
├── links to → /about/
└── links to → /directions/

/faq/
├── links to → / (homepage)
├── links to → /directions/ (answers about location/exit number)
└── links to → /near-grand-canyon/ (answers about Grand Canyon distance)
```

### Specific Link Placement Strategy

- **Homepage hero section**: Add an "About Us" text link below the CTA buttons pointing to `/about/`
- **Homepage footer**: Add all four new pages to the footer navigation column
- **OurStorySection.astro**: Add "Read our full story" link to `/about/` at the end of the section
- **LocationSection.astro**: Add "Detailed directions from all cities" link to `/directions/` below the map
- **Footer.astro**: Add a "Pages" column with links to About, Directions, FAQ, Near Grand Canyon, Route 66 Dining
- **Each new page**: Include a "Related Pages" or contextual cross-links section at the bottom, above the footer

### Anchor Text Conventions for SEO

Use descriptive, keyword-containing anchor text — not generic "click here" or "learn more":

| From page             | To page               | Anchor text                               |
| --------------------- | --------------------- | ----------------------------------------- |
| Homepage              | `/about/`             | "About Spice Grill & Bar"                 |
| Homepage              | `/directions/`        | "Get directions to I-40 Exit 146"         |
| `/about/`             | `/near-grand-canyon/` | "Indian restaurant near the Grand Canyon" |
| `/directions/`        | `/near-grand-canyon/` | "dining stop near the Grand Canyon"       |
| `/near-grand-canyon/` | `/directions/`        | "driving directions from the South Rim"   |
| `/route-66-dining/`   | `/about/`             | "our story on Route 66"                   |

---

## Build Order — Recommended Sequence

The following sequence minimizes rework and keeps the QA gate (`npm run qa`) green throughout:

### Step 1: Navigation and Footer Updates (Prerequisite)

**Files:** `src/components/Header.tsx`, `src/components/Footer.astro`

Add the new page links to the `navigation` array and footer link list before creating the pages. This ensures that once pages exist, they are immediately linked from shared components. These are low-risk, one-line-per-link changes.

**Rationale:** Shared navigation changes affect every page. Doing this first means each new page is already in the nav when it is created, and the `npm run build` can verify link targets resolve correctly.

### Step 2: `/about/` — Entity Foundation Page

**File:** `src/pages/about.astro`

Create the About page first because:

- It is the canonical entity page — other pages link to it for authority
- Its content (restaurant description, founding story, location facts) is reused as prose cross-links from all other pages
- It has no external dependencies (no GoogleMap, no data files needed)

### Step 3: `/directions/` — Existing Component Reuse

**File:** `src/pages/directions.astro`

Create after `/about/` because:

- Reuses the existing `GoogleMap.tsx` component with `client:visible`
- Cross-links to `/about/` (which now exists) and `/near-grand-canyon/` (which does not yet exist — use a forward link, it will resolve once Step 4 is complete)
- Validates that GoogleMap can be used standalone outside `LocationSection.astro`

### Step 4: `/near-grand-canyon/` — Highest SEO Value

**File:** `src/pages/near-grand-canyon.astro`

Create after `/directions/` because:

- Cross-links to `/directions/` (which now exists)
- No dependencies beyond Layout.astro
- This is the highest-value GEO page — building it early maximizes indexing window before other phases

### Step 5: `/route-66-dining/` — Contextual Content

**File:** `src/pages/route-66-dining.astro`

Create last because:

- Cross-links to all other pages (which all now exist)
- Content is contextual/editorial — benefits from having `/about/` content finalized first
- Lower urgency relative to the Grand Canyon targeting

### Step 6: BreadcrumbSchema Label Fix (Post-Creation)

After all pages exist, revisit the breadcrumb label derivation in `Layout.astro`. The current logic strips slashes and capitalizes, producing "Near-grand-canyon" for `/near-grand-canyon/`. Either:

- Add a `breadcrumbLabel` prop to Layout.astro (cleanest, explicit)
- Or add a label mapping in `Layout.astro`'s frontmatter

This is purely a schema quality improvement — schema is valid either way, but "Indian Restaurant Near Grand Canyon" as a breadcrumb label is more meaningful than "Near-grand-canyon".

---

## Quality Gate Implications

### Lighthouse Thresholds

All four new pages are static Astro files with no new JavaScript. The only new JS is the `GoogleMap.tsx` island on `/directions/`, which already exists and is already lazy-loaded with `client:visible`. LCP, TBT, and CLS impact is zero for `/about/`, `/near-grand-canyon/`, and `/route-66-dining/`. The `/directions/` page carries the same map performance profile as the homepage (which already passes the gate).

### AEO Audit (`npm run test:aeo`)

The AEO audit in `scripts/aeo-audit.mjs` should be run against each new page URL after build. The answer-first paragraph structure described above is what this audit validates.

### Lighthouse CI Configuration

The `.lighthouserc.json` specifies which URLs Lighthouse CI tests. New pages must be added to the URL list in `.lighthouserc.json` for the `npm run test:lhci` gate to cover them.

---

## Open Questions / Decisions Required

| Question                                                                                                                       | Impact                                       | Who Decides                          |
| ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------ |
| Which new pages go in the primary nav vs. footer-only?                                                                         | UX + Header component scope                  | Owner                                |
| Should `/near-grand-canyon/` include a `TouristAttraction` or `WebPage` JSON-LD schema?                                        | Schema richness for AI                       | Developer                            |
| Should driving direction data be in a JSON file or hardcoded prose?                                                            | Code organization only, no functional impact | Developer                            |
| Should `Layout.astro` accept a `breadcrumbLabel` prop to fix the auto-derivation for hyphenated slugs?                         | Schema label quality                         | Developer                            |
| What is the actual driving distance/time from Grand Canyon to Ash Fork? (Needed for accurate content on `/near-grand-canyon/`) | Content accuracy — critical for AEO          | Owner provides or developer verifies |

---

_Research author: Claude (project-researcher agent) — 2026-02-20_
