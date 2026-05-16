---
phase: 12-schema-entity-disambiguation
plan: "01"
subsystem: schema
tags: [aeo, schema-org, json-ld, entity-disambiguation, seo]
requirements: [AEO-11]

dependency_graph:
  requires: []
  provides:
    - "RestaurantSchema JSON-LD with distinct #restaurant @id and 5-URL sameAs"
    - "OrganizationSchema JSON-LD with distinct #organization @id and canonical CID Maps URL"
  affects:
    - "Knowledge Graph entity resolution for Spice Grill & Bar"
    - "AI engine cross-linking between Restaurant and Organization entities"

tech_stack:
  added: []
  patterns:
    - "schema-dts WithContext<T> @id property for JSON-LD entity anchors"
    - "Canonical CID Google Maps URL pattern (google.com/maps?cid=...) for stable entity references"

key_files:
  created: []
  modified:
    - src/components/schema/RestaurantSchema.astro
    - src/components/schema/OrganizationSchema.astro

decisions:
  - "Used '@id' near top of schema object (after @context/@type) per conventional JSON-LD ordering"
  - "sameAs placed immediately after url property in RestaurantSchema (entity-level sibling)"
  - "hasMap kept as maps.app.goo.gl short link — out of scope per D-CONTEXT"
  - "Canonical CID URL https://www.google.com/maps?cid=5034425112937519671 used in both schemas (D-01, D-02)"

metrics:
  duration: "~10 minutes"
  completed: "2026-05-14"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 2
---

# Phase 12 Plan 01: Schema Entity Disambiguation - @id and sameAs Summary

**One-liner:** Added distinct `#restaurant` and `#organization` JSON-LD `@id` fragments plus a 5-URL `sameAs` profile array to RestaurantSchema, and canonicalized the Maps URL in OrganizationSchema to the stable CID form.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add @id and sameAs to RestaurantSchema | aa6d7b9 | src/components/schema/RestaurantSchema.astro |
| 2 | Add @id to OrganizationSchema and canonicalize Maps URL | deb8695 | src/components/schema/OrganizationSchema.astro |

## Changes Made

### Task 1: RestaurantSchema.astro

Added immediately after `'@type': 'Restaurant'`:
- `'@id': 'https://spicegrillbar66.com/#restaurant'`

Added after `url` property — entity-level `sameAs` array with 5 URLs:
1. `https://www.google.com/maps?cid=5034425112937519671` (canonical CID URL per D-01)
2. `https://www.yelp.com/biz/spice-grill-and-bar-ash-fork`
3. `https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html`
4. `https://www.facebook.com/profile.php?id=61566349169122`
5. `https://www.instagram.com/panjabi_dhaba_sgb`

`hasMap: 'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8'` left unchanged (out of scope).

### Task 2: OrganizationSchema.astro

Added immediately after `'@type': 'Organization'`:
- `'@id': 'https://spicegrillbar66.com/#organization'`

Updated `sameAs[0]` from `'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8'` to `'https://www.google.com/maps?cid=5034425112937519671'` (canonical CID URL per D-02). All other 4 sameAs entries unchanged.

## Verification

- `npm run typecheck` — 0 errors, 0 warnings (schema-dts accepts both `@id` and `sameAs` without casting)
- `npm run build` — completed successfully
- `dist/index.html` contains `"@id":"https://spicegrillbar66.com/#restaurant"` — confirmed
- `dist/index.html` contains `"@id":"https://spicegrillbar66.com/#organization"` — confirmed
- Two `@id` fragment values are distinct (`#restaurant` != `#organization`) — no entity graph collision

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None — all properties are wired to real data. No placeholder values introduced.

## Threat Flags

None — changes are JSON-LD metadata additions only. No new network endpoints, auth paths, file access patterns, or trust boundary changes introduced.

## Self-Check: PASSED

- src/components/schema/RestaurantSchema.astro — modified (confirmed in git log)
- src/components/schema/OrganizationSchema.astro — modified (confirmed in git log)
- Commit aa6d7b9 — exists (Task 1)
- Commit deb8695 — exists (Task 2)
- Both @id fragments present in dist/index.html — verified via grep
