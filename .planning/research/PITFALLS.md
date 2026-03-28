# PITFALLS — UI Facelift: TailwindCSS v4 Migration + Visual Redesign

**Project**: Spice Grill & Bar — spicegrillbar66.com
**Research Date**: 2026-03-24
**Scope**: v2.0 milestone — TailwindCSS 3→4 migration, CSS-first `@theme`, font swap (Open Sans + Playfair Display → Manrope + Inter), glassmorphism redesign, surface hierarchy system, light-default with dark mode, all 4 pages redesigned.
**Confidence**: HIGH (Tailwind v4 upgrade guide verified directly; shadcn/ui + animate issues verified via GitHub issues; performance claims verified via multiple sources)

---

## Overview

This document catalogs the highest-probability failure modes when applying the "Radiant Sommelier" UI facelift to the existing Astro 5 + TailwindCSS 3 codebase. Each pitfall is grounded in the specific files, constraints, and quality gates of this project. Generic Tailwind migration advice has been excluded.

The site has a hard quality gate: LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility ≥ 90, Best Practices ≥ 80, SEO ≥ 90. Every pitfall below is evaluated against that constraint.

---

## Critical Pitfalls

Mistakes that cause partial or complete UI breakage, CI failures, or rewrite-level rework.

---

### Pitfall 1: Dark Mode Breaks Silently After Migrating from `darkMode: ['class']`

**What goes wrong:**

The current `tailwind.config.mjs` uses `darkMode: ['class']`, and `globals.css` has a `.dark` selector block with all shadcn token overrides. In Tailwind v4, the `darkMode` config key is removed. The default v4 behavior uses `@media (prefers-color-scheme: dark)` — NOT the class strategy.

After running `npx @tailwindcss/upgrade`, the tool may generate an incorrect or broken `@custom-variant` declaration. Multiple confirmed reports from the GitHub discussions show the upgrade tool producing output like `@custom-variant dark (@media not print { .dark & })` which is invalid and silently breaks all `dark:` utility classes. The `ModeToggle` component in `mode-toggle.tsx` adds/removes the `dark` class on `<html>` — if the custom variant is not correctly declared, toggling dark mode does nothing.

**Why it happens:**

The upgrade tool interprets v3's `darkMode: ['class']` config and attempts to translate it, but the v4 `@custom-variant` syntax is strict and the tool's output has documented errors in this specific case.

**Consequences:**

Every dark mode utility class (`dark:bg-zinc-950`, `dark:text-white`, `dark:border-zinc-800`, etc.) becomes inert. Header, Sheet, DropdownMenu, and all glassmorphism components that have dark-mode-specific styles will silently render in light mode regardless of the toggle state. This is visually undetectable in dev if the developer's OS is in light mode.

**Prevention:**

After running the upgrade tool, manually verify `global.css` contains exactly:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

This is the correct v4 form for class-based dark mode toggling. Do not use the media query form. Test by manually adding `class="dark"` to `<html>` in dev tools and verifying dark styles apply to the Header and Sheet components.

**Detection:**

Run `npm run dev`, open browser dev tools, manually add `class="dark"` to `<html>`. If dark backgrounds and text colors do not change, the variant is broken.

**Phase**: Phase 1 (Tailwind v4 migration) — verify dark mode variant before touching any design tokens.

---

### Pitfall 2: `tailwindcss-animate` Is Incompatible with Tailwind v4 — Sheet and DropdownMenu Will Break

**What goes wrong:**

