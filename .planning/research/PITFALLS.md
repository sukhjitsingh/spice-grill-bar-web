# Pitfalls Research — v3.1 AEO Gap Fixes

**Project**: Spice Grill & Bar — spicegrillbar66.com
**Research Date**: 2026-05-13
**Scope**: v3.1 milestone — 7 AEO compliance gaps: FAQPage schema/DOM fix, Speakable on /faq/, @id + sameAs on RestaurantSchema, HowTo schema on /directions/, extended Speakable on /directions/, llms-full.txt head link rel fix.
**Confidence**: HIGH (Google deprecation status verified via multiple current sources; schema.org spec and existing codebase read directly)

---

## Critical Context Before Reading This Document

**FAQPage rich results are gone as of May 7, 2026.** Google dropped the expandable Q&A dropdown from SERPs entirely. HowTo rich results were removed in September 2023. These deprecations do NOT mean the schemas are worthless — AI engines (Perplexity, ChatGPT Search, Gemini, Google AI Overviews) continue to parse FAQPage and HowTo structured data as primary extraction sources. Pages with FAQPage schema are cited by AI Overviews at 3.2x the rate of pages without it. The value proposition has shifted from visual SERP decoration to AI answer engine extraction — which is exactly the AEO goal. Keep the schemas; fix the gaps.

**The existing codebase has one key quirk:** `Layout.astro` injects FAQSchema (all 34 Q&As from faq.json) on both `/` and `/faq` via a path condition on line 121. The home page DOM only renders 8 curated questions. That mismatch is the core problem v3.1 fixes.

---

## Fix 1: FAQPage schema/DOM fix

**The problem being fixed:** The current `FAQSchema.astro` injects all 34 questions on the home page, but the DOM only shows 8 curated questions (`#home-faq`). Google's content policy for structured data requires that all items in the schema be visible and readable on the page.

### Pitfall 1-A: Restricting FAQSchema to /faq only removes the home page AI extraction signal

**What goes wrong:** If you simply remove `||` `currentPath === '/'` from Layout.astro's condition, the home page loses all structured FAQ data. The 8-question `#home-faq` DOM section is rich voice-query material ("hours", "location", "Grand Canyon distance") — removing schema from it surrenders the AI-citation signal for those high-value queries.

**Why it happens:** The fix instinct is "mismatch → remove schema from home page." But the correct fix is a page-specific 8-question schema on the home page separate from the 34-question schema on /faq. The FAQSchema component currently reads all 34 entries unconditionally — it does not accept a prop for a filtered subset.

**How to avoid:** The home page already has a mechanism for selecting 8 entries (`homeFaqIndices` array in `index.astro`). The fix requires either:
- (A) Refactoring FAQSchema.astro to accept an optional `questions` prop and passing `homeFaq` from `index.astro`, or
- (B) Adding a page-level inline schema block in `index.astro` (same pattern already used in `directions.astro` for 3 direction questions) that lists only the 8 visible questions.

Option B is lower-risk and consistent with the established codebase pattern.

**Warning signs:**
- FAQSchema is still injecting all 34 Q&As on `/` after the fix → check `Layout.astro` condition still routes to home and verify the script block.
- The 8-question count in home page schema does not match `homeFaqIndices.length` → a maintenance burden if indices change.

**CI gate impact:** The existing aeo-audit.mjs does NOT validate FAQ schema content against DOM — it only counts faq.json entries. No gate breaks from this fix. But if the home page loses FAQSchema entirely, no gate currently catches that regression.

### Pitfall 1-B: Schema answer text must exactly match DOM text

**What goes wrong:** Google's structured data content policy states the schema text must match what is visible to users on the page. If you construct the home page inline schema by copy-pasting answer text manually (instead of reading from faq.json), any future edit to faq.json will create drift — the DOM updates but the hardcoded schema does not.

**How to avoid:** If using Option B (inline script in index.astro), read the question/answer data from `faqData` at render time using the same `homeFaqIndices` array. Use Astro's server-rendered `<script>` slot or a `<script type="application/ld+json" set:html={...}>` block that serializes `homeFaq` — not hardcoded strings.

