# PITFALLS — Local Restaurant SEO/GEO/AEO Optimization

**Project**: Spice Grill & Bar — spicegrillbar66.com
**Research Date**: 2026-02-20
**Scope**: GEO, AEO, and schema optimization on an Astro 5 static site with enforced Lighthouse thresholds and pre-push QA hooks.

---

## Overview

This document catalogs the highest-probability mistakes when adding local restaurant SEO, GEO content pages, schema markup, and AEO (AI answer engine optimization) to a fast static site. Each pitfall is grounded in the specific codebase, constraints, and audience of Spice Grill & Bar. Generic SEO advice has been excluded.

---

## Pitfall 1: NAP Inconsistency Across Schema, Markup, and Off-Site Profiles

### What Goes Wrong

Name, Address, and Phone (NAP) data is already scattered across 11 locations in this codebase (`Header.tsx`, `RestaurantSchema.astro`, `Layout.astro`, `LocationSection.astro`, and other schema components — documented in CONCERNS.md). When schema additions expand `areaServed`, add `aggregateRating`, or introduce new `sameAs` profile links, teams frequently update schema fields while leaving natural-language content (FAQ answers, page copy) out of sync.

Current concrete risks in this codebase:

- `RestaurantSchema.astro` uses telephone `(928) 277-1292` (formatted with parentheses)
- `OrganizationSchema.astro` uses telephone `+1-928-277-1292` (E.164 with dashes)
- `faq.json` Q2 states hours as "Monday–Thursday 8:00 AM–9:00 PM, Friday–Sunday 8:00 AM–10:00 PM"
- `RestaurantSchema.astro` states hours as 07:00–22:00 every day (no day-of-week variation)

These are contradictions right now, before any new content is added. Adding 11 more FAQ entries and 4 new pages while this mismatch exists will cause AI engines to encounter conflicting signals about the restaurant's hours and may cause Google to ignore structured data entirely.

### Warning Signs

- Searching `"Spice Grill" "928-277"` returns different phone formats on different pages
- Google Search Console reports "Schema markup could not be parsed" or "Item not eligible for rich results"
- AI engines (Perplexity, ChatGPT) answer hour queries with inconsistent values when prompted about the restaurant
- Running `grep -r "277-1292\|277.1292" src/` returns more than two distinct formats

### Prevention Strategy

1. Before writing any new schema or FAQ content, resolve the hours conflict: decide the canonical hours and update both `RestaurantSchema.astro` `openingHoursSpecification` and the FAQ answer for Q2. These must match exactly.
2. As part of Phase 1 schema work, extract all NAP data to `src/data/business.json` (already recommended in CONCERNS.md). Import from that single file into schema components, FAQ answers, and layout components. This is a prerequisite for safe schema expansion, not a nice-to-have.
3. Validate against Google's Rich Results Test after every schema change. Confirm zero warnings before moving to the next phase.
4. When adding `sameAs` profile URLs (Yelp, TripAdvisor, Google Maps), confirm those profiles list identical address format and phone format. A Yelp listing that shows "928.277.1292" while schema shows `+1-928-277-1292` weakens citation authority.

### Phase Mapping

Phase 1 (Core Schema) — must be resolved before any schema field is added. This is the first task, not a cleanup task.

---

## Pitfall 2: Schema Over-Engineering — Adding Fields That Hurt Rather Than Help

### What Goes Wrong

The planned additions to `RestaurantSchema.astro` include `areaServed` expansion, `geo`, `hasMap`, `OrderAction`, `aggregateRating`, and `containedInPlace`. Each of these is legitimate in isolation, but several failure modes emerge when they are all added at once without validation:

**`aggregateRating` with stale or fabricated data**: If `aggregateRating` is populated from `reviews.json` (the auto-updated GitHub Actions data), and that JSON contains a rating derived from a Gemini API summary rather than a verified review count pulled directly from Google's API, Google will treat this as unverifiable and may suppress the entire Restaurant rich result. Google's structured data guidelines explicitly require that `aggregateRating` values be sourced from aggregated end-user reviews, not editorial summaries.

**`servesCuisine` keyword stuffing**: The current `RestaurantSchema.astro` already lists `"Beer"`, `"Wine"`, `"Soft Drinks"`, and `"Alcoholic Beverages"` as cuisine types. These are not cuisine types — they are beverage categories. `servesCuisine` accepts cuisine descriptors (e.g., `"Indian"`, `"Punjabi"`, `"South Asian"`). Listing beverages here signals to validators that the schema was written to stuff keywords rather than to describe the restaurant accurately. Google's structured data linter will not fail on this, but it degrades the quality signal.

