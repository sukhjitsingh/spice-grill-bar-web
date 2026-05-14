# Architecture Research — v3.1 AEO Gap Fixes

**Researched:** 2026-05-13
**Domain:** Astro 5 schema integration, JSON-LD, schema-dts, SpeakableSpecification

---

## Integration Map

### Fix 1 — Home FAQPage schema: restrict to 8 visible questions

**Problem:** `FAQSchema.astro` currently renders all 34 `faq.json` entries on both `/` and `/faq/`. On the home page only 8 questions are visible in the DOM (`#home-faq`), so the schema/DOM mismatch can trigger Google Rich Results warnings.

**Files changed:** `Layout.astro`, `FAQSchema.astro`

**Two valid patterns — use Pattern A:**

**Pattern A (recommended): Pass a prop into FAQSchema from Layout**

`FAQSchema.astro` accepts an optional `entries` prop. When `entries` is provided it uses that subset; when absent it defaults to all 34 entries from `faqData`. Layout.astro passes the 8-entry subset on `/` and passes nothing (full set) on `/faq/`.

```astro
// FAQSchema.astro — new optional prop
---
import type { FAQPage, WithContext } from 'schema-dts';
import faqData from '../../data/faq.json';

interface Props {
  entries?: { question: string; answer: string }[];
}
const { entries = faqData } = Astro.props;

const schema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: entries.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};
---
<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />
```

```astro
// Layout.astro — frontmatter additions
import faqData from '../data/faq.json';

const HOME_FAQ_INDICES = [14, 2, 3, 13, 10, 1, 15, 21];
const homeFaqEntries = HOME_FAQ_INDICES.map((i) => faqData[i]).filter(Boolean);

// In body — replace the existing single conditional:
{currentPath === '/'
  ? <FAQSchema entries={homeFaqEntries} />
  : currentPath.startsWith('/faq') && <FAQSchema />}
```

`index.astro` already computes `homeFaq` from the same indices for the DOM render — that variable stays as-is. Layout.astro independently computes the same subset for the schema. This is intentional: schema injection lives in Layout, DOM render lives in the page. No circular dependency.

**Pattern B (alternative, not recommended):** Move the home FAQ schema to an inline `<script type="application/ld+json">` in `index.astro` (matching the GEO page pattern) and restrict Layout.astro to only inject `<FAQSchema />` on `/faq/`. Cleaner in isolation but breaks the established convention that Layout.astro is the single injection point for global schemas. Pattern A is preferred.

**`index.astro` changes:** None. The `#home-faq` section and `homeFaqIndices` array stay exactly as-is.

---

### Fix 2 — Speakable on /faq/

**Files changed:** `faq.astro` only

**Where it goes:** Inline `<script type="application/ld+json">` inside the `<Layout>` component slot, after `</main>`. This matches the exact pattern used in `index.astro`, `near-grand-canyon.astro`, and `directions.astro`.

**DOM structure of faq.astro (current):**
```
main.pt-32
  div.max-w-4xl
    h1                    ← page title (not speakable — not a direct voice answer)
    div.space-y-4         ← FAQ list container  ← needs id="faq-list"
      div.bg-surface-container  [x34]
        h2.text-heading-md      ← question
        p.text-body-md          ← answer
```

**Required DOM change:** Add `id="faq-list"` to the existing `<div class="space-y-4">` in faq.astro. This is the only DOM change across all 7 fixes.

**Selector strategy:** Follows the `#home-faq h3` / `#home-faq p` pattern from `index.astro`. ID+tag selectors are stable against Tailwind utility class renames (KEY DECISION in PROJECT.md: "ID-anchored SpeakableSpecification selectors stable against Tailwind utility renames").

**Speakable block to add after `</main>` in faq.astro:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Frequently Asked Questions — Spice Grill & Bar",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["#faq-list h2", "#faq-list p"]
  }
}
```

**Note on h2 vs h3:** On the home page, FAQ questions are `h3` (inside a section with its own `h2` heading). On `/faq/`, questions are `h2` (no parent section heading). The selectors reflect each page's actual markup — `#faq-list h2` for /faq/, `#home-faq h3` for /.

**ID selector validity in SpeakableSpecification:** CSS `#id` selectors and descendant combinators (`#id element`) are valid in `cssSelector`. The schema.org spec defines `cssSelector` as "a CSS selector." The existing `index.astro` pattern (`#home-faq h3`, `#home-faq p`) confirms this pattern works in this codebase. [VERIFIED: index.astro lines 64-65; CITED: schema.org/cssSelector]

---

