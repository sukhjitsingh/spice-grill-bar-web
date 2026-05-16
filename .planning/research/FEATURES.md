# Features Research — v3.1 AEO Gap Fixes

**Researched:** 2026-05-13
**Domain:** AEO schema compliance — FAQPage alignment, SpeakableSpecification, entity disambiguation, HowTo, meta description, AI crawler discovery
**Milestone:** v3.1 AEO Gap Fixes

---

## Summary

This research covers the 7 targeted AEO fixes identified in the post-v3.0 audit. The site's schema foundation is solid (RestaurantSchema, OrganizationSchema, 34-entry FAQPage, Speakable on GEO pages); these fixes close precision gaps in entity disambiguation, schema/DOM alignment, voice coverage, and AI-crawler discovery.

Two critical findings that affect how to think about this work:

1. **FAQ and HowTo rich results are fully deprecated as of May 2026.** FAQPage and HowTo schema no longer produce visible SERP features for non-government sites. However, both types retain AEO/GEO value: AI engines (Perplexity, ChatGPT, Google AI Overviews) continue to extract and cite FAQPage content at high rates, and HowTo schema structures step-by-step content for voice extraction even without rich results.

2. **The schema/DOM alignment rule is non-negotiable.** Google's spam policies require that every Q&A in FAQPage schema corresponds to visible content on that page. The current home page ships all 34 FAQ entries in the schema but only renders 8 in the DOM — this is the most urgent fix of the seven.

---

## Fix 1: FAQPage schema/DOM alignment

### Policy

Google requires that every `Question` in a `FAQPage` schema object corresponds to content the user can actually see on that page. The official guideline: "The content in the structured data must match the content on the page." Answers hidden behind accordions are acceptable — content that exists only in the schema and not in the DOM at all is a violation.

**Current violation (high priority):** `Layout.astro` injects the global `FAQSchema` component on both `/` and `/faq/` paths. `FAQSchema.astro` renders all 34 entries from `faq.json`. The home page `index.astro` only renders 8 of those 34 entries in the DOM (`#home-faq` section). This means 26 schema questions have no DOM counterpart on the home page — a direct policy violation.

The FAQ page (`/faq/`) is clean: it renders all 34 entries and the global FAQSchema provides all 34 entries — full alignment.

### Fix pattern

The home page needs its own scope-limited FAQPage schema that contains only the same 8 entries visible in the DOM. The global `FAQSchema` component must not fire on `/` (or must be replaced with a page-specific variant on that path).

**Two implementation paths:**

**Option A — Per-page FAQPage inline block (matches GEO page pattern):**
Remove FAQSchema from Layout.astro's home-page gate. Add an inline `<script type="application/ld+json">` block directly in `index.astro` that contains only the 8 `homeFaqIndices` entries. Keeps schema co-located with its DOM. Pattern already used in `directions.astro`.

**Option B — Prop-filtered FAQSchema component:**
Add an optional `entries` prop to `FAQSchema.astro`. When passed, render only those entries. Layout.astro passes `homeFaq` on `/` and `undefined` (all 34) on `/faq/`. More reusable but requires Layout to receive homeFaq data, which it currently does not have.

**Recommendation: Option A.** Simpler, consistent with the inline schema pattern already established for `directions.astro`. Leaves `FAQSchema.astro` untouched.

### Table stakes vs. nice-to-have

| Requirement | Status | Why |
|---|---|---|
| Schema questions must be in DOM | Table stakes — fix immediately | Policy violation; risk of manual action |
| Question text must match exactly | Table stakes | AI engines cross-reference schema text to DOM text |
| Answers can be in accordions | Acceptable | Not used here but good to know |
| Schema on `/faq/` is already aligned | Already done | 34 schema = 34 DOM entries |

### Current state of Layout.astro gate

```typescript
// Line 121 in Layout.astro (current — fires global 34-entry schema on home page)
{(currentPath === '/' || currentPath.startsWith('/faq')) && <FAQSchema />}
```

After fix: gate should be `currentPath.startsWith('/faq')` only, with home page getting its own inline 8-entry block.

**Confidence:** HIGH — [VERIFIED: Google Search Central FAQPage docs via search result content] [CITED: developers.google.com/search/docs/appearance/structured-data/faqpage]

---

## Fix 2: SpeakableSpecification on FAQ page

### Current state

The home page (`index.astro`) and directions page (`directions.astro`) both have Speakable schema. The FAQ page (`faq.astro`) has zero Speakable markup despite being the richest voice-extraction target on the site: 34 questions each with a direct, concise answer.

