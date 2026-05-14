---
phase: 11-aeo-refinement
plan: 03
subsystem: ai-crawler-docs
tags: [aeo, llms-txt, hours-fix, payment-methods, reservations, amenities, dietary, owner-confirmed]

requires:
  - "11-01 owner-confirmed payment methods (8), reservation policy (walk-in only), amenities (7; Wi-Fi excluded)"
provides:
  - "public/llms.txt with corrected Monday hours and 5 new H2 sections (Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, Dietary Options)"
  - "public/llms-full.txt with corrected Monday hours and the same 5 H2 sections (cross-file content identical for the 5-section block)"
  - "AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot) now see Monday OPEN and authoritative prose for payment/reservation/delivery/amenity/dietary queries"
affects: [11-08-aeo-audit-script]

tech-stack:
  added: []
  patterns:
    - "Cross-file consistency for AI-crawler docs: payment/reservation/delivery/amenity/dietary blocks are byte-identical between llms.txt and llms-full.txt to prevent crawler dissonance"
    - "Owner-confirmed values copied verbatim from 11-OWNER-CONFIRMATION.md — no invention, no guessing; Wi-Fi explicitly omitted because owner did not tick it"

key-files:
  created:
    - .planning/phases/11-aeo-refinement/11-03-SUMMARY.md
  modified:
    - public/llms.txt
    - public/llms-full.txt

key-decisions:
  - "Phrasing form for walk-in policy locked: 'Walk-ins welcome — we do not take reservations.' (matches owner-confirmation §2 first option exactly)"
  - "Amenity bullets use canonical phrasings from 11-03-PLAN.md substitution rules; bullet order matches checklist tick order"
  - "Wi-Fi NOT mentioned in either file (owner did not tick) — cross-file grep confirms 0 hits for 'wi-fi' or 'wifi'"
  - "5-section block diff between llms.txt and llms-full.txt = 0 (byte-identical)"
  - "Verification grep '^Status: confirmed' from Task 1 mismatched the actual markdown-bold form '**Status:** confirmed' in 11-OWNER-CONFIRMATION.md, but 11-01-SUMMARY documents owner has confirmed; proceeded with execution (Rule 3 — blocking issue auto-handled, no value invention)"

requirements-completed: [AEO-04]

duration: 2 min
completed: 2026-05-06
---

# Phase 11 Plan 03: llms.txt + llms-full.txt Hours Fix and Section Expansion Summary

**Eliminated the Monday-closed drift in both AI-crawler docs and added 5 H2 sections (Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, Dietary Options) using owner-confirmed values from Plan 11-01 — AI agents now see Monday open and authoritative prose for the highest-volume voice queries without inventing data.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-05-06T20:33:05Z
- **Completed:** 2026-05-06T20:35:07Z
- **Tasks:** 3 (1 verification + 2 file edits)
- **Files modified:** 2 (`public/llms.txt`, `public/llms-full.txt`)
- **Line-count delta:**
  - `public/llms.txt`: 52 → 71 lines (+19)
  - `public/llms-full.txt`: 131 → 151 lines (+20)

## Accomplishments

- **Monday hours drift eliminated** in both files. Final regression: `grep -iE "mon[a-z]*: closed|monday: closed|closed mondays" public/llms.txt public/llms-full.txt | wc -l` → `0`.
- **`public/llms.txt` Operating Hours**: collapsed `Mon: Closed` + `Tue - Thu: 8 AM - 9 PM` rows into single `**Mon - Thu**: 8:00 AM - 9:00 PM` row.
- **`public/llms.txt` FAQ block** (formerly line 37): `Tuesday-Thursday 8:00 AM - 9:00 PM, Friday-Sunday 8:00 AM - 10:00 PM. Closed Mondays.` → `Monday-Thursday 8:00 AM - 9:00 PM, Friday-Sunday 8:00 AM - 10:00 PM.`
- **`public/llms-full.txt` Operating Hours**: collapsed `Monday: Closed` + `Tuesday - Thursday: 8 AM - 9 PM` rows into single `**Monday - Thursday**: 8:00 AM - 9:00 PM` row.
- **5 new H2 sections added to BOTH files** in locked order (Payment Methods → Reservation Policy → Delivery & Takeout → Amenities → Dietary Options), placed between Frequently Asked Questions / Pages and Links / Full Menu sections.
- **Cross-file consistency verified**: `diff` of the Payment-Methods-through-Dietary-Options block between the two files returns 0 differences.
- **AEO audit passes**: `npm run test:aeo` exits 0 — existing voice-word-count gate and llms.txt existence gate both green; new gates land in Plan 11-08.

## Task Commits

1. **Task 1: Verify owner confirmation status** — verification-only (no file changes); see "Deviations from Plan" below for the regex mismatch.
2. **Task 2: Fix Monday hours + add 5 sections in `public/llms.txt`** — `621b600` `feat(11-03): fix Monday hours and add 5 AEO sections in llms.txt`
3. **Task 3: Fix Monday hours + add 5 sections in `public/llms-full.txt`** — `5cf3ee2` `feat(11-03): fix Monday hours and add 5 AEO sections in llms-full.txt`

**Plan metadata:** _(this commit)_ `docs(11-03): complete llms.txt and llms-full.txt AEO refinement plan`

## Owner-Confirmed Values Substituted (authoritative — verbatim from `11-OWNER-CONFIRMATION.md`)

### Payment Methods (final prose, identical in both files)

> Spice Grill & Bar accepts cash, Visa, Mastercard, American Express, Discover, debit cards, Apple Pay, and Google Pay. We do not require a minimum purchase for card transactions.

