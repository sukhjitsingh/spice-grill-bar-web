---
phase: 12-schema-entity-disambiguation
reviewed: 2026-05-14T21:34:05Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - src/components/schema/RestaurantSchema.astro
  - src/components/schema/OrganizationSchema.astro
  - src/layouts/Layout.astro
  - scripts/aeo-audit.mjs
findings:
  critical: 2
  warning: 3
  info: 2
  total: 7
status: issues_found
---

# Phase 12: Code Review Report

**Reviewed:** 2026-05-14T21:34:05Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Phase 12 adds `@id` fragment identifiers to `RestaurantSchema.astro` and `OrganizationSchema.astro`, updates the `sameAs[0]` URL to the canonical CID Maps URL in both schemas, replaces the `rel="help"` link with dual `rel="alternate" type="text/plain"` links for `llms.txt` / `llms-full.txt` in `Layout.astro`, and adds a build-output `@id` gate to `aeo-audit.mjs`.

The core implementation is structurally sound — `@id` fragments are correctly formed, the CID Maps URL is consistent across both schemas, and the audit gate produces the right verdict against the actual `dist/index.html`. However, two issues require attention before shipping: a coordinate mismatch between the `geo.position` meta tag and the `GeoCoordinates` object that sends conflicting location signals to crawlers (~430 m apart), and an incomplete entity graph because `WebSiteSchema`'s `publisher` object does not carry a back-reference to `#organization` — which directly undermines the disambiguation goal of this phase. Three further quality gaps are noted.

---

## Critical Issues

### CR-01: Geo coordinates are inconsistent between meta tag and JSON-LD schema (~430 m longitude drift)

**File:** `src/layouts/Layout.astro:104` and `src/components/schema/RestaurantSchema.astro:80-81`

**Issue:** `Layout.astro` emits `<meta name="geo.position" content="35.2241;-112.4829" />` while `RestaurantSchema.astro` emits `latitude: 35.22291449138381, longitude: -112.47815397255074`. The latitude difference is ~131 m and the longitude difference is ~430 m. This is not a rounding artifact — they differ at the third decimal place. Google's local search reconciles both signals; conflicting coordinates risk placing the entity pin in the wrong location or reducing confidence in the canonical coordinates. This defect pre-dates Phase 12 but the schema `geo` object is an in-scope file.

**Fix:** Align both to the same authoritative coordinates. The higher-precision schema value is more likely correct. Update `Layout.astro` line 104:

```html
<meta name="geo.position" content="35.22291;-112.47815" />
```

Or, if the meta tag value is authoritative, update `RestaurantSchema.astro` lines 80-81:

```ts
latitude: 35.2241,
longitude: -112.4829,
```

Pick one source of truth and make both match.

---

### CR-02: `WebSiteSchema.astro` publisher is an anonymous inline object — no `@id` cross-reference to `#organization`

**File:** `src/components/schema/WebSiteSchema.astro:12-16`

**Issue:** The `publisher` property emits a bare `{ "@type": "Organization", "name": "...", "url": "..." }` object. Because it lacks `"@id": "https://spicegrillbar66.com/#organization"`, knowledge graphs cannot link this `WebSite` node to the `Organization` entity established in `OrganizationSchema.astro`. This directly defeats the entity-disambiguation goal of Phase 12: the `#restaurant` and `#organization` fragments are defined but never wired into the `WebSite` graph. `WebSiteSchema.astro` is not in the explicit `files` list for this phase, but the Phase 12 goal is entity disambiguation across the site's JSON-LD graph, and this file is actively injected on every page by `Layout.astro`. Leaving the inline publisher object unlinked means the work is incomplete.

**Fix:** Replace the inline publisher object with an `@id` reference:

```ts
publisher: {
  '@type': 'Organization',
  '@id': 'https://spicegrillbar66.com/#organization',
},
```

---

## Warnings

### WR-01: `@id` gate reads potentially stale `dist/` when `test:quality` runs without a prior build

**File:** `scripts/aeo-audit.mjs:99-114`

**Issue:** `test:quality` (`lint + knip + typecheck + test:aeo`) is designed to run without building first. When `dist/index.html` already exists from a previous build (which is the normal state on a dev machine), the `@id` gate silently reads that stale file. A developer who deletes the `@id` fragments from the schemas and then runs `npm run test:quality` will see the gate pass — because it checked yesterday's build. The gate only reliably enforces correctness in the `qa` script (`build → test:quality → lhci`).

