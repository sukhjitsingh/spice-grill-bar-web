---
phase: 14-speakable-coverage
reviewed: 2026-05-14T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - scripts/aeo-audit.mjs
  - src/pages/directions.astro
  - src/pages/faq.astro
findings:
  critical: 2
  warning: 4
  info: 2
  total: 8
status: issues_found
---

# Phase 14: Code Review Report

**Reviewed:** 2026-05-14
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Three files were reviewed: the AEO audit script (`scripts/aeo-audit.mjs`), the directions page (`src/pages/directions.astro`), and the FAQ page (`src/pages/faq.astro`). The speakable schema markup is structurally present on both pages and the audit gate will pass. However, two critical defects were found — a factually incorrect driving instruction in the Kingman section that will misdirect users, and a fragile word-count check in the audit script that can produce false positives. Four warnings cover incomplete speakable coverage, a hardcoded gate value, a grammar error surfaced to voice assistants, and an audit gate that passes while the actual AEO coverage goal is only partially met.

## Critical Issues

### CR-01: Kingman Directions — Contradictory Turn + Side-of-Road Instructions

**File:** `src/pages/directions.astro:190-191`
**Issue:** The Kingman section instructs the driver to "Turn left onto Lewis Ave" and immediately states the restaurant is "at 33 Lewis Ave on your right." After turning left, the destination cannot be on the right. Every other eastbound city (Seligman, Las Vegas, Los Angeles) that says "Turn left" correctly ends with "on your left" or omits the side qualifier. The Kingman copy mixes the turn direction from an eastbound route with the side-qualifier from a westbound route. A traveler following these instructions will either turn in the wrong direction or look for the building on the wrong side of Lewis Ave.

**Fix:** Remove the contradictory qualifier. Since Kingman drivers approach from the west on I-40 East, they exit and turn left; the restaurant is on their left (same side as the turn):
```html
<p class="text-body-lg text-on-surface-variant mb-4">
  From Kingman, take I-40 East toward Flagstaff. Drive 97 miles (about 1 hour 30 minutes)
  and take <strong>Exit 146</strong>. Turn left onto Lewis Ave — Spice Grill &amp; Bar is
  at 33 Lewis Ave on your left.
</p>
```

---

### CR-02: aeo-audit.mjs Word Count Check Inflates Count for Answers With Leading/Trailing Whitespace

**File:** `scripts/aeo-audit.mjs:21`
**Issue:** The word count is computed as `item.answer.split(/\s+/).length`. In JavaScript, `String.prototype.split(/\s+/)` on a string with leading or trailing whitespace produces empty-string tokens at the boundaries. For example, `"  hello world  ".split(/\s+/)` returns `['', 'hello', 'world', '']` — a length of 4, not 2. Any FAQ answer that inadvertently carries leading or trailing whitespace (e.g., from an editor or JSON diffing tool) will have its word count inflated, potentially triggering a false failure that blocks the CI pipeline. The fix is to trim before splitting.

**Fix:**
```js
const wordCount = item.answer.trim().split(/\s+/).length;
```

---

## Warnings

### WR-01: Four of Seven City Sections Missing `speakable-city-directions` Class

**File:** `src/pages/directions.astro:131, 169, 188, 207`
**Issue:** The speakable schema on this page (lines 296–302) declares `.speakable-city-directions` as one of four targeted CSS selectors. Only three city sections actually carry that class — Flagstaff (line 93), Williams (line 112), and Las Vegas (line 150). The Seligman, Los Angeles, Kingman, and Phoenix sections use a bare `text-body-lg text-on-surface-variant` class with no speakable marker. Voice assistants and AI scrapers using the `SpeakableSpecification` to identify extractable content will silently skip four of the seven city direction paragraphs. The audit gate only checks for the string `SpeakableSpecification` in the HTML and will pass regardless of how many selectors actually match DOM nodes.

**Fix:** Add `speakable-city-directions` to the four missing sections:
```html
<!-- Seligman (line 131) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">

<!-- Los Angeles (line 169) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">

<!-- Kingman (line 188) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">

<!-- Phoenix (line 207) -->
<p class="speakable-city-directions text-body-lg text-on-surface-variant mb-4">
```

---

### WR-02: aeo-audit.mjs FAQPage Gate Hardcodes `8` With No Linkage to Source of Truth

**File:** `scripts/aeo-audit.mjs:120-125`
**Issue:** The audit gate checks that `dist/index.html` contains exactly 8 `"@type":"Question"` entries — a number that mirrors the `homeFaqIndices` array in `src/pages/index.astro`. These two values are maintained independently with no shared constant or comment explaining the coupling. If a developer adds a ninth FAQ to the home page (a reasonable future change), the audit will fail with the opaque message "expected exactly 8" — giving no indication of where 8 comes from or how to update the gate. Conversely, a developer updating the gate number without updating `index.astro` will cause a silent mismatch where the gate passes with stale expectations.

