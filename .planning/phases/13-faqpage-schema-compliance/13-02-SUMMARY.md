---
phase: 13-faqpage-schema-compliance
plan: "02"
subsystem: build-tooling
tags: [aeo, audit-gate, faqpage, ci, regression]
dependency_graph:
  requires: []
  provides: [AEO-10-gate]
  affects: [scripts/aeo-audit.mjs]
tech_stack:
  added: []
  patterns: [existsSync-guard, readFileSync-string-match, errors-counter]
key_files:
  created: []
  modified:
    - scripts/aeo-audit.mjs
decisions:
  - "D-05: FAQPage gate merged into @id gate block (single dist/index.html read)"
  - "D-06: Shipped as standalone chore: commit, separate from Plan 13-01 schema changes"
metrics:
  duration: "~5 min"
  completed: "2026-05-14"
  tasks_completed: 1
  files_modified: 1
---

# Phase 13 Plan 02: FAQPage AEO Audit Gate Summary

**One-liner:** FAQPage Question-count gate added to aeo-audit.mjs asserting exactly 8 `"@type":"Question"` entries in `dist/index.html`, merged into the existing @id block to read the file once.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | Add FAQPage Question-count gate to aeo-audit.mjs | ff94aa7 | scripts/aeo-audit.mjs |

## What Was Built

A permanent automated regression gate was added to `scripts/aeo-audit.mjs` (section 4 — merged block). The gate:

- Reuses the existing `distIndexPath` constant (defined at line 98)
- Uses `distHtml.match(/"@type":"Question"/g) || []` to count all Question entries in `dist/index.html`
- Fails with `errors++` and a `console.error` if the count is not exactly 8
- Passes with `console.log('✓ FAQPage gate: dist/index.html contains exactly 8 Question entries')` when count == 8
- Skips gracefully with `console.warn` (no `errors++`) when `dist/index.html` is absent — mirrors the Phase 12 @id gate pattern
- Reads `dist/index.html` only once (merged block approach) — no duplicate `readFileSync` call

The gate's first run (before Plan 13-01 is merged) correctly reports 34 Question entries and fails, confirming the gate logic works and demonstrating the pre-existing AEO-10 violation. Once Plan 13-01's schema changes are applied, the gate will pass with exactly 8 entries.

## Verification Results

- `scripts/aeo-audit.mjs` contains `distHtml.match(/"@type":"Question"/g)` — confirmed line 119
- `scripts/aeo-audit.mjs` contains `questionMatches.length !== 8` comparison with `errors++` — confirmed lines 120-122
- `scripts/aeo-audit.mjs` contains `console.warn` for FAQPage gate in `!fs.existsSync` branch — confirmed line 101
- Only 1 `const distIndexPath` declaration in the file — confirmed (no duplicate added)
- Gate correctly detected 34 Question entries and incremented errors — confirms the gate logic fires correctly
- Gate skips gracefully when dist absent (confirmed by code review of the `!existsSync` branch)

## Deviations from Plan

None — plan executed exactly as written. The merged single-block approach from 13-PATTERNS.md was used as specified.

## Known Stubs

None — no stubs or placeholders exist in this change.

## Threat Surface Scan

No new security surface introduced. `aeo-audit.mjs` remains a developer/CI build script with no user input, no network exposure, and no auth paths. Gate reads a local build artifact only. (See plan threat model: T-13-04 and T-13-05 accepted per plan design.)

## Self-Check: PASSED

| Check | Result |
|-------|--------|
| `scripts/aeo-audit.mjs` exists | FOUND |
| `13-02-SUMMARY.md` created | FOUND |
| Commit ff94aa7 exists | FOUND |
| Gate search string `"@type":"Question"` present | FOUND |
| `questionMatches.length !== 8` assertion present | FOUND |
| FAQPage gate skip `console.warn` present | FOUND |
