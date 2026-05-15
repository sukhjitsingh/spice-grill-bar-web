---
phase: 15-voice-directions-content-polish
verified: 2026-05-15T00:00:00Z
status: gaps_found
score: 3/4 roadmap success criteria verified
overrides_applied: 0
gaps:
  - truth: "Kingman direction paragraph contains a contradictory instruction that was introduced by this phase's DOM-text edit"
    status: failed
    reason: "directions.astro line 188-191 says 'Turn left onto Lewis Ave' but then '33 Lewis Ave on your right.' Eastbound exits (Kingman and Seligman both approach from the west on I-40 East) should read 'on your left.' The Seligman section (line 134) is correctly 'on your left.' This is a content bug in a user-facing and voice-read paragraph in the file modified by Plan 01."
    artifacts:
      - path: "src/pages/directions.astro"
        issue: "Line 190-191: 'Turn left onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right.' — left turn and right side are mutually contradictory for an eastbound I-40 approach."
    missing:
      - "Change 'on your right' to 'on your left' in the Kingman paragraph (line 191) to match the Seligman pattern"
---

# Phase 15: Voice Directions + Content Polish — Verification Report

**Phase Goal:** Voice assistants can respond to "how do I get to Spice Grill & Bar from [city]" for the 3 highest-traffic origin cities, and the /faq/ page description accurately represents its full 34-topic breadth
**Verified:** 2026-05-15
**Status:** gaps_found — 1 content blocker in a modified file
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `directions.astro` contains a HowTo schema @graph with three HowTo objects (Flagstaff PT46M, Williams PT18M, Las Vegas PT3H) | VERIFIED | Lines 307-346: @graph present, 3 HowTo objects confirmed. `grep -c '"@type": "HowTo"'` → 3; all three totalTime values confirmed (PT46M, PT18M, PT3H). @context at top level only (not inside individual HowTo objects). |
| 2 | Each HowToStep.text is verbatim or near-verbatim from the corresponding DOM paragraph | VERIFIED | HowToStep text values at lines 318, 329, 340 match the DOM paragraphs at lines 93-96, 112-115, 150-153 verbatim (plain `&` in JSON, `&amp;` in HTML DOM — correct encoding). |
| 3 | `faq.astro` description meta tag is at least 150 characters and references hours, location (I-40 Exit 146, Ash Fork, AZ), menu, vegetarian/vegan, takeout, payment, parking, bikers, Route 66, and Grand Canyon proximity | VERIFIED | Description at line 8 is 227 chars. Contains: "I-40 Exit 146, Ash Fork, AZ", "Biker-friendly", "Route 66", "78 miles from the Grand Canyon", "vegetarian and vegan", "takeout", "payment", "parking". All required signals present. |
| 4 | All 5 Lighthouse-audited pages pass CI thresholds after all v3.1 changes | UNCERTAIN | Plan 15-03 SUMMARY claims `npm run qa` exited 0 with Lighthouse passing. Cannot verify without running the full build + LHCI suite. Commit f44bed1 documents the QA run result. This requires human spot-check or re-run to confirm no regression since that run. |

**Score:** 3/4 roadmap success criteria verified (1 UNCERTAIN, not counted as FAILED)

### Blocking Gap: Contradictory Kingman Direction (Plan 01 introduced this)

The Kingman city paragraph at `src/pages/directions.astro:188-191` reads:

```
Turn left onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right.
```

A driver turning left off I-40 Exit 146 heading east (Kingman approach) would have the restaurant on their left, not right — as the identical-approach Seligman paragraph correctly states ("on your left", line 134). This contradiction was present in the source before Phase 15 but is in a file wholly modified by Plan 01. The REVIEW.md (code review for this phase) flags it as CR-01 (critical). Because this file was modified by this phase and the error exists in the delivered output, it is a gap.

