# Phase 15: Voice Directions + Content Polish — Research

**Researched:** 2026-05-15
**Domain:** JSON-LD HowTo schema, Astro 5 static page, AEO gate scripting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** One `HowToStep` per city — text verbatim (or near-verbatim) from the single DOM `<p>` element. No multi-step breakdown.
- **D-02:** `supply` and `tool` fields are omitted.
- **D-03:** Update the three HowTo city `<p>` elements: "Exit 146" → "I-40 Exit 146" in `#flagstaff`, `#williams`, `#las-vegas`.
- **D-04:** Remaining 4 city sections (Seligman, Kingman, Los Angeles, Phoenix) — may also receive "I-40 Exit 146" at Claude's discretion for consistency.
- **D-05:** FAQ description replacement verbatim: `34 FAQs covering hours, menu, vegetarian and vegan options, takeout, payment, parking, and prices at Spice Grill & Bar — I-40 Exit 146, Ash Fork, AZ. Biker-friendly Indian restaurant on Route 66, 78 miles from the Grand Canyon.`
- **D-06:** Anchor phrase "I-40 Exit 146" must appear in the FAQ description.
- **D-07:** Add AEO gate to `scripts/aeo-audit.mjs` checking `"@type":"HowTo"` exists in `dist/directions/index.html`. Skip gracefully with `console.warn` when file absent; increment `errors` on failure.

### Claude's Discretion

- Whether to update all 7 city `<p>` elements or just the 3 HowTo cities for wording change
- Field ordering within each HowTo schema object (`name`, `estimatedCost`, `totalTime`, `step`)
- Placement of the new HowTo `@graph` `<script>` block within the directions.astro schema section
- Whether to use raw JSON `<script type="application/ld+json">` or `is:inline set:html` (matching existing directions.astro pattern is preferred)
- Commit strategy: one or two commits

### Deferred Ideas (OUT OF SCOPE)

- HowTo schemas for Seligman, Kingman, Los Angeles, Phoenix
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AEO-14 | Add HowTo schema block (three HowTo objects in a single @graph) for Flagstaff (PT46M), Williams (PT18M), Las Vegas (PT3H); HowToStep.text verbatim from DOM paragraph; supply/tool omitted | HowTo JSON-LD @graph structure verified — `@graph` array with multiple `@type:"HowTo"` items is valid JSON-LD; `totalTime` uses ISO 8601 duration; HowToStep.text is the core required field |
| AEO-15 | Rewrite faq.astro description prop to ≥150 chars covering all 34 FAQ topic clusters; anchor phrase "I-40 Exit 146, Ash Fork, AZ" | D-05 verbatim copy is 228 chars and already contains all required phrases; line 8 of faq.astro is the sole change point |
</phase_requirements>

---

## Summary

Phase 15 makes three surgical edits across two source files plus one audit script extension. No new pages, no new npm packages, no layout changes.

The primary deliverable is a `HowTo` JSON-LD `@graph` block in `directions.astro` covering Flagstaff, Williams, and Las Vegas. `@graph` containing multiple same-typed objects is valid JSON-LD 1.1 and is consistent with how the existing `FAQPage` and `Speakable` blocks already live in that file as sibling `<script>` tags. The HowTo schema has no Google rich-result value (deprecated September 2023) but is still parsed by voice assistants and AI engines — which is the entire point of AEO-14.

The FAQ description change (AEO-15) is a one-line swap on line 8 of `faq.astro` with no DOM impact.

The AEO gate addition to `aeo-audit.mjs` follows the identical pattern as the four existing gates (sections 4 and 5) — existsSync guard, readFileSync, string-includes check, errors increment.

**Primary recommendation:** Three-change set. (1) Edit the three Flagstaff/Williams/Las Vegas `<p>` elements to use "I-40 Exit 146". (2) Append the HowTo `@graph` `<script>` block after the existing Speakable block. (3) Add the AEO gate as section 6 in `aeo-audit.mjs` before the final summary block. (4) Update the faq.astro description on line 8. All four edits can land in one commit or two (directions + FAQ) — both are defensible atomic boundaries.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| HowTo schema emission | Astro SSG (build-time static HTML) | — | Schema injected as raw `<script>` in Astro page, compiled to static HTML at build time |
| DOM paragraph text update | Astro SSG (source edit) | — | Inline HTML in `.astro` file, rendered to static HTML |
| FAQ meta description | Astro SSG (Layout prop) | — | `description` prop flows into `<meta name="description">` via Layout.astro |
| AEO gate enforcement | CI script (Node.js) | — | `aeo-audit.mjs` reads `dist/` output, no runtime dependency |