**`containedInPlace` for I-40/Route 66 identity**: This property is intended for physical containment (e.g., a restaurant inside a hotel). Using it to express "located along I-40" is a misuse of the property and could cause validation warnings. The correct approach for corridor identity is `areaServed` with `AdministrativeArea` or `Place` typed objects, plus natural-language content on GEO pages.

**Multiple overlapping schema types on every page**: Currently, `Layout.astro` injects all six schema components (Restaurant, Organization, FAQ, Menu, WebSite, Breadcrumb) on every page. When four new pages are added (`/about/`, `/directions/`, `/near-grand-canyon/`, `/route-66-dining/`), the FAQ schema (with all 20 questions) and Menu schema (with all menu items) will appear on pages where they are irrelevant. Google can handle this, but it creates noise and may cause the FAQ rich result to compete with itself across multiple URLs.

### Warning Signs

- Google Search Console "Enhancements" tab shows Restaurant or FAQ items with warnings (not just errors)
- Rich Results Test shows yellow warnings on `aggregateRating` citing "not enough reviews" or "review count mismatch"
- Schema validator flags `servesCuisine` values as non-cuisine strings
- Multiple page URLs appear in Search Console for the same FAQ rich result

### Prevention Strategy

1. Remove beverage categories from `servesCuisine` immediately. Keep only: `"Indian"`, `"Punjabi"`, `"Vegetarian Friendly"`, `"Vegan Friendly"`. Note beverage availability in `menu` and natural-language copy instead.
2. Do not add `aggregateRating` unless the rating count is pulled directly from a verifiable source (Google Places API or a manually verified snapshot with a documented date). If using `reviews.json`, document the exact source URL and confirm the count matches what appears on the Google Business Profile listing today. Do not derive a rating from the Gemini-summarized content.
3. Do not use `containedInPlace` for Route 66 or I-40 identity. Use `areaServed` with properly typed `Place` objects and rely on GEO page copy for corridor identity signals.
4. For new content pages, scope schema injection in `Layout.astro`. Pass page-specific flags as props (e.g., `showFAQSchema`, `showMenuSchema`) so `/near-grand-canyon/` does not emit the full FAQ and Menu JSON-LD. This keeps each page's schema relevant.
5. Add schema validation to the CI pipeline: run Google's Structured Data Testing API or a local `schema-dts` type-check as part of `npm run test:quality`. Currently there is no automated schema output validation (documented gap in CONCERNS.md).

### Phase Mapping

Phase 1 (Schema) — validate and clean existing schema before adding new fields. New page schema scoping is a prerequisite for Phase 1C content pages.

---

## Pitfall 3: FAQ Content Patterns That AI Engines Flag as Keyword Stuffing

### What Goes Wrong

Expanding from 9 to 20 FAQ questions targeting route and highway queries is the right strategy. The failure mode is writing FAQ answers that pack location terms, highway numbers, and landmark names into every sentence rather than writing direct, factual answers.

AI engines (ChatGPT, Perplexity, Google AI Overviews) cite content that reads as authoritative and factual — the way a knowledgeable local would answer a direct question. They do not cite content that reads like it was written to rank for keywords. The distinction is subtle but measurable:

**Harmful pattern** (reads as keyword stuffing to AI engines):

> "Spice Grill & Bar, located at I-40 Exit 146 in Ash Fork, Arizona on Route 66 near the Grand Canyon, is approximately 70 miles from the Grand Canyon South Rim on I-40 in Arizona, making it the closest authentic Indian restaurant near Grand Canyon Arizona on Interstate 40."

**Citation-worthy pattern** (factual, extractable, natural):

> "Spice Grill & Bar is approximately 70 miles from the Grand Canyon South Rim — about a 1-hour drive west on I-40. Take Exit 146 off I-40; the restaurant is directly at the exit."

The second answer is shorter, contains no repeated terms, and gives the AI engine a single clean extractable fact (70 miles, 1 hour, Exit 146). The first answer contains the same information repeated three times with minor variation — AI engines are trained on human writing and recognize this pattern as low-quality.

**FAQ answer length**: The current 9 FAQ answers average 35–45 words. This is appropriate. Adding route-specific questions with answers that balloon to 150+ words trying to capture every variation of the query ("near Grand Canyon", "Grand Canyon area", "Grand Canyon South Rim") will cause the answers to be passed over in favor of shorter, more direct sources.