**Warning sign:** Hardcoded Q&A text in a `<script type="application/ld+json">` block that is not derived from faq.json at build time.

### Pitfall 1-C: Duplicate FAQPage blocks on the same URL

**What goes wrong:** If Layout.astro still injects FAQSchema on `/` AND index.astro also adds an inline FAQPage block, the page will have two `@type: FAQPage` blocks. Google validates this as a "Duplicate field" error in Rich Results Test.

**How to avoid:** The Layout.astro condition must be changed so FAQSchema is NOT injected on `/` (faq.json all-34 version) once the home page has its own 8-question inline schema. The condition should become `currentPath.startsWith('/faq')` only — removing the `currentPath === '/'` branch entirely.

**Phase that must address this:** Layout.astro condition change and index.astro inline schema addition must happen in the same commit. Do not ship one without the other.

---

## Fix 2: Speakable on FAQ page

**The problem being fixed:** `/faq/` renders all 34 Q&As visibly but has zero Speakable annotation. AI extraction engines use Speakable markers to identify the most extractable passages.

### Pitfall 2-A: Speakable cssSelector that matches FAQPage question+answer vs just questions

**What goes wrong:** The FAQ page DOM structure is:
```
div.bg-surface-container > h2 (question) + p (answer)
```
There are no unique IDs on individual FAQ items. If you target `.bg-surface-container h2` or `.bg-surface-container p`, you capture all 34 questions and 34 answers — roughly 2,000–5,000 words of content. Speakable content should be 20–30 seconds of speech per section (approximately 2–3 sentences).

Targeting 68 elements with a single Speakable selector gives AI engines no priority signal — everything is equally "speakable," which means the selector is functionally the same as having none.

**How to avoid:** For the FAQ page, Speakable works better as a WebPage-level signal pointing to a summary introduction paragraph (if one exists) rather than the entire Q&A grid. Alternatively, add `id="faq-intro"` or a dedicated `.speakable-intro` class to an introductory paragraph above the FAQ list, and target that instead.

If the goal is making the Q&A answers individually extractable, the FAQPage schema itself already serves that purpose for AI engines — a Speakable selector adding all 34 answers is redundant and dilutes the signal.

**Recommended approach:** Add a brief 2–3 sentence intro paragraph to `faq.astro` above the Q&A list with a `speakable-intro` class. Target only that paragraph in SpeakableSpecification. This gives voice engines a clean summary without duplicating all 34 answers.

### Pitfall 2-B: Two @type:WebPage blocks on the same page

**What goes wrong:** Speakable is placed on a `@type: WebPage` JSON-LD block. The FAQSchema on /faq is `@type: FAQPage`. These are different types — no duplicate-type conflict. However, if directions.astro's pattern is copied verbatim (which uses a WebPage block), you need to ensure only one WebPage block exists on the page.

The current faq.astro has no existing WebPage block. Adding one for Speakable is safe as long as nothing else in Layout.astro also injects a WebPage type. Currently Layout.astro does not — safe to add.

**Warning sign:** Any other component injecting `@type: WebPage` — run a grep before adding.

### Pitfall 2-C: Speakable on FAQPage is still BETA

**What goes wrong:** The Speakable spec remains in Google BETA status. There is no formal guarantee of how Google or other AI engines use it. Adding it is low-risk (no penalties documented), but expectations must be calibrated: it signals extractable passages, it does not guarantee voice assistant reading.

**How to avoid:** Add it for the AI-extraction signal value, not as a hard requirement. Do not build aeo-audit.mjs gates around Speakable presence — the signal value is not measurable in the audit.

---

## Fix 3: @id + sameAs on RestaurantSchema

**The problem being fixed:** RestaurantSchema.astro has no `@id` field and no `sameAs`. OrganizationSchema already has `sameAs` (5 URLs: Google Maps, Yelp, TripAdvisor, Facebook, Instagram). Both schemas describe the same real-world entity — without `@id` cross-referencing, knowledge graph parsers treat them as two different entities.

