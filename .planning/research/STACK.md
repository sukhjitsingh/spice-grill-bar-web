# Stack Research — v3.1 AEO Gap Fixes

**Researched:** 2026-05-13
**Domain:** Astro 5 JSON-LD schema authoring, schema-dts TypeScript types, HTML `<link>` semantics
**Confidence:** HIGH — all claims verified against installed source files or current npm data

---

## Summary

All 7 fixes are implementable with zero new npm packages. The installed `schema-dts@1.1.5`
already exports `HowTo`, `HowToStep`, `HowToSection`, and all supporting types. `@id` and
`sameAs` are both inherited through `ThingBase` (the root of every schema-dts type), so
they are available on `Restaurant` without any workaround or type cast. The only non-trivial
decision is how to thread filtered FAQ data for Fix 1 — the planner must choose between a
prop on `Layout.astro` vs. an inline schema block in `index.astro` (the latter matches the
existing Speakable pattern).

---

## Stack Changes Required

### Fix 1 — Home FAQPage schema / DOM mismatch (`Layout.astro` + `index.astro`)

**Stack change: none.**

`FAQSchema.astro` currently renders all 34 entries from `faq.json`. `index.astro` already
computes an 8-entry subset (`homeFaq`) for the visible DOM. The schema must match what the
user sees.

Two valid implementation paths — both use zero new packages:

**Option A (inline, recommended):** Move the home-page FAQ JSON-LD into `index.astro` as
an inline `<script type="application/ld+json">` block, passing `homeFaq` directly. This
matches the existing Speakable block already in `index.astro` and avoids adding a prop to
`Layout.astro`.

**Option B (prop threading):** Add an optional `items` prop to `FAQSchema.astro`; pass
`homeFaq` from `index.astro` through a Layout slot mechanism. Adds complexity to
`Layout.astro`'s interface.

`[VERIFIED: codebase — src/components/schema/FAQSchema.astro, src/pages/index.astro]`

### Fix 2 — Add Speakable schema to `faq.astro`

**Stack change: none.**

Pattern is established on `index.astro` and GEO pages: inline
`<script type="application/ld+json">` in the page file with `WebPage` +
`SpeakableSpecification` + `cssSelector`. `faq.astro` renders items in a `<div
class="space-y-4">` with `h2` + `p` per entry. The container has no `id` attribute yet —
Wave 0 must add one (e.g. `id="faq-list"`) to enable stable ID-anchored selectors
(`#faq-list h2`, `#faq-list p`).

`[VERIFIED: codebase — src/pages/faq.astro]`

### Fix 3 — Add `@id` + `sameAs` to `RestaurantSchema.astro`

**Stack change: none.**

`ThingBase` (the root interface that `Restaurant` inherits from) declares both fields:

```typescript
// schema-dts dist/schema.d.ts lines 10–12, 10411, 10431
type IdReference = {
  "@id": string;
};

interface ThingBase extends Partial<IdReference> {
  "sameAs"?: SchemaValue<URL, "sameAs">;
  // ...
}
```

Both are optional on every schema-dts type. Adding them to the existing
`WithContext<Restaurant>` object literal requires no new imports — `Restaurant` and
`WithContext` are already imported in `RestaurantSchema.astro`. `sameAs` accepts a single
string or a `readonly string[]` array via `SchemaValue<URL, "sameAs">`.

`[VERIFIED: codebase — node_modules/schema-dts/dist/schema.d.ts lines 10, 10411, 10431]`

### Fix 4 — Add `HowTo` schema to `directions.astro`

**Stack change: none — only new import of already-installed exports.**

`schema-dts@1.1.5` exports `HowTo`, `HowToStep`, and `HowToSection` in the same package
already installed as a devDependency. Import:

```typescript
import type { HowTo, HowToStep, WithContext } from 'schema-dts';
```

`HowTo` (line 4438) supports: `name`, `description`, `step` (accepts `HowToStep |
HowToSection | Text`), `totalTime` (ISO 8601 duration string).

`HowToStep` (line 4490) inherits from `CreativeWorkBase + ListItemBase + ItemListBase`
giving: `name` (short label), `text` (the instruction prose), `position` (integer), `url`.

The schema block can be an inline `<script type="application/ld+json">` in
`directions.astro` with three separate `HowTo` objects (one per city: Flagstaff, Williams,
Las Vegas). Three separate objects — not one with `HowToSection` per city — is the correct
Google Rich Results structure for distinct how-to tasks.

`[VERIFIED: codebase — node_modules/schema-dts/dist/schema.d.ts lines 4410–4490]`

### Fix 5 — Extend Directions Speakable `cssSelector`

