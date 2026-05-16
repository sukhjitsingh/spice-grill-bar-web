---
phase: 15-voice-directions-content-polish
reviewed: 2026-05-15T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - scripts/aeo-audit.mjs
  - src/pages/directions.astro
  - src/pages/faq.astro
findings:
  critical: 1
  warning: 4
  info: 2
  total: 7
status: issues_found
---

# Phase 15: Code Review Report

**Reviewed:** 2026-05-15
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Three files were reviewed: the AEO audit script, the directions page, and the FAQ page. The core AEO infrastructure (speakable schema, HowTo schema, FAQPage inline schema, robots.txt gating, llms.txt section gating) is structurally sound and the gates would pass a clean build.

Two content bugs stand out: a navigational contradiction in the Kingman directions that could mislead a driver, and a grammatical error in the FAQ JSON that surfaces verbatim to users and to AI crawlers reading structured data. The remaining findings cover inconsistent speakable class coverage on directions paragraphs, a hardcoded FAQ count in meta content, and a fragile hard-equality guard in the AEO audit.

---

## Critical Issues

### CR-01: Contradictory final-turn direction in Kingman section

**File:** `src/pages/directions.astro:188-191`
**Issue:** The Kingman paragraph instructs the driver to "Turn left onto Lewis Ave" but then says "Spice Grill & Bar is at 33 Lewis Ave on your right." Seligman (also an eastbound approach on I-40) uses "Turn left … on your left," which is internally consistent. The Kingman section copies the left-turn approach but retains "on your right" from a westbound template, producing a contradictory instruction that will confuse a driver at the exit.

```html
<!-- Current (contradictory) -->
From Kingman, take I-40 East toward Flagstaff. Drive 97 miles (about 1 hour 30 minutes)
and take <strong>I-40 Exit 146</strong>. Turn left onto Lewis Ave — Spice Grill &amp;
Bar is at 33 Lewis Ave on your right.

<!-- Fix: make side consistent with the exit direction, matching the Seligman pattern -->
From Kingman, take I-40 East toward Flagstaff. Drive 97 miles (about 1 hour 30 minutes)
and take <strong>I-40 Exit 146</strong>. Turn left onto Lewis Ave — Spice Grill &amp;
Bar is at 33 Lewis Ave on your left.
```

---

## Warnings

### WR-01: Grammar error in FAQ answer (index 19) — served verbatim in structured data

**File:** `src/data/faq.json:80`
**Issue:** The answer for "Does Spice Grill & Bar serve alcohol?" reads "includes a full bar service and with wide variety of beers…". The phrase "and with" is a grammatical error (an extra conjunction). This string is used directly in `FAQSchema.astro` as `acceptedAnswer.text` and rendered verbatim in the FAQ page DOM, so AI crawlers and voice assistants receive the malformed sentence exactly as written.

```json
// Current (broken grammar)
"answer": "Spice Grill & Bar includes a full bar service and with wide variety of beers, cocktails, wines, and other alcoholic beverages to complement your meal."

// Fix
"answer": "Spice Grill & Bar includes a full bar service with a wide variety of beers, cocktails, wines, and other alcoholic beverages to complement your meal."
```

### WR-02: Four city directions paragraphs missing `speakable-city-directions` class

**File:** `src/pages/directions.astro:131, 169, 188, 207`
**Issue:** The `SpeakableSpecification` schema lists `.speakable-city-directions` as a CSS selector for voice extraction, but only three of the seven city direction paragraphs carry that class (Flagstaff at line 93, Williams at line 112, Las Vegas at line 150). The paragraphs for Seligman (line 131), Los Angeles (line 169), Kingman (line 188), and Phoenix (line 207) use only `text-body-lg text-on-surface-variant mb-4`. Voice assistants querying for directions from those four cities will find no speakable content, defeating the AEO goal for the majority of the city sections.

```html
<!-- Fix all four: add speakable-city-directions to the class list -->
<!-- Seligman (line 131) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">

<!-- Los Angeles (line 169) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">

<!-- Kingman (line 188) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">

<!-- Phoenix (line 207) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">
```

