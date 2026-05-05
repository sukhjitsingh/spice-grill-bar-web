# Phase 11: AEO/GEO Refinement — Context

**Gathered:** 2026-05-05
**Status:** Ready for planning
**Source:** User-provided AEO Optimization Plan (treated as PRD — all 8 items are locked decisions)

<domain>
## Phase Boundary

This phase delivers the v3.0 AEO/GEO Refinement milestone in a single multi-wave phase. It is **content + structured data + GEO + tooling** work — no visual redesign, no token changes, no Toast integration changes.

**In scope:**
- Schema enrichment + Monday hours fix in `src/components/schema/RestaurantSchema.astro`
- Content fixes + section additions in `public/llms.txt` and `public/llms-full.txt`
- Layout-level FAQSchema gate broadened in `src/layouts/Layout.astro`
- New visible FAQ + SpeakableSpecification block in `src/pages/index.astro`
- 13 new entries in `src/data/faq.json` (target ≥34 total)
- New GEO page at `src/pages/near-williams.astro` (mirrors `near-grand-canyon.astro`)
- AEO audit script gates in `scripts/aeo-audit.mjs`

**Out of scope:**
- v2.0 design system tokens, glass budget, typography utilities
- Toast online-ordering changes
- Halal messaging rewording (deferred)
- `/about/` and `/route-66-dining/` content pages (deferred)
- Apple Maps Business Connect (manual, off-site)
- `servesCuisine` cleanup in RestaurantSchema (separate quick task)

</domain>

<decisions>
## Implementation Decisions

### Hours of Operation (LOCKED)
- Monday is OPEN: 8:00 AM – 9:00 PM (matches Tue–Thu hours)
- Tue–Thu: 8:00 AM – 9:00 PM
- Fri–Sun: 8:00 AM – 10:00 PM
- The `faq.json` answer "Spice Grill & Bar is open Monday through Thursday 8am–9pm, Friday through Sunday 8am–10pm" is the source of truth — `RestaurantSchema.astro`, `public/llms.txt`, and `public/llms-full.txt` are wrong and must be corrected.
- All three files MUST agree after this phase. The plan-checker should treat any remaining drift as a P0 issue.

### Schema Fields to Add (LOCKED)
- `paymentAccepted` — string list per schema.org (e.g., "Cash, Credit Card, Debit Card, Apple Pay, Google Pay"). Exact list must be confirmed with the owner before merging — see "Owner-confirmation gate" below.
- `acceptsReservations` — boolean (true if phone reservations accepted, false if walk-in only). Owner must confirm.
- `amenityFeature` — `LocationFeatureSpecification[]` covering parking, wheelchair accessibility, indoor/outdoor seating, family-friendly, free Wi-Fi. Owner must confirm exact set.
- `areaServed` — verify `Kaibab Estates West` already exists (it does, per current `RestaurantSchema.astro`); upgrade to `Place` type with `description` if currently bare `City`.