**Stack change: none.**

`directions.astro` has no Speakable block yet. Current DOM structure:

- Lead section: classes `.speakable-heading`, `.speakable-lead`, `.speakable-exit`
- Per-city sections: `<section id="flagstaff">`, `<section id="williams">`,
  `<section id="las-vegas">`, `<section id="seligman">`, `<section id="los-angeles">`,
  `<section id="kingman">`, `<section id="phoenix">`

Fix adds an inline `<script type="application/ld+json">` block with `WebPage` +
`SpeakableSpecification`. Use ID-anchored selectors for per-city sections
(`#flagstaff h2`, `#flagstaff p`, etc.) — they are already present in the DOM and stable.
Class-based selectors (`.speakable-heading`) are acceptable for the lead block (consistent
with existing patterns on GEO pages).

`[VERIFIED: codebase — src/pages/directions.astro DOM structure]`

### Fix 6 — Expand FAQ page meta description

**Stack change: none.**

`faq.astro` passes a `description` prop to `Layout`. Current value (25 words):

```
"Frequently asked questions about Spice Grill & Bar. Information on hours, location, and vegetarian options."
```

This needs rewording to enumerate the 34 topic categories. Pure string change in
`faq.astro` frontmatter. Meta description max-effective length is ~155 characters.

`[VERIFIED: codebase — src/pages/faq.astro line 8]`

### Fix 7 — Link `llms-full.txt` in `<head>` + fix `rel="help"` → `rel="alternate"`

**Stack change: none.**

`Layout.astro` currently has (line 70):

```html
<link rel="help" href="/llms.txt" />
```

Two in-place edits:

1. Change `rel="help"` to `rel="alternate"` on the existing llms.txt link.
   `rel="help"` means "help documentation for this page" per the HTML spec — semantically
   wrong for a machine-readable LLM context file. `rel="alternate"` is correct for
   alternate machine-readable representations of the page/site.

2. Add a second `<link rel="alternate" href="/llms-full.txt" />` immediately after.

No new component, no new package.

`[VERIFIED: codebase — src/layouts/Layout.astro line 70]`
`[CITED: https://html.spec.whatwg.org/multipage/links.html#link-type-alternate]`

---

## schema-dts Compatibility

**Installed version:** `schema-dts@1.1.5` (devDependency)
`[VERIFIED: codebase — package.json line 83]`

**Latest upstream:** `2.0.0` (noted on libraries.io — not installed, not required)
`[CITED: https://libraries.io/npm/schema-dts]`

**Assessment:** 1.1.5 covers every type this milestone needs. No upgrade required.

### Type support confirmed in 1.1.5

| Type | Exported | Source line | Notes |
|------|----------|-------------|-------|
| `HowTo` | Yes | 4438 | `export type HowTo = HowToLeaf \| Recipe` |
| `HowToStep` | Yes | 4490 | `export type HowToStep = HowToStepLeaf` |
| `HowToSection` | Yes | 4483 | `export type HowToSection = HowToSectionLeaf` |
| `@id` on any type | Yes | 10, 10411 | `ThingBase extends Partial<IdReference>` |
| `sameAs` on any type | Yes | 10431 | `SchemaValue<URL, "sameAs">` in `ThingBase` |
| `FAQPage` | Yes | — | Already used in `FAQSchema.astro` |
| `Restaurant` | Yes | — | Already used in `RestaurantSchema.astro` |

`[VERIFIED: codebase — node_modules/schema-dts/dist/schema.d.ts]`

### Import syntax for new types

```typescript
// HowTo schema block (directions.astro or a new HowToSchema.astro component)
import type { HowTo, HowToStep, WithContext } from 'schema-dts';

// Fix 3: no new imports — Restaurant + WithContext already imported in RestaurantSchema.astro
```

### `sameAs` value shape

`sameAs` is typed as `SchemaValue<URL, "sameAs">` which resolves to:

```typescript
type SchemaValue<T, TProperty extends string> =
  T | Role<T, TProperty> | readonly (T | Role<T, TProperty>)[]
```

In practice: a single `string` or `readonly string[]`. Use a readonly array for multiple
Knowledge Graph URLs. This is consistent with how `OrganizationSchema.astro` already uses
`sameAs`.

`[VERIFIED: codebase — node_modules/schema-dts/dist/schema.d.ts line 9]`
`[ASSUMED: OrganizationSchema.astro sameAs value shape not re-read in this session; verify
before copying the pattern.]`

---

## Constraints