`tailwindcss-animate` (v1.0.7, installed as a production dep) is registered as `require('tailwindcss-animate')` in `tailwind.config.mjs`. In Tailwind v4, JavaScript plugins are only partially supported via the `@plugin` directive, and `tailwindcss-animate` has been officially deprecated in favour of `tw-animate-css`. Multiple confirmed GitHub issues on the shadcn/ui repo (issues #6925, #6536, #6440) document that Sheet and DropdownMenu animation classes (`animate-in`, `animate-out`, `fade-in-0`, `slide-in-from-*`, `data-[state=open]:animate-in`) break silently after the v4 migration.

The Sheet component in `sheet.tsx` relies on these classes for its slide animation (`data-[state=open]:slide-in-from-right`). The DropdownMenu uses `fade-in-0`, `zoom-in-95`. If these utilities are not emitted by the CSS engine, the Sheet drawer opens with no animation — or worse, flickers with broken opacity transitions.

**Why it happens:**

Even if `@plugin 'tailwindcss-animate'` is added to the CSS file (v4 compatibility shim), animation CSS variables (`--tw-enter-opacity`, `--tw-exit-translate-x`, etc.) are no longer automatically declared in the right scope for Radix UI's `data-[state]` patterns.

**Consequences:**

Mobile navigation (Sheet), desktop navigation dropdown (DropdownMenu), and any future animated components will have broken or absent transitions. This is a user-visible regression on mobile.

**Prevention:**

Replace the plugin completely. The migration path is:

1. Remove `tailwindcss-animate` from `package.json` dependencies.
2. Install `tw-animate-css` (CSS-first, v4-native).
3. In `global.css`, replace `@plugin 'tailwindcss-animate'` with `@import "tw-animate-css"`.
4. Delete `plugins: [require('tailwindcss-animate')]` from `tailwind.config.mjs` (or from its CSS-migrated equivalent).

Verify Sheet and DropdownMenu open/close animations in both light and dark mode after this change.

**Detection:**

Open the mobile Sheet drawer. If it snaps open with no slide transition, the animation plugin is broken.

**Phase**: Phase 1 (Tailwind v4 migration) — must be resolved before any component work. This is not optional — failing here breaks the mobile nav.

---

### Pitfall 3: `@apply` in Astro `<style>` Blocks Breaks the Glassmorphism Utilities

**What goes wrong:**

The existing `.glass` and `.glass-card` utilities are defined using `@apply` inside `@layer utilities` in `globals.css`. In Tailwind v4, `@apply` in stylesheets that are processed separately from the main bundled CSS file — including Astro `<style>` blocks and any CSS file that does not `@import "tailwindcss"` — cannot resolve utility class names.

The current codebase has `global.css` with just `@import 'tailwindcss';` and `globals.css` with `@tailwind base/components/utilities` and all the `@apply` definitions. If both files exist during migration, the `@apply` calls in `globals.css` will fail at build time with `Error: Cannot apply unknown utility class`.

Additionally, if any Astro component uses a `<style>` block that references custom utilities via `@apply`, those will also fail unless they include `@reference "../styles/global.css";` at the top of the style block.

**Why it happens:**

In v4, Tailwind uses native CSS cascade layers. Theme variables and custom utilities are only available in the stylesheet where `@import "tailwindcss"` is present. Separate style blocks and CSS files are no longer auto-scanned for `@apply` context.

**Consequences:**

Build failure if the `.glass` and `.glass-card` utilities are defined with `@apply` in a separate CSS block. Silent breakage if the glassmorphism effects are the primary visual element of the new DESIGN.md spec.

**Prevention:**

Migrate glassmorphism utilities using the v4 `@utility` API instead of `@layer utilities` + `@apply`:

```css
@utility glass {
  background-color: color-mix(in srgb, white 70%, transparent);
  backdrop-filter: blur(24px);
  border: 1px solid rgb(255 255 255 / 0.2);
  box-shadow: var(--shadow-lg);
}
```

For the new DESIGN.md glassmorphism spec (`surface_container_high` at 70% opacity + `backdrop-blur: 32px`), define all glass effects as `@utility` declarations in the main `global.css`, not as `@apply` compositions.

**Detection:**

Run `npm run build`. Any `@apply` error appears as a build-time failure with the class name that could not be resolved.

**Phase**: Phase 1 (CSS migration) — consolidate `globals.css` → `global.css` before defining any new utilities.

---

### Pitfall 4: The `container` Utility Loses Its Configuration

**What goes wrong:**

`tailwind.config.mjs` configures `theme.container` with `center: true`, `padding: '2rem'`, and `screens: { '2xl': '1400px' }`. This configuration syntax does not exist in Tailwind v4. The `container` plugin in v4 only accepts `center` as `true/false` via `@utility` extension.

The Header component uses `container mx-auto px-6`, and multiple other layout components likely rely on `container` for centered layout. After migration, if the container configuration is not manually ported to `@utility`, the 1400px max-width and 2rem padding constraints will silently revert to v4 defaults (none — `container` in v4 uses `100%` width with no max-width unless overridden).

**Why it happens:**

The upgrade tool migrates the `tailwind.config.mjs` JS config to CSS, but container customization is not a straightforward translation and is documented as requiring manual attention.

**Consequences:**

Layout breaks on wide screens — the navigation, sections, and content columns will stretch to full viewport width on 2xl screens instead of capping at 1400px.

**Prevention:**

After migration, add an explicit `@utility container` override in `global.css`:

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
  max-width: 1400px;
}
```

**Detection:**

View the site at 1600px+ viewport width. If the header and content sections stretch to full width with no cap, the container configuration is not applied.

**Phase**: Phase 1 (CSS migration) — check container max-width immediately after running the upgrade tool.

---

### Pitfall 5: The shadcn HSL Variable Format Is Incompatible with `@theme`

**What goes wrong:**

The current `globals.css` defines CSS variables in the shadcn pattern:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
```

