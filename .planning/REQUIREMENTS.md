# Requirements — v3.0 AEO/GEO Refinement

**Defined:** 2026-05-05
**Core Value:** AI engines and Google must surface Spice Grill & Bar as the answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.

> Past milestone requirements archived under `.planning/milestones/v2.0-REQUIREMENTS.md` and `.planning/milestones/v1.0-REQUIREMENTS.md`.

## Confirmed Business Data (source of truth — v3.0 deltas only)

| Field                | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| Hours (corrected)    | Monday–Thursday: 8:00 AM – 9:00 PM / Friday–Sunday: 8:00 AM – 10:00 PM (Monday is OPEN, per recent menu/hours commit `28501bb` and current `faq.json`) |
| Williams distance    | 18 miles east on I-40 (~18 minutes) — confirmed in existing FAQ entries                       |
| Kaibab Estates West  | ~5 miles east of Ash Fork on I-40 (~6 minutes); residential community — distance to be confirmed in CONTEXT |
| Payment methods      | TBD — confirm in CONTEXT (typical restaurant set: cash, Visa/MC/Amex/Discover, debit, Apple Pay, Google Pay) |
| Reservations         | TBD — confirm in CONTEXT (walk-in vs phone reservation policy)                                 |
| Delivery / Takeout   | Pickup (Toast Online), Curbside, Dine-in confirmed; third-party delivery TBD                  |
| Amenities            | TBD — confirm in CONTEXT (parking, wheelchair access, seating type, Wi-Fi, family-friendly)   |
| Dietary              | Vegetarian-friendly + vegan options confirmed (existing FAQ entry); GF options TBD            |

> The planner must NOT invent payment methods, reservation policy, or amenity details. Any "TBD" field above must either be answered by the user during CONTEXT gathering or marked as "verify with owner" in the plan.

## v3.0 Requirements

### Schema Enrichment & Hours Fix

- [x] **AEO-01**: `RestaurantSchema.astro` `openingHoursSpecification` includes Monday opening hours (`opens: "08:00"` / `closes: "21:00"`) and Monday is no longer omitted/closed. Drift across `RestaurantSchema.astro`, `public/llms.txt`, and `public/llms-full.txt` is eliminated.
- [x] **AEO-02**: `RestaurantSchema.astro` adds `paymentAccepted` (string list per schema.org), `acceptsReservations` (boolean), and `amenityFeature` (`LocationFeatureSpecification[]`) — values sourced from confirmed business data
- [x] **AEO-03**: `RestaurantSchema.astro` `areaServed` includes a `Kaibab Estates West` entry (verify presence; promote to `Place` with description if missing)

### AI-Readable File Expansion

- [x] **AEO-04**: `public/llms.txt` and `public/llms-full.txt` show Monday as OPEN (8:00 AM – 9:00 PM) under Operating Hours, and add new sections for Payment Methods, Reservation Policy, Delivery & Takeout, Amenities, and Dietary Options. The bundled FAQ block in `llms.txt` reflects the corrected hours.

### Home Page AEO

- [ ] **AEO-05**: `src/layouts/Layout.astro` injects `FAQSchema` on the home page (`/`) in addition to `/faq/`. The current `currentPath.startsWith('/faq')` gate is broadened so AI crawlers see Q&A on the landing page.
- [ ] **AEO-06**: `src/pages/index.astro` renders a visible 8-question FAQ section in the page DOM. The section is annotated with a `SpeakableSpecification` schema block targeting the question-and-answer DOM nodes (CSS selectors or XPath) for Google voice extraction.

### FAQ Data Expansion

- [x] **AEO-07**: `src/data/faq.json` expands by 13 entries (≥34 total). New entries cover: (1) Williams, AZ proximity, (2) Kaibab Estates West proximity, (3) accepted payment methods, (4) reservation policy, (5) pricing / budget-friendliness, (6) delivery availability, (7) takeout availability, (8) best restaurant on I-40, (9) signature Butter Chicken, (10) signature Tandoori specialties, (11) spice-level customization, (12) family/group dining, (13) one additional voice-friendly entry. Every new entry must pass the existing 50-word voice audit (`scripts/aeo-audit.mjs`).

### GEO Content

- [ ] **AEO-08**: A new page `src/pages/near-williams.astro` exists, mirrors the `near-grand-canyon.astro` template (answer-first H1, speakable lead, standalone Exit 146 sentence, "Why Stop Here" / "Distance from Nearby Cities" / "What to Order" sections, breadcrumb), targets Williams tourists AND Kaibab Estates West residents, and is added to `.lighthouserc.json` for Lighthouse CI coverage.

### Audit Strengthening

- [ ] **AEO-09**: `scripts/aeo-audit.mjs` adds gates that fail (`process.exit(1)`) when:
  - FAQ count in `faq.json` < 34
  - `public/llms.txt` is missing required section headers (Payment Methods, Reservations, Delivery, Amenities, Dietary)
  - `public/robots.txt` does not contain `Allow: /` for major AI bots: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`

## Out of Scope

- Visual redesign work — v2.0 is shipped, do not touch tokens, glass budget, or typography utilities
- Online ordering system changes — Toast integration unchanged
- Halal messaging revision (deferred from v1.0 Active, wording still TBD)
- `/about/` and `/route-66-dining/` content pages (deferred from v1.0 Active, separate future phase)
- Apple Maps Business Connect work — manual, off-site
- Fix `servesCuisine` in `RestaurantSchema` to remove beverage types (deferred from v1.0 Active — separate quick task)

## Traceability

| REQ-ID | Phase | Plan | Status |
| --- | --- | --- | --- |
| AEO-01 | Phase 11 | TBD | Active |
| AEO-02 | Phase 11 | TBD | Active |
| AEO-03 | Phase 11 | TBD | Active |
| AEO-04 | Phase 11 | TBD | Active |
| AEO-05 | Phase 11 | TBD | Active |
| AEO-06 | Phase 11 | TBD | Active |
| AEO-07 | Phase 11 | TBD | Active |
| AEO-08 | Phase 11 | TBD | Active |
| AEO-09 | Phase 11 | TBD | Active |
