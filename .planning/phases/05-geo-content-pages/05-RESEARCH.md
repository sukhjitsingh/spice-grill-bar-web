# Phase 5: GEO Content Pages - Research

**Researched:** 2026-02-21
**Domain:** Astro static content pages, AEO passage structure, geographic proximity content, Google Maps embed, schema.org WebPage
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Tone and AEO writing style are Claude's discretion — optimize for AI extraction while maintaining readability
- Route 66 / road-trip identity: mention briefly but don't make it the theme — focus stays on proximity and food
- Voice: mix of third person for factual/extractable paragraphs ("Spice Grill & Bar is 58 miles from...") and first person for softer sections like dish recommendations ("We recommend...")
- Page length: Claude's discretion — optimize for SEO/AEO performance
- Keep content focused on the restaurant — no local landmarks or area tourism beyond the restaurant itself
- CTAs: mobile-first approach, Claude decides what's best for AI engines
- Feature popular/most-ordered items for road-tripper dish recommendations
- Match homepage visual style: glassmorphism, dark/light sections, brand orange/green/gold accents
- Same full header and footer as homepage for consistent mobile navigation
- Minimal or no images — text-focused pages, keep page weight low and LCP fast
- Hero treatment: Claude's discretion based on performance and AEO (answer-first) needs
- Bold answer-first H1 stating distance and drive time from Grand Canyon South Rim (e.g., "Spice Grill & Bar — 58 Miles from Grand Canyon South Rim")
- Per-city distance facts covering same cities as /directions/: Las Vegas, Los Angeles, Flagstaff, Kingman, Phoenix, Williams, Seligman
- Each city distance as standalone extractable paragraph
- Dish recommendations: short list of 3-5 popular items with a one-liner description each
- Operating hours and contact info on page: Claude's discretion based on AEO best practices
- Per-city H2 sections for all 7 cities with turn-by-turn summaries emphasizing I-40 Exit 146
- Navigation between 7 city sections: Claude's discretion (anchor links vs. scroll)
- Google Maps embed strategy: Claude's discretion — optimize for LCP performance vs. relevance
- Turn-by-turn detail level: Claude's discretion for AEO and usability
- Drive time placement: Claude's discretion for maximum AEO extraction value
- Address block with NAP data in each section

### Claude's Discretion

- Overall content tone balance (warm vs. informational)
- AEO writing style for extractable paragraphs
- Hero section treatment (image hero vs. minimal header)
- Page content length
- CTA placement and style (optimized for mobile and AI engines)
- City section navigation pattern on /directions/
- Google Maps embed approach (single vs. per-city, placement)
- Turn-by-turn summary depth
- Drive time display placement (in headings vs. in text)
- Whether to include hours/contact on /near-grand-canyon/

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-04 | Create `/near-grand-canyon/` page with: answer-first H1 stating distance and drive time, per-city distance facts as standalone extractable `<p>` sentences, dish recommendations for road-trippers, internal links to `/directions/` and homepage, page-specific `<title>` and meta description, and OpenGraph tags | Verified distance/drive-time data gathered; AEO passage structure patterns documented; faq.json distance entries confirm existing data points; top-5 menu items by popularity identified; Layout.astro pattern for title/description/OG tags confirmed |
| CONT-05 | Create `/directions/` page with: per-city H2 sections (Las Vegas, Los Angeles, Flagstaff, Kingman, Phoenix, Williams, Seligman) each with turn-by-turn summary and "I-40 Exit 146" emphasized, `<address>` block with NAP data, Google Maps embed (`GoogleMap.tsx` with `client:visible`), and internal link to `/near-grand-canyon/` | GoogleMap.tsx component inspected and documented; NAP data confirmed from RestaurantSchema.astro; city H2 pattern identified from faq.astro; turn-by-turn I-40 Exit 146 language confirmed from existing faq.json |
</phase_requirements>

---

## Summary

Phase 5 creates two new Astro static pages: `/near-grand-canyon/` (CONT-04) and `/directions/` (CONT-05). Both are pure `.astro` files — no new React components, no new npm packages, no new schema components beyond what Layout.astro already injects globally. The primary work is content writing and HTML structure — Astro templating is straightforward because both `faq.astro` and `index.astro` provide direct structural templates to follow.

