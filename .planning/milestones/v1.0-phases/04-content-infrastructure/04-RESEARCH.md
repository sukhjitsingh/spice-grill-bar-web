# Phase 4: Content Infrastructure - Research

**Researched:** 2026-02-20
**Domain:** Astro layout, breadcrumb schema, Lighthouse CI config, footer redesign
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- No new links in the header navbar — keep it clean with existing Menu | Philosophy | FAQ
- No sub-nav bar or mobile-menu-only links — skip header entirely for these pages
- Pages are discoverable through footer links and internal cross-links only
- **Roadmap criteria update required:** Remove "Header navigation includes links to /near-grand-canyon/ and /directions/" from Phase 4 success criteria
- Add a new "Explore" section to the footer grid
- Explore section contains: page links (Near Grand Canyon, Directions, FAQ) + social links (Instagram, Facebook)
- Social links move FROM the bottom bar INTO the Explore section
- Social links use icons + text labels (e.g., Instagram icon + "Instagram") — more accessible than icon-only
- Bottom bar becomes copyright only: "© 2024 Spice Grill & Bar. All rights reserved."
- Mobile-friendly layout is the priority for the footer grid rearrangement
- Auto-generate breadcrumb labels from URL slugs (near-grand-canyon → "Near Grand Canyon")
- No manual label passing required — slug-to-title-case conversion handles it
- "Home" breadcrumb item is always auto-included as the first item on every page
- Pages do not need to pass their own breadcrumb chain

### Claude's Discretion

- Link label text for "Near Grand Canyon" and "Directions" pages (SEO-friendly, natural phrasing)
- Footer grid layout arrangement (column count, responsive breakpoints) — must be mobile-friendly
- Breadcrumb visibility (schema-only vs visible on page) — mobile-friendly if visible
- Handling breadcrumb edge cases (acronyms like FAQ, special formatting)
- Whether FAQ link stays in bottom bar redundantly or moves entirely to Explore section

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID      | Description                                                                                                                                         | Research Support                                                                                     |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| CONT-01 | Fix `BreadcrumbSchema` breadcrumb label generation in `Layout.astro` to produce human-readable labels for hyphenated slugs                          | Slug-to-title-case transform identified; acronym edge-case handling documented                       |
| CONT-02 | Add `/near-grand-canyon/` and `/directions/` URLs to `.lighthouserc.json` so Lighthouse CI audits new pages on every push                           | Lighthouse CI `url` array format confirmed; static dir mode documented                              |
| CONT-03 | Update `Footer.astro` links to include `/near-grand-canyon/` and `/directions/`; add new "Explore" section; social links move from bottom bar there | Footer component structure inspected; no new npm packages required; Tailwind grid patterns documented |
</phase_requirements>

---

## Summary

Phase 4 is entirely infrastructure scaffolding — no new pages, no new npm packages, no new schema components. It has three surgical tasks: (1) fix one regex line in `Layout.astro` so breadcrumb labels are human-readable, (2) add two URL entries to `.lighthouserc.json`, and (3) restructure `Footer.astro` to add an "Explore" section consolidating page links and social links.

All three tasks are self-contained and operate on files already in the codebase. The breadcrumb fix is a pure TypeScript string transform (slug → title-case). The Lighthouse CI fix is a JSON array append. The footer restructure is pure Astro/Tailwind markup — no React, no new dependencies. Header (`Header.tsx`) is explicitly locked: no changes.

**Primary recommendation:** Implement all three tasks in a single plan (`04-01`). They are small, independent, and share no execution risk. Combined, they take under 15 minutes to implement and verify.

---

## Standard Stack

### Core (already in project — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.x | Layout, Footer, BreadcrumbSchema components | Project framework |
| TailwindCSS | 3.x | Responsive grid layout for footer redesign | Project CSS framework |
| Lighthouse CI (`@lhci/cli`) | existing | CI performance/SEO audits | Already in `.lighthouserc.json` + pre-push hook |
| `schema-dts` | existing | TypeScript types for BreadcrumbList schema | Already imported in `BreadcrumbSchema.astro` |
| `lucide-react` | existing | Icons in Footer already (Clock, MapPin, Phone) | Already used; Instagram/Facebook use raw SVG paths |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline slug transform in Layout.astro | Separate utility function in `src/lib/` | Utility function is cleaner for future pages; Layout.astro is already 125 lines — a helper keeps it readable |
| Raw SVG in Explore social links | `lucide-react` icons | Instagram/Facebook not in Lucide; keep raw SVG consistent with current Footer.astro pattern |

