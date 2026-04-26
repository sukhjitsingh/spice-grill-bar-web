---
phase: quick
plan: 260401-fv4
subsystem: seo
tags: [seo, og-tags, schema, faq, geo-pages]
dependency_graph:
  requires: []
  provides: [faq-og-meta, scoped-faq-schema, dynamic-og-url]
  affects: [src/pages/faq.astro, src/layouts/Layout.astro, src/pages/near-grand-canyon.astro, src/pages/directions.astro]
tech_stack:
  added: []
  patterns: [conditional-schema-rendering, dynamic-canonical-url]
key_files:
  created: []
  modified:
    - src/pages/faq.astro
    - src/layouts/Layout.astro
    - src/pages/near-grand-canyon.astro
    - src/pages/directions.astro
decisions:
  - FAQSchema scoped to /faq/ path using currentPath.startsWith('/faq') — prevents Google from flagging FAQ schema on non-FAQ pages
  - ogUrl removed from GEO pages — Layout canonical URL computation is sufficient and resilient to domain changes
metrics:
  duration: ~5min
  completed: 2026-04-01
  tasks_completed: 2
  files_modified: 4
---

# Quick Task 260401-fv4: Fix SEO Issues — FAQ OG Tags, FAQSchema Scope, GEO ogUrl Summary

**One-liner:** FAQ-specific OG meta tags added, FAQSchema conditionally rendered on /faq/ only, and hardcoded ogUrl removed from GEO pages in favor of Layout's dynamic canonical URL computation.

## Tasks Completed

| Task | Name | Commit | Files Modified |
|------|------|--------|----------------|
| 1 | Add FAQ OG props and scope FAQSchema to /faq/ only | a294910 | src/pages/faq.astro, src/layouts/Layout.astro |
| 2 | Remove hardcoded ogUrl from GEO pages | 40b525b | src/pages/near-grand-canyon.astro, src/pages/directions.astro |

## Changes Made

### Task 1: FAQ OG meta tags + FAQSchema scoping

**src/pages/faq.astro** — Added two props to the Layout call:
- `ogTitle="FAQ | Spice Grill & Bar — Common Questions Answered"`
- `ogDescription="Find answers to common questions about Spice Grill & Bar — hours, location, menu, vegetarian options, and more."`

**src/layouts/Layout.astro** — Wrapped FAQSchema render in a conditional:
- Before: `<FAQSchema />`
- After: `{currentPath.startsWith('/faq') && <FAQSchema />}`

### Task 2: Remove hardcoded ogUrl from GEO pages

**src/pages/near-grand-canyon.astro** and **src/pages/directions.astro** — Removed the `ogUrl` prop from each Layout call. The Layout already computes `canonicalURL` from `Astro.url.pathname + Astro.site` and uses it as `ogUrl ?? canonicalURL` fallback.

## Verification Results

All success criteria passed after build:

| Check | Expected | Result |
|-------|----------|--------|
| FAQ og:title | "FAQ \| Spice Grill & Bar — Common Questions Answered" | PASS |
| FAQ og:description | FAQ-specific description | PASS |
| FAQPage schema on homepage | 0 occurrences | PASS (was 1, now 0) |
| FAQPage schema on /faq/ | 1+ occurrences | PASS |
| og:url on near-grand-canyon | computed dynamically | PASS |
| og:url on directions | computed dynamically | PASS |
| Build | no errors | PASS |

## Deviations from Plan

None — plan executed exactly as written. The worktree files differed from the main workspace (worktree was an older branch state), so changes were applied to the main workspace files where the build runs.

## Known Stubs

None.

## Self-Check: PASSED

- src/pages/faq.astro — modified, ogTitle/ogDescription props present
- src/layouts/Layout.astro — modified, FAQSchema conditional present
- src/pages/near-grand-canyon.astro — modified, ogUrl prop removed
- src/pages/directions.astro — modified, ogUrl prop removed
- Commit a294910 — verified exists
- Commit 40b525b — verified exists