---

## Standard Stack

### Core (already installed — zero new packages)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Static site compilation | Project framework — all pages are `.astro` |
| schema-dts | ^1.1.5 (installed); 2.0.0 available | TypeScript types for Schema.org | Used for type-safe schema objects in other schema components; NOT used for the raw JSON blocks in directions.astro |
| Node.js `fs` | built-in | AEO gate file reads | Same as all existing gates in aeo-audit.mjs |

**Version verification:** `schema-dts 2.0.0` was published 2026-03-23. The project pins `^1.1.5`. Since the HowTo block in directions.astro will use raw JSON (no TypeScript schema-dts types), this version difference is irrelevant — no upgrade needed. [VERIFIED: npm registry]

**No new installations required.** [VERIFIED: codebase grep confirmed]

---

## Architecture Patterns

### System Architecture Diagram

```
Source Edit (directions.astro)
  ├─ [3 city <p> text] "Exit 146" → "I-40 Exit 146"
  └─ [new <script> block] HowTo @graph (Flagstaff, Williams, Las Vegas)
         ↓
  Astro build (npm run build)
         ↓
  dist/directions/index.html
         ↓
  aeo-audit.mjs gate: includes('"@type":"HowTo"')
         ↓
  CI pass/fail

Source Edit (faq.astro)
  └─ [line 8 description prop] 101-char → 228-char Draft C
         ↓
  Astro build → dist/faq/index.html <meta name="description">
         ↓
  Lighthouse CI SEO score (no impact — content-only change)
```

### Recommended Project Structure (no changes needed)

```
src/pages/
├── directions.astro    # EDIT: 3 <p> text + 1 new <script> block
└── faq.astro           # EDIT: line 8 description prop only
scripts/
└── aeo-audit.mjs       # EDIT: new section 6 gate before final summary
```

### Pattern 1: Raw JSON `<script type="application/ld+json">` blocks in directions.astro

**What:** Inline schema markup placed after `</main>` before `</Layout>`. Two existing blocks already follow this pattern (FAQPage at lines 255–286, Speakable at lines 288–304).

**When to use:** This is the established pattern for this page. Use it — do not switch to `is:inline set:html` for consistency.

**Example (existing FAQPage block for reference):**
```html
<!-- After </main> before </Layout> -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [ ... ]
  }
</script>
```

**New HowTo block follows the same placement:**
```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "name": "How to get to Spice Grill & Bar from Flagstaff, AZ",
        "totalTime": "PT46M",
        "step": [
          {
            "@type": "HowToStep",
            "text": "From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes) and take I-40 Exit 146 (Ash Fork / Historic Route 66). Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right."
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to get to Spice Grill & Bar from Williams, AZ",
        "totalTime": "PT18M",
        "step": [
          {
            "@type": "HowToStep",
            "text": "From Williams, take I-40 West. Drive 18 miles (about 18 minutes) and take I-40 Exit 146. Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right."
          }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to get to Spice Grill & Bar from Las Vegas, NV",
        "totalTime": "PT3H",
        "step": [
          {
            "@type": "HowToStep",
            "text": "From Las Vegas, take US-93 South to I-40 East. Drive approximately 200 miles (about 3 hours) and take I-40 Exit 146 in Ash Fork. Turn left onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave."
          }
        ]
      }
    ]
  }
</script>
```

Note: `HowToStep.text` values above show the post-edit wording (after D-03 "I-40 Exit 146" updates) — these must match the DOM paragraphs verbatim. [CITED: schema.org/HowTo]

### Pattern 2: AEO gate — section structure in aeo-audit.mjs

**What:** Each gate is a numbered standalone section with an `fs.existsSync` guard, a `readFileSync` into a local variable, and an `.includes(searchString)` check.

**Current gate count:** 5 gates (FAQ word length + count, llms.txt sections, robots.txt bots, @id + FAQPage question count on dist/index.html, FAQ Speakable on dist/faq/index.html). [VERIFIED: aeo-audit.mjs read]

**Insertion point:** After the closing brace of section 5 (line 142), before the final summary block (line 144 `console.log('\n---...')`).