**Fix:** Add a comment that makes the coupling explicit, and consider surfacing the count dynamically:
```js
// FAQPage Question count gate — must match homeFaqIndices.length in src/pages/index.astro (currently 8).
// Update this constant whenever homeFaqIndices changes.
const EXPECTED_HOME_FAQ_COUNT = 8;
const questionMatches = distHtml.match(/"@type":"Question"/g) || [];
if (questionMatches.length !== EXPECTED_HOME_FAQ_COUNT) {
  console.error(
    `✗ FAQPage gate: dist/index.html has ${questionMatches.length} Question entries, ` +
    `expected exactly ${EXPECTED_HOME_FAQ_COUNT} (matches homeFaqIndices in src/pages/index.astro)`
  );
  errors++;
}
```

---

### WR-03: faq.astro Speakable Targets Only Intro Paragraph — Q&A Answers Not Extractable by Voice

**File:** `src/pages/faq.astro:43-46`
**Issue:** The `SpeakableSpecification` on the FAQ page declares a single CSS selector: `".speakable-faq-intro"`. This targets only the introductory paragraph. The 34 FAQ question/answer pairs rendered by `faqData.map()` (lines 26–33) have no speakable class and are therefore excluded from voice extraction. The audit gate at `aeo-audit.mjs:136` only checks that the string `SpeakableSpecification` appears in the built HTML — it will pass even though none of the actual FAQ answers are speakable-tagged. Voice assistants using the SpeakableSpecification to select content for reading aloud will read the generic intro paragraph rather than the specific answers a user asked about.

**Fix:** Add a speakable class to each FAQ answer paragraph in the map:
```astro
{
  faqData.map((item) => (
    <div class="bg-surface-container p-8 rounded-2xl">
      <h2 class="text-heading-md text-on-surface mb-3">{item.question}</h2>
      <p class="speakable-faq-answer text-body-md text-on-surface-variant">{item.answer}</p>
    </div>
  ))
}
```

And extend the speakable schema selector:
```json
"cssSelector": [".speakable-faq-intro", ".speakable-faq-answer"]
```

Note: adding 34 speakable items may produce large `SpeakableSpecification` content. Consider limiting to the subset of answers most likely to be voice-queried (e.g., hours, location, menu highlights).

---

### WR-04: faq.json FAQ #20 Has a Grammar Error That Voice Assistants Will Read Aloud

**File:** `src/data/faq.json` (item index 19, question "Does Spice Grill & Bar serve alcohol?")
**Issue:** The answer reads: "Spice Grill & Bar includes a full bar service **and with** wide variety of beers…". The phrase "and with" is a grammatical error — two conjunctions stacked incorrectly. This answer is surfaced via FAQSchema structured data on the `/faq` page and also appears in the rendered FAQ list. Voice assistants reading this answer aloud will reproduce the error, which reflects negatively on the restaurant.

**Fix:** Remove the duplicate conjunction:
```json
"answer": "Spice Grill & Bar has a full bar with a wide variety of beers, cocktails, wines, and other alcoholic beverages to complement your meal."
```

---

## Info

### IN-01: directions.astro Navigation Chip Links Use Same Surface Token as Nav Wrapper

**File:** `src/pages/directions.astro:38-84`
**Issue:** The jump-navigation wrapper uses `bg-surface-container` (line 38) and each individual chip link also uses `bg-surface-container` (line 43 and repeated for all 7 links). Per the design system in CLAUDE.md: "All visual separation comes from background tonal shifts." When a parent and its child chips share the same token, they are visually indistinguishable in both light and dark mode — the chips have no tonal lift above the wrapper background.

**Fix:** Use a higher surface level for the nav wrapper so the chips sit visually within it, or use a lower level for the chips so they recede:
```html
<!-- Option A: lift wrapper one level above chips -->
<nav aria-label="Jump to city directions" class="mb-12 p-5 bg-surface-container-low rounded-2xl">
  <!-- chips remain bg-surface-container -->

<!-- Option B: chips use a higher token than the wrapper -->
<nav aria-label="Jump to city directions" class="mb-12 p-5 bg-surface-container rounded-2xl">
  <a class="... bg-surface-container-high ...">Flagstaff</a>
```

---

### IN-02: faq.astro Meta Description Undersells Page Content for AEO

**File:** `src/pages/faq.astro:8`
**Issue:** The meta description reads: "Frequently asked questions about Spice Grill & Bar. Information on hours, location, and vegetarian options." The page contains 34 Q&A pairs covering directions, menu, takeout, alcohol, parking, pricing, group dining, and Route 66 context — but the description mentions only three topics. Search engines and AI answer engines use the meta description as a secondary signal for page relevance. Richer descriptions increase the chance of this page being selected for voice or AI-generated answers.

**Fix:** Expand the description to reflect the breadth of coverage:
```astro
description="Frequently asked questions about Spice Grill & Bar in Ash Fork, AZ. Hours, location, menu, vegetarian options, takeout, parking, pricing, and directions from I-40 Exit 146 on Route 66."
```

---

_Reviewed: 2026-05-14_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