### Fix 3 — @id on RestaurantSchema

**Files changed:** `RestaurantSchema.astro` only

**Where @id goes:** Top-level property on the schema object, alongside `'@context'` and `'@type'` (conventionally placed right after `'@type'`).

**TypeScript typing:** `schema-dts` v1.1.5 supports `'@id'` as a string property on any typed node. The `WithContext<Restaurant>` type accepts `@id` directly — no special cast, no type override needed. Add it to the object literal:

```typescript
const schema: WithContext<Restaurant> = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': 'https://spicegrillbar66.com/#restaurant',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
  // ... all existing properties unchanged
};
```

**Canonical @id value:** `https://spicegrillbar66.com/#restaurant`

Follows the standard pattern: canonical site URL + `#` fragment naming the entity. Stable, human-readable, grounded in the site's own URL structure. [CITED: schema-dts README (github.com/google/schema-dts); momenticmarketing.com/blog/id-schema-for-seo-llms-knowledge-graphs]

**areaServed @id values are unrelated:** The existing `'@id'` fields on City/Place objects within `areaServed` (e.g., `'@id': 'https://en.wikipedia.org/wiki/Ash_Fork,_Arizona'`) are Wikipedia entity references disambiguating the cities. They remain unchanged.

---

### Fix 4 — sameAs on RestaurantSchema

**Files changed:** `RestaurantSchema.astro` only (same file as Fix 3; implement in the same commit)

**Does duplicating sameAs from OrganizationSchema cause a conflict?**

No. `Restaurant` subclasses `LocalBusiness` subclasses `Organization`. Both types legitimately carry `sameAs` as inherited from `Thing`. Google processes each JSON-LD block independently per page. Having `sameAs` on both the Restaurant entity and the Organization entity reinforces social presence signals rather than conflicting. Both blocks share `url: 'https://spicegrillbar66.com'`, which Google uses to merge them into a single Knowledge Graph entity. [CITED: support.schemaapp.com — Schema App disambiguation guide]

**What to add to RestaurantSchema.astro** (after the `containedInPlace` property):
```typescript
sameAs: [
  'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8',
  'https://www.yelp.com/biz/spice-grill-and-bar-ash-fork',
  'https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html',
  'https://www.facebook.com/profile.php?id=61566349169122',
  'https://www.instagram.com/panjabi_dhaba_sgb',
],
```

Same 5 URLs as `OrganizationSchema.astro`. These must be kept in sync — if a profile URL changes in one schema, update both. `schema-dts` types `sameAs` as `string | string[]` inherited from `Thing` — no casting required. [VERIFIED: OrganizationSchema.astro — identical array already in production]

---

### Fix 5 — HowTo schema on directions.astro

**Files changed:** `directions.astro` only

**Where it goes:** New inline `<script type="application/ld+json">` appended at the end of the Layout slot, after the existing FAQPage block (lines 255-286) and Speakable block (lines 288-299).

**Structure — three separate HowTo objects in one @graph block:**

Use a JSON-LD `@graph` array containing three HowTo objects (Flagstaff, Williams, Las Vegas). Rationale:
- Each HowTo has a distinct task name, distinct origin city, and distinct steps. Merging all cities into one HowTo would require `HowToSection` grouping, adding complexity for no indexing benefit.
- Scope is Flagstaff + Williams + Las Vegas per milestone specification. The remaining 4 cities (Seligman, Kingman, Los Angeles, Phoenix) can be added in a future pass.
- `@graph` with multiple objects is equivalent to multiple separate script blocks, but avoids DOM clutter.