**Installation:** No new packages needed. This phase uses zero new dependencies.

---

## Architecture Patterns

### Current BreadcrumbSchema Flow

`Layout.astro` generates breadcrumb items inline and passes them to `BreadcrumbSchema.astro`:

```astro
<!-- Layout.astro lines 109-123 -->
<BreadcrumbSchema
  items={[
    { name: 'Home', item: '/' },
    ...(currentPath !== '/'
      ? [
          {
            name:
              currentPath.replace(/\//g, '').charAt(0).toUpperCase() +
              currentPath.replace(/\//g, '').slice(1),
            item: currentPath,
          },
        ]
      : []),
  ]}
/>
```

`BreadcrumbSchema.astro` accepts `items: { name: string; item: string }[]` and has no label logic of its own — it trusts what `Layout.astro` passes.

### BreadcrumbSchema Interface (no changes needed here)

```astro
<!-- BreadcrumbSchema.astro — UNCHANGED -->
interface Props {
  items: {
    name: string;
    item: string;
  }[];
}
```

The fix is entirely in `Layout.astro`'s name-generation expression.

### Breadcrumb Label Fix Pattern

**Current (broken):**
```ts
currentPath.replace(/\//g, '').charAt(0).toUpperCase() +
currentPath.replace(/\//g, '').slice(1)
// /near-grand-canyon/ → "near-grand-canyon" → "Near-grand-canyon" ❌
```

**Fixed (slug-to-title-case):**
```ts
currentPath
  .replace(/^\/|\/$/g, '')      // strip leading and trailing slashes
  .split('-')                    // split on hyphen
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // title-case each word
  .join(' ')                     // join with space
// /near-grand-canyon/ → "near-grand-canyon" → ["near","grand","canyon"] → "Near Grand Canyon" ✅
// /faq/ → "faq" → ["faq"] → "Faq" (see acronym handling below)
// /directions/ → "directions" → ["directions"] → "Directions" ✅
```

**Acronym edge case (Claude's Discretion):** `faq` becomes `"Faq"` with naive title-casing. Recommendation: use a known-acronyms map.

```ts
const ACRONYMS: Record<string, string> = { faq: 'FAQ' };

function slugToLabel(slug: string): string {
  const clean = slug.replace(/^\/|\/$/g, '');
  return clean
    .split('-')
    .map(word => ACRONYMS[word.toLowerCase()] ?? (word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}
```

This can be defined as an inline const in `Layout.astro`'s frontmatter — no separate file needed for 3 lines of logic.

**Placement recommendation:** Define `ACRONYMS` and `slugToLabel` in `Layout.astro` frontmatter (between `---` fences). Keep it co-located with the only consumer.

### Lighthouse CI URL Array Pattern

**Current `.lighthouserc.json`:**
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/"],
      "numberOfRuns": 3
    }
  }
}
```

**Fixed — add two URLs:**
```json
"url": ["/", "/near-grand-canyon/", "/directions/"]
```

Important: `staticDistDir` mode serves pages from `./dist`. Pages at `/near-grand-canyon/` and `/directions/` must exist as `dist/near-grand-canyon/index.html` and `dist/directions/index.html` at CI time. These pages are created in Phase 5. **For Phase 4, adding the URLs to the config is correct — the CI will fail on those URLs if Phase 5 hasn't run yet, but that is expected and acceptable.** The `.lighthouserc.json` config itself is the deliverable for CONT-02; Phase 5 creates the pages.

**Confidence note:** If CI runs before Phase 5, Lighthouse will 404 on the new URLs. This is a known sequencing concern, not a config error. The team should be aware Phase 5 must complete before CI will pass on those URLs.

### Footer Restructure Pattern

**Current footer grid:** `grid-cols-1 md:grid-cols-4` — two cols for brand (span 2) + Visit Us + Hours
**Social links + FAQ** currently live in bottom bar as icon-only links

**Target structure per locked decisions:**
- Add a 4th (or 5th) named section: "Explore" column
- Explore section contains: internal page links (Near Grand Canyon, Directions, FAQ) + social links (icon + text label)
- Bottom bar: copyright only, no social links

**Recommended footer grid change:**

The current grid is `md:grid-cols-4` with brand spanning 2 columns (effectively 3 distinct columns). Adding "Explore" requires either:
1. **Option A:** Expand to `md:grid-cols-5` with brand still spanning 2 → 4 distinct sections
2. **Option B:** Keep `md:grid-cols-4` but collapse brand span to 1 → still 4 distinct sections (brand, Visit Us, Hours, Explore)
3. **Option C (recommended):** Keep `md:grid-cols-4` for desktop; on mobile each section stacks vertically. Move brand to `col-span-1 md:col-span-1`, making room for 4 equal columns on desktop.

Actually, the simplest mobile-first approach: use `grid-cols-1 sm:grid-cols-2 md:grid-cols-4` with each section taking one column. Brand description can go in its own column or be collapsed. This is Claude's discretion per CONTEXT.md.

**Social links pattern (icon + text, accessible):**
```astro
<a
  href="https://www.instagram.com/panjabi_dhaba_sgb..."
  target="_blank"
  rel="noopener noreferrer"
  class="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
  aria-label="Follow us on Instagram"
