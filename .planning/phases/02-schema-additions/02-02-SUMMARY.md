---
phase: 02-schema-additions
plan: 02
subsystem: schema
tags: [json-ld, organization-schema, website-schema, same-as, entity-linking, geo-seo, aeo]
dependency_graph:
  requires: []
  provides: [organization-entity-links, website-schema-description]
  affects:
    [src/components/schema/OrganizationSchema.astro, src/components/schema/WebSiteSchema.astro]
tech_stack:
  added: []
  patterns: [schema-dts typed JSON-LD, GEO-optimized description]
key_files:
  modified:
    - src/components/schema/OrganizationSchema.astro
    - src/components/schema/WebSiteSchema.astro
decisions:
  - Google Maps short URL (maps.app.goo.gl/q2EJFMbMRaysU6vH8) used as-is — CONTEXT.md is authoritative over REQUIREMENTS.md
  - inLanguage added to WebSiteSchema (Claude discretion per CONTEXT.md — zero cost, minor signal)
  - publisher uses minimal inline Organization object to avoid duplicating full schema
  - No SearchAction on WebSiteSchema (user decision: site has no search functionality)
metrics:
  duration: 3 min
  completed: 2026-02-21
  tasks_completed: 2
  files_modified: 2
---

# Phase 02 Plan 02: Schema Entity Linking and WebSiteSchema Enrichment Summary

**One-liner:** Expanded OrganizationSchema sameAs to 5 platform entries (Google Maps, Yelp, TripAdvisor, Facebook, Instagram) and enriched WebSiteSchema with GEO-optimized description, publisher reference, and inLanguage.

## Tasks Completed

| Task | Name                                                                 | Commit  | Files Modified                                 |
| ---- | -------------------------------------------------------------------- | ------- | ---------------------------------------------- |
| 1    | Expand OrganizationSchema sameAs with Google Maps, Yelp, TripAdvisor | 53734a3 | src/components/schema/OrganizationSchema.astro |
| 2    | Add description, publisher, and inLanguage to WebSiteSchema          | 7f8837a | src/components/schema/WebSiteSchema.astro      |

## Changes Made

### Task 1: OrganizationSchema sameAs expansion

`src/components/schema/OrganizationSchema.astro` — sameAs array expanded from 2 to 5 entries:

```typescript
sameAs: [
  'https://maps.app.goo.gl/q2EJFMbMRaysU6vH8',        // Google Maps (new)
  'https://www.yelp.com/biz/spice-grill-and-bar-ash-fork',  // Yelp (new)
  'https://www.tripadvisor.com/Restaurant_Review-g29037-d33218710-Reviews-Spice_Grill_Bar-Ash_Fork_Arizona.html',  // TripAdvisor (new)
  'https://www.facebook.com/profile.php?id=61566349169122',  // existing
  'https://www.instagram.com/panjabi_dhaba_sgb',             // existing
],
```

Ordering follows CONTEXT.md decision: Google first (highest authority), then review platforms (Yelp, TripAdvisor), then social media (Facebook, Instagram).

### Task 2: WebSiteSchema enrichment

`src/components/schema/WebSiteSchema.astro` — three new properties added:

```typescript
description: 'Spice Grill & Bar — authentic Indian and Punjabi restaurant on Historic Route 66 in Ash Fork, Arizona (I-40 Exit 146). The perfect pit stop for Grand Canyon travelers.',
inLanguage: 'en',
publisher: {
  '@type': 'Organization',
  name: 'Spice Grill & Bar',
  url: 'https://spicegrillbar66.com',
},
```

Description hits all three mandatory GEO keywords: "Ash Fork", "Exit 146", "Route 66". Also mentions Grand Canyon as a traveler signal.

## Verification Results

- `npm run typecheck` — 0 errors, 0 warnings (27 pre-existing hints in UI components, out of scope)
- `npm run build` — succeeds, 2 pages generated
- `npm run test:quality` — lint, knip, typecheck, AEO audit all pass
- `dist/index.html` Organization JSON-LD confirmed: sameAs array has 5 entries in correct order
- `dist/index.html` WebSite JSON-LD confirmed: description with all 3 GEO keywords, publisher, inLanguage, no SearchAction

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- `src/components/schema/OrganizationSchema.astro` — FOUND
- `src/components/schema/WebSiteSchema.astro` — FOUND
- Commit 53734a3 — FOUND
- Commit 7f8837a — FOUND
- sameAs has 5 entries including tripadvisor.com — CONFIRMED
- WebSite description contains "Exit 146" — CONFIRMED
