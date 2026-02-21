---
phase: 05-geo-content-pages
plan: 02
subsystem: pages/seo
tags: [geo, aeo, schema, speakable, google-maps, open-graph]

dependency_graph:
  requires:
    - phase: 05-01
      provides: [near-grand-canyon-page, og-props-layout]
  provides:
    - directions-page-with-7-city-sections
    - inline-faq-schema-directions
    - speakable-schema-directions
    - google-maps-embed-directions
    - cross-links-both-geo-pages
  affects: [src/pages/directions.astro, src/pages/near-grand-canyon.astro]

tech-stack:
  added: []
  patterns: [per-city-h2-sections, anchor-nav, nap-address-block, google-maps-client-visible, directions-aeo-structure]

key-files:
  created:
    - src/pages/directions.astro
  modified: []

key-decisions:
  - "No changes needed to near-grand-canyon.astro — keyword-rich cross-links to /directions/ were already correct from 05-01"
  - "Anchor navigation bar uses pure HTML anchor links (no JavaScript) for city sections — consistent with static site pattern"
  - "GoogleMap.tsx imported with client:visible directive to avoid LCP impact (intersection observer handles lazy load)"
  - "NAP address block appears in all 7 city sections for local SEO signal density"

patterns-established:
  - "Per-city H2 section pattern: section[id=city-slug] > h2 > p (directions) > address (NAP)"
  - "Anchor navigation bar placed after standalone Exit 146 sentence, before city sections"

requirements-completed: [CONT-05]

duration: 6min
completed: 2026-02-21
---

# Phase 05 Plan 02: GEO Content Page — /directions/ Summary

**Directions page with 7 per-city H2 sections (anchor nav, turn-by-turn copy emphasizing I-40 Exit 146, NAP address blocks), GoogleMap.tsx embed (client:visible), page-specific inline FAQ schema, speakable schema, and keyword-rich cross-links — full QA passes.**

## Performance

- **Duration:** 6 minutes
- **Started:** 2026-02-21T22:35:35Z
- **Completed:** 2026-02-21T22:41:35Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Created /directions/ page (333 lines) with 7 city H2 sections for Flagstaff, Williams, Seligman, Las Vegas, Los Angeles, Kingman, and Phoenix
- Each city section contains turn-by-turn directions with `<strong>Exit 146</strong>` emphasis, NAP address block, and trailing-slash internal link patterns
- Anchor navigation bar enables jump-to for each city — pure HTML, zero JavaScript
- GoogleMap.tsx embed with `client:visible` below fold preserves LCP performance
- Page-specific inline FAQPage schema (3 Q&A pairs: Grand Canyon, Exit 146, Flagstaff)
- Speakable schema targeting `.speakable-heading`, `.speakable-lead`, `.speakable-exit`
- Verified near-grand-canyon.astro already had keyword-rich cross-link ("Driving directions to Spice Grill & Bar from 7 cities") from 05-01 — no changes needed
- Full QA passed: lint, knip, typecheck, AEO audit (all 20 FAQ items pass), Lighthouse CI (3 URLs)

## Task Commits

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Create /directions/ page with per-city H2 sections and Google Maps embed | 1f4335a | src/pages/directions.astro |
| 2 | Verify cross-links and run full QA | (no files changed — verification only) | — |

**Plan metadata:** (final commit — this SUMMARY.md)

## Files Created/Modified

- `src/pages/directions.astro` — Directions page (333 lines) with 7 per-city H2 sections, anchor nav, NAP address blocks, GoogleMap embed, inline FAQ schema, speakable schema, page-specific OG tags

## Decisions Made

1. **near-grand-canyon.astro unchanged:** The plan noted "if not already done in 05-01" for the cross-link from /near-grand-canyon/ to /directions/. Verified it was already correctly implemented in 05-01 with keyword-rich text "Driving directions to Spice Grill & Bar from 7 cities". No modification needed.

2. **Anchor navigation bar uses pure HTML:** No JavaScript needed for anchor links to city sections. Consistent with Astro static site philosophy.

3. **Sentence-case commitlint:** Commitlint enforces sentence-case for the commit subject. Initial commit attempts with lowercase "add" were rejected; fixed to "Add".

## Deviations from Plan

None — plan executed exactly as written. The cross-link in near-grand-canyon.astro was confirmed correct from 05-01, as the plan anticipated with the "(if not already done in 05-01)" qualifier.

## Issues Encountered

- **Commitlint sentence-case:** First commit attempt failed because `add /directions/ page` starts with lowercase `add`. Fixed to `Add directions page...` — no code change, just commit message format.

## Verification Results

- `npm run build` passes — 4 pages built: /, /faq/, /near-grand-canyon/, /directions/
- `npm run typecheck` passes — 0 errors, 0 warnings (31 hints, all pre-existing)
- `npm run lint` passes — 0 errors
- `npm run test:aeo` passes — all 20 FAQ items optimized
- `npm run test:lhci` passes — all 3 URLs pass Lighthouse CI assertions
- Built /directions/index.html contains:
  - 7 city section IDs (flagstaff, williams, seligman, las-vegas, los-angeles, kingman, phoenix)
  - 7 `<address>` blocks
  - 16 occurrences of "Exit 146"
  - 2 FAQPage schema instances (1 global from FAQSchema.astro, 1 page-specific inline)
  - 1 SpeakableSpecification schema instance
  - Page-specific og:url (https://spicegrillbar66.com/directions/)
  - Page-specific og:title (Directions to Spice Grill & Bar — I-40 Exit 146)
  - All internal links with trailing slashes (/near-grand-canyon/, /faq/, /)
  - "78 miles" in FAQ schema answer (Grand Canyon distance consistent)

## Self-Check

PASSED — verified:
- `src/pages/directions.astro` exists: confirmed (333 lines)
- `dist/directions/index.html` exists: confirmed
- Task 1 commit `1f4335a` exists: confirmed
- No "70 miles" or "58 miles" in built output: confirmed
- All 7 city sections present: confirmed
- All 7 NAP address blocks present: confirmed

## Next Phase Readiness

Phase 5 is complete. All planned GEO content pages are live:
- /near-grand-canyon/ (05-01)
- /directions/ (05-02)

Both pages cross-link to each other with keyword-rich anchor text, have page-specific OG tags, inline FAQ schema, and speakable schema. Full QA passes.

No blockers for future phases. The pre-existing concern about FAQSchema emitting on all pages (including /directions/ and /near-grand-canyon/) remains a future optimization — Google may flag FAQ schema on pages where FAQ content is not visible in the UI.

---
*Phase: 05-geo-content-pages*
*Completed: 2026-02-21*