### Pitfall 3-A: Wrong @id format — @id must be a stable URI, not the homepage URL alone

**What goes wrong:** Using `"@id": "https://spicegrillbar66.com"` is ambiguous — it is the same value as `"url"`. Best practice is to use a fragment identifier that namespaces the entity type:

```json
"@id": "https://spicegrillbar66.com/#restaurant"
```

This makes the identifier unique to the Restaurant entity, distinguishable from the Organization entity which should be:

```json
"@id": "https://spicegrillbar66.com/#organization"
```

If both use `"@id": "https://spicegrillbar66.com"` (no fragment), knowledge graph parsers may merge them into one node or throw a conflict warning. Both schemas are injected on every page — the parser sees them on every URL, making a unique fragment essential.

**How to avoid:** Use `#restaurant` fragment in RestaurantSchema.astro and `#organization` fragment in OrganizationSchema.astro. Cross-reference them via `"parentOrganization": { "@id": "https://spicegrillbar66.com/#organization" }` in RestaurantSchema if desired (optional, adds relationship clarity).

**Warning sign:** Both schemas have identical `@id` values, or neither has a fragment.

### Pitfall 3-B: sameAs URLs that return 4xx or redirect — crawlers treat them as broken entity links

**What goes wrong:** The existing OrganizationSchema sameAs URLs include:
- `https://maps.app.goo.gl/q2EJFMbMRaysU6vH8` — Google Maps short link (may redirect)
- `https://www.yelp.com/biz/spice-grill-and-bar-ash-fork` — must match the canonical Yelp URL exactly
- `https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html` — TripAdvisor canonical URL

If any of these URLs 404 or redirect with a 301, knowledge graph parsers following `sameAs` links encounter broken pointers and may drop the entity disambiguation signal.

**How to avoid:** Before duplicating these URLs into RestaurantSchema, verify each one returns 200 in a browser. The Google Maps short link `maps.app.goo.gl` does redirect — short link redirects are generally acceptable for sameAs (parsers follow them), but canonical long URLs are preferred. The TripAdvisor URL contains the restaurant ID `d33218710` — verify that ID is still active.

**Warning sign:** Copy-paste the sameAs array from OrganizationSchema into RestaurantSchema without verification. Stale Yelp or TripAdvisor URLs are the most common failure.

### Pitfall 3-C: sameAs duplication across Restaurant and Organization — is it a conflict?

**What goes wrong:** If RestaurantSchema adds the same `sameAs` array as OrganizationSchema, both schemas on every page point to the same 5 external URLs. Schema.org `sameAs` is intended to be per-entity — duplicating it across two schema types representing the same physical entity is not formally wrong, but it is redundant.

**Recommended approach:** The `@id` cross-reference between Restaurant and Organization handles entity disambiguation within the site's graph. The `sameAs` URLs on RestaurantSchema are the higher-value placement because `Restaurant` (a more specific subtype) is a stronger AEO signal for local business queries than `Organization`. Adding sameAs to Restaurant in addition to (not instead of) Organization is fine — no conflict.

The only real risk is if OrganizationSchema's `@id` is not set: then the two schemas cannot cross-reference and both remain as independent entities. Fix `@id` in both schemas in the same commit.

---

## Fix 4: HowTo schema

**The problem being fixed:** `/directions/` has step-by-step driving instructions for 7 cities — exactly the content HowTo schema is designed for — but no HowTo markup exists.

### Pitfall 4-A: HowTo is deprecated for Google rich results — do not conflate deprecation with worthlessness

**What went wrong in 2023:** Google removed HowTo rich results (the step-by-step visual cards in SERPs) in September 2023. This is commonly misread as "HowTo schema is dead." It is not — it remains a valid Schema.org type and AI engines parse it as a structured signal for procedural queries ("how do I get from X to Y").

**Impact for this fix:** HowTo schema on /directions/ still provides AI extraction value. The milestone targets 3 cities (Flagstaff, Williams, Las Vegas). Implement it for the signal value, not for SERP rich results.

### Pitfall 4-B: Required fields — "name", "step" with "text" are the minimum; "supply" and "tool" are optional

