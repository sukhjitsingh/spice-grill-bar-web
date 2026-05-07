---
phase: 11-aeo-refinement
plan: 02
subsystem: schema
tags: [aeo, schema, restaurant-schema, opening-hours, area-served, p0-fix]

requires: [11-01-owner-confirmation]
provides:
  - "RestaurantSchema.astro openingHoursSpecification now lists Monday (opens 08:00 / closes 21:00) merged with Tue-Thu"
  - "Built dist/index.html JSON-LD contains 'https://schema.org/Monday'"
  - "Kaibab Estates West areaServed entry upgraded from bare City to Place with description"
  - "Kaibab description reflects owner-confirmed direction: ~5 miles NORTH of Ash Fork (NOT east on I-40)"
affects: [11-03-llms-files, 11-05-restaurant-schema-enrichment, 11-07-near-williams-page]

tech-stack:
  added: []
  patterns:
    - "schema-dts WithContext<Restaurant> areaServed accepts both City and Place — Place used here for non-incorporated communities (matches existing Grand Canyon South Rim / I-40 Corridor precedent)"

key-files:
  created:
    - .planning/phases/11-aeo-refinement/11-02-SUMMARY.md
  modified:
    - src/components/schema/RestaurantSchema.astro

key-decisions:
  - "Merged Monday into the existing Tue-Thu OpeningHoursSpecification block (one entry, not a separate Monday block) — hours match exactly, more compact, schema-dts-preferred"
  - "Used owner-confirmed Kaibab direction ('~5 miles north of Ash Fork') instead of plan-prescribed 'east on I-40 (~6 minutes)' — plan text was authored before the 11-01 owner-confirmation correction"

patterns-established:
  - "When a downstream plan's prescribed copy disagrees with an upstream owner-confirmation SUMMARY, the SUMMARY wins (Rule 1 deviation): apply the corrected value and document the deviation"

requirements-completed: [AEO-01, AEO-03]

duration: 3 min
completed: 2026-05-06
---

# Phase 11 Plan 02: Restaurant Schema Hours + Kaibab Place Upgrade Summary

**Closed AEO-01 P0 hours drift by adding Monday to RestaurantSchema.astro openingHoursSpecification, and upgraded Kaibab Estates West areaServed entry from bare City to Place with an owner-corrected proximity description.**

## Performance

- **Duration:** ~3 min (151 seconds wall-clock)
- **Started:** 2026-05-06T20:32:33Z
- **Completed:** 2026-05-06
- **Tasks:** 2 (both `type="auto"`)
- **Files modified:** 1 (`src/components/schema/RestaurantSchema.astro`)

## Accomplishments

