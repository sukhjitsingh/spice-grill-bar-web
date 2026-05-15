# Phase 14: Speakable Coverage - Research

**Researched:** 2026-05-14
**Domain:** Schema.org SpeakableSpecification, Astro 5 inline JSON-LD, AEO audit scripting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** FAQ intro paragraph uses Draft A verbatim: *Spice Grill & Bar is an authentic Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona on historic Route 66. This page answers common questions about our hours, menu, vegetarian and vegan options, takeout, and location. Find the answer you need below.*
- **D-02:** Intro stays under 60 words. Location-first, core topics only. No keyword listing of all 34 topics.
- **D-03:** Class-based selector `.speakable-faq-intro` on the intro `<p>`. Do NOT use `id="faq-intro"`.
- **D-04:** `WebPage` + `SpeakableSpecification` schema block placed after `</main>`, before `</Layout>` — same as directions.astro pattern.
- **D-05:** Add class `speakable-city-directions` to the primary direction `<p>` only in `#flagstaff`, `#williams`, and `#las-vegas`. `<address>` blocks NOT annotated. Seligman, Kingman, Los Angeles, Phoenix excluded.
- **D-06:** Extend existing `cssSelector` array in directions Speakable schema from `[".speakable-heading", ".speakable-lead", ".speakable-exit"]` to include `".speakable-city-directions"` as the 4th entry.
- **D-07:** AEO gate in `scripts/aeo-audit.mjs` reads `dist/faq/index.html` and checks for `SpeakableSpecification` in JSON-LD output. Gracefully skips with `console.warn` when file doesn't exist. Increments shared `errors` counter on failure.
- **D-08:** AEO gate is FAQ Speakable only — does NOT check `dist/directions/index.html`.

### Claude's Discretion

- Field ordering within the `WebPage` schema object (where to place `name`, `url`, `speakable`)
- Whether to use `set:html={JSON.stringify(...)}` pattern or inline raw JSON for the FAQ Speakable block
- Commit strategy: one or two commits (planner decides best atomic boundary)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AEO-12 | `faq.astro` adds `id="faq-list"` to outer FAQ container div; short intro paragraph (2-3 sentences) above Q&A list; `WebPage` + `SpeakableSpecification` inline schema block injected after `</main>` targeting the intro paragraph | Verified: current `faq.astro` has `<div class="space-y-4">` at line 18 with no `id`; no intro paragraph exists; no Speakable schema exists. All three changes are additive. |
| AEO-13 | `directions.astro` Speakable `cssSelector` array extended with class-based selectors for Flagstaff, Williams, Las Vegas per-city direction paragraphs; `speakable-city-directions` class added to primary `<p>` in those three city sections | Verified: existing Speakable script at line 289-298 of directions.astro has `cssSelector` array with 3 entries. Flagstaff `<p>` is at line 93, Williams at line 112, Las Vegas at line 150 — all currently have class `"text-body-lg text-on-surface-variant mb-4"` with no speakable class. |

</phase_requirements>

---

## Summary

Phase 14 is a precise, low-risk schema augmentation involving three files. Two Astro page files receive surgical additions, and one Node.js script receives a new CI gate. No new packages, no visual changes, no page restructuring.

The key technical domain is `SpeakableSpecification` — a Google-supported schema.org type that signals to voice assistants which page passages are best suited for spoken audio responses. The project already has a working Speakable implementation on `directions.astro` and `near-grand-canyon.astro`, so Phase 14 extends that proven pattern to `faq.astro` and to three additional city sections on `directions.astro`.

All patterns are established and verified in the codebase. The FAQ Speakable block follows the identical `<script type="application/ld+json">` raw-JSON pattern used in `directions.astro` (lines 289-299). The AEO gate follows the `dist/index.html` guard pattern from Phase 12/13 (lines 99-126 of `aeo-audit.mjs`). The `speakable-city-directions` class naming follows the `.speakable-*` convention already in use.

