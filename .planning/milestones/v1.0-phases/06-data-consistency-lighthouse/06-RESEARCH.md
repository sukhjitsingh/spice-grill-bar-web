# Phase 6: Data Consistency & Lighthouse Coverage — Research

**Researched:** 2026-02-21
**Domain:** Data consistency (JSON + multi-file NAP sync), URI format standardization, Lighthouse CI configuration
**Confidence:** HIGH — all findings verified directly from source files in the codebase

---

## Summary

Phase 6 closes three narrowly scoped gaps identified during the v1.0 milestone audit. No new libraries,
no new pages, no architectural changes. The work is purely corrective: one JSON field edit, three HTML
attribute edits across three files, and one JSON array addition.

The Flagstaff distance in `faq.json` entry 6 still says "about 50 miles...roughly a 40-minute drive"
while every other surface in the codebase — `near-grand-canyon.astro`, `directions.astro`,
`llms.txt`, and `llms-full.txt` — uses the verified value of "51 miles...46 minutes". This
cross-phase data drift (INT-01 from the v1.0 audit) is a single answer string replacement.

The `tel:` URI inconsistency was introduced when `directions.astro` was written with correct E.164
format (`tel:+19282771292`) but `Footer.astro`, `Header.tsx`, and `MobileActionButtons.astro` were
never updated. Three attribute values need to change from `tel:9282771292` to `tel:+19282771292`.

The `/faq/` URL is missing from `.lighthouserc.json`. The existing Explore section in `Footer.astro`
links to `/faq/` and the route exists as `src/pages/faq.astro`, so the page is live and auditable.
Adding it to the `url` array in `.lighthouserc.json` completes Lighthouse CI coverage for all four
content pages.

**Primary recommendation:** Execute all three fixes in one plan (06-01-PLAN.md). Each fix is a
targeted string replacement with zero coupling to the others. Run `npm run qa` to confirm no
regressions.

---

<phase_requirements>
## Phase Requirements

| ID      | Description                                                                                                                                                                       | Research Support                                                                                                                    |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| FAQ-01  | faq.json must contain highway/route-specific entries covering Flagstaff distance and drive time                                                                                   | Entry 6 exists and is the right question; only the answer string needs to change from "50 miles / 40 min" to "51 miles / 46 minutes" |
| CONT-02 | `/near-grand-canyon/` and `/directions/` URLs in `.lighthouserc.json` so Lighthouse CI audits new pages on every push                                                             | Confirmed both are in `url` array; `/faq/` is the remaining gap to close                                                           |
| CONT-05 | `/directions/` page with per-city H2 sections, `<address>` block with NAP data, Google Maps embed, and internal links — verified; `tel:` URI format is the remaining consistency item | All `<address>` blocks in `directions.astro` already use `tel:+19282771292`; non-directions surfaces still use bare format          |
</phase_requirements>

---

## Standard Stack

### Core

| Library / File        | Version     | Purpose                          | Why Standard                                    |
|-----------------------|-------------|----------------------------------|-------------------------------------------------|
| `src/data/faq.json`   | (data file) | Source of truth for FAQ content  | Already the canonical data file; no new tools   |
| `.lighthouserc.json`  | (config)    | Lighthouse CI URL list           | Already the config used by `npm run test:lhci`  |
| `src/components/Footer.astro` | —   | Footer phone link                | One of three files with bare `tel:` URI         |
| `src/components/Header.tsx`   | —   | Header desktop phone link        | One of three files with bare `tel:` URI         |
| `src/components/MobileActionButtons.astro` | — | Mobile floating CTA phone link | One of three files with bare `tel:` URI |

### Supporting

| Tool           | Purpose                    | When to Use                                           |
|----------------|----------------------------|-------------------------------------------------------|
| `npm run qa`   | Full build + quality check | After all edits — pre-push gate, confirms no regressions |
| `npm run build`| Build site to `./dist/`    | Required before `npm run test:lhci` can audit pages   |

### Alternatives Considered

