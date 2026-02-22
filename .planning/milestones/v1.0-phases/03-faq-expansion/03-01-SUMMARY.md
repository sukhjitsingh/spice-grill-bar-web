---
phase: 03-faq-expansion
plan: 01
subsystem: content/faq
tags: [aeo, faq, content, seo, route66, grand-canyon]
dependency_graph:
  requires: []
  provides: [faq.json-20-entries, aeo-highway-targeted-content]
  affects: [FAQSchema.astro, faq.astro, all-pages-via-layout]
tech_stack:
  added: []
  patterns: [answer-first-aeo, journey-intent-questions, voice-style-discovery]
key_files:
  modified:
    - src/data/faq.json
decisions:
  - "Merged RV/truck parking into single parking entry (Q17) rather than separate entry, freeing slot for alcohol entry"
  - "Retained original alcohol entry from existing 9; all operational entries covered in final 20"
  - "FAQSchema is injected globally via Layout.astro — all pages emit 20 FAQ schema entries (future scope: restrict to faq.astro only)"
  - "Call-ahead pickup phrasing for Williams/Seligman is explicit: call 928-277-1292, food ready at restaurant in Ash Fork, no delivery"
metrics:
  duration: "2 min"
  completed: "2026-02-21"
  tasks_completed: 2
  files_modified: 1
---

# Phase 3 Plan 1: FAQ Expansion to 20 Highway-Targeted AEO Entries Summary

**One-liner:** Expanded faq.json from 9 generic entries to 20 highway/route-targeted AEO entries covering Grand Canyon, I-40, Las Vegas, Flagstaff, Phoenix, and Kingman search intents, all passing the 50-word AEO audit constraint.

## What Was Built

Rewrote and expanded `src/data/faq.json` from 9 entries to 20, structured by search intent priority:

- **Discovery/location (3 entries):** Grand Canyon voice query ("Is there an Indian restaurant near the Grand Canyon?"), I-40 pitstop, branded location
- **Highway distances (5 entries):** Grand Canyon branded distance, Las Vegas route, Flagstaff route, Phoenix route, Kingman route
- **Food/cuisine (5 entries):** What type of food, most popular dishes, first-timer dish recs, spice level customization, vegetarian/vegan options
- **Operational (7 entries):** Hours, takeout/delivery, call-ahead pickup from Williams/Seligman, parking, biker-friendly Route 66, alcohol, kid-friendly

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Author 20 faq.json entries with AEO-compliant content | abfcbed | src/data/faq.json |
| 2 | Verify FAQSchema.astro and faq.astro render all 20 entries dynamically | 5b43fe1 | (verification only) |

## Verification Results

- `npm run test:aeo` — PASS, 20 entries all ≤50 words (max: 38 words on entry 2)
- `npm run build` — PASS, no errors
- Built HTML `dist/faq/index.html` — 20 `"@type":"Question"` entries confirmed
- FAQSchema.astro — confirmed uses `faqData.map()` with no `.slice()` or index limit
- faq.astro — confirmed uses `faqData.map()` with no `.slice()` or index limit

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Decisions Made During Execution

1. **RV/truck parking entry merged with car/motorcycle parking** — Plan listed both as separate entries but noted this as a potential merge. Merged into one comprehensive parking entry (Q17) covering car, motorcycle, and RV/truck. This freed the final slot for the alcohol entry that was in the original 9.

2. **Alcohol entry retained** — The original Q7 (alcohol) was preserved in the 20-entry set. The plan's operational list explicitly included it, and merging parking freed the count to 20 exactly.

### Future Considerations (out of scope for Phase 3)

- **FAQSchema global injection:** FAQSchema.astro is injected via Layout.astro, meaning all pages (including the home page) emit 20 FAQ schema entries. Google may flag FAQ structured data on pages where FAQ content is not visible. This is existing behavior and outside Phase 3 scope — flagged for future consideration.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/data/faq.json | FOUND |
| 03-01-SUMMARY.md | FOUND |
| commit abfcbed (Task 1) | FOUND |
| commit 5b43fe1 (Task 2) | FOUND |
