---
phase: 05-geo-content-pages
plan: 01
subsystem: pages/seo
tags: [geo, aeo, schema, open-graph, llms-txt]
dependency_graph:
  requires: []
  provides: [near-grand-canyon-page, og-props-layout, llms-txt-proximity]
  affects: [src/layouts/Layout.astro, src/pages/near-grand-canyon.astro, public/llms.txt, public/llms-full.txt, src/data/faq.json]
tech_stack:
  added: []
  patterns: [astro-page-shell, json-ld-schema, speakable-schema, aeo-passage-structure]
key_files:
  created:
    - src/pages/near-grand-canyon.astro
  modified:
    - src/layouts/Layout.astro
    - public/llms.txt
    - public/llms-full.txt
    - src/data/faq.json
decisions:
  - Layout.astro OG props use canonicalURL as fallback for og:url (not hardcoded homepage URL)
  - Page-specific inline FAQPage schema placed inside Layout slot (not in <head>) to be separate from global FAQSchema
  - Kingman distance updated from 80 miles (incorrect) to 97 miles (verified from research data)
  - llms.txt Monday hours formatted as **Mon**: Closed (consistent with existing bold markdown formatting)
metrics:
  duration: "7 minutes"
  completed: "2026-02-21"
  tasks_completed: 3
  files_modified: 5
---

# Phase 05 Plan 01: GEO Content Page — /near-grand-canyon/ Summary

**One-liner:** Created /near-grand-canyon/ page with AEO answer-first structure, 8 city distance facts as standalone paragraphs, speakable + FAQ schema, and fixed Monday hours and distance data across llms.txt, llms-full.txt, and faq.json.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Extend Layout.astro with per-page OpenGraph props | ab0490d | src/layouts/Layout.astro |
| 2 | Create /near-grand-canyon/ page with AEO passage structure | cc633ae | src/pages/near-grand-canyon.astro |
| 3 | Fix llms.txt, llms-full.txt, and update faq.json distance consistency | 9bf78a4 | public/llms.txt, public/llms-full.txt, src/data/faq.json |

## What Was Built

### Task 1: Layout.astro OG Props Extension

Added 3 optional props to `Layout.astro`: `ogTitle`, `ogDescription`, `ogUrl`. Updated 6 meta tags (og:url, og:title, og:description, twitter:url, twitter:title, twitter:description) to use dynamic values with smart fallbacks:
- `og:url` falls back to `canonicalURL` (the dynamically computed URL, not a hardcoded string)
- `og:title` falls back to `title` prop
- `og:description` falls back to `description` prop

This is a backward-compatible change — existing pages (homepage, faq) get the same behavior as before because their og props were undefined, triggering the fallbacks.

### Task 2: /near-grand-canyon/ Page

Full AEO-optimized proximity page at `src/pages/near-grand-canyon.astro`:

- **Answer-first H1:** "Spice Grill & Bar — About 78 Miles from Grand Canyon South Rim" with `speakable-heading` CSS class
- **Lead paragraph** with `speakable-lead` class: third-person factual statement about 78 miles, 1 hr 20 min, AZ-64 South + I-40 Exit 146
- **Standalone I-40 Exit 146 sentence** early on page (12-word voice-extractable answer)
- **Why Stop Here section:** 50-word recommendation rationale for AI engines (one of few sit-down restaurants between Williams and Seligman, authentic Punjabi, family-friendly, beer and wine, halal)
- **8 city distance sections:** Each city as standalone `<p>` paragraph (Grand Canyon, Flagstaff, Williams, Seligman, Kingman, Phoenix, Las Vegas, Los Angeles)
- **Top 5 dishes:** Fish Pakora, Butter Chicken, Shahi Paneer, Chicken Biryani, Garlic Naan in card grid with prices and descriptions
- **Hours paragraph** with `speakable-hours` class: standalone voice-extractable paragraph stating Tuesday-Thursday, Friday-Sunday hours, and Monday closed
- **Keyword-rich cross-links:** "Driving directions to Spice Grill & Bar from 7 cities", "View the full Spice Grill & Bar menu", "Frequently asked questions about Spice Grill & Bar"
- **Page-specific inline FAQPage schema:** 3 Q&A pairs targeting exact proximity queries
- **Speakable schema:** WebPage with cssSelector targeting `.speakable-heading`, `.speakable-lead`, `.speakable-hours`
- **Page-specific OG tags:** ogTitle, ogDescription, ogUrl all page-specific via Layout.astro props

