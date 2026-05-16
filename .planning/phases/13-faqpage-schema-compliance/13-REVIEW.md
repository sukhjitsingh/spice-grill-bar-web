---
phase: 13-faqpage-schema-compliance
reviewed: 2026-05-14T00:00:00Z
depth: standard
files_reviewed: 5
files_reviewed_list:
  - scripts/aeo-audit.mjs
  - src/components/schema/RestaurantSchema.astro
  - src/components/schema/WebSiteSchema.astro
  - src/layouts/Layout.astro
  - src/pages/index.astro
findings:
  critical: 1
  warning: 3
  info: 1
  total: 5
status: issues_found
---

# Phase 13: Code Review Report

**Reviewed:** 2026-05-14T00:00:00Z
**Depth:** standard
**Files Reviewed:** 5
**Status:** issues_found

## Summary

This phase moves the home page FAQPage schema from the global `FAQSchema.astro` component (which injected all 34 questions) to a curated 8-question subset emitted directly in `index.astro`. It also adds a new AEO audit gate that verifies exactly 8 `Question` entries appear in the built `dist/index.html`, adds `@id` to the `WebSiteSchema` publisher reference, and normalizes geo coordinates across `RestaurantSchema.astro` and the `<meta name="geo.position">` tag.

The structural design is sound: the built output confirms exactly 1 FAQPage block with exactly 8 Question entries on the home page, and the faq page retains its full 34-entry FAQPage schema independently. No duplicate schemas or regressions were found in the built output.

Two real defects exist: the `Speakable` `WebPage` schema is missing the required `url` property, which prevents search engines from associating the speakable block with the page URL; and the audit gate hardcodes the literal `8` that must stay in sync with `homeFaqIndices.length` in a separate file. Additionally `RestaurantSchema.astro` can emit an invalid `aggregateRating` with `ratingValue: 0` when there are no rated reviews, violating the `worstRating: 1` constraint.

---

## Critical Issues

### CR-01: `Speakable` `WebPage` schema missing required `url` property

**File:** `src/pages/index.astro:70-80`
**Issue:** The static `WebPage` schema that anchors the `SpeakableSpecification` does not include a `url` property. Google's Speakable structured data documentation states the `WebPage` entity must include the page URL so crawlers can associate the speakable content with the correct page. Without `url`, the speakable markup is unlikely to be recognized for voice-assistant extraction.

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Spice Grill & Bar"
  // no "url" — search engine cannot associate this with the page
}
```

**Fix:** Add `"url": "https://spicegrillbar66.com"` (or use the canonical URL) to the `WebPage` schema object:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "url": "https://spicegrillbar66.com",
    "name": "Spice Grill & Bar",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#home-faq h3", "#home-faq p"]
    }
  }
</script>
```

---

## Warnings

### WR-01: `AggregateRating` emitted with invalid `ratingValue: 0` when reviews are absent

**File:** `src/components/schema/RestaurantSchema.astro:7-16, 106-112`
**Issue:** When `ratedReviews` is empty (no reviews in `reviews.json` have a numeric rating), `ratingValue` is set to `0` and `reviewCount` is set to `0`, and the `aggregateRating` block is unconditionally included in the schema. Schema.org requires `ratingValue` to be between `worstRating` (1) and `bestRating` (5). A value of `0` is structurally invalid and Google's Rich Results tool will flag it. An `AggregateRating` with `reviewCount: 0` should not be emitted at all.

This is a pre-existing bug that was not introduced in this diff (the changed line was geo coordinate precision only), but it surfaces as a latent correctness issue in the code under review.

**Fix:** Guard the `aggregateRating` emission:

```typescript
const schema: WithContext<Restaurant> = {
  // ...
  ...(reviewCount > 0 && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }),
  // ...
};
```

### WR-02: FAQPage Question count gate hardcoded to literal `8`, not derived from source

**File:** `scripts/aeo-audit.mjs:119-124`
**Issue:** The audit gate checks `questionMatches.length !== 8` with a literal integer. The `8` must stay in sync with `homeFaqIndices.length` in `src/pages/index.astro`. If a developer updates `homeFaqIndices` (e.g., adds a 9th question) without updating the audit script, the gate will fail at CI time with a confusing error message and no indication of which file is the source of truth. The coupling is undocumented at the gate's call site.

**Fix:** Either add a comment naming the coupled constant, or — better — export the curated array length from a shared module. At minimum, add a comment:

```javascript
// FAQPage Question count gate — verifies exactly 8 Question entries in dist/index.html
// KEEP IN SYNC with homeFaqIndices.length in src/pages/index.astro
const EXPECTED_HOME_FAQ_COUNT = 8;
const questionMatches = distHtml.match(/"@type":"Question"/g) || [];
if (questionMatches.length !== EXPECTED_HOME_FAQ_COUNT) {
  console.error(
    `✗ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, expected exactly ${EXPECTED_HOME_FAQ_COUNT}`
  );
  errors++;
}
```

### WR-03: FAQPage gate silently skips when `dist/` is absent, but `test:quality` does not require a fresh build

**File:** `scripts/aeo-audit.mjs:99-101`
**Issue:** When `dist/index.html` is not found, both the `@id` gate and the new `FAQPage` gate emit `console.warn` and continue without incrementing `errors`. This means `npm run test:quality` (which is called by the pre-push hook via `npm run qa`) can pass the AEO audit even when the dist is absent or stale — the gate simply does not run. The `qa` script runs `build` first so the full workflow is safe, but `test:quality` run in isolation gives a false-passing audit.

**Fix:** Change the missing-dist handling to increment `errors` (or at minimum note the CI implication in a comment). If the intent is to allow `test:quality` to run without a build, add an explicit gate-skip message that makes the omission visible:

```javascript
if (!fs.existsSync(distIndexPath)) {
  // Running without a build — dist gates skipped. Run `npm run build` first for full audit.
  console.warn('⚠ dist/index.html not found — @id and FAQPage gates skipped.');
  // Note: `npm run qa` (build + test:quality) runs these gates. Standalone `test:quality` does not.
} else {
  // ... gate logic
}
```

---

## Info

### IN-01: `faqData` indices in `index.astro` are order-dependent on `faq.json` position

**File:** `src/pages/index.astro:21`
**Issue:** `homeFaqIndices = [14, 2, 3, 13, 10, 1, 15, 21]` references entries by their 0-based array position in `src/data/faq.json`. The comment documents each mapping ("post Plan 11-04, 34 entries"), but if a future editor inserts or reorders entries in `faq.json` before one of these indices (e.g., to add a higher-priority question), all subsequent index mappings silently shift and the wrong questions would be shown on the page and in the FAQPage schema — with no build-time error. The `reviews.json` file is auto-updated by GitHub Actions; `faq.json` is not, which mitigates but does not eliminate the risk.

**Fix:** Consider using question text as a stable selector key (e.g., match by `q.question.includes("operating hours")`) or add a `slug` field to `faq.json` entries. If keeping index references, add a CI assertion that validates each index still maps to its expected question text.

---

_Reviewed: 2026-05-14T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