These are raw HSL channel values intended to be consumed as `hsl(var(--background))` in Tailwind config. In Tailwind v4's `@theme` directive, variables must hold complete CSS color values (not raw channel tuples). If the HSL format is used inside `@theme` without wrapping in `hsl()`, Tailwind v4's color system will silently emit broken `oklch()` or `hsl()` values where the channel values are interpolated incorrectly.

The DESIGN.md spec introduces 5 new surface tokens plus shadcn's existing 20+ tokens. Both token sets must exist in `@theme inline` with complete color values, not raw channel tuples.

**Why it happens:**

Tailwind v4 uses OKLCH internally and expects either hex, `hsl()`, `oklch()`, or named CSS colors as `@theme` values. Raw space-separated HSL channels are a shadcn convention that worked in v3 because the Tailwind config wrapped them in `hsl()`. That JS config wrapper no longer exists in v4.

**Consequences:**

All shadcn components (`Button`, `Sheet`, `DropdownMenu`) will render with no background color or with `transparent` backgrounds because the color value cannot be parsed. The build will succeed but the site will look entirely broken.

**Prevention:**

Wrap all existing CSS variable values in `hsl()` as part of the migration step, then reference them in `@theme inline`:

```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

For the new DESIGN.md surface tokens, define them as complete color values:

```css
:root {
  --surface-dim: hsl(7 30% 8%);          /* #1f0f0b */
  --surface-container-low: hsl(7 29% 12%); /* #281713 */
}
```

**Detection:**

After migration, inspect `Button` component. If it renders with a transparent background, the color variable format is broken. Check the `@theme` output in browser devtools — look for `--color-background` and verify it holds a parseable color, not a space-separated number triple.

**Phase**: Phase 1 (CSS migration) — must be correct before designing any component colors.

---

### Pitfall 6: `@astrojs/tailwind` Integration Conflicts with `@tailwindcss/vite`

**What goes wrong:**

The current `astro.config.mjs` uses `tailwind()` from `@astrojs/tailwind`. In Tailwind v4, the correct approach is to add `@tailwindcss/vite` as a Vite plugin under `vite.plugins`, and remove `@astrojs/tailwind` entirely from integrations. If both exist simultaneously during migration, CSS is processed twice, resulting in doubled utility declarations, specificity conflicts, and unpredictable behavior.

Common intermediate failure mode: removing `@astrojs/tailwind` from integrations but forgetting to add `@tailwindcss/vite` to vite plugins — resulting in no Tailwind CSS being generated at all. The build succeeds but no utility classes are applied.

**Why it happens:**

The Astro Tailwind integration handled PostCSS configuration internally. With v4's Vite plugin, PostCSS is no longer needed for Tailwind (Tailwind v4 has its own build pipeline via LightningCSS). The `postcss.config.cjs` (if it exists) must also be cleaned up.

**Consequences:**

If both integrations are present: CSS duplication, specificity chaos. If neither is present after migration: blank site (no styles).

**Prevention:**

Migration order must be:

1. Add `@tailwindcss/vite` to `vite.plugins` in `astro.config.mjs`.
2. Remove `tailwind()` from `integrations`.
3. Remove `@astrojs/tailwind` from `devDependencies`.
4. Remove `autoprefixer` from `devDependencies` (Tailwind v4 handles prefixing via LightningCSS).
5. If `postcss.config.cjs` exists, delete it (Tailwind v4 does not use PostCSS).
6. Verify `npm run dev` shows styles before touching any component.

**Detection:**

After step 6, open the site in dev mode. If no styles appear (plain HTML with no layout), `@tailwindcss/vite` is not registered. If styles appear doubled or specificity seems off, both integrations are active.

**Phase**: Phase 1 (Infrastructure) — first step of the entire migration. Nothing else can proceed until this is verified.

---

## Moderate Pitfalls

Mistakes that cause visible regressions, Lighthouse failures, or significant rework within a component area.

---

### Pitfall 7: `backdrop-blur` on Multiple Stacked Elements Kills LCP and TBT on Mobile

**What goes wrong:**

The DESIGN.md spec calls for `backdrop-filter: blur(20px)` on surfaces using `surface_variant` at 60% opacity, and `backdrop-blur: 32px` on all floating overlays (glassmorphism). The redesign will apply these effects to the Header (fixed, always visible), the Sheet overlay, the DropdownMenu, and potentially card elements throughout all 4 pages.

`backdrop-filter` creates a new stacking context and forces GPU rasterization for every element it is applied to. When multiple `backdrop-filter` elements are stacked (Header + any underlying modal or card), the GPU must composite each layer independently. This has a documented severe performance cost on low-end Android and older iOS devices.

The Header is fixed-position and uses `glass` class already. Adding `backdrop-blur-32` to cards in the hero section means two compositing layers are active simultaneously on scroll — the fixed header and any card the user scrolls past. This can cause jank, increase TBT, and reduce the Lighthouse Best Practices score.

**Why it happens:**

CSS `backdrop-filter` is GPU-bound and not affected by CSS containment. Every element with `backdrop-filter` is painted in its own compositing layer. Multiple concurrent compositing layers on mobile GPUs cause frame drops.

**Consequences:**

TBT may exceed the 600ms threshold. Lighthouse performance score regression. CLS is unlikely to be affected, but FID/INP may degrade on slower devices.

**Prevention:**

1. Apply `backdrop-filter: blur()` to the Header only when `isScrolled` is true (already implemented via `glass` class conditional). Do not apply it at page load.
2. Limit `backdrop-blur` on non-modal, non-overlay elements. Cards in the menu grid should use tonal surface shifts (`background-color` changes) instead of `backdrop-blur`. Reserve blur for the Header, Sheet overlay, and DropdownMenu — three elements, not twenty.
3. Use a reduced blur radius for cards: `blur(12px)` or `blur(16px)` instead of `blur(32px)`. The DESIGN.md spec says `blur(32px)` for floating overlays — this applies to modals and dropdowns, not ambient card backgrounds.
4. Test on a throttled connection (Lighthouse DevTools, "Slow 4G" preset) with CPU 4x throttle on every redesigned page before committing.

**Detection:**

Run `npm run test:lhci` after redesigning the hero section. TBT > 600ms or a Lighthouse performance score below 70 on mobile indicates compositing layer saturation.

**Phase**: Phase 2 (Visual design) — apply the `backdrop-blur` budget rule before designing any section with cards. Do not wait for Lighthouse CI to catch it.

---

### Pitfall 8: Font Swap Causes CLS Regression from FOUT

**What goes wrong:**

The current site uses `@fontsource/open-sans` and `@fontsource/playfair-display` (self-hosted via fontsource npm packages). The new spec replaces them with Manrope (display + headings) and Inter (body). If the new fonts are loaded without metric-adjusted fallbacks, the browser will show a layout shift when the custom fonts load and swap in, changing line heights, letter spacing, and word wrapping.

CLS > 0.1 is a Lighthouse CI failure threshold. A font swap on a heading where `font-size: 3.5rem` (`display-lg` per DESIGN.md) changes from a system font to Manrope can shift 200–400px of content downward as line-height settles. This is a high-probability CLS failure.

The current `@fontsource/playfair-display` package provides `font-display: swap` automatically. Switching to `@fontsource/manrope` and `@fontsource/inter` requires confirming these packages also provide `font-display: swap` and ideally metric-adjusted fallback descriptors.

**Why it happens:**

`font-display: swap` prevents FOIT but causes FOUT. FOUT is the trade-off that causes layout shift when metric dimensions differ between fallback and loaded font.

**Consequences:**

CLS > 0.1 fails the Lighthouse CI threshold, blocking the pre-push hook. Every large headline using Manrope will be a potential layout shift source.

**Prevention:**

1. Use `@fontsource/manrope` and `@fontsource/inter` (both available, both include `font-display: swap`).
2. Preload the most critical font subset: `<link rel="preload" as="font" href="/fonts/manrope-latin-700.woff2" crossorigin>` for the display heading weight in `Layout.astro`. Do not preload more than 2 font files.
3. Define metric-adjusted CSS fallbacks using `@font-face` descriptors (`size-adjust`, `ascent-override`, `descent-override`) to match Manrope's metrics against the system sans-serif fallback. This reduces the shift when the font swaps in.
4. Run `npm run test:lhci` after font installation and before any further visual work. CLS must be below 0.1 at this checkpoint.

**Detection:**

Use Chrome DevTools Performance panel → look for "Layout Shift" events immediately after font load. CLS score in Lighthouse > 0.1 is the definitive failure.

**Phase**: Phase 1 (Font installation) — preload and metric-adjusted fallback must be in place before any visual work begins.

---

### Pitfall 9: Accessibility Regression from Surface Hierarchy Low-Contrast Stacking

**What goes wrong:**

The DESIGN.md surface hierarchy uses five tonal levels:

- Level 0 (Base): `#1f0f0b` (surface_dim)
- Level 1: `#281713` (surface_container_low)
- Level 2: `#2d1b17` (surface_container)
- Level 3: `#49342f` (surface_bright)

