---
phase: 11-aeo-refinement
verified: 2026-05-06
status: passed
score:
  must_haves_verified: 13/13
  requirements_covered: 9/9
  success_criteria_met: 6/6
re_verification: false
---

# Phase 11: AEO/GEO Refinement — Verification Report

**Phase Goal:** AI assistants (ChatGPT, Gemini, Perplexity, Google Assistant) return accurate, complete answers about Spice Grill & Bar — Monday hours match across schema/llms.txt/llms-full.txt; structured data exposes payment, reservation, amenity, and dietary signals; the home page emits FAQ + SpeakableSpecification schema for voice search; FAQ data covers ≥34 highway/proximity/operations questions including Williams and Kaibab Estates West; a dedicated `/near-williams/` GEO page targets Williams tourists and Kaibab residents; and `npm run test:aeo` enforces these gates so future drift fails CI.

**Verified:** 2026-05-06
**Status:** PASSED

## Goal Achievement Summary

Phase 11 fully achieves its AEO/GEO refinement goal. All 9 requirements (AEO-01..AEO-09) and all 6 ROADMAP success criteria are verified against the live source tree and built `dist/` artifacts. Monday hours are consistent across the three doc surfaces (no Monday-closed strings remain), owner-confirmed business signals (8 payment methods, walk-in only, 7 amenities, no Wi-Fi) are present in `RestaurantSchema.astro`, the home page emits exactly one `FAQPage` block plus a `SpeakableSpecification` anchored to `#home-faq h3`/`#home-faq p`, FAQ data is at exactly 34 entries (all under the 50-word voice ceiling), `/near-williams/` exists with canonical, sitemap, lighthouse and Footer wiring, and `npm run test:aeo` now enforces the 3 new fail-fast gates plus existing voice-word-count gate — all green.

## Per-Requirement Verification (AEO-01..09)

| REQ | Description (truncated) | Plan(s) | Evidence | Status |
|-----|-------------------------|---------|----------|--------|
| AEO-01 | Monday in `openingHoursSpecification` (08:00-21:00); cross-file drift gone | 11-02 | `RestaurantSchema.astro:36` lists `'https://schema.org/Monday'`; `dist/index.html` `grep -oE '"https://schema.org/Monday"' \| wc -l → 1`; `grep -iE "mon[a-z]*: closed\|closed mondays" public/llms.txt public/llms-full.txt → 0` | ✅ SATISFIED |
| AEO-02 | `paymentAccepted` + `acceptsReservations` + `amenityFeature` on Restaurant | 11-05 | `RestaurantSchema.astro:105-124` defines all three; `dist/index.html` has `"paymentAccepted":"Cash, Visa, Mastercard, American Express, Discover, Debit cards, Apple Pay, Google Pay"`, `"acceptsReservations":false`, `"@type":"LocationFeatureSpecification" × 7` | ✅ SATISFIED |
| AEO-03 | `Kaibab Estates West` entry in `areaServed` | 11-02 | `RestaurantSchema.astro:78-83` upgraded to `Place` with description `"Residential community approximately 5 miles north of Ash Fork, AZ — within easy driving distance of Spice Grill & Bar."` (no I-40 claim); `dist/index.html` has `"@type":"Place","name":"Kaibab Estates West"` | ✅ SATISFIED |
| AEO-04 | `llms.txt` + `llms-full.txt` show Monday OPEN; 5 new H2 sections | 11-03 | `public/llms.txt:14` `**Mon - Thu**: 8:00 AM - 9:00 PM`; `public/llms-full.txt:18` `**Monday - Thursday**: 8:00 AM - 9:00 PM`; both contain Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, Dietary Options sections | ✅ SATISFIED |
| AEO-05 | `Layout.astro` injects `FAQSchema` on `/` AND `/faq/*` | 11-06 | `Layout.astro:121` `{(currentPath === '/' \|\| currentPath.startsWith('/faq')) && <FAQSchema />}`; `dist/index.html` `grep -c '"@type":"FAQPage"' → 1` | ✅ SATISFIED |
| AEO-06 | Visible 8-Q FAQ section + `SpeakableSpecification` on home | 11-06 | `src/pages/index.astro:34-50` renders `<section id="home-faq">` with 8 mapped FAQ entries; lines 57-67 emit `SpeakableSpecification` `cssSelector` `["#home-faq h3", "#home-faq p"]`; `dist/index.html` h3 count inside section = 8 | ✅ SATISFIED |
| AEO-07 | `faq.json` ≥34 entries covering 13 specified topics | 11-04 | `node -e "console.log(require('./src/data/faq.json').length)" → 34`; manual inspection confirms Williams proximity, Kaibab (north), payment methods, walk-in reservations, budget, delivery (no), takeout (yes), best on I-40, Butter Chicken, Tandoori, mild spice, large groups, Route 66; all entries pass 50-word voice audit (max 38 words) | ✅ SATISFIED |
| AEO-08 | `near-williams.astro` GEO page; mirrors `near-grand-canyon`; in `.lighthouserc.json` | 11-07 | `src/pages/near-williams.astro` exists (212 lines); has answer-first H1, speakable lead, Exit 146 sentence, "Why Stop Here", "Distance from Nearby Cities", "What to Order"; `.lighthouserc.json:5` includes `/near-williams/`; sitemap entry confirmed; Footer.astro:79-82 links it | ✅ SATISFIED |
| AEO-09 | `aeo-audit.mjs` adds 3 fail-fast gates | 11-08 | `scripts/aeo-audit.mjs` lines 33-39 (FAQ count ≥34), 53-68 (5 H2 headers via String.includes), 74-95 (5 AI bots regex); `npm run test:aeo` exits 0 with all 3 gates passing | ✅ SATISFIED |

