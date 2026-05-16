---
phase: 14-speakable-coverage
verified: 2026-05-14T00:00:00Z
status: passed
score: 10/10 must-haves verified
overrides_applied: 0
re_verification: false
---

# Phase 14: Speakable Coverage Verification Report

**Phase Goal:** Voice assistants can extract a concise, authoritative spoken snippet from both the /faq/ page and the per-city direction sections on /directions/
**Verified:** 2026-05-14
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | speakable-faq-intro appears exactly 2 times in dist/faq/index.html (once on `<p>` class, once in cssSelector JSON) | VERIFIED | `grep -c "speakable-faq-intro" dist/faq/index.html` returns 2 |
| 2  | SpeakableSpecification appears exactly 1 time in dist/faq/index.html | VERIFIED | `grep -c "SpeakableSpecification" dist/faq/index.html` returns 1 |
| 3  | id="faq-list" appears exactly 1 time in dist/faq/index.html | VERIFIED | `grep -c 'id="faq-list"' dist/faq/index.html` returns 1 |
| 4  | Intro paragraph contains "I-40 Exit 146 in Ash Fork, Arizona on historic Route 66" | VERIFIED | Text present in built HTML — split across a line by Prettier formatting (multiline grep confirms the phrase); content is semantically intact |
| 5  | npm run test:aeo exits 0 with "FAQ Speakable gate" passing | VERIFIED | `npm run test:aeo` output: "✓ FAQ Speakable gate: SpeakableSpecification found in dist/faq/index.html"; all 9 other gates pass; exit code 0 |
| 6  | speakable-city-directions appears exactly 4 times in dist/directions/index.html | VERIFIED | `grep -c "speakable-city-directions" dist/directions/index.html` returns 4 |
| 7  | Flagstaff, Williams, Las Vegas sections each have speakable-city-directions on their primary `<p>` | VERIFIED | Source lines 93, 112, 150 in directions.astro carry the class; confirmed by section-id grep showing all 3 correct sections |
| 8  | Seligman, Kingman, Los Angeles, Phoenix sections do NOT have speakable-city-directions | VERIFIED | `grep -A5 'id="seligman|los-angeles|kingman|phoenix"'` finds no occurrences in any excluded section |
| 9  | Speakable cssSelector has 4 entries with .speakable-city-directions as the 4th | VERIFIED | Built HTML shows `[".speakable-heading", ".speakable-lead", ".speakable-exit", ".speakable-city-directions"]` in multi-line format |
| 10 | `grep -c '"cssSelector"' dist/directions/index.html` returns 1 (not duplicated) | VERIFIED | Returns 1 — single Speakable schema block on /directions/ |

**Score:** 10/10 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/faq.astro` | Intro paragraph with speakable-faq-intro class + id="faq-list" on container + WebPage SpeakableSpecification schema block after `</main>` | VERIFIED | All three changes present; schema block placed between `</main>` and `</Layout>` per plan spec; raw JSON pattern (not set:html) |
| `scripts/aeo-audit.mjs` | Gate 5 reading dist/faq/index.html and verifying SpeakableSpecification | VERIFIED | Gate 5 exists at lines 128-142; uses distFaqPath (declared 1x, used in existsSync + readFileSync = 3 total occurrences — correct per plan note); graceful skip on missing file; no directions gate added |
| `src/pages/directions.astro` | speakable-city-directions on 3 city paragraphs + extended cssSelector with 4th entry | VERIFIED | 4 source occurrences confirmed (lines 93, 112, 150, 300); cssSelector extended from 3 to 4 entries via Prettier multi-line format |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| faq.astro SpeakableSpecification cssSelector | `<p class="speakable-faq-intro">` | `"cssSelector": [".speakable-faq-intro"]` | WIRED | cssSelector in JSON-LD points to class that exists on the intro paragraph in same file |
| aeo-audit.mjs gate 5 | dist/faq/index.html | `fs.existsSync(distFaqPath)` + `fs.readFileSync(distFaqPath)` + `.includes('SpeakableSpecification')` | WIRED | Gate reads built file; SpeakableSpecification present in dist; gate outputs "✓ FAQ Speakable gate" |
| directions.astro SpeakableSpecification cssSelector | 3x `<p class="speakable-city-directions ...">` | `"cssSelector": [... ".speakable-city-directions"]` | WIRED | 4th cssSelector entry points to class on Flagstaff, Williams, Las Vegas paragraphs |

### Data-Flow Trace (Level 4)

These artifacts render static schema markup, not dynamic data fetched at runtime. The "data" is literal HTML class attributes and JSON-LD values authored in source files. No data-flow disconnection is possible. Level 4 is not applicable.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| FAQ Speakable gate passes with built dist | `npm run test:aeo` | All 10 gates pass, exit 0 | PASS |
| speakable-faq-intro count in built FAQ HTML | `grep -c "speakable-faq-intro" dist/faq/index.html` | 2 | PASS |
| speakable-city-directions count in built directions HTML | `grep -c "speakable-city-directions" dist/directions/index.html` | 4 | PASS |
| No duplicate cssSelector block on /directions/ | `grep -c '"cssSelector"' dist/directions/index.html` | 1 | PASS |
| No double-encoding in built FAQ HTML | `grep "&amp;amp;" dist/faq/index.html` | No matches | PASS |
| No directions gate in aeo-audit.mjs (D-08 constraint) | `grep "dist/directions" scripts/aeo-audit.mjs` | No matches | PASS |

### Probe Execution

No conventional probe scripts exist for this phase. AEO audit gate (`npm run test:aeo`) serves as the functional probe — passed above.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| AEO-12 | 14-01-PLAN.md | faq.astro adds id="faq-list", intro paragraph as Speakable target, WebPage + SpeakableSpecification schema | SATISFIED | All three changes verified in source and built HTML; CI gate (gate 5) enforces at build time |
| AEO-13 | 14-02-PLAN.md | directions.astro Speakable cssSelector extended with .speakable-city-directions on Flagstaff, Williams, Las Vegas paragraphs | SATISFIED | 3 city paragraphs annotated; cssSelector extended to 4 entries; excluded sections clean |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | No TBD, FIXME, XXX, placeholder, or stub patterns found in modified files | — | — |

Scanned `src/pages/faq.astro`, `scripts/aeo-audit.mjs`, and `src/pages/directions.astro`. No debt markers, empty implementations, or disconnected props found. All modified code is substantive and wired.

### Human Verification Required

None. All phase deliverables are verifiable programmatically via grep against built HTML and AEO audit execution. No visual appearance, real-time behavior, or external service integration is involved — the phase is purely additive static HTML class annotations and JSON-LD schema markup.

### Gaps Summary

No gaps. All 10 must-haves verified against the actual codebase and built dist output.

**Note on distFaqPath occurrence count:** The plan acceptance criteria stated `grep -c "distFaqPath" scripts/aeo-audit.mjs` would return 2. It returns 3 (declaration + `existsSync` check + `readFileSync` call). The plan's D-07 code example shows the identical 3-use pattern — this is a plan spec discrepancy, not an implementation defect. The gate behavior is correct and passes.

**Note on intro paragraph phrase check:** The required phrase "I-40 Exit 146 in Ash Fork, Arizona on historic Route 66" is present in the built FAQ HTML but split across two lines by Prettier's 80-character print width (line break between "Ash Fork," and "Arizona"). A multiline grep confirms the phrase is intact. This is cosmetic formatting with no semantic or functional impact.

---

_Verified: 2026-05-14_
_Verifier: Claude (gsd-verifier)_