**What goes wrong:** Many HowTo implementations fail Google validation because they omit required step-level fields or include "supply" and "tool" at the top level without step context. The minimal valid HowTo for driving directions:

```json
{
  "@type": "HowTo",
  "name": "How to drive from Flagstaff to Spice Grill & Bar",
  "step": [
    {
      "@type": "HowToStep",
      "text": "Take I-40 West from Flagstaff toward Kingman. Drive 51 miles.",
      "name": "Get on I-40 West"
    },
    {
      "@type": "HowToStep",
      "text": "Take Exit 146 (Ash Fork / Historic Route 66).",
      "name": "Take Exit 146"
    },
    {
      "@type": "HowToStep",
      "text": "Turn right onto Lewis Ave. Spice Grill & Bar is at 33 Lewis Ave on your right.",
      "name": "Arrive at destination"
    }
  ]
}
```

`supply` and `tool` are optional — omitting them does not break validation or prevent AI parsing. Do not add them for driving directions (there are no consumable supplies or tools in this context; forcing them in would be semantically incorrect and would confuse AI engines).

**Warning sign:** Adding `"supply": []` or `"tool": []` as empty arrays — empty arrays cause validation warnings in some tools and add no value.

### Pitfall 4-C: HowTo step text must match the DOM paragraph text closely

**What goes wrong:** If the HowTo `step.text` values are paraphrased versions of the DOM paragraph text rather than the same text, voice assistants reading the HowTo steps will give different information than what a sighted user reads. This is the same DOM-schema mismatch problem that affects FAQPage.

**How to avoid:** The directions.astro DOM paragraph for Flagstaff reads: "From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes) and take Exit 146 (Ash Fork / Historic Route 66). Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right."

The HowTo steps should be derived from this exact text, broken into logical steps, not rewritten. The `name` field of each HowToStep can be a short label not in the DOM (e.g., "Get on I-40 West"), but `text` should mirror the DOM content.

### Pitfall 4-D: Three separate HowTo blocks or one combined block?

**What goes wrong:** Placing all three city HowTo schemas in one `<script type="application/ld+json">` block as an array (`[{...}, {...}, {...}]`) is technically invalid — JSON-LD expects a single root node or a `@graph` container. Using a `@graph` array is the correct pattern if combining schemas in one block.

**How to avoid:** Either:
- Three separate `<script type="application/ld+json">` blocks, one per city (clean, no @graph complexity), or
- One block with `"@graph": [ HowTo1, HowTo2, HowTo3 ]`

The separate blocks approach is simpler and consistent with how directions.astro already handles its inline FAQ and Speakable as two separate blocks.

**Warning sign:** A JSON array `[{...}, {...}]` as the root of a JSON-LD block (invalid) instead of `{"@graph": [{...}, {...}]}`.

---

## Fix 5: Speakable CSS selectors (Directions)

**The problem being fixed:** Current Directions Speakable targets only `.speakable-heading`, `.speakable-lead`, `.speakable-exit` (the intro section). The per-city sections (7 `<section id="flagstaff">`, `<section id="williams">` etc.) are not covered, meaning voice engines can only extract the generic intro, not the city-specific directions.

### Pitfall 5-A: Google's Speakable cssSelector support for compound selectors — the key question

**What goes wrong:** The official Google Speakable documentation shows simple class selectors (`.headline`, `.summary`). The existing codebase already uses `#home-faq h3` and `#home-faq p` (ID + tag descendant selectors) on the home page — these are compound selectors and they have been working. However, Google's documentation does not explicitly confirm which CSS selector complexity levels are supported.

**Verified behavior in this codebase:** The home page uses `"#home-faq h3"` and the near-grand-canyon page uses `".speakable-heading"`, `".speakable-lead"`, `".speakable-hours"`. Both patterns are in production with no known validation errors.

**For Directions city sections:** The safest approach is to add a class (e.g., `speakable-city-heading`, `speakable-city-directions`) to the per-city h2 and p elements, mirroring the near-grand-canyon pattern. This avoids compound selectors entirely.

