---
phase: 11-aeo-refinement
plan: 05
subsystem: schema
tags: [aeo, schema, restaurant-schema, payment-accepted, accepts-reservations, amenity-feature]

requires: [11-01-owner-confirmation, 11-02-schema-hours-and-kaibab]
provides:
  - "RestaurantSchema.astro defines paymentAccepted (8 methods), acceptsReservations (false / walk-in only), and amenityFeature (7 LocationFeatureSpecification entries)"
  - "Built dist/index.html JSON-LD contains all three keys with owner-confirmed values"
  - "Wi-Fi explicitly omitted from amenityFeature — honors owner non-confirmation"
  - "schema-dts WithContext<Restaurant> still satisfied without any type escape hatches"
affects: []

tech-stack:
  added: []
  patterns:
    - "schema-dts LocationFeatureSpecification accepts {name, value: boolean} via PropertyValueBase inheritance — no type cast needed"

key-files:
  created:
    - .planning/phases/11-aeo-refinement/11-05-SUMMARY.md
  modified:
    - src/components/schema/RestaurantSchema.astro

key-decisions:
  - "paymentAccepted written as a single comma-separated Text string (per schema-dts type SchemaValue<Text>) — matches schema.org canonical examples"
  - "acceptsReservations set to literal boolean false (not URL form) — owner confirmed walk-in only"
  - "amenityFeature uses {value: true} per LocationFeatureSpecification value field accepting Boolean — kept simple per research; no unitText/description added"
  - "Inserted between aggregateRating and hasMap as research recommended — preserves existing field ordering"
  - "Wi-Fi excluded — owner did not tick the box in 11-OWNER-CONFIRMATION.md"

patterns-established:
  - "When extending RestaurantSchema with new schema-dts fields: read the type def first (node_modules/schema-dts/dist/schema.d.ts), confirm the SchemaValue union, then write a JS literal — no `as any` should ever be necessary for canonical schema.org fields"

requirements-completed: [AEO-02]

duration: 2 min
completed: 2026-05-06
---

# Phase 11 Plan 05: Restaurant Schema Enrichment Summary

**Closed AEO-02 by adding `paymentAccepted`, `acceptsReservations`, and `amenityFeature` (7 entries) to `RestaurantSchema.astro` with strictly owner-confirmed values — schema-dts strictly typed, no escape hatches, dist JSON-LD verified.**

## Performance

- **Duration:** ~2 min wall-clock
- **Started:** 2026-05-06T20:40:00Z (approx — parallel Wave 3)
- **Completed:** 2026-05-06
- **Tasks:** 2 (both `type="auto"`)
- **Files modified:** 1 (`src/components/schema/RestaurantSchema.astro`)

## Accomplishments

- **AEO-02 fixed:** RestaurantSchema now exposes payment, reservation, and amenity signals to AI assistants.
- **paymentAccepted landed:** Single comma-separated Text string with all 8 owner-confirmed methods.
- **acceptsReservations landed:** Boolean `false` reflecting walk-in-only policy.
- **amenityFeature landed:** Array of 7 `LocationFeatureSpecification` literals, one per owner-confirmed amenity, each with `value: true`.
- **Wi-Fi excluded:** Owner did not tick the box, so Wi-Fi is intentionally absent from the schema. Verified via `grep -c '"Free Wi-Fi"' dist/index.html → 0`.
- **Insertion order preserved:** Three new fields placed between `aggregateRating` and `hasMap` per the research recommendation — no other fields touched.
- **No regressions:** Plan 11-02 outputs still emit (Monday in `openingHoursSpecification`, Kaibab `Place` with description), Wave 2 changes intact.
- **No type escape hatches:** `npm run typecheck` reports 0 errors / 0 warnings; file contains zero `as any`, `@ts-expect-error`, or `@ts-ignore`.

## Task Commits