**HowTo @graph block to append:**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "name": "How to Drive from Flagstaff to Spice Grill & Bar",
      "description": "Step-by-step driving directions from Flagstaff, AZ to Spice Grill & Bar at I-40 Exit 146 in Ash Fork, AZ.",
      "totalTime": "PT46M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Take I-40 West from Flagstaff",
          "text": "From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes)."
        },
        {
          "@type": "HowToStep",
          "name": "Take Exit 146 in Ash Fork",
          "text": "Take Exit 146 (Ash Fork / Historic Route 66) off I-40."
        },
        {
          "@type": "HowToStep",
          "name": "Turn right onto Lewis Ave",
          "text": "Turn right onto Lewis Ave. Spice Grill & Bar is at 33 Lewis Ave on your right."
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Drive from Williams to Spice Grill & Bar",
      "description": "Step-by-step driving directions from Williams, AZ to Spice Grill & Bar at I-40 Exit 146 in Ash Fork, AZ.",
      "totalTime": "PT18M",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Take I-40 West from Williams",
          "text": "From Williams, take I-40 West. Drive 18 miles (about 18 minutes)."
        },
        {
          "@type": "HowToStep",
          "name": "Take Exit 146 in Ash Fork",
          "text": "Take Exit 146 off I-40 in Ash Fork, Arizona."
        },
        {
          "@type": "HowToStep",
          "name": "Turn right onto Lewis Ave",
          "text": "Turn right onto Lewis Ave. Spice Grill & Bar is at 33 Lewis Ave on your right."
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to Drive from Las Vegas to Spice Grill & Bar",
      "description": "Step-by-step driving directions from Las Vegas, NV to Spice Grill & Bar at I-40 Exit 146 in Ash Fork, AZ.",
      "totalTime": "PT3H",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Take US-93 South from Las Vegas",
          "text": "From Las Vegas, take US-93 South toward Kingman, Arizona."
        },
        {
          "@type": "HowToStep",
          "name": "Merge onto I-40 East",
          "text": "Merge onto I-40 East toward Flagstaff. Drive approximately 200 miles total from Las Vegas (about 3 hours)."
        },
        {
          "@type": "HowToStep",
          "name": "Take Exit 146 in Ash Fork",
          "text": "Take Exit 146 (Ash Fork / Historic Route 66) off I-40."
        },
        {
          "@type": "HowToStep",
          "name": "Turn left onto Lewis Ave",
          "text": "Turn left onto Lewis Ave. Spice Grill & Bar is at 33 Lewis Ave."
        }
      ]
    }
  ]
}
```

**`totalTime` format:** ISO 8601 duration. `PT46M` = 46 minutes, `PT18M` = 18 minutes, `PT3H` = 3 hours. Values match the prose times already in directions.astro. [ASSUMED — ISO 8601 is the schema.org `Duration` type requirement]

---

### Fix 6 — Directions Speakable: extend to per-city sections

**Files changed:** `directions.astro` only (same file as Fix 5; implement in the same session)

**Current Speakable cssSelector array (directions.astro lines 295-298):**
```json
[".speakable-heading", ".speakable-lead", ".speakable-exit"]
```

**City section IDs already exist:** The `<section>` elements have `id` attributes from the jump nav anchors: `id="flagstaff"` (line 89), `id="williams"` (line 108), `id="las-vegas"` (line 146). No DOM changes needed.

**Extended cssSelector array — replace in place:**
```json
[
  ".speakable-heading",
  ".speakable-lead",
  ".speakable-exit",
  "#flagstaff h2",
  "#flagstaff p",
  "#williams h2",
  "#williams p",
  "#las-vegas h2",
  "#las-vegas p"
]
```

**What each selector targets:**

| Selector | Element targeted |
|----------|-----------------|
| `.speakable-heading` | H1 "Directions to Spice Grill & Bar / I-40 Exit 146..." |
| `.speakable-lead` | "Spice Grill & Bar is located at 33 Lewis Ave, Ash Fork..." |
| `.speakable-exit` | "Spice Grill & Bar is located at I-40 Exit 146 in Ash Fork, Arizona." |
| `#flagstaff h2` | "From Flagstaff, AZ — 51 Miles, About 46 Minutes West on I-40" |
| `#flagstaff p` | Flagstaff directions prose paragraph |
| `#williams h2` | "From Williams, AZ — 18 Miles, About 18 Minutes West on I-40" |
| `#williams p` | Williams directions prose paragraph |
| `#las-vegas h2` | "From Las Vegas, NV — About 200 Miles, About 3 Hours via US-93 S and I-40 E" |
| `#las-vegas p` | Las Vegas directions prose paragraph |

**`<address>` exclusion is automatic:** Each `<section id="...">` contains an `<address>` block (NAP: name, phone). The selector `#flagstaff p` matches only `<p>` elements. The `<address>` element is a different tag and is excluded automatically — no extra work required.

**ID selector validity confirmed:** The existing `index.astro` pattern (`#home-faq h3`, `#home-faq p`) uses ID + descendant selectors in production. Same pattern applies here. [VERIFIED: index.astro lines 64-65; CITED: schema.org/cssSelector]

---

### Fix 7 — llms-full.txt link + rel fix in Layout.astro

**Files changed:** `Layout.astro` only

**Current line 70:**
```html
<link rel="help" href="/llms.txt" />
```

**Replace with two lines:**
```html
<link rel="alternate" href="/llms.txt" />
<link rel="alternate" href="/llms-full.txt" />
```