**Alternatively:** `"#flagstaff p"`, `"#williams p"`, `"#las-vegas p"` — ID + descendant tag selectors. This mirrors the home page pattern and avoids adding new CSS classes.

**Recommended:** Use the class-based approach (`speakable-city-heading`, `speakable-city-directions`) for the 3 targeted cities (Flagstaff, Williams, Las Vegas) only. This is explicit, selector-stable, and consistent with the near-grand-canyon page pattern.

### Pitfall 5-B: Speakable content length — 7 city sections is too much

**What goes wrong:** If the Speakable selector targets all 7 city direction paragraphs, the speakable content becomes 7 × ~50 words = ~350 words. Google recommends 20–30 seconds per speakable section (roughly 2–3 sentences / 40–60 words per selector). Targeting all 7 is too broad.

**How to avoid:** The milestone requirement explicitly targets 3 cities (Flagstaff, Williams, Las Vegas). This is the right scope. Add `speakable-city-directions` class only to those 3 paragraphs.

**Warning sign:** Adding speakable annotations to all 7 city sections "while we're at it" — this dilutes the signal and exceeds the recommended content volume.

### Pitfall 5-C: Selector stability — class names survive TailwindCSS utility renames but are invisible to CSS

**What goes wrong:** Classes like `speakable-city-heading` are not TailwindCSS utilities — they are custom semantic classes added purely for selector targeting. They do not need to appear in globals.css. However, Tailwind v4's PurgeCSS-equivalent (content scanning) may not include them in the output CSS unless they have some usage.

**How to avoid:** These classes are referenced in JSON-LD only, not in CSS. Tailwind's content scanner does not remove them from HTML (it only removes unused CSS utilities from the stylesheet). Custom semantic class attributes in HTML are not touched by Tailwind. The class will be present in the rendered HTML even without a CSS rule.

**Confirmation from codebase:** `.speakable-heading`, `.speakable-lead`, `.speakable-exit` are already used in `directions.astro` with no corresponding CSS rules — this confirms the pattern works.

---

## Fix 6: CI gate impact

### Existing gates and whether v3.1 changes break them

| Gate | Location | v3.1 Impact |
|------|----------|-------------|
| FAQ count ≥ 34 entries | `aeo-audit.mjs` line 34 | No impact — faq.json is not modified |
| FAQ answer word count ≤ 50 words per entry | `aeo-audit.mjs` line 18-29 | No impact |
| llms.txt exists | `aeo-audit.mjs` line 51 | No impact |
| llms.txt required sections (5 H2 sections) | `aeo-audit.mjs` line 55-65 | No impact — llms.txt is not modified |
| robots.txt AI-bot allowlist (5 bots) | `aeo-audit.mjs` line 79-93 | No impact — robots.txt is not modified |

**No existing gates break from v3.1 changes.**

### Missing gates that v3.1 should add

**Gap 1 — Home page FAQSchema no longer injects all 34 entries.** Currently there is no gate verifying the home page has _any_ FAQ schema. If the Layout.astro condition removes `/` from FAQSchema and the inline 8-question block is not added, the home page is silently schema-free. A gate checking that `index.astro` contains a FAQPage block (or that the built `dist/index.html` contains a `FAQPage` JSON-LD block) would catch this.

**Gap 2 — llms-full.txt existence.** The milestone adds a `<link>` to `llms-full.txt` in `<head>`. Currently aeo-audit.mjs only checks `llms.txt`. Adding a check that `public/llms-full.txt` exists would catch accidental deletion.

**Gap 3 — llms.txt head link existence.** No gate currently verifies `<link rel="alternate">` or `<link rel="help">` pointing to llms.txt or llms-full.txt exists in the built HTML. This is hard to gate in a Node.js audit script without an HTML parser, so it may be acceptable to leave as a manual check.

**Recommended additions to aeo-audit.mjs:**
1. Check `public/llms-full.txt` exists (mirrors the llms.txt existence check).
2. Optionally: check `dist/index.html` contains `"FAQPage"` string after build (requires build to run first — may be better as a smoke test than an aeo-audit gate).

