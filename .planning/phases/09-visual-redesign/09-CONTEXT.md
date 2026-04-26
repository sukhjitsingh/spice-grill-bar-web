# Phase 9: Visual Redesign - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply the Radiant Sommelier aesthetic to every component across all 4 pages (Home, FAQ, Near Grand Canyon, Directions). This includes: editorial typography scale with 7 levels, no-line rule enforcement, orange restraint to exactly 4 contexts, surface hierarchy depth alternation between sections, and glassmorphism budget enforcement. Remove old font packages. After this phase, every visible element reflects the DESIGN.md spec in both light and dark mode.

Requirements: VISUAL-01, VISUAL-02, VISUAL-03, VISUAL-04, VISUAL-05, VISUAL-06, VISUAL-07, VISUAL-08, VISUAL-09, VISUAL-10

</domain>

<decisions>
## Implementation Decisions

### Typography Scale
- **D-01:** Implement typography as CSS `@utility` classes that bundle font-size + line-height + letter-spacing + font-family. Components use `.text-display-lg` etc. instead of raw Tailwind size classes
- **D-02:** Define 7 editorial scale levels: `display-lg`, `display-md`, `heading-lg`, `heading-md`, `body-lg`, `body-md`, `label-sm` — enables dramatic scale shifts per DESIGN.md editorial hierarchy
- **D-03:** `display-lg` = 3.5rem, Manrope, tight letter-spacing (-0.02em) per DESIGN.md spec — used for hero moments
- **D-04:** Remove old font packages (`@fontsource/open-sans`, `@fontsource/playfair-display`) in this phase — clean break per Phase 7 D-02

### Hero Section
- **D-05:** Info-rich hero layout — H1 is business name "Spice Grill & Bar" in display-lg Manrope, with cuisine type, location, hours, and phone visible above the fold
- **D-06:** Hero includes star rating badge, hero-gradient overlay on background image, and two CTAs: primary orange "ORDER NOW" + tertiary "VIEW MENU"
- **D-07:** All hero text content is crawlable and maps to RestaurantSchema — maximizes SEO/AEO/GEO value for local search and AI answer engines

### Home Page Section Flow
- **D-08:** Story-driven flow: Hero → OurStory → Reviews → Menu → Order → Location
- **D-09:** Each section has per-section personality within the Radiant Sommelier system — not uniform treatment
- **D-10:** Sections alternate surface depths: Hero (surface-dim + hero-gradient), OurStory (surface-container-low), Reviews (surface-dim), Menu (surface-container-low), Order (surface-dim + cta-gradient), Location (surface-container)

### Secondary Pages
- **D-11:** Claude decides redesign depth per page based on current state and SEO/AEO value — full treatment where warranted, lighter touch where layouts already work

### Orange Restraint (VISUAL-10)
- **D-12:** Orange `#FF4B12` / `primary-container` limited to exactly 4 visual contexts:
  1. Primary CTA buttons (ORDER NOW, View Menu)
  2. Star ratings / review scores
  3. Active navigation state in header
  4. Section accent details (gradient lines under headings, icon highlights)
- **D-13:** Everything outside these 4 contexts uses muted surface tones, secondary/tertiary tokens, or on-surface-variant text

### Border Removal & Tonal Separation (VISUAL-03)
- **D-14:** Cards (menu items, review cards, FAQ items) use surface-container on surface-container-low parent — separation via background color difference + 1rem vertical spacing. No borders, no shadows on cards
- **D-15:** Section-to-section boundaries use pure surface alternation — background color change IS the boundary. No dividers, no gradient blends between sections
- **D-16:** Ghost borders (outline-variant at 15% opacity) allowed only where accessibility demands it, not as default