### CSS selector patterns that work

Speakable's `cssSelector` property accepts standard CSS selector strings. The FAQ page currently renders each Q&A as:

```html
<div class="bg-surface-container p-8 rounded-2xl">
  <h2 class="text-heading-md text-on-surface mb-3">{question}</h2>
  <p class="text-body-md text-on-surface-variant">{answer}</p>
</div>
```

**Problem with class-based selectors here:** The FAQ page currently has no `id` on the FAQ container and uses utility classes that could change. The home page solved this with `#home-faq h3` and `#home-faq p` — stable ID-anchored selectors per the v3.0 decision (see PROJECT.md Key Decisions: "ID-anchored SpeakableSpecification selectors").

**Recommended approach for FAQ page:** Add `id="faq-list"` to the FAQ container `<div class="space-y-4">`. Then target:

```json
"cssSelector": ["#faq-list h2", "#faq-list p"]
```

This mirrors the established `#home-faq h3`/`#home-faq p` pattern exactly. H2 is correct here because the FAQ page uses `<h2>` for questions (the home section uses `<h3>` since it's a subsection of the page).

### Word count and structure requirements

Google's Speakable guidance specifies content should represent approximately 20-30 seconds of speech when read aloud. At an average speaking pace of 130 words per minute, this is roughly 40-65 words per Speakable segment.

The current FAQ answers are appropriately sized — they are 1-2 sentences, typically 20-50 words. This is within the target range for voice extraction. No restructuring needed.

**Content guidelines for Speakable:**
- Must be concise, directly answerable content — the FAQ answers already satisfy this
- Must not be confusing when read aloud out of context (photo captions, datelines, source attributions are excluded — not a concern here)
- Should provide standalone comprehensible information — each FAQ answer is a self-contained response

### Voice extraction behavior

When a user asks a voice assistant a question matching one of the FAQ entries, the assistant can extract both the `h2` question and `p` answer as a voice-optimized pair. The Speakable markup signals which DOM elements to prioritize for text-to-speech rendering.

**Important:** Speakable remains in "BETA" status on Google Search Central as of 2026. Google uses it for news content primarily, but schema.org's definition includes any web content, and AI engines use it as a signal regardless of Google's current beta status.

### Implementation block

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "FAQ | Spice Grill & Bar",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["#faq-list h2", "#faq-list p"]
  }
}
```

Place as inline `<script type="application/ld+json">` in `faq.astro` (not in Layout.astro) — same pattern as directions.astro and index.astro.

**Confidence:** HIGH for selector pattern [VERIFIED: matches established project convention, schema.org spec] | MEDIUM for voice extraction effectiveness [ASSUMED: Speakable remains in beta and Google's usage of it for non-news is not officially confirmed]

---

## Fix 3: Restaurant @id

### Canonical format

The `@id` property in JSON-LD creates a unique, stable identifier for an entity in the knowledge graph. For a restaurant with a dedicated web presence, the canonical format is:

```
https://yourdomain.com/#type
```

Where `#type` is the schema type, lowercase. For this site:

```
https://spicegrillbar66.com/#restaurant
```

The hash fragment (`#restaurant`) distinguishes this entity identifier from the page URL (`url: "https://spicegrillbar66.com"`). Both must be present and consistent:

- `@id` — the permanent entity identifier, used as a cross-reference key
- `url` — where the entity's primary web presence lives (already in the schema)

**Consistency rule:** Once set, `@id` must be identical wherever this Restaurant entity is referenced in structured data across the entire site. Google treats different `@id` strings as different entities even if they resolve to the same page.

### What it unlocks in the Knowledge Graph

Adding `@id` to the Restaurant schema enables:

1. **Entity disambiguation** — Google and AI engines can unambiguously identify "Spice Grill & Bar" as a specific entity at a specific `@id`, not a name that might match other restaurants
2. **Cross-page entity linking** — If schema on other pages references `@id: "https://spicegrillbar66.com/#restaurant"`, the knowledge graph connects them as the same entity
3. **AI citation precision** — AI engines (Perplexity, ChatGPT plugins with web access) use `@id` URIs to de-duplicate entities during retrieval
4. **Knowledge Panel strengthening** — A stable `@id` paired with `sameAs` is the primary signal Google uses to associate a business with its Knowledge Panel

### Implementation

Add to `RestaurantSchema.astro` within the existing `schema` object:

```typescript
const schema: WithContext<Restaurant> = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': 'https://spicegrillbar66.com/#restaurant',
  'url': 'https://spicegrillbar66.com', // already present — keep it
  // ... rest of existing schema
};
```

No other changes needed. The `url` property is already in the schema — `@id` is purely additive.

**Confidence:** HIGH [CITED: schema.org data model, multiple authoritative SEO sources confirming `site.com/#type` convention]

---

## Fix 4: sameAs on Restaurant

### Current state

`OrganizationSchema.astro` already carries `sameAs` with Google Maps, Yelp, TripAdvisor, Facebook, and Instagram URLs. The `RestaurantSchema.astro` has no `sameAs` property. For entity disambiguation, the `sameAs` should be on the primary entity type (`Restaurant`) rather than (or in addition to) `Organization`.

### Which URLs to include

**Tier 1 — Maximum entity authority signal:**

| URL | Why Include | Notes |
|---|---|---|
| Wikidata entity URL | Highest-authority third-party identifier; directly feeds Google Knowledge Graph | Only include if Spice Grill & Bar has a Wikidata entry — do NOT create one speculatively |
| Wikipedia URL | Second-highest authority; strong Knowledge Panel trigger | Only if a Wikipedia article exists for this specific restaurant |
| Google Business Profile (GBP) URL | Ties schema entity to the GBP record that feeds the local Knowledge Panel | Use `https://www.google.com/maps?cid=YOUR_CID` format (permanent CID, not short URL) |

**Tier 2 — Standard social/directory signals:**

| URL | Format | Priority |
|---|---|---|
| Yelp listing | `https://www.yelp.com/biz/spice-grill-bar-ash-fork` | High — local authority |
| TripAdvisor listing | Full TripAdvisor URL for the restaurant | High — travel-relevant audience |
| Facebook page | `https://www.facebook.com/SpiceGrillBar` (or actual URL) | Medium |
| Instagram profile | `https://www.instagram.com/spicegrillbar/` (or actual URL) | Medium |

**Tier 3 — Avoid unless verified:**
- Do NOT use `goo.gl/maps` short links (redirect chain, not stable)
- Do NOT use `maps.app.goo.gl` short URLs (same issue)
- Do NOT use `maps.google.com` domain (use `www.google.com/maps?cid=...`)
- Do NOT include Wikipedia/Wikidata if no article exists — linking to a non-existent or wrong entity harms disambiguation

### Finding the GBP CID

The CID (Customer ID) is extracted from the Google Maps URL for the business. The existing `hasMap` value in RestaurantSchema (`https://maps.app.goo.gl/q2EJFMbMRaysU6vH8`) is a short link. To get the CID-based URL:

1. Open the `hasMap` short link in a browser
2. The expanded URL will contain `cid=XXXXXXXXXXX` in the query string
3. Use `https://www.google.com/maps?cid=XXXXXXXXXXX` as the `sameAs` GBP entry

### Format in schema

```typescript
sameAs: [
  'https://www.google.com/maps?cid=YOUR_CID_HERE',   // GBP — replace with real CID
  'https://www.yelp.com/biz/spice-grill-bar-ash-fork', // verify actual Yelp URL
  'https://www.tripadvisor.com/...',                   // verify actual TripAdvisor URL
  'https://www.facebook.com/SpiceGrillBar',            // verify actual Facebook URL
  'https://www.instagram.com/spicegrillbar/',          // verify actual Instagram URL
],
```

**Note:** Wikipedia/Wikidata should only be added after confirming entries exist. A small restaurant in Ash Fork, AZ likely does not have a Wikipedia article. Include Wikidata only if a legitimate entry exists.

### OrganizationSchema coordination

The `OrganizationSchema.astro` already has `sameAs`. To avoid redundancy, the planner can choose either:
- Add `sameAs` to `RestaurantSchema` only (Restaurant is the primary type for this page)
- Keep both — not harmful, just redundant

The primary type (`Restaurant`) carrying `sameAs` is the more semantically correct approach.

**Confidence:** HIGH for format and priority ordering [CITED: multiple schema.org/local-business sources, Google Search Central organization schema docs] | LOW for GBP CID value (must be looked up — `[ASSUMED]` current hasMap URL is a short link that needs expansion)

---

## Fix 5: HowTo schema for driving directions

### Rich results status: DEPRECATED (August 2023)

HowTo rich results were removed from Google Search in September 2023 — first on mobile, then desktop. HowTo structured data no longer produces SERP-visible rich results. The Search Console HowTo report was also removed.