**New gate template (section 6):**
```javascript
// 6. HowTo schema gate — verifies HowTo present in dist/directions/index.html (AEO-14)
const distDirectionsPath = path.join(ROOT_DIR, 'dist/directions/index.html');
if (!fs.existsSync(distDirectionsPath)) {
  console.warn(
    '⚠ HowTo gate: dist/directions/index.html not found — skipping (run npm run build first for full audit)'
  );
} else {
  const distDirectionsHtml = fs.readFileSync(distDirectionsPath, 'utf-8');
  if (!distDirectionsHtml.includes('"@type":"HowTo"')) {
    console.error('✗ HowTo gate: "HowTo" schema not found in dist/directions/index.html');
    errors++;
  } else {
    console.log('✓ HowTo gate: HowTo schema found in dist/directions/index.html');
  }
}
```

[VERIFIED: pattern extracted from aeo-audit.mjs sections 4 and 5]

### Pattern 3: FAQ description prop (one-line change)

**What:** Line 8 of `faq.astro`, the `description` prop on `<Layout>`.

**Current value (101 chars):** `"Frequently asked questions about Spice Grill & Bar. Information on hours, location, and vegetarian options."`

**Replacement value (228 chars, D-05 verbatim):** `"34 FAQs covering hours, menu, vegetarian and vegan options, takeout, payment, parking, and prices at Spice Grill & Bar — I-40 Exit 146, Ash Fork, AZ. Biker-friendly Indian restaurant on Route 66, 78 miles from the Grand Canyon."`

[VERIFIED: faq.astro line 8 read; character count verified against CONTEXT.md D-05]

### Anti-Patterns to Avoid

- **Switching schema format mid-file:** directions.astro uses raw JSON `<script type="application/ld+json">` blocks — do NOT introduce `is:inline set:html` for the HowTo block. Mixed patterns within the same file create unnecessary inconsistency.
- **Adding `@context` inside @graph child objects:** `@context` belongs only at the top level. Each HowTo object inside `@graph` must NOT repeat `"@context": "https://schema.org"`. [CITED: ralphjsmit.com/combine-structured-data]
- **Using schema-dts TypeScript types for the HowTo block:** The existing FAQPage and Speakable blocks in directions.astro are raw JSON — not TypeScript schema-dts objects. Use raw JSON for the HowTo block too. schema-dts is used in separate `.astro` schema components, not in this page.
- **Editing the Speakable cssSelector array:** Phase 14 already finalized it with all four selectors. Do not touch it.
- **Editing the faq.astro intro paragraph:** Phase 14 locked the `speakable-faq-intro` content. AEO-15 only changes the `description` prop (line 8) — not the intro `<p>`.
- **Breaking the FAQPage Question count gate:** The existing gate in aeo-audit.mjs section 4 checks for exactly 8 `"@type":"Question"` entries in `dist/index.html`. Adding HowTo schema to `directions.astro` does not affect `index.html` — no risk.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ISO 8601 duration strings | Custom duration formatter | Hard-code the three known values | Only 3 values: `PT46M`, `PT18M`, `PT3H` — no dynamic computation needed |
| JSON-LD validation | Manual parser | Schema Markup Validator (validator.schema.org) | Free, authoritative, catches structural errors |
| AEO gate file-read helper | Shared utility function | Inline pattern per section | All existing gates inline — adding abstraction breaks the established pattern |

---

## Verified Current State (CRITICAL — confirmed by direct file reads)

### directions.astro — Exact Location of Every Edit

| What changes | Line(s) | Current value | Post-edit value |
|---|---|---|---|
| Flagstaff `<p>` text | 94–96 | `...take <strong>Exit 146</strong> (Ash Fork...` | `...take <strong>I-40 Exit 146</strong> (Ash Fork...` |
| Williams `<p>` text | 113–114 | `...take <strong>Exit 146</strong>. Turn right...` | `...take <strong>I-40 Exit 146</strong>. Turn right...` |
| Las Vegas `<p>` text | 152 | `...take <strong>Exit 146</strong> in Ash Fork...` | `...take <strong>I-40 Exit 146</strong> in Ash Fork...` |
| New HowTo `<script>` block | After line 304 (after Speakable block) | does not exist | New raw JSON @graph block |

**Phase 14 changes confirmed present:**
- Line 93: `class="speakable-city-directions text-body-lg text-on-surface-variant mb-4"` — Flagstaff `<p>` [VERIFIED]
- Line 112: same class — Williams `<p>` [VERIFIED]
- Line 150: same class — Las Vegas `<p>` [VERIFIED]
- Lines 297–300: Speakable cssSelector includes all four selectors including `.speakable-city-directions` [VERIFIED]