| Instead of             | Could Use                          | Tradeoff                                              |
|------------------------|------------------------------------|-------------------------------------------------------|
| Direct file edits      | Script to normalize `tel:` URIs   | Script adds complexity for 3 occurrences; direct edit is faster and safer |
| Single-plan execution  | Separate plans per fix             | Overhead not justified; all three are same-file-type edits with no dependencies |

---

## Architecture Patterns

### Recommended Project Structure

No structural changes. All edits are within existing files:

```
src/
├── data/faq.json                          # Fix Flagstaff answer (line 24)
├── components/Footer.astro                # Fix tel: URI (line 40)
├── components/Header.tsx                  # Fix tel: URI (line 68)
└── components/MobileActionButtons.astro   # Fix tel: URI (line 15)
.lighthouserc.json                         # Add /faq/ to url array (line 5)
```

### Pattern 1: E.164 tel: URI format

**What:** The correct format for phone links in HTML is the E.164 standard — country code prefix with
no separators: `tel:+19282771292`. The human-readable display text remains `(928) 277-1292`.

**When to use:** All `href="tel:..."` attributes across the codebase.

**Example (from `directions.astro` — correct pattern):**
```html
<a href="tel:+19282771292" class="hover:text-brand-orange transition-colors">
  (928) 277-1292
</a>
```

**Wrong pattern (currently in Footer, Header, MobileActionButtons):**
```html
<a href="tel:9282771292" ...>
```

**Why E.164 matters for SEO/AEO:** Structured data in `RestaurantSchema.astro` already uses
`+1-928-277-1292` (E.164 with dashes). Consistency between schema telephone values and `tel:` href
attributes reduces the risk of data extraction tools producing conflicting phone values for AI engines.

### Pattern 2: Lighthouserc.json URL array extension

**What:** `.lighthouserc.json` `ci.collect.url` is a JSON array of page paths (relative to
`staticDistDir`). Adding `/faq/` ensures the built `/dist/faq/index.html` is audited.

**Current state:**
```json
"url": ["/", "/near-grand-canyon/", "/directions/"]
```

**Target state:**
```json
"url": ["/", "/near-grand-canyon/", "/directions/", "/faq/"]
```

**Why `/faq/` was omitted originally:** CONT-02 requirement was scoped to "add new GEO content pages"
(`/near-grand-canyon/` and `/directions/`). The `/faq/` page pre-existed CONT-02 and was not
included. The v1.0 audit identified this as a pre-existing gap in tech debt.

### Pattern 3: faq.json answer string correction

**What:** faq.json entry for "Where to eat between Flagstaff and the Grand Canyon?" (index 5,
0-based) contains an answer that uses the old distance values.

**Current (wrong):**
```json
"answer": "Spice Grill & Bar is about 50 miles west of Flagstaff on I-40, roughly a 40-minute drive. Take Exit 146 in Ash Fork for Indian food before or after your Grand Canyon visit."
```

**Target (correct — matching verified values used everywhere else):**
```json
"answer": "Spice Grill & Bar is about 51 miles west of Flagstaff on I-40, roughly a 46-minute drive. Take Exit 146 in Ash Fork for Indian food before or after your Grand Canyon visit."
```

**Authoritative source for "51 miles / 46 minutes":**
- `src/pages/near-grand-canyon.astro` line 62: "about 51 miles from Flagstaff, AZ — about 46 minutes"
- `src/pages/directions.astro` line 104: "51 Miles, About 46 Minutes West on I-40"
- `src/pages/directions.astro` line 107: "Drive 51 miles (about 46 minutes)"
- `src/pages/directions.astro` line 314 (inline FAQ schema): "51 miles west of Flagstaff...46-minute drive"
- `public/llms.txt` line 21: "51 miles west of Flagstaff on I-40"
- `public/llms-full.txt` line 26: "51 miles west of Flagstaff on I-40"

### Anti-Patterns to Avoid

- **Over-scoping:** Do not touch `geo.position` coordinate precision mismatch — that is documented as
  a cosmetic tech debt item (~14m offset) and is explicitly out of scope for this phase.
- **Modifying schema files:** `RestaurantSchema.astro` telephone is already in E.164 format with
  dashes (`+1-928-277-1292`). Do not change it — the `tel:` href format (`tel:+19282771292`, no
  dashes) is correct and distinct from the schema display format.