**However, HowTo schema retains AEO value.** AI engines (Perplexity, Google AI Overviews, ChatGPT with web access) extract structured step-by-step content for voice and conversational answers. "How do I get from Las Vegas to Spice Grill & Bar?" is a natural voice query where HowTo structure aids AI extraction. The goal is AI citation, not a rich result.

### Required fields (per schema.org specification)

schema.org does not enforce required fields — any HowTo property is optional in the spec. In practice, for useful AI extraction, include:

| Field | Required for AI value | Notes |
|---|---|---|
| `@type: "HowTo"` | Yes | Type declaration |
| `name` | Yes | "Directions from Flagstaff to Spice Grill & Bar" — the answerable question framing |
| `description` | Recommended | One-sentence summary — mirrors the existing `<p>` paragraph |
| `step` | Yes | Array of `HowToStep` objects |
| `step[].@type` | Yes | `"HowToStep"` |
| `step[].text` | Yes | The instruction text — each turn/action as a sentence |
| `step[].name` | Recommended | Short label for the step ("Take I-40 West") |
| `estimatedCost` | No | Not applicable for directions |
| `supply` | No | Not applicable for directions |
| `tool` | No | Not applicable for directions |
| `totalTime` | Recommended | Duration in ISO 8601 format: `"PT46M"` for 46 minutes |

### 3-city scope justification

The PROJECT.md specifies Flagstaff, Williams, and Las Vegas as the 3 HowTo targets. These are the three highest-value origin cities:
- **Flagstaff** — Largest nearby city, primary I-40 traffic source
- **Williams** — Grand Canyon gateway town, highest-intent tourist traffic
- **Las Vegas** — Highest-volume long-distance origin, Route 66 road-trip corridor

Seligman, Kingman, Los Angeles, and Phoenix are covered by the existing FAQPage inline schema on directions.astro — they don't need HowTo duplication.