**Question formulation**: Questions must mirror how road-trippers and locals actually phrase queries to AI assistants. They use conversational, spoken language, not SEO keyword phrases. "Is Spice Grill & Bar a good stop on I-40?" is how someone actually speaks to Siri or ChatGPT. "Best Indian restaurant I-40 Arizona pitstop" is a search engine query, not a conversational question, and should not be used as a FAQ question heading.

### Warning Signs

- FAQ answers exceed 80 words and contain the restaurant name, city, and highway number more than twice each
- Questions are phrased as keyword strings rather than natural questions (missing a question word or full sentence structure)
- `npm run test:aeo` flags answers as too long or too keyword-dense (if the AEO audit script checks for these patterns)
- AI engines, when prompted with the exact question, do not cite the site's answer and instead cite a competitor or generic source

### Prevention Strategy

1. Write each new FAQ answer with a single primary fact stated in the first sentence. Supporting detail follows. Maximum 60 words per answer for route/distance questions. Maximum 80 words for complex operational questions.
2. Answer questions the way the restaurant owner would answer them verbally. Read the answer aloud. If it sounds like it was written for a search engine, rewrite it.
3. Do not repeat the restaurant name, city name, or highway number more than once per answer. The schema provides the structured location data; the FAQ answer only needs to provide the fact.
4. Add at least 3 questions specifically for voice search phrasing (first-person or "I" questions): "What's a good place to eat when driving through Arizona on I-40?" is more valuable than "I-40 Arizona food stop" as a question format.
5. Avoid answering questions with comparative superlatives ("the best", "the only", "the most authentic") unless you can directly substantiate the claim. AI engines are calibrated to reduce hallucination and will often not cite claims they cannot independently verify.

### Phase Mapping

Phase 1B (FAQ expansion) — applies to all 11 new FAQ entries. Review against this standard before committing `faq.json`.

---

## Pitfall 4: GEO Content Pages That Are Thin or Duplicate

### What Goes Wrong

The four planned GEO content pages (`/about/`, `/directions/`, `/near-grand-canyon/`, `/route-66-dining/`) must each provide unique, substantial content. The common failure is creating pages that essentially restate the home page content with different headings and a few location-specific sentences added.

Google's Helpful Content system penalizes thin, template-generated pages even when they have valid schema markup. More critically for AEO, AI engines do not cite pages that lack extractable, specific facts. A `/near-grand-canyon/` page that says "We are about an hour from the Grand Canyon!" is not citable. A page that provides specific driving distances, turn-by-turn context at Exit 146, parking notes, and what to order before a long drive has extractable content an AI can cite.

Specific thin-content risks for each planned page:

- **`/about/`**: Repeating `OurStorySection.astro` content verbatim. The about page must add information not on the home page: founding story details, chef background, sourcing philosophy, or community ties. If it is just the home page section re-wrapped in a new URL, it is thin content.
- **`/directions/`**: Listing cities (Las Vegas, Los Angeles, Kingman, Phoenix, Flagstaff) with generic "take I-40 East" instructions is low-value. High-value directions content includes: exact driving time at typical highway speed, the last fuel/food option before Exit 146 from each direction, what landmarks are visible near the exit, and what to do if arriving after closing time (nearby alternatives, so the page is genuinely helpful rather than self-promotional).
- **`/near-grand-canyon/`**: This page is particularly at risk of being thin because the connection between the restaurant and the Grand Canyon is a distance relationship, not a direct relationship. The page must be substantive: specific distance and drive time, why this stop makes sense for Grand Canyon itineraries, what menu items travel well for picnic scenarios, how it compares to dining options inside the park (which are limited and expensive). Without specific facts, it reads as a keyword-targeting page, not helpful content.
- **`/route-66-dining/`**: Route 66 history content that is not specifically connected to Ash Fork and the restaurant risks being generic. If the content about Route 66 could appear on any Route 66 business's website without changing a word, it is thin.

### Warning Signs

- Any new page shares more than 40% of its text content with the home page or another new page
- Pages contain fewer than 300 words of unique body content
- Lighthouse SEO score drops on the new pages (can indicate thin/duplicate content signals, though Lighthouse does not directly measure content quality)
- Google Search Console shows new pages indexed but with no impressions after 30+ days (suggests content quality assessment failed)

### Prevention Strategy

