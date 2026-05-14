# Spice Grill & Bar — Website

## Current Milestone: v3.1 AEO Gap Fixes

**Goal:** Close 7 AEO compliance and coverage gaps identified in the post-v3.0 audit — schema/DOM alignment, entity disambiguation, Speakable coverage, voice directions schema, and AI crawler discovery.

**Target features:**
- Fix home page FAQPage schema to match the 8 visible questions (not all 34 — schema/DOM mismatch)
- Add Speakable schema to `/faq/` page (all 34 Q&As visible but zero voice annotation)
- Add `@id` + `sameAs` to `RestaurantSchema.astro` for Knowledge Graph + AI entity disambiguation
- Add `HowTo` schema to `/directions/` for 3 cities (Flagstaff, Williams, Las Vegas)
- Extend Directions page Speakable to cover per-city direction sections
- Expand FAQ page meta description to reflect all 34 topic categories
- Link `llms-full.txt` in `<head>` + fix `rel="help"` → `rel="alternate"` for AI crawler discovery

## What This Is

The production website for Spice Grill & Bar, an authentic Punjabi Indian restaurant at I-40 Exit 146 in Ash Fork, Arizona (Route 66). Built on Astro 5 with React islands, optimized for local SEO, AI answer engines (AEO), and Lighthouse performance. The site has 5 content pages with full structured data coverage, 34 voice-optimized FAQ entries, and CI-enforced AEO gates that prevent data drift before deploy.

## Core Value

AI engines and Google must surface Spice Grill & Bar as _the_ answer when anyone asks about a food stop on I-40 or an Indian restaurant near the Grand Canyon, Williams, or Seligman.

## Requirements

### Validated

- ✓ Astro 5 static site with React islands architecture — existing
- ✓ TailwindCSS v4 CSS-first config with M3 surface token system — v2.0
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
- ✓ RestaurantSchema expanded with geo, areaServed (13 entries incl. Kaibab Estates West Place), aggregateRating (build-time), hasMap, OrderAction, containedInPlace — v1.0/v3.0
- ✓ OrganizationSchema with sameAs (Google Maps, Yelp, TripAdvisor, Facebook, Instagram) — v1.0
- ✓ WebSiteSchema with GEO-optimized description, publisher, inLanguage — v1.0
- ✓ FAQ expanded from 9 → 34 voice-optimized AEO entries with dynamic FAQSchema rendering — v1.0/v3.0
- ✓ /near-grand-canyon/ page with AEO passage structure, speakable schema, inline FAQ schema — v1.0
- ✓ /directions/ page with 7 per-city sections, Google Maps embed, NAP address blocks — v1.0
- ✓ BreadcrumbSchema label generation for hyphenated slugs — v1.0
- ✓ Footer Explore section with page links and social links — v1.0
- ✓ Lighthouse CI coverage for all 5 live pages (/, /near-grand-canyon/, /near-williams/, /directions/, /faq/) — v1.0/v3.0
- ✓ llms.txt and llms-full.txt with proximity data, correct hours, all 5 page URLs, and 5 new AEO sections — v1.0/v3.0
- ✓ Manrope Variable (display) + Inter Variable (body) fonts — v2.0
- ✓ Light/dark mode with M3 token system (5 surface levels, full semantic tokens) — v2.0
- ✓ Radiant Sommelier aesthetic: borderless tonal separation, orange budget ≤4 contexts, glass budget 3 components — v2.0
- ✓ WCAG AA contrast in both light and dark mode — v2.0
- ✓ RestaurantSchema: paymentAccepted (8 methods), acceptsReservations (false), amenityFeature (7 entries) — v3.0
- ✓ Monday hours consistent across RestaurantSchema, llms.txt, llms-full.txt — v3.0
- ✓ FAQSchema on home page (/) + visible 8-Q section + SpeakableSpecification — v3.0
- ✓ /near-williams/ GEO page targeting Williams tourists and Kaibab Estates West residents — v3.0
- ✓ aeo-audit.mjs with CI-enforced gates: FAQ count ≥34, llms.txt sections, robots.txt AI-bot allowlist — v3.0

### Active

**v3.1 AEO Gap Fixes:**
- [ ] Fix home page FAQPage schema to match 8 visible questions — `Layout.astro`, `index.astro`
- [ ] Add Speakable schema to `/faq/` page — `faq.astro`
- [ ] Add `@id` + `sameAs` to `RestaurantSchema.astro` for entity disambiguation
- [ ] Add `HowTo` schema to `/directions/` for Flagstaff, Williams, Las Vegas
- [ ] Extend Directions page Speakable to cover per-city direction sections — `directions.astro`
- [ ] Expand FAQ page meta description — `faq.astro`
- [ ] Link `llms-full.txt` in `<head>` + fix `rel="help"` → `rel="alternate"` — `Layout.astro`

**Future milestones:**
- [ ] `/about/` page — full brand narrative with extractable AI passages, Punjabi cuisine context, Ash Fork location identity
- [ ] `/route-66-dining/` page — Route 66 heritage content, road-tripper dining context
- [ ] Halal messaging revised across `llms.txt`, `llms-full.txt`, and `OurStorySection.astro` (wording TBD with owner)
- [ ] Apple Maps Business Connect profile optimization (categories, imagery, Toast integration) — manual, off-site
- [ ] Automated KPI tracker (AI citation frequency, GBP direction requests, review velocity)

### Out of Scope