1. **Task 1: Verify owner confirmation + Plan 11-02 prerequisite** — _no commit_ (verification-only task; no file changes)
   - `grep -c "^Status: confirmed" 11-OWNER-CONFIRMATION.md` → 1 (PASS)
   - `grep -c "https://schema.org/Monday" RestaurantSchema.astro` → 1 (PASS, Plan 11-02 landed)
2. **Task 2: Add paymentAccepted, acceptsReservations, amenityFeature** — `f3404c1`
   - `feat(11-05): add paymentAccepted, acceptsReservations, amenityFeature to RestaurantSchema (AEO-02)`
   - Modified `src/components/schema/RestaurantSchema.astro` (+20 / -0)

## Exact Values Landed (audit trail)

### paymentAccepted

```typescript
paymentAccepted:
  'Cash, Visa, Mastercard, American Express, Discover, Debit cards, Apple Pay, Google Pay',
```

Single comma-separated Text string per schema-dts type `SchemaValue<Text>` and schema.org canonical examples.

### acceptsReservations

```typescript
acceptsReservations: false,
```

Reason: Owner ticked "Walk-in only (no reservations)" in section 2 of `11-OWNER-CONFIRMATION.md`. Boolean literal chosen over URL form because there is no online reservation provider. schema-dts type `SchemaValue<Boolean | Text | URL>` accepts native `boolean`.

### amenityFeature

```typescript
amenityFeature: [
  { '@type': 'LocationFeatureSpecification', name: 'Free on-site parking', value: true },
  { '@type': 'LocationFeatureSpecification', name: 'RV and truck parking nearby', value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Wheelchair accessible entrance', value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Indoor seating', value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Outdoor seating', value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Family-friendly', value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Full bar', value: true },
],
```

7 entries — exactly matches the 7 ticked checkboxes in `11-OWNER-CONFIRMATION.md` § 3. The unticked "Free Wi-Fi for customers" and "Other (specify)" rows are intentionally absent.

## Verification Results (built `dist/index.html`)

```
grep -o '"paymentAccepted"' dist/index.html | wc -l                    → 1   (PASS)
grep -o '"acceptsReservations"' dist/index.html | wc -l                → 1   (PASS)
grep -o '"amenityFeature"' dist/index.html | wc -l                     → 1   (PASS)
grep -oE '"paymentAccepted"|"acceptsReservations"|"amenityFeature"' dist/index.html | wc -l → 3   (PASS, ≥3)
grep -c '"paymentAccepted":"Cash, Visa' dist/index.html                → 1   (PASS)
grep -c '"acceptsReservations":false' dist/index.html                  → 1   (PASS)
grep -oE '"@type":"LocationFeatureSpecification"' dist/index.html | wc -l → 7   (PASS, =7)
grep -c '"Free on-site parking"' dist/index.html                       → 1   (PASS)
grep -c '"Free Wi-Fi"' dist/index.html                                 → 0   (PASS — Wi-Fi excluded)

# Regression checks (Plan 11-02 still intact)
grep -c '"https://schema.org/Monday"' dist/index.html                  → 1   (PASS)
grep -c '"@type":"Place","name":"Kaibab Estates West"' dist/index.html → 1   (PASS)

# Type/build/audit
grep -cE 'as any|@ts-expect-error|@ts-ignore' src/components/schema/RestaurantSchema.astro → 0   (PASS)
npm run typecheck                                                      → 0 errors / 0 warnings
npm run build                                                          → 4 pages built, exit 0
npm run lint                                                           → exit 0
npm run test:aeo                                                       → AEO Audit Passed
```

## Files Created/Modified

- **Modified:** `src/components/schema/RestaurantSchema.astro`
  - Inserted 20 lines between existing `aggregateRating` block (line 98-104) and `hasMap` (now line ~125).
  - Three new properties: `paymentAccepted` (string), `acceptsReservations` (boolean), `amenityFeature` (array of 7 `LocationFeatureSpecification` literals).
- **Created:** `.planning/phases/11-aeo-refinement/11-05-SUMMARY.md` (this file).

