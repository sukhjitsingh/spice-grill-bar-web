---
phase: 12-schema-entity-disambiguation
verified: 2026-05-14T15:00:00Z
status: human_needed
score: 4/5 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Open Google Rich Results Test (https://search.google.com/test/rich-results) against https://spicegrillbar66.com/ and confirm no entity collision warning appears between the Restaurant and Organization JSON-LD blocks"
    expected: "Structured data tool shows two distinct entities — one Restaurant (@id ends in #restaurant) and one Organization (@id ends in #organization) — with no duplicate-entity or collision warning"
    why_human: "Google's Rich Results Test is an external service; no programmatic API is available to assert collision-free entity resolution from the codebase alone"
---

# Phase 12: Schema Entity Disambiguation — Verification Report

**Phase Goal:** AI engines and Google's Knowledge Graph can unambiguously resolve the restaurant as a distinct entity from its organization record, and AI crawlers can discover the full plain-text site content
**Verified:** 2026-05-14T15:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | RestaurantSchema JSON-LD carries a distinct @id fragment #restaurant | VERIFIED | Line 21 of `RestaurantSchema.astro`: `'@id': 'https://spicegrillbar66.com/#restaurant'`. Fragment present in `dist/index.html` (grep confirmed 1 match). |
| 2 | OrganizationSchema JSON-LD carries a distinct @id fragment #organization | VERIFIED | Line 7 of `OrganizationSchema.astro`: `'@id': 'https://spicegrillbar66.com/#organization'`. Fragment present in `dist/index.html` (grep confirmed 1 match). |
| 3 | RestaurantSchema exposes a sameAs array with all 5 profile URLs | VERIFIED | Lines 24-30 of `RestaurantSchema.astro`: array contains `google.com/maps?cid=5034425112937519671`, Yelp, TripAdvisor, Facebook, Instagram — all 5 required URLs present in correct order. |
| 4 | Both schemas reference the same canonical CID Google Maps URL (no short link in sameAs) | VERIFIED | RestaurantSchema sameAs[0]: `https://www.google.com/maps?cid=5034425112937519671`. OrganizationSchema sameAs[0]: same CID URL. `maps.app.goo.gl` has 0 occurrences in OrganizationSchema. `hasMap` in RestaurantSchema retains the short link (intentionally out of scope per 12-CONTEXT). |
| 5 | AI crawlers can discover /llms.txt and /llms-full.txt via rel=alternate text/plain links; no rel=help remains | VERIFIED | Lines 70-71 of `Layout.astro`: two `<link rel="alternate" type="text/plain">` elements for `/llms.txt` and `/llms-full.txt`. `grep -c 'rel="help"'` returns 0. Both links immediately follow the manifest link (line 69), satisfying D-05 positional requirement. |
| 6 | AEO audit gate fails build when @id fragments are absent; skips gracefully with no prior build | VERIFIED | `aeo-audit.mjs` lines 98-114: gate reads `dist/index.html` via `fs.readFileSync`, checks both literal strings (`"@id":"https://spicegrillbar66.com/#restaurant"` and `"@id":"https://spicegrillbar66.com/#organization"`), increments `errors` on failure, uses `fs.existsSync` guard with `console.warn` (no `errors++`) on absent dist. `node scripts/aeo-audit.mjs` exits 0 with all gates passing (confirmed via live run). |
| 7 | Google Rich Results Test shows no entity collision warning (ROADMAP SC #5) | UNCERTAIN | Cannot verify programmatically. Requires human check against live or staged URL. |

**Score:** 6/7 truths verified (all programmatically verifiable truths pass; 1 requires human check)

Mapped to ROADMAP Success Criteria:

| SC | Text | Status |
|----|------|--------|
| SC-1 | RestaurantSchema @id and 5-URL sameAs | VERIFIED |
| SC-2 | OrganizationSchema distinct @id | VERIFIED |
| SC-3 | Layout.astro rel=alternate for llms.txt | VERIFIED |
| SC-4 | Layout.astro second rel=alternate for llms-full.txt | VERIFIED |
| SC-5 | Google Rich Results Test — no entity collision | UNCERTAIN — human needed |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/schema/RestaurantSchema.astro` | Restaurant JSON-LD with @id and sameAs | VERIFIED | @id at line 21; sameAs array lines 24-30 with all 5 URLs; file is substantive (147 lines, full schema with all properties); imported and rendered in Layout.astro line 121. |
| `src/components/schema/OrganizationSchema.astro` | Organization JSON-LD with distinct @id | VERIFIED | @id at line 7; sameAs[0] is canonical CID URL; file substantive (37 lines); imported and rendered in Layout.astro line 124. |
| `src/layouts/Layout.astro` | AI crawler discovery links for llms.txt and llms-full.txt | VERIFIED | Lines 70-71: two `rel="alternate" type="text/plain"` links in correct position; no `rel="help"` present. |
| `scripts/aeo-audit.mjs` | @id fragment gate on dist/index.html | VERIFIED | Lines 97-114: gate #4 implemented with existsSync guard, readFileSync, both literal string checks, graceful skip path confirmed (no errors++ in warn branch). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `RestaurantSchema.astro` | `OrganizationSchema.astro` | Shared CID URL `google.com/maps?cid=5034425112937519671` in sameAs | WIRED | Both schemas contain the identical canonical CID URL. grep confirms 1 match in each file. Short link `maps.app.goo.gl` removed from OrganizationSchema sameAs; retained only in `hasMap` of RestaurantSchema (intentional, out of scope). |
| `scripts/aeo-audit.mjs` | `dist/index.html` | `fs.readFileSync` + literal string `.includes()` | WIRED | Gate path computed via `path.join(ROOT_DIR, 'dist/index.html')` at line 98. Live audit run confirmed: `✓ @id gate: both #restaurant and #organization @id fragments found in dist/index.html`. |

### Data-Flow Trace (Level 4)

RestaurantSchema and OrganizationSchema are static JSON-LD schema components — their `@id` and `sameAs` properties are hardcoded string literals, not state or props. No dynamic data flow needed; the values are author-defined constants appropriate for schema identity anchors.

The only dynamic data in RestaurantSchema (`aggregateRating.ratingValue` and `aggregateRating.reviewCount`) is populated from `reviews.json` at build time — unchanged by this phase and not relevant to the @id/sameAs changes.

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `RestaurantSchema.astro` (@id, sameAs) | Hardcoded literals | Author-defined constants | N/A — identity anchors are not dynamic | VERIFIED (static is correct for schema @id) |
| `OrganizationSchema.astro` (@id, sameAs) | Hardcoded literals | Author-defined constants | N/A — identity anchors are not dynamic | VERIFIED (static is correct for schema @id) |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| AEO audit exits 0 with @id gate passing | `node scripts/aeo-audit.mjs` (with dist/ present) | Exit code 0; `✓ @id gate: both #restaurant and #organization @id fragments found in dist/index.html` | PASS |
| dist/index.html contains #restaurant @id | `grep -c '"@id":"https://spicegrillbar66.com/#restaurant"' dist/index.html` | 1 | PASS |
| dist/index.html contains #organization @id | `grep -c '"@id":"https://spicegrillbar66.com/#organization"' dist/index.html` | 1 | PASS |
| Layout.astro has 2 rel=alternate text/plain links and 0 rel=help | `grep -c 'rel="alternate" type="text/plain"'` / `grep -c 'rel="help"'` | 2 / 0 | PASS |
| OrganizationSchema has no short Maps link in sameAs | `grep -c "maps.app.goo.gl" OrganizationSchema.astro` | 0 | PASS |

### Probe Execution

No conventional `scripts/*/tests/probe-*.sh` probes declared or found for this phase. Phase relied on inline verification commands documented in PLAN acceptance criteria — all confirmed passing via direct grep and live audit run above.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| AEO-11 | 12-01-PLAN.md | RestaurantSchema adds `@id: #restaurant` and sameAs; OrganizationSchema adds `@id: #organization` to prevent entity graph collision | SATISFIED | `@id` fragments confirmed in both source files and `dist/index.html`. Both distinct fragments. |
| AEO-16 | 12-02-PLAN.md | Layout.astro llms.txt link updated from `rel="help"` to `rel="alternate" type="text/plain"`; second link for llms-full.txt added | SATISFIED | Lines 70-71 of `Layout.astro` confirmed; `rel="help"` absent (grep returns 0). |

No orphaned requirements: REQUIREMENTS.md Traceability table maps AEO-10 to Phase 13, AEO-12/13 to Phase 14, AEO-14/15 to Phase 15 — none of those are claimed by Phase 12 plans.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | — | — | — |

No debt markers (TBD, FIXME, XXX), placeholder values, empty returns, or stub patterns found in any of the 4 modified files. Changes are additive (new string properties) with no removals or structural changes beyond the sameAs[0] URL swap in OrganizationSchema.

### Human Verification Required

#### 1. Google Rich Results Test — Entity Disambiguation

**Test:** Navigate to https://search.google.com/test/rich-results and test the URL `https://spicegrillbar66.com/` (or the staging URL if not yet deployed). Review the structured data output.

**Expected:** Two separate schema blocks are detected — one of type `Restaurant` with `@id` ending in `#restaurant`, and one of type `Organization` with `@id` ending in `#organization`. No "duplicate entity" or "entity collision" warning appears. The Rich Results tool should accept both blocks as describing distinct entities.

**Why human:** Google's Rich Results Test is an external web service with no programmatic API. The codebase changes are verified (distinct @id values in source and built output), but the actual Knowledge Graph resolution and collision detection behavior can only be confirmed by running the external tool against the live or staged site.

### Gaps Summary

No gaps. All programmatically verifiable must-haves pass at all levels (source existence, substantive content, wiring, build output, and live audit execution). One ROADMAP success criterion (SC-5: Google Rich Results Test confirmation) requires human verification with an external service tool and cannot be confirmed programmatically from the codebase.

---

_Verified: 2026-05-14T15:00:00Z_
_Verifier: Claude (gsd-verifier)_