### faq.astro — Exact Location of Every Edit

| What changes | Line | Current value | Post-edit value |
|---|---|---|---|
| description prop | 8 | `"Frequently asked questions..."` (101 chars) | D-05 verbatim (228 chars) |

**Phase 14 changes confirmed present:**
- Line 18–22: `<p class="speakable-faq-intro ...">` intro paragraph [VERIFIED]
- Line 24: `<div id="faq-list" class="space-y-4">` [VERIFIED]
- Lines 37–48: WebPage + SpeakableSpecification schema block after `</main>` [VERIFIED]

### aeo-audit.mjs — Insertion Point

- File length: 151 lines [VERIFIED]
- Last gate (section 5, FAQ Speakable) ends at line 142 [VERIFIED]
- Final summary block starts at line 144 [VERIFIED]
- No `HowTo` gate exists yet [VERIFIED: grep found zero matches]
- Insertion: new section 6 block between lines 142 and 144

### HowToStep.text verbatim source (post D-03 update)

These are the exact DOM paragraph texts, after "Exit 146" → "I-40 Exit 146" substitution:

**Flagstaff:** `From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes) and take I-40 Exit 146 (Ash Fork / Historic Route 66). Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right.`

**Williams:** `From Williams, take I-40 West. Drive 18 miles (about 18 minutes) and take I-40 Exit 146. Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right.`

**Las Vegas:** `From Las Vegas, take US-93 South to I-40 East. Drive approximately 200 miles (about 3 hours) and take I-40 Exit 146 in Ash Fork. Turn left onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave.`

Note: The DOM contains HTML entities (`&amp;`) — the JSON-LD `text` value must use plain `&` (not `&amp;`) because JSON is not HTML. [ASSUMED — standard JSON-LD practice; HTML entities are HTML-layer encoding only]

---

## Common Pitfalls

### Pitfall 1: HTML entities in JSON-LD text values

**What goes wrong:** Copying `&amp;` from the Astro source into the JSON-LD `"text"` field produces invalid schema text — voice assistants receive `"Spice Grill &amp; Bar"` literally.

**Why it happens:** The DOM source uses `&amp;` for HTML escaping. JSON-LD `text` values are plain strings, not HTML.

**How to avoid:** Use plain `&` in all JSON-LD `"text"` string values.

**Warning signs:** schema.org validator reports text anomalies; voice assistant speaks "&amp;" aloud.

### Pitfall 2: Repeating `@context` inside @graph children

**What goes wrong:** Adding `"@context": "https://schema.org"` inside each HowTo object inside `@graph` creates a nested context override — technically valid JSON-LD but redundant and can confuse parsers.

**Why it happens:** Cargo-culting the single-object template into a @graph array.

**How to avoid:** `@context` lives only at the top level, outside `@graph`.

### Pitfall 3: HowToStep.text not matching DOM after D-03 wording update

**What goes wrong:** If D-03 ("Exit 146" → "I-40 Exit 146") is applied to DOM but not to the `HowToStep.text`, schema text diverges from DOM. AEO text-DOM alignment policy (stated in AEO-14) requires near-verbatim match.

**Why it happens:** Editing DOM and schema in separate passes without cross-checking.

**How to avoid:** The plan should update DOM text first, then copy the updated text directly into `HowToStep.text`. A single task that does both changes atomically is safest.

### Pitfall 4: Touching Phase 14 changes

**What goes wrong:** Accidentally removing the `speakable-city-directions` class from the three `<p>` elements while editing their text content.

**Why it happens:** Replacing the entire class attribute string when only the text content of the `<strong>` needs editing.

**How to avoid:** Only change the text node inside `<strong>Exit 146</strong>` — the surrounding `<p class="...">` element and its classes must not change.

### Pitfall 5: AEO gate search string whitespace sensitivity

**What goes wrong:** Astro's build output may minify JSON-LD, which affects how the string appears in HTML. The search string `"@type":"HowTo"` (no space) is the correct target for Astro's minified output.

**Why it happens:** If `"@type": "HowTo"` (with space) is used, gate passes in dev but fails against minified output.

**How to avoid:** Use `'"@type":"HowTo"'` (no space) — identical to the search strings used in existing gates (`'"@type":"Question"'` works in the current FAQPage gate).

