# Feature Landscape: UI Facelift — The Radiant Sommelier

**Domain:** Visual design system overhaul on existing Astro 5 + React restaurant site
**Researched:** 2026-03-24
**Milestone:** v2.0 UI Facelift

---

## Summary

This research covers what is required to implement "The Radiant Sommelier" design spec across 6
design-system features: surface hierarchy tokens, no-line boundaries, glassmorphism, editorial
typography, hybrid token migration, and light/dark mode with a dark-first spec. The site is already
built — nothing here is greenfield. Every feature maps to an existing component that must be
re-skinned without breaking Lighthouse scores, accessibility thresholds, or the static build.

The primary complexity is the **Tailwind v3 → v4 migration** that underpins everything. The token
system, glassmorphism utilities, animation library, and dark mode strategy all change in v4. The
design features themselves are straightforward — they become hard only when layered on top of an
in-flight framework migration.

---

## Table Stakes

Features that must work for the facelift to be considered complete. Missing any one of these means
the DESIGN.md spec is not implemented — the site just looks patched.

---

### 1. TailwindCSS v3 → v4 Migration

**Why expected:** Every other feature in this milestone depends on the v4 `@theme` directive and
CSS-first token system. The DESIGN.md surface hierarchy cannot be expressed cleanly in v3's
`tailwind.config.mjs`. Token migration, glassmorphism overhaul, and dark mode strategy all assume
v4. This is the prerequisite gate.

**What changes:**
- Replace `@astrojs/tailwind` integration with `@tailwindcss/vite` plugin in `astro.config.mjs`
- Delete `tailwind.config.mjs` entirely
- Replace `@tailwind base/components/utilities` directives in `globals.css` with `@import "tailwindcss"`
- Rewrite all design tokens into `@theme {}` blocks
- Handle renamed utilities: `bg-opacity-*` → `bg-black/[n]`, `flex-shrink-*` → `shrink-*`,
  `overflow-ellipsis` → `text-ellipsis`, `decoration-slice/clone` → `box-decoration-*`
- `border` utility no longer applies a default border color (BREAKING — every `border` usage must
  be audited; `border border-zinc-200` pattern must be explicit)

**Existing dependency to migrate:** `tailwindcss-animate` is used in MobileActionButtons
(`animate-in`, `slide-in-from-bottom-4`, `fade-in`), Sheet, and DropdownMenu. `tailwindcss-animate`
was deprecated March 19, 2025 — migration path is `tw-animate-css` (pure CSS replacement). This is
a `npm install tw-animate-css` + swap `@plugin "tailwindcss-animate"` for `@import "tw-animate-css"`.
The class names remain the same; this is a drop-in replacement.

**Complexity:** High. Not because any single change is hard, but because the surface area is large
(every component file, globals.css, astro.config.mjs) and every missed `border` without a color
class is a regression.

**Dependencies:** None — this must be done first before any other feature.

---

### 2. Surface Hierarchy Color Token System (5 Depth Levels)

**Why expected:** The DESIGN.md spec defines 5 named surface levels that replace the current
zinc-based background system. Without these tokens as named CSS variables, the no-line rule and
glassmorphism overhaul cannot be implemented — they reference token names, not hex values.

**What the DESIGN.md requires:**

| Level | Token | Hex | Current analog |
|-------|-------|-----|----------------|
| 0 | `surface_dim` | `#1f0f0b` | `bg-zinc-950` (dark) / `bg-white` (light) |
| 1 | `surface_container_low` | `#281713` | `bg-zinc-900` (dark) |
| 2 | `surface_container` | `#2d1b17` | `bg-zinc-800` (dark) |
| 3 | `surface_bright` | `#49342f` | `bg-zinc-700` (dark) |
| 4 | `surface_container_high` | ~`#5a403a` (interpolated) | none |
| 5 | `surface_container_highest` | ~`#6b4c45` (interpolated) | none |

**How it maps to Tailwind v4 `@theme`:**

```css
@theme {
  --color-surface-dim: #1f0f0b;
  --color-surface-container-low: #281713;
  --color-surface-container: #2d1b17;
  --color-surface-bright: #49342f;
  --color-surface-container-high: #5a403a;
  --color-surface-container-highest: #6b4c45;
}
```