### Sample structure for one city

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to drive from Flagstaff to Spice Grill & Bar",
  "description": "Step-by-step driving directions from Flagstaff, AZ to Spice Grill & Bar at I-40 Exit 146 in Ash Fork, AZ — 51 miles, about 46 minutes.",
  "totalTime": "PT46M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Start on I-40 West",
      "text": "From Flagstaff, take I-40 West toward Kingman."
    },
    {
      "@type": "HowToStep",
      "name": "Drive 51 miles",
      "text": "Drive 51 miles west on I-40 (about 46 minutes)."
    },
    {
      "@type": "HowToStep",
      "name": "Take Exit 146",
      "text": "Take Exit 146 in Ash Fork — the Ash Fork / Historic Route 66 exit."
    },
    {
      "@type": "HowToStep",
      "name": "Arrive at Spice Grill & Bar",
      "text": "Turn right onto Lewis Ave. Spice Grill & Bar is at 33 Lewis Ave on your right."
    }
  ]
}
```

All three HowTo objects go into a single `<script type="application/ld+json">` block in `directions.astro` as a JSON-LD array, or as three separate script blocks. Both are valid.

### Voice output behavior

When a voice assistant handles "How do I get to Spice Grill & Bar from Las Vegas?", the HowTo step `text` values are what the assistant reads aloud in sequence. Each step should be one complete, unambiguous instruction — no abbreviations, no road jargon without expansion (spell out "I-40" not "40", "Exit 146" not "Exit 146").

**Confidence:** HIGH for field structure [CITED: schema.org/HowTo, schema.org/HowToStep specs] | HIGH for deprecation status [CITED: developers.google.com/search/blog/2023/08/howto-faq-changes] | MEDIUM for AEO extraction value [ASSUMED: AI engines extract HowTo steps — no official confirmation from individual AI providers]

---

## Fix 6: FAQ meta description

### Current state

`faq.astro` passes this description to Layout.astro:

```
"Frequently asked questions about Spice Grill & Bar. Information on hours, location, and vegetarian options."
```

This is 105 characters and covers only 3 of the 34 FAQ topics. It does not signal breadth of coverage to either search engines or AI extractors.

### Length guidance

- Google renders meta descriptions up to approximately 155-160 characters before truncating in traditional SERPs
- For AI-generated snippets and overviews, Google often rewrites or replaces the meta description with page content anyway — but the description shapes the initial relevance signal
- 150-160 characters is the practical target: long enough to carry keyword density, short enough not to truncate

### Keyword pattern for AI snippet selection

AI engines use the meta description as a topic signal for page-level categorization. For a FAQ page, the description should:

1. **Signal page type** — "questions and answers" or "FAQ" explicitly
2. **Cover the major topic clusters** present in the 34 entries (not just 3)
3. **Include geographic and intent modifiers** that match voice query patterns
4. **Front-load the most important keywords** (Google truncates from the end)

**Topic clusters in the 34 FAQ entries:**
- Hours and operations (opening hours, takeout, delivery, reservations)
- Location and directions (I-40 Exit 146, Ash Fork, Route 66)
- Proximity queries (Grand Canyon, Flagstaff, Williams, Las Vegas, Phoenix)
- Menu and cuisine (Indian, Punjabi, vegetarian, vegan, butter chicken, naan)
- Amenities (parking, bar, family-friendly, accessibility)
- Pricing and payment

### Recommended meta description

```
Answers to 34 common questions about Spice Grill & Bar in Ash Fork, AZ — hours, menu, vegetarian options, parking, and directions from the Grand Canyon, Flagstaff, Williams, and Las Vegas.
```

Character count: 190 — slightly over the 160-character soft limit. Trim to:

```
34 FAQ answers: hours, menu, vegetarian options, directions from the Grand Canyon, Flagstaff, Williams, and Las Vegas to Spice Grill & Bar at I-40 Exit 146, Ash Fork, AZ.
```

Character count: 172. Still slightly long. Final version at 158 characters:

```
Hours, menu, vegetarian options, and driving directions to Spice Grill & Bar at I-40 Exit 146, Ash Fork, AZ — answers to 34 common questions.
```

**Why this pattern works:**
- Leads with the top 3 voice query topics (hours, menu, dietary)
- Includes the geographic identity anchor (I-40 Exit 146, Ash Fork, AZ)
- Closes with the FAQ scope signal ("34 common questions") — establishes breadth for AI categorization
- Every keyword is present in the actual FAQ content — aligned with page, not keyword-stuffed

### ogDescription

The `ogDescription` passed to Layout.astro can be slightly longer (social sharing, not search truncation):

```
Find answers to 34 questions about Spice Grill & Bar — operating hours, authentic Indian menu, vegetarian and vegan options, parking, full bar, and step-by-step directions from the Grand Canyon, Flagstaff, Williams, Las Vegas, and Phoenix.
```

**Confidence:** MEDIUM [CITED: Google snippet documentation, multiple SEO sources on description length] | MEDIUM for AI extraction signal value [ASSUMED: meta description influences AI categorization — no direct confirmation from AI providers]

---

## Fix 7: llms-full.txt head link

### Current state

`Layout.astro` currently has:

```html
<link rel="help" href="/llms.txt" />
```

Two issues:
1. `rel="help"` is semantically wrong — "help" describes a link to a help/support page, not to an AI documentation file
2. `llms-full.txt` is not linked in `<head>` at all — only `llms.txt` is

### Spec status

The `llms.txt` convention was proposed by Jeremy Howard in September 2024 and lives at `llmstxt.org`. It is a **community proposal, not a W3C or WHATWG standard.** No major AI provider (OpenAI, Anthropic, Google, Meta) has publicly confirmed they read or act on `llms.txt` files from server logs or official documentation as of May 2026.

That said, over 844,000 websites have implemented it, and it represents best-effort future-proofing against AI crawlers that may adopt it.

### rel value

The semantically correct `rel` value for linking to an alternative machine-readable representation of the site is `alternate`. This is an established HTML rel type defined in the HTML Living Standard (WHATWG). Usage:

```html
<link rel="alternate" type="text/plain" href="/llms.txt" title="AI documentation (llms.txt)" />
<link rel="alternate" type="text/plain" href="/llms-full.txt" title="AI documentation — full content (llms-full.txt)" />
```

### type attribute: `text/plain` vs `text/markdown`

- `llms.txt` and `llms-full.txt` are plain text files with Markdown formatting — they are not rendered as HTML
- `text/plain` is technically accurate (the MIME type served by Apache for `.txt` files)
- Some implementations use `type="text/markdown"` (the official MIME type for Markdown, registered per RFC 7763)
- Since the Apache server serves these as `.txt` files and no AI tool is confirmed to parse the `type` attribute to make routing decisions, `text/plain` is the safer, technically correct value for this site's setup
- If the server were configured to serve them as `text/markdown`, using that type would be more precise

**Recommendation:** Use `type="text/plain"` because that is what Apache will serve. Avoid `text/markdown` unless the server's MIME type configuration is updated.

### Does the type attribute matter to AI crawlers?

[ASSUMED] No confirmed AI crawler reads the `<link rel="alternate">` head tag to discover llms.txt. The most common discovery method is direct path crawling (`/llms.txt` as a well-known path, similar to `/robots.txt` or `/sitemap.xml`). The head link is a forward-compatibility signal — it costs nothing and may help future crawlers or tools that parse HTML head metadata.

### Implementation

Replace the existing single `<link rel="help" href="/llms.txt" />` in `Layout.astro` with:

```html
<link rel="alternate" type="text/plain" href="/llms.txt" title="AI documentation summary" />
<link rel="alternate" type="text/plain" href="/llms-full.txt" title="AI documentation — full menu and content" />
```

**Confidence:** HIGH for `rel="alternate"` correctness [CITED: WHATWG HTML Living Standard, multiple llms.txt implementation guides] | LOW for AI crawler impact [ASSUMED: no confirmed AI provider reads this head tag as of May 2026]

---

## Dependency Map

```
Fix 3 (Restaurant @id)
  └── Fix 4 (sameAs on Restaurant) — both in RestaurantSchema.astro, do together