1. Before writing any GEO page, list 5–8 specific facts that page will contain that appear nowhere else on the site. If you cannot list them, the page is not ready to be written.
2. Every GEO page must contain at least one piece of content that a road-tripper would find genuinely useful: a specific distance, a specific time, a specific operational detail. Useful content gets cited; promotional content does not.
3. Use Astro's `Layout.astro` props (`title`, `description`) to write page-specific meta titles and descriptions for each new page. Do not use the default Layout title/description. The current default description "Authentic Indian Punjabi cuisine on historic Route 66..." must not appear on GEO sub-pages — it signals to crawlers that these pages have the same content as the home page.
4. Cross-link between GEO pages using specific anchor text (not generic "click here" or "learn more"). `/near-grand-canyon/` should link to `/directions/` with the anchor text matching a natural sentence about getting there.
5. Do not create all four pages simultaneously and deploy at once. Create, validate (Rich Results Test, manual content review), and deploy one page at a time so any Lighthouse or schema regression is immediately attributable.

### Phase Mapping

Phase 1B (GEO content pages) — apply the 5-unique-facts test before writing each page. Apply the 300-word minimum before committing.

---

## Pitfall 5: Lighthouse Score Regression When Adding New Pages

### What Goes Wrong

The Lighthouse CI configuration (`.lighthouserc.json`) currently only audits the home page (`"url": ["/"]`). This means any new page can have poor performance, accessibility violations, or missing SEO metadata without triggering the CI quality gate. The pre-push hook runs `npm run qa` which includes `test:lhci` — but only against `/`. Adding four new pages with unoptimized images, missing `alt` attributes, or render-blocking resources will ship to production without detection.

Specific regression vectors for the new pages:

**Images**: GEO content pages may include photos (restaurant exterior, Ash Fork photos, Route 66 imagery). If these are added as `<img>` tags without `width`/`height` attributes, CLS will spike. If they are not converted to WebP with responsive `srcset`, LCP will increase. The home page currently uses `.webp` images (visible in `RestaurantSchema.astro` image field); new pages must follow the same pattern.

**Google Maps on `/directions/`**: The `/directions/` page will almost certainly embed or link to the Google Maps component. The current `GoogleMap.tsx` implementation has a 200px `rootMargin` on its Intersection Observer (documented in CONCERNS.md as potentially aggressive). On a page where the map is a primary feature rather than a supplementary one, this behavior is appropriate — but it means the map may load earlier than on the home page, potentially impacting TBT if the Maps API script executes on the main thread.

**Schema JSON-LD payload size**: Adding `aggregateRating`, expanded `areaServed` arrays, and `OrderAction` to `RestaurantSchema.astro` increases the inline JSON-LD payload. This is rendered server-side by Astro (zero JS cost), but it increases HTML document size. On a slow connection, a significantly larger document contributes to LCP if it delays the first paint.

**Accessibility on new pages**: The `faq.astro` page uses `h3` for FAQ questions rendered in a `div`, skipping from `h1` directly to `h3` with no `h2` in between. This accessibility violation is not caught by the current CI (only auditing `/`). New GEO pages must use a proper heading hierarchy: `h1` for the page title, `h2` for major sections, `h3` for subsections. An accessibility score below 90 blocks deployment per the current thresholds — but only if those pages are added to the Lighthouse CI audit list.

**`ClientRouter` view transitions**: `Layout.astro` uses Astro's `ClientRouter` for view transitions. Adding new pages with heavy image loads or complex DOM structures may cause CLS during page transitions in addition to initial load CLS.

### Warning Signs

- New pages are not added to `.lighthouserc.json` `url` array before deployment
- `npm run build` succeeds and `npm run test:lhci` passes, but new pages were not included in the audit
- Images on new pages lack `width` and `height` attributes (check with browser DevTools Layout panel showing CLS highlights)
- Heading hierarchy checker (browser extension or `axe`) shows heading level skips on new pages
- Build time increases significantly after adding new pages (may indicate unoptimized assets being processed)

### Prevention Strategy

1. **Immediately add each new page URL to `.lighthouserc.json`** when the page is created. The `url` array should expand from `["/"]` to include `"/about/"`, `"/directions/"`, `"/near-grand-canyon/"`, `"/route-66-dining/"` as they are created. This is a non-negotiable gate.
2. All images on new pages must follow the same pattern as the home page: WebP format, explicit `width` and `height`, `loading="lazy"` for below-fold images, `loading="eager"` for the hero/above-fold image.
3. Enforce the heading hierarchy rule in CLAUDE.md: every Astro page must have exactly one `h1`, and subsequent sections must use `h2` before `h3`. The existing `faq.astro` heading violation should be fixed as part of Phase 1 to establish a clean baseline.
4. Before committing any new page, run `npm run build && npm run test:lhci` locally with the new page added to the `.lighthouserc.json` URL list. Do not rely solely on the pre-push hook — catch regressions before the hook runs.
5. For the `/directions/` page specifically: evaluate whether the Google Maps component should be used at all, or whether a static map image with a link to Google Maps is more appropriate. A static image has zero TBT impact; the lazy-loaded iframe has potential main-thread cost at intersection.