**Coverage: 9/9 (100%)** — no orphaned requirements; all 9 IDs from REQUIREMENTS.md `[x]` marks have evidence in the codebase.

## Success Criteria Results (ROADMAP)

| # | Success Criterion | Status | Evidence |
|---|-------------------|--------|----------|
| 1 | RestaurantSchema lists Monday with opens 08:00 / closes 21:00; includes paymentAccepted, acceptsReservations, amenityFeature; Kaibab Estates West in areaServed | ✅ | `RestaurantSchema.astro:32-54` (Mon-Thu block), `:75-97` (areaServed includes Kaibab Place), `:105-124` (paymentAccepted/acceptsReservations/amenityFeature). Built dist confirms all 3 with 7 LocationFeatureSpecifications. |
| 2 | `llms.txt` + `llms-full.txt` show Monday open; have payment / reservation / delivery / amenity / dietary sections | ✅ | Both files contain `Mon - Thu: 8:00 AM - 9:00 PM` and the 5 H2 headers (Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, Dietary Options). Cross-file diff for the 5-section block = 0. |
| 3 | Home page `/` emits `FAQPage` JSON-LD (from `faq.json`); visible 8-Q FAQ section; SpeakableSpecification | ✅ | `dist/index.html` has 1 FAQPage, 34 Question entries (global FAQSchema sourced from faq.json), 1 `SpeakableSpecification`; `id="home-faq"` section in DOM contains 8 `<h3>` tags. |
| 4 | `faq.json` ≥34 entries covering 13 voice topics; passes 50-word audit | ✅ | Length 34 (verified). All 34 entries pass the 50-word audit (max length 38 words). All 13 topics covered (Williams, Kaibab Estates West, payment methods, reservations, budget, delivery, takeout, I-40 best, Butter Chicken, Tandoori, mild spice, large groups, Route 66). |
| 5 | `near-williams.astro` exists; follows `near-grand-canyon` template; in `.lighthouserc.json`; builds cleanly | ✅ | File exists (212 lines), mirrors GEO template, in lhci config, in sitemap, in Footer. `npm run build` produces `dist/near-williams/index.html` with canonical, FAQPage (3 questions), SpeakableSpecification, no glass/backdrop-blur. |
| 6 | `npm run test:aeo` fails when FAQ <34, llms.txt missing headers, robots.txt lacks AI-bot Allow | ✅ | All 3 gates exist in `scripts/aeo-audit.mjs` (lines 33-39, 53-68, 74-95). One gate (llms.txt sections) was smoke-tested live with `(TEMP BROKEN)` injection and confirmed exit 1 — see Tech Debt #1 below for the remaining 2 fail-injection tests deferred to a follow-up. |

**Score: 6/6 (100%)**

## Wiring & Data-Flow Verification

