# Phase 15: Voice Directions + Content Polish — Context

**Gathered:** 2026-05-14
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers two surgical additions — no new pages, no new npm packages.

**In scope:**
- `src/pages/directions.astro` — add a HowTo `@graph` schema block with three `HowTo` objects (Flagstaff PT46M, Williams PT18M, Las Vegas PT3H); update DOM `<p>` wording from "Exit 146" → "I-40 Exit 146" in Flagstaff, Williams, and Las Vegas sections (and optionally all 7 city sections for consistency)
- `src/pages/faq.astro` — expand `description` prop from 101 chars to ≥150 chars covering all 34 FAQ topic clusters
- `scripts/aeo-audit.mjs` — add CI gate verifying `"@type":"HowTo"` appears in `dist/directions/index.html`

**Out of scope:**
- HowTo schemas for the remaining 4 cities (Seligman, Kingman, Los Angeles, Phoenix) — deferred to future phase
- Changes to the FAQ Q&A cards or their styling
- New npm packages
- Any visual changes

</domain>

<decisions>
## Implementation Decisions

### HowTo Step Granularity
- **D-01:** One `HowToStep` per city — text is verbatim (or near-verbatim) from the single DOM `<p>` element in each city section. No multi-step breakdown.
- **D-02:** `supply` and `tool` fields are omitted — irrelevant for driving directions (per AEO-14 requirement).

### DOM Wording Update
- **D-03:** Update the three HowTo city `<p>` elements from "Exit 146" → "I-40 Exit 146":
  - `#flagstaff` `<p>`: "take **Exit 146** (Ash Fork...)" → "take **I-40 Exit 146** (Ash Fork...)"
  - `#williams` `<p>`: "take **Exit 146**" → "take **I-40 Exit 146**"
  - `#las-vegas` `<p>`: "take **Exit 146** in Ash Fork" → "take **I-40 Exit 146** in Ash Fork"
- **D-04:** The remaining 4 city sections (Seligman, Kingman, Los Angeles, Phoenix) may also have "Exit 146" → "I-40 Exit 146" updated at Claude's discretion for consistency — not required by success criteria but keeps content uniform.

### FAQ Meta Description Copy
- **D-05:** Replace current 101-char description with Draft C (228 chars):
  > *34 FAQs covering hours, menu, vegetarian and vegan options, takeout, payment, parking, and prices at Spice Grill & Bar — I-40 Exit 146, Ash Fork, AZ. Biker-friendly Indian restaurant on Route 66, 78 miles from the Grand Canyon.*
- **D-06:** The anchor phrase "I-40 Exit 146" (not "Exit 146") must appear in the description — already satisfied by Draft C.

### AEO Audit Gate
- **D-07:** Add a gate to `scripts/aeo-audit.mjs` that reads `dist/directions/index.html` and checks for `"@type":"HowTo"` (existence check only — not a count). Gate skips gracefully with `console.warn` when `dist/directions/index.html` doesn't exist (same pattern as Phase 12/13/14 gates). Increments shared `errors` counter on failure.

### Claude's Discretion
- Whether to update all 7 city `<p>` elements or just the 3 HowTo cities for the "I-40 Exit 146" wording change
- Field ordering within each `HowTo` schema object (`name`, `estimatedCost`, `totalTime`, `step`)
- Placement of the new HowTo `@graph` `<script>` block within the directions.astro schema section (after FAQPage, before or after Speakable)
- Whether to use raw JSON `<script type="application/ld+json">` (matching existing directions.astro pattern) or Astro `is:inline set:html` (matching other pages)
- Commit strategy: one or two commits

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Primary targets
- `src/pages/directions.astro` — current state: has FAQPage and Speakable `<script type="application/ld+json">` blocks after `</main>`; no HowTo schema yet; per-city `<p>` elements use class `text-body-lg text-on-surface-variant mb-4`; three target cities at `#flagstaff` (line ~89), `#williams` (line ~108), `#las-vegas` (line ~146)
- `src/pages/faq.astro` — current description (line 8): "Frequently asked questions about Spice Grill & Bar. Information on hours, location, and vegetarian options." — needs replacement with D-05 copy
- `scripts/aeo-audit.mjs` — new gate follows Phase 12/13/14 pattern: `fs.existsSync` guard → `fs.readFileSync` → `.includes('"@type":"HowTo"')` → `errors++` on failure, `console.warn` on skip

### Project-level
- `.planning/REQUIREMENTS.md` — AEO-14 and AEO-15 full specs with acceptance criteria
- `CLAUDE.md` — Astro 5 conventions, no new npm packages constraint
- `.planning/phases/14-speakable-coverage/14-CONTEXT.md` — Phase 14 AEO gate pattern reference (D-07, D-08); speakable-city-directions class added to same `<p>` elements this phase updates

### Schema pattern reference
- `src/pages/directions.astro` lines ~255–299 — existing raw JSON `<script type="application/ld+json">` blocks for FAQPage and Speakable — HowTo block follows same pattern

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Raw JSON `<script type="application/ld+json">` pattern already used in `directions.astro` for FAQPage (lines ~255–286) and Speakable (lines ~288–299) — HowTo block follows the same pattern
- Phase 12/13/14 AEO gate pattern in `aeo-audit.mjs`: `if (!fs.existsSync(distFile)) { console.warn(...); } else { const html = fs.readFileSync(distFile, 'utf8'); if (!html.includes('...')) { errors++; } }`

### Established Patterns
- All schema `<script>` blocks in directions.astro live after `</main>` before `</Layout>` — HowTo block goes in the same region
- The `speakable-city-directions` class was added to the Flagstaff, Williams, and Las Vegas `<p>` elements in Phase 14 — this phase updates the text content of those same elements

### Integration Points
- `directions.astro #flagstaff <p>` (line ~93): receives text update "Exit 146" → "I-40 Exit 146"; HowToStep.text is verbatim from this paragraph
- `directions.astro #williams <p>` (line ~112): same treatment
- `directions.astro #las-vegas <p>` (line ~150): same treatment
- `faq.astro:8` — `description` prop replacement (one-line change)
- `aeo-audit.mjs` — new gate block insertion point: after Phase 14 SpeakableSpecification gate, before final summary

</code_context>

<specifics>
## Specific Values

- FAQ description (verbatim, D-05): `34 FAQs covering hours, menu, vegetarian and vegan options, takeout, payment, parking, and prices at Spice Grill & Bar — I-40 Exit 146, Ash Fork, AZ. Biker-friendly Indian restaurant on Route 66, 78 miles from the Grand Canyon.`
- HowTo city durations: Flagstaff `PT46M`, Williams `PT18M`, Las Vegas `PT3H`
- HowTo origin city names: "Flagstaff, AZ", "Williams, AZ", "Las Vegas, NV"
- AEO gate search string: `"@type":"HowTo"` in `dist/directions/index.html`
- Three `<p>` elements receiving text update: `#flagstaff`, `#williams`, `#las-vegas`

</specifics>

<deferred>
## Deferred Ideas

- HowTo schemas for Seligman, Kingman, Los Angeles, Phoenix — listed in REQUIREMENTS.md as "Future Requirements (deferred)"

</deferred>

---

*Phase: 15-voice-directions-content-polish*
*Context gathered: 2026-05-14*