The key technical concern is Google Maps embed on `/directions/`. The existing `GoogleMap.tsx` component already handles lazy-loading via IntersectionObserver with `client:visible` and requires `PUBLIC_GOOGLE_MAPS_API_KEY` from env. This component should be reused as-is. For LCP performance, the map should be positioned below the fold so it does not block LCP. No images should appear above the fold on either page — text-only heroes keep LCP fast.

AEO content structure requires each city fact to be a standalone `<p>` element (not buried in a list or multi-sentence paragraph) so AI engines can extract individual passages. The existing faq.json entries provide a verified baseline for distance figures and I-40 Exit 146 language. New distances verified from multiple routing sources and are ready to embed.

**Primary recommendation:** Implement each page as a separate plan (05-01 for /near-grand-canyon/, 05-02 for /directions/). The pages are largely independent; /near-grand-canyon/ can cross-link to /directions/ before /directions/ exists (link just needs to be present in HTML; the page will exist after 05-02 runs).

---

## Verified Distance Data

All distances verified from multiple routing sources (distance-cities.com, travelmath.com, trippy.com) as of 2026-02-21. **These figures MUST be double-checked against Google Maps before publishing, per STATE.md blocker note.**

| City | Distance to Ash Fork | Drive Time | Primary Route |
|------|---------------------|------------|---------------|
| Grand Canyon South Rim | ~78 miles | ~1 hr 21 min | AZ-64 South → I-40 East → Exit 146 |
| Las Vegas, NV | ~200 miles | ~3 hours | I-40 East / US-93 S → I-40 → Exit 146 |
| Los Angeles, CA | ~414 miles | ~6 hours | I-40 East → Exit 146 |
| Flagstaff, AZ | ~51 miles | ~46 minutes | I-40 West → Exit 146 |
| Kingman, AZ | ~97 miles | ~1.5 hours | I-40 East → Exit 146 |
| Phoenix, AZ | ~144 miles | ~2 hr 41 min | I-17 North → I-40 West → Exit 146 |
| Williams, AZ | ~18 miles | ~18 minutes | I-40 West → Exit 146 |
| Seligman, AZ | ~25 miles | ~24 minutes | I-40 East → Exit 146 |

**Note:** The existing faq.json uses "~70 miles" for Grand Canyon distance (entry 1, 4) but routing sources show 78 miles. The discrepancy likely comes from different starting points within the park or approximation rounding. For page content, use "about 78 miles" or "about 80 miles" and note ~1 hour 20 minute drive time. Verify with Google Maps from the South Rim Visitor Center to 33 Lewis Ave, Ash Fork before publishing.

---

## Standard Stack

### Core (zero new installs required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Page file, Layout import, slot rendering | Project framework — both existing pages use this pattern |
| TailwindCSS | 3.x | Styling — glassmorphism, dark mode, responsive layout | Project CSS framework with brand tokens already configured |
| `schema-dts` | existing | TypeScript types for JSON-LD if page-specific schema needed | Already in project; Layout.astro injects global schemas |
| `GoogleMap.tsx` | existing | Lazy-loaded Google Maps embed with IntersectionObserver | Already built, already used in LocationSection.astro |

### Supporting (no new installs)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` | existing | Icons (MapPin, Phone, Clock) for NAP address block | Already used in Footer.astro and LocationSection.astro |
| `astro:assets` | built-in | Optimized images if any are added | Only if hero image is added — locked decision says minimal/no images |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GoogleMap.tsx (existing) | Static Google Maps embed URL | Existing component is already performance-optimized with lazy loading; don't duplicate |
| Plain `<address>` block | Repeated schema component | `<address>` HTML element is semantically correct for NAP on directions page; no new schema component needed |
| Single GoogleMap on /directions/ | Per-city map | One map showing the restaurant is sufficient; per-city maps would require multiple API calls and hurt performance |

**Installation:** No new packages. This phase uses zero new dependencies.

---

## Architecture Patterns

### Recommended Project Structure

