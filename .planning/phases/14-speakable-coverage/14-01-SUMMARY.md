---
phase: 14-speakable-coverage
plan: "01"
subsystem: aeo
tags: [speakable, schema-org, json-ld, voice-search, aeo-audit, astro]

# Dependency graph
requires:
  - phase: 12-schema-entity-disambiguation
    provides: AEO gate pattern (existsSync + readFileSync + string match) used for new gate
  - phase: 13-faqpage-schema-compliance
    provides: FAQPage Question-count gate pattern followed for FAQ Speakable gate
provides:
  - SpeakableSpecification JSON-LD on /faq/ targeting .speakable-faq-intro class
  - id="faq-list" on outer FAQ container div for anchor references
  - Spoken-friendly 3-sentence intro paragraph above FAQ Q&A list
  - CI gate (gate 5) in aeo-audit.mjs verifying SpeakableSpecification in dist/faq/index.html
affects: [verifier, aeo-audit, faq-page]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Speakable schema block placement: after </main>, before </Layout> in Astro page files"
    - "Class-based Speakable selectors: .speakable-faq-intro pattern extends existing .speakable-* convention"
    - "AEO gate skip pattern: fs.existsSync guard + console.warn (no errors++) when dist file absent"

key-files:
  created: []
  modified:
    - src/pages/faq.astro
    - scripts/aeo-audit.mjs

key-decisions:
  - "Used raw JSON <script type='application/ld+json'> pattern (not set:html) for FAQ Speakable block — consistent with directions.astro existing Speakable blocks"
  - "Gate comment numbered '5.' per plan spec (reflecting full milestone context where Phase 12 @id gates will be present on main)"
  - "distFaqPath used 3 times in gate code (declaration + existsSync + readFileSync) — plan estimated 2 but actual implementation requires 3; gate logic is correct"

patterns-established:
  - "Speakable schema block: placed after </main> and before </Layout> in all Astro page files"
  - "AEO CI gate: fs.existsSync guard before fs.readFileSync; console.warn on skip (no errors++); console.error + errors++ on failure"

requirements-completed:
  - AEO-12

# Metrics
duration: 7min
completed: 2026-05-15
---

# Phase 14 Plan 01: Speakable Coverage — FAQ Summary

**SpeakableSpecification JSON-LD added to /faq/ targeting a spoken-friendly intro paragraph, with CI gate verifying presence in built HTML output**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-05-15T00:55:00Z
- **Completed:** 2026-05-15T01:02:54Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added 3-sentence location-first intro paragraph (`class="speakable-faq-intro"`) above the FAQ Q&A list in `/faq/`
- Injected `WebPage` + `SpeakableSpecification` JSON-LD schema block after `</main>` in `faq.astro`, targeting `.speakable-faq-intro` via cssSelector
- Added `id="faq-list"` to the outer FAQ container div for stable anchor references and future consumers (AEO-13 phase, page anchors)
- Added FAQ Speakable gate (gate 5) to `aeo-audit.mjs` — reads `dist/faq/index.html`, verifies `SpeakableSpecification` present, gracefully skips with `console.warn` if dist file absent
- All existing AEO audit gates continue to pass; `npm run test:aeo` exits 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Add intro paragraph, id annotation, and Speakable schema to faq.astro** - `223336f` (feat)
2. **Task 2: Add FAQ Speakable CI gate to aeo-audit.mjs** - `6bc48db` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/pages/faq.astro` — Added intro `<p class="speakable-faq-intro ...">` with D-01 verbatim text, `id="faq-list"` on container div, and `WebPage`+`SpeakableSpecification` JSON-LD block after `</main>`
- `scripts/aeo-audit.mjs` — Added gate 5: reads `dist/faq/index.html`, verifies `SpeakableSpecification` present, gracefully skips when file absent

## Decisions Made

- Used raw JSON `<script type="application/ld+json">` pattern (not `set:html={JSON.stringify(...)}`) for the FAQ Speakable block — the schema is static with no data-driven values, and matches the existing Speakable block pattern in `directions.astro`
- Gate comment numbered `// 5.` per plan spec, reflecting the full milestone context where Phase 12 @id gates exist on main (this worktree was branched from `Milestone_3_AEO_improvements` which has only 3 existing gates)
- `&amp;` entity encoding used in the intro `<p>` raw HTML per project convention (matches `directions.astro` heading encoding)

## Deviations from Plan

### Minor Plan Spec Discrepancy (no fix needed)

**1. [Rule 1 - Plan spec error] distFaqPath occurrence count**
- **Found during:** Task 2 verification
- **Issue:** Plan acceptance criteria states `grep -c "distFaqPath" scripts/aeo-audit.mjs` returns 2 (declaration + existsSync), but the actual implementation correctly uses the variable 3 times (declaration + existsSync + readFileSync). The plan's code example in D-07 shows the identical 3-use implementation.
- **Fix:** No fix needed — the implementation is correct. The plan underestimated the count. Gate behavior is correct and `npm run test:aeo` passes.
- **Files modified:** None
- **Verification:** `npm run test:aeo` exits 0; `✓ FAQ Speakable gate: SpeakableSpecification found in dist/faq/index.html`

---

**Total deviations:** 1 (plan spec discrepancy, no code change needed)
**Impact on plan:** No impact — the implementation matches the D-07 code example exactly and all gates pass.

## Issues Encountered

- First commit attempt failed commitlint `subject-case` rule — subject "add" needed to be sentence-case "Add". Fixed on second attempt.
- Prettier hook reflowed the intro paragraph across 3 lines (from 2) on commit. Content and entity encoding preserved; dist output verified correct after reflow.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- AEO-12 complete: `/faq/` now has a voice-extractable intro passage and CI-enforced Speakable gate
- Next plan (14-02) can proceed: Directions page Speakable extension (AEO-13) — add `speakable-city-directions` class to Flagstaff, Williams, Las Vegas `<p>` elements and extend `cssSelector` array

## Known Stubs

None — all data wired directly from `faq.json` and static schema values.

## Threat Flags

None — changes are purely additive static HTML and JSON-LD schema. No new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries. Threat model review per STRIDE: T-14-01 (Information Disclosure) and T-14-02 (Tampering) both accepted per plan's threat register.

---
*Phase: 14-speakable-coverage*
*Completed: 2026-05-15*