- New npm dependencies beyond what's needed — keep bundle lean; Lighthouse scores and bundle size non-negotiable
- Server-side rendering / dynamic routes — site must stay fully static (Apache hosting, no runtime)
- Native mobile app — web-first; responsive design handles mobile
- Online ordering system — Toast integration exists; no changes to that system
- Yelp/TripAdvisor/Reddit engagement — manual off-site work, tracked separately
- Google Business Profile posts — manual, not automated by this codebase

## Context

- **Site URL**: https://spicegrillbar66.com
- **Location**: I-40 Exit 146, Ash Fork, AZ 86320
- **Two distinct audiences**: (1) Road-trippers on I-40/Route 66 making a pitstop decision in real time; (2) Local residents in Ash Fork, Williams (~18 mi east), Seligman (~30 mi west), Kaibab Estates West (~5 mi north)
- **AI citation strategy**: Content must be self-contained, extractable passages — AI engines retrieve specific sentences, not full pages
- **Current state (v3.0 shipped)**: 5 pages (home, FAQ, near-grand-canyon, near-williams, directions), ~2,600 LOC (Astro/TS/TSX), 6 schema components, 34 FAQ entries, build-time auto-generated llms-full.txt menu section, 5 CI-enforced AEO gates
- **Tech debt**: 6 non-blocking items in v3.0 (see `.planning/milestones/v3.0-MILESTONE-AUDIT.md` — smoke tests, advisory hints, path gate brittleness); `is:inline` advisory hints on JSON-LD script blocks (pre-existing, consistent with all GEO pages)
- **Codebase map**: See `.planning/codebase/` for full architecture, stack, and conventions

## Constraints

- **Lighthouse thresholds**: LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility ≥ 90, Best Practices ≥ 80, SEO ≥ 90
- **Static hosting**: All pages must generate as `/page/index.html` via Astro's `format: 'directory'` — no server runtime
- **No new npm packages beyond project needs**: Bundle size directly affects Lighthouse TBT
- **Halal replacement copy**: New wording must be agreed upon with owner before execution

## Key Decisions

| Decision | Rationale | Outcome |
| --- | --- | --- |
| Astro 5 over Next.js | Zero JS by default, static output, better Lighthouse scores | ✓ Good |
| Partytown for analytics | Off-main-thread execution preserves TBT budget | ✓ Good |
| Phase order: Schema fixes → additions → FAQ → infra → content → consistency | Fix broken data before adding signals; build infra before content | ✓ Good |
| New content pages in Astro (no new deps) | GEO targeting via dedicated URL structure without adding packages | ✓ Good |
| FAQ expansion via faq.json (not hardcoded) | Keeps data and markup separate; GitHub Actions can extend later | ✓ Good |
| aggregateRating computed at build time from reviews.json | No hardcoded values; auto-updates with weekly review scrape | ✓ Good |
| Header navigation unchanged (Footer Explore instead) | User decision: keep header minimal with Menu/Philosophy/FAQ | ✓ Good |
| Page-specific inline FAQ schema separate from global FAQSchema | Different Q&As for different pages; placed in Layout slot not head | ✓ Good |
| Speakable schema with CSS selectors on GEO pages | Targets H1 + lead paragraph for voice assistant extraction | ✓ Good |
| E.164 tel: URIs across all components | RFC 3966 compliance; consistent with RestaurantSchema format | ✓ Good |
| TailwindCSS v4 with CSS-first config | `@theme` replaces JS config; cleaner token system aligned with DESIGN.md | ✓ Good — Phase 7 |
| Hybrid token system (shadcn + M3 surface hierarchy) | Avoids rewriting every component while gaining DESIGN.md depth system | ✓ Good — Phase 8 |
| Manrope + Inter fonts | DESIGN.md spec: geometric display + maximum readability body | ✓ Good — Phase 7 |
| Light default + dark mode | Both modes redesigned; light stays default for accessibility | ✓ Good — Phase 9 |
| Borderless tonal separation | Structural borders replaced by background tonal shifts across all components | ✓ Good — Phase 9 |
| Orange sparingly (≤4 contexts) | Orange #FF4B12 limited to CTAs, stars, nav hover, accent details | ✓ Good — Phase 9 |
| Glass budget: Header + Sheet only | Warm-tinted glassmorphism restricted to chrome elements; cards use tonal bg | ✓ Good — Phase 9 |
| Walk-in only policy (acceptsReservations: false) | Owner confirmed no reservations; phrasing locked to avoid AI hallucination | ✓ Good — Phase 11 |
| Wi-Fi excluded from amenityFeature | Owner did not confirm Wi-Fi; excluded from schema and llms files to prevent hallucination | ✓ Good — Phase 11 |
| Kaibab Estates West as Place (not City) with north-corrected description | Non-incorporated community; "5 miles north of Ash Fork" per owner (NOT east on I-40) | ✓ Good — Phase 11 |
| FAQSchema gate broadened to home page via path equality | Centralizes gate in Layout.astro; avoids per-page opt-in props | ✓ Good — Phase 11 |
| build-time llms-full.txt menu regeneration | Single source of truth (menu.json → llms-full.txt); eliminates future price drift | ✓ Good — Phase 11 |
| ID-anchored SpeakableSpecification selectors (#home-faq h3/p) | Stable against Tailwind utility renames; survives class changes | ✓ Good — Phase 11 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

*Last updated: 2026-05-13 — v3.1 milestone (AEO Gap Fixes) started*