## Decisions Made

- **paymentAccepted as single Text string, not array.** schema-dts types it `SchemaValue<Text>`, and schema.org's own examples (e.g., the Restaurant page) show comma-separated string. Plan called for this exact shape.
- **acceptsReservations as literal `false`, not `'False'` URL.** Both are valid per `SchemaValue<Boolean | Text | URL>`, but boolean is canonical for Google Rich Results and matches Google's documentation. Owner has no online reservation system, so URL form is irrelevant.
- **amenityFeature entries use `value: true` only.** No `description`, `unitText`, or other fields added. Plan said "typically boolean" and research/owner-confirmation supplied human-readable names sufficient for AEO. Adding redundant description fields would bloat JSON-LD without semantic benefit.
- **"Debit cards" preserved as-is in payment string** (lower-case "cards", plural). Plan section 2 column showed both "Debit Card" and the owner checklist label "Debit cards" — matched the owner's verbatim label as recorded in `11-01-SUMMARY.md`.
- **Insertion location: between `aggregateRating` and `hasMap`.** Research recommended this for logical grouping (rating → policies/amenities → external links). Plan 11-02's prior changes (Monday in `openingHoursSpecification`, Kaibab `Place`) were untouched.

## Deviations from Plan

None — plan executed exactly as written. The owner-confirmed values from `11-01-SUMMARY.md` (overriding the plan's example values) drove the literal strings. Plan explicitly anticipated this with `{OWNER_CONFIRMED_*}` placeholders, so honoring `11-01-SUMMARY.md` is plan-prescribed behavior, not a deviation.

## Issues Encountered

None. Edit landed cleanly; typecheck/build/lint/audit all green on first pass.

## Authentication Gates

None.

## User Setup Required

None — schema enrichment is server-side static data only. No external service registration, env var, or owner setup required beyond the already-completed `11-OWNER-CONFIRMATION.md` checklist.

## Known Stubs

None. All values are concrete owner-confirmed business data. No `TODO(owner-verify)` markers introduced.

## Next Phase Readiness

- AEO-02 closed — RestaurantSchema enrichment complete.
- Wave 3 sibling plans (11-06, 11-07, 11-08) running in parallel; this plan does not block any of them.
- Plan 11-04 (FAQ expansion) should reference the same payment / reservation / amenity wording for FAQ answers — its source-of-truth is `11-01-SUMMARY.md`, identical to this plan's source.
- No blockers. No follow-up TODOs.

## Self-Check: PASSED

- `src/components/schema/RestaurantSchema.astro` exists on disk and contains:
  - `paymentAccepted: 'Cash, Visa, Mastercard, American Express, Discover, Debit cards, Apple Pay, Google Pay'`
  - `acceptsReservations: false`
  - `amenityFeature: [` with 7 `LocationFeatureSpecification` entries
- Commit `f3404c1` (Task 2) found in git log — verified via `git log --oneline | grep f3404c1`
- `dist/index.html` contains `"paymentAccepted":"Cash, Visa, Mastercard, American Express, Discover, Debit cards, Apple Pay, Google Pay"` (verified)
- `dist/index.html` contains `"acceptsReservations":false` (verified)
- `dist/index.html` contains 7 occurrences of `"@type":"LocationFeatureSpecification"` (verified)
- `dist/index.html` contains 0 occurrences of `"Free Wi-Fi"` (verified — Wi-Fi correctly excluded)
- `dist/index.html` contains `"https://schema.org/Monday"` and `"@type":"Place","name":"Kaibab Estates West"` (Plan 11-02 regressions PASSED)
- File contains 0 instances of `as any`, `@ts-expect-error`, `@ts-ignore` (verified)
- `npm run typecheck` exits 0
- `npm run build` exits 0
- `npm run lint` exits 0
- `npm run test:aeo` exits 0

---

*Phase: 11-aeo-refinement*
*Completed: 2026-05-06*