### Phase Mapping

Phase 1B (new pages) — update `.lighthouserc.json` as the very first step when creating each new page, before any content is written.

---

## Pitfall 6: Schema Placed on Wrong Pages or Duplicated Incorrectly

### What Goes Wrong

Currently all six schema components are injected by `Layout.astro` on every page. This means the full `FAQSchema` (with all 20 FAQ entries after expansion) and full `MenuSchema` (with all menu items) will appear on `/near-grand-canyon/`, `/route-66-dining/`, and every other new page. This is not immediately harmful — Google can handle schema on pages where it is not the primary content — but it creates two specific risks:

**FAQ rich result dilution**: Google will select a canonical URL for FAQ rich results. If the same FAQ schema appears on 6 URLs, Google must choose which URL to surface. It will typically choose the home page or `/faq/`, but the split signal weakens the overall FAQ rich result performance. After expanding to 20 FAQ questions, the value of this schema is higher, and dilution matters more.

**`BreadcrumbSchema` generates incorrect labels for new pages**: The current `BreadcrumbSchema` component in `Layout.astro` generates the second breadcrumb label by stripping slashes from the path and capitalizing the first character. For `/near-grand-canyon/`, this produces "Near-grand-canyon" — not "Near Grand Canyon". For `/route-66-dining/`, it produces "Route-66-dining". These malformed breadcrumb labels appear in Google Search results under the URL, and they also appear as the `item.name` in `BreadcrumbListElement` schema. This is a guaranteed regression when new pages are added.

### Warning Signs

- Google Search Console shows FAQ rich results appearing for home page, `/faq/`, and new GEO pages simultaneously with inconsistent question sets
- Rich Results Test on `/near-grand-canyon/` shows FAQ schema with questions unrelated to that page's content
- Google Search results show "Near-grand-canyon" or "Route-66-dining" as breadcrumb text under the URL (check via site: search operator)
- Schema validators flag `BreadcrumbListElement` name values containing hyphens where spaces are expected

### Prevention Strategy

1. Refactor `Layout.astro` to accept schema control props: `showFAQSchema` (default `true` only on `/` and `/faq/`), `showMenuSchema` (default `true` only on `/`). Pass `false` for these props in the new GEO page templates.
2. Fix `BreadcrumbSchema` label generation before creating new pages. The current logic (`currentPath.replace(/\//g, '').charAt(0).toUpperCase() + currentPath.replace(/\//g, '').slice(1)`) does not handle hyphens. Either pass a human-readable `breadcrumbLabel` prop from each page, or implement a proper slug-to-label converter that replaces hyphens with spaces and title-cases each word.
3. Verify breadcrumb output for every new page in Rich Results Test before deployment.

### Phase Mapping

Phase 1B (new pages) — fix `BreadcrumbSchema` before creating the first new page. Refactor schema props in `Layout.astro` as part of Phase 1C (schema improvements), not as an afterthought.

---

## Pitfall 7: Off-Site NAP and `sameAs` Profiles Blocking Schema Completion

### What Goes Wrong

`OrganizationSchema.astro` needs Yelp, TripAdvisor, and Google Maps profile URLs added to the `sameAs` array. The PROJECT.md documents this as a blocker: "Schema URLs needed: `sameAs` links for Yelp, TripAdvisor, Google Maps must be provided before Phase 1 schema work is considered complete."

The risk is not waiting for these URLs — it is proceeding with partial `sameAs` and shipping an incomplete schema, then forgetting to add the remaining URLs later. A `sameAs` array with only Facebook and Instagram (current state) is fine. A `sameAs` array with a placeholder or incorrect URL (e.g., a Yelp search page instead of the actual business listing) actively harms citation authority because Google checks that the linked profiles exist and reference the same business.

Additionally, when the off-site profiles (Yelp, TripAdvisor, GBP) are updated with I-40/Route 66 corridor keywords as part of Phase 1D, there is a lag before those platforms re-index. If `sameAs` links are added to schema immediately but the profiles have not yet been updated with consistent NAP and keywords, the linked profiles may temporarily show different business information than the site schema.