**1. No new npm packages**
PROJECT.md explicitly prohibits new npm packages beyond project needs. All 7 fixes use
only Astro frontmatter, inline `<script>` blocks, and existing schema-dts imports.
`[VERIFIED: .planning/PROJECT.md — "No new npm packages beyond what's needed"]`

**2. Static output only**
All schema is injected at build time. No runtime JS needed for any fix. Consistent with
Apache static hosting.

**3. `is:inline` advisory hints (pre-existing tech debt)**
Astro emits an advisory hint on `<script is:inline>` blocks inside `.astro` components
(schema components in `src/components/schema/`). This is pre-existing and consistent across
all 6 existing schema components. Page-level `<script type="application/ld+json">` blocks
in `.astro` pages (e.g., the existing Speakable in `index.astro`) do NOT use `is:inline`
and do not emit the hint. New inline schema blocks in page files should follow the same
pattern.
`[VERIFIED: codebase — RestaurantSchema.astro line 138, index.astro lines 57–67]`

**4. FAQSchema prop threading is a planner decision**
Fix 1 requires resolving whether to (a) inline the home FAQ schema in `index.astro`
(simpler, matches Speakable pattern) or (b) add a prop to `FAQSchema.astro` and thread
it through `Layout.astro`. Option A is recommended by this research.

**5. schema-dts version gap (1.1.5 installed vs 2.0.0 upstream)**
Upgrading is out of scope per PROJECT.md constraints. All research is against 1.1.5.
Any future upgrade should be treated as a separate task requiring full `typecheck` validation.
`[ASSUMED: 2.0.0 changelog not reviewed; breaking-change risk is real but unquantified]`

**6. HowTo Google Rich Results eligibility**
Google supports HowTo rich results for step-by-step how-to content. Driving directions
qualify. Each `HowToStep` should include `text` (the instruction) and optionally `name`
(short label) and `position` (integer). Three separate `HowTo` objects (one per city) is
the correct structure — not a single `HowTo` with `HowToSection` per city — because each
city route is a distinct task, not a subsection of a shared task.
`[ASSUMED: based on schema.org HowTo spec and Google Rich Results docs; not re-fetched in
this session. Verify with Google Rich Results Test after deploy.]`

---

## No-change items

| Fix | Reason zero stack change needed |
|-----|----------------------------------|
| Fix 2 — Speakable on faq.astro | Inline `<script>` pattern already in use on index.astro |
| Fix 3 — @id + sameAs on Restaurant | Both fields inherited by every schema-dts type via ThingBase |
| Fix 5 — Extend Directions Speakable | CSS selector string change only |
| Fix 6 — FAQ meta description | String value change in faq.astro frontmatter |
| Fix 7 — llms-full.txt link + rel fix | Two attribute edits in Layout.astro `<head>` |

Fixes 1 and 4 require new typed object construction, but still zero new packages — only
new uses of already-installed schema-dts exports.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `sameAs` readonly string[] shape inferred from SchemaValue generic — not runtime-tested | schema-dts Compatibility | TypeScript compile error — easy fix, low risk |
| A2 | OrganizationSchema.astro uses readonly string[] for sameAs (not re-read in session) | Constraints #4 | Minor — check before copying pattern |
| A3 | Google treats 3 separate HowTo objects (one per city) as valid rich results | Constraints #6 | Rich results may not render; schema still valid JSON-LD |
| A4 | schema-dts 2.0.0 has no breaking changes relevant to Restaurant or HowTo | Constraints #5 | Type errors if upgrade is ever attempted separately |

---

## Sources

- `[VERIFIED]` `node_modules/schema-dts/dist/schema.d.ts` — ThingBase, IdReference, HowTo, HowToStep, HowToSection, sameAs types
- `[VERIFIED]` `package.json` line 83 — schema-dts@1.1.5 devDependency
- `[VERIFIED]` `src/components/schema/RestaurantSchema.astro` — import pattern, WithContext<Restaurant> object
- `[VERIFIED]` `src/components/schema/FAQSchema.astro` — current rendering (all 34 entries)
- `[VERIFIED]` `src/layouts/Layout.astro` — current `rel="help"` link (line 70), FAQSchema conditional (line 121)
- `[VERIFIED]` `src/pages/index.astro` — homeFaq 8-entry array, existing Speakable inline script
- `[VERIFIED]` `src/pages/faq.astro` — DOM structure, current meta description, no Speakable
- `[VERIFIED]` `src/pages/directions.astro` — DOM structure, per-city section IDs, no Speakable or HowTo
- `[CITED]` https://libraries.io/npm/schema-dts — schema-dts 2.0.0 noted as latest upstream
- `[CITED]` https://html.spec.whatwg.org/multipage/links.html — rel="alternate" vs rel="help" semantics
