# Phase 14: Speakable Coverage - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-14
**Phase:** 14-speakable-coverage
**Areas discussed:** FAQ intro text, FAQ Speakable selector, AEO audit gate

---

## FAQ Intro Text

### Turn 1 — Lead approach

| Option | Description | Selected |
|--------|-------------|----------|
| Location-first | Lead with restaurant location, then what the FAQ covers | ✓ |
| Breadth-first | Lead with topic range, then anchor location | |
| You decide | Claude drafts, user reviews | |

**User's choice:** Location-first

### Turn 2 — Topic coverage

| Option | Description | Selected |
|--------|-------------|----------|
| Core topics only | Hours, menu, vegetarian options, location — short and authoritative | ✓ |
| Full breadth | All 34 topic clusters including bikers, parking, Route 66, Grand Canyon | |
| You decide | Claude picks given the 2-3 sentence constraint | |

**User's choice:** Core topics only

### Turn 3 — Draft selection

| Option | Description | Selected |
|--------|-------------|----------|
| Draft A | "Spice Grill & Bar is an authentic Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona on historic Route 66. This page answers common questions about our hours, menu, vegetarian and vegan options, takeout, and location. Find the answer you need below." | ✓ |
| Draft B | "Spice Grill & Bar is located at I-40 Exit 146 in Ash Fork, Arizona — a Punjabi Indian restaurant on Route 66. Below you will find answers to common questions about our hours, menu, vegetarian options, takeout, and how to find us." | |
| You decide | Claude picks whichever reads better for voice | |

**User's choice:** Draft A (verbatim text locked)

---

## FAQ Speakable Selector

### Turn 1 — Selector mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Class .speakable-faq-intro | class="speakable-faq-intro" on intro <p> — consistent with directions page pattern | ✓ |
| ID #faq-intro | id="faq-intro" on intro <p> — more specific, less consistent | |

**User's choice:** Class `.speakable-faq-intro`

### Turn 2 — Schema placement

| Option | Description | Selected |
|--------|-------------|----------|
| After </main>, before </Layout> | Consistent with directions.astro Speakable pattern | ✓ |
| Inside <main>, after Q&A list | Less conventional placement | |

**User's choice:** After `</main>`, before `</Layout>`

---

## AEO Audit Gate

### Turn 1 — Whether to add gate

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — add gate | Consistent with Phase 12/13 pattern; verifies dist/faq/index.html | ✓ |
| No — skip gate | Not explicitly required by AEO-12/13; keep script lean | |

**User's choice:** Yes — add gate

### Turn 2 — Gate scope

| Option | Description | Selected |
|--------|-------------|----------|
| FAQ Speakable only | Check dist/faq/index.html for SpeakableSpecification | ✓ |
| Both FAQ + Directions class | Also check dist/directions/index.html for speakable-city-directions | |

**User's choice:** FAQ Speakable only

---

## Claude's Discretion

- Field ordering within the WebPage schema object
- Whether to use `set:html={JSON.stringify(...)}` or inline raw JSON for the FAQ Speakable block
- Commit strategy (one or two commits)

## Deferred Ideas

None — discussion stayed within phase scope.