### Task 3: llms.txt, llms-full.txt, faq.json Fixes

**llms.txt changes:**
- Fixed Monday hours: "Mon - Thurs: 8:00 AM - 9:00 PM" split into "**Mon**: Closed" + "**Tue - Thu**: 8:00 AM - 9:00 PM"
- Fixed FAQ Q&A hours answer to state Tuesday-Thursday and Closed Mondays
- Added Location & Proximity section with 5 city distances
- Added new URLs to Links section: /near-grand-canyon/, /directions/, /faq/

**llms-full.txt changes:**
- Fixed Monday hours: "**Monday - Thursday**" split into "**Monday**: Closed" + "**Tuesday - Thursday**"
- Added Location & Proximity section with 7 city distances (including Phoenix and Las Vegas)
- Added Pages section with all 4 site URLs before the Full Menu

**faq.json changes:**
- Updated 2 Grand Canyon entries from "about 70 miles" to "about 78 miles"
- Updated drive time from "roughly an hour's drive" to "roughly 1 hour 20 minutes"
- Updated Kingman distance from "about 80 miles" to "about 97 miles" (verified from research data)

## Decisions Made

1. **Layout.astro OG fallback uses canonicalURL:** The plan suggested `ogUrl ?? 'https://spicegrillbar66.com'` as fallback, but using `canonicalURL` (already computed from `Astro.url.pathname`) is semantically correct — pages that don't pass `ogUrl` still get the right canonical URL, not the homepage URL.

2. **Inline FAQPage schema inside Layout slot:** The `<script type="application/ld+json">` for page-specific FAQ schema is placed inside the Layout slot (at bottom of page, after `</main>`). This correctly places it outside `<main>` but inside `<body>`, keeping it separate from the global FAQSchema emitted by Layout's schema components.

3. **Kingman distance corrected to 97 miles:** The faq.json said "about 80 miles" but research data in 05-RESEARCH.md verified 97 miles. This is a significant enough discrepancy (~21%) to correct, especially since the near-grand-canyon page uses 97 miles.

## Deviations from Plan

None — plan executed exactly as written. The only minor variation was using `canonicalURL` as the og:url fallback instead of a hardcoded string, which is a strictly better choice documented in Decisions Made.

## Verification Results

- `npm run build` passes — 3 pages built: /, /faq/, /near-grand-canyon/
- `npm run typecheck` passes — 0 errors
- `npm run test:aeo` passes — all 20 FAQ items optimized
- Built /near-grand-canyon/index.html contains:
  - Page-specific og:url (https://spicegrillbar66.com/near-grand-canyon/)
  - Page-specific og:title (Indian Restaurant Near Grand Canyon — Spice Grill & Bar)
  - 2 FAQPage schema instances (1 global from FAQSchema.astro, 1 page-specific inline)
  - 1 SpeakableSpecification schema instance
  - 7 occurrences of "I-40 Exit 146"
  - "closed on Mondays" in standalone hours paragraph
  - "sit-down restaurants" in Why Stop Here section
  - 7 occurrences of "78 miles"
  - All internal links with trailing slashes (/directions/, /faq/, /)

## Self-Check

PASSED — verified:
- `src/pages/near-grand-canyon.astro` exists: confirmed (251 lines)
- `dist/near-grand-canyon/index.html` exists: confirmed
- Task 1 commit `ab0490d` exists: confirmed
- Task 2 commit `cc633ae` exists: confirmed
- Task 3 commit `9bf78a4` exists: confirmed
- No "70 miles" remaining in faq.json: confirmed
- Both llms files show Monday as closed: confirmed