Two changes:
1. `rel="help"` to `rel="alternate"` — `help` is the IANA-registered link relation for user-assistance pages (documentation about using the page itself), not for machine-readable alternate representations. `alternate` signals to crawlers that this is an alternate format of the site's content. [ASSUMED — no IANA-registered rel type exists specifically for AI llms.txt files as of this research date; `alternate` is the most defensible standard choice]
2. Second `<link>` for `/llms-full.txt` added immediately after.

**Placement:** Replace line 70 in Layout.astro. Both links remain between `<link rel="manifest">` and the `<!-- Primary Meta Tags -->` comment.

---

## Build Order

Implement in this sequence. Each fix is independent; ordering is by risk level and file grouping:

| Step | Fix(es) | File(s) touched | Rationale |
|------|---------|-----------------|-----------|
| 1 | Fix 7 | `Layout.astro` (head only) | Zero-logic head change. Two attribute edits. Commit alone. |
| 2 | Fix 3 + Fix 4 | `RestaurantSchema.astro` | Single file, two additive properties. Low risk. Commit together. |
| 3 | Fix 1 | `FAQSchema.astro` + `Layout.astro` | Two-file change with prop interface addition. Build and verify together. |
| 4 | Fix 2 | `faq.astro` | One DOM id attr + one script block. Isolated. |
| 5 | Fix 6 + Fix 5 | `directions.astro` | Extend Speakable cssSelector first, then append HowTo @graph. Same file, same commit. |

**Recommended commits:**
- `chore: fix llms link rel and add llms-full.txt to head` — Fix 7
- `feat(schema): add @id and sameAs to RestaurantSchema for entity disambiguation` — Fix 3 + 4
- `fix(schema): restrict home FAQPage schema to 8 visible questions` — Fix 1
- `feat(schema): add Speakable schema to FAQ page` — Fix 2
- `feat(schema): add HowTo schema and extend Speakable on directions page` — Fix 5 + 6

---

## Schema Graph Coherence

**Does adding @id/sameAs to Restaurant conflict with Organization?**

No. The resulting entity graph:

```
Node A — RestaurantSchema.astro output:
  @type: Restaurant
  @id:   "https://spicegrillbar66.com/#restaurant"   ← NEW (Fix 3)
  url:   "https://spicegrillbar66.com"
  sameAs: [Google Maps, Yelp, TripAdvisor, FB, IG]   ← NEW (Fix 4)

Node B — OrganizationSchema.astro output:
  @type: Organization
  url:   "https://spicegrillbar66.com"
  sameAs: [Google Maps, Yelp, TripAdvisor, FB, IG]   ← existing, unchanged
```

`Restaurant` is a subtype of `LocalBusiness` which is a subtype of `Organization`. These two nodes describe the same real-world entity at different schema.org type granularities — they are not duplicates. Google merges them by shared `url` value. Having `sameAs` on both reinforces the entity's directory profile signals. This is explicitly recommended practice when both LocalBusiness and Organization nodes are co-declared. [CITED: Schema App disambiguation guide]

**Should Organization also get @id?** Out of scope for this milestone. If added in a future pass, the convention would be `https://spicegrillbar66.com/#organization` (different fragment from `#restaurant`), making the two nodes explicitly distinct in the graph. For now, the Organization node is identified implicitly by its `url` value.

**areaServed @id values are unaffected:** The `'@id'` fields on City/Place objects inside `areaServed` (e.g., Wikipedia URLs) are external entity disambiguation references for the cities themselves. They remain unchanged.

---

## Speakable Selector Patterns

### FAQ page (/faq/) — new selectors

| Selector | Targets | Count | DOM change required |
|----------|---------|-------|---------------------|
| `#faq-list h2` | All 34 question elements | 34 | Yes — add `id="faq-list"` to `div.space-y-4` |
| `#faq-list p` | All 34 answer elements | 34 | Same DOM change covers both |

**The only DOM change in all 7 fixes:** Add `id="faq-list"` to `<div class="space-y-4">` in faq.astro. One attribute addition.

**Why ID, not class?** Per PROJECT.md Key Decisions: "ID-anchored SpeakableSpecification selectors stable against Tailwind utility renames." The `space-y-4` utility could in principle be removed or renamed; the `id` attribute is not a utility and does not change with design system updates.

### Directions page (/directions/) — extended selectors