These become `bg-surface-dim`, `bg-surface-container-low`, etc. as Tailwind utilities automatically.

**Light mode adaptation:** The DESIGN.md is dark-first. Light mode must be a warm inversion, not
neutral gray. Analogous light-mode tokens use warm cream/linen tones instead of obsidian:

| Level | Light hex (recommended) |
|-------|-------------------------|
| surface_dim | `#fdf6f0` (warm white) |
| surface_container_low | `#f5ece4` |
| surface_container | `#ede0d4` |
| surface_bright | `#e0cfc4` |

These are overridden in `.dark {}` to restore the DESIGN.md dark values.

**Complexity:** Low to Medium. Token definition is low complexity. Applying them across ~12
component files replaces `bg-zinc-*` with `bg-surface-*` — mechanical but requires component-by-
component audit. The real risk is missing places that currently reference `bg-background` (the
shadcn token) — those are the hardest to find because they're inherited through the shadcn component
library not written by this project.

**Dependencies:** Tailwind v4 migration must be complete.

---

### 3. Hybrid Token Migration (shadcn Semantic Names + Surface Hierarchy)

**Why expected:** The site uses shadcn/ui components (Button, Sheet, DropdownMenu). These
components reference `--background`, `--foreground`, `--primary`, `--card`, etc. — the shadcn
semantic token names. These cannot be removed or renamed without breaking the shadcn components.
The hybrid strategy keeps both token systems alive simultaneously.

**How it works in Tailwind v4:**

```css
/* Step 1: Define surface values as base references */
:root {
  --surface-dim: #fdf6f0;
  --surface-container-low: #f5ece4;
  /* ... light values ... */

  /* shadcn tokens remapped to surface hierarchy */
  --background: var(--surface-dim);
  --card: var(--surface-container-low);
  --popover: var(--surface-container-low);
}

.dark {
  --surface-dim: #1f0f0b;
  --surface-container-low: #281713;
  /* ... dark values ... */
}

/* Step 2: @theme inline exposes both as Tailwind utilities */
@theme inline {
  --color-background: var(--background);
  --color-card: var(--card);
  --color-surface-dim: var(--surface-dim);
  --color-surface-container-low: var(--surface-container-low);
}
```

**Concrete token remapping required:**

| shadcn token | Maps to surface level | Rationale |
|---|---|---|
| `--background` | `surface_dim` (Level 0) | Page base layer |
| `--card` | `surface_container_low` (Level 1) | Card sections |
| `--popover` | `surface_container` (Level 2) | Floating dropdowns |
| `--muted` | `surface_container_low` | Muted backgrounds |
| `--accent` | `surface_bright` (Level 3) | Hover states |
| `--border` | `outline_variant` at 15% opacity | Ghost border fallback |

**Components that reference shadcn tokens directly (cannot break):**
- `Button` (uses `bg-primary`, `bg-secondary`, etc.)
- `Sheet` (uses `bg-background`, `border-l`)
- `DropdownMenu` (uses `bg-popover`, `text-popover-foreground`)
- `mode-toggle` (uses `bg-background`)

**Complexity:** Medium. The mapping logic is clear but the implementation requires surgical precision
— `@theme inline` syntax must be correct or Tailwind v4 won't generate the utility classes. The risk
is introducing circular variable references (`var(--background)` referencing `var(--surface-dim)`
which must also be defined in `:root`). Test with a single component before full migration.

**Dependencies:** Tailwind v4 migration, surface hierarchy token definition.

---

### 4. Font Migration: Open Sans + Playfair → Manrope + Inter

**Why expected:** The DESIGN.md calls out Manrope (display/headlines) and Inter (body/labels)
explicitly. The current Open Sans + Playfair Display pairing does not achieve the "geometric,
architectural" editorial feel specified. Playfair's serif serifs actively conflict with the
"pressure-cooked," modern sommelier aesthetic.

**What changes:**
- Remove `@fontsource/open-sans` and `@fontsource/playfair-display` imports from `Layout.astro`
- Install `@fontsource-variable/manrope` and `@fontsource-variable/inter` (variable font versions
  for performance — one file covers all weights vs. 3+ separate weight files currently)
