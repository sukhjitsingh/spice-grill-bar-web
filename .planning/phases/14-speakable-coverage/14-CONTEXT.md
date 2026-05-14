# Phase 14: Speakable Coverage - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers two surgical schema additions — no new pages, no visual redesign, no new npm packages.

**In scope:**
- `src/pages/faq.astro` — add intro paragraph (3 sentences, `speakable-faq-intro` class) above the Q&A list; add `id="faq-list"` to the outer `<div class="space-y-4">` container; inject `WebPage` + `SpeakableSpecification` inline schema block after `</main>` targeting `.speakable-faq-intro`
- `src/pages/directions.astro` — add `speakable-city-directions` class to the primary direction `<p>` in the Flagstaff, Williams, and Las Vegas sections; extend the existing Speakable `cssSelector` array to include `.speakable-city-directions`
- `scripts/aeo-audit.mjs` — add CI gate that reads `dist/faq/index.html` and verifies `SpeakableSpecification` appears in the JSON-LD output

**Out of scope:**
- Changes to the FAQ Q&A cards or their styling
- Changes to the Seligman, Kingman, Los Angeles, or Phoenix city sections
- New npm packages
- Any visual changes

</domain>

<decisions>
## Implementation Decisions

### FAQ Intro Paragraph Content
- **D-01:** The intro paragraph uses Draft A verbatim:
  > *Spice Grill & Bar is an authentic Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona on historic Route 66. This page answers common questions about our hours, menu, vegetarian and vegan options, takeout, and location. Find the answer you need below.*
- **D-02:** Approach is **location-first, core topics only** — no keyword list of all 34 topics. The intro stays under 60 words to fit the 20-30 second voice window.

### FAQ Speakable Selector
- **D-03:** Use **class-based selector** `.speakable-faq-intro` on the intro `<p>` — consistent with the directions page pattern (`.speakable-lead`, `.speakable-heading`, `.speakable-exit`). Do NOT use `id="faq-intro"`.
- **D-04:** The `WebPage` + `SpeakableSpecification` schema block is placed **after `</main>`, before `</Layout>`** — same placement as the existing FAQPage and Speakable scripts in `directions.astro`.

### Directions Speakable Extension
- **D-05:** Add class `speakable-city-directions` to the **primary direction `<p>` only** in Flagstaff (`#flagstaff`), Williams (`#williams`), and Las Vegas (`#las-vegas`) sections. The `<address>` blocks are NOT annotated.
- **D-06:** The existing `cssSelector` array in the directions Speakable schema (`[".speakable-heading", ".speakable-lead", ".speakable-exit"]`) is extended to include `".speakable-city-directions"`.

### AEO Audit Gate
- **D-07:** Add a CI gate to `scripts/aeo-audit.mjs` that reads `dist/faq/index.html` and checks for `SpeakableSpecification` in the JSON-LD output. Gate gracefully skips with `console.warn` when `dist/faq/index.html` doesn't exist (same pattern as Phase 12 @id gate). Increments shared `errors` counter on failure.
- **D-08:** Gate is **FAQ Speakable only** — does not check `dist/directions/index.html` for the directions class. The directions Speakable was already shipping before Phase 14.

### Claude's Discretion
- Field ordering within the `WebPage` schema object (where to place `name`, `url`, `speakable`)
- Whether to use `set:html={JSON.stringify(...)}` pattern or inline raw JSON for the FAQ Speakable block
- Commit strategy: one or two commits (planner decides best atomic boundary)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Primary targets
- `src/pages/faq.astro` — current state: no intro paragraph, no Speakable schema; `<div class="space-y-4">` (line ~17) is the outer FAQ container that receives `id="faq-list"`; intro `<p>` goes before this div
- `src/pages/directions.astro` — existing Speakable script near the end of the file already uses `.speakable-heading`, `.speakable-lead`, `.speakable-exit`; the per-city `<p>` elements in `#flagstaff`, `#williams`, `#las-vegas` sections receive `speakable-city-directions` class
- `scripts/aeo-audit.mjs` — new gate follows Phase 12/13 pattern: `fs.existsSync(path.join(ROOT_DIR, 'dist/faq/index.html'))` guard → `fs.readFileSync` → `.includes('SpeakableSpecification')` → `errors++` on failure, `console.warn` on skip

### Project-level
- `.planning/REQUIREMENTS.md` — AEO-12 and AEO-13 full specs with acceptance criteria
- `CLAUDE.md` — Astro 5 conventions, no new npm packages constraint, schema-dts patterns
- `.planning/phases/12-schema-entity-disambiguation/12-CONTEXT.md` — AEO gate pattern reference (D-03, D-04)
- `.planning/phases/13-faqpage-schema-compliance/13-CONTEXT.md` — FAQPage Question-count gate pattern (D-05)

### Schema pattern reference
- `src/pages/near-grand-canyon/index.astro` or `src/pages/directions.astro` — existing inline `<script is:inline type="application/ld+json" set:html={JSON.stringify(schemaObj)} />` pattern to copy for the FAQ Speakable schema block

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Inline JSON-LD pattern: `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />` — already used for FAQPage and Speakable in `directions.astro`; same pattern for FAQ Speakable block
- Phase 12/13 AEO gate pattern: `if (!fs.existsSync(distFile)) { console.warn(...); } else { const html = fs.readFileSync(distFile, 'utf8'); if (!html.includes('...')) { errors++; } }`

### Established Patterns
- Class-based Speakable selectors: `.speakable-*` naming convention is already established on `directions.astro` — `.speakable-faq-intro` follows this pattern
- Schema block placement: all page-specific schema scripts live after `</main>` in Astro page files (directions.astro precedent)

### Integration Points
- `faq.astro:17` — outer `<div class="space-y-4">` receives `id="faq-list"`; intro `<p class="speakable-faq-intro ...">` inserted before this div, after the `<h1>`
- `directions.astro` Speakable script (near end of file) — extend `cssSelector` array from 3 entries to 4; add `".speakable-city-directions"` as the 4th entry
- `directions.astro` per-city `<p>` elements — each city section has one primary direction paragraph (`class="text-body-lg text-on-surface-variant mb-4"`); add `speakable-city-directions` to that class list for Flagstaff, Williams, Las Vegas only

</code_context>

<specifics>
## Specific Values

- FAQ intro text (verbatim): `Spice Grill & Bar is an authentic Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona on historic Route 66. This page answers common questions about our hours, menu, vegetarian and vegan options, takeout, and location. Find the answer you need below.`
- FAQ Speakable CSS selector: `.speakable-faq-intro`
- Directions Speakable new selector: `.speakable-city-directions`
- AEO gate search string: `SpeakableSpecification` in `dist/faq/index.html`
- Three city sections receiving the class: `#flagstaff`, `#williams`, `#las-vegas` (NOT `#seligman`, `#kingman`, `#los-angeles`, `#phoenix`)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 14-speakable-coverage*
*Context gathered: 2026-05-14*