**Primary recommendation:** Implement as two atomic commits — one for `faq.astro` (AEO-12) and one for `directions.astro` + `aeo-audit.mjs` (AEO-13 + D-07/D-08). The FAQ changes are fully independent of the directions changes.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| FAQ intro paragraph + class annotation | Frontend Server (SSR/static) | — | Static HTML output; Astro build-time rendering |
| FAQ Speakable JSON-LD schema block | Frontend Server (SSR/static) | — | Inline `<script>` tag; serialized at build time |
| Directions city paragraph class annotation | Frontend Server (SSR/static) | — | Static HTML; Astro build-time class addition |
| Directions Speakable cssSelector extension | Frontend Server (SSR/static) | — | Inline `<script>` tag; no runtime dependency |
| AEO audit CI gate | Build / CI | — | Node.js script reads dist output post-build |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x (project-installed) | Static site generation, page templates | Project framework — locked |
| schema.org/SpeakableSpecification | N/A (schema vocabulary) | Signals voice-extractable content to Google | Google-supported structured data type |
| Node.js fs module | built-in | AEO audit dist-file reading | Already used in `aeo-audit.mjs` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema-dts | 1.1.5 (installed) | TypeScript types for schema.org objects | Not needed for inline raw JSON — only if using JS object pattern with `set:html={JSON.stringify(...)}` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw inline JSON `<script type="application/ld+json">` | `set:html={JSON.stringify(obj)}` | Both valid. Raw JSON is used throughout directions.astro for Speakable; `set:html` used for dynamic data (index.astro FAQPage). For a static, non-data-driven schema, raw JSON is simpler and consistent with the existing Speakable blocks. |

**Installation:** No new packages required. [VERIFIED: CONTEXT.md D-08, REQUIREMENTS.md Out of Scope]

---

## Architecture Patterns

### Existing Speakable Pattern (copy exactly)

The project already ships two Speakable blocks using this raw JSON pattern:

**directions.astro lines 288-299:**
```html
<!-- Speakable schema markup -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Directions to Spice Grill & Bar",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-heading", ".speakable-lead", ".speakable-exit"]
    }
  }
</script>
```

**near-grand-canyon.astro (same structure):**
```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Indian Restaurant Near Grand Canyon",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-heading", ".speakable-lead", ".speakable-hours"]
    }
  }
</script>
```
[VERIFIED: read from actual source files]

### FAQ Speakable Block (new — follows same pattern)

Placement: after `</main>`, before `</Layout>` in `faq.astro`.

```html
<!-- Speakable schema markup -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "FAQ | Spice Grill & Bar",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-faq-intro"]
    }
  }
</script>
```

Field order (`name` → `speakable`) is discretionary per D-04. Planner may add `url` at their discretion.

### FAQ Intro Paragraph (new — before `<div class="space-y-4">`)

Current `faq.astro` structure at lines 14-18:
```html
<h1 class="text-[1.875rem] md:text-display-md text-center text-on-surface mb-16">
  Frequently Asked <span class="text-primary-container">Questions</span>
</h1>

<div class="space-y-4">   <!-- this becomes id="faq-list" -->
```

After Phase 14:
```html
<h1 class="text-[1.875rem] md:text-display-md text-center text-on-surface mb-16">
  Frequently Asked <span class="text-primary-container">Questions</span>
</h1>

<p class="speakable-faq-intro text-body-lg text-on-surface-variant mb-8">
  Spice Grill &amp; Bar is an authentic Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona on historic Route 66. This page answers common questions about our hours, menu, vegetarian and vegan options, takeout, and location. Find the answer you need below.
</p>

<div id="faq-list" class="space-y-4">
```

Note: The `&` in "Spice Grill & Bar" should be encoded as `&amp;` in raw HTML, consistent with existing Astro page files (directions.astro uses `&amp;` in headings). However, since this is inside an Astro `<p>` tag (not raw text), Astro will not auto-escape — use literal `&` or check project convention. [VERIFIED: `faq.astro` existing content uses literal `&` in `faqData.map()` render, while `directions.astro` heading uses `&amp;` in raw HTML]. Use `&amp;` in raw HTML paragraphs to match directions.astro convention.

### Directions City Paragraph Annotation

Three `<p>` elements receive the additional class. Current state (verified from source):

