---
phase: 13-faqpage-schema-compliance
plan: "01"
subsystem: schema
tags: [aeo, schema, json-ld, faqpage, geo, entity-graph]
dependency_graph:
  requires: []
  provides: [faqpage-home-schema, org-entity-chain, cid-verified-geo]
  affects: [src/layouts/Layout.astro, src/pages/index.astro, src/components/schema/WebSiteSchema.astro, src/components/schema/RestaurantSchema.astro, scripts/aeo-audit.mjs]
tech_stack:
  added: []
  patterns: [is:inline JSON-LD emission, raw-JS schema object in Astro frontmatter, path-conditional schema gate]
key_files:
  created: []
  modified:
    - src/layouts/Layout.astro
    - src/pages/index.astro
    - src/components/schema/WebSiteSchema.astro
    - src/components/schema/RestaurantSchema.astro
    - scripts/aeo-audit.mjs
decisions:
  - "D-01: FAQPage schema injected as inline is:inline script in index.astro using homeFaq array — no schema-dts import, raw JS object"
  - "D-02: FAQSchema gate narrowed from currentPath==='/'||startsWith('/faq') to startsWith('/faq') only; Layout.astro + index.astro shipped in single atomic commit"
  - "D-03: CID-verified geo 35.222908/-112.4781558 updated in Layout.astro geo.position meta (semicolons) and RestaurantSchema.astro GeoCoordinates"
  - "D-04: WebSiteSchema.astro publisher object gets @id https://spicegrillbar66.com/#organization to complete entity chain"
  - "D-06: Two commits used — schema changes first (Task 1 + 2 combined), audit gate second"
metrics:
  duration_minutes: 5
  completed_date: "2026-05-14"
  tasks_completed: 2
  files_modified: 5
---

# Phase 13 Plan 01: FAQPage Schema Compliance + Entity Graph Wiring Summary

**One-liner:** Eliminated Google FAQPage policy violation on home page by narrowing the 34-question FAQSchema gate to /faq/ only and injecting an 8-question inline FAQPage JSON-LD block on the home page; also wired WebSite publisher to Organization via @id and updated RestaurantSchema to CID-verified coordinates.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Atomic FAQPage fix — narrow FAQSchema gate + inject 8-question inline FAQPage schema | 786390d | src/layouts/Layout.astro, src/pages/index.astro |
| 2 | Wire entity graph + correct coordinates — WebSiteSchema @id and RestaurantSchema GeoCoordinates + AEO gate | 2237f40 | src/components/schema/WebSiteSchema.astro, src/components/schema/RestaurantSchema.astro, scripts/aeo-audit.mjs |

## Verification Results

- `npm run typecheck`: 0 errors, 0 warnings (11 informational hints, all pre-existing)
- `npm run build`: 5 pages built successfully
- Home page (`/`) FAQPage Question count: 8 (matches visible DOM section)
- FAQ page (`/faq/`) Question count: 34 (full schema preserved)
- `dist/index.html` contains `"@id":"https://spicegrillbar66.com/#organization"` in WebSite JSON-LD
- `dist/index.html` contains `"latitude":35.222908` and `"longitude":-112.4781558`
- `dist/index.html` contains `content="35.222908;-112.4781558"` for geo.position meta
- `npm run test:aeo`: All 5 gates PASS including new FAQPage Question count gate

## Changes Detail

### Task 1: src/layouts/Layout.astro

- **Line 104**: Updated geo.position meta from `35.2241;-112.4829` to `35.222908;-112.4781558` (CID-verified, semicolon separator format preserved)
- **Line 122**: Narrowed FAQSchema gate from `{(currentPath === '/' || currentPath.startsWith('/faq')) && <FAQSchema />}` to `{currentPath.startsWith('/faq') && <FAQSchema />}` — removes the 34-question block from the home page

### Task 1: src/pages/index.astro

- **Frontmatter**: Added `faqPageSchema` raw object (no schema-dts import per D-01) that maps `homeFaq` array (already defined at line 22) into FAQPage JSON-LD with 8 Question/Answer entries
- **Template**: Added `<script is:inline type="application/ld+json" set:html={JSON.stringify(faqPageSchema)} />` after the SpeakableSpecification script block — uses `is:inline` + `set:html` pattern required for Astro expression interpolation

### Task 2: src/components/schema/WebSiteSchema.astro

- **Publisher object**: Added `'@id': 'https://spicegrillbar66.com/#organization'` immediately after `'@type': 'Organization'` — wires WebSite node to OrganizationSchema entity established in Phase 12

### Task 2: src/components/schema/RestaurantSchema.astro

- **GeoCoordinates**: Replaced `latitude: 35.22291449138381` with `latitude: 35.222908` and `longitude: -112.47815397255074` with `longitude: -112.4781558` (CID-verified coordinates from Google Maps cid=5034425112937519671)

### Task 2: scripts/aeo-audit.mjs

- **Gate 4 extended**: Merged FAQPage Question count gate into the existing `@id` gate block (single file read, two checks). New gate verifies `dist/index.html` contains exactly 8 `"@type":"Question"` entries — CI-enforces schema/DOM alignment going forward

## Deviations from Plan

### Auto-added functionality (within plan scope)

**[Rule 2 - Missing Critical Functionality] Added aeo-audit.mjs FAQPage gate in Task 2**

- **Found during:** Task 2 review of PATTERNS.md and plan decisions
- **Issue:** The plan's `decisions_covered` D-06 explicitly mentions "audit gate second" as the second commit; the PATTERNS.md §aeo-audit.mjs section fully specified the implementation. The gate was not listed in Task 2's `<files>` but was clearly intended as part of the plan (D-06 reference).
- **Fix:** Added the FAQPage Question count gate to `scripts/aeo-audit.mjs` using the merged single-block approach from PATTERNS.md, bundled with Task 2 commit.
- **Files modified:** `scripts/aeo-audit.mjs`
- **Commit:** 2237f40

## Known Stubs

None. All data derives from `src/data/faq.json` via the existing `homeFaq` array. No hardcoded values or placeholders introduced.

## Threat Flags

None. All changes are static build-time JSON-LD modifications. The plan's threat register (T-13-01, T-13-02, T-13-03) covers the scope; no new trust boundaries or network endpoints introduced.

## Self-Check: PASSED

- `src/layouts/Layout.astro`: modified — verified FAQSchema gate narrowed, geo.position updated
- `src/pages/index.astro`: modified — verified faqPageSchema in frontmatter, is:inline script in template
- `src/components/schema/WebSiteSchema.astro`: modified — verified @id added to publisher
- `src/components/schema/RestaurantSchema.astro`: modified — verified CID coordinates updated
- `scripts/aeo-audit.mjs`: modified — verified FAQPage gate added and passing
- Commit 786390d exists: Task 1 — both Layout.astro and index.astro in stat
- Commit 2237f40 exists: Task 2 — WebSiteSchema.astro, RestaurantSchema.astro, aeo-audit.mjs in stat