- **Touching Header.tsx navigation array:** Header navigation changes are locked out per user
  decision documented in `04-CONTEXT.md` and `STATE.md`. The only edit in `Header.tsx` is the
  `tel:` href attribute value on the phone link (line 68), not the nav array.

---

## Don't Hand-Roll

| Problem              | Don't Build                      | Use Instead            | Why                                                            |
|----------------------|----------------------------------|------------------------|----------------------------------------------------------------|
| Finding all tel: URIs | grep/find script                | Grep tool in planning  | Already done — 3 occurrences confirmed, locations are known    |
| Distance verification | Web lookup or calculation      | Use values already in codebase | Phase 5 research already verified 51 mi / 46 min; consistent across 6 surfaces |

**Key insight:** Every fix in this phase is a string replacement in a known file at a known line.
No discovery needed — the research phase has already identified all occurrences.

---

## Common Pitfalls

### Pitfall 1: Assuming tel: format is purely cosmetic

**What goes wrong:** Leaving bare `tel:9282771292` links, assuming mobile OS auto-detection handles it.

**Why it matters for this project:** AEO/schema consistency. The RestaurantSchema.astro telephone
property uses E.164 (`+1-928-277-1292`). If AI engines extract phone data from both schema and
HTML `tel:` href attributes, bare format creates ambiguity. Consistency is required for the
"zero known inconsistencies" milestone goal.

**How to avoid:** Change all three occurrences. Do not change the display text — only the `href`
attribute value.

**Warning signs:** After edits, `grep -r 'tel:9' src/` should return zero matches.

### Pitfall 2: Lighthouse CI cannot audit /faq/ if the build is stale

**What goes wrong:** Adding `/faq/` to `.lighthouserc.json` but running `npm run test:lhci`
against an old `./dist/` that does not have a `/faq/index.html`.

**Why it happens:** `npm run test:lhci` reads from `staticDistDir: "./dist"` — it does not rebuild.

**How to avoid:** `npm run qa` runs `build` before `test:lhci`. Always use `npm run qa` for final
verification, not `npm run test:lhci` directly.

**Warning signs:** Lighthouse reports 404 for `/faq/` URL.

### Pitfall 3: Editing wrong faq.json entry

