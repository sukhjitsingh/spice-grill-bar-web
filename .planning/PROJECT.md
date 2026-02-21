# Spice Grill & Bar — SEO/GEO/AEO Optimization

## What This Is

The production website for Spice Grill & Bar, an authentic Punjabi Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona (Route 66). The Astro 5 migration is complete — this project is the next phase: optimizing the site so it ranks #1 locally and gets cited by AI answer engines for two distinct audiences: I-40 road-trippers/tourists and local residents within a 20-mile radius.

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

### Active

- [ ] RestaurantSchema expanded with `areaServed` array (Williams, Seligman, Kaibab Estates, I-40/Route 66 corridor), `geo` coordinates, `hasMap` (Google Maps URL), `OrderAction`, and `aggregateRating`
- [ ] OrganizationSchema updated with `sameAs` links for Google Maps, Yelp, and TripAdvisor profiles (URLs to be provided)
- [ ] WebSiteSchema updated with GEO-optimized `description` and `publisher` property
- [ ] FAQ expanded from 9 → 20 questions targeting route/highway queries (I-40, Grand Canyon distance, Vegas distance, exit number, Williams/Seligman pickup)
- [ ] New content page: `/about/` — full "About Spice Grill & Bar" with extractable passages for AI crawlers
- [ ] New content page: `/directions/` — driving directions from Las Vegas, Los Angeles, Kingman, Phoenix, Flagstaff; emphasize I-40 Exit 146
- [ ] New content page: `/near-grand-canyon/` — Indian restaurant ~70 miles / ~1 hr from Grand Canyon South Rim
- [ ] New content page: `/route-66-dining/` — Route 66 heritage, Ash Fork history, dining context
- [ ] Halal messaging revised across `llms.txt`, `llms-full.txt`, and `OurStorySection.astro` (wording TBD — placeholder replacement)
- [ ] Apple Maps Business Connect profile optimized (categories, imagery, Toast ordering integration) — manual, off-site
- [ ] Automated KPI tracker implemented (AI citation frequency, GBP direction requests, review velocity)

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
- **Two distinct audiences**: (1) Road-trippers on I-40/Route 66 making a pitstop decision in real time; (2) Local residents in Ash Fork, Williams (~22 mi), Seligman (~30 mi), Kaibab Estates (~15 mi)
- **AI citation strategy**: Content must be self-contained, extractable passages — AI engines retrieve specific sentences, not full pages
- **Known schema gaps**: `areaServed` too narrow, missing `geo`, `hasMap`, `OrderAction`, `aggregateRating`, `sameAs` links — documented in `docs/ImprovementPlan.md`
- **Schema URLs needed**: User must provide Yelp, TripAdvisor, and Google Maps profile URLs before OrganizationSchema can be updated
- **Codebase map**: See `.planning/codebase/` for full architecture, stack, and conventions

## Constraints

- **No new npm packages**: Lighthouse scores and bundle size are non-negotiable; adding dependencies requires explicit justification
- **Lighthouse thresholds**: LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility ≥ 90, Best Practices ≥ 80, SEO ≥ 90 — nothing can degrade these
- **Schema URLs**: `sameAs` links for Yelp, TripAdvisor, Google Maps must be provided before Phase 1 schema work is considered complete
- **Halal replacement copy**: New heading/section copy for `OurStorySection.astro` must be agreed upon before Phase 2 content refresh executes
- **Static hosting**: All pages must generate as `/page/index.html` via Astro's `format: 'directory'` — no server runtime

## Key Decisions

| Decision                                                                | Rationale                                                         | Outcome   |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------- | --------- |
| Astro 5 over Next.js                                                    | Zero JS by default, static output, better Lighthouse scores       | ✓ Good    |
| Partytown for analytics                                                 | Off-main-thread execution preserves TBT budget                    | ✓ Good    |
| Phase order: Schema/Content → Halal Refresh → Apple Maps → KPI Tracking | Code changes first, off-site and automation later                 | — Pending |
| New content pages in Astro (no new deps)                                | GEO targeting via dedicated URL structure without adding packages | — Pending |
| FAQ expansion via faq.json (not hardcoded)                              | Keeps data and markup separate; GitHub Actions can extend later   | — Pending |

---

_Last updated: 2026-02-20 after initialization_