**Flagstaff — line 93:**
```html
<p class="text-body-lg text-on-surface-variant mb-4">
  From Flagstaff, take I-40 West...
```
After: `class="speakable-city-directions text-body-lg text-on-surface-variant mb-4"`

**Williams — line 112:**
```html
<p class="text-body-lg text-on-surface-variant mb-4">
  From Williams, take I-40 West...
```
After: `class="speakable-city-directions text-body-lg text-on-surface-variant mb-4"`

**Las Vegas — line 150:**
```html
<p class="text-body-lg text-on-surface-variant mb-4">
  From Las Vegas, take US-93 South...
```
After: `class="speakable-city-directions text-body-lg text-on-surface-variant mb-4"`

[VERIFIED: read from actual source file]

### Directions Speakable cssSelector Extension

Current state (directions.astro line 296):
```json
"cssSelector": [".speakable-heading", ".speakable-lead", ".speakable-exit"]
```

After Phase 14:
```json
"cssSelector": [".speakable-heading", ".speakable-lead", ".speakable-exit", ".speakable-city-directions"]
```

[VERIFIED: read from actual source file]

### AEO Audit Gate Pattern (from Phase 12/13)

Current pattern in `aeo-audit.mjs` (lines 99-126) for `dist/index.html`:
```javascript
const distIndexPath = path.join(ROOT_DIR, 'dist/index.html');
if (!fs.existsSync(distIndexPath)) {
  console.warn('⚠ @id gate: dist/index.html not found — skipping (run npm run build first for full audit)');
  // ...
} else {
  const distHtml = fs.readFileSync(distIndexPath, 'utf-8');
  if (!distHtml.includes('"@id":"https://spicegrillbar66.com/#restaurant"')) {
    errors++;
  }
}
```

New FAQ Speakable gate (follows same pattern, target = `dist/faq/index.html`):
```javascript
// FAQ Speakable gate — verifies SpeakableSpecification present in /faq/ build output
const distFaqPath = path.join(ROOT_DIR, 'dist/faq/index.html');
if (!fs.existsSync(distFaqPath)) {
  console.warn('⚠ FAQ Speakable gate: dist/faq/index.html not found — skipping (run npm run build first for full audit)');
} else {
  const distFaqHtml = fs.readFileSync(distFaqPath, 'utf-8');
  if (!distFaqHtml.includes('SpeakableSpecification')) {
    console.error('✗ FAQ Speakable gate: SpeakableSpecification not found in dist/faq/index.html');
    errors++;
  } else {
    console.log('✓ FAQ Speakable gate: SpeakableSpecification found in dist/faq/index.html');
  }
}
```

[VERIFIED: read from actual aeo-audit.mjs source; pattern matched to existing gates]

### Recommended Project Structure (no change)

This phase adds/modifies content within existing files only:
```
src/pages/
├── faq.astro              # ADD: intro <p> + id on div + Speakable schema block
├── directions.astro       # MODIFY: add class to 3 <p> elements + extend cssSelector
scripts/
└── aeo-audit.mjs          # ADD: FAQ Speakable gate section
```

### Anti-Patterns to Avoid

- **Using `id="faq-intro"` as Speakable selector:** D-03 locks to class-based `.speakable-faq-intro`. Do not use ID selector.
- **Annotating `<address>` blocks:** D-05 explicitly excludes address elements from speakable class.
- **Extending directions Speakable to Seligman/Kingman/LA/Phoenix:** D-05 locks to three cities only.
- **Adding a CI gate for directions Speakable:** D-08 locks gate to FAQ only.
- **Using `set:html={JSON.stringify(...)}` for the FAQ Speakable block:** The schema is static and contains no data-driven values. Raw JSON matches the existing Speakable block pattern.
- **Placing intro paragraph after the `<div class="space-y-4">` wrapper:** It goes before the div, after the `<h1>`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Speakable selector targeting | Custom JS extraction logic | Standard `cssSelector` array in SpeakableSpecification | Google parses the JSON-LD and applies CSS selectors server-side during indexing |
| Schema validation | Custom schema parser | Google Rich Results Test (manual) or existing AEO audit string-match | Phase only requires CI gate presence check, not structural validation |

