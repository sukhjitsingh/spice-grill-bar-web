---
plan: 15-03
phase: 15-voice-directions-content-polish
status: complete
wave: 2
started: 2026-05-15
completed: 2026-05-15
commits:
  - f44bed1
requirements_closed:
  - AEO-14
  - AEO-15
---

## Summary

Added Section 6 HowTo schema gate to `scripts/aeo-audit.mjs` and ran full QA suite confirming all Phase 15 changes pass CI end-to-end.

## What Was Built

**Task 1 — Section 6 HowTo gate (scripts/aeo-audit.mjs):**

Inserted a new gate block between Section 5 (FAQ Speakable) and the final summary block. The gate follows the identical `fs.existsSync` guard pattern used in Sections 4 and 5:

- Skips gracefully with `console.warn` when `dist/directions/index.html` is absent
- Reads `distDirectionsHtml` and checks `.includes('"@type": "HowTo"')` — spaced form matches Astro's raw inline JSON-LD output (directions.astro uses a raw `<script>` block, not a minified schema component)
- Increments `errors` counter and logs failure on miss
- Logs `✓ HowTo gate: HowTo schema found in dist/directions/index.html` on success

**Task 2 — Full QA suite:**

All CI gates passed:
- `npm run build` — Astro build clean, 5 pages built
- `npm run test:aeo` — All 6 AEO gates pass:
  - Section 1: 34 FAQ entries ≤50 words
  - Section 2: llms.txt with all required sections
  - Section 3: 5 AI bots allowed in robots.txt
  - Section 4: #restaurant + #organization @id, 8 Question entries
  - Section 5: SpeakableSpecification in dist/faq/index.html
  - Section 6 (NEW): HowTo schema found in dist/directions/index.html
- `npm run lint` — 0 errors, 0 warnings
- `npm run typecheck` — 0 errors, 0 warnings
- `npm run test:lhci` — all Lighthouse thresholds met across 5 audited pages

## Key Decisions

- **Search string uses spaced form** (`"@type": "HowTo"` not `"@type":"HowTo"`): The HowTo block in directions.astro is a raw inline `<script type="application/ld+json">` block, which Astro does not minify. Schema components (RestaurantSchema.astro, etc.) produce minified JSON-LD; raw inline blocks preserve formatting. The gate uses the spaced form to match actual built output.

## Artifacts

- `scripts/aeo-audit.mjs` — 6 CI gates (was 5), Section 6 lines 144–158

## Self-Check: PASSED

- `grep -c 'distDirectionsPath' scripts/aeo-audit.mjs` → 3 ✓
- `grep -c '"@type": "HowTo"' scripts/aeo-audit.mjs` → 1 ✓
- `grep -c 'HowTo gate' scripts/aeo-audit.mjs` → 3 ✓
- `npm run test:aeo` exits 0 with all 6 gates ✓
- `npm run lint` exits 0 ✓
- `npm run typecheck` exits 0 ✓
