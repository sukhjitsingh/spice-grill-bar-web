# Phase 11: AEO/GEO Refinement — Research

**Researched:** 2026-05-05
**Domain:** Schema.org structured data, AI/Answer Engine Optimization (AEO), local SEO (GEO), llms.txt convention, voice/speakable markup, Astro 5 static-site patterns
**Confidence:** HIGH for schema.org / schema-dts shapes, MEDIUM for SpeakableSpecification (in-beta and off-spec for FAQ — mirroring existing project precedent), HIGH for file-level changes (every file inspected directly)

## Summary

This phase is mostly content and structured-data work on a fully static Astro 5 build. There are zero new dependencies — the codebase already has `schema-dts` typed for every schema field we need (`paymentAccepted`, `acceptsReservations`, `amenityFeature`, `LocationFeatureSpecification`, `SpeakableSpecification`), Tailwind v4 is configured, and the site already follows a "speakable-heading / speakable-lead / speakable-hours" CSS class convention on `near-grand-canyon.astro` and `directions.astro` that we will mirror.

Three things are NOT in our control: (a) the owner-confirmation gate for payment methods / reservation policy / amenities (locked decision in CONTEXT — must be a Wave-1 blocking task with a checklist for the user), (b) the Williams/Kaibab Estates West distances which the user already supplied (~18 mi / ~5 mi) and we treat as confirmed, and (c) Google's behavior around `SpeakableSpecification` and FAQPage rich results — both are now beta/deprecated for general use, but they remain valuable AI/voice signals for ChatGPT/Gemini/Perplexity/Claude and we proceed because the project already uses them.

**Primary recommendation:** Plan three waves. Wave 0 = framework prep + owner-confirmation checklist. Wave 1 = data fixes (Monday hours across all 3 files, FAQ data expansion to 34 entries, areaServed Kaibab Estates West upgrade). Wave 2 = schema enrichment + new pages + audit-script gates. Verify everything by building the site and grepping the rendered HTML in `dist/` — that is the only authoritative source of truth for what crawlers see, since AI/Google fetch HTML, not Astro components.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hours of Operation**
- Monday is OPEN: 8:00 AM – 9:00 PM (matches Tue–Thu hours)
- Tue–Thu: 8:00 AM – 9:00 PM
- Fri–Sun: 8:00 AM – 10:00 PM
- The `faq.json` answer "Spice Grill & Bar is open Monday through Thursday 8am–9pm, Friday through Sunday 8am–10pm" is the source of truth — `RestaurantSchema.astro`, `public/llms.txt`, and `public/llms-full.txt` are wrong and must be corrected.
- All three files MUST agree after this phase. The plan-checker should treat any remaining drift as a P0 issue.

**Schema Fields to Add**
- `paymentAccepted` — string list per schema.org (e.g., "Cash, Credit Card, Debit Card, Apple Pay, Google Pay"). Exact list must be confirmed with the owner before merging.
- `acceptsReservations` — boolean (true if phone reservations accepted, false if walk-in only). Owner must confirm.
- `amenityFeature` — `LocationFeatureSpecification[]` covering parking, wheelchair accessibility, indoor/outdoor seating, family-friendly, free Wi-Fi. Owner must confirm exact set.
- `areaServed` — verify `Kaibab Estates West` already exists (it does); upgrade to `Place` type with `description` if currently bare `City`.

**llms.txt / llms-full.txt Section Plan**
Add the following H2 sections AFTER existing Operating Hours / Location & Proximity blocks:
- `## Payment Methods`
- `## Reservation Policy`
- `## Delivery & Takeout`
- `## Amenities`
- `## Dietary Options`

The "Operating Hours" section in BOTH files must be rewritten to show Monday as OPEN (currently both files say "Mon: Closed" — wrong).

**Home Page FAQ + SpeakableSpecification**
- `Layout.astro` line 121 currently gates `<FAQSchema />` to `currentPath.startsWith('/faq')`. Change this to also fire on `/`. Approach: gate as `currentPath === '/' || currentPath.startsWith('/faq')` OR add a prop like `injectFAQSchema` that pages opt into. Planner picks one — both meet the requirement.
- `index.astro` adds a visible FAQ section with **8 curated entries** (subset of `faq.json`, picked for highway/voice relevance). Section is `<section>` with id like `home-faq` for SpeakableSpecification targeting.
- `SpeakableSpecification` schema is injected as a separate `<script type="application/ld+json">` block (NOT inside `RestaurantSchema.astro`).

**FAQ Expansion — 13 New Entries (LOCKED topics, draft answers TBD)**
Every entry must pass the existing 50-word voice audit. Topics:
1. Williams, AZ proximity
2. Kaibab Estates West proximity
3. Payment methods
4. Reservation policy
5. Pricing / budget-friendliness
6. Delivery
7. Takeout
8. Best restaurant on I-40
9. Butter Chicken
10. Tandoori specialties
11. Spice level customization (DEDUPE: pick a different angle, e.g., "Can I order mild Indian food at Spice Grill & Bar?")
12. Family / group dining
13. One additional voice-friendly entry — recommend "Is Spice Grill & Bar a good place to stop while driving Route 66?" or "Does Spice Grill & Bar have parking for RVs / trucks?"