---

## Fix 7: llms-full.txt rel change

**The problem being fixed:** `Layout.astro` line 70 has `<link rel="help" href="/llms.txt" />`. The milestone adds a second link for `llms-full.txt` and changes `rel="help"` to `rel="alternate"`.

### Pitfall 7-A: rel="help" vs rel="alternate" — semantic difference matters for AI crawlers

**What goes wrong:** `rel="help"` signals "this linked resource is help documentation for the current page." `rel="alternate"` signals "this is an alternative representation of the same content." For llms.txt, the latter is semantically correct — it is an alternative machine-readable format of the site content, not a help page about the current page.

AI crawlers and coding assistants (Cursor, GitHub Copilot) that discover `llms-full.txt` via HTML `<head>` links follow the RSS/alternate-feed discovery pattern, which uses `rel="alternate"`. Changing from `rel="help"` to `rel="alternate"` aligns with this expectation.

**Practical crawler behavior risk:** There is no evidence that `rel="help"` actively harms discovery — most LLM crawlers do not read HTML at all; they request `/llms.txt` and `/llms-full.txt` directly by convention. The `<link>` tag primarily benefits developer tooling (Cursor, Copilot) and forward-compatibility with future AI crawler standards. The change is low-risk and directionally correct.

**Warning sign:** Changing `rel="help"` to `rel="alternate"` without also adding `type="text/plain"` or `type="text/markdown"`. The recommended full form is:
```html
<link rel="alternate" type="text/plain" title="AI-readable site content" href="/llms.txt" />
<link rel="alternate" type="text/plain" title="AI-readable full content" href="/llms-full.txt" />
```

### Pitfall 7-B: Adding llms-full.txt link without verifying the file exists

**What goes wrong:** If `public/llms-full.txt` does not exist in production (or is not committed), the `<link>` tag points to a 404. This creates a broken resource reference in every page's `<head>`. While browsers do not show errors for broken `<link rel="alternate">` tags, AI crawlers following the link will get a 404 and may log the domain as having broken AI-readable resources.

**How to avoid:** Verify `public/llms-full.txt` exists before merging the Layout.astro change. The build script already auto-generates this file (from menu.json) per the v3.0 implementation. Confirm the file is in `public/` (not only in `dist/`) before the head link is added.

**Warning sign:** The link is added to Layout.astro in a commit that does not touch `public/llms-full.txt` — check if the file was already there from v3.0.

### Pitfall 7-C: Google CSP blocks the link discovery

**What goes wrong:** The Content-Security-Policy in Layout.astro line 52 is configured for `default-src 'self'`. External resource links (`<link>`) are controlled by `style-src` and `font-src`, not `default-src`. Static text files (`/llms.txt`, `/llms-full.txt`) are self-hosted at the same origin, so CSP does not block them.

**Verdict:** No CSP issue. The links are same-origin and are served as text files, not scripts or styles.

---

## Top 3 Pitfalls to Watch

### Priority 1: Duplicate FAQPage blocks (Fix 1-C)

**Why it tops the list:** This is the only pitfall that produces an actively invalid state — two `@type: FAQPage` blocks on the same URL is a structured data error that Google flags in Search Console. The fix requires changing Layout.astro (remove `/` from FAQSchema condition) AND adding an inline schema to index.astro in the same commit. Shipping either change alone creates the error. The commits must be atomic.

**Detection:** After building, inspect `dist/index.html` for the count of `"@type":"FAQPage"` or `"FAQPage"` occurrences. There must be exactly one.

---

### Priority 2: HowTo step text that diverges from DOM text (Fix 4-C)

**Why it ranks second:** DOM-schema text mismatch is the most common AEO implementation failure and the hardest to catch in CI. The directions.astro paragraphs are the source of truth — the HowTo step `text` values must derive from them, not be paraphrased. If HowTo steps are written from memory or shortened, voice assistants reading the schema will give different information than what the page shows. Google's structured data content policy considers this a policy violation.