- **AEO-01 (P0) fixed:** Monday now listed in `openingHoursSpecification` — merged into existing Tue-Thu block as `[Monday, Tuesday, Wednesday, Thursday]` opens 08:00 closes 21:00. Built `dist/index.html` contains `"https://schema.org/Monday"` in the JSON-LD.
- **AEO-03 fixed:** Kaibab Estates West `areaServed` entry upgraded from bare `City` to `Place` with a `description` field. Built JSON-LD now contains `"@type":"Place","name":"Kaibab Estates West"` followed by a proximity description.
- **Owner correction honored:** Description says "~5 miles north of Ash Fork" (per 11-01 owner-confirmation) instead of the plan-prescribed "~5 miles east of Ash Fork on I-40" (which contradicted the owner's correction).
- **No regressions:** `Williams`, `Tuesday`, all other `areaServed` entries unchanged. Existing Fri-Sun OpeningHoursSpecification block untouched.

## Task Commits

1. **Task 1: Add Monday to openingHoursSpecification (AEO-01)** — `2536e1a`
   - `fix(11-02): add Monday to openingHoursSpecification (AEO-01)`
   - Modified: `src/components/schema/RestaurantSchema.astro` (+1 line — added `'https://schema.org/Monday',` at top of dayOfWeek array)
2. **Task 2: Upgrade Kaibab Estates West to Place with description (AEO-03)** — `e1e14e4`
   - `feat(11-02): upgrade Kaibab Estates West areaServed entry to Place with description (AEO-03)`
   - Modified: `src/components/schema/RestaurantSchema.astro` (+6 / -1 — replaced single-line bare City entry with multi-line Place entry including description)

## Verification Results (built `dist/index.html`)

```
grep -c '"https://schema.org/Monday"' dist/index.html      → 1   (PASS, was 0)
grep -c '"https://schema.org/Tuesday"' dist/index.html     → 1   (regression OK)
grep -o "OpeningHoursSpecification" dist/index.html | wc -l → 2  (Mon-Thu + Fri-Sun)
grep -c '"Kaibab Estates West"' dist/index.html            → 1   (PASS)
grep -c '"@type":"Place","name":"Kaibab Estates West"' dist/index.html → 1   (PASS, was 0)
grep -A2 '"Kaibab Estates West"' dist/index.html | grep -c "description" → 1   (PASS)
grep -o "5 miles north of Ash Fork" dist/index.html | wc -l → 1   (PASS — owner direction correction landed)
grep -c "east of Ash Fork on I-40" dist/index.html         → 0   (PASS — old wrong direction NOT present)
grep -c '"name":"Williams"' dist/index.html                → 1   (regression OK)
```

Tooling exits:
- `npm run typecheck` → 0 errors / 0 warnings / 8 unrelated hints (existing astro(4000) `is:inline` hints in other files)
- `npm run build` → 4 pages built in ~11s, exit 0
- `npm run test:aeo` → AEO Audit Passed (21 FAQ items voice-optimized, llms.txt present)

## Files Created/Modified

- **Modified:** `src/components/schema/RestaurantSchema.astro`
  - Lines 32-53 (openingHoursSpecification): added `'https://schema.org/Monday',` as first dayOfWeek entry of the merged Mon-Thu block.
  - Line 77 (areaServed): replaced `{ '@type': 'City', name: 'Kaibab Estates West' },` with a 6-line Place entry including a proximity description.

## Decisions Made

- **Merge Mon into Tue-Thu block (not a separate Monday entry).** Hours are identical (08:00-21:00), so one block is correct, compact, and schema-dts-preferred per the plan's research reference. The other valid shape (separate `[Monday]` block) would have produced redundant JSON-LD.
- **Apply owner-corrected Kaibab direction over plan-prescribed text.** Plan 11-02 was authored on 2026-05-05 with the original CONTEXT.md belief that Kaibab is "east on I-40". On 2026-05-06 the owner corrected this in `11-OWNER-CONFIRMATION.md` to "~5 miles NORTH of Ash Fork (NOT on I-40)" — captured in `11-01-SUMMARY.md` and reaffirmed in this executor's prompt as a critical correction. Owner truth wins; plan text was stale.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Kaibab description direction corrected from plan-prescribed "east on I-40" to owner-confirmed "north of Ash Fork"**
- **Found during:** Task 2 (pre-edit cross-check against 11-01-SUMMARY.md and the executor prompt's `<critical_corrections>` block)
- **Issue:** Plan 11-02 Task 2 prescribed the literal description string `'Residential community ~5 miles east of Ash Fork on I-40 (~6 minutes).'`. This contradicts the owner-confirmed truth recorded in 11-01-SUMMARY.md: Kaibab Estates West is approximately 5 miles **north** of Ash Fork and is **not** on I-40 (I-40 runs east-west).
- **Fix:** Used the prompt's `<critical_corrections>` suggested wording: `'Residential community approximately 5 miles north of Ash Fork, AZ — within easy driving distance of Spice Grill & Bar.'` This wording avoids any I-40 claim, uses "north", and stays voice-friendly.
- **Files modified:** `src/components/schema/RestaurantSchema.astro` (line 77 → multi-line Place entry)
- **Commit:** `e1e14e4`

No other deviations. Task 1 executed exactly as plan-prescribed.

## Issues Encountered

None. Both tasks executed cleanly. No build/typecheck/audit failures. No fixture or env required.

## User Setup Required

None.

## Known Stubs

None. The two edits are concrete data values (Monday string + Place description string), not placeholders. No `TODO(owner-verify)` markers introduced. Owner-confirmed values were inlined directly.

## Next Phase Readiness

- **Plan 11-03 (llms.txt / llms-full.txt hours fix)** can now proceed — its hours-block edits will close the cross-file Monday drift; this plan handled the schema half.
- **Plan 11-05 (RestaurantSchema enrichment with paymentAccepted / acceptsReservations / amenityFeature)** must NOT re-touch `openingHoursSpecification` or the Kaibab `areaServed` entry — both are now authoritative.
- **Plan 11-07 (`/near-williams/` page)** must continue to honor the same Kaibab "north" correction — this SUMMARY confirms it landed in the schema layer.
- No blockers.

Ready for **Wave 2** sibling plans (11-03, 11-04) and **Wave 3**.

## Self-Check: PASSED

- `src/components/schema/RestaurantSchema.astro` exists on disk and contains `'https://schema.org/Monday',` at line 36
- `src/components/schema/RestaurantSchema.astro` contains `name: 'Kaibab Estates West'` followed by `description:` (Place upgrade landed)
- Commit `2536e1a` (Task 1 — Monday) found in git log
- Commit `e1e14e4` (Task 2 — Kaibab Place) found in git log
- `dist/index.html` contains `"https://schema.org/Monday"` (verified via grep -c → 1)
- `dist/index.html` contains `"@type":"Place","name":"Kaibab Estates West"` (verified via grep -c → 1)
- `dist/index.html` contains `"5 miles north of Ash Fork"` (verified — owner direction landed)
- `dist/index.html` does NOT contain `"east of Ash Fork on I-40"` (verified via grep -c → 0)
- `npm run typecheck` exits 0
- `npm run build` exits 0
- `npm run test:aeo` exits 0

---

*Phase: 11-aeo-refinement*
*Completed: 2026-05-06*