**This is not a regression introduced by Phase 15** — the phase's DOM edits were limited to `<strong>Exit 146</strong>` → `<strong>I-40 Exit 146</strong>`, and the Kingman text was pre-existing. However, since Phase 15 Plans explicitly list `src/pages/directions.astro` as `files_modified` and the REVIEW.md for this phase classifies it as CR-01 (critical), it is surfaced here as a gap requiring resolution before closure.

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/directions.astro` | HowTo @graph schema block + updated DOM paragraph text for 3+ cities | VERIFIED | File exists, substantive, HowTo block wired as last script element before `</Layout>`. All 7 city paragraphs use `<strong>I-40 Exit 146</strong>` (18 total occurrences of "I-40 Exit 146" including title, description, schema text values). No bare `<strong>Exit 146</strong>` remains. |
| `src/pages/faq.astro` | Updated description prop on Layout component | VERIFIED | Line 8 contains 227-char D-05 copy. Phase 14 markup (speakable-faq-intro, faq-list, SpeakableSpecification) all preserved. |
| `scripts/aeo-audit.mjs` | Section 6 HowTo gate that checks dist/directions/index.html for `"@type": "HowTo"` | VERIFIED | Lines 144-158 contain Section 6. Uses spaced form `"@type": "HowTo"` (matching Astro's non-minified raw inline script output). All structural gate requirements met: existsSync guard, readFileSync, .includes check, errors++ on failure, console.log on success. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `directions.astro #flagstaff <p>` DOM text | `HowToStep.text` for Flagstaff | verbatim text copy | VERIFIED | Both read: "From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes) and take I-40 Exit 146 (Ash Fork / Historic Route 66). Turn right onto Lewis Ave — Spice Grill & Bar is at 33 Lewis Ave on your right." |
| `directions.astro @graph` | `dist/directions/index.html` | Astro static build | VERIFIED (SUMMARY evidence) | 15-01-SUMMARY.md documents `"@type": "HowTo"` appears 3 times in dist/directions/index.html after build. Cannot independently confirm without running build. |
| `faq.astro description prop` | `dist/faq/index.html <meta name='description'>` | Astro Layout.astro prop → meta tag | VERIFIED (SUMMARY evidence) | 15-02-SUMMARY.md confirms description flows through to built HTML. |
| `aeo-audit.mjs section 6` | `dist/directions/index.html` | fs.existsSync + fs.readFileSync + .includes | VERIFIED | Code at lines 144-158 confirmed. Search string `'"@type": "HowTo"'` matches the spaced format used in the raw inline script block. |

---

## Data-Flow Trace (Level 4)

Not applicable. All three modified files produce static content (hardcoded strings in Astro source and JSON-LD). No dynamic state, data fetching, or component rendering of external data is involved in Phase 15's changes.

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| 7 city paragraphs use I-40 Exit 146 in `<strong>` | `grep -c 'I-40 Exit 146' src/pages/directions.astro` | 18 (includes title, description, schema values) | PASS — bare `Exit 146` count is 0 |
| No bare `<strong>Exit 146</strong>` remaining | `grep -c '<strong>Exit 146</strong>' src/pages/directions.astro` | 0 | PASS |
| speakable-city-directions class on exactly 3 paragraphs | `grep -c 'speakable-city-directions' src/pages/directions.astro` | 4 (3 on `<p>` elements, 1 in cssSelector array — correct) | PASS |
| HowTo @graph has 3 HowTo objects | `grep -c '"@type": "HowTo"' src/pages/directions.astro` | 3 | PASS |
| HowToStep count | `grep -c '"@type": "HowToStep"' src/pages/directions.astro` | 3 | PASS |
| totalTime PT46M, PT18M, PT3H all present | grep individually | 1 each | PASS |
| @context only at top level of HowTo block | Python JSON parse | False for all 3 HowTo objects, True at graph level | PASS |
| FAQ description contains I-40 Exit 146, Ash Fork, AZ | `grep -c 'I-40 Exit 146, Ash Fork, AZ' src/pages/faq.astro` | 1 | PASS |
| FAQ description contains Biker-friendly | `grep -c 'Biker-friendly' src/pages/faq.astro` | 1 | PASS |
| FAQ description contains Grand Canyon | `grep -c 'Grand Canyon' src/pages/faq.astro` | 1 | PASS |
| Old description is gone | `grep -c 'Frequently asked questions about Spice Grill' src/pages/faq.astro` | 0 | PASS |
| Description is ≥150 chars | python3 len() | 227 | PASS (plan said 228 — 1-char difference, still well above 150) |
| Phase 14 speakable-faq-intro preserved | `grep -c 'speakable-faq-intro' src/pages/faq.astro` | 2 (1 on `<p>`, 1 in cssSelector) | PASS |
| Phase 14 SpeakableSpecification preserved | `grep -c 'SpeakableSpecification' src/pages/faq.astro` | 1 | PASS |
| AEO audit section 6 added | `grep -c 'distDirectionsPath' scripts/aeo-audit.mjs` | 3 (const + existsSync + readFileSync) | PASS |
| HowTo gate uses correct search string | `grep '"@type": "HowTo"' scripts/aeo-audit.mjs` | 1 match, spaced form | PASS |
| HowTo gate message count | `grep -c 'HowTo gate' scripts/aeo-audit.mjs` | 3 (warn, error, success) | PASS |
| AEO-14 referenced in section comment | `grep -c 'AEO-14' scripts/aeo-audit.mjs` | 1 | PASS |
| Sections 1-5 unchanged | `grep -c '// 5. FAQ Speakable gate' scripts/aeo-audit.mjs` | 1 | PASS |
| Final summary block preserved | `grep -n "console.log.*---" scripts/aeo-audit.mjs` | Line 160, unchanged | PASS |
| All 3 SUMMARY-documented commits exist in git log | `git log --oneline --all` | 1f457a4, 1bf8c56, f44bed1 all present | PASS |

