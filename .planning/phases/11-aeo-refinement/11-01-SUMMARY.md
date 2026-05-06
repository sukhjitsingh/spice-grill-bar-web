---
phase: 11-aeo-refinement
plan: 01
subsystem: planning
tags: [aeo, geo, owner-confirmation, schema-data, business-data]

requires: []
provides:
  - "Owner-confirmed values for paymentAccepted, acceptsReservations, amenityFeature"
  - "Walk-in only reservation policy locked (acceptsReservations: false)"
  - "8 payment methods locked (Cash, Visa, Mastercard, Amex, Discover, Debit, Apple Pay, Google Pay)"
  - "7 amenity values locked (parking, RV/truck nearby, wheelchair, indoor, outdoor, family-friendly, full bar)"
  - "Wi-Fi explicitly NOT confirmed — must be omitted from amenityFeature"
  - "Distance correction: Kaibab Estates West is ~5 miles NORTH of Ash Fork (NOT east on I-40)"
affects: [11-03-llms-files, 11-04-faq-expansion, 11-05-restaurant-schema-enrichment, 11-07-near-williams-page]

tech-stack:
  added: []
  patterns:
    - "Owner-confirmation gate: BLOCKING checkpoint file in phase dir gates downstream waves until Status: confirmed"

key-files:
  created:
    - .planning/phases/11-aeo-refinement/11-OWNER-CONFIRMATION.md
  modified: []

key-decisions:
  - "Walk-in only reservation policy (acceptsReservations: false in RestaurantSchema)"
  - "Wi-Fi NOT confirmed by owner — exclude from amenityFeature[] in Plan 11-05"
  - "Kaibab Estates West direction corrected: ~5 mi NORTH of Ash Fork (not on I-40) — overrides 11-CONTEXT.md and 11-RESEARCH.md"
  - "Payment methods include both card networks (Visa, MC, Amex, Discover) AND mobile pay (Apple Pay, Google Pay) AND Cash + Debit"
  - "RV/truck parking framed as 'across the road at truck stop' (off-site, nearby) — NOT on-premises RV parking"

patterns-established:
  - "Owner-confirmation BLOCKING gate: phase opens with a Wave 1 checklist plan that downstream plans grep for 'Status: confirmed' before writing business-data values"

requirements-completed: [AEO-02]

duration: 1 min
completed: 2026-05-06
---

# Phase 11 Plan 01: Owner-Confirmation Checklist Summary

**Locked all owner-only business-data values (8 payment methods, walk-in-only reservations, 7 amenities) and corrected Kaibab Estates West direction from "east on I-40" to "north of Ash Fork" — unblocking Waves 2-3 schema/content writes.**

## Performance

- **Duration:** 1 min (executor-side; the BLOCKING checkpoint waited on the owner between commits `8e01795` and `0114d1a`)
- **Started:** 2026-05-06T20:29:10Z
- **Completed:** 2026-05-06T20:29:32Z
- **Tasks:** 2 (1 auto + 1 BLOCKING checkpoint, both pre-completed before this executor run)
- **Files modified:** 1

## Accomplishments

- Owner-confirmation checklist (`11-OWNER-CONFIRMATION.md`) created with 4 sections (Payment Methods, Reservation Policy, Amenities, Williams/Kaibab Distance Confirmation)
- Owner filled all sections, ticked applicable boxes, and flipped `Status: awaiting-owner` → `Status: confirmed`
- Distance correction captured: Kaibab Estates West is **NORTH** of Ash Fork (not east on I-40 as CONTEXT.md and RESEARCH.md previously assumed)
- Wave 2 plans (11-03, 11-04) and Wave 3 plan (11-05) now have the authoritative file to grep for confirmed values

## Task Commits

1. **Task 1: Create OWNER-CONFIRMATION.md checklist** — `8e01795` (docs: scaffold v3.0 milestone + Phase 11 context — checklist file landed here as part of phase scaffolding rather than a standalone task commit)
2. **Task 2: BLOCKING — Owner fills checklist** — `0114d1a` (docs(11-01): Owner confirms payment, reservations, amenities; Kaibab is north not east)

**Plan metadata:** _(this commit)_ `docs(11-01): complete owner-confirmation plan`

## Owner-Confirmed Values (authoritative — downstream executors grep this section)

### Payment Methods (paymentAccepted)

Comma-separated string for RestaurantSchema.astro `paymentAccepted` field:

```
Cash, Visa, Mastercard, American Express, Discover, Debit cards, Apple Pay, Google Pay
```

### Reservation Policy (acceptsReservations)