**Key insight:** Google's Speakable implementation uses CSS selectors to identify DOM elements at crawl/index time. No JavaScript or runtime logic is needed — the connection between schema and DOM is made by Google's crawler.

---

## Common Pitfalls

### Pitfall 1: HTML Entity Encoding in Raw Astro HTML
**What goes wrong:** Using `&` literal inside a raw HTML `<p>` in an Astro page causes a build warning or validation error; HTML requires `&amp;` in attribute values and text content of raw HTML tags.
**Why it happens:** Astro auto-escapes expressions `{variable}` but NOT raw HTML strings. The CONTEXT.md intro text contains "Spice Grill & Bar" which needs to become `Spice Grill &amp; Bar` in raw HTML.
**How to avoid:** Write `&amp;` in the intro `<p>` tag, consistent with `directions.astro` which uses `&amp;` in headings (lines 19, 29, 33, etc.).
**Warning signs:** Build lint warnings about malformed HTML; browser rendering shows `&amp;` literally in text (indicates double-encoding).

### Pitfall 2: AEO Gate Firing on Dev / Pre-Build
**What goes wrong:** `dist/faq/index.html` doesn't exist on a fresh checkout or before running `npm run build`. If the gate throws an error (instead of gracefully skipping), `npm run test:aeo` fails in CI before the build step.
**Why it happens:** `test:aeo` runs independently from `test:quality` which runs after build. The existing pattern (Phase 12/13) uses `console.warn` + skip, NOT `errors++`.
**How to avoid:** Match the existing guard pattern exactly — `if (!fs.existsSync(distFaqPath)) { console.warn(...); }` with no `errors++` in the skip branch.
**Warning signs:** `npm run test:aeo` fails on a clean repo before any build.

### Pitfall 3: Speakable cssSelector Matching No Elements
**What goes wrong:** Google's crawler finds the Speakable schema but the CSS selector matches zero elements, leading to a "no eligible content" error in Rich Results Test.
**Why it happens:** Class name typo (e.g., `speakable-faq-intro` in schema vs `speakable-faq-intro` on element — must be byte-identical). 
**How to avoid:** Add class to `<p>` FIRST, then reference same string verbatim in schema. Both use `.speakable-faq-intro` per D-03.
**Warning signs:** Google Rich Results Test shows Speakable schema detected but no speakable content extracted.

### Pitfall 4: Schema Block Placement Outside Layout Slot
**What goes wrong:** If the `<script type="application/ld+json">` block is placed inside `<main>` rather than after `</main>`, it may be valid but inconsistent with project convention. More critically, if placed outside the Layout component entirely (after `</Layout>`), it will not be rendered.
**Why it happens:** Astro Layout components use named slots; content between `<Layout>` tags without a `slot=` attribute goes into the default slot. Content after `</Layout>` is discarded.
**How to avoid:** Place schema block between `</main>` and `</Layout>` — identical to directions.astro lines 254-299.

---

## Code Examples

### Complete FAQ Speakable Block (ready to copy)
```html
<!-- Speakable schema markup — targets intro paragraph for voice extraction -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "FAQ | Spice Grill & Bar",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-faq-intro"]
    }
  }
</script>
```
Source: directions.astro lines 288-299 pattern [VERIFIED]

### Complete AEO Gate Addition
```javascript
// FAQ Speakable gate — verifies SpeakableSpecification present in dist/faq/index.html
const distFaqPath = path.join(ROOT_DIR, 'dist/faq/index.html');
if (!fs.existsSync(distFaqPath)) {
  console.warn('⚠ FAQ Speakable gate: dist/faq/index.html not found — skipping (run npm run build first for full audit)');
} else {
  const distFaqHtml = fs.readFileSync(distFaqPath, 'utf-8');
  if (!distFaqHtml.includes('SpeakableSpecification')) {
    console.error('✗ FAQ Speakable gate: SpeakableSpecification not found in dist/faq/index.html');
    errors++;
  } else {
    console.log('✓ FAQ Speakable gate: SpeakableSpecification found in dist/faq/index.html');
  }
}
```
Source: aeo-audit.mjs Phase 12/13 guard pattern [VERIFIED]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `xpath` selector in Speakable | `cssSelector` array | Ongoing; Google deprecated xpath | Use `cssSelector` only — project already does this |
| ID-based Speakable selectors | Class-based selectors | D-03 decision | Classes are more maintainable; multiple elements can share the same class |

