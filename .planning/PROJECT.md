# Spice Grill & Bar — SEO/GEO/AEO Optimization

## What This Is

The production website for Spice Grill & Bar, an authentic Punjabi Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona (Route 66). Built on Astro 5 with React islands, optimized for local SEO, AI answer engines (AEO), and Lighthouse performance. The site now ranks with full structured data coverage, 4 content pages targeting highway/proximity queries, and 20 AEO-compliant FAQ entries.

## Core Value

AI engines and Google must surface Spice Grill & Bar as _the_ answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.

## Requirements

### Validated

- ✓ Astro 5 static site with React islands architecture — existing
- ✓ TailwindCSS 3 with custom HSL brand colors (orange, green, gold) — existing
- ✓ 6 JSON-LD schema components (Restaurant, Organization, FAQ, Menu, WebSite, Breadcrumb) — existing
- ✓ FAQ page at `/faq/` for AEO — existing
- ✓ Lazy-loaded Google Maps component — existing
- ✓ Partytown off-thread analytics (GTM/GA) — existing
- ✓ Apache deployment with HTTPS enforcement — existing
- ✓ Auto-generated sitemap — existing
- ✓ reviews.json auto-updated weekly via GitHub Actions + Gemini API — existing
- ✓ Lighthouse CI quality gate (LCP < 4s, accessibility ≥ 90, SEO ≥ 90) — existing
- ✓ Pre-push hook running full QA build — existing
- ✓ RestaurantSchema with corrected NAP (hours, phone E.164, canonical URL) — v1.0
- ✓ RestaurantSchema expanded with geo, areaServed (12 entries), aggregateRating (build-time), hasMap, OrderAction, containedInPlace — v1.0
- ✓ OrganizationSchema with sameAs (Google Maps, Yelp, TripAdvisor, Facebook, Instagram) — v1.0
- ✓ WebSiteSchema with GEO-optimized description, publisher, inLanguage — v1.0
- ✓ FAQ expanded from 9 → 20 highway-targeted AEO entries with dynamic FAQSchema rendering — v1.0
- ✓ /near-grand-canyon/ page with AEO passage structure, speakable schema, inline FAQ schema — v1.0
- ✓ /directions/ page with 7 per-city sections, Google Maps embed, NAP address blocks — v1.0
- ✓ BreadcrumbSchema label generation for hyphenated slugs (slugToLabel + acronym map) — v1.0
- ✓ Footer Explore section with page links and social links — v1.0
- ✓ Lighthouse CI coverage for all 4 live pages (/, /near-grand-canyon/, /directions/, /faq/) — v1.0
- ✓ llms.txt and llms-full.txt with proximity data, correct hours, and all page URLs — v1.0

### Active

- [ ] `/about/` page — full brand narrative with extractable AI passages, Punjabi cuisine context, Ash Fork location identity
- [ ] `/route-66-dining/` page — Route 66 heritage content, road-tripper dining context
- [ ] Fix `servesCuisine` in RestaurantSchema to remove beverage types (Beer, Wine, etc.)
- [ ] Halal messaging revised across `llms.txt`, `llms-full.txt`, and `OurStorySection.astro` (wording TBD)
- [ ] Apple Maps Business Connect profile optimization (categories, imagery, Toast integration) — manual, off-site
- [ ] Automated KPI tracker (AI citation frequency, GBP direction requests, review velocity)

### Out of Scope

- New npm dependencies — keep bundle lean; no new packages unless strictly necessary
- Server-side rendering / dynamic routes — site must stay fully static (Apache hosting, no runtime)
- Native mobile app — web-first; mobile is handled by responsive design
- Online ordering system — Toast integration exists; no changes to that system
- Yelp/TripAdvisor/Reddit engagement — manual off-site work, tracked separately
- Google Business Profile posts — manual, not automated by this codebase

## Context

- **Site URL**: https://spicegrillbar66.com
- **Location**: I-40 Exit 146, Ash Fork, AZ 86320
- **Two distinct audiences**: (1) Road-trippers on I-40/Route 66 making a pitstop decision in real time; (2) Local residents in Ash Fork, Williams (~18 mi), Seligman (~30 mi), Kaibab Estates (~15 mi)
- **AI citation strategy**: Content must be self-contained, extractable passages — AI engines retrieve specific sentences, not full pages
- **Current state**: 4 pages (home, FAQ, near-grand-canyon, directions), 2,412 LOC (Astro/TS/TSX), 6 schema components, 20 FAQ entries, 7 reviews
- **Tech debt**: FAQSchema globally injected on all pages (should restrict to /faq/ only); duplicate FAQPage schemas on GEO pages; phone display format cosmetic inconsistency
- **Codebase map**: See `.planning/codebase/` for full architecture, stack, and conventions

## Constraints

- **No new npm packages**: Lighthouse scores and bundle size are non-negotiable
- **Lighthouse thresholds**: LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility ≥ 90, Best Practices ≥ 80, SEO ≥ 90
- **Static hosting**: All pages must generate as `/page/index.html` via Astro's `format: 'directory'` — no server runtime
- **Halal replacement copy**: New wording must be agreed upon before execution

## Key Decisions

| Decision | Rationale | Outcome |
| --- | --- | --- |
| Astro 5 over Next.js | Zero JS by default, static output, better Lighthouse scores | ✓ Good |
| Partytown for analytics | Off-main-thread execution preserves TBT budget | ✓ Good |
| Phase order: Schema fixes → additions → FAQ → infra → content → consistency | Fix broken data before adding signals; build infra before content | ✓ Good |
| New content pages in Astro (no new deps) | GEO targeting via dedicated URL structure without adding packages | ✓ Good |
| FAQ expansion via faq.json (not hardcoded) | Keeps data and markup separate; GitHub Actions can extend later | ✓ Good |
| Monday omitted from openingHoursSpecification | schema.org convention: omission = closed | ✓ Good |
| aggregateRating computed at build time from reviews.json | No hardcoded values; auto-updates with weekly review scrape | ✓ Good |
| Header navigation unchanged (Footer Explore instead) | User decision: keep header minimal with Menu/Philosophy/FAQ | ✓ Good |
| Page-specific inline FAQ schema separate from global FAQSchema | Different Q&As for different pages; placed in Layout slot not head | ✓ Good |
| Speakable schema with CSS selectors on GEO pages | Targets H1 + lead paragraph for voice assistant extraction | ✓ Good |
| E.164 tel: URIs across all components | RFC 3966 compliance; consistent with RestaurantSchema format | ✓ Good |

---

*Last updated: 2026-02-22 after v1.0 milestone*
