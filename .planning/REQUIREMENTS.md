# Requirements — v2.0 UI Facelift: The Radiant Sommelier

## Infrastructure

- [ ] **INFRA-01**: Site builds and runs on TailwindCSS v4 with `@tailwindcss/vite` plugin replacing `@astrojs/tailwind`
- [ ] **INFRA-02**: CSS configuration uses `@import "tailwindcss"` and `@theme` directive, `tailwind.config.mjs` deleted
- [ ] **INFRA-03**: All v4 breaking utility renames applied (`shadow-sm`→`shadow-xs`, `outline-none`→`outline-hidden`, `ring`→`ring-3`, `!` position flipped)
- [ ] **INFRA-04**: Dark mode works correctly with `@custom-variant dark (&:where(.dark, .dark *))` syntax
- [ ] **INFRA-05**: `autoprefixer` removed (Tailwind v4 Lightning CSS handles prefixing)
- [ ] **INFRA-06**: `tailwindcss-animate` replaced with `tw-animate-css`, Sheet/DropdownMenu/MobileActionButtons verified functional

## Token System

- [ ] **TOKEN-01**: Surface hierarchy tokens defined (5 depth levels: dim, container-low, container, container-high, bright) for dark mode per DESIGN.md
- [ ] **TOKEN-02**: Light mode surface hierarchy tokens defined as warm-tint inversions of dark palette
- [ ] **TOKEN-03**: Shadcn semantic tokens (primary, card, muted, accent, etc.) remapped to DESIGN.md colors via hybrid `@theme inline` pattern
- [ ] **TOKEN-04**: Font families registered in `@theme` — `--font-sans: "Inter"`, `--font-display: "Manrope"`
- [ ] **TOKEN-05**: All CSS variables use full color values (not bare HSL triples) compatible with Tailwind v4

## Visual Redesign

- [ ] **VISUAL-01**: Manrope (display/headlines) + Inter (body/labels) replace Open Sans + Playfair Display across all 4 pages
- [ ] **VISUAL-02**: Glassmorphism utilities updated per DESIGN.md — `backdrop-blur(20px-32px)`, tinted shadows using `surface_container_lowest`, budgeted to Header/Sheet/Dropdown only
- [ ] **VISUAL-03**: "No-Line Rule" enforced — structural borders replaced with background tonal shifts using surface hierarchy
- [ ] **VISUAL-04**: Editorial typography scale applied — `display-lg` (3.5rem) for hero moments, dramatic scale shifts per DESIGN.md
- [ ] **VISUAL-05**: `.glass` and `.glass-card` utilities migrated to `@utility` directive syntax
- [ ] **VISUAL-06**: Home page sections redesigned (Hero, OurStory, Reviews, Menu, Order, Location) following DESIGN.md
- [ ] **VISUAL-07**: FAQ page redesigned following DESIGN.md surface hierarchy and typography
- [ ] **VISUAL-08**: Near Grand Canyon page redesigned following DESIGN.md
- [ ] **VISUAL-09**: Directions page redesigned following DESIGN.md
- [ ] **VISUAL-10**: Primary orange `#FF4B12` used sparingly as "laser not floodlight" per DESIGN.md directive

## Quality

- [ ] **QA-01**: Lighthouse CI passes on all 4 pages (LCP < 4s, TBT < 600ms, CLS < 0.1, Accessibility ≥ 90, SEO ≥ 90)
- [ ] **QA-02**: Both light and dark modes render correctly with WCAG AA contrast ratios
- [ ] **QA-03**: `tw-animate-css` animations verified in Sheet, DropdownMenu, and MobileActionButtons components

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
| INFRA-01 | — | — | Pending |
| INFRA-02 | — | — | Pending |
| INFRA-03 | — | — | Pending |
| INFRA-04 | — | — | Pending |
| INFRA-05 | — | — | Pending |
| INFRA-06 | — | — | Pending |
| TOKEN-01 | — | — | Pending |
| TOKEN-02 | — | — | Pending |
| TOKEN-03 | — | — | Pending |
| TOKEN-04 | — | — | Pending |
| TOKEN-05 | — | — | Pending |
| VISUAL-01 | — | — | Pending |
| VISUAL-02 | — | — | Pending |
| VISUAL-03 | — | — | Pending |
| VISUAL-04 | — | — | Pending |
| VISUAL-05 | — | — | Pending |
| VISUAL-06 | — | — | Pending |
| VISUAL-07 | — | — | Pending |
| VISUAL-08 | — | — | Pending |
| VISUAL-09 | — | — | Pending |
| VISUAL-10 | — | — | Pending |
| QA-01 | — | — | Pending |
| QA-02 | — | — | Pending |
| QA-03 | — | — | Pending |