The planner must check `faq.json` for duplicates before writing — current file already covers spice level customization (#12 in existing data, 0-indexed) and Butter Chicken/Tandoori (#10 popular dishes), so wording must be distinct.

**`near-williams.astro` GEO Page (LOCKED structure)**
Mirror `src/pages/near-grand-canyon.astro` exactly — same surface tokens, same H2 sections, same `speakable-heading` / `speakable-lead` classes, same SpeakableSpecification injection pattern. Page-specific content:
- Title: "Indian Restaurant Near Williams, AZ — Spice Grill & Bar (~18 Miles East via I-40)"
- Lead: ~18 miles east of Williams on I-40 Exit 146, about 18 minutes
- Standalone exit sentence
- Why Stop Here: Williams as Grand Canyon Railway gateway + Kaibab Estates West residential community
- Distance from Nearby Cities: Williams (18 mi), Kaibab Estates West (~5 mi), Grand Canyon (78 mi), Flagstaff (51 mi), Seligman (25 mi)
- What to Order: same 4 dishes pattern as near-grand-canyon
- Add to `.lighthouserc.json` `url[]` array
- Update `Footer.astro` Explore section if it lists GEO pages
- Update sitemap-related config if needed (Astro sitemap auto-discovers; verify)

**`aeo-audit.mjs` New Gates**
- FAQ count gate: if `faqData.length < 34`, log error and `errors++`
- llms.txt section gate: read `public/llms.txt`, check it contains all of: `## Payment Methods`, `## Reservation Policy`, `## Delivery`, `## Amenities`, `## Dietary` (or H3 equivalent — match planner's chosen format)
- robots.txt AI-bot gate: ensure each of `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` has a `User-agent` block followed by `Allow: /`
- Keep all existing gates intact. Hook into existing `npm run test:aeo` script — no new npm command.

**Owner-Confirmation Gate**
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

### Deferred Ideas (OUT OF SCOPE)
- `/about/` page (deferred from v1.0 Active — separate phase)
- `/route-66-dining/` page (deferred from v1.0 Active — separate phase)
- `servesCuisine` cleanup to remove beverage types from `RestaurantSchema.astro` (separate quick task — recommend `/gsd:add-todo`)
- Halal messaging rewording across `llms.txt`, `llms-full.txt`, `OurStorySection.astro` (deferred — wording still TBD with owner)
- Apple Maps Business Connect optimization (manual, off-site)
- Visible FAQ section on `/near-grand-canyon/` and `/directions/` (consider for next phase if voice traffic warrants)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AEO-01 | `RestaurantSchema.astro` `openingHoursSpecification` includes Monday opens 08:00 / closes 21:00; drift across `RestaurantSchema.astro`, `public/llms.txt`, `public/llms-full.txt` eliminated | "Standard Stack > schema-dts" — Monday currently omitted from `openingHoursSpecification` array (verified at `src/components/schema/RestaurantSchema.astro:32–53`); add 3rd OpeningHoursSpecification entry for Monday OR merge with Tue–Thu; `public/llms.txt:13` says "Mon: Closed", `public/llms.txt:37` FAQ block says "Closed Mondays", `public/llms-full.txt:18` says "Monday: Closed" — all wrong |
| AEO-02 | `RestaurantSchema.astro` adds `paymentAccepted`, `acceptsReservations`, `amenityFeature` | "Code Examples > Restaurant schema enrichment" — schema-dts already types all three (`schema.d.ts:5190` paymentAccepted as `Text`, `:3873` acceptsReservations as `Boolean \| Text \| URL`, `:3814` amenityFeature as `LocationFeatureSpecification[]`). `paymentAccepted` is a single comma-separated string. `acceptsReservations` is preferred boolean. `amenityFeature` is array of `{@type, name, value: boolean}`. |
| AEO-03 | `RestaurantSchema.astro` `areaServed` includes Kaibab Estates West; promote to `Place` if currently bare `City` | "Existing State > RestaurantSchema" — entry already exists at `src/components/schema/RestaurantSchema.astro:77` as bare `City`. CONTEXT does not mandate type promotion (says "verify presence; promote to `Place` with description if missing"). Recommended: keep as `City` and add a `description` field, or upgrade to `Place` with a 1-line description like "Residential community east of Ash Fork on I-40". |
| AEO-04 | `public/llms.txt` and `public/llms-full.txt` show Monday OPEN and add 5 new sections | "llms.txt convention" — spec is loose; existing file uses freeform H2 prose sections (which is technically off-spec but consistent). Match existing `## Operating Hours` / `## Menu Highlights` style. |
| AEO-05 | `src/layouts/Layout.astro` injects `FAQSchema` on `/` in addition to `/faq/` | "Existing State > Layout.astro" — line 121 has `currentPath.startsWith('/faq')`. Recommended one-line change: `(currentPath === '/' \|\| currentPath.startsWith('/faq')) && <FAQSchema />`. No prop refactor needed — keeps gate centralized per CONTEXT specifics. Single FAQPage block per page is required by Google (Rank Math docs); both pages will emit one each — no conflict. |
| AEO-06 | `src/pages/index.astro` renders visible 8-Q FAQ + SpeakableSpecification | "Code Examples > SpeakableSpecification" — mirror `near-grand-canyon.astro:210–221` pattern. Use stable IDs (`#home-faq`) and class-name conventions (`.speakable-heading`, `.speakable-lead`) — not Tailwind utility classes. Inject as separate `<script type="application/ld+json">` block at end of `<Layout>` slot. |
| AEO-07 | `src/data/faq.json` ≥34 entries, every entry passes 50-word audit | "FAQ Inventory Analysis" — current 21 entries audited word-by-word; longest is 43 words (#8 LA→GC); all already pass. New entries must stay ≤50w. |
| AEO-08 | New `src/pages/near-williams.astro` mirroring `near-grand-canyon.astro`, added to `.lighthouserc.json` | "near-williams.astro Substitution Table" — exhaustive line-by-line diff produced below. Sitemap auto-discovers via `@astrojs/sitemap` integration (verified in `astro.config.mjs:19`). Footer.astro Explore list at lines 67–92 has 3 hardcoded entries — manual addition needed. |
| AEO-09 | `scripts/aeo-audit.mjs` adds 3 new gates (FAQ count, llms.txt sections, robots.txt AI-bot allows) | "AEO Audit Script Pattern" — current script is 56 lines, imperative, uses `errors++` and `process.exit(1)`. Match style. New gates as additional `try/catch` blocks. |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

These directives override default behavior and the planner MUST honor them:

- **Astro 5 static site** — all schema rendered at build time, no SSR. AI crawlers fetch HTML from `dist/`.
- **TailwindCSS v4 CSS-first config** — no `tailwind.config.mjs`; tokens live in `src/styles/globals.css`.
- **No hard borders** between sections/cards — visual separation via `bg-surface-container` tonal shifts only.
- **Glass budget already at limit** — DO NOT add new `backdrop-blur` consumers. The new home FAQ section MUST use `bg-surface-container` (or sibling), NOT `glass`/`glass-card`.
- **Orange budget** — no new orange UI elements; primary-container only on existing CTA contexts.
- **Typography** — `font-display` (Manrope) for headings; `font-sans` (Inter) for body. Use existing `text-display-md`, `text-heading-lg`, `text-heading-md`, `text-body-lg`, `text-body-md`, `text-label-sm` utilities.
- **Import alias** `@/*` resolves to `src/*`.
- **Conventional commits enforced** — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Pre-push hook runs `npm run qa` (build + test:quality + test:lhci). Do not bypass with `--no-verify`.
- **Lighthouse thresholds** — must not regress LCP < 4000ms, TBT < 600ms, CLS < 0.105, A11y ≥ 90, BP ≥ 80, SEO ≥ 90.
- **Schema components are single source of truth alongside data files** — when changing menu/hours/contact, both data file AND `schema/*.astro` must update.

## Standard Stack

Phase 11 introduces **zero new dependencies**. Everything we need is already installed.

### Core (already installed — versions verified in `package.json`)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | ^5.17.1 | Static site generator | Existing; zero-JS components |
| `schema-dts` | ^1.1.5 | TypeScript types for schema.org | Already used in all 6 schema components; types `paymentAccepted`, `acceptsReservations`, `amenityFeature`, `LocationFeatureSpecification`, `SpeakableSpecification` natively |
| `@astrojs/sitemap` | ^3.7.0 | Auto-generates sitemap from `src/pages/` | Will auto-pick up `near-williams.astro` — no config change needed |
| `@lhci/cli` | ^0.15.1 | Lighthouse CI runner | `.lighthouserc.json` URL list driven |

### Supporting (already installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `tailwindcss` | ^4.2.2 | Styling (M3 tokens via globals.css) | New FAQ section + new GEO page |
| `lucide-react` | ^0.563.0 | Icons (Footer uses `Clock`, `MapPin`, `Phone`) | If new FAQ section wants an icon, use existing pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-typed JSON-LD | `schema-dts` typed objects | Already adopted — keep using `WithContext<Restaurant>` and `WithContext<FAQPage>`. Don't drop down to raw JSON for new fields. |
| Single FAQSchema block on home | Per-page subset block | Existing `near-grand-canyon.astro` shows the per-page subset pattern (3 curated questions). Home page should use the GLOBAL `FAQSchema.astro` (which renders ALL faq.json) per CONTEXT decision — visible 8-Q section is a curated DOM subset; the schema is the full set. This is fine because Google's FAQ duplicate-field error fires on multiple `FAQPage` blocks on the same page, not the same content across pages. |

**Installation:** None. Zero new packages.

**Version verification:** All packages are pinned in `package.json` (verified directly). No npm registry queries needed.

## Architecture Patterns

### Existing Schema Injection Pattern (already follows this)
```
src/layouts/Layout.astro (slot footer)
  ├─ <RestaurantSchema />     ← always injects
  ├─ <FAQSchema />            ← currently gated to /faq/* (line 121) — broaden to / + /faq/*
  ├─ <MenuSchema />           ← always
  ├─ <OrganizationSchema />   ← always
  ├─ <WebSiteSchema />        ← always
  └─ <BreadcrumbSchema />     ← computed from URL
```

Each schema component is a `.astro` file that:
1. Imports types from `schema-dts`
2. Builds a typed `WithContext<T>` object
3. Renders `<script is:inline type="application/ld+json" set:html={JSON.stringify(schema)} />`

**Add new fields by extending the existing `schema` object literal in `RestaurantSchema.astro` between lines 18–109** — do not create a new component.

### Pattern 1: Page-specific inline JSON-LD (mirror existing precedent)
**What:** A static `<script type="application/ld+json">` block placed inside the page's `<Layout>` slot, AFTER `</main>`, with hardcoded JSON.
**When to use:** Per-page FAQ subset, per-page WebPage `speakable` declaration, per-page page-specific schema.
**Example:**
```astro
---
// Source: src/pages/near-grand-canyon.astro:177–221 (verified)
import Layout from '../layouts/Layout.astro';
---
<Layout>
  <main>...</main>

  <!-- Page-specific inline FAQ schema (separate from global FAQSchema) -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [...]
    }
  </script>

  <!-- Speakable schema markup -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Page Name",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-heading", ".speakable-lead", ".speakable-hours"]
      }
    }
  </script>
</Layout>
```

### Pattern 2: Speakable target classes
The project's convention (verified across `near-grand-canyon.astro` and `directions.astro`):
- `.speakable-heading` — H1 of the page
- `.speakable-lead` — first lead paragraph
- `.speakable-hours` / `.speakable-exit` — page-specific extra anchors

**These are plain class names with no Tailwind output** (verified: not in `globals.css`, just CSS hooks for the cssSelector array). They are stable because they're not utility classes.

For the home FAQ block, recommended cssSelector list:
```
"cssSelector": ["#home-faq h3", "#home-faq p"]
```
This targets each question (h3) and its answer (p) by ID-scoped descendant selector. ID `home-faq` will not be regenerated by Tailwind.

### Pattern 3: Mirroring near-grand-canyon.astro for near-williams.astro
**Approach:** Copy file → substitute strings → no structural changes.

The page already follows the canonical AEO/GEO template:
- Answer-first H1 with city-distance keyword
- Speakable lead paragraph
- Standalone Exit 146 sentence (voice-extractable)
- Why Stop Here
- Distance from Nearby Cities
- What to Order (4 dishes + Garlic Naan)
- Hours
- Cross-links section
- Inline FAQ schema (3 questions)
- Speakable schema

### Anti-Patterns to Avoid
- **DO NOT** add `glass`/`glass-card` to the home FAQ section — glass budget at limit per CLAUDE.md. Use `bg-surface-container` cards.
- **DO NOT** introduce a new schema component file. Add fields to the existing `RestaurantSchema.astro`.
- **DO NOT** target Tailwind utility classes (`.text-body-lg`, `.text-display-md`, etc.) in `cssSelector` arrays — they may rename across Tailwind v4 minor releases. Use IDs and stable hand-named classes only.
- **DO NOT** add a second `<FAQPage>` block on the home page (Google penalizes "duplicate FAQPage" within a single page, not across pages of the same site). The global `FAQSchema.astro` is enough.
- **DO NOT** invent payment methods, amenities, or reservation policy. The plan must block on the owner-confirmation checklist.
- **DO NOT** auto-fix `servesCuisine` (deferred — separate quick task).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| schema.org TypeScript types | Hand-typed `interface Restaurant` | `import type { Restaurant, WithContext, FAQPage, SpeakableSpecification, LocationFeatureSpecification } from 'schema-dts'` | Already installed, fully types every field this phase needs |
| FAQ→JSON-LD mapping | Inline JSON in HTML | Existing `src/components/schema/FAQSchema.astro` — already maps `faq.json → mainEntity[]` | One source of truth; new entries auto-flow |
| Sitemap generation for new GEO page | Manual sitemap edit | `@astrojs/sitemap` integration in `astro.config.mjs` auto-scans `src/pages/` | Verified — already in config, no manual sitemap entry needed |
| Page word-count audit | Manual review | Existing `scripts/aeo-audit.mjs` 50-word voice gate already runs on every entry | Pre-push hook enforces it; just ensure new entries pass |
| Breadcrumb schema for new page | Hand-rolled BreadcrumbList | Existing `BreadcrumbSchema.astro` in Layout — auto-generates from path | `near-williams` will get `Home > Near Williams` automatically |

**Key insight:** The codebase already has a clean pattern for every requirement in this phase. The temptation to "just add a quick JSON-LD block" should be resisted in favor of extending the typed schema components. The one exception (allowed precedent): per-page inline `<script type="application/ld+json">` blocks for page-specific FAQ subsets and SpeakableSpecification — these are page-local and not worth componentizing.

## Common Pitfalls

### Pitfall 1: Monday hours drift returns
**What goes wrong:** Updating only `RestaurantSchema.astro` and forgetting `public/llms.txt:13`, `public/llms.txt:37` (FAQ block), or `public/llms-full.txt:18`.
**Why it happens:** Three separate files, no single source of truth — only the AEO audit catches FAQ word counts, not hours-data drift.
**How to avoid:** Plan task explicitly lists ALL FOUR locations to update (lines 32–53 in RestaurantSchema, lines 13/37 in llms.txt, line 18 in llms-full.txt). Verification step: `grep -i 'monday\|mon:' public/llms.txt public/llms-full.txt src/components/schema/RestaurantSchema.astro` should produce zero hits saying "closed".
**Warning signs:** Any "Closed" in proximity to "Monday" / "Mon" after edits.

### Pitfall 2: Tailwind utility classes in cssSelector
**What goes wrong:** Using `.text-body-lg` or `.text-heading-lg` as the SpeakableSpecification anchor — Tailwind v4 utility names can change with minor versions.
**Why it happens:** Convenient — those classes are already on the elements.
**How to avoid:** ALWAYS use IDs (`#home-faq`) or stable hand-named classes (`.speakable-heading`) introduced specifically as schema anchors.
**Warning signs:** `cssSelector` array contains a class starting with `text-`, `bg-`, `flex`, `grid`, etc.

### Pitfall 3: FAQPage duplicate field error
**What goes wrong:** Home page emits one FAQPage from `FAQSchema.astro` (full 34 entries) AND another inline FAQPage block (curated 8). Google flags "Duplicate field FAQPage".
**Why it happens:** Per-page subset pattern (used on `near-grand-canyon.astro`) is appropriate for pages NOT in Layout's gate. Home page is being added to the gate, so the global block already fires there.
**How to avoid:** On the home page, do NOT add an inline `FAQPage` script — only the SpeakableSpecification block. The global `<FAQSchema />` (broadened gate) supplies the FAQPage. Visible 8-Q DOM is independent of which JSON-LD block emits.
**Warning signs:** Home page HTML in `dist/index.html` shows two `"@type":"FAQPage"` strings.

### Pitfall 4: Sitemap missing the new GEO page
**What goes wrong:** Forgot to verify `dist/sitemap-0.xml` contains `/near-williams/` after build.
**Why it happens:** The integration auto-discovers, but some configurations exclude pages.
**How to avoid:** Verification step — after `npm run build`, grep `dist/sitemap-0.xml` for `near-williams`.
**Warning signs:** Page exists at `/near-williams/` but not in sitemap (search engines won't crawl it efficiently).

### Pitfall 5: 50-word voice audit failure on new entries
**What goes wrong:** Drafting an answer that is informative but exceeds 50 words — `npm run test:aeo` fails, blocking pre-push.
**Why it happens:** Highway/voice guidance and proximity facts naturally want detail.
**How to avoid:** Author each new answer at ≤45 words to leave headroom. Pattern: 1 lead sentence with the answer + 1 clarifying sentence with directions. Existing 21 entries average 30 words — reuse the cadence.
**Warning signs:** Any draft over 45 words; multi-sentence preambles before the answer.

### Pitfall 6: Adding glass to the new FAQ section
**What goes wrong:** New `bg-surface-container` cards "feel flat" → developer adds `backdrop-blur-sm` → glass budget violation.
**Why it happens:** CLAUDE.md restriction is easy to forget.
**How to avoid:** Plan task explicitly references "use `bg-surface-container` + `rounded-2xl` (mirror `near-grand-canyon.astro` What-to-Order cards) — NO `backdrop-blur`".
**Warning signs:** Any `backdrop-blur` or `glass-card` class in new home FAQ markup.

### Pitfall 7: Owner-confirmation forgotten
**What goes wrong:** Plan executor invents `paymentAccepted: "Cash, Visa, MC, Amex, Discover, Apple Pay, Google Pay"` without owner sign-off, ships incorrect data.
**Why it happens:** "Standard restaurant set" feels safe to assume.
**How to avoid:** Wave-1 BLOCKING task: produce a `OWNER-CONFIRMATION.md` checklist in the phase directory with empty fields for the owner to fill in. Executor reads the filled checklist before applying values.
**Warning signs:** Any task in the plan that hardcodes `paymentAccepted` / `acceptsReservations` / amenity values without referencing the owner-confirmation file.

### Pitfall 8: Spice-level FAQ duplicate
**What goes wrong:** New entry #11 "Can I customize how spicy my food is at Spice Grill & Bar?" is added — but the existing `faq.json:50–53` already has that exact question.
**Why it happens:** CONTEXT.md flags this and recommends rewording, but it's easy to miss.
**How to avoid:** Use the alternative phrasing from CONTEXT: "Can I order mild Indian food at Spice Grill & Bar?" — different question, different angle (mild-only request vs. customization range).
**Warning signs:** Two FAQ entries with overlapping question patterns.

## Code Examples

Verified patterns from official sources and existing project files:

### Adding `paymentAccepted`, `acceptsReservations`, `amenityFeature` to RestaurantSchema
```typescript
// Source: schema-dts type defs (node_modules/schema-dts/dist/schema.d.ts:5190, :3873, :3814)
// Edit: src/components/schema/RestaurantSchema.astro between lines 92 (aggregateRating) and 99 (hasMap)

const schema: WithContext<Restaurant> = {
  // ...existing fields...

  // schema-dts: paymentAccepted is SchemaValue<Text> — comma-separated string
  // Owner-confirmation gate applies. Placeholder shape:
  paymentAccepted: 'Cash, Credit Card, Debit Card, Apple Pay, Google Pay',

  // schema-dts: acceptsReservations is SchemaValue<Boolean | Text | URL>
  // Prefer boolean per Google docs. Owner confirms true|false.
  acceptsReservations: true,

  // schema-dts: amenityFeature is SchemaValue<LocationFeatureSpecification[]>
  // Pattern: name + value:boolean per schema.org examples
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wheelchair accessible entrance', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Indoor seating', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Outdoor seating', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Family-friendly', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
  ],
};
```

### Fixing Monday in `openingHoursSpecification`
```typescript
// Source: src/components/schema/RestaurantSchema.astro:32–53 (current, missing Monday)
// Replace lines 32–53 with:
openingHoursSpecification: [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'https://schema.org/Monday',     // ← ADDED
      'https://schema.org/Tuesday',
      'https://schema.org/Wednesday',
      'https://schema.org/Thursday',
    ],
    opens: '08:00',
    closes: '21:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'https://schema.org/Friday',
      'https://schema.org/Saturday',
      'https://schema.org/Sunday',
    ],
    opens: '08:00',
    closes: '22:00',
  },
],
```

### Broadening the FAQSchema gate
```astro
// Source: src/layouts/Layout.astro:121
// Replace:
//   {currentPath.startsWith('/faq') && <FAQSchema />}
// With:
{(currentPath === '/' || currentPath.startsWith('/faq')) && <FAQSchema />}
```

### Home page FAQ section + SpeakableSpecification
```astro
---
// Source: pattern derived from src/pages/near-grand-canyon.astro:210–221 + Hero/OurStory cards
// Add inside src/pages/index.astro <main> AFTER OurStorySection or before Reviews (planner picks)
import faqData from '../data/faq.json';

// Curated 8 entries optimized for highway/voice (see "FAQ Inventory Analysis" below)
const homeFaqIndices = [14, 2, 3, 13, 10, /* 3 more — see analysis */];
const homeFaq = homeFaqIndices.map(i => faqData[i]);
---
<section id="home-faq" class="py-20 px-6 bg-surface-container-low">
  <div class="max-w-4xl mx-auto">
    <h2 class="text-display-md text-on-surface text-center mb-12">
      Common <span class="text-primary-container">Questions</span>
    </h2>
    <div class="space-y-4">
      {homeFaq.map(item => (
        <div class="bg-surface-container p-8 rounded-2xl">
          <h3 class="text-heading-md text-on-surface mb-3">{item.question}</h3>
          <p class="text-body-md text-on-surface-variant">{item.answer}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<!-- After </main>, inside <Layout>: -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Spice Grill & Bar",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["#home-faq h3", "#home-faq p"]
    }
  }
</script>
```

**Note:** No inline `FAQPage` block on the home page — the global `<FAQSchema />` (now gated to fire on `/`) provides it.

### llms.txt Monday fix + new sections
```diff
# Source: public/llms.txt:13
-- **Mon**: Closed
-- **Tue - Thu**: 8:00 AM - 9:00 PM
-- **Fri - Sun**: 8:00 AM - 10:00 PM
++ **Mon - Thu**: 8:00 AM - 9:00 PM
++ **Fri - Sun**: 8:00 AM - 10:00 PM

# Source: public/llms.txt:36–37
-Q: What are the operating hours?
-A: Tuesday-Thursday 8:00 AM - 9:00 PM, Friday-Sunday 8:00 AM - 10:00 PM. Closed Mondays.
+Q: What are the operating hours?
+A: Monday-Thursday 8:00 AM - 9:00 PM, Friday-Sunday 8:00 AM - 10:00 PM.

# After "## Frequently Asked Questions" block, ADD:
+## Payment Methods
+Spice Grill & Bar accepts cash, all major credit cards, debit cards, Apple Pay, and Google Pay.
+(Owner-confirmation pending — placeholder)
+
+## Reservation Policy
+Walk-ins welcome. Phone reservations accepted at (928) 277-1292.
+(Owner-confirmation pending — placeholder)
+
+## Delivery & Takeout
+Takeout, pickup, and curbside service available. Order online via Toast at https://order.toasttab.com/online/spice-grill-bar-33-lewis-ave or call (928) 277-1292. We do not offer in-house delivery.
+
+## Amenities
+- On-site car and motorcycle parking
+- RV/truck parking across the road at the truck stop
+- Wheelchair accessible entrance
+- Indoor and outdoor seating
+- Family-friendly
+- Free Wi-Fi
+(Owner-confirmation pending — placeholder)
+
+## Dietary Options
+Vegetarian and vegan options available, including Shahi Paneer, Dal Tadka, Aloo Gobhi, and Chana Masala. Spice level customizable from mild to extra hot.
```

(Same edits for `public/llms-full.txt` line 18 + new sections — see CONTEXT.md for canonical placement.)

### AEO audit script — new gates
```javascript
// Source: extend scripts/aeo-audit.mjs (current is 56 lines)
// Add AFTER the existing FAQ word-count loop (after line 38):

// 1.5. FAQ Count Gate (≥34 entries required)
if (faqData.length < 34) {
  console.error(`❌ FAQ count is ${faqData.length}, expected ≥34`);
  errors++;
} else {
  console.log(`✅ FAQ count: ${faqData.length} entries (target ≥34)`);
}

// 2.5. llms.txt Section Gate
if (fs.existsSync(LLMS_TXT_PATH)) {
  const llmsContent = fs.readFileSync(LLMS_TXT_PATH, 'utf-8');
  const requiredSections = [
    '## Payment Methods',
    '## Reservation Policy',
    '## Delivery',     // matches "## Delivery & Takeout"
    '## Amenities',
    '## Dietary',      // matches "## Dietary Options"
  ];
  const missing = requiredSections.filter((s) => !llmsContent.includes(s));
  if (missing.length > 0) {
    console.error(`❌ llms.txt missing required sections: ${missing.join(', ')}`);
    errors++;
  } else {
    console.log('✅ llms.txt contains all required sections.');
  }
}

// 3. robots.txt AI-bot Allowlist Gate
const ROBOTS_PATH = path.join(ROOT_DIR, 'public/robots.txt');
if (fs.existsSync(ROBOTS_PATH)) {
  const robotsContent = fs.readFileSync(ROBOTS_PATH, 'utf-8');
  const requiredBots = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'];
  for (const bot of requiredBots) {
    // Match `User-agent: <bot>` followed by `Allow: /` (with optional whitespace/comments between)
    const re = new RegExp(`User-agent:\\s*${bot}\\s*\\n(?:#[^\\n]*\\n)*Allow:\\s*/`, 'i');
    if (!re.test(robotsContent)) {
      console.error(`❌ robots.txt: ${bot} missing Allow: / directive`);
      errors++;
    } else {
      console.log(`✅ robots.txt: ${bot} allowed.`);
    }
  }
} else {
  console.error('❌ robots.txt missing in public/');
  errors++;
}
```

## FAQ Inventory Analysis (current 21 entries — word counts verified)

| # | Question | Words | Best for home? |
|---|----------|-------|---------------|
| 0 | Is there an Indian restaurant near the Grand Canyon? | 35 | ⭐ YES — top voice query |
| 1 | Is Spice Grill & Bar a good I-40 food stop in Arizona? | 38 | ⭐ YES — highway voice query |
| 2 | Where is Spice Grill & Bar located? | 33 | ⭐ YES — fundamental |
| 3 | How far is Spice Grill & Bar from the Grand Canyon? | 33 | ⭐ YES — proximity |
| 4 | Where to eat between Las Vegas and the Grand Canyon? | 35 | maybe |
| 5 | Where to eat between Flagstaff and the Grand Canyon? | 33 | maybe |
| 6 | Where to eat on the way from Phoenix to the Grand Canyon? | 33 | maybe |
| 7 | Where to eat between Kingman and the Grand Canyon? | 35 | maybe |
| 8 | Where to eat between Los Angeles and the Grand Canyon? | 43 | no — long-tail |
| 9 | What type of food does Spice Grill & Bar serve? | 29 | ⭐ YES — fundamental |
| 10 | What are the most popular dishes at Spice Grill & Bar? | 26 | ⭐ YES — signature dish |
| 11 | What should I order if I've never had Indian food before? | 28 | yes — first-timer voice |
| 12 | Can I customize how spicy my food is at Spice Grill & Bar? | 33 | depends on new entry |
| 13 | Does Spice Grill & Bar have vegetarian or vegan options? | 30 | ⭐ YES — dietary voice |
| 14 | What are the operating hours for Spice Grill & Bar? | 14 | ⭐ YES — top voice query |
| 15 | Do you offer takeout or delivery services? | 22 | ⭐ YES — operations |
| 16 | Can I order ahead from Williams or Seligman? | 34 | maybe |
| 17 | Is there parking available at Spice Grill & Bar? | 34 | yes — RV/truck travelers |
| 18 | Is Spice Grill & Bar biker-friendly? | 28 | maybe — Route 66 voice |
| 19 | Does Spice Grill & Bar serve alcohol? | 25 | yes — operations |
| 20 | Is Spice Grill & Bar kid-friendly or family-friendly? | 23 | yes — family voice |

**Recommended 8 home-page subset (highway/voice optimized):**
1. #14 Operating hours (14w — perfect voice clip)
2. #2 Where located (33w — fundamental)
3. #3 How far from Grand Canyon (33w — top proximity)
4. #13 Vegetarian/vegan options (30w — dietary)
5. #10 Most popular dishes (26w — signature)
6. #1 Good I-40 food stop (38w — highway hook)
7. #15 Takeout/delivery (22w — operations)
8. **NEW** Williams proximity OR payment methods (from new 13 entries — Williams has stronger voice/highway pull) — once added at index 21+, swap in.

The planner has discretion to swap one of these for a NEW entry on payment methods or reservations once those entries land — the 8 above are a solid baseline.

**Duplicate watch (CONTEXT decision applies):**
- Existing #12 (spice customization) overlaps with proposed new entry #11 (spice level customization) — use CONTEXT-recommended rephrase: "Can I order mild Indian food at Spice Grill & Bar?"
- Existing #10 (most popular dishes) mentions Butter Chicken — proposed new entry #9 (signature Butter Chicken) needs a different angle: e.g., "Is Spice Grill & Bar known for Butter Chicken?" or "What is Spice Grill & Bar's signature dish?"
- Existing #11 (first-timer recommendation) mentions Tandoori Chicken — proposed new entry #10 (Tandoori specialties) should ask the menu/preparation angle: "Does Spice Grill & Bar have Tandoori dishes?"
- Existing #15 (takeout or delivery) lightly overlaps with proposed new entries #6 (delivery only) and #7 (takeout only) — disambiguate by asking each independently and giving a focused answer.

## near-williams.astro Substitution Table

When mirroring `src/pages/near-grand-canyon.astro` to `src/pages/near-williams.astro`, the following exact substitutions are required. ALL OTHER STRUCTURE STAYS IDENTICAL.

| Source location | Old string | New string |
|---|---|---|
| L6 (`title`) | `Indian Restaurant Near Grand Canyon \| About 78 Miles — Spice Grill & Bar` | `Indian Restaurant Near Williams, AZ — Spice Grill & Bar (~18 Miles East via I-40)` |
| L7 (`description`) | `Spice Grill & Bar in Ash Fork, AZ is about 78 miles from the Grand Canyon South Rim — roughly 1 hour 20 minutes via I-40 Exit 146. Authentic Punjabi Indian cuisine on Route 66.` | `Spice Grill & Bar is about 18 miles east of Williams, AZ on I-40 Exit 146 — roughly 18 minutes. Authentic Punjabi Indian cuisine on historic Route 66.` |
| L8 (`ogTitle`) | `Indian Restaurant Near Grand Canyon — Spice Grill & Bar` | `Indian Restaurant Near Williams, AZ — Spice Grill & Bar` |
| L9 (`ogDescription`) | `About 78 miles from Grand Canyon South Rim. Authentic Punjabi cuisine at I-40 Exit 146 in Ash Fork, AZ.` | `About 18 miles east of Williams, AZ. Authentic Punjabi cuisine at I-40 Exit 146 in Ash Fork, AZ.` |
| L15–17 (H1) | `Spice Grill & Bar — About 78 Miles from Grand Canyon South Rim` | `Spice Grill & Bar — About 18 Miles East of Williams, AZ` |
| L20–24 (lead `.speakable-lead`) | `Spice Grill & Bar is located in Ash Fork, Arizona, about 78 miles south of the Grand Canyon South Rim — roughly 1 hour and 20 minutes via AZ-64 South and I-40 Exit 146. It is the closest Indian restaurant to the Grand Canyon on the I-40 corridor.` | `Spice Grill & Bar is located in Ash Fork, Arizona, about 18 miles east of Williams via I-40 East — roughly 18 minutes to Exit 146. It is the closest Indian restaurant to Williams and Kaibab Estates West on the I-40 corridor.` |
| L27–29 (Exit sentence) | `Spice Grill & Bar is located at I-40 Exit 146 in Ash Fork, Arizona.` | (unchanged — exact string) |
| L36–40 ("Why Stop Here" body) | (Williams-and-Seligman generic prose) | "Spice Grill & Bar is the closest authentic Indian restaurant to Williams, the gateway to the Grand Canyon Railway, and to Kaibab Estates West, a residential community ~5 miles east of Ash Fork. Whether you're catching the train to the Canyon or live nearby, our tandoor cooking and freshly baked naan are about 18 minutes east on I-40 Exit 146." |
| L46–80 ("Distance from Nearby Cities") | 8 city paragraphs | New ordering for Williams audience: Williams (18 mi), Kaibab Estates West (~5 mi), Grand Canyon South Rim (78 mi), Flagstaff (51 mi), Seligman (25 mi). Drop Phoenix/Las Vegas/LA paragraphs (less relevant for Williams audience). |
| L85–137 ("What to Order") | 4 dishes + Garlic Naan | Keep identical (Fish Pakora, Butter Chicken, Shahi Paneer, Chicken Biryani, Garlic Naan) |
| L141–146 (Hours) | (unchanged) | `Spice Grill & Bar is open Monday through Thursday from 8 AM to 9 PM, and Friday through Sunday from 8 AM to 10 PM.` (verify Monday OPEN — propagate the AEO-01 fix here too) |
| L154–158 (Plan Your Visit / Driving Directions link) | `Driving directions to Spice Grill & Bar from 7 cities` | (unchanged, or specify "from Williams and Kaibab Estates West") |
| L177–208 (Inline FAQ schema 3 questions) | Grand Canyon FAQ trio | Replace with 3 Williams-relevant questions: (1) "How far is Spice Grill & Bar from Williams, AZ?" (2) "Is there an Indian restaurant near Kaibab Estates West?" (3) "What is the best Indian restaurant near Williams, AZ on I-40?" — answers ≤50 words each |
| L213–220 (SpeakableSpecification) | `"name": "Indian Restaurant Near Grand Canyon"` | `"name": "Indian Restaurant Near Williams, AZ"` (cssSelector array unchanged: `[".speakable-heading", ".speakable-lead", ".speakable-hours"]`) |

**Side effects (verified):**
- `astro.config.mjs:19` — `sitemap()` integration auto-discovers new pages. **No change needed.** Verify post-build that `dist/sitemap-0.xml` contains `near-williams`.
- `.lighthouserc.json:5` — `url: ["/", "/near-grand-canyon/", "/directions/", "/faq/"]` — **MUST add** `"/near-williams/"`.
- `src/components/Footer.astro:67–92` — Explore section has hardcoded list (Near Grand Canyon, Directions, FAQ). **MUST add** `"/near-williams/"` link entry between Near Grand Canyon and Directions.
- `BreadcrumbSchema.astro` (auto-injected via Layout) — uses `slugToLabel("near-williams")` → "Near Williams". **No change needed.** Verified via `Layout.astro:125–129`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Mixed: `npm run test:aeo` (custom Node script in `scripts/aeo-audit.mjs`), Lighthouse CI (`@lhci/cli` 0.15.1), `astro check` for typecheck, ESLint for lint, Playwright 1.58.2 for e2e (animation tests only — not used here) |
| Config files | `scripts/aeo-audit.mjs`, `.lighthouserc.json`, `eslint.config.*`, `playwright.config.ts` |
| Quick run command | `npm run test:aeo` (single Node script, ~2s) |
| Full suite command | `npm run qa` (build + lint + knip + typecheck + test:aeo + test:lhci) — runs on pre-push hook |
| Phase gate | `npm run qa` green before `/gsd:verify-work` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AEO-01 | Monday OPEN in schema; no drift across 3 files | grep on built HTML | `npm run build && grep -c '"https://schema.org/Monday"' dist/index.html` (expect ≥1) and `grep -i 'mon[a-z]*: closed\|monday: closed\|closed mondays' public/llms.txt public/llms-full.txt` (expect 0) | ✅ existing audit + new grep |
| AEO-02 | paymentAccepted + acceptsReservations + amenityFeature in schema | grep on built HTML | `npm run build && grep -E '"paymentAccepted"\|"acceptsReservations"\|"amenityFeature"' dist/index.html \| wc -l` (expect ≥3) | ✅ |
| AEO-03 | Kaibab Estates West in areaServed (already present — verify upgrade if planner chooses) | grep | `grep -A1 '"Kaibab Estates West"' dist/index.html` | ✅ |
| AEO-04 | llms.txt + llms-full.txt show Monday open + 5 new sections | aeo-audit.mjs new gate | `npm run test:aeo` | ✅ existing script extended |
| AEO-05 | FAQSchema fires on `/` | grep on built HTML | `npm run build && grep -c '"@type":"FAQPage"' dist/index.html` (expect ≥1) | ✅ |
| AEO-06 | Visible 8-Q FAQ section + SpeakableSpecification on `/` | grep | `grep -c 'id="home-faq"' dist/index.html` (expect 1); `grep -c 'SpeakableSpecification' dist/index.html` (expect ≥1); `grep -c '"#home-faq h3"' dist/index.html` (expect 1) | ✅ |
| AEO-07 | faq.json has ≥34 entries; all pass 50-word audit | aeo-audit.mjs new gate + existing | `npm run test:aeo` (covers both count and word audit) | ✅ |
| AEO-08 | `/near-williams/` builds, has canonical, in sitemap, in lhci config | build + grep | `npm run build && test -f dist/near-williams/index.html && grep -c '<link rel="canonical"' dist/near-williams/index.html` (expect 1); `grep -c 'near-williams' dist/sitemap-0.xml` (expect 1); `grep -c 'near-williams' .lighthouserc.json` (expect 1) | ✅ |
| AEO-09 | Audit script fails (exit 1) when intentionally broken | manual fail-injection | Temporarily delete a `## Payment Methods` line from llms.txt → `npm run test:aeo` should print error and exit 1, then restore | ⚠️ Manual smoke test — recommended once during plan execution |

### Sampling Rate
- **Per task commit:** `npm run test:aeo` (covers FAQ counts, llms.txt sections, robots.txt allows, voice word audit — ~2s)
- **Per wave merge:** `npm run build && npm run test:aeo` (adds full Astro build to surface schema rendering errors)
- **Phase gate:** Full `npm run qa` (build + test:quality + test:lhci) green before `/gsd:verify-work`. Pre-push hook enforces this on commit anyway.

### Recommendations beyond `npm run test:aeo`
- **Lighthouse CI is required** — already configured. Adding `/near-williams/` to `.lighthouserc.json` ensures the new page meets thresholds.
- **Playwright is NOT needed** — no new interactive UI; existing animation tests cover Header/Sheet/MobileActionButtons.
- **JSON-LD validation** — recommend a one-time manual run through https://validator.schema.org or https://search.google.com/test/rich-results for `https://spicegrillbar66.com/` and `https://spicegrillbar66.com/near-williams/` after deploy. Not automated; document as a verify-work checklist item.
- **Owner-confirmation file** — recommend `OWNER-CONFIRMATION.md` in the phase directory with empty fields for the user to fill in. Wave-1 task blocks until file is filled.

### Subjective verification gaps (flag for human)
- **Curated 8-FAQ choice on home page** — "best 8" is judgment-based. The Inventory Analysis above proposes a defensible set, but the executor should not invent a different ordering without checking that the 8 are still highway/voice-optimized.
- **FAQ answer wording for new 13 entries** — "passes 50-word voice audit" is automated, but "sounds natural in a voice clip" is not. Pre-push hook enforces word count; voice-clip naturalness is owner judgment.
- **`paymentAccepted` exact string ordering** — schema.org accepts any comma-separated list. Owner confirms the SET; executor decides ordering (recommend most-common-first: cash → card → mobile pay).
- **`acceptsReservations` boolean vs URL** — if owner runs phone reservations only, boolean `true` is correct. If they add OpenTable/Resy later, switch to URL value. Plan stays with boolean for Phase 11.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FAQPage rich result on Google SERP | Deprecated for general sites; only government/health | Aug 2023 (Google blog) | FAQPage on home/faq page is now an AI/voice signal (ChatGPT, Gemini, Perplexity, Claude), NOT a Google rich result. Still valuable for AEO. |
| Speakable for everything | Limited to U.S. English news content | Beta since 2018 | Using SpeakableSpecification on a restaurant FAQ is technically off-spec, but project precedent (`near-grand-canyon.astro`, `directions.astro`) uses it. AI assistants outside Google may still parse it. We mirror existing project precedent. |
| llms.txt as freeform AI doc | Loosely speccd at llmstxt.org (single H1 required, H2 = link lists) | Sept 2024 spec posted | Existing `public/llms.txt` is technically off-spec (uses freeform H2 prose sections). Phase 11 continues this pattern for consistency — owner can re-spec in a future phase. |

**Deprecated/outdated:**
- **FAQPage rich result eligibility** — only government/health. Still emit for AI consumers. (Source: Google Search blog, Aug 2023.)
- **Hand-rolled JSON-LD** — schema-dts is the project standard. Don't drop down to hand-typed JSON for new fields.

## Open Questions

1. **What payment methods does the owner accept?**
   - What we know: typical restaurant sets include Cash, Visa, MC, Amex, Discover, debit, Apple Pay, Google Pay
   - What's unclear: exact list — need owner sign-off
   - Recommendation: Wave-1 OWNER-CONFIRMATION.md task blocks plan execution until filled

2. **Does the restaurant accept phone reservations or walk-in only?**
   - What we know: full-bar service, family-friendly atmosphere
   - What's unclear: reservation policy
   - Recommendation: same OWNER-CONFIRMATION.md gate; default placeholder `acceptsReservations: true` with `TODO(owner-verify)` comment

3. **Wi-Fi availability and exact amenity set**
   - What we know: parking on-site, biker-friendly, family-friendly per existing FAQ
   - What's unclear: Free Wi-Fi (yes/no), wheelchair accessible (yes/no), outdoor seating (yes/no)
   - Recommendation: same OWNER-CONFIRMATION.md gate; placeholder list with all 6 amenities = true and `TODO(owner-verify)` comment block

4. **Kaibab Estates West exact distance**
   - What we know: CONTEXT says ~5 miles east of Ash Fork on I-40 (~6 minutes); residential community
   - What's unclear: source citation — owner confirmation only
   - Recommendation: treat as confirmed (CONTEXT explicitly locks this); use 5 mi / 6 min

5. **Should home FAQ section live ABOVE or BELOW Reviews?**
   - What we know: Hero is LCP element; FAQ is below-the-fold content
   - What's unclear: best placement for engagement vs Lighthouse impact
   - Recommendation: place between MenuSection and OrderSection (existing flow: Hero → OurStory → Reviews → Menu → **FAQ** → Order → Location). Below LCP, not in critical render path. Planner confirms.

## Sources

### Primary (HIGH confidence)
- schema-dts type definitions — `node_modules/schema-dts/dist/schema.d.ts:5190` (`paymentAccepted`), `:3873` (`acceptsReservations`), `:3814` (`amenityFeature`), `:5199–5211` (`LocationFeatureSpecification`), `:9977–9987` (`SpeakableSpecification`) — verified directly
- schema.org/Restaurant — https://schema.org/Restaurant (verified `acceptsReservations: Boolean | URL | "Yes"|"No"`)
- schema.org/SpeakableSpecification — https://schema.org/SpeakableSpecification (verified shape: nests inside WebPage's `speakable` property)
- schema.org/LocationFeatureSpecification — https://schema.org/LocationFeatureSpecification (verified `name + value:boolean` pattern)
- schema.org/paymentAccepted — https://schema.org/paymentAccepted (verified: Text, comma-separated)
- Existing project files (read directly, line numbers cited above):
  - `src/components/schema/RestaurantSchema.astro`
  - `src/components/schema/FAQSchema.astro`
  - `src/data/faq.json`
  - `src/layouts/Layout.astro`
  - `src/pages/index.astro`
  - `src/pages/near-grand-canyon.astro`
  - `src/pages/directions.astro`
  - `src/pages/faq.astro`
  - `src/components/Footer.astro`
  - `public/llms.txt`
  - `public/llms-full.txt`
  - `public/robots.txt`
  - `scripts/aeo-audit.mjs`
  - `.lighthouserc.json`
  - `astro.config.mjs`
  - `package.json`

### Secondary (MEDIUM confidence)
- Google Search Central — Speakable structured data: https://developers.google.com/search/docs/appearance/structured-data/speakable (current status: BETA, U.S. English news only; we proceed by project precedent)
- Google Search Central blog — HowTo & FAQ rich result changes (Aug 2023): https://developers.google.com/search/blog/2023/08/howto-faq-changes
- llmstxt.org spec: https://llmstxt.org/ (loose spec; existing project file deviates; we maintain consistency)
- @astrojs/sitemap docs: https://docs.astro.build/en/guides/integrations-guide/sitemap/ (confirmed auto-discovery + trailingSlash:always behavior)

### Tertiary (LOW confidence — flag for validation)
- None. All findings above are verified against either schema-dts source or official schema.org/Google docs.

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — every required field is already typed in `schema-dts`, every required file already inspected, no new packages needed
- Architecture / file edits: **HIGH** — line-by-line file inspection grounds every recommendation
- SpeakableSpecification appropriateness: **MEDIUM** — Google has it limited to news in BETA; project already uses it on 2 GEO pages; AI assistants beyond Google may still parse it; we mirror existing precedent
- llms.txt section structure: **MEDIUM** — spec is loose; existing file is off-spec but consistent; we match existing style
- Pitfalls: **HIGH** — most are verified-by-grep against existing files (Monday drift count: 4 distinct strings across 3 files)
- Owner-confirmation values: **N/A** — explicitly blocked on user input by CONTEXT decision

**Research date:** 2026-05-05
**Valid until:** 2026-06-05 (schema.org and Google guidance is stable; revisit if Google updates Speakable status from BETA, or if llmstxt.org changes)

## RESEARCH COMPLETE