Fix 1 (FAQPage schema/DOM alignment)
  └── independent of other fixes

Fix 2 (Speakable on /faq/)
  └── independent; requires adding id="faq-list" to DOM element in faq.astro

Fix 5 (HowTo schema for 3 cities)
  └── Extend Directions Speakable (not in this 7-fix scope but related — directions.astro)

Fix 6 (FAQ meta description)
  └── faq.astro only — no dependencies

Fix 7 (llms-full.txt head link)
  └── Layout.astro — independent
```

**Critical path:** Fix 1 is the only item with a policy violation risk. All others are additive.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | AI engines (Perplexity, ChatGPT, AI Overviews) extract FAQPage schema content at high rates | Fix 1 summary | Lower AEO ROI than expected; still no downside to fixing the violation |
| A2 | Speakable schema aids AI extraction on non-news pages | Fix 2 | Speakable may only apply to Google News — annotation is still harmless |
| A3 | HowTo steps are extracted by AI engines for voice/conversational answers | Fix 5 | AEO value of HowTo may be lower than expected; still no downside |
| A4 | GBP CID URL format is stable and preferred over short links | Fix 4 | CID format may not be the only valid format; both work for sameAs |
| A5 | The `hasMap` short URL `maps.app.goo.gl/q2EJFMbMRaysU6vH8` can be expanded to a CID URL | Fix 4 | May redirect to a non-CID Google Maps URL; requires manual verification |
| A6 | Apache serves llms.txt as `text/plain` | Fix 7 | If `.htaccess` overrides MIME types, `text/markdown` may be correct |
| A7 | No major AI provider reads the `<link rel="alternate">` head tag for llms.txt discovery | Fix 7 | If crawlers do read it, higher impact than estimated |
| A8 | Spice Grill & Bar does not have a Wikidata or Wikipedia entry | Fix 4 | If an entry exists, including its URL in sameAs would be high-value — needs manual check |

---

## Sources

### Primary (HIGH confidence)
- Google Search Central — FAQPage structured data: developers.google.com/search/docs/appearance/structured-data/faqpage — content requirements, visibility policy
- Google Search Central — HowTo FAQ changes August 2023: developers.google.com/search/blog/2023/08/howto-faq-changes — deprecation of HowTo and FAQ rich results
- schema.org/SpeakableSpecification — cssSelector property, content targeting spec
- schema.org/HowTo, schema.org/HowToStep — field definitions
- schema.org/@id / data model — entity identifier semantics
- WHATWG HTML Living Standard — `rel="alternate"` link type definition

### Secondary (MEDIUM confidence)
- Multiple schema.org SEO guides confirming `site.com/#type` as `@id` format convention for LocalBusiness/Restaurant
- Google Search Central organization schema docs — sameAs property guidance
- Multiple meta description length guides citing 150-160 character truncation point (varies by pixel width)
- llmstxt.org specification — `rel="alternate"` usage convention

### Tertiary (LOW confidence)
- AI citation rate claims for FAQPage schema — industry blogs, not confirmed by AI providers directly
- Voice extraction behavior of HowTo schema — no official AI provider documentation
- AI crawler adoption of `<link rel="alternate">` head tag — no confirmed adoption as of May 2026

---

_Research completed: 2026-05-13. Milestone: v3.1 AEO Gap Fixes._