**Verification:** Look at the existing gate on line 119: `/"@type":"Question"/g` — no space. Follow the same pattern.

---

## Code Examples

### Complete HowTo @graph block (ready to copy)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "name": "How to get to Spice Grill & Bar from Flagstaff, AZ",
      "totalTime": "PT46M",
      "step": [
        {
          "@type": "HowToStep",
          "text": "From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes) and take I-40 Exit 146 (Ash Fork / Historic Route 66). Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right."
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to get to Spice Grill & Bar from Williams, AZ",
      "totalTime": "PT18M",
      "step": [
        {
          "@type": "HowToStep",
          "text": "From Williams, take I-40 West. Drive 18 miles (about 18 minutes) and take I-40 Exit 146. Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right."
        }
      ]
    },
    {
      "@type": "HowTo",
      "name": "How to get to Spice Grill & Bar from Las Vegas, NV",
      "totalTime": "PT3H",
      "step": [
        {
          "@type": "HowToStep",
          "text": "From Las Vegas, take US-93 South to I-40 East. Drive approximately 200 miles (about 3 hours) and take I-40 Exit 146 in Ash Fork. Turn left onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave."
        }
      ]
    }
  ]
}
```

[CITED: schema.org/HowTo — HowTo and HowToStep property definitions; JSON-LD W3C spec — @graph array syntax]

### AEO gate section 6 (ready to insert at line 143)

```javascript
// 6. HowTo schema gate — verifies HowTo present in dist/directions/index.html (AEO-14)
const distDirectionsPath = path.join(ROOT_DIR, 'dist/directions/index.html');
if (!fs.existsSync(distDirectionsPath)) {
  console.warn(
    '⚠ HowTo gate: dist/directions/index.html not found — skipping (run npm run build first for full audit)'
  );
} else {
  const distDirectionsHtml = fs.readFileSync(distDirectionsPath, 'utf-8');
  if (!distDirectionsHtml.includes('"@type":"HowTo"')) {
    console.error('✗ HowTo gate: HowTo schema not found in dist/directions/index.html');
    errors++;
  } else {
    console.log('✓ HowTo gate: HowTo schema found in dist/directions/index.html');
  }
}
```

[VERIFIED: pattern matches sections 4 and 5 of aeo-audit.mjs exactly]

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HowTo = Google rich results (star steps in SERP) | HowTo = AI/voice-only signal (no visible Google rich result) | September 2023 | Value is voice assistant + AI engine parsing, NOT SERP visual feature |
| Single `@type` per `<script>` block | `@graph` array allows multiple same-type objects in one block | JSON-LD 1.1 (established) | Multiple HowTo cities can share one `<script>` tag |

**Deprecated:**
- HowTo Google rich results (August–September 2023): Google removed the feature entirely. Schema remains valid and is still processed by voice assistants and AI crawlers. [CITED: developers.google.com/search/docs/appearance/structured-data/how-to changelog]

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | HTML entities (`&amp;`) in Astro source must be plain `&` in JSON-LD text values | Pitfall 1, Code Examples | If Astro somehow processes entity refs in raw `<script>` blocks before output, text might be double-encoded. Low risk — raw `<script>` blocks pass through unmodified. |
| A2 | Astro build minifies JSON-LD by removing spaces around `:` in key-value pairs | Pitfall 5 | If Astro does not minify, gate string `'"@type":"HowTo"'` would still match because it checks for substring. No risk of false negative, only false positive if Astro adds spaces (unlikely given existing gates pass). |

---

## Environment Availability

This phase is code-only. External dependencies (Astro build toolchain) are already in use on this machine. No new tool audit required.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js + npm | Build + AEO audit | Already in use | Current project version | — |
| Astro build (`npm run build`) | Gate verification | Already in use | Astro 5.x | — |

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Node.js script (`scripts/aeo-audit.mjs`) + Lighthouse CI |
| Config file | `.lighthouserc.json` |
| Quick run command | `npm run test:aeo` (after `npm run build`) |
| Full suite command | `npm run qa` (build + lint + typecheck + AEO + Lighthouse CI) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AEO-14 | `"@type":"HowTo"` present in `dist/directions/index.html` | build-output check | `npm run build && npm run test:aeo` | ✅ (gate to be added in this phase — Wave 0) |
| AEO-15 | faq.astro description ≥150 chars, contains "I-40 Exit 146" | manual char-count + grep | `grep -c "I-40 Exit 146" src/pages/faq.astro` | ✅ |

### Sampling Rate

- **Per task commit:** `npm run build && npm run test:aeo` (full AEO gate suite including new HowTo gate)
- **Per wave merge:** `npm run qa` (full suite: build + lint + typecheck + AEO + Lighthouse CI)
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] New AEO gate section 6 in `scripts/aeo-audit.mjs` — must be written before it can validate AEO-14. The gate itself IS the test; it does not exist yet and must be created as part of this phase.

*(Lighthouse CI infrastructure and `aeo-audit.mjs` framework are fully present — only the new gate code is missing)*

---

## Security Domain

This phase makes no changes relevant to authentication, session management, access control, cryptography, or user input handling. The changes are:

1. Static text edits in `.astro` files (compiled to static HTML at build time)
2. A read-only CI script that checks file contents

No ASVS categories apply. No threat patterns introduced.

---

## Project Constraints (from CLAUDE.md)

| Constraint | Impact on Phase 15 |
|---|---|
| No new npm packages | Confirmed — zero new dependencies |
| Astro 5 static site | All changes are build-time static; no SSR or runtime code |
| `npm run qa` must pass before push (pre-push hook) | Planner must include a final `npm run qa` verification step |
| LCP < 4000ms, TBT < 600ms, CLS < 0.105 | Content-only changes (text + JSON-LD) have zero JS impact — no Lighthouse regression risk |
| SEO ≥ 90, Accessibility ≥ 90 | Adding correct structured data does not degrade either metric |
| Conventional commits enforced | Commit messages must use `feat:` or `fix:` prefix |
| All 5 pages audited by Lighthouse CI | `["/", "/near-grand-canyon/", "/near-williams/", "/directions/", "/faq/"]` — this phase edits only `/directions/` and `/faq/`; other 3 pages are untouched |

---

## Open Questions

1. **D-04 discretion — update all 7 or only 3 city paragraphs?**
   - What we know: D-04 explicitly grants Claude's discretion. Seligman, Kingman, Los Angeles, Phoenix sections all use bare "Exit 146" in their `<p>` elements (verified: lines 133, 171, 190, 209 use `<strong>Exit 146</strong>`).
   - What's unclear: Is consistency worth the marginal extra edit time?
   - Recommendation: Update all 7 for content uniformity. The 4 non-HowTo cities are out of AEO-14 scope but D-04 explicitly permits this. Risk is zero — it's the same one-word substitution.

2. **HowToStep text — use em-dash (—) or hyphen?**
   - What we know: The DOM paragraphs use `—` (em-dash) via the HTML character directly.
   - What's unclear: Some JSON parsers handle this; some toolchains encode it differently.
   - Recommendation: Copy the em-dash character as-is into the JSON string. Astro passes raw `<script>` blocks through unmodified. [ASSUMED]

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: aeo-audit.mjs direct read] — All existing gate patterns, insertion point, search string format
- [VERIFIED: directions.astro direct read] — Exact line numbers, current `<p>` text, Speakable block location, schema block boundaries
- [VERIFIED: faq.astro direct read] — Current description value (line 8), Phase 14 intro paragraph, Speakable block
- [VERIFIED: npm registry] — schema-dts 2.0.0 is latest; project uses ^1.1.5; irrelevant to this phase
- [CITED: schema.org/HowTo] — HowTo.totalTime (ISO 8601), HowTo.step (HowToStep), HowToStep.text
- [CITED: W3C JSON-LD 1.1] — @graph array structure, @context scope

### Secondary (MEDIUM confidence)
- [CITED: developers.google.com/search/docs/appearance/structured-data/how-to] — HowTo rich results deprecated September 2023; schema still valid for voice/AI
- [CITED: ralphjsmit.com/combine-structured-data] — @graph consolidates multiple schema types; @context only at top level

### Tertiary (LOW confidence)
- WebSearch results on HowTo schema voice assistant value — corroborated by multiple sources, no single authoritative source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages, all tooling verified in-repo
- Architecture: HIGH — verified exact file states, exact line numbers, exact current values
- Pitfalls: HIGH — derived from direct inspection of file patterns and established gate code
- HowTo @graph validity: MEDIUM — JSON-LD spec supports it; no specific "multiple HowTo in @graph" official Google documentation exists (Google deprecated HowTo entirely); pattern is structurally sound

**Research date:** 2026-05-15
**Valid until:** 2026-06-15 (static content; Astro/schema-dts versions unlikely to affect this in 30 days)