| Selector | Targets | DOM change needed |
|----------|---------|-------------------|
| `.speakable-heading` | H1 element | None — existing class |
| `.speakable-lead` | Lead paragraph | None — existing class |
| `.speakable-exit` | Exit 146 sentence | None — existing class |
| `#flagstaff h2` | Flagstaff section heading | None — `id="flagstaff"` already on `<section>` |
| `#flagstaff p` | Flagstaff directions prose | None — `<address>` tag excluded automatically |
| `#williams h2` | Williams section heading | None — `id="williams"` already on `<section>` |
| `#williams p` | Williams directions prose | None |
| `#las-vegas h2` | Las Vegas section heading | None — `id="las-vegas"` already on `<section>` |
| `#las-vegas p` | Las Vegas directions prose | None |

**Zero DOM changes needed on directions.astro** — all section IDs already exist from the jump navigation implementation.

---

## New vs Modified Files

### Modified files (5 total)

| File | Fix(es) | What changes |
|------|---------|--------------|
| `src/layouts/Layout.astro` | Fix 1, Fix 7 | Frontmatter: import faqData, compute `homeFaqEntries`. Body: replace single FAQSchema conditional with path-branched expression. Head: `rel="help"` → `rel="alternate"` on llms.txt; add second link for llms-full.txt. |
| `src/components/schema/FAQSchema.astro` | Fix 1 | Add optional `entries` prop (defaults to full `faqData`). No change to output structure or rendering pattern. |
| `src/components/schema/RestaurantSchema.astro` | Fix 3, Fix 4 | Add `'@id': 'https://spicegrillbar66.com/#restaurant'` after `'@type'`. Add `sameAs: [...]` after `containedInPlace`. Both properties accepted by schema-dts `WithContext<Restaurant>` without casting. |
| `src/pages/faq.astro` | Fix 2 | Add `id="faq-list"` to `<div class="space-y-4">`. Add Speakable `<script type="application/ld+json">` block after `</main>` in the Layout slot. |
| `src/pages/directions.astro` | Fix 5, Fix 6 | Extend `cssSelector` array in existing Speakable block (6 new selectors). Append `@graph` HowTo block as new `<script type="application/ld+json">` after existing FAQPage and Speakable blocks. |

### New files

None. All 7 fixes are modifications to existing files. No new components, no new data files, no new npm packages.

---

## Assumptions Log

| # | Claim | Risk if Wrong |
|---|-------|---------------|
| A1 | `rel="alternate"` is the correct link relation for llms.txt AI crawler discovery | Low — worst case: link is semantically neutral and crawlers ignore it; nothing breaks |
| A2 | `totalTime` in HowTo uses ISO 8601 duration format (`PT46M`, `PT18M`, `PT3H`) | Low — if format is wrong the property is silently ignored; not a blocking error |
| A3 | Three separate HowTo objects in `@graph` is preferable to one HowTo with HowToSection grouping for per-city directions | Low — both are valid; separate objects are more explicit and individually discoverable |

All other claims verified directly from codebase files read in this session.

---

## Sources

### Primary — verified from codebase
- `src/pages/index.astro` — Speakable selector pattern `#home-faq h3` / `#home-faq p`; `homeFaqIndices = [14,2,3,13,10,1,15,21]`
- `src/layouts/Layout.astro` — FAQSchema conditional logic; `rel="help"` llms.txt link (line 70)
- `src/components/schema/FAQSchema.astro` — All-34-entries rendering; schema-dts `WithContext<FAQPage>` pattern
- `src/components/schema/RestaurantSchema.astro` — `WithContext<Restaurant>` object structure; schema-dts import pattern
- `src/components/schema/OrganizationSchema.astro` — Existing sameAs 5-URL array (confirmed working)
- `src/pages/directions.astro` — Section id attributes (`flagstaff`, `williams`, `las-vegas`); existing Speakable block; existing FAQPage block
- `src/pages/faq.astro` — DOM structure; h2/p tag hierarchy inside `div.space-y-4`
- `src/data/faq.json` — 34 entries; indices [14,2,3,13,10,1,15,21] confirmed against array

### Secondary — cited from authoritative sources
- [schema.org/cssSelector](https://schema.org/cssSelector) — CSS selector syntax validity including ID selectors
- [Google Speakable documentation](https://developers.google.com/search/docs/appearance/structured-data/speakable) — cssSelector usage patterns
- [schema-dts README](https://github.com/google/schema-dts/blob/main/README.md) — @id support on `WithContext` typed nodes
- [Schema App disambiguation guide](https://support.schemaapp.com/support/solutions/articles/33000278032-common-schema-org-properties-for-connecting-and-disambiguating-data-items) — sameAs on both Restaurant and Organization nodes
- [Momentic @id guide](https://momenticmarketing.com/blog/id-schema-for-seo-llms-knowledge-graphs) — @id canonical URL + fragment pattern convention