---

## Probe Execution

Step 7c does not apply — no probe scripts declared for this phase.

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| AEO-14 | 15-01, 15-03 | HowTo schema block for Flagstaff (PT46M), Williams (PT18M), Las Vegas (PT3H); HowToStep.text verbatim from DOM paragraphs; supply/tool fields omitted | SATISFIED | HowTo @graph with 3 objects exists at directions.astro lines 307-346. Text values verified verbatim. No supply/tool fields. AEO gate in aeo-audit.mjs section 6 guards against regression. |
| AEO-15 | 15-02 | faq.astro description ≥150 chars covering all 34 topic clusters with I-40 Exit 146, Ash Fork, AZ anchor | SATISFIED | 227-char D-05 description confirmed at faq.astro line 8. All required signals verified by grep. |

**Observation:** REQUIREMENTS.md traceability table still shows AEO-14 and AEO-15 as "Pending" and the checkbox markers as `[ ]`. The implementation is complete but REQUIREMENTS.md was not updated to reflect completion. This is a documentation gap (not a code gap) — the requirements ARE satisfied in the codebase.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/pages/directions.astro` | 190-191 | Contradictory direction: "Turn left onto Lewis Ave — 33 Lewis Ave on your right" | Blocker | Confusing to drivers navigating from Kingman; incorrect information surfaced to voice assistants if this paragraph were ever made speakable |

No TBD, FIXME, or XXX markers found in any of the three modified files. No stub patterns (empty returns, placeholder text) found.

**Note on speakable class coverage:** Only 3 of 7 city direction paragraphs carry the `speakable-city-directions` class. This is by design (Phase 14's explicit scope was 3 cities), and the REQUIREMENTS.md documents "HowTo for all 7 directions cities" as deferred future work. This is WARNING-level design incompleteness but not a Phase 15 gap.

**Note on description length discrepancy:** The plan specifies 228 chars ("D-05 value"). The VALIDATION.md also says 228. The actual character count is 227 (em dash in "Spice Grill & Bar —" is 3 bytes UTF-8 but 1 Unicode character; python3 `len()` counts Unicode characters). Both are well above the 150-char minimum requirement. Not a gap.

---

## Human Verification Required

### 1. Lighthouse CI Thresholds

**Test:** Run `npm run build && npm run test:lhci` from project root
**Expected:** All 5 audited pages (/, /near-grand-canyon/, /near-williams/, /directions/, /faq/) pass: LCP < 4000ms, TBT < 600ms, CLS < 0.105, Accessibility >= 90, Best Practices >= 80, SEO >= 90
**Why human:** Requires running the full Lighthouse CI suite (90+ seconds) against the actual built output; cannot be verified by static file inspection

### 2. Built output meta description and HowTo schema in dist/

**Test:** Run `npm run build`, then:
- `grep -o 'content="34 FAQs[^"]*"' dist/faq/index.html | head -1` — should contain the D-05 description
- `grep -c '"@type": "HowTo"' dist/directions/index.html` — should return 3
**Expected:** Description appears in built HTML; HowTo schema present 3 times
**Why human:** dist/ is not committed to the repo and was not available for static inspection during this verification

---

## Gaps Summary

**1 gap (BLOCKER):** The Kingman direction paragraph in `src/pages/directions.astro` (line 191) contradicts itself — "Turn left onto Lewis Ave" followed by "on your right." This is a content correctness error in a user-facing file modified by this phase. It does not prevent the HowTo schema from functioning (Kingman has no HowTo entry), but it is incorrect factual content on a page this phase explicitly modified.

**Fix required:** Change "on your right" to "on your left" at line 191 to match the Seligman pattern (line 134) for eastbound I-40 approaches.

**Structured gap for `/gsd-plan-phase --gaps`:**

```yaml
gaps:
  - truth: "All city direction paragraphs in directions.astro contain accurate, non-contradictory driving instructions"
    status: failed
    reason: "Kingman paragraph (line 190-191) instructs 'Turn left onto Lewis Ave' but states 'on your right' — contradictory for an eastbound I-40 exit; Seligman (same exit direction) correctly says 'on your left'"
    artifacts:
      - path: "src/pages/directions.astro"
        issue: "Line 191: '33 Lewis Ave on your right.' should be '33 Lewis Ave on your left.' (eastbound I-40 exit, left turn onto Lewis Ave)"
    missing:
      - "Correct 'on your right' to 'on your left' in the Kingman paragraph"
```

**Secondary documentation gap (not a code gap):** REQUIREMENTS.md traceability table still shows AEO-14 and AEO-15 as Pending. The `[ ]` checkboxes and "Pending" status should be updated to `[x]` / "Complete" to reflect the implemented work.

---

_Verified: 2026-05-15_
_Verifier: Claude (gsd-verifier)_