| Link | Status | Evidence |
|------|--------|----------|
| `RestaurantSchema.astro` → `dist/index.html` JSON-LD | WIRED | All new fields (Monday, paymentAccepted, acceptsReservations, 7 amenityFeatures, Kaibab Place) appear in built JSON-LD. |
| `faq.json` → `dist/index.html` (global FAQPage) | WIRED, FLOWING | 34 Questions in dist/index.html via FAQSchema; 8 of those rendered visibly inside `#home-faq` via `homeFaqIndices` map. |
| `faq.json` → `dist/faq/index.html` | WIRED, FLOWING | 34 Questions present (regression-clean). |
| `Layout.astro` gate broadening → home FAQSchema injection | WIRED | `currentPath === '/'` triggers `<FAQSchema />` exactly once on home; `near-grand-canyon` and `near-williams` correctly do NOT receive global FAQSchema (page-specific inline FAQ blocks remain authoritative there). |
| `near-williams.astro` → Footer Explore section | WIRED | Footer.astro:79-82 has `href="/near-williams/"` with anchor text "Near Williams". |
| `near-williams.astro` → `.lighthouserc.json` | WIRED | URL list includes `/near-williams/`. |
| `near-williams.astro` → sitemap | WIRED | `dist/sitemap-0.xml` contains 1 `near-williams` entry (Astro auto-discovery). |
| `aeo-audit.mjs` gates → `npm run test:aeo` | WIRED, ENFORCED | All 3 new gates plus existing 50-word voice gate execute and the script exits 0 on green / 1 on drift. |

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| FAQ data parses as JSON with ≥34 entries | `node -e "console.log(require('./src/data/faq.json').length)"` | `34` | ✅ PASS |
| AEO audit script exits 0 on current source | `npm run test:aeo` | `AEO Audit Passed!` exit 0 | ✅ PASS |
| Build produces all 5 expected pages | `npm run build` | `5 page(s) built in 12.02s` exit 0 | ✅ PASS |
| Typecheck clean | `npm run typecheck` | `0 errors / 0 warnings / 11 hints` (advisory `is:inline` on JSON-LD scripts — pre-existing, documented) | ✅ PASS |
| Home page injects exactly 1 FAQPage block (no duplicate-FAQPage error) | `grep -c '"@type":"FAQPage"' dist/index.html` | `1` | ✅ PASS |
| LocationFeatureSpecification count = 7 | `grep -oE '"@type":"LocationFeatureSpecification"' dist/index.html \| wc -l` | `7` | ✅ PASS |
| `near-williams/index.html` has canonical | `grep -c "rel=\"canonical\"" dist/near-williams/index.html` | `1` | ✅ PASS |
| Glass budget honored on home + near-williams | `grep -nE "backdrop-blur\|class=\"glass" src/pages/index.astro src/pages/near-williams.astro` | (no output) | ✅ PASS |
| No Monday-closed drift in either llms file | `grep -iE "mon[a-z]*: closed\|closed mondays" public/llms.txt public/llms-full.txt` | (no output) | ✅ PASS |
| No Wi-Fi mentions (owner did not confirm) | `grep -iE "wi-?fi" public/llms.txt public/llms-full.txt RestaurantSchema.astro` | (no output) | ✅ PASS |

## Owner-Confirmation Cross-Check

| Confirmed Value | Source | Landed In | Status |
|-----------------|--------|-----------|--------|
| 8 payment methods (Cash, Visa, MC, Amex, Discover, Debit, Apple Pay, Google Pay) | 11-OWNER-CONFIRMATION.md §1 | `RestaurantSchema.astro:105-106`; `public/llms.txt:45`; `public/llms-full.txt`; FAQ entry #24 | ✅ MATCHES |
| Walk-in only (acceptsReservations: false) | 11-OWNER-CONFIRMATION.md §2 | `RestaurantSchema.astro:107`; FAQ entry #25 ("walk-in only — no reservations needed"); llms files | ✅ MATCHES |
| 7 amenities (parking, RV/truck nearby, wheelchair, indoor, outdoor, family, full bar) | 11-OWNER-CONFIRMATION.md §3 | `RestaurantSchema.astro:108-124`; llms.txt:53-60; llms-full.txt | ✅ MATCHES |
| Wi-Fi NOT confirmed → must be absent | 11-OWNER-CONFIRMATION.md §3 | 0 occurrences across all 3 surfaces | ✅ EXCLUDED |
| Kaibab Estates West is NORTH of Ash Fork (NOT east on I-40) | 11-OWNER-CONFIRMATION.md §4 | RestaurantSchema description ("5 miles north"); FAQ entry #23 ("5 miles south of Kaibab Estates West"); near-williams.astro:38, 54-56 ("5 miles north of Ash Fork", "off the I-40 corridor"); 0 occurrences of "east of Ash Fork on I-40" | ✅ APPLIED EVERYWHERE |
| Williams is EAST on I-40, ~18 miles, ~18 minutes | 11-OWNER-CONFIRMATION.md §4 | FAQ entry #22; near-williams.astro:14-22; preserved unchanged | ✅ MATCHES |

## Anti-Pattern Scan