**Detection:** Read each `HowToStep.text` value against the corresponding DOM paragraph in directions.astro. They must match or be direct sub-sentences of the DOM content.

---

### Priority 3: @id fragment omission or collision (Fix 3-A)

**Why it ranks third:** Without `@id` on RestaurantSchema, adding `sameAs` to it still leaves the Restaurant entity unidentifiable as the same entity as the Organization. Knowledge graph parsers deduplicate entities by `@id` — without it, every page render creates a new anonymous entity node. The entire point of the entity disambiguation fix is the `@id`. Using `https://spicegrillbar66.com` (no fragment) as `@id` on RestaurantSchema when OrganizationSchema uses the same URL (no fragment) will produce a merge conflict in the graph.

**Detection:** Check that RestaurantSchema.astro has `"@id": "https://spicegrillbar66.com/#restaurant"` and OrganizationSchema.astro has `"@id": "https://spicegrillbar66.com/#organization"`. Different fragments — never the same value.

---

## Sources

- Google FAQPage deprecation (May 2026): [https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/) — HIGH confidence
- FAQPage schema still valid for AEO/AI engines: [https://almcorp.com/blog/google-faq-rich-results-no-longer-supported/](https://almcorp.com/blog/google-faq-rich-results-no-longer-supported/) — HIGH confidence
- FAQ schema 3.2x AI Overview citation rate: [https://launchcodex.com/blog/seo-geo-ai/google-drops-faq-rich-results/](https://launchcodex.com/blog/seo-geo-ai/google-drops-faq-rich-results/) — MEDIUM confidence (cited across multiple sources)
- Google HowTo rich results removed September 2023: [https://developers.google.com/search/blog/2023/08/howto-faq-changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes) — HIGH confidence (official Google source)
- HowTo schema still valid for AI extraction: [https://www.schemaapp.com/schema-app-news/how-to-rich-results-removed-on-google-search/](https://www.schemaapp.com/schema-app-news/how-to-rich-results-removed-on-google-search/) — HIGH confidence
- Speakable spec (BETA): [https://developers.google.com/search/docs/appearance/structured-data/speakable](https://developers.google.com/search/docs/appearance/structured-data/speakable) — HIGH confidence (official Google source)
- @id best practices for schema.org entity disambiguation: [https://momenticmarketing.com/blog/id-schema-for-seo-llms-knowledge-graphs](https://momenticmarketing.com/blog/id-schema-for-seo-llms-knowledge-graphs) — MEDIUM confidence
- @id fragment URI pattern: [https://www.schemaapp.com/schema-markup/what-is-an-id-in-structured-data/](https://www.schemaapp.com/schema-markup/what-is-an-id-in-structured-data/) — MEDIUM confidence
- sameAs best practices: [https://aubreyyung.com/sameas-schema/](https://aubreyyung.com/sameas-schema/) — MEDIUM confidence
- Duplicate FAQPage schema error: [https://rankmath.com/kb/fix-duplicate-field-faqpage-error/](https://rankmath.com/kb/fix-duplicate-field-faqpage-error/) — HIGH confidence
- rel="alternate" for llms.txt / AI discovery: [https://evilmartians.com/chronicles/how-to-make-your-website-visible-to-llms](https://evilmartians.com/chronicles/how-to-make-your-website-visible-to-llms) — MEDIUM confidence
- Speakable cssSelector pitfalls: [https://productiveshop.com/how-to-use-google-speakable-schema-markup/](https://productiveshop.com/how-to-use-google-speakable-schema-markup/) — MEDIUM confidence
- DOM text mismatch as structured data pitfall: [https://aiso-hub.com/insights/speakable-schema-seo/](https://aiso-hub.com/insights/speakable-schema-seo/) — MEDIUM confidence
- Existing codebase: `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/pages/directions.astro`, `src/pages/faq.astro`, `src/components/schema/FAQSchema.astro`, `src/components/schema/RestaurantSchema.astro`, `src/components/schema/OrganizationSchema.astro`, `scripts/aeo-audit.mjs` — verified directly [VERIFIED: codebase read]

---

*Research complete: 2026-05-13*