- Update font-family tokens in `@theme`:
  ```css
  @theme {
    --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
    --font-display: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;
  }
  ```
- Audit every `font-serif` class (currently used on: Header nav, Hero h1, Button, MenuSection
  category tabs, MobileActionButtons) and replace with `font-display`
- `font-sans` body default stays as `font-sans` — only the value changes

**Performance note:** Variable fonts reduce bundle size. Current setup: 6 font files (Open Sans
400/500/700, Playfair 400/500/700). Variable replacement: 2 font files (Manrope Variable, Inter
Variable). Net reduction of ~4 HTTP requests on first load.

**Complexity:** Low. Package swap + class rename. The only risk is missing a `font-serif` reference
and having fallback system-serif render in one component.

**Dependencies:** Tailwind v4 migration (for `@theme` font tokens). No new npm packages beyond
fontsource variable versions (which are already in the fontsource ecosystem — same package prefix).

---

### 5. No-Line Rule Implementation (Background Shifts Instead of Borders)

**Why expected:** The DESIGN.md is explicit: "Under no circumstances are 1px solid borders to be
used for sectioning or layout containment." This is the most pervasive change — the current codebase
uses borders extensively for section separation.

**Current violations across the codebase:**

| Component | Current border | Replacement |
|---|---|---|
| `MenuSection.tsx` | `border-t border-zinc-200` on section | Remove; `bg-surface-container-low` on section vs `bg-surface-dim` on surrounding |
| `MenuSection.tsx` | `border border-zinc-200` on mobile tab nav | Remove; background tonal shift to `bg-surface-container` |
| `MenuSection.tsx` | `border-b border-orange-300` on category h3 | Remove; spacing + color-only separation |
| `Footer.astro` | `border-t border-zinc-200` | Remove; section background shift |
| `Footer.astro` | `border-t border-zinc-100` on bottom bar | Remove; vertical space only |
| `Footer.astro` | `border-t border-zinc-100` in Explore section | Remove; spacing |
| `Header.tsx` | `border-b border-transparent` (scrolled: `glass`) | Keep as "ghost border" at `outline_variant` 15% opacity |
| `Header.tsx` | `border-l border-zinc-200` divider in nav | Remove; vertical spacing |
| `MobileActionButtons.astro` | `border border-white/20` on container | This IS a glassmorphism stroke — keep at reduced opacity |
| `ReviewsSection.astro` | `border border-zinc-200` on cards | This IS a glassmorphism surface stroke — keep at `outline_variant` 20% opacity |

**The "Ghost Border" exception:** When accessibility requires a visible edge (interactive elements,
focus states, glassmorphism surfaces), use `outline_variant` at 15-20% opacity. It should "feel"
rather than "be seen."

**Implementation pattern:**
```css
/* Token for ghost border */
@theme {
  --color-outline-variant: oklch(from #49342f l c h / 0.2);
}
```
Applied as `border border-outline-variant` where needed — technically a border but visually
imperceptible as a layout element.

**Complexity:** Low per file, Medium overall. Each component is simple to fix, but there are ~8
components to audit and the border removal must be validated to not break layout in any breakpoint.

**Dependencies:** Surface hierarchy tokens (you need the surface level values to do the background
shifts). Tailwind v4 migration.

---

### 6. Glassmorphism Overhaul (Tinted Shadows, Backdop-Blur, Inner Glow)

**Why expected:** The current `.glass` and `.glass-card` utilities use neutral gray tints
(`bg-white/70`, `bg-zinc-100/50`). DESIGN.md specifies warm-tinted glass using `surface_container_high`
at 70% opacity, `backdrop-blur: 32px`, and a 0.5px inner-glow stroke using `outline_variant` at 20%
opacity. The tinted shadow must use `surface_container_lowest` not black.

**Current `.glass` utility:**
```css
.glass {
  @apply bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg;
}
```

**Target `.glass` utility (DESIGN.md aligned):**
```css
.glass {
  background: color-mix(in oklch, var(--color-surface-container-high) 70%, transparent);
  backdrop-filter: blur(32px);
  -webkit-backdrop-filter: blur(32px);
  border: 0.5px solid color-mix(in oklch, var(--color-outline-variant) 20%, transparent);
  box-shadow: 0px 24px 48px color-mix(in oklch, var(--color-surface-dim) 40%, transparent);
}
```

