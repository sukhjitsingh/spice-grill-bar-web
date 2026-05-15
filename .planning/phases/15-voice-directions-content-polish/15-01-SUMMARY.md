---
phase: 15-voice-directions-content-polish
plan: "01"
subsystem: directions-schema
tags: [aeo, howto-schema, voice-search, structured-data, directions]
dependency_graph:
  requires: []
  provides: [howto-schema-directions, i40-exit-146-uniformity]
  affects: [src/pages/directions.astro]
tech_stack:
  added: []
  patterns: [json-ld-graph, howto-schema, speakable-schema]
key_files:
  created: []
  modified:
    - src/pages/directions.astro
decisions:
  - "HowTo @graph block appended after Speakable script tag per plan D-01 and D-02 constraints"
  - "One HowToStep per city (no supply or tool fields) as specified"
  - "DOM paragraph text update applied to all 7 cities for uniformity"
metrics:
  duration: "4 minutes"
  completed: "2026-05-15"
  tasks_completed: 2
  files_modified: 1
---

# Phase 15 Plan 01: HowTo Schema and Exit 146 Content Uniformity Summary

HowTo JSON-LD @graph block for Flagstaff (PT46M), Williams (PT18M), and Las Vegas (PT3H) added to directions.astro, closing AEO-14; all 7 city direction paragraphs updated to consistent "I-40 Exit 146" wording.

## What Was Built

### Task 1: DOM Text Update — "Exit 146" to "I-40 Exit 146"

Updated all 7 city direction paragraphs in `src/pages/directions.astro` to replace `<strong>Exit 146</strong>` with `<strong>I-40 Exit 146</strong>`. The three speakable-city-directions paragraphs (Flagstaff, Williams, Las Vegas) from Phase 14 remain intact. The four non-speakable city sections (Seligman, Los Angeles, Kingman, Phoenix) were also updated for content uniformity per D-04.

- Commit: `1f457a4`
- Files: `src/pages/directions.astro`

### Task 2: HowTo @graph Schema Block

Appended a new `<script type="application/ld+json">` block after the Speakable block containing a HowTo @graph with 3 objects:

- **Flagstaff**: `totalTime: PT46M`, 1 HowToStep
- **Williams**: `totalTime: PT18M`, 1 HowToStep
- **Las Vegas**: `totalTime: PT3H`, 1 HowToStep

Each HowToStep text matches the updated DOM paragraph text verbatim (plain `&`, not `&amp;`). `@context` appears only at the top level, not inside individual HowTo objects. Raw JSON format (no `is:inline` or `set:html`).

- Commit: `359ed9b`
- Files: `src/pages/directions.astro`

## Verification Results

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| `<strong>I-40 Exit 146</strong>` in source | 7 | 7 | Yes |
| `<strong>Exit 146</strong>` remaining | 0 | 0 | Yes |
| `speakable-city-directions` class on `<p>` | 3 | 3 | Yes |
| `"@type": "HowTo"` in dist HTML | 3 | 3 | Yes |
| `"@type": "HowToStep"` in source | 3 | 3 | Yes |
| `totalTime: PT46M` | 1 | 1 | Yes |
| `totalTime: PT18M` | 1 | 1 | Yes |
| `totalTime: PT3H` | 1 | 1 | Yes |
| `@graph` in source | >= 1 | 1 | Yes |
| Speakable cssSelector unchanged | Yes | Yes | Yes |
| Build succeeds | Yes | Yes | Yes |

Note: Astro's build output preserves the JSON-LD formatting with spaces (`"@type": "HowTo"` not `"@type":"HowTo"`), unlike what the plan's verification grep expected. The plan said "Astro build minifies" but this build does not. The schema is correctly present in 3 instances in the built HTML.

## Deviations from Plan

None — plan executed exactly as written. Both D-01 (one HowToStep per city) and D-02 (no supply or tool fields) constraints honored. D-04 (Claude's discretion to update remaining 4 cities) was applied — all 7 cities updated for uniformity.

## Known Stubs

None. All three HowTo schema objects have real, hardcoded driving instruction text that matches DOM content.

## Threat Flags

None. This is a static site with hardcoded JSON-LD schema values. No user input reaches schema text. T-15-02 (schema/DOM divergence) was mitigated by executing Task 1 (DOM update) before Task 2 (schema copy) in a single session.

## Self-Check: PASSED

- `src/pages/directions.astro` exists and contains HowTo schema
- Commit `1f457a4` exists (Task 1)
- Commit `359ed9b` exists (Task 2)
- Build completed successfully in 83.61s
- `"@type": "HowTo"` appears 3 times in `dist/directions/index.html`