### llms.txt / llms-full.txt Section Plan (LOCKED)
Add the following H2 sections (or H3 in `llms.txt`'s leaner format) AFTER existing Operating Hours / Location & Proximity blocks:
- `## Payment Methods`
- `## Reservation Policy`
- `## Delivery & Takeout`
- `## Amenities`
- `## Dietary Options`

The "Operating Hours" section in BOTH files must be rewritten to show Monday as OPEN (currently both files say "Mon: Closed" — wrong).

### Home Page FAQ + SpeakableSpecification (LOCKED)
- `Layout.astro` line 121 currently gates `<FAQSchema />` to `currentPath.startsWith('/faq')`. Change this to also fire on `/` (the home page). Approach: gate as `currentPath === '/' || currentPath.startsWith('/faq')` OR add a prop like `injectFAQSchema` that pages opt into. Planner picks one — both meet the requirement.
- `index.astro` adds a visible FAQ section with **8 curated entries** (subset of `faq.json`, picked for highway/voice relevance — e.g., hours, location, distance from Grand Canyon, dietary, signature dish, payment, reservations, takeout). Section is `<section>` with id like `home-faq` for SpeakableSpecification targeting.
- `SpeakableSpecification` schema is injected as a separate `<script type="application/ld+json">` block (NOT inside `RestaurantSchema.astro`) — its `cssSelector` array points at the FAQ section's question and answer DOM. Schema.org reference: <https://schema.org/SpeakableSpecification>.

### FAQ Expansion — 13 New Entries (LOCKED topics, draft answers TBD)
Every entry must pass the existing 50-word voice audit. Topics:

1. Williams, AZ proximity ("How far is Spice Grill & Bar from Williams, AZ?")
2. Kaibab Estates West proximity ("Is there an Indian restaurant near Kaibab Estates West?")
3. Payment methods ("What payment methods does Spice Grill & Bar accept?")
4. Reservation policy ("Do I need a reservation at Spice Grill & Bar?")
5. Pricing / budget-friendliness ("Is Spice Grill & Bar affordable?" or "Is Spice Grill & Bar budget-friendly?")
6. Delivery ("Does Spice Grill & Bar deliver?")
7. Takeout ("Does Spice Grill & Bar offer takeout?")
8. Best restaurant on I-40 ("What's the best Indian restaurant on I-40 in Arizona?")
9. Butter Chicken ("Is Spice Grill & Bar known for Butter Chicken?" or "What is Spice Grill & Bar's signature dish?")
10. Tandoori specialties ("Does Spice Grill & Bar have Tandoori dishes?")
11. Spice level customization (already partially covered — this is item #4 in current `faq.json` — DEDUPE: pick a different angle, e.g., "Can I order mild Indian food at Spice Grill & Bar?")
12. Family / group dining ("Is Spice Grill & Bar family-friendly?" or "Can Spice Grill & Bar accommodate large groups?")
13. One additional voice-friendly entry — recommend "Is Spice Grill & Bar a good place to stop while driving Route 66?" or "Does Spice Grill & Bar have parking for RVs / trucks?"

The planner must check `faq.json` for duplicates before writing — current file already covers spice level customization (#4 in existing data) and Butter Chicken/Tandoori (#11 popular dishes), so wording must be distinct.

### `near-williams.astro` GEO Page (LOCKED structure)
Mirror `src/pages/near-grand-canyon.astro` exactly — same surface tokens, same H2 sections, same `speakable-heading` / `speakable-lead` classes, same SpeakableSpecification injection pattern. Page-specific content:
- Title: "Indian Restaurant Near Williams, AZ — Spice Grill & Bar (~18 Miles East via I-40)"
- Lead: ~18 miles east of Williams on I-40 Exit 146, about 18 minutes
- Standalone exit sentence: "Spice Grill & Bar is located at I-40 Exit 146 in Ash Fork, Arizona, about 18 miles east of Williams via I-40 East."
- Why Stop Here: emphasize Williams as Grand Canyon Railway gateway + Kaibab Estates West residential community
- Distance from Nearby Cities: Williams (18 mi), Kaibab Estates West (~5 mi), Grand Canyon (78 mi), Flagstaff (51 mi), Seligman (25 mi)
- What to Order: same 4 dishes pattern as near-grand-canyon
- Add to `.lighthouserc.json` `url[]` array
- Update `Footer.astro` Explore section if it lists GEO pages (verify pattern)
- Update sitemap-related config if needed (Astro sitemap auto-discovers; verify)

### `aeo-audit.mjs` New Gates (LOCKED logic)
- **FAQ count gate:** if `faqData.length < 34`, log error and `errors++`
- **llms.txt section gate:** read `public/llms.txt`, check it contains all of: `## Payment Methods`, `## Reservation Policy`, `## Delivery`, `## Amenities`, `## Dietary` (or H3 equivalent — match planner's chosen format)
- **robots.txt AI-bot gate:** read `public/robots.txt`, ensure each of `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` has a `User-agent` block followed by `Allow: /`. Existing file has all 5 (verified) — gate ensures future drift fails CI.
- Keep all existing gates (50-word voice audit, llms.txt existence) intact.
- Hook into existing `npm run test:aeo` script — no new npm command.

### Owner-Confirmation Gate (LOCKED process)
For `paymentAccepted`, `acceptsReservations`, `amenityFeature`, and any `near-williams` distance/time facts:
- The planner must include a Wave-1 task that BLOCKS plan execution until the user confirms exact values.
- DO NOT invent payment methods or amenities. The plan should produce a checklist for the user to fill in, then the executor reads the confirmed values and applies them.
- Acceptable: leaving placeholder constants in code with `TODO(owner-verify)` comments and a verification task before merge.

### Claude's Discretion
- Wave structure (planner picks 2–3 waves with logical dependencies)
- Whether to broaden `Layout.astro` FAQ gate via path check vs. opt-in prop
- Curation of WHICH 8 of 34 FAQs go on the home page (picker must be highway/voice-optimized)
- Exact answer wording for the 13 new FAQ entries (must pass 50-word voice audit)
- Section naming/casing in `llms.txt` (H2 vs H3) — match existing file style
- File paths within phase directory (planner names plans `11-01-PLAN.md`, `11-02-PLAN.md`, etc.)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source-of-truth files (read for current state)
- `src/components/schema/RestaurantSchema.astro` — current schema; Monday currently MISSING from `openingHoursSpecification`
- `src/components/schema/FAQSchema.astro` — dynamic FAQ schema rendering pattern, sourced from `src/data/faq.json`
- `src/data/faq.json` — current FAQ data (21 entries; needs ≥34); answer-length convention enforced by `scripts/aeo-audit.mjs`
- `src/layouts/Layout.astro` — schema injection point; line 121 has the `currentPath.startsWith('/faq')` gate that must change
- `src/pages/index.astro` — home page; FAQ section to be added here
- `src/pages/near-grand-canyon.astro` — TEMPLATE for `near-williams.astro` (mirror structure exactly)
- `src/pages/faq.astro` — pattern reference for full FAQ pages
- `public/llms.txt` — leaner AI-crawler doc; line 13 says "Mon: Closed" (wrong); line 37 FAQ block also wrong
- `public/llms-full.txt` — full AI-crawler doc; line 18 says "Monday: Closed" (wrong)
- `public/robots.txt` — current AI-bot allowlist (already includes GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot — gate is forward-protection)
- `scripts/aeo-audit.mjs` — current audit script (FAQ word count + llms.txt existence only); ~56 lines
- `.lighthouserc.json` — Lighthouse CI URL list; `near-williams` must be added
- `src/components/Footer.astro` — Explore section may list GEO pages; verify pattern

### Project-level
- `CLAUDE.md` — project instructions (Astro 5, M3 tokens, glass budget, no-line rule)
- `.planning/REQUIREMENTS.md` — v3.0 requirements (this milestone)
- `.planning/MILESTONES.md` — milestone history
- `.planning/STATE.md` — project state and accumulated decisions

### External / standards
- schema.org `Restaurant` — <https://schema.org/Restaurant>
- schema.org `SpeakableSpecification` — <https://schema.org/SpeakableSpecification>
- schema.org `LocationFeatureSpecification` — <https://schema.org/LocationFeatureSpecification>
- llms.txt convention — <https://llmstxt.org/>

</canonical_refs>

<specifics>
## Specific Ideas

- The `currentPath.startsWith('/faq')` gate at `src/layouts/Layout.astro:121` is the single line that must change for AEO-05. Recommended: `(currentPath === '/' || currentPath.startsWith('/faq'))` to keep gate centralized.
- For SpeakableSpecification, schema.org accepts `cssSelector` strings. Use stable selectors like `#home-faq h3` and `#home-faq p` rather than dynamic class names that may change with Tailwind utility shifts.
- For the "8 curated home FAQs," recommend picking from existing 21 entries: hours, location, dietary options, popular dishes, distance from Grand Canyon, I-40 Exit 146, takeout/curbside, recommended dish for first-timers. This is a subset, not new content — keeps maintenance low.
- For `near-williams.astro`, copy `near-grand-canyon.astro` line-by-line then replace city/distance/title strings. Do NOT rewrite the surface tokens or layout.
- The audit script's existing 50-word voice gate already enforces voice optimization for new entries — no separate test needed for AEO-07.
- Consider adding a `npm run test:aeo` invocation to `npm run qa` (currently does it) — verify it stays in the pre-push hook.

</specifics>

<deferred>
## Deferred Ideas

- `/about/` page (deferred from v1.0 Active — separate phase)
- `/route-66-dining/` page (deferred from v1.0 Active — separate phase)
- `servesCuisine` cleanup to remove beverage types from `RestaurantSchema.astro` (separate quick task — recommend `/gsd:add-todo`)
- Halal messaging rewording across `llms.txt`, `llms-full.txt`, `OurStorySection.astro` (deferred — wording still TBD with owner)
- Apple Maps Business Connect optimization (manual, off-site)
- Visible FAQ section on `/near-grand-canyon/` and `/directions/` (consider for next phase if voice traffic warrants)

</deferred>

---

*Phase: 11-aeo-refinement*
*Context gathered: 2026-05-05 via PRD Express Path (user-provided plan treated as locked decisions)*