The contrast difference between Level 0 and Level 1 is approximately 1.3:1. Between Level 0 and Level 2 it is approximately 1.5:1. These tonal shifts are meant to create visual hierarchy without borders — a design principle called "No-Line Rule" in the spec. However, using these as backgrounds for text content blocks will fail WCAG AA if the text color (`on_surface` or `on_surface_variant`) is not sufficiently contrasted against the deepest surface level.

The DESIGN.md spec also uses `outline_variant` at 15% and 20% opacity for ghost borders. At that opacity level against a dark brown surface, the contrast ratio can be below 1.5:1 — technically not a WCAG violation since borders are not text, but axe-core will still flag low-contrast UI components if interactive elements (focus rings, form borders) fall below the 3:1 threshold.

The Lighthouse Accessibility threshold is ≥ 90. A single heading or body text element with contrast < 4.5:1 against its background can drop the score below this threshold.

**Why it happens:**

The design spec was authored as a dark-mode-first system with aesthetic contrast (tonal depth) as the primary goal. Light text on deep brown surfaces creates the right visual feeling but the spec does not explicitly verify every text/background pair against WCAG AA requirements.

Additionally, the project uses `light mode as default`. The DESIGN.md color tokens are dark-mode-first. All text and surface pairings need to be verified for both modes, not just dark mode.

