# Requirements — v2.0 UI Facelift: The Radiant Sommelier

## Infrastructure

- [x] **INFRA-01**: Site builds and runs on TailwindCSS v4 with `@tailwindcss/vite` plugin replacing `@astrojs/tailwind`
- [x] **INFRA-02**: CSS configuration uses `@import "tailwindcss"` and `@theme` directive, `tailwind.config.mjs` deleted
- [x] **INFRA-03**: All v4 breaking utility renames applied (`shadow-sm`→`shadow-xs`, `outline-none`→`outline-hidden`, `ring`→`ring-3`, `!` position flipped)
- [x] **INFRA-04**: Dark mode works correctly with `@custom-variant dark (&:where(.dark, .dark *))` syntax
- [x] **INFRA-05**: `autoprefixer` removed (Tailwind v4 Lightning CSS handles prefixing)
- [x] **INFRA-06**: `tailwindcss-animate` replaced with `tw-animate-css`, Sheet/DropdownMenu/MobileActionButtons verified functional

## Token System

- [x] **TOKEN-01**: Surface hierarchy tokens defined (5 depth levels: dim, container-low, container, container-high, bright) for dark mode per DESIGN.md
- [x] **TOKEN-02**: Light mode surface hierarchy tokens defined as warm-tint inversions of dark palette
- [x] **TOKEN-03**: Shadcn semantic tokens (primary, card, muted, accent, etc.) remapped to DESIGN.md colors via hybrid `@theme inline` pattern
- [x] **TOKEN-04**: Font families registered in `@theme` — `--font-sans: "Inter"`, `--font-display: "Manrope"`
- [x] **TOKEN-05**: All CSS variables use full color values (not bare HSL triples) compatible with Tailwind v4

## Visual Redesign

- [x] **VISUAL-01**: Manrope (display/headlines) + Inter (body/labels) replace Open Sans + Playfair Display across all 4 pages
- [x] **VISUAL-02**: Glassmorphism utilities updated per DESIGN.md — `backdrop-blur(20px-32px)`, tinted shadows using `surface_container_lowest`, budgeted to Header/Sheet/Dropdown only
- [x] **VISUAL-03**: "No-Line Rule" enforced — structural borders replaced with background tonal shifts using surface hierarchy
- [x] **VISUAL-04**: Editorial typography scale applied — `display-lg` (3.5rem) for hero moments, dramatic scale shifts per DESIGN.md
- [x] **VISUAL-05**: `.glass` and `.glass-card` utilities migrated to `@utility` directive syntax
- [x] **VISUAL-06**: Home page sections redesigned (Hero, OurStory, Reviews, Menu, Order, Location) following DESIGN.md
- [x] **VISUAL-07**: FAQ page redesigned following DESIGN.md surface hierarchy and typography
- [x] **VISUAL-08**: Near Grand Canyon page redesigned following DESIGN.md
- [x] **VISUAL-09**: Directions page redesigned following DESIGN.md
- [x] **VISUAL-10**: Primary orange `#FF4B12` used sparingly as "laser not floodlight" per DESIGN.md directive

## Quality

- [x] **QA-01**: Lighthouse CI passes on all 4 pages (LCP < 4s, TBT < 600ms, CLS < 0.1, Accessibility ≥ 90, SEO ≥ 90)
- [x] **QA-02**: Both light and dark modes render correctly with WCAG AA contrast ratios
- [x] **QA-03**: `tw-animate-css` animations verified in Sheet, DropdownMenu, and MobileActionButtons components

## Future Requirements

- [ ] Additional content pages (`/about/`, `/route-66-dining/`) with DESIGN.md styling (deferred from v1.0 Active)
- [ ] Fix `servesCuisine` in RestaurantSchema (deferred from v1.0 Active)
- [ ] Halal messaging revision (deferred from v1.0 Active, wording TBD)

## Out of Scope

- New page routes or content pages — this milestone is visual redesign only
- Online ordering system changes — Toast integration unchanged
- Schema/structured data modifications — v1.0 schema work is complete
- Server-side rendering — site stays fully static

## Traceability

| REQ-ID | Phase | Plan | Status |
| --- | --- | --- | --- |
| INFRA-01 | Phase 7 | 07-01 | Complete |
| INFRA-02 | Phase 7 | 07-01 | Complete |
| INFRA-03 | Phase 7 | 07-01 | Complete |
| INFRA-04 | Phase 7 | 07-01, 07-02 | Complete |
| INFRA-05 | Phase 7 | 07-01 | Complete |
| INFRA-06 | Phase 7 | 07-01, 07-02 | Complete |
| TOKEN-01 | Phase 8 | 08-01 | Complete |
| TOKEN-02 | Phase 8 | 08-01 | Complete |
| TOKEN-03 | Phase 8 | 08-02, 08-03, 08-04, 08-05 | Complete |
| TOKEN-04 | Phase 8 | 08-01, 08-04 | Complete |
| TOKEN-05 | Phase 8 | 08-01 | Complete |
| VISUAL-01 | Phase 9 | 09-01 | Complete |
| VISUAL-02 | Phase 9 | 09-04 | Complete |
| VISUAL-03 | Phase 9 | 09-03, 09-04 | Complete |
| VISUAL-04 | Phase 9 | 09-01 | Complete |
| VISUAL-05 | Phase 9 | 09-01 | Complete |
| VISUAL-06 | Phase 9 | 09-02, 09-03, 09-04 | Complete |
| VISUAL-07 | Phase 9 | 09-05 | Complete |
| VISUAL-08 | Phase 9 | 09-05 | Complete |
| VISUAL-09 | Phase 9 | 09-05 | Complete |
| VISUAL-10 | Phase 9 | 09-02 | Complete |
| QA-01 | Phase 10 | 10-01, 10-02 | Complete |
| QA-02 | Phase 10 | 10-01, 10-02 | Complete |
| QA-03 | Phase 10 | 10-01, 10-03 | Complete |