### WR-03: AEO audit FAQPage gate uses hard equality — breaks if home FAQ ever changes

**File:** `scripts/aeo-audit.mjs:120-124`
**Issue:** The gate asserts `questionMatches.length !== 8` (exactly 8). The value 8 matches the current length of `homeFaqIndices` in `index.astro`. If a future phase adds or removes a Question from the home FAQ, the gate immediately fails CI without any indication of why, making the error message misleading. A `>= 8` lower-bound guard (matching the pattern used for FAQ count elsewhere in this same script) would be resilient to growth while still catching regressions.

```js
// Current (brittle equality)
if (questionMatches.length !== 8) {
  console.error(`✗ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, expected exactly 8`);
  errors++;
}

// Fix: use a lower-bound consistent with the rest of the audit's gating strategy
const MIN_HOME_FAQ_QUESTIONS = 8;
if (questionMatches.length < MIN_HOME_FAQ_QUESTIONS) {
  console.error(`✗ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, expected ≥${MIN_HOME_FAQ_QUESTIONS}`);
  errors++;
}
```

### WR-04: `homeFaqIndices` out-of-bounds access is silently swallowed

**File:** `src/pages/index.astro:22` (cross-file impact via `scripts/aeo-audit.mjs:120`)
**Issue:** `index.astro` builds the home FAQ as `homeFaqIndices.map((i) => faqData[i]).filter((entry) => entry)`. If any index in `homeFaqIndices` exceeds `faqData.length - 1`, `faqData[i]` returns `undefined`, which the `filter` drops silently. The rendered page then shows fewer FAQ cards than intended and `faqPageSchema.mainEntity` has fewer than 8 entries, causing the FAQPage gate to fail with a cryptic count mismatch rather than a clear "index out of bounds" message. Currently all indices are safe (max is 21, length is 34), but there is no runtime guard or assertion. The `.filter(Boolean)` pattern makes the failure invisible during development.

```js
// Fix: add an assertion that every index is in range, executed at build time
const homeFaqIndices = [14, 2, 3, 13, 10, 1, 15, 21];
const homeFaq = homeFaqIndices.map((i) => {
  const entry = faqData[i];
  if (!entry) throw new Error(`homeFaqIndices: index ${i} is out of range (faqData has ${faqData.length} entries)`);
  return entry;
});
```

---

## Info

### IN-01: Hardcoded FAQ count "34 FAQs" in `faq.astro` meta description

**File:** `src/pages/faq.astro:8`
**Issue:** The `description` prop hard-codes "34 FAQs". If entries are added to or removed from `faq.json`, the meta description becomes stale without any build-time error. The FAQ count is already available via the imported `faqData` array.

```astro
---
// Fix: derive the count from the data
import faqData from '../data/faq.json';
const faqCount = faqData.length;
---
<Layout
  description={`${faqCount} FAQs covering hours, menu, vegetarian and vegan options, takeout, payment, parking, and prices at Spice Grill & Bar — I-40 Exit 146, Ash Fork, AZ. Biker-friendly Indian restaurant on Route 66, 78 miles from the Grand Canyon.`}
```

### IN-02: HowTo schema covers only 3 of 7 cities without explanatory comment on the others

**File:** `src/pages/directions.astro:306-346`
**Issue:** The HowTo `@graph` includes Flagstaff, Williams, and Las Vegas only. The other four city sections (Seligman, Los Angeles, Kingman, Phoenix) have no HowTo entries. The comment at line 306 says "AEO-14" but does not document why coverage is limited to three cities. Combined with WR-02, this means four cities also lack speakable markup, giving them zero AEO voice coverage. This is a design gap that should be documented or resolved.

If the omission is intentional (e.g., traffic priority), add a comment. If it is an oversight, extend the `@graph` array with entries for the remaining four cities following the same pattern as the existing three.

---

_Reviewed: 2026-05-15_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