The warn-and-skip path (dist missing) is fine; the false-negative path (stale dist) is the problem.

**Fix:** Either document clearly in the gate's warning message that a stale dist produces an unreliable result, or check the modification time of `dist/index.html` against the schema source files and warn when `dist/` is older:

```js
// After existsSync check, before reading:
const distMtime = fs.statSync(distIndexPath).mtimeMs;
const schemaMtime = Math.max(
  fs.statSync(path.join(ROOT_DIR, 'src/components/schema/RestaurantSchema.astro')).mtimeMs,
  fs.statSync(path.join(ROOT_DIR, 'src/components/schema/OrganizationSchema.astro')).mtimeMs,
);
if (schemaMtime > distMtime) {
  console.warn('⚠️ @id gate: dist/index.html is older than schema sources — results may be stale. Run npm run build first.');
}
```

---

### WR-02: `aggregateRating` is unconditionally included even when `reviewCount` is 0

**File:** `src/components/schema/RestaurantSchema.astro:106-113`

**Issue:** When `reviews.json` contains no entries with a numeric `rating`, `ratingValue` is `0` and `reviewCount` is `0`. The schema unconditionally emits:

```json
"aggregateRating": { "ratingValue": 0, "reviewCount": 0, "bestRating": 5, "worstRating": 1 }
```

Google's structured data documentation explicitly requires `reviewCount` (or `ratingCount`) to be a positive integer greater than 0. A zero-count `AggregateRating` will trigger a Google Search Console validation error and suppress rich results. This matters because the weekly GitHub Actions job (`update-reviews.yml`) regenerates `reviews.json`; if the scrape fails or returns empty data, the schema becomes invalid.

**Fix:** Conditionally omit `aggregateRating` when there are no rated reviews:

```ts
// In the schema object:
...(reviewCount > 0
  ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue,
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }
  : {}),
```

---

### WR-03: `aeo-audit.mjs` does not validate that `llms-full.txt` exists in `public/`

**File:** `scripts/aeo-audit.mjs:48-72`

**Issue:** `Layout.astro` now links to both `/llms.txt` and `/llms-full.txt` (lines 70-71). The audit verifies `llms.txt` existence and content (gate 2), but has no corresponding check for `llms-full.txt`. If `llms-full.txt` is accidentally deleted from `public/`, the link in every page's `<head>` would return a 404, but `test:quality` would still pass. The file is currently generated by `prebuild` via `generate-llms-full.mjs`, but is also committed in `public/` — so a divergence is possible.

**Fix:** Add an existence check for `llms-full.txt` after the existing `llms.txt` check:

```js
const LLMS_FULL_PATH = path.join(ROOT_DIR, 'public/llms-full.txt');
if (fs.existsSync(LLMS_FULL_PATH)) {
  console.log('✅ llms-full.txt found.');
} else {
  console.error('❌ llms-full.txt missing in public/. Required for AI crawlers (linked from <head>).');
  errors++;
}
```

---

## Info

### IN-01: Inconsistent emoji in `@id` gate console output

**File:** `scripts/aeo-audit.mjs:100,109,112`

**Issue:** All other gates use `❌` / `✅` / `⚠️` (emoji with variation selector U+FE0F). The `@id` gate uses bare `✗`, `✓`, and `⚠` (U+26A0 without variation selector). This breaks visual consistency when reading terminal output and may cause the gate's success/failure lines to be overlooked during a quick scan.

**Fix:** Replace lines 100, 109, and 112 with the emoji-variant forms used by the other gates:

```js
// line 100
console.warn('⚠️ @id gate: dist/index.html not found — skipping (run npm run build first for full audit)');
// line 109
console.error(`❌ @id gate: dist/index.html missing @id fragment(s): ${missingIds.join(', ')}`);
// line 112
console.log('✅ @id gate: both #restaurant and #organization @id fragments found in dist/index.html');
```

---

### IN-02: `catch (err)` uses `err.message` which is `undefined` if a non-`Error` value is thrown

**File:** `scripts/aeo-audit.mjs:43-45`

**Issue:** `JSON.parse` always throws a proper `Error`, so this is low-risk in practice. However, accessing `.message` on an arbitrary caught value (`err`) is an anti-pattern; if a non-`Error` is thrown, `err.message` is `undefined` and the output becomes `"❌ Failed to parse FAQ data: undefined"`.

**Fix:**

```js
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error('❌ Failed to parse FAQ data:', msg);
  errors++;
}
```

---

_Reviewed: 2026-05-14T21:34:05Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