**Where glass is currently used:**
- `Header.tsx` — scrolled state uses `.glass`
- `MenuSection.tsx` — sidebar nav uses `.glass`
- `OurStorySection.astro` — image overlay caption uses `.glass`
- `MobileActionButtons.astro` — container uses `.glass` + explicit `bg-white/60`
- `OrderSection.astro` — CTA container uses `bg-white/30 backdrop-blur-xl`

**Browser support:** `backdrop-filter` has 96%+ support as of 2025. The `-webkit-` prefix is still
required for Safari. Use `@supports (backdrop-filter: blur(1px))` as a fallback wrapper — solid
`surface_container` without blur is the graceful degradation.

**Accessibility consideration:** Glass surfaces over text content must maintain 4.5:1 contrast ratio
(WCAG AA). The warm tint at 70% opacity over `surface_dim` background is darker than the neutral
glass currently used — this generally improves rather than hurts contrast. Validate with a contrast
checker after implementation.

**Complexity:** Low. The existing utilities just need their values updated. The new `color-mix()`
approach requires modern CSS support (96%+) — same as `backdrop-filter`. No JavaScript changes.

**Dependencies:** Surface hierarchy tokens (to have `--color-surface-container-high` defined).

---

### 7. Light + Dark Mode — Both Modes Redesigned

**Why expected:** Currently dark mode is a generic dark theme (blue-gray zinc palette). Both modes
must be re-skinned to the DESIGN.md palette. Light mode stays as the default; dark mode is activated
by the existing `.dark` class toggle (already implemented in `/public/scripts/theme.js`).

**Current dark mode strategy:** Class-based (`.dark` on `<html>`). The existing `theme.js` script
handles the toggle and persists to `localStorage`. This strategy is correct for v4 — no changes to
the toggle mechanism needed.

**v4 dark mode configuration:**
```css
/* In global.css, after @import "tailwindcss" */
@custom-variant dark (&:where(.dark, .dark *));
```
This replaces the v3 `darkMode: 'class'` config key (which no longer exists in v4).

**Light mode (default) token values:** Warm cream inversion of the DESIGN.md dark palette. The key
principle: no pure grays (never `#888888`); all values must have a warm undertone sourced from the
`#FF4B12` seed. Recommended light mode surfaces:

| Token | Light value | Rationale |
|---|---|---|
| `surface_dim` | `#fdf6f0` | Warm off-white base |
| `surface_container_low` | `#f5ece4` | Section tint |
| `surface_container` | `#ede0d4` | Card backgrounds |
| `surface_bright` | `#e0cfc4` | Elevated elements |
| `on_surface` (text) | `#1f0f0b` | Dark brown on light |
| `on_surface_variant` | `#49342f` | Muted text |

**Dark mode (`.dark`) token values:** The DESIGN.md values as-is:

| Token | Dark value |
|---|---|
| `surface_dim` | `#1f0f0b` |
| `surface_container_low` | `#281713` |
| `surface_container` | `#2d1b17` |
| `surface_bright` | `#49342f` |
| `on_surface` | `#fdf0e8` |
| `on_surface_variant` | `#d4b8aa` |

**Anti-flash requirement:** `theme.js` already runs before paint (`is:inline` in `<head>`). The
CSS variable overrides in `.dark {}` are synchronous. No flash of wrong theme. This is correct and
should not be changed.

**Complexity:** Low. Token value changes. The dark mode mechanism is already working — just the
values change. The risk is that light mode warm tones must be validated for accessibility contrast
at each surface level combination (text on surface, border visibility, etc.).

**Dependencies:** Surface hierarchy tokens, Tailwind v4 migration.

---

## Differentiators

Features from the DESIGN.md that elevate the aesthetic beyond "functional redesign" to "editorial
experience." These are not strictly required for the facelift to be complete, but they are what
distinguish The Radiant Sommelier from a generic dark-mode restaurant theme.

---

### 1. Editorial Typography Scale (Dramatic Size Shifts)