**Deprecated/outdated:**
- `SpeakableSpecification.xpath`: Google's crawler uses CSS selectors; project consistently uses `cssSelector` throughout.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Placing `speakable-city-directions` as the first class in the class list (before `text-body-lg`) is acceptable | Architecture Patterns | No risk — CSS class order has no semantic meaning in HTML; Tailwind applies all classes regardless of order |

**All other claims in this research were verified by reading actual source files.** No assumed library capabilities, version numbers, or external API behaviors relied upon.

---

## Open Questions

None. All implementation details are locked via CONTEXT.md decisions or verifiable in existing source files.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | aeo-audit.mjs execution | Yes | 22.13.1 | — |
| npm | `npm run test:aeo` | Yes | 10.9.2 | — |
| Astro build | AEO gate (needs dist output) | Yes (project-installed) | 5.x | — |

**Missing dependencies with no fallback:** None.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Custom Node.js AEO audit script (`scripts/aeo-audit.mjs`) |
| Config file | none — self-contained script |
| Quick run command | `npm run test:aeo` (requires `dist/` for gate; skips gracefully without it) |
| Full suite command | `npm run qa` (build + quality + lhci) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AEO-12 | `SpeakableSpecification` present in `/faq/` build output | Build output string-match | `npm run build && npm run test:aeo` | ❌ Wave 0 (gate must be added) |
| AEO-13 | `speakable-city-directions` class on 3 city `<p>` elements; `cssSelector` extended | Manual verification or grep on dist HTML | `grep "speakable-city-directions" dist/directions/index.html` | ❌ Wave 0 (no automated gate; D-08 explicitly excludes directions from aeo-audit gate) |

### Sampling Rate
- **Per task commit:** `npm run test:aeo` (if dist exists) or `npm run build && npm run test:aeo`
- **Per wave merge:** `npm run build && npm run test:aeo`
- **Phase gate:** `npm run qa` green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] AEO gate for FAQ Speakable in `scripts/aeo-audit.mjs` — covers AEO-12 (this IS the implementation task, not a pre-existing gap)
- [ ] No automated gate for AEO-13 per D-08 — manual verification via `grep "speakable-city-directions" dist/directions/index.html` after build

*(Framework and core test infrastructure already exist — `aeo-audit.mjs` has 4 existing gates that pass)*

---

## Security Domain

Step 2.6 SKIPPED: This phase makes no changes involving user input, authentication, data storage, external APIs, or network requests. All changes are static HTML class additions and inline JSON-LD schema. No ASVS categories apply.

---

## Sources

### Primary (HIGH confidence)
- `src/pages/faq.astro` — read directly; confirmed no intro paragraph, no Speakable schema, `<div class="space-y-4">` at line 18
- `src/pages/directions.astro` — read directly; confirmed existing Speakable at lines 288-299 with 3-entry cssSelector; identified Flagstaff/Williams/Las Vegas `<p>` elements at lines 93/112/150
- `src/pages/near-grand-canyon.astro` — read directly; confirmed same Speakable schema pattern
- `src/pages/index.astro` — read directly; confirmed `set:html={JSON.stringify(...)}` usage pattern
- `scripts/aeo-audit.mjs` — read directly; confirmed Phase 12/13 gate pattern at lines 99-126
- `.planning/phases/14-speakable-coverage/14-CONTEXT.md` — all implementation decisions

### Secondary (MEDIUM confidence)
- `.planning/REQUIREMENTS.md` — AEO-12 and AEO-13 acceptance criteria
- `CLAUDE.md` — project conventions, no-new-packages constraint

### Tertiary (LOW confidence)
- None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified from existing project source files
- Architecture: HIGH — all patterns directly copied from working code
- Pitfalls: HIGH — verified against actual source (encoding, gate skip pattern)

**Research date:** 2026-05-14
**Valid until:** 2026-06-14 (stable domain — schema.org SpeakableSpecification has not changed significantly)
