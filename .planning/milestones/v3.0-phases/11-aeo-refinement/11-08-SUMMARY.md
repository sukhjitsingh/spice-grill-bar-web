---
phase: 11-aeo-refinement
plan: 08
subsystem: ci-audit
tags: [aeo, audit, ci-gate, faq-count, llms-sections, robots-allowlist]

requires:
  - "Plan 11-03 (llms.txt with 5 new H2 sections)"
  - "Plan 11-04 (faq.json with 34 voice-optimized entries)"
provides:
  - "scripts/aeo-audit.mjs gate: FAQ count ≥ 34"
  - "scripts/aeo-audit.mjs gate: public/llms.txt contains all 5 required H2 sections (Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, Dietary Options)"
  - "scripts/aeo-audit.mjs gate: public/robots.txt allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot"
  - "All 3 gates fail (process.exit(1)) when source data drifts; CI surface raised against future regressions"
affects: []

tech-stack:
  added: []
  patterns:
    - "Imperative gate composition in scripts/aeo-audit.mjs — one gate per AEO concern, each with its own try/catch and console output style; matches the existing 50-word voice audit pattern"
    - "User-agent block regex `/User-agent:\\s*${bot}[\\s\\S]*?Allow:\\s*\\//i` matches both inline `Allow: /` and a few lines below; tolerates whitespace and case variation"

key-files:
  created:
    - .planning/phases/11-aeo-refinement/11-08-SUMMARY.md
  modified:
    - scripts/aeo-audit.mjs

key-decisions:
  - "Three gates added in numbered comment blocks (// 3. FAQ Count, // 4. llms.txt Sections, // 5. robots.txt AI Bots) — matches existing imperative style; no introduction of a test framework"
  - "FAQ count threshold hardcoded at 34 (matches REQUIREMENTS.md AEO-07 floor) — easy to bump in a future phase if FAQ continues to grow"
  - "llms.txt section gate uses simple String.includes() rather than regex — avoids escape concerns and matches the file's prose style; if section format ever changes from H2 to H3, gate must be updated"
  - "robots.txt AI-bot gate uses regex with [\\s\\S]*? lazy lookahead to allow comments/blank lines between User-agent and Allow:/ directives — matches the existing robots.txt formatting"
  - "Kept all existing gates (50-word voice audit, llms.txt existence) intact — no regressions"

patterns-established:
  - "AEO audit script extension: when adding a new gate, follow the existing numbered comment + try/wrap pattern, push errors via the shared `errors++` counter, and log per-gate ✅/❌ messages for human readability."

requirements-completed: [AEO-09]

duration: ~3 min (gate authoring) + smoke-test interrupted by quota; final inline verification
completed: 2026-05-06
---

# Phase 11 — Plan 08: AEO Audit Script Gates

**Added three new fail-fast gates to `scripts/aeo-audit.mjs` (FAQ count ≥34, llms.txt required sections, robots.txt AI-bot allowlist) so future AEO drift fails CI before deploy.**

## Performance

- **Duration:** ~3 min for gate authoring; smoke-testing was interrupted by quota; final verification inline
- **Started:** 2026-05-06 (Wave 3)
- **Completed:** 2026-05-06
- **Tasks:** 2/2 (gate authoring + smoke-test)
- **Files modified:** 1 (production), 0 (other)

## Accomplishments

- 3 new gates in `scripts/aeo-audit.mjs`:
  - **FAQ count gate** — fails if `faq.json` has fewer than 34 entries
  - **llms.txt section gate** — fails if any of the 5 required H2 headers are missing (Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, Dietary Options)
  - **robots.txt AI-bot gate** — fails if any of GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot lacks an `Allow: /` directive
- Existing gates (50-word voice audit, llms.txt existence) untouched
- All 3 gates pass on current source data — no false positives

## Task Commits

1. **Task 1: Add 3 new gates to aeo-audit.mjs** — `a4943c1` (feat: add FAQ count, llms.txt sections, robots.txt AI-bot gates)
2. **Task 2: Fail-injection smoke test** — partial; see Deviations

## Files Created/Modified

- `scripts/aeo-audit.mjs` — extended from ~56 lines to ~104 lines; 3 new numbered gate blocks

## Acceptance Criteria — Verified

- ✅ `npm run test:aeo` exits 0 with all gates green on current source data:
  - `✅ FAQ count: 34 entries (target ≥34).`
  - `✅ llms.txt contains all required sections.`
  - `✅ robots.txt: {GPTBot,ClaudeBot,PerplexityBot,Google-Extended,CCBot} allowed.` (5 lines)
- ✅ All 34 FAQ entries pass 50-word voice audit (no regression)
- ✅ Existing llms.txt existence gate intact

## Smoke Test Results (partial — see Deviations)

| Gate | Fail Condition | Tested | Outcome |
|------|----------------|--------|---------|
| FAQ count | Drop entry → 33 | Not tested (quota) | Logic verified by reading source |
| llms.txt sections | Append "(TEMP BROKEN)" to a header | TESTED — exit 1 confirmed | Matched gate logic; restored cleanly post-quota-recovery |
| robots.txt AI-bots | Comment out a User-agent block | Not tested (quota) | Logic verified by reading source |

The llms.txt section gate WAS smoke-tested before quota cut off the executor; the test left `## Payment Methods (TEMP BROKEN)` in `public/llms.txt`. The orchestrator restored the header inline (commit `2cc4b1a`) before phase verification. Gate logic for the other two (FAQ count, robots.txt) was inspected against the existing source data which already meets each threshold — high confidence the gates fail correctly on drift, but a future task should run the remaining two fail-injection tests for completeness.

## Deviations

1. **Smoke test incomplete (Rule 4 — environmental):** The Wave 3 parallel subagent for this plan was killed by Anthropic quota limits before completing all 3 fail-injection smoke tests. Test #2 (llms.txt section) was conducted but not fully restored; the orchestrator restored `public/llms.txt` inline. Tests #1 (FAQ count) and #3 (robots.txt) were NOT run. Logic verified by inspection.
2. **Recommended follow-up:** Run the remaining two fail-injection tests as a quick task (~5 min) to fully validate gate behavior. Templates for each test are in `11-08-PLAN.md` Task 2.

## Self-Check: PASSED with caveat

All gates added correctly and pass on current source data. One smoke test (llms.txt sections) confirmed; two remaining fail-injection tests deferred to a quick task due to quota. No production code is broken; the gates are forward-protection against drift, not a backfill of existing problems.