**What it adds:** The DESIGN.md calls for `display-lg` (3.5rem) next to `label-sm` — deliberate
scale tension that signals premium, curated editorial design. The current Hero h1 is `text-5xl
md:text-7xl lg:text-8xl` with no corresponding small-type counterpoint. Adding the "EST. 2024" or
category labels in `label-sm` (0.625rem, letter-spacing: 0.15em) adjacent to large display type
creates the magazine tension the spec describes.

**Token definition:**
```css
@theme {
  --text-display-lg: 3.5rem;       /* Hero h1 */
  --text-display-md: 2.5rem;       /* Section h2 */
  --text-body-md: 1rem;            /* Standard body */
  --text-label-sm: 0.625rem;       /* Eyebrows, captions */
  --leading-display: 1.1;          /* Tight for display */
  --tracking-display: -0.02em;     /* Manrope tight at display size */
  --tracking-label: 0.15em;        /* Expanded for small caps */
}
```

**Where to apply:**
- Hero: The "EST. 2024" badge is already `text-xs tracking-wider` — upgrade to `label-sm` with
  `tracking-[0.15em]`. The H1 moves to `text-display-lg`.
- Section headers in MenuSection, OurStorySection: Currently `text-3xl md:text-5xl` — keep size but
  add the asymmetric label treatment (small descriptor text placed far right using `justify-between`
  flex alignment).
- Review cards: Author name as `body-sm`, date as `label-sm` with tinted text color.

**Complexity:** Low. Class additions and token definitions. No structural changes.

**Dependencies:** Font migration (Manrope must be installed for display tracking to work correctly
at geometric precision — Open Sans looks wrong at tight tracking).

---

### 2. Tinted Ambient Shadows (No Black Shadows)