Source: 11-OWNER-CONFIRMATION.md §1 — all 8 boxes ticked, "Other (specify)" left blank.

### Reservation Policy (final prose, identical in both files)

> Walk-ins welcome — we do not take reservations. Phone us at (928) 277-1292 to confirm availability for large parties.

Source: 11-OWNER-CONFIRMATION.md §2 — option 1 ticked (`acceptsReservations: false`).

### Delivery & Takeout (final prose, identical in both files)

> Takeout, pickup, and curbside service available. Order online via Toast at https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave or call (928) 277-1292. We do not offer in-house delivery; third-party apps are not currently integrated.

Source: 11-CONTEXT.md project-knowledge values; no owner gate needed.

### Amenities (final bullets, identical in both files)

```
- On-site car and motorcycle parking
- RV and truck parking across the road at the truck stop
- Wheelchair accessible entrance
- Indoor seating
- Outdoor seating
- Family-friendly with seating for groups of all sizes
- Full bar (beer, wine, cocktails)
```

Source: 11-OWNER-CONFIRMATION.md §3 — 7 boxes ticked. **Wi-Fi explicitly NOT mentioned** because the Wi-Fi box was NOT ticked. `grep -ic "wi-fi\|wifi"` on both files returns 0.

### Dietary Options (final prose, identical in both files)

> Vegetarian and vegan options available, including Shahi Paneer, Dal Tadka, Aloo Gobhi, and Chana Masala. Spice level is customizable from mild to extra hot — let your server know your preference. Gluten-free accommodations on request; ask your server about specific dishes.

Source: existing `faq.json` + project knowledge; halal wording deferred per CONTEXT § Out of Scope.

## Files Modified

- **`public/llms.txt`** (52 → 71 lines): Operating Hours bullet collapse + FAQ block answer rewrite + 5 new H2 sections inserted between `## Frequently Asked Questions` and `## Links`.
- **`public/llms-full.txt`** (131 → 151 lines): Operating Hours bullet collapse + 5 new H2 sections inserted between `## Pages` and `## Full Menu`.

## Decisions Made

- **Walk-in phrasing wording locked** to `Walk-ins welcome — we do not take reservations.` (matches the plan's substitution rule for option 1, em-dash form for editorial consistency with the rest of the doc).
- **Amenity bullet order locked** to checklist tick order (parking → RV/truck → wheelchair → indoor → outdoor → family → full bar). Cross-file diff = 0.
- **Cross-file consistency = byte-identical** for the 5-section block. Both files now agree on payment/reservation/delivery/amenity/dietary content; future drift will fail audit checks (Plan 11-08 will gate this).
- **Wi-Fi exclusion enforced** — owner did not tick Wi-Fi in 11-OWNER-CONFIRMATION.md §3, so neither file claims Wi-Fi. This blocks an "is there free Wi-Fi?" hallucination from AI crawlers.
- **Section ordering locked**: in `llms.txt`, 5 new sections sit between Frequently Asked Questions (line 34) and Links (line 65). In `llms-full.txt`, between Pages (line 30) and Full Menu (line 57).

## Deviations from Plan

**1. [Rule 3 — Blocking issue] Owner-confirmation status grep regex mismatch**

- **Found during:** Task 1 (verification step)
- **Issue:** Plan 11-03 specifies `grep -c "^Status: confirmed" .planning/phases/11-aeo-refinement/11-OWNER-CONFIRMATION.md` must return 1. The actual file format is `**Status:** confirmed` (markdown bold), so the literal regex returns 0.
- **Fix:** Did NOT alter the OWNER-CONFIRMATION file (it was committed by owner in `0114d1a` and re-affirmed by Plan 11-01 SUMMARY). Verified the substantive condition (Status IS confirmed; 11-01-SUMMARY explicitly documents this and lists `requirements-completed: [AEO-02]` as cleared) and proceeded. Did NOT invent any payment/reservation/amenity values — used only owner-ticked items from the checklist.
- **Files modified:** None (verification-only task).
- **Commit:** N/A (no file change required).
- **Future-proofing:** Plan 11-08 audit script can use a relaxed regex (`grep -iE "^\*?\*?Status:?\*?\*? confirmed"` or `grep -i "Status:.*confirmed"`) if desired; current regex is brittle to markdown formatting.

## Issues Encountered

None blocking. The owner-confirmation regex mismatch (above) was the only deviation and was handled per Rule 3.

## User Setup Required

None — no external service configuration. Owner already filled `11-OWNER-CONFIRMATION.md` in Wave 1.

## Next Phase Readiness

- AEO-04 requirement complete.
- Plan 11-08 (audit-script gates) will grep `public/llms.txt` for the 5 H2 headers; all 5 are present in the locked casing/wording.
- Wave 2's other plans (11-02, 11-04) are independent and may proceed in parallel.
- No blockers.

Ready for **Plan 11-04 (FAQ expansion)**.

## Self-Check: PASSED

- `public/llms.txt` exists on disk with 71 lines and all 5 new H2 sections (verified by grep)
- `public/llms-full.txt` exists on disk with 151 lines and all 5 new H2 sections (verified by grep)
- Cross-file diff for Payment-Methods-through-Dietary-Options block returns 0 differences
- `grep -iE "mon[a-z]*: closed|monday: closed|closed mondays"` returns 0 hits across both files
- Commit `621b600` (Task 2 — llms.txt) found in `git log`
- Commit `5cf3ee2` (Task 3 — llms-full.txt) found in `git log`
- `npm run test:aeo` exits 0
- `.planning/phases/11-aeo-refinement/11-03-SUMMARY.md` exists on disk

---

*Phase: 11-aeo-refinement*
*Completed: 2026-05-06*
