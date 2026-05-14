---
phase: 11-aeo-refinement
plan: 07
subsystem: geo-content
tags: [aeo, geo, near-williams, kaibab-estates-west, speakable, lighthouse, footer]

requires:
  - "near-grand-canyon.astro pattern (template for AEO/GEO landing pages)"
  - "11-01-OWNER-CONFIRMATION.md Kaibab 'north' correction"
provides:
  - "src/pages/near-williams.astro (~212 lines): GEO landing page targeting Williams tourists + Kaibab Estates West residents"
  - "Inline FAQPage + SpeakableSpecification schemas page-scoped (mirrors near-grand-canyon pattern)"
  - "Footer.astro Explore link 'Near Williams' between Near Grand Canyon and Directions"
  - ".lighthouserc.json url[] includes /near-williams/ (LH CI now audits 5 pages)"
  - "Astro sitemap auto-discovers /near-williams/ — verified post-build"
affects: [11-08-aeo-audit-gates]

tech-stack:
  added: []
  patterns:
    - "Mirrored near-grand-canyon.astro structure verbatim, then substituted city/distance/title strings — preserves M3 surface tokens, speakable-* class hooks, and inline schema injection style"
    - "Kaibab Estates West called out as DIRECTION-DISTINCT from Williams — 'north' (not on I-40) for Kaibab, 'east' (on I-40) for Williams"

key-files:
  created:
    - src/pages/near-williams.astro
  modified:
    - src/components/Footer.astro
    - .lighthouserc.json
    - public/llms.txt (restoration of Payment Methods header — see Deviations)

key-decisions:
  - "Page targets TWO audiences in one URL: Williams tourists (Grand Canyon Railway gateway) and Kaibab Estates West residents (residential community 5 mi north). Avoids creating a separate /near-kaibab/ page when traffic likely comes from a shared search intent."
  - "Distance section ordering: lead with Williams (18 mi east), then Kaibab Estates West (5 mi NORTH — owner correction), then Grand Canyon, Flagstaff, Seligman, Kingman. Skipped Phoenix/Vegas/LA — those are on near-grand-canyon already; this page is hyperlocal."
  - "Speakable cssSelector reuses existing class hooks (.speakable-heading / .speakable-lead / .speakable-hours) for parity with near-grand-canyon.astro and directions.astro — site-wide voice convention preserved."
  - "What to Order section copied verbatim from near-grand-canyon (Fish Pakora, Butter Chicken, Shahi Paneer, Chicken Biryani) — same recommendation set for highway travelers regardless of approach direction."

patterns-established:
  - "GEO landing page mirroring: when adding a new /near-{city}/ page, copy the closest existing GEO page wholesale, then run a substitution table from RESEARCH.md to swap city/distance/title strings while preserving structural and stylistic conventions."
  - "Owner-correction propagation: a single CONTEXT.md fact correction (Kaibab 'east on I-40' → 'north of Ash Fork') ripples through 11-04 (FAQ) AND 11-07 (page) — both honor it consistently."

requirements-completed: [AEO-08]

duration: ~5 min (initial subagent timed out mid-run; completed inline)
completed: 2026-05-06
---

# Phase 11 — Plan 07: Near Williams GEO Page

**Created `/near-williams/` GEO landing page mirroring the `/near-grand-canyon/` pattern; targets Williams tourists (18 mi east on I-40) and Kaibab Estates West residents (5 mi north of Ash Fork — owner correction).**

## Performance

- **Duration:** ~5 min wall clock (initial parallel subagent timed out at quota limit; finished inline)
- **Started:** 2026-05-06 (Wave 3)
- **Completed:** 2026-05-06
- **Tasks:** 2/2 (page creation + wiring)
- **Files modified:** 4

## Accomplishments

- `src/pages/near-williams.astro` (~212 lines) — full GEO page with answer-first H1, speakable lead, standalone Exit 146 sentence, "Why Stop Here" / "Distance from Nearby Cities" / "What to Order" sections, inline FAQPage + SpeakableSpecification schemas
- Footer.astro Explore section now lists Near Grand Canyon → **Near Williams** → Directions → FAQ
- `.lighthouserc.json` audits 5 pages (was 4): adds `/near-williams/`
- Kaibab Estates West direction correction applied — "north" not "east", NOT on I-40

## Task Commits

1. **Task 1: Create near-williams.astro** — initial draft committed during a subagent run that timed out at quota; file content remained intact in working tree
2. **Task 1+2 (consolidated):** `2cc4b1a` (feat) — final commit with page + Footer link + lhci URL + llms.txt restoration

## Files Created/Modified

- `src/pages/near-williams.astro` (created, ~212 lines)
- `src/components/Footer.astro` (added Near Williams Explore link, +9 lines)
- `.lighthouserc.json` (added URL to url[] array)
- `public/llms.txt` (restored `## Payment Methods` header from 11-08 smoke-test breakage — see Deviations)

## Acceptance Criteria — Verified

- ✅ `dist/near-williams/index.html` exists post-build
- ✅ `<link rel="canonical">` present (1 occurrence)
- ✅ `near-williams` in `dist/sitemap-0.xml` (auto-discovery worked)
- ✅ `near-williams` in `.lighthouserc.json` (1 occurrence)
- ✅ `Near Williams` in Footer.astro Explore section
- ✅ Kaibab "north" correction applied (`5 miles north` present in page)
- ✅ Glass budget honored (`grep -cE "backdrop-blur|class=.glass" src/pages/near-williams.astro` returns 0)
- ✅ No claim that Kaibab is on I-40
- ✅ `npm run build` exits 0 (5 pages built)
- ✅ `npm run typecheck` exits 0 (0 errors, 0 warnings, 11 hints — pre-existing, unrelated)
- ✅ `npm run test:aeo` exits 0

## Deviations

1. **Initial subagent timeout (Rule 4 — environmental):** The Wave 3 parallel subagent for this plan was killed by Anthropic quota limits at ~tool_use 18 / 130s, before the wiring tasks (Footer + lhci) could complete. The page file (`src/pages/near-williams.astro`) was authored during the partial run and remained in the working tree. After quota reset, the orchestrator finished the wiring inline, restored a smoke-test breakage in `public/llms.txt` from the parallel 11-08 agent (`## Payment Methods (TEMP BROKEN)` → `## Payment Methods`), and committed all four files atomically.
2. **llms.txt restoration scope:** The fix to `public/llms.txt` is technically out-of-scope for this plan (11-08 owns that file's smoke-testing). It was bundled here to keep the working tree clean for verification. The 11-08 SUMMARY documents the smoke-test outcome separately.

## Self-Check: PASSED

All success criteria green. Page renders, schemas inject, sitemap discovers, Lighthouse CI is wired, Footer links resolve. Owner correction applied consistently with 11-04 (FAQ entry #2 Kaibab proximity).