```
src/pages/
├── index.astro            # Homepage (existing)
├── faq.astro              # FAQ page (existing, template reference)
├── near-grand-canyon.astro # NEW — Phase 5 plan 05-01
└── directions.astro        # NEW — Phase 5 plan 05-02
```

**Important:** Astro with `trailingSlash: 'always'` and `build.format: 'directory'` (confirmed in `astro.config.mjs`) automatically generates `dist/near-grand-canyon/index.html` from `src/pages/near-grand-canyon.astro` — the trailing slash URL `/near-grand-canyon/` works without any special configuration.

### Pattern 1: Astro Page with Layout

Both pages follow the exact same shell as `faq.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Page Title | Spice Grill & Bar"
  description="Page meta description."
>
  <main class="pt-32 pb-24 px-6 bg-zinc-50 dark:bg-black min-h-screen">
    <div class="max-w-4xl mx-auto">
      <!-- page content -->
    </div>
  </main>
</Layout>
```

`Layout.astro` accepts `title` and `description` props and uses them for `<title>`, `<meta name="description">`, and (currently) a static `og:url` and `og:title`. See OpenGraph section below for the OG tags issue.

### Pattern 2: OpenGraph Tags — Current Limitation

**Finding (MEDIUM confidence):** `Layout.astro` currently hardcodes `og:url` and `og:title` as static strings pointing to the homepage:

```astro
<meta property="og:url" content="https://spicegrillbar66.com" />
<meta property="og:title" content="Spice Grill & Bar | Authentic Punjabi Cuisine on Route 66" />
```

This means new pages do NOT automatically get page-specific OpenGraph tags unless Layout.astro is updated to use dynamic props or the page overrides them. CONT-04 requires "page-specific OpenGraph tags" per REQUIREMENTS.md.

