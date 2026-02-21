# Spice Grill & Bar — SEO / AEO / GEO Execution Plan

> **Goal**: Increase visibility of Spice Grill & Bar across Google Search, AI answer engines (ChatGPT, Perplexity, Gemini, Google AI Overviews), and mapping apps for two distinct audiences: I-40 road-trippers/tourists and local residents within a 20-mile radius.

---

## Codebase Audit Summary — Issues Identified

After scanning every schema component, layout, page, and content data files, here are the critical issues to address:

| #   | File                                                                                                                                         | Issue                                                                                                                                                                                                                                 | Priority |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | [RestaurantSchema.astro](file:///Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/src/components/schema/RestaurantSchema.astro#L53) | `areaServed` is only `"Ash Fork"` — needs to include Williams, Seligman, Kaibab Estates, and tourist corridors. Needs `geo` coordinates, `hasMap`, `potentialAction` for ordering, and `containedInPlace` for I-40/Route 66 identity. | 🟡 High  |
| 2   | [OrganizationSchema.astro](file:///Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/src/components/schema/OrganizationSchema.astro) | Missing `sameAs` for Google Maps, TripAdvisor, and Yelp profiles.                                                                                                                                                                     | 🟡 High  |
| 3   | [faq.json](file:///Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/src/data/faq.json)                                              | Only 9 FAQs. No route/highway-specific questions that road-trippers would ask AI engines.                                                                                                                                             | 🟡 High  |
| 4   | Site Architecture                                                                                                                            | Only 2 pages (`/` and `/faq/`). No dedicated content pages for GEO-optimized topics (e.g., "I-40 Restaurants", "Dining near Grand Canyon").                                                                                           | 🟡 High  |

---

## Phase 1: Core GEO, Schema & Maps Optimization

### 1A. AI Mention & Citation Discovery

Focus on understanding how AI engines and search discover your brand. Instead of email outreach, focus heavily on organic mentions that AI platforms naturally crawl.

**Manual Discovery Queries** (use Google with quotes):

- `"Spice Grill" "Ash Fork"`
- `"Spice Grill and Bar"` OR `"Spice Grill & Bar"`
- `"Indian food" "Ash Fork"` OR `"Indian restaurant" "Ash Fork"`
- `"where to eat" "I-40" "Arizona"`
- `"Grand Canyon" "food" "stop"` OR `"pitstop"`
- `"Seligman" OR "Williams" "Indian food"`

**Proactive Mention-Seeding (AI Focused):**

1. **Reddit Engagement**: Respond genuinely in r/roadtrip, r/arizona, and r/grandcanyon threads asking about food stops. AI engines (like ChatGPT and Perplexity) explicitly favor and heavily cite Reddit.
2. **TripAdvisor / Yelp Response Strategy**: Actively respond to **every** review (positive and negative) with keyword-rich, localized replies. AI engines scrape review sites extensively to form opinions and recommendations.

### 1B. GEO / AEO Content Plan for Route & Local Searches

> AI systems retrieve **specific passages** and assemble them into answers. Content must be **self-contained, extractable, and fact-stated upfront**.

**New Content Pages to Create (Astro)**
Your site should expand from 2 pages to include dedicated content pages with extractable passages that AI systems can reference:

1. **`/about/` — "About Spice Grill & Bar"**: Expand the "Our Story" section into a full page. (e.g. _"Spice Grill & Bar is an authentic Punjabi Indian restaurant located at I-40 Exit 146 in Ash Fork, Arizona..."_)
2. **`/directions/` — "How to Find Us on I-40"**: Interactive map with driving directions from Las Vegas, Los Angeles, Kingman, Phoenix, Flagstaff. Emphasize I-40 Exit 146.
3. **`/near-grand-canyon/` — "Indian Restaurant Near Grand Canyon"**: Target distance from Grand Canyon South Rim (70 miles, ~1 hr drive), specific dish recommendations.
4. **`/route-66-dining/` — "Dining on Route 66 in Ash Fork"**: Ash Fork's history, Route 66 heritage.

**FAQ Expansion (from 9 → 20 questions)**
We will add route-specific and local-targeting questions to [faq.json](file:///Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/src/data/faq.json). Example questions:

- "How far is Spice Grill & Bar from the Grand Canyon?"
- "Is Spice Grill & Bar a good stop on I-40?"
- "How far is Spice Grill & Bar from Las Vegas?"
- "Can I order food from Williams or Seligman for pickup?"
- "What exit do I take on I-40 for Spice Grill & Bar?"

### 1C. Schema Improvements (Code Changes)

#### [MODIFY] [RestaurantSchema.astro](file:///Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/src/components/schema/RestaurantSchema.astro)

- Expand `areaServed` to an array including Williams, Seligman, and Kaibab Estates.
- Add geographic coordinates (`geo`).
- Link your Google Maps profile (`hasMap`).
- Add an `OrderAction` so AI engines know you support online ordering.
- Inject current Google review data (`aggregateRating`).

#### [MODIFY] [OrganizationSchema.astro](file:///Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/src/components/schema/OrganizationSchema.astro)

- Expand the `sameAs` array to include your claimed Yelp, TripAdvisor, and Google Maps profiles.

#### [MODIFY] [WebSiteSchema.astro](file:///Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web/src/components/schema/WebSiteSchema.astro)

- Add a detailed, GEO-optimized `description` and a `publisher` property.

### 1D. Google Business Profile & Citations

- **Google Business Profile (GBP)**: Verify your secondary categories ("Punjabi Restaurant", "Take Out Restaurant"), populate the Q&A section with the new FAQs, and consistently publish weekly Posts with photos.
- **Yelp & TripAdvisor**: Since these are already claimed, ensure your Name, Address, Phone (NAP) are 100% consistent with your GBP profile and that you are maximizing the inclusion of local keywords (I-40, Grand Canyon stop).

---

## Phase 2: Apple Maps Improvements

Apple Maps is a massive discovery engine for iPhone users driving along I-40. We will dedicate a separate implementation phase exclusively to optimizing the Apple Business Connect profile, ensuring proper categories, high-resolution imagery, and seamless integration with your Toast online ordering system.

---

## Phase 3: Automated KPI Tracking

Because Google Search Console is a lagging indicator and manual prompt testing is tedious, we will dedicate a phase to researching and implementing an automated KPI tracker. This phase will focus on measuring AI citation frequency, GBP direction requests, and review velocity programmatically.

---

## Phase 4: Halal De-prioritization & Content Refresh

We will revisit the `"100% Halal Certified"` messaging across the site. All changes regarding this wording will be postponed until we conceptualize an adequate replacement heading and section. This phase will handle the code updates for:

- `llms.txt`
- `llms-full.txt`
- `OurStorySection.astro`