**What goes wrong:** Editing the first FAQ entry ("Is there an Indian restaurant near the Grand
Canyon?") which mentions a different route and correctly states 78 miles — not the Flagstaff entry.

**Why it happens:** Both entries mention Grand Canyon proximity. The Flagstaff entry is the 6th
entry (index 5, 0-based; line 23–25 in the JSON file).

**How to avoid:** The discriminating question text is "Where to eat between Flagstaff and the
Grand Canyon?" — confirm the question before editing the answer. The old values "50 miles" and
"40-minute" are the unique identifiers in the answer string.

---

## Code Examples

All verified from codebase inspection (2026-02-21):

### faq.json — Flagstaff entry before and after

```json
// BEFORE (current — WRONG):
{
  "question": "Where to eat between Flagstaff and the Grand Canyon?",
  "answer": "Spice Grill & Bar is about 50 miles west of Flagstaff on I-40, roughly a 40-minute drive. Take Exit 146 in Ash Fork for Indian food before or after your Grand Canyon visit."
}

// AFTER (correct):
{
  "question": "Where to eat between Flagstaff and the Grand Canyon?",
  "answer": "Spice Grill & Bar is about 51 miles west of Flagstaff on I-40, roughly a 46-minute drive. Take Exit 146 in Ash Fork for Indian food before or after your Grand Canyon visit."
}
```

### Footer.astro — tel: URI fix (line 40)

```astro
// BEFORE:
href="tel:9282771292"

// AFTER:
href="tel:+19282771292"
```

### Header.tsx — tel: URI fix (line 68)

```tsx
// BEFORE:
<a href="tel:9282771292" aria-label="Call us">

// AFTER:
<a href="tel:+19282771292" aria-label="Call us">
```

### MobileActionButtons.astro — tel: URI fix (line 15)

```astro
// BEFORE:
href="tel:9282771292"

// AFTER:
href="tel:+19282771292"
```

### .lighthouserc.json — add /faq/ to url array

```json
// BEFORE:
"url": ["/", "/near-grand-canyon/", "/directions/"]

// AFTER:
"url": ["/", "/near-grand-canyon/", "/directions/", "/faq/"]
```

---

## State of the Art

No framework or library version changes in this phase. This is purely data/config correction.

| Old Approach                 | Current Approach       | When Changed | Impact                                |
|------------------------------|------------------------|--------------|---------------------------------------|
| Bare tel: URIs (`tel:9282771292`) | E.164 (`tel:+19282771292`) | Phase 5 partially (directions.astro correct, others not) | AI/browser consistency |
| 3-URL Lighthouse CI coverage | 4-URL coverage          | Phase 6       | All live pages audited on every push   |
| Flagstaff: 50 mi / 40 min    | 51 mi / 46 min          | Phase 6       | Single source of truth across all surfaces |

---

## Open Questions

1. **Does the /faq/ page currently pass Lighthouse CI thresholds?**
   - What we know: `/faq/` page exists, renders all 20 FAQ entries from `faq.json`, inherits all
     schema via `Layout.astro`. No performance-heavy components (no GoogleMap, no React hydration).
   - What's unclear: Whether the global FAQSchema injection (all 20 entries on every page) causes
     a Rich Results warning on `/faq/` where FAQ content IS visible — but this would be a pre-existing
     issue not introduced by adding the URL to `.lighthouserc.json`.
   - Recommendation: Add URL, run `npm run qa`, treat any new Lighthouse failure as a separate
     issue requiring a follow-up plan. Current expectation is pass (page is lightweight, static HTML).

2. **Should the faq.json answer preserve the conversational "roughly" phrasing?**
   - What we know: All other surfaces use "about 46 minutes" or "about 46-minute drive" (directions
     inline schema). The current wrong answer says "roughly a 40-minute drive."
   - Recommendation: Use "roughly a 46-minute drive" to preserve the conversational register
     consistent with other faq.json answers. The critical correction is the numbers (51 / 46),
     not the qualifier word.

---

## Sources

### Primary (HIGH confidence — codebase inspection)

All findings below are verified by direct file reads on 2026-02-21:

- `src/data/faq.json` — Confirmed entry 6 (0-based index 5) contains "50 miles" and "40-minute"
- `src/pages/near-grand-canyon.astro` line 62 — "51 miles from Flagstaff, AZ — about 46 minutes"
- `src/pages/directions.astro` lines 104, 107, 314 — "51 miles...46 minutes" (H2, paragraph, inline FAQ schema)
- `public/llms.txt` line 21 — "51 miles west of Flagstaff on I-40"
- `public/llms-full.txt` line 26 — "51 miles west of Flagstaff on I-40"
- `src/components/Footer.astro` line 40 — `href="tel:9282771292"` (bare, needs E.164)
- `src/components/Header.tsx` line 68 — `href="tel:9282771292"` (bare, needs E.164)
- `src/components/MobileActionButtons.astro` line 15 — `href="tel:9282771292"` (bare, needs E.164)
- `src/pages/directions.astro` lines 114, 136, 158, 180, 202, 224, 246 — already correct (`tel:+19282771292`)
- `.lighthouserc.json` line 5 — `url` array contains 3 entries; `/faq/` is absent
- `src/pages/faq.astro` — page exists, routes to `/faq/`, lightweight static HTML

### Secondary

- `.planning/v1.0-MILESTONE-AUDIT.md` — INT-01 and tech debt list: authoritative audit record of all gaps
- `.planning/ROADMAP.md` Phase 6 — defines success criteria and requirement IDs this phase addresses
- `.planning/STATE.md` — confirms Header.tsx navigation changes are locked (user decision)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all files verified by direct read, no external dependencies
- Architecture: HIGH — no new patterns; existing patterns confirmed working (directions.astro as reference)
- Pitfalls: HIGH — all identified from audit evidence and direct code inspection

**Research date:** 2026-02-21
**Valid until:** N/A — findings based on static codebase snapshot; valid until files are changed