### Warning Signs

- `sameAs` array in `OrganizationSchema.astro` contains placeholder text or a search URL rather than a direct business listing URL
- Yelp/TripAdvisor profiles linked in `sameAs` show a different phone number or address format than the schema
- Google's Rich Results Test shows a warning on `sameAs` property (uncommon but occurs when linked URLs return 404 or are blocked)

### Prevention Strategy

1. Do not add `sameAs` URLs until the off-site profiles have been verified as claimed, accurate, and consistent with site NAP. Verify each URL manually (open it, confirm the business name, address, and phone match exactly).
2. After adding `sameAs` URLs, run the Rich Results Test and confirm no warnings on linked entities.
3. Treat `sameAs` expansion and off-site profile optimization (Phase 1D) as a single atomic unit: both must be done together, not sequenced with a gap between them.

### Phase Mapping

Phase 1C/1D boundary — do not ship `sameAs` additions until Phase 1D off-site work is complete or confirmed current.

---

## Pitfall 8: Conventional Commit Hook Friction Causing Quality Shortcuts

### What Goes Wrong

The pre-push hook runs `npm run qa` (full build + `test:quality` + `test:lhci`). This is a strong quality gate. The failure mode is not the hook itself — it is the frustration it creates when iterating on content and schema changes, leading to workarounds.

Specific risks:

- Developers building four new GEO pages simultaneously may batch-commit all four pages at once to avoid running the full QA cycle four times. This makes it impossible to attribute a Lighthouse regression to a specific page or change.
- `test:lhci` runs three Lighthouse audits (`numberOfRuns: 3`) against the built `dist/`. If the new pages are not in `.lighthouserc.json`, the CI passes trivially while new pages have regressions.
- The `knip` tool (run as part of `test:quality`) will flag new Astro component files that are imported but not exported if the project conventions require explicit exports. New page components must follow the same import/export patterns as existing pages.

### Warning Signs

- Commits contain more than one new page in a single commit with message "add GEO pages"
- `test:lhci` passes but no new URLs were added to `.lighthouserc.json`
- `npm run test:quality` fails due to `knip` on a new component file after the pre-push hook runs (causes repeated commit attempts)

### Prevention Strategy

1. Create and validate each GEO page in its own branch and commit sequence. Merge one page at a time.
2. Add each new page URL to `.lighthouserc.json` in the same commit that creates the page file — not as a follow-up commit.
3. Run `npm run test:quality` locally before `git push` during heavy content-iteration phases to catch `knip` and lint errors before the hook fires.
4. Document in CLAUDE.md that new pages require a `.lighthouserc.json` URL entry as a checklist item during page creation.

### Phase Mapping

Phase 1B and throughout — process discipline, not a one-time fix.

---

## Summary: Phase-Ordered Pitfall Prevention Checklist

| Phase                | Before Starting                                      | Risk If Skipped                                                               |
| -------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| Phase 1 (Schema)     | Resolve FAQ hours vs. schema hours conflict          | AI engines cite contradictory hours; schema warnings                          |
| Phase 1 (Schema)     | Extract NAP to `business.json`                       | Hours/phone inconsistency compounds as new content adds more hardcoded values |
| Phase 1A (Discovery) | Do not add `sameAs` until off-site profiles verified | Schema points to wrong/inconsistent profiles                                  |
| Phase 1B (FAQ)       | Write answers as spoken facts, max 60–80 words       | AI engines skip verbose, keyword-dense answers                                |
| Phase 1B (Pages)     | List 5 unique facts per GEO page before writing      | Thin content, no AI citations, possible Google quality penalty                |
| Phase 1B (Pages)     | Fix `BreadcrumbSchema` label generation              | Malformed labels in search results on every new page                          |
| Phase 1B (Pages)     | Add each new page to `.lighthouserc.json`            | Regressions ship undetected; QA gate becomes meaningless                      |
| Phase 1C (Schema)    | Remove non-cuisine values from `servesCuisine`       | Schema quality signal degraded                                                |
| Phase 1C (Schema)    | Scope schema by page (FAQ, Menu not on GEO pages)    | FAQ rich result dilution; irrelevant schema on content pages                  |
| Phase 1C (Schema)    | Verify `aggregateRating` source before adding        | Google suppresses rich result if rating is unverifiable                       |
| Throughout           | One page per commit with its own Lighthouse entry    | Unable to attribute regressions; QA gate trivially bypassed                   |

---

_Research complete: 2026-02-20_