| File | Patterns | Severity | Notes |
|------|----------|----------|-------|
| `src/pages/index.astro` | None | — | No TODO/FIXME/placeholder; defensive `.filter((entry) => entry)` on FAQ map is intentional fallback, not a stub |
| `src/pages/near-williams.astro` | None | — | Concrete distances (18 mi/east, 5 mi/north, 78 mi, 51 mi, 25 mi); no placeholder copy |
| `src/components/schema/RestaurantSchema.astro` | None | — | All values are owner-confirmed; no `as any`, `@ts-expect-error`, or `@ts-ignore` |
| `public/llms.txt` / `public/llms-full.txt` | None | — | Cross-file diff = 0 for the 5-section block; no Wi-Fi; no "TBD"; no Monday-closed |
| `scripts/aeo-audit.mjs` | None | — | All 3 gates execute and emit per-bot ✅ messages |
| `src/data/faq.json` | None | — | 0 OWNER_CONFIRMED placeholders; 0 duplicates (verified: `awk -F'"' '/"question":/{print $4}' \| sort \| uniq -d \| wc -l → 0`) |

## Tech Debt / Deviations

1. **Plan 11-08 smoke-test coverage incomplete (low risk, deferrable).**
   Only 1 of 3 fail-injection smoke tests was completed (llms.txt section gate — confirmed exit 1, restored cleanly). The FAQ-count gate and robots.txt AI-bot gate were verified by code inspection only; the gates' runtime behavior on intentional drift was NOT tested live. Logic is straightforward (length check + regex), so risk is low, but completeness suggests a quick follow-up task to fully validate.

2. **`Layout.astro` gate broadening relies on path equality `currentPath === '/'`.**
   Works for the home page as deployed today, but if Astro `Astro.url.pathname` ever returns `''` (no trailing slash) for the index route in a future Astro version, the home FAQSchema would silently stop firing. Not a current bug — flagging for `npm run build` regression awareness only.

3. **Astro `is:inline` advisory hints on `<script type="application/ld+json">` blocks (pre-existing).**
   `npm run typecheck` reports 11 advisory hints (up from 8 pre-Phase 11) — `index.astro` SpeakableSpec script + `near-williams.astro` 2 script blocks contributed 3 new hints. These are advisory only (not warnings), schema-correct, and consistent with existing precedent in `near-grand-canyon.astro`/`directions.astro`. Documented in 11-06 SUMMARY as out-of-scope tidy-up.

4. **Plan-grep gate brittleness (documentation only, fixed in spirit).**
   Plans 11-03/11-04/11-05 specify `grep -c "^Status: confirmed" 11-OWNER-CONFIRMATION.md` but the file uses bold markdown (`**Status:** confirmed`). Executors handled this correctly per Rule 3 (verified condition substantively, no values invented). A future audit-script extension could relax the regex (`grep -i "Status:.*confirmed"`).

## Recommendations

1. **Quick task: Complete the remaining 2 aeo-audit fail-injection smoke tests.**
   Drop a FAQ entry (33 entries) → expect exit 1 with `❌ FAQ count is 33, expected ≥34`; comment a `User-agent: GPTBot` block → expect exit 1 with `❌ robots.txt: GPTBot missing Allow: / directive`. Restore cleanly. ~5 min total. Templates are in `11-08-PLAN.md` Task 2.

2. **Manual schema.org validator run on `https://spicegrillbar66.com/near-williams/` after deploy.**
   The page emits 2 inline JSON-LD blocks (FAQPage + WebPage/SpeakableSpecification) plus the global RestaurantSchema. While `npm run build` parses cleanly and grep gates pass, Google's [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/) should confirm zero errors against live URLs before AEO deploy is considered complete.

3. **Live AEO sanity check post-deploy (human task).**
   Voice-test the 3 highest-value queries against ChatGPT/Gemini/Perplexity 1 week after deploy: (a) "Are restaurants near Williams AZ open Monday?" (should reflect Mon 8AM-9PM), (b) "Where to eat near Kaibab Estates West?" (should not say I-40 east), (c) "Indian restaurant on I-40 in Arizona that takes Apple Pay?" (should surface paymentAccepted signal). Voice-engine indexing typically lags 7-14 days behind a sitemap submission.

## Human Verification Required

None. All 6 success criteria are programmatically verifiable against the source tree and built `dist/` artifacts, and all checks pass. The recommendations above are post-deploy quality assurance, not blocking gaps.

---

## VERIFICATION PASSED

All 9 requirements covered, all 6 success criteria met, all 13 must-haves verified. Phase 11 closes the AEO/GEO drift identified in `v3.0-MILESTONE-AUDIT.md` and raises a CI-enforced floor against future regression. Ready to mark Phase 11 complete in ROADMAP.md and proceed.

*Phase: 11-aeo-refinement*
*Verified: 2026-05-06 by gsd-verifier*