### Claude's Discretion
- Specific font sizes for display-md, heading-lg, heading-md, body-lg, body-md, label-sm (derive from DESIGN.md principles and typographic best practices)
- Per-component line-height and letter-spacing values for each scale level
- How much redesign each secondary page (FAQ, Near Grand Canyon, Directions) needs
- Specific section accent detail implementations (gradient line style, icon highlight approach)
- How to handle the glass utility visual updates if any tuning is needed beyond Phase 8 work
- Responsive breakpoint behavior for typography scale

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Specification
- `docs/DESIGN.md` — The Radiant Sommelier design system spec: surface hierarchy, no-line rule, blur budget, tinted shadows, typography philosophy, component rules, do's and don'ts
- `docs/UI-template.html` — Dark mode M3 palette with glass/gradient utility definitions and component usage examples
- `docs/UI-light-template.html` — Light mode M3 palette and component usage examples

### Current Implementation (To Be Reskinned)
- `src/styles/globals.css` — M3 tokens, @theme inline block, glass/gradient utilities (from Phase 8)
- `src/components/Hero.astro` — Current hero section to be redesigned
- `src/components/OurStorySection.astro` — Story section
- `src/components/ReviewsSection.astro` — Reviews section
- `src/components/MenuSection.tsx` — Menu section (React, client:visible)
- `src/components/OrderSection.astro` — Order/CTA section
- `src/components/LocationSection.astro` — Location + map section
- `src/components/Header.tsx` — Header with glass utility (React, client:load)
- `src/components/Footer.astro` — Site footer
- `src/components/MobileActionButtons.astro` — Mobile CTA buttons
- `src/components/ui/button.tsx` — Radix Button component
- `src/components/ui/AstroButton.astro` — Astro Button component
- `src/components/ui/sheet.tsx` — Radix Sheet (mobile nav)
- `src/components/ui/dropdown-menu.tsx` — Radix DropdownMenu

### Pages
- `src/pages/index.astro` — Home page
- `src/pages/faq.astro` — FAQ page
- `src/pages/near-grand-canyon.astro` — Near Grand Canyon page
- `src/pages/directions.astro` — Directions page

### Prior Phase Context
- `.planning/phases/07-infrastructure/07-CONTEXT.md` — Phase 7: TailwindCSS v4 migration, @utility syntax, font installation
- `.planning/phases/08-token-system/08-CONTEXT.md` — Phase 8: M3 tokens, glass utilities, shadcn removal, hex format

### Requirements
- `.planning/REQUIREMENTS.md` §Visual Redesign — VISUAL-01 through VISUAL-10 acceptance criteria

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/utils.ts` — `cn()` function (clsx + tailwind-merge) for conditional class composition
- `src/components/mode-toggle.tsx` — Dark mode toggle, already works with `.dark` class
- M3 token system in `globals.css` — all surface, primary, secondary tokens ready to use (Phase 8)
- `.glass` and `.glass-card` utilities — already tokenized in Phase 8 (D-14/D-15/D-16)
- `.hero-gradient` and `.cta-gradient` utilities — defined in Phase 8 (D-18/D-19)

### Established Patterns
- Astro components for static content sections, React for interactive (Menu, Header)
- `@utility` directive for custom CSS utilities (Phase 7)
- `@theme inline` block maps CSS vars to Tailwind color namespace
- Surface tokens available: surface-dim, surface-container-low, surface-container, surface-container-high, surface-bright

### Integration Points
- `src/layouts/Layout.astro` — Font imports, global styles, schema injection
- `src/pages/index.astro` — Home page section ordering (will need reorder if flow changes)
- `src/data/menu.json`, `src/data/reviews.json`, `src/data/faq.json` — Data sources unchanged

</code_context>

<specifics>
## Specific Ideas

- Hero must maximize SEO/AEO/GEO value: H1 = business name, cuisine type, location, hours, phone all above the fold and crawlable
- AI answer engines and Google scrape visible structured content — hero info should map to RestaurantSchema
- Reviews section star ratings support rich results in search
- OurStory builds trust signals that AI engines cite when describing restaurants
- Location section is the GEO anchor with LocalBusiness schema connection
- User's primary goal is driving restaurant customers via local SEO, AEO, and GEO — design serves discoverability

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-visual-redesign*
*Context gathered: 2026-03-26*
