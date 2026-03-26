# Roadmap: Spice Grill & Bar Website

## Milestones

- ✅ **v1.0 SEO/GEO/AEO Optimization** — Phases 1-6 (shipped 2026-02-22)
- 🚧 **v2.0 UI Facelift — The Radiant Sommelier** — Phases 7-10 (in progress)

## Phases

<details>
<summary>✅ v1.0 SEO/GEO/AEO Optimization (Phases 1-6) — SHIPPED 2026-02-22</summary>

- [x] Phase 1: Schema Fixes (1/1 plans) — completed 2026-02-21
- [x] Phase 2: Schema Additions (2/2 plans) — completed 2026-02-21
- [x] Phase 3: FAQ Expansion (1/1 plans) — completed 2026-02-21
- [x] Phase 4: Content Infrastructure (1/1 plans) — completed 2026-02-21
- [x] Phase 5: GEO Content Pages (2/2 plans) — completed 2026-02-21
- [x] Phase 6: Data Consistency & Lighthouse Coverage (1/1 plans) — completed 2026-02-22

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

---

### 🚧 v2.0 UI Facelift — The Radiant Sommelier (In Progress)

**Milestone Goal:** Redesign the visual identity of all 4 pages following the DESIGN.md spec, upgrade TailwindCSS to v4 with CSS-first configuration, and establish a hybrid design token system with light and dark modes.

#### Phases

- [ ] **Phase 7: Infrastructure** — Migrate to TailwindCSS v4, swap animation and font packages, verify build green
- [x] **Phase 8: Token System** — Define surface hierarchy and semantic color tokens, establish light/dark mode values (completed 2026-03-26)
- [ ] **Phase 9: Visual Redesign** — Re-skin all 4 pages component by component using the new token system
- [ ] **Phase 10: Quality Assurance** — Verify Lighthouse thresholds, WCAG AA contrast, and animation correctness

## Phase Details

### Phase 7: Infrastructure
**Goal**: The site builds and runs cleanly on TailwindCSS v4, with dark mode working, animations working, new fonts installed, and all v3 breaking changes resolved — so visual work can begin on a stable foundation
**Depends on**: Nothing (first phase of v2.0)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06
**Success Criteria** (what must be TRUE):
  1. `npm run build` completes without errors on TailwindCSS v4 with `@tailwindcss/vite` in `vite.plugins[]`
  2. Toggling `class="dark"` on `<html>` in devtools produces correct dark backgrounds on Header and Sheet components
  3. The Sheet (mobile nav) opens and closes with its slide animation intact after `tw-animate-css` replaces `tailwindcss-animate`
  4. Manrope Variable and Inter Variable fonts render in the browser with no layout shift (CLS < 0.1 confirmed via `test:lhci`)
  5. Lighthouse scores on all 4 pages are unchanged from v1.0 baseline — migration introduces no regressions
**Plans**: 2 plans
Plans:
- [x] 07-01-PLAN.md — TailwindCSS v4 migration: packages, config, CSS-first globals, utility renames, fonts
- [x] 07-02-PLAN.md — Visual verification checkpoint: dark mode toggle, animations, font rendering

### Phase 8: Token System
**Goal**: Every color and font in the design system is defined as a named token in `globals.css`, with both light and dark mode values specified, so that any component can reference `bg-surface-dim` or `text-on-surface` without needing to know raw color values
**Depends on**: Phase 7
**Requirements**: TOKEN-01, TOKEN-02, TOKEN-03, TOKEN-04, TOKEN-05
**Success Criteria** (what must be TRUE):
  1. Applying `bg-surface-dim`, `bg-surface-container`, `bg-surface-container-high`, and `bg-surface-bright` to a test element produces visually distinct warm tones in both light and dark mode
  2. Existing shadcn components (Button, Sheet, DropdownMenu) render correctly in both modes without any class changes — the `@theme inline` hybrid remapping is transparent to them
  3. Headings rendered with `font-display` show Manrope; body text rendered with `font-sans` shows Inter
  4. The `.glass` and `.glass-card` utility classes produce warm-tinted blur surfaces with inner glow, not the old neutral gray glassmorphism