**Recommended approach (Claude's Discretion):** Extend `Layout.astro` to accept optional `ogTitle`, `ogDescription`, and `ogUrl` props with fallback to current static values. This is a minimal change (3 additional optional props) that unblocks CONT-04 and benefits all future pages.

Alternatively, pages could inject OG tags directly into `<head>` using Astro's `<head>` slot if Layout.astro exposes one. Current Layout.astro does NOT expose a head slot — the prop extension approach is cleaner.

**Recommended Layout.astro prop extension:**
```astro
const {
  title = 'Spice Grill & Bar | ...',
  description = '...',
  ogTitle,
  ogDescription,
  ogUrl,
} = Astro.props;
```
Then use `ogTitle ?? title`, `ogDescription ?? description`, `ogUrl ?? 'https://spicegrillbar66.com'` in the OG meta tags.

### Pattern 3: AEO-Optimized Passage Structure

Per AEO research (verified from multiple 2025 sources including HubSpot, CXL, STS Digital Solutions): AI engines extract individual passages. Each city fact must be a **standalone, self-contained `<p>` element** that makes sense without surrounding context.

**AEO extractable paragraph format (for /near-grand-canyon/):**
```html
<p>
  Spice Grill &amp; Bar is 51 miles from Flagstaff — about 46 minutes west on I-40.
  Take Exit 146 in Ash Fork to reach us.
</p>
```

Key rules:
- Third person ("Spice Grill & Bar is X miles from...")
- Distance + drive time in the same sentence
- Exit 146 mentioned explicitly
- One paragraph per city — not a list item
- 20–40 words per paragraph (well under the 50-word AEO audit limit)

**Answer-first H1 pattern (for /near-grand-canyon/):**
```html
<h1>Spice Grill &amp; Bar — 78 Miles from Grand Canyon South Rim</h1>
```
Lead with the fact. No preamble. AI engines and voice assistants extract the H1 as the primary answer to "Indian restaurant near Grand Canyon" queries.

### Pattern 4: Directions Page H2 Structure

Each city gets an H2 heading + content block. AEO research shows H2 headings signal topic boundaries to AI extraction engines.

```astro
<section id="flagstaff">
  <h2>From Flagstaff, AZ — 51 Miles West on I-40</h2>
  <p>
    From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes)
    and take Exit 146 (Ash Fork / Historic Route 66). Turn right onto Lewis Ave —
    Spice Grill &amp; Bar is on your right at 33 Lewis Ave.
  </p>
  <!-- NAP address block -->
  <address>
    Spice Grill &amp; Bar<br />
    33 Lewis Ave, Ash Fork, AZ 86320<br />
    <a href="tel:+19282771292">(928) 277-1292</a>
  </address>
</section>
```

### Pattern 5: GoogleMap.tsx Reuse Pattern

Confirmed from `src/components/GoogleMap.tsx` and `src/components/LocationSection.astro`:

```astro
---
import { GoogleMap } from '@/components/GoogleMap';
const API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
---

<div class="w-full h-[400px] rounded-xl overflow-hidden">
  <GoogleMap apiKey={API_KEY} client:visible />
</div>
```

The `client:visible` directive defers hydration until the component is in viewport, which is critical for LCP. The component uses IntersectionObserver with 200px rootMargin for preload.

**Placement recommendation:** Put the GoogleMap at the bottom of `/directions/`, after all city H2 sections. This keeps the map below the fold and ensures it does not block LCP measurement.

### Pattern 6: NAP Data (source of truth)

From `RestaurantSchema.astro` and `REQUIREMENTS.md`:
- **Name:** Spice Grill & Bar
- **Street:** 33 Lewis Ave
- **City/State/ZIP:** Ash Fork, AZ 86320
- **Phone (display):** (928) 277-1292
- **Phone (E.164):** +1-928-277-1292
- **Google Maps URL:** https://maps.app.goo.gl/q2EJFMbMRaysU6vH8
- **Hours:** Mon closed, Tue-Thu 8AM-9PM, Fri-Sun 8AM-10PM

### Anti-Patterns to Avoid

- **Putting distance facts in `<li>` items instead of `<p>` tags:** List items are harder for AI engines to extract as atomic passage units. Each city fact must be a `<p>`.
- **Nesting city facts inside a parent paragraph:** "From Las Vegas (200 mi), Flagstaff (51 mi), and Phoenix (144 mi)" — this bundles facts that should be standalone.
- **Image hero above the fold:** Any `<img>` or `<Image>` in the hero area becomes the LCP element. With no images, LCP defaults to the largest text block (H1), which is typically fast.
- **Hardcoding `og:url` per-page without fixing Layout.astro:** If Layout always outputs the homepage URL in og:url, all pages share wrong OG data.
- **Using `client:load` on GoogleMap:** The existing component uses `client:visible` in LocationSection.astro — do the same. `client:load` would eagerly hydrate and potentially block interaction.
- **Adding map per city section:** One centralized map is sufficient and avoids multiple API calls.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lazy map loading | Custom IntersectionObserver in new page | Reuse `GoogleMap.tsx` with `client:visible` | Already built, tested, production-proven |
| Address HTML | Custom schema component | Standard HTML `<address>` element | Semantic HTML is sufficient; no new Astro schema component needed |
| Page-specific OG tags | Inline `<meta>` tags outside Layout | Extend Layout.astro with optional ogTitle/ogDescription/ogUrl props | Keeps head tag management in one place |
| Distance calculations | JavaScript or API call | Static hardcoded content | Distances are stable facts; static is correct for this use case |

**Key insight:** Both pages are pure static content — no data fetching, no dynamic generation, no new components. The implementation complexity is writing good AEO content and structuring it correctly in HTML, not engineering.

---

## Common Pitfalls

### Pitfall 1: Incorrect Distance Data

**What goes wrong:** Publishing "58 miles" (a number cited in the CONTEXT.md example H1) when routing tools show 78 miles from Grand Canyon South Rim to Ash Fork. The faq.json says "~70 miles" — also inconsistent.

**Why it happens:** Example text in CONTEXT.md ("58 Miles from Grand Canyon South Rim") was illustrative, not verified. Different sources count from different entry points within the Grand Canyon boundary.

**How to avoid:** Before writing final content, verify the exact distance from "Grand Canyon South Rim Visitor Center" to "33 Lewis Ave, Ash Fork, AZ 86320" on Google Maps. Use that verified number across all pages and schema. The faq.json entries should be updated if they disagree.

**Warning signs:** If the H1 distance differs from the faq.json distance answer — this is a content consistency error that AI engines will penalize.

### Pitfall 2: LCP Failure Due to Hero Image

**What goes wrong:** Adding a background image (like Hero.astro's full-screen image) causes the image to become the LCP element. Even with `loading="eager"` and `fetchpriority="high"`, a large image over a slow connection can push LCP above 4000ms.

**Why it happens:** The locked decision says "minimal or no images" and "hero treatment at Claude's discretion." The temptation is to reuse the existing hero pattern — but Hero.astro uses a full-screen image with opacity overlay.

**How to avoid:** Use a text-only hero: brand orange H1 on a minimal background (like faq.astro's `pt-32 pb-24 bg-zinc-50 dark:bg-black` pattern). No background image. LCP becomes the H1 text node, which is instant.

**Warning signs:** `npm run test:lhci` reports LCP > 2000ms or LCP element is `img` on either page.

### Pitfall 3: OG Tags Not Page-Specific

**What goes wrong:** CONT-04 requires "page-specific OpenGraph tags" but Layout.astro currently hardcodes og:url and og:title to the homepage. If this is not fixed in Layout.astro, both new pages will emit incorrect OG tags.

**Why it happens:** Layout.astro was built for a single-page site. The existing `faq.astro` page has this same issue — but it wasn't caught because faq.astro predates the OG requirement.

**How to avoid:** Plan 05-01 must include a Layout.astro edit to support optional ogTitle, ogDescription, ogUrl props. Both new pages pass their own OG data.

**Warning signs:** Sharing either page URL on social media shows homepage title/description instead of page-specific content.

### Pitfall 4: Missing Trailing Slash in Internal Cross-Links

**What goes wrong:** `astro.config.mjs` sets `trailingSlash: 'always'`. Internal links written as `href="/directions"` (no trailing slash) cause a redirect — which harms LCP and may cause issues with some crawlers.

**Why it happens:** Easy to type `href="/directions"` instead of `href="/directions/"`.

**How to avoid:** Always write internal links with trailing slashes: `href="/near-grand-canyon/"` and `href="/directions/"`. Verify in built HTML.

**Warning signs:** Browser network tab shows 301 redirects on internal page links.

### Pitfall 5: Lighthouse CI Still Failing After Phase 5 Until Both Pages Exist in dist/

**What goes wrong:** Phase 4 added `/near-grand-canyon/` and `/directions/` to `.lighthouserc.json`. The `qa` pre-push hook runs `npm run build + test:lhci`. If Phase 5 pages are committed in two separate commits, the first commit (05-01) will still fail LHCI on `/directions/` because that page doesn't exist yet.

**Why it happens:** Sequential plan execution — 05-01 creates only `/near-grand-canyon/`, LHCI will 404 on `/directions/`.

**How to avoid:** Either (a) implement both pages in a single commit, or (b) expect LHCI failure after 05-01 and accept it as temporary. The LHCI must pass after 05-02.

### Pitfall 6: `<address>` Semantic Usage

**What goes wrong:** HTML `<address>` is semantically for contact info of the nearest article/section ancestor — not a generic "postal address" container. Accessibility auditors may flag it if used incorrectly.

**Why it happens:** `<address>` is commonly misused as a postal address container.

**How to avoid:** Place `<address>` inside a relevant `<section>` or `<article>`. The content should include actual contact contact details (phone, email) alongside the physical address. Do not use `<address>` for purely geographic coordinates or citations.

---

## Code Examples

Verified patterns from existing codebase and official sources:

### /near-grand-canyon/ Page Shell

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Indian Restaurant Near Grand Canyon | 78 Miles — Spice Grill & Bar"
  description="Spice Grill & Bar in Ash Fork, AZ is 78 miles from the Grand Canyon South Rim — about 1 hour 20 minutes via AZ-64 and I-40 Exit 146. Authentic Indian food on Route 66."
  ogTitle="Indian Restaurant Near Grand Canyon — Spice Grill & Bar"
  ogDescription="78 miles from Grand Canyon South Rim. Authentic Punjabi cuisine at I-40 Exit 146 in Ash Fork, AZ."
  ogUrl="https://spicegrillbar66.com/near-grand-canyon/"
>
  <main class="pt-32 pb-24 px-6 bg-zinc-50 dark:bg-black min-h-screen">
    <div class="max-w-4xl mx-auto">

      <!-- Answer-first H1 -->
      <h1 class="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-6">
        Spice Grill &amp; Bar —
        <span class="text-brand-orange">78 Miles from Grand Canyon South Rim</span>
      </h1>

      <!-- Lead paragraph: direct answer -->
      <p class="text-lg text-zinc-600 dark:text-zinc-300 mb-12 leading-relaxed">
        Spice Grill &amp; Bar is located in Ash Fork, AZ, about 78 miles south of the Grand Canyon
        South Rim — roughly 1 hour 20 minutes via AZ-64 South and I-40 Exit 146.
        It is the closest Indian restaurant to the Grand Canyon on the I-40 corridor.
      </p>

      <!-- Per-city distance facts (each as standalone extractable paragraph) -->
      <section>
        <h2 class="...">Distance from Nearby Cities</h2>

        <p>Spice Grill &amp; Bar is 51 miles from Flagstaff — about 46 minutes west on I-40. Take Exit 146 in Ash Fork.</p>
        <p>Spice Grill &amp; Bar is 18 miles from Williams — about 18 minutes east on I-40. Take Exit 146 in Ash Fork.</p>
        <!-- ... remaining cities ... -->
      </section>

      <!-- Dish recommendations -->
      <section>
        <h2 class="...">What to Order for Road Trippers</h2>
        <!-- 3-5 popular items with one-liner descriptions -->
      </section>

      <!-- Cross-links -->
      <section>
        <a href="/directions/">Get Turn-by-Turn Directions</a>
        <a href="/">View Full Menu</a>
      </section>

    </div>
  </main>
</Layout>
```

### /directions/ Page Shell

```astro
---
import { GoogleMap } from '@/components/GoogleMap';
import Layout from '../layouts/Layout.astro';

const API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
---

<Layout
  title="Directions to Spice Grill & Bar | I-40 Exit 146, Ash Fork, AZ"
  description="Step-by-step driving directions to Spice Grill & Bar from Las Vegas, Los Angeles, Flagstaff, Kingman, Phoenix, Williams, and Seligman. Take I-40 Exit 146 in Ash Fork, AZ."
  ogTitle="Directions to Spice Grill & Bar — I-40 Exit 146"
  ogDescription="Driving directions from 7 cities to Spice Grill & Bar in Ash Fork, AZ. Take I-40 Exit 146."
  ogUrl="https://spicegrillbar66.com/directions/"
>
  <main class="pt-32 pb-24 px-6 bg-zinc-50 dark:bg-black min-h-screen">
    <div class="max-w-4xl mx-auto">

      <!-- Answer-first H1 -->
      <h1 class="...">
        Directions to Spice Grill &amp; Bar
        <span class="text-brand-orange">I-40 Exit 146, Ash Fork, AZ</span>
      </h1>

      <!-- NAP Address Block (once, at top) -->
      <address class="...">
        <strong>Spice Grill &amp; Bar</strong><br />
        33 Lewis Ave, Ash Fork, AZ 86320<br />
        <a href="tel:+19282771292">(928) 277-1292</a>
      </address>

      <!-- Per-city H2 sections -->
      <section id="flagstaff">
        <h2>From Flagstaff, AZ — 51 Miles West</h2>
        <p>
          From Flagstaff, take I-40 West toward Kingman. Drive 51 miles (about 46 minutes)
          and take <strong>Exit 146</strong> (Ash Fork / Historic Route 66).
          Turn right onto Lewis Ave — Spice Grill &amp; Bar is at 33 Lewis Ave on your right.
        </p>
      </section>
      <!-- ... remaining 6 cities ... -->

      <!-- Google Maps embed (below fold, client:visible for LCP) -->
      <div class="w-full h-[400px] glass-card rounded-2xl overflow-hidden mt-12">
        <GoogleMap apiKey={API_KEY} client:visible />
      </div>

      <!-- Cross-link -->
      <a href="/near-grand-canyon/">See how close we are to the Grand Canyon</a>

    </div>
  </main>
</Layout>
```

### Layout.astro Extended OG Props (edit needed)

```astro
---
// In Layout.astro frontmatter — add optional OG props
const {
  title = 'Spice Grill & Bar | Best Indian & Punjabi Food in Ash Fork, AZ (Route 66)',
  description = '...',
  ogTitle,
  ogDescription,
  ogUrl,
} = Astro.props;
---

<!-- In <head>: -->
<meta property="og:url" content={ogUrl ?? 'https://spicegrillbar66.com'} />
<meta property="og:title" content={ogTitle ?? 'Spice Grill & Bar | Authentic Punjabi Cuisine on Route 66'} />
<meta property="og:description" content={ogDescription ?? 'Best Indian food in Ash Fork, AZ...'} />
```

### Top 5 Dish Recommendations (by popularity score from menu.json)

| Rank | Item | Description | Price | Popularity Score |
|------|------|-------------|-------|-----------------|
| 1 | Fish Pakora | Marinated fish fried in our chickpea batter | $10.99 | 110 |
| 2 | Butter Chicken | Rich butter-cream, tomatoes, onion sauce cooked with chicken thighs | $15.99 | 100 |
| 3 | Shahi Paneer | Chunks of cottage cheese in a savory rich buttery cream sauce | $15.99 | 90 |
| 4 | Chicken Biryani | Basmati rice sauteed with chicken and spices | $17.99 | 80 |
| 5 | Garlic Naan | Drizzled with butter and garlic on top | $3.99 | 70 |

These 5 items have the only non-zero popularity scores in menu.json. They are confirmed popular and should be featured on `/near-grand-canyon/` as road-tripper recommendations. The faq.json also corroborates: "Butter Chicken, Goat Curry, Shahi Paneer, Fish Pakora, and our signature Garlic Naan" — Goat Curry not in top-5 popularity scores but mentioned in FAQ; defer to popularity scores.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single-page site (no sub-pages) | Multi-page Astro site with `/faq/`, `/near-grand-canyon/`, `/directions/` | Phase 3-5 | Each page gets breadcrumb schema, Lighthouse audit, OG tags |
| No static OG tags per-page | Per-page OG tags via Layout.astro props | Phase 5 | Social sharing correctly previews each page |
| Global FAQSchema on all pages | FAQSchema still global (known tech debt, STATE.md) | Phase 3 | Both new pages emit full FAQ schema; acceptable for now |

**Tech debt to be aware of:**
- `FAQSchema.astro` is injected globally via Layout.astro (noted in STATE.md). Both new pages will emit all 20 FAQ schema entries even though no FAQ content is visible on those pages. This is known and accepted — do not fix in Phase 5.
- `llms.txt` in `/public/` does not mention the new pages. Consider updating it in Phase 5 (Claude's discretion — low cost, good practice).

---

## Open Questions

1. **Grand Canyon distance: 58 miles (CONTEXT.md example) vs 78 miles (routing sources) vs ~70 miles (faq.json)**
   - What we know: Three different figures exist across project documents
   - What's unclear: Which entry point in the Grand Canyon park is the reference point
   - Recommendation: Measure Google Maps from "Grand Canyon South Rim Visitor Center" → "33 Lewis Ave, Ash Fork, AZ 86320" before writing the H1. Use that number everywhere. Update faq.json if it disagrees.

2. **Should the NAP address block appear once (top of /directions/) or in each city H2 section?**
   - What we know: REQUIREMENTS.md says "address block with NAP data" for CONT-05; not specified per-section
   - What's unclear: CONTEXT.md says "Address block with NAP data in each section" (implying per-section)
   - Recommendation: Include a brief NAP summary (name, address, phone) in each H2 city section — it reinforces local signal and makes each section self-contained for AI extraction. Keep it short (3 lines, wrapped in `<address>`).

3. **Should /near-grand-canyon/ include hours and contact info?**
   - What we know: This is explicitly Claude's discretion per CONTEXT.md
   - What's unclear: Whether hours on a proximity page help AEO or add noise
   - Recommendation: Yes — include hours and phone in a small info block below the dish recommendations. AEO best practice is to make each page self-sufficient for "is it open now" queries. Keep it compact.

4. **City section navigation on /directions/ — anchor links vs. scroll?**
   - What we know: Claude's discretion per CONTEXT.md; 7 cities is a lot of scroll
   - Recommendation: Include a sticky anchor-link nav at the top of the /directions/ page with all 7 cities. This is a simple `<ul>` with `href="#flagstaff"` etc. No JavaScript required — pure HTML anchor navigation. Improves usability on mobile.

---

## Sources

### Primary (HIGH confidence)

- Direct code inspection — `src/pages/faq.astro`: page shell pattern confirmed
- Direct code inspection — `src/layouts/Layout.astro`: title/description props confirmed; OG hardcoding issue identified
- Direct code inspection — `src/components/GoogleMap.tsx`: lazy-loading pattern and props confirmed
- Direct code inspection — `src/components/LocationSection.astro`: GoogleMap usage pattern with `client:visible` confirmed
- Direct code inspection — `src/data/menu.json`: top-5 popularity items identified (Fish Pakora 110, Butter Chicken 100, Shahi Paneer 90, Chicken Biryani 80, Garlic Naan 70)
- Direct code inspection — `src/components/schema/RestaurantSchema.astro`: NAP data confirmed
- Direct code inspection — `astro.config.mjs`: `trailingSlash: 'always'`, `build.format: 'directory'` confirmed
- Direct code inspection — `src/data/faq.json`: existing distance language and I-40 Exit 146 phrasing confirmed
- `.planning/STATE.md`: distance verification blocker documented, FAQSchema global injection noted

### Secondary (MEDIUM confidence)

- Distance data from distance-cities.com, travelmath.com, trippy.com, drivedistance.com — multiple sources agree within ±5% margin:
  - Grand Canyon South Rim → Ash Fork: 78 miles / ~1h 21min
  - Las Vegas → Ash Fork: ~200 miles / ~3 hours
  - Los Angeles → Ash Fork: ~414 miles / ~6 hours
  - Flagstaff → Ash Fork: 51-52 miles / ~46 minutes
  - Kingman → Ash Fork: ~97 miles / ~1.5 hours
  - Phoenix → Ash Fork: 144 miles / ~2h 41min
  - Williams → Ash Fork: 18 miles / ~18 minutes
  - Seligman → Ash Fork: 25 miles / ~24 minutes

- AEO content structure best practices from HubSpot (blog.hubspot.com/marketing/answer-engine-optimization-best-practices), CXL (cxl.com/blog/answer-engine-optimization-aeo-the-comprehensive-guide/), STS Digital Solutions (stsdigitalsolutions.com/blog/how-to-structure-your-website-content-for-aeo/): standalone paragraphs, 30-60 word lead answers, atomic passage structure

- GEO schema signals from Search Engine Journal (searchenginejournal.com/how-to-use-schema-for-local-seo), HigherVisibility (highervisibility.com/seo/learn/geo-targeted-schema-markup-beyond-localbusiness/): content pages reinforce LocalBusiness schema; no additional page-level schema required beyond what RestaurantSchema already provides globally

### Tertiary (LOW confidence)

- thecanyon.com/distances: cited in search results for Grand Canyon driving distances — not directly verified via WebFetch; consistent with other sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries are existing project dependencies; no new installs
- Architecture: HIGH — faq.astro provides direct template; GoogleMap.tsx is production-tested
- Distance data: MEDIUM — multiple routing tools agree; must be verified against Google Maps before publishing (existing STATE.md blocker)
- AEO content patterns: MEDIUM — verified from multiple 2025 sources; specific word counts/structures are guidance not hard rules
- OG tag issue: HIGH — confirmed via direct code inspection of Layout.astro
- Pitfalls: HIGH — all identified from direct code inspection or well-documented AEO patterns

**Research date:** 2026-02-21
**Valid until:** 2026-04-21 (stable — Astro 5, Tailwind 3, static content page patterns)