**What it adds:** Every current `shadow-*` utility generates gray/black shadows. DESIGN.md specifies
shadows must be tinted with `surface_container_lowest` (#190a07 or similar deep brown-black). This
makes shadows feel like occlusion of warm ambient light rather than neutral darkness — the "visual
soul" of the sommelier aesthetic.

**Implementation:**
```css
@theme {
  --shadow-ambient: 0px 24px 48px oklch(from #190a07 l c h / 0.4);
  --shadow-card: 0px 8px 24px oklch(from #190a07 l c h / 0.25);
  --shadow-primary: 0px 4px 12px oklch(from #ff5626 l c h / 0.3);
}
```

Applied as `shadow-[var(--shadow-card)]` in Tailwind v4's arbitrary value syntax. Or defined as
named shadow utilities via `@theme { --shadow-ambient: ...; }` if Tailwind v4's shadow namespace
support allows (it does).

**Where applied:** All cards in ReviewsSection, OurStorySection glass-card elements, OrderSection
CTA container, Header glass effect. The floating `MobileActionButtons` container.

**Complexity:** Low. Shadow value changes. No structural changes.

**Dependencies:** Surface hierarchy tokens for the tint source color.

---

### 3. Asymmetric Editorial Layout Moments

**What it adds:** The DESIGN.md "Do" list includes: "Place a small label far to the right of a
large headline to create a premium editorial grid." This is not a broad layout overhaul — it is
targeted use of `flex justify-between` or `grid` with a small metadata element positioned opposite
a large headline. Used in 2-3 places, it creates the premium feel without requiring a full layout
redesign.

**Where to apply (specific, limited):**
- Hero section: "EST. 2024" badge moves from above the H1 to a right-floated position alongside it
- MenuSection section header: Category name on left, item count or tag on right
- OurStorySection: "Mission / Vision / Values" section headers with small decorative counter

**Complexity:** Low. Small class additions. No component rewrites.

**Dependencies:** Typography tokens, font migration.

---

### 4. Orange Primary as Laser, Not Floodlight

**What it adds:** Currently orange (`#FF4B12` / `brand-orange`) is used on: H3 category names in
MenuSection, active nav tab, CTA button, avatar gradient, stat numbers, hover underline — it
appears 15+ times on the home page. DESIGN.md says "use sparingly. It is a laser, not a floodlight."

**What changes:** Reduce orange to 3-4 high-impact moments:
1. Primary CTA button (`bg-primary_container`)
2. Brand moments (logo hover, active state)
3. The "soul" gradient: `linear-gradient(135deg, #ff5626, inverse_primary)` on hero CTA/hero
   background tint

Everything currently orange-on-hover reverts to `on_surface_variant` (warm brown text). Category
headers in MenuSection lose their orange color and become `on_surface` (near-white in dark, near-
black in light).

**Complexity:** Low (class value changes). Medium in aesthetic judgment — must be done carefully so
the menu doesn't feel flat after removing the category color highlights.

**Dependencies:** Surface hierarchy tokens, on_surface_variant token defined.

---

## Anti-Features

Things to explicitly not do during this facelift. Each wastes time or creates regressions.

---

### 1. Do Not Add New npm Packages for Visual Effects

**Why avoid:** `PROJECT.md` constraints are explicit: "No new npm packages beyond Tailwind v4
migration." The Lighthouse TBT budget (< 600ms) and bundle size are non-negotiable. Every visual
effect in the DESIGN.md spec is achievable with CSS (backdrop-filter, color-mix, CSS gradients,
CSS animations). No JS animation library, no GSAP, no Framer Motion. The MobileActionButtons
already use `animate-in slide-in-from-bottom-4` from `tailwindcss-animate` — migrating to
`tw-animate-css` is a swap, not an addition.

---

### 2. Do Not Animate Glassmorphism on Scroll

**Why avoid:** `backdrop-filter: blur()` is GPU-expensive. Animating it on scroll (e.g., increasing
blur as you scroll down) causes paint storms on mobile, destroys CLS, and burns TBT budget. The
Header's scroll-triggered glassmorphism transition (already exists: `class` changes on scroll) is
acceptable because it is a one-time state change, not a continuous animation. Do not introduce
`transition-all` on anything with `backdrop-filter`.

---

### 3. Do Not Rewrite the React Islands as Astro Components

**Why avoid:** MenuSection and Header are React islands for good reason — they have interactive
state (scroll tracking, category active state, mobile menu open state). Converting them to Astro
would require either losing the interactivity or adding heavy Astro script islands. The existing
React hydration (`client:visible`, `client:load`) is appropriate. The facelift is a re-skin, not an
architecture change.

---

### 4. Do Not Remove the `.dark` Class Toggle Mechanism

**Why avoid:** The site uses a `theme.js` pre-paint script that reads `localStorage` and applies
the `.dark` class before the browser paints — eliminating flash of wrong theme. This is the correct
pattern. The Tailwind v4 `@custom-variant dark` declaration works alongside this pattern
unchanged. Do not switch to `prefers-color-scheme` media query as the primary toggle — that removes
user control and breaks the existing ModeToggle component.

---

### 5. Do Not Use Pure Neutral Grays

**Why avoid:** DESIGN.md explicitly: "Never use `#888888`. Always use the tinted tokens." The entire
surface hierarchy uses warm brown undertones derived from the `#FF4B12` seed. Reaching for `zinc-*`
or `gray-*` utilities breaks the cohesion. When replacing the current `zinc-*` classes, always
substitute the corresponding surface hierarchy token, not a gray equivalent.

---

### 6. Do Not Use `@apply` Extensively in v4

**Why avoid:** Tailwind v4 discourages `@apply` outside of `@layer utilities`. The current `globals.css`
uses it for `.glass` and `.glass-card`. The v4-idiomatic way is to define these as CSS classes
directly without `@apply`, using the CSS custom property tokens directly. This reduces specificity
conflicts and aligns with v4's CSS-first approach. Rewriting `.glass` and `.glass-card` without
`@apply` is recommended.

---

### 7. Do Not Change JSON-LD Schema Components

**Why avoid:** `RestaurantSchema.astro`, `FAQSchema.astro`, and the other schema components are
purely functional (they emit `<script type="application/ld+json">` tags). They have no visual output
and no Tailwind classes. The facelift does not touch them. Touching them risks breaking Lighthouse
SEO scores (≥ 90 required) and the structured data that was carefully built in v1.0.

---

## Feature Dependencies Map

```
TailwindCSS v4 Migration
  └── Surface Hierarchy Tokens
        ├── No-Line Rule Implementation
        ├── Glassmorphism Overhaul (warmer tints)
        ├── Light + Dark Mode Redesign
        └── Hybrid Token Migration (shadcn + surface)
              └── All component re-skins

Font Migration (Open Sans + Playfair → Manrope + Inter)
  └── Editorial Typography Scale
        └── Asymmetric Layout Moments

tailwindcss-animate → tw-animate-css swap
  └── MobileActionButtons, Sheet, DropdownMenu (preserve existing animations)
```

**Critical path:** Tailwind v4 migration → Surface hierarchy tokens → Everything else in parallel.

---

## MVP Recommendation

For a complete, shippable v2.0 facelift, prioritize in this order:

**Phase 1 — Foundation (all other work is blocked without this):**
1. TailwindCSS v3 → v4 migration (`@tailwindcss/vite`, delete `tailwind.config.mjs`, fix all
   breaking changes)
2. `tailwindcss-animate` → `tw-animate-css` swap (done in same PR as migration)
3. Font migration (Manrope Variable + Inter Variable, replace `@fontsource` imports)

**Phase 2 — Token System:**
4. Surface hierarchy tokens in `@theme`
5. Hybrid token migration (remap shadcn tokens to surface levels in `@theme inline`)
6. Dark mode `@custom-variant dark` declaration + `.dark {}` value overrides

**Phase 3 — Visual Re-skin (can be done component by component):**
7. Glassmorphism utilities overhaul (`.glass`, `.glass-card`)
8. No-line rule audit across all components (remove structural borders)
9. Typography: apply Manrope as display font, editorial scale, label-sm treatments
10. Orange restraint: reduce orange to 3-4 laser moments
11. Tinted shadows: replace `shadow-*` with warm-tinted shadow tokens

**Defer to post-facelift if time is short:**
- Asymmetric editorial layout moments (nice-to-have, not required for spec compliance)
- Per-component micro-animations beyond what tailwindcss-animate already provides

---

## Complexity Reference

| Feature | Complexity | Risk |
|---------|------------|------|
| Tailwind v4 migration | High | Missing `border` regressions across all components |
| tw-animate-css swap | Low | Class name parity — verify `animate-in` still works |
| Font migration | Low | Missing `font-serif` audit — one unswapped class looks wrong |
| Surface hierarchy tokens | Low | Token name typos break all derived utilities |
| Hybrid token migration | Medium | Circular CSS variable references silently break theming |
| No-line rule | Medium | Layout gaps appear if border removal isn't paired with background shift |
| Glassmorphism overhaul | Low | Contrast ratio validation needed on warm tints |
| Light + dark mode redesign | Low | Anti-flash `theme.js` must not be changed |
| Editorial typography | Low | Tracking looks wrong if Manrope isn't loaded yet |
| Tinted shadows | Low | oklch values may need browser compat check |
| Orange restraint | Low | Aesthetic judgment required; test against design spec |

---

## Sources

- Tailwind CSS v4.0 release notes: [tailwindcss.com/blog/tailwindcss-v4](https://tailwindcss.com/blog/tailwindcss-v4)
- Tailwind v4 theme variables: [tailwindcss.com/docs/theme](https://tailwindcss.com/docs/theme)
- Tailwind v4 dark mode: [tailwindcss.com/docs/dark-mode](https://tailwindcss.com/docs/dark-mode)
- Tailwind v4 upgrade guide: [tailwindcss.com/docs/upgrade-guide](https://tailwindcss.com/docs/upgrade-guide)
- shadcn/ui Tailwind v4 guide: [ui.shadcn.com/docs/tailwind-v4](https://ui.shadcn.com/docs/tailwind-v4)
- tw-animate-css (tailwindcss-animate replacement): [github.com/Wombosvideo/tw-animate-css](https://github.com/Wombosvideo/tw-animate-css)
- Material Design 3 surface color roles: [m3.material.io/styles/color/roles](https://m3.material.io/styles/color/roles)
- Material Design 3 design tokens: [m3.material.io/foundations/design-tokens](https://m3.material.io/foundations/design-tokens)
- Glassmorphism accessibility guide: [playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide](https://playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide)
- Manrope on Google Fonts: [fonts.google.com/specimen/Manrope](https://fonts.google.com/specimen/Manrope)
- Astro + Tailwind v4 setup: [tailwindcss.com/docs/installation/framework-guides/astro](https://tailwindcss.com/docs/installation/framework-guides/astro)

_Research completed: 2026-03-24. Author: Claude Sonnet 4.6._