>
  <!-- existing Instagram SVG -->
  <svg ...>...</svg>
  <span>Instagram</span>
</a>
```

Note: The existing Instagram and Facebook icons in `Footer.astro` are raw SVG paths (not Lucide). Keep them as-is; just add `<span>` text labels alongside each icon.

**Internal page links pattern (Explore section):**
```astro
<a href="/near-grand-canyon/" class="...">Near Grand Canyon</a>
<a href="/directions/" class="...">Directions</a>
<a href="/faq/" class="...">FAQ</a>
```

Use the same anchor class style as existing footer links for visual consistency.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Breadcrumb label for nested slugs (e.g., `/en/near-grand-canyon/`) | Custom recursive path parser | The current single-segment approach is fine for this flat site | All current and planned pages are single-level slugs; no nesting exists |
| Icon component abstraction for social icons | New React icon component | Keep raw SVG in Footer.astro | Footer is Astro, not React; Lucide doesn't include Instagram/Facebook |
| Dynamic Lighthouse URL list | Script to auto-discover pages | Manual JSON array | The URL list is small (3 items) and must be intentional — not auto-discovered |

**Key insight:** This phase contains no algorithmic complexity. Every task is a targeted edit to an existing file. The temptation to over-engineer (a utility module for slugs, a dynamic LHCI config) should be resisted.

---

## Common Pitfalls

### Pitfall 1: Multi-Segment Paths Break the Slug Transform

**What goes wrong:** If a future path like `/grand-canyon/north-rim/` is passed, splitting on `-` and stripping only outer slashes gives `grand canyon/north rim` instead of `Grand Canyon / North Rim`.

**Why it happens:** The current transform only handles the last path segment, not nested paths.

**How to avoid:** The transform should use only the last non-empty segment of the path. Use `currentPath.split('/').filter(Boolean).pop()` to extract the final segment before applying title-casing.

```ts
function slugToLabel(path: string): string {
  const segment = path.split('/').filter(Boolean).pop() ?? '';
  return segment
    .split('-')
    .map(word => ACRONYMS[word.toLowerCase()] ?? (word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}
```

This future-proofs the label for Phase 5 pages (`/near-grand-canyon/`, `/directions/`) and any v2 pages.

**Warning signs:** If a breadcrumb label contains a forward slash, the transform is not extracting the final segment.

### Pitfall 2: Lighthouse CI Fails on Phase 4 if Phase 5 Pages Don't Exist

**What goes wrong:** Adding `/near-grand-canyon/` and `/directions/` to `.lighthouserc.json` causes Lighthouse CI to 404 on those URLs until Phase 5 creates the pages.

**Why it happens:** `staticDistDir` mode serves from `./dist`. If `dist/near-grand-canyon/index.html` doesn't exist, LHCI gets a 404.

**How to avoid:** Document this in a comment or note. The CI should be expected to fail on those URLs until Phase 5 completes. Alternatively, add the LHCI URLs only in Phase 5 — but CONT-02 explicitly requires them in Phase 4.

**Warning signs:** CI failing with "URL returned 404" after Phase 4 and before Phase 5 is expected, not a bug.

### Pitfall 3: Footer Bottom Bar Still Has Social Icons After Restructure

**What goes wrong:** Social links are currently in the bottom bar `<div>`. If Explore section is added but the bottom bar `<div>` is not cleaned up, social icons appear in two places.

**Why it happens:** Forgetting to remove the existing social links from the bottom bar while adding them to Explore.

**How to avoid:** When adding social links to the Explore section, simultaneously remove the social link `<a>` tags from the bottom bar `<div>`. The bottom bar should contain only the copyright `<p>`.

**Warning signs:** Two sets of Instagram/Facebook links in the rendered HTML.

### Pitfall 4: FAQ Link Redundancy (Claude's Discretion)

**What goes wrong:** FAQ link currently exists in the bottom bar. If it moves entirely to Explore, the bottom bar has no links and becomes copyright-only (which is the locked decision). If it's kept redundantly in both places, it's inconsistent.

**How to avoid:** Per the locked decision, the bottom bar is copyright-only. FAQ moves to Explore section only. Remove it from the bottom bar.

---

## Code Examples

### Breadcrumb Label Transform (verified against existing code)

```astro
---
// In Layout.astro frontmatter — replaces current inline expression

const BREADCRUMB_ACRONYMS: Record<string, string> = { faq: 'FAQ' };

function slugToLabel(path: string): string {
  const segment = path.split('/').filter(Boolean).pop() ?? '';
  if (!segment) return '';
  return segment
    .split('-')
    .map(word => BREADCRUMB_ACRONYMS[word.toLowerCase()] ?? (word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}
---

<!-- Then in the BreadcrumbSchema call: -->
<BreadcrumbSchema
  items={[
    { name: 'Home', item: '/' },
    ...(currentPath !== '/'
      ? [{ name: slugToLabel(currentPath), item: currentPath }]
      : []),
  ]}
/>
```

This replaces the 5-line inline expression with a clean function call and produces:
- `/near-grand-canyon/` → `"Near Grand Canyon"`
- `/directions/` → `"Directions"`
- `/faq/` → `"FAQ"` (acronym map)

### Lighthouse CI Updated Config

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["/", "/near-grand-canyon/", "/directions/"],
      "numberOfRuns": 3
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "assert": {
      "assertions": {
        "largest-contentful-paint": ["error", { "maxNumericValue": 4000 }],
        "total-blocking-time": ["error", { "maxNumericValue": 600 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.8 }],
        "categories:seo": ["error", { "minScore": 0.9 }]
      }
    }
  }
}
```

### Footer Explore Section Skeleton (Astro)

```astro
<!-- New "Explore" section — replaces social+FAQ content in bottom bar -->
<div>
  <p class="text-zinc-900 dark:text-white text-xs font-semibold tracking-wider uppercase mb-4">
    Explore
  </p>
  <ul class="text-zinc-600 dark:text-zinc-300 text-sm space-y-3">
    <li>
      <a href="/near-grand-canyon/" class="hover:text-zinc-900 dark:hover:text-white transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm">
        Near Grand Canyon
      </a>
    </li>
    <li>
      <a href="/directions/" class="hover:text-zinc-900 dark:hover:text-white transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm">
        Directions
      </a>
    </li>
    <li>
      <a href="/faq/" class="hover:text-zinc-900 dark:hover:text-white transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm">
        FAQ
      </a>
    </li>
    <li class="pt-2">
      <a
        href="https://www.instagram.com/panjabi_dhaba_sgb..."
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm w-fit"
        aria-label="Follow us on Instagram"
      >
        <svg role="img" viewBox="0 0 24 24" class="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
          <!-- existing path d="M7.0301..." -->
        </svg>
        <span>Instagram</span>
      </a>
    </li>
    <li>
      <a
        href="https://www.facebook.com/profile.php?id=61566349169122"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm w-fit"
        aria-label="Follow us on Facebook"
      >
        <svg role="img" viewBox="0 0 24 24" class="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
          <!-- existing path d="M9.101..." -->
        </svg>
        <span>Facebook</span>
      </a>
    </li>
  </ul>
</div>
```

### Footer Bottom Bar After Cleanup

```astro
<!-- Bottom bar: copyright only -->
<div
  class="max-w-7xl mx-auto px-6 mt-16 pt-8 pb-20 md:pb-8 border-t border-zinc-100 dark:border-zinc-900 flex justify-center items-center text-xs text-zinc-600 dark:text-zinc-400"
>
  <p>© 2024 Spice Grill & Bar. All rights reserved.</p>
</div>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded breadcrumb names per page | Auto-generated from URL slug | Phase 4 fix | No manual label needed for new pages |
| Social links icon-only in bottom bar | Social links icon+text in Explore grid section | Phase 4 | Better accessibility, less cluttered bottom bar |
| Lighthouse CI audits only `/` | CI audits `/`, `/near-grand-canyon/`, `/directions/` | Phase 4 | New pages get Lighthouse coverage from day one |

---

## Open Questions

1. **Footer grid column count on desktop**
   - What we know: Currently `md:grid-cols-4` with brand spanning 2 cols (= 3 distinct column groups). Adding Explore means 4 distinct groups.
   - What's unclear: Should brand span 2 on desktop (giving 5 virtual columns), or collapse to 1 col (giving 4 equal columns)?
   - Recommendation (Claude's Discretion): Keep `md:grid-cols-4` and give each section one column. The brand blurb paragraph can stay in its own `col-span-1` without spanning. This balances density on desktop. On mobile, `grid-cols-1` stacks all sections vertically — already handled.

2. **Breadcrumb visibility (schema-only vs rendered on page)**
   - What we know: Current `BreadcrumbSchema.astro` emits JSON-LD only — no visible HTML breadcrumb trail.
   - What's unclear: Should a visible breadcrumb trail also appear on non-home pages?
   - Recommendation (Claude's Discretion): Keep schema-only for now. Adding a visible breadcrumb requires new Astro markup and Tailwind styling that adds complexity outside the minimal Phase 4 scope. Visible breadcrumbs are more valuable after Phase 5 pages exist and have real content.

3. **Lighthouse CI behavior before Phase 5**
   - What we know: LHCI will 404 on `/near-grand-canyon/` and `/directions/` until Phase 5 creates those pages.
   - What's unclear: Will this break the pre-push QA gate?
   - Recommendation: Document in plan that this is expected. The `qa` hook runs `npm run build + test:lhci`. If pages don't exist in `dist/`, LHCI 404s fail the run. Phase 4 and Phase 5 may need to be committed together or the LHCI URL additions held until Phase 5 is ready. This is the most significant sequencing risk in the phase.

---

## Sources

### Primary (HIGH confidence)

- Direct code inspection — `src/layouts/Layout.astro` (lines 109-123): current breadcrumb label bug confirmed
- Direct code inspection — `src/components/Footer.astro` (full file): current footer structure confirmed
- Direct code inspection — `src/components/Header.tsx` (lines 9-13): navigation array confirmed; header locked per CONTEXT.md
- Direct code inspection — `.lighthouserc.json`: current URL array and assertion thresholds confirmed
- Direct code inspection — `src/components/schema/BreadcrumbSchema.astro`: component interface confirmed (no changes needed to the schema component itself)
- `.planning/phases/04-content-infrastructure/04-CONTEXT.md`: locked decisions and discretion areas

### Secondary (MEDIUM confidence)

- Lighthouse CI staticDistDir behavior: documented in official LHCI docs at https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md — staticDistDir serves files from local dist folder; non-existent paths return 404

### Tertiary (LOW confidence)

- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — inspected existing files directly; no new packages
- Architecture: HIGH — breadcrumb bug diagnosed from source; fix pattern is straightforward string transform
- Pitfalls: HIGH (social link duplication, bottom bar cleanup) / MEDIUM (LHCI sequencing with Phase 5)
- Footer grid: MEDIUM — Claude's Discretion area; multiple valid layouts, recommend simplest

**Research date:** 2026-02-20
**Valid until:** 2026-04-20 (stable — Astro 5, Tailwind 3, LHCI config format are mature)