**Plans**: 5 plans
Plans:
- [x] 08-01-PLAN.md — Rewrite globals.css with M3 token system (surface, semantic, glass, gradient utilities)
- [x] 08-02-PLAN.md — Migrate Radix UI components and brand-* references to M3 token classes
- [x] 08-03-PLAN.md — Migrate remaining components (Footer, OurStory, Location, Order, GoogleMap, AstroButton) to M3 tokens
- [x] 08-04-PLAN.md — Replace font-serif with font-display and run zero-remnant verification sweep
- [x] 08-05-PLAN.md — Gap closure: migrate remaining zinc-/orange-/dark: overrides in Hero, ReviewsSection, near-grand-canyon, MobileActionButtons

### Phase 9: Visual Redesign
**Goal**: Every component on all 4 pages reflects the Radiant Sommelier aesthetic — warm surface depth, Manrope headlines, Inter body text, orange used sparingly, structural borders replaced by tonal background shifts, and glassmorphism budgeted to Header, Sheet, and DropdownMenu only
**Depends on**: Phase 8
**Requirements**: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, VISUAL-06, VISUAL-07, VISUAL-08, VISUAL-09, VISUAL-10
**Success Criteria** (what must be TRUE):
  1. The Hero section shows a Manrope headline at `display-lg` (3.5rem) scale with no orange text except the primary CTA button
  2. No visible hard border lines appear between sections or inside cards on any of the 4 pages — all separation comes from background tonal shifts
  3. The orange `#FF4B12` appears in no more than 4 visually distinct contexts across the entire site
  4. All 4 pages (Home, FAQ, Near Grand Canyon, Directions) are visually consistent with the DESIGN.md surface hierarchy in both light and dark mode
  5. The Header glassmorphism uses warm-tinted blur; ambient cards use background color shifts only (no `backdrop-blur` on cards)
**Plans**: TBD

### Phase 10: Quality Assurance
**Goal**: The redesigned site passes all automated quality gates and both visual modes are verifiably accessible — confirming no performance, contrast, or animation regressions were introduced by the facelift
**Depends on**: Phase 9
**Requirements**: QA-01, QA-02, QA-03
**Success Criteria** (what must be TRUE):
  1. `npm run test:lhci` passes on all 4 pages with LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility >= 90, Best Practices >= 80, SEO >= 90
  2. Every text/background color pair on the site meets WCAG AA (4.5:1 contrast ratio) in both light and dark mode
  3. The Sheet (mobile nav), DropdownMenu, and MobileActionButtons all animate open and closed correctly in the browser with `tw-animate-css`
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 7 → 8 → 9 → 10

| Phase | Milestone | Plans Complete | Status | Completed |
| --- | --- | --- | --- | --- |
| 1. Schema Fixes | v1.0 | 1/1 | Complete | 2026-02-21 |
| 2. Schema Additions | v1.0 | 2/2 | Complete | 2026-02-21 |
| 3. FAQ Expansion | v1.0 | 1/1 | Complete | 2026-02-21 |
| 4. Content Infrastructure | v1.0 | 1/1 | Complete | 2026-02-21 |
| 5. GEO Content Pages | v1.0 | 2/2 | Complete | 2026-02-21 |
| 6. Data Consistency & LH Coverage | v1.0 | 1/1 | Complete | 2026-02-22 |
| 7. Infrastructure | v2.0 | 0/2 | Not started | - |
| 8. Token System | v2.0 | 5/5 | Complete   | 2026-03-26 |
| 9. Visual Redesign | v2.0 | 0/TBD | Not started | - |
| 10. Quality Assurance | v2.0 | 0/TBD | Not started | - |
