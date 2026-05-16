# Phase 15: Voice Directions + Content Polish — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 15-voice-directions-content-polish
**Areas discussed:** HowTo step granularity, FAQ description copy, AEO audit gate

---

## HowTo Step Granularity

| Option | Description | Selected |
|--------|-------------|----------|
| Single step per city | One HowToStep with text = verbatim DOM paragraph. Simplest, guaranteed AEO text/DOM alignment. Voice reads the full paragraph as one instruction. | ✓ |
| Multi-step per city | 3-4 HowToStep elements splitting the paragraph (Take I-40 West → Drive 51 miles → Take Exit 146 → Turn right). Better sequential voice UX, but requires maintaining step text separately from the DOM paragraph. | |

**User's choice:** Single step per city
**Notes:** Requirement says "verbatim or near-verbatim from the corresponding DOM paragraph" — single-step naturally satisfies this. `supply` and `tool` fields omitted.

---

## FAQ Description Copy

| Option | Description | Selected |
|--------|-------------|----------|
| Draft A — topic-list style | "Answers to 34 questions about Spice Grill & Bar at I-40 Exit 146, Ash Fork, AZ: hours, menu, vegetarian and vegan options, takeout, payment, parking, bikers welcome, Route 66 dining, Grand Canyon proximity, and prices." (221 chars) | |
| Draft B — sentence style | "Spice Grill & Bar FAQ: hours, menu, vegetarian and vegan options, takeout and payment at I-40 Exit 146, Ash Fork, AZ on Route 66. Parking, biker-friendly, near Grand Canyon, and budget-friendly prices." (202 chars) | |
| Draft C — narrative style | "34 FAQs covering hours, menu, vegetarian and vegan options, takeout, payment, parking, and prices at Spice Grill & Bar — I-40 Exit 146, Ash Fork, AZ. Biker-friendly Indian restaurant on Route 66, 78 miles from the Grand Canyon." (228 chars) | ✓ |

**User's choice:** Draft C — narrative style
**Notes:** User specified "use 'I-40 Exit 146' not 'Exit 146' in the wording" — Draft C already satisfies this. This also surfaced a DOM consistency issue: the city `<p>` elements in directions.astro use "Exit 146" not "I-40 Exit 146", which would create schema/DOM drift. User decided to update DOM paragraphs too (see below).

### DOM Wording Follow-up

| Option | Description | Selected |
|--------|-------------|----------|
| Update DOM paragraphs too | Change "Exit 146" → "I-40 Exit 146" in Flagstaff, Williams, Las Vegas `<p>` elements. HowToStep.text stays verbatim. Consistent phrasing across all directions content. | ✓ |
| Schema only | Keep DOM paragraphs as-is. HowToStep.text uses near-verbatim substitution. Two sources of truth for the same info. | |

**User's choice:** Update DOM paragraphs too
**Notes:** Applies to all 3 HowTo city sections. Other 4 cities (Seligman, Kingman, LA, Phoenix) at Claude's discretion for consistency.

---

## AEO Audit Gate

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — existence check | Gate checks that `"@type":"HowTo"` appears in dist/directions/index.html. Simple, consistent with Phase 12/13/14 pattern. Skips gracefully if dist file doesn't exist. | ✓ |
| Yes — count check | Gate verifies exactly 3 HowTo objects. Stronger assertion but more fragile if a 4th city is added later. | |
| No gate | Phase 15 success criteria doesn't mention it. Skip to keep aeo-audit.mjs simpler. | |

**User's choice:** Yes — existence check
**Notes:** Follows the same `fs.existsSync` → `fs.readFileSync` → `.includes()` → `errors++` pattern established in Phase 12, 13, and 14.

---

## Claude's Discretion

- Whether to update all 7 city `<p>` elements or just the 3 HowTo cities for the "I-40 Exit 146" wording change
- Field ordering within each HowTo schema object
- Placement of the new HowTo `@graph` block within the directions.astro schema section
- Whether to use raw JSON `<script>` (existing directions.astro pattern) or Astro `is:inline set:html`
- Commit strategy (one or two commits)

## Deferred Ideas

- HowTo schemas for Seligman, Kingman, Los Angeles, Phoenix — already listed in REQUIREMENTS.md Future Requirements