```jsonld
"acceptsReservations": false
```

Rationale: Walk-in only — no phone or online reservations. FAQ entries (Plan 11-04) referencing reservations must say "walk-in only".

### Amenities (amenityFeature[])

Schema.org `LocationFeatureSpecification` entries to add to RestaurantSchema.astro (Plan 11-05):

| Amenity | Notes |
| --- | --- |
| Free on-site parking | Cars + motorcycles |
| RV / truck parking nearby | Across the road at truck stop (OFF-SITE, NOT on-premises) |
| Wheelchair accessible entrance | Use schema.org `accessibilityFeature` if preferred |
| Indoor seating | |
| Outdoor seating | Patio / deck |
| Family-friendly | High chairs, kids welcome |
| Full bar | Beer, wine, cocktails |

**EXPLICITLY NOT CONFIRMED — DO NOT add to amenityFeature[]:**
- Free Wi-Fi for customers — owner did not tick this. llms.txt / FAQ / schema must NOT claim Wi-Fi.

### Distance Confirmation (CRITICAL — overrides 11-CONTEXT.md and 11-RESEARCH.md)

| Destination | Confirmed Distance | Direction | Confirmed Time |
| --- | --- | --- | --- |
| Williams, AZ | ~18 miles | **East** on I-40 | ~18 minutes |
| Kaibab Estates West | ~5 miles | **NORTH** of Ash Fork (NOT on I-40) | ~6 minutes |

**Implication for downstream plans:**
- **Plan 11-04 (FAQ expansion):** FAQ entry about Kaibab proximity MUST say "north of Ash Fork" — must NOT claim Kaibab is east on I-40.
- **Plan 11-07 (`/near-williams/` page):** Distance section must say Kaibab is NORTH and is OFF I-40. Williams remains east on I-40 / ~18 mi.
- **Plan 11-05 (RestaurantSchema):** `areaServed` entry for Kaibab Estates West stays as a place reference, but any descriptive copy must use "north" not "east".

## Files Created/Modified

- `.planning/phases/11-aeo-refinement/11-OWNER-CONFIRMATION.md` — Owner-filled checklist with confirmed paymentAccepted / acceptsReservations / amenityFeature values + Kaibab "north" correction.

## Decisions Made

- **Walk-in only policy locked** — `acceptsReservations: false` is the authoritative value. No phone/online reservations until owner says otherwise.
- **Wi-Fi exclusion** — owner did NOT tick the Wi-Fi box. Treated as authoritative "no Wi-Fi" for AEO purposes. Plans 11-03 / 11-04 / 11-05 must omit Wi-Fi from any payment/amenity content.
- **Kaibab direction correction** — Owner explicitly changed the distance text from "east of Ash Fork on I-40" to "north of Ash Fork on I-40" inside the checklist (and ticked the confirmation box). Treating "north" as the authoritative direction; the residual "on I-40" in the file appears to be a copy-edit oversight, NOT a claim Kaibab is on the interstate. Downstream plans must use "north of Ash Fork" and must NOT claim Kaibab is on I-40.
- **RV/truck parking framing** — Captured as off-site ("across the road at truck stop"), NOT on-premises RV parking. amenityFeature copy in Plan 11-05 must not claim Spice Grill has its own RV lot.

## Deviations from Plan

None — plan executed exactly as written. The two tasks were already complete when this executor ran (Task 1 landed in commit `8e01795` as part of phase scaffolding; Task 2 was the BLOCKING checkpoint that the owner satisfied in `0114d1a`). The executor's job was to verify acceptance criteria, capture the confirmed values verbatim into this SUMMARY for downstream waves, and update STATE/ROADMAP — all of which proceeded without deviation.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required for this plan. The plan IS the user-input gate, and the user has completed it.

## Next Phase Readiness

- Wave 1 BLOCKING gate cleared — Plans 11-02 through 11-08 may now proceed.
- Plans 11-03 (llms.txt sections), 11-04 (FAQ expansion), and 11-05 (RestaurantSchema enrichment) should `grep` this SUMMARY for confirmed values rather than re-reading the checklist.
- Plan 11-07 (`/near-williams/` page) MUST honor the Kaibab "north" correction.
- No blockers.

Ready for **Plan 11-02**.

## Self-Check: PASSED

- `11-OWNER-CONFIRMATION.md` exists on disk
- `11-01-SUMMARY.md` exists on disk
- Commit `8e01795` (file creation) found in git log
- Commit `0114d1a` (owner-fill) found in git log

---

*Phase: 11-aeo-refinement*
*Completed: 2026-05-06*