**Consequences:**

Lighthouse Accessibility score drops below 90 — CI failure that blocks deployment via the pre-push hook. axe-core CLI failures (`npm run test:axe`) for any text that fails contrast.

**Prevention:**

1. For every text/background color pair in the new design, verify contrast ratio using [https://apcacontrast.com](https://apcacontrast.com) (APCA for modern accuracy) AND the WCAG 2.x 4.5:1 ratio tool. Both tools are needed because Lighthouse still uses WCAG 2.x ratios for its accessibility score.
2. For body text (`body-md`, `label-sm`), the minimum safe pairing is `on_surface` against `surface_container`. Verify this pair specifically — it is the highest-frequency text/background combination.
3. For light mode: the surface hierarchy tokens are dark-mode-only. Light mode must have its own set of surface tokens with sufficient contrast. Do not simply invert the dark tokens — dark-mode design spec says nothing about light mode contrast.
4. Focus ring visibility is a separate concern: all interactive elements must have a visible focus indicator. The current `focus-visible:ring-2 focus-visible:ring-orange-500` pattern is correct. Do not remove focus rings in the redesign.
5. Run `npm run test:axe` after every component redesign iteration.

**Detection:**

`npm run test:axe` against the running dev server. Any contrast failure in the axe report means the text/background pair must be adjusted before committing.

**Phase**: Phase 2 (Visual redesign) — verify contrast for every new color pair before implementation. Build a reference table of approved pairs first.

---

### Pitfall 10: Renamed Utilities Cause Silent Visual Regressions

**What goes wrong:**

Tailwind v4 renames several utilities that are used throughout this codebase. The upgrade tool handles most renames in template files, but `.astro` file handling is imperfect. The most impactful renames for this codebase:

| v3 Class | v4 Class | Risk in This Codebase |
|---|---|---|
| `shadow-sm` | `shadow-xs` | Used on `Button`, `Header`, multiple cards |
| `shadow` | `shadow-sm` | Used on `glass`, `glass-card` utilities |
| `rounded-sm` | `rounded-xs` | Used on focus rings, buttons |
| `outline-none` | `outline-hidden` | Used extensively in focus-visible patterns |
| `ring` (3px) | `ring-3` | All focus-visible ring utilities in `Header.tsx`, `Sheet.tsx` |
| `blur-sm` | `blur-xs` | Any future blur utility |

The border color change is particularly dangerous: in v4, bare `border` uses `currentColor` instead of `gray-200`. The Header uses `border-b border-transparent` (explicit, safe). The Sheet uses `border-r`, `border-l`, `border-b`, `border-t` — these will render with `currentColor` borders, which in some color contexts means visible black or white borders where transparent was expected.

**Why it happens:**

The upgrade tool scans template files but may miss Astro `<style>` blocks, dynamically assembled class strings (template literals in `.tsx` files), or `cn()` utility call arguments that concatenate class names across multiple lines.

**Consequences:**

Shadow depth looks wrong (elements appear flat or over-elevated). Focus rings appear with wrong radius. Components with bare `border` utilities develop unexpected color borders.

**Prevention:**

1. After running the upgrade tool, do a full visual audit of all 4 pages at desktop and mobile breakpoints.
2. Specifically search for these patterns after migration:
   - `shadow-sm` → should now be `shadow-xs`; verify shadow depth looks correct
   - `rounded-sm` → should now be `rounded-xs`; check buttons and inputs
   - All bare `border` utilities in Sheet, DropdownMenu, Header — add explicit `border-transparent` or the intended color
3. The `important!` modifier moved from prefix (`!flex`) to suffix (`flex!`). If any `!important` utilities are used in shadcn components, these will silently stop working without the syntax change.

**Detection:**

Visual comparison of shadows, borders, and rounded corners before and after migration. Screenshot the Header, Sheet, and Button at multiple states (default, hover, focus, open) before migration as a baseline reference.

**Phase**: Phase 1 (Migration) — run the upgrade tool, then do a visual regression check before proceeding to design work.

---

### Pitfall 11: The Upgrade Tool Does Not Fully Handle `.astro` Files

**What goes wrong:**

The `npx @tailwindcss/upgrade` tool was designed primarily for `.html`, `.jsx`, `.tsx`, and `.css` files. Confirmed reports from the GitHub discussion thread (Discussion #17018) show that the tool fails or produces incomplete output for `tailwind.config.ts`/`.mjs` files with complex configurations and may not correctly scan Astro SFC template sections.

Specific risks for this codebase:

1. **Complex `tailwind.config.mjs`**: The config has nested color objects, custom `borderRadius` using `calc()`, custom `keyframes`, and `plugins`. The upgrade tool may generate an incomplete `@theme` block that omits some of these.
2. **Astro component class strings**: Class strings in `.astro` files that span multiple lines or use template expressions may not have all utility renames applied.
3. **`cva()` calls in `.tsx` files**: Class Variance Authority (used in `button.tsx`, `sheet.tsx`) generates class strings dynamically. The upgrade tool scans static strings but may miss classes inside conditional expressions within `cva()` variant objects.

**Why it happens:**

The tool's AST parser handles JavaScript and TypeScript templates but Astro's template syntax (the HTML section of `.astro` files) is not standard JSX. The tool's file-scanning heuristics may treat `.astro` files as plain HTML and miss class attributes inside Astro expressions (`{condition && 'class-name'}`).

**Consequences:**

After running the upgrade tool, approximately 10–20% of class names in `.astro` files and CVA variant objects may remain in v3 syntax. These will either resolve to undefined utilities in v4 (silent no-op) or conflict with renamed utilities.

**Prevention:**

1. Run the upgrade tool, then do a manual search for all class names that were renamed (see Pitfall 10 table). Use grep/search to find each v3 name in `src/`.
2. After the automated migration, do a line-by-line audit of: `tailwind.config.mjs` → generated `@theme` block, `globals.css`, all `*.tsx` files, and the Astro page files.
3. Test every interactive state: Sheet open/close, DropdownMenu open/close, Button hover/active/focus, dark mode toggle.
4. Build the site (`npm run build`) and visually inspect `dist/` output CSS to confirm all expected utility classes are present.

**Detection:**

Search for v3 utility names in `src/` after running the upgrade tool. Any match in `.astro` or `.tsx` files means the tool missed it.

**Phase**: Phase 1 (Migration) — treat the upgrade tool as a 70% solution that requires manual completion.

---

## Minor Pitfalls

Issues that cause degraded DX, small visual inconsistencies, or technical debt but are not blockers.

---

### Pitfall 12: CSS Variable Naming Collision Between shadcn Tokens and DESIGN.md Surface Tokens

**What goes wrong:**

The existing `globals.css` uses shadcn's CSS variable naming convention (`--background`, `--foreground`, `--primary`, `--card`, etc.). The new surface hierarchy introduces names like `--surface-dim`, `--surface-container-low`, `--surface-container`, `--surface-bright`. These are unlikely to collide directly.

However, DESIGN.md tokens like `primary_container (#ff5626)` and `inverse_primary` are Material Design 3 (M3) naming conventions. shadcn's `--primary` token already occupies that namespace. If the DESIGN.md `primary_container` is naively mapped to `--primary-container`, it will conflict with no existing token but might confuse future component authors who assume shadcn semantics.

Additionally, Tailwind v4 generates its own `--tw-*` prefixed variables for internal utilities. In v4 without a `@config prefix` declaration, these can technically clash with any user-defined `--tw-` prefixed variables.

**Prevention:**

Use a namespaced prefix for DESIGN.md tokens to keep them distinct from shadcn tokens. For example, `--rs-surface-dim` (rs = Radiant Sommelier) or `--ds-surface-dim` (ds = design system). This makes it immediately clear which system a variable belongs to.

**Phase**: Phase 1 (Token architecture) — establish naming conventions before defining any DESIGN.md tokens.

---

### Pitfall 13: Light Mode Is Unspecified in DESIGN.md — Default Mode Will Look Wrong

**What goes wrong:**

The DESIGN.md spec is authored entirely as a dark-mode system. All surface tokens (`#1f0f0b`, `#281713`, `#2d1b17`), color palette decisions, and the "no-line rule" are designed for dark backgrounds. The PROJECT.md states "Light default + dark mode, both redesigned to DESIGN.md palette."

Light mode surfaces, text colors, and card backgrounds are not defined anywhere in the current spec. If the implementation team designs dark mode first (as the spec implies) and then attempts to create light mode by inverting or lightening the palette, the result will be a flat, desaturated, or visually inconsistent light mode that does not match the "Radiant Sommelier" aesthetic.

**Prevention:**

Before any implementation begins, extend DESIGN.md with explicit light mode token values for the surface hierarchy (5 levels in light mode), text colors on light surfaces, and the glassmorphism specification in light mode (blur + light tinting instead of dark tinting). The "no-line rule" and "glass + gradient" rules need explicit light mode equivalents.

**Phase**: Phase 0 (Design spec completion) — do not begin implementation without light mode tokens defined. This is a design deliverable, not a code concern.

---

### Pitfall 14: Regression on 4 Lighthouse-Audited Pages Is Not Caught Until Pre-Push

**What goes wrong:**

The Lighthouse CI audits 4 pages. The pre-push hook runs the full QA suite. If a component redesign introduces a CLS regression (e.g., from a missing `width`/`height` on a decorative image, or from an improperly constrained glassmorphism card), the failure is discovered only at push time after a full `npm run build` cycle.

For a large visual redesign touching all 4 pages, this creates slow iteration feedback. Each visual change requires a full production build (minutes) + Lighthouse run to verify — discouraging thorough testing.

**Prevention:**

1. Set up a local Lighthouse workflow that runs against the dev server (`npm run dev`) for fast iterative feedback during redesign. Use `lhci collect --url http://localhost:4321 --settings.emulatedFormFactor=mobile --settings.onlyCategories=performance,accessibility` for targeted spot-checks.
2. Designate checkpoint builds: after each page redesign, run `npm run build && npm run test:lhci` for that page before moving to the next. Do not accumulate 4 redesigned pages and run Lighthouse once at the end.
3. Use Chrome DevTools CLS overlay (Performance panel → Layout Shift events) during dev to catch shifts before running Lighthouse.

**Phase**: Throughout (Phase 2–3 page redesigns) — process discipline.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Install `@tailwindcss/vite`, remove `@astrojs/tailwind` | Both integrations active simultaneously or neither active | Verify styles load in dev before anything else (Pitfall 6) |
| Dark mode `@custom-variant` declaration | Incorrect syntax from upgrade tool; all `dark:` classes silently broken | Manually verify class name toggle in devtools (Pitfall 1) |
| `tailwindcss-animate` replacement | Sheet and DropdownMenu animations silently broken | Replace with `tw-animate-css` and test both components (Pitfall 2) |
| `globals.css` consolidation | `@apply` errors at build time from split CSS files | Consolidate to single `global.css`, use `@utility` API (Pitfall 3) |
| `container` utility configuration | Layout breaks at 1400px+ breakpoint | Port container config to `@utility container` (Pitfall 4) |
| shadcn HSL token format | All component colors render as transparent | Wrap HSL tuples in `hsl()`, use `@theme inline` (Pitfall 5) |
| Font swap (Manrope + Inter) | CLS > 0.1 from font metric difference | Preload critical weights + metric-adjusted fallbacks (Pitfall 8) |
| Surface hierarchy glassmorphism | Multiple `backdrop-blur` layers kill TBT on mobile | Budget: blur on Header + modals only, not ambient cards (Pitfall 7) |
| Dark-mode surface tokens | Low contrast on `on_surface` text — Accessibility < 90 | Verify every text/background pair against WCAG AA (Pitfall 9) |
| Utility renames in `.astro` files | Shadow depth and border colors wrong after migration | Manual grep + visual audit after upgrade tool (Pitfalls 10, 11) |
| Light mode not designed in DESIGN.md | Light default mode looks wrong or undesigned | Complete light mode spec before any implementation (Pitfall 13) |
| 4-page visual redesign | Lighthouse regressions discovered only at pre-push | Per-page checkpoint builds + local LH spot-checks (Pitfall 14) |

---

## Sources

- Tailwind CSS v4 Upgrade Guide: [https://tailwindcss.com/docs/upgrade-guide](https://tailwindcss.com/docs/upgrade-guide) — HIGH confidence
- `tailwindcss-animate` deprecation and `tw-animate-css` replacement: [https://github.com/Wombosvideo/tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) — HIGH confidence
- shadcn/ui Tailwind v4 migration: [https://ui.shadcn.com/docs/tailwind-v4](https://ui.shadcn.com/docs/tailwind-v4) — HIGH confidence
- shadcn Sheet animation broken in v4 (issue #6440): [https://github.com/shadcn-ui/ui/issues/6440](https://github.com/shadcn-ui/ui/issues/6440) — HIGH confidence
- shadcn animation variables missing in v4 (issue #6925): [https://github.com/shadcn-ui/ui/issues/6925](https://github.com/shadcn-ui/ui/issues/6925) — HIGH confidence
- Dark mode @custom-variant incorrect syntax from upgrade tool (Discussion #16517): [https://github.com/tailwindlabs/tailwindcss/discussions/16517](https://github.com/tailwindlabs/tailwindcss/discussions/16517) — HIGH confidence
- `@apply` broken in scoped styles (Discussion #16429): [https://github.com/tailwindlabs/tailwindcss/discussions/16429](https://github.com/tailwindlabs/tailwindcss/discussions/16429) — HIGH confidence
- Upgrade tool fails on complex config (Discussion #17018): [https://github.com/tailwindlabs/tailwindcss/discussions/17018](https://github.com/tailwindlabs/tailwindcss/discussions/17018) — HIGH confidence
- Container utility v4 changes: [https://github.com/tailwindlabs/tailwindcss/discussions/14801](https://github.com/tailwindlabs/tailwindcss/discussions/14801) — HIGH confidence
- `backdrop-filter` performance issue (Mozilla bugzilla): [https://bugzilla.mozilla.org/show_bug.cgi?id=1718471](https://bugzilla.mozilla.org/show_bug.cgi?id=1718471) — MEDIUM confidence
- CSS backdrop-filter performance (shadcn/ui issue #327): [https://github.com/shadcn-ui/ui/issues/327](https://github.com/shadcn-ui/ui/issues/327) — MEDIUM confidence
- Font loading CLS: [https://www.debugbear.com/blog/web-font-layout-shift](https://www.debugbear.com/blog/web-font-layout-shift) — HIGH confidence
- Font preload best practices: [https://www.debugbear.com/blog/preload-web-fonts](https://www.debugbear.com/blog/preload-web-fonts) — HIGH confidence
- WCAG vs APCA dark mode contrast: [https://capellic.com/insights/accessible-colors](https://capellic.com/insights/accessible-colors) — MEDIUM confidence
- Fontsource Manrope: [https://fontsource.org/fonts/manrope](https://fontsource.org/fonts/manrope) — HIGH confidence

---

_Research complete: 2026-03-24_
