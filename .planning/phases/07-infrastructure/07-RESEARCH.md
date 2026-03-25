# Phase 7: Infrastructure - Research

**Researched:** 2026-03-24 (updated 2026-03-24 — Validation Architecture added)
**Domain:** TailwindCSS v3 → v4 migration, Astro integration, animation plugin swap, variable font installation
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Font Installation**
- D-01: Install `@fontsource-variable/manrope` and `@fontsource-variable/inter` — matches existing @fontsource pattern, self-hosted variable fonts for best CLS performance
- D-02: Keep old font packages (`@fontsource/open-sans`, `@fontsource/playfair-display`) temporarily alongside new ones — remove in Phase 9 when components are reskinned
- D-03: Register new fonts in `@theme` (`--font-sans: "Inter"`, `--font-display: "Manrope"`) but keep existing font-family references (`font-sans: "Open Sans"`) working until Phase 9

**Migration Strategy**
- D-04: Run `@tailwindcss/upgrade` CLI first as a 70% solution, then manually fix Astro-specific issues (wrong config placement, `@custom-variant` syntax)
- D-05: Add `@tailwindcss/vite` plugin inline in `astro.config.mjs` under `vite.plugins[]` — no separate `vite.config.ts` file
- D-06: Remove `@astrojs/tailwind` integration from `astro.config.mjs`
- D-07: Migrate CSS tokens in-place to full HSL values and remove shadcn references to become purely CSS-first Tailwind — while keeping the Radix UI components (Button, Sheet, DropdownMenu) functional
- D-08: Run full QA suite (`npm run qa`) as the verification step after migration — no shortcuts on quality gates

**Glass Utility Handling**
- D-09: Convert `.glass` and `.glass-card` from `@layer utilities` with `@apply` to `@utility` directive syntax — just make them compile in v4, keep current neutral gray look
- D-10: Visual redesign of glass utilities deferred to Phase 9

**CSS Variable Format**
- D-11: Convert all CSS variables from bare HSL triples (`--primary: 222.2 47.4% 11.2%`) to full HSL values (`--primary: hsl(222.2 47.4% 11.2%)`)
- D-12: Components reference tokens via `var(--primary)` directly instead of `hsl(var(--primary))` wrapper
- D-13: Keep existing class names (bg-primary, text-muted-foreground, etc.) working via `@theme` registration — token rename to DESIGN.md surface hierarchy happens in Phase 8

### Claude's Discretion
- Specific order of migration sub-steps (which files to convert first)
- How to handle any edge cases the upgrade CLI produces
- Whether to commit incrementally or in one migration commit

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Site builds and runs on TailwindCSS v4 with `@tailwindcss/vite` plugin replacing `@astrojs/tailwind` | See Standard Stack: exact package install, astro.config.mjs pattern |
| INFRA-02 | CSS configuration uses `@import "tailwindcss"` and `@theme` directive, `tailwind.config.mjs` deleted | See Architecture Patterns: CSS-first configuration, @theme inline pattern |
| INFRA-03 | All v4 breaking utility renames applied (`shadow-sm`→`shadow-xs`, `outline-none`→`outline-hidden`, `ring`→`ring-3`, `!` position flipped) | See Breaking Changes Inventory: complete rename list with grep targets |
| INFRA-04 | Dark mode works correctly with `@custom-variant dark (&:where(.dark, .dark *))` syntax | See Architecture Patterns: dark mode variant, verified exact selector |
| INFRA-05 | `autoprefixer` removed (Tailwind v4 Lightning CSS handles prefixing) | See Don't Hand-Roll: autoprefixer redundant in v4; postcss.config.cjs already absent |
| INFRA-06 | `tailwindcss-animate` replaced with `tw-animate-css`, Sheet/DropdownMenu/MobileActionButtons verified functional | See Standard Stack: tw-animate-css, animation class inventory |
</phase_requirements>

---

## Summary

This phase migrates the site from TailwindCSS v3 to v4. The migration has three distinct workstreams: (1) infrastructure swap — replacing `@astrojs/tailwind` with `@tailwindcss/vite`, deleting `tailwind.config.mjs`, rewriting `globals.css` to CSS-first syntax; (2) CSS token migration — converting bare HSL triples to full `hsl()` values and wiring them through `@theme inline` so utility classes like `bg-primary` continue to work; and (3) plugin replacement — swapping `tailwindcss-animate` for `tw-animate-css` and verifying the 9 animation class usages across Sheet, DropdownMenu, and MobileActionButtons still fire correctly.

The `@tailwindcss/upgrade` CLI is useful but incomplete for this project. It correctly migrates `globals.css` directives and utility renames but does NOT properly handle Astro's `astro.config.mjs` — it may place the Tailwind plugin in `integrations[]` (wrong) instead of `vite.plugins[]` (correct). Manual review of every file the CLI touches is mandatory per decision D-04. PostCSS config (`postcss.config.cjs`) is already absent in this project, so the INFRA-05 autoprefixer removal reduces to deleting it from `package.json` devDependencies only.

The CSS variable migration follows the shadcn/ui v4 pattern: move `hsl()` wrappers into the `:root`/`.dark` variable declarations, then expose them via `@theme inline` with `var()` references. This enables the Tailwind `bg-primary` and `text-foreground` utilities to resolve correctly without any component-level changes.

**Primary recommendation:** Run `@tailwindcss/upgrade` on a branch, immediately audit its output against the manual checklist in this document, then fix the Astro config and any CSS syntax errors before running `npm run build`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.2.2 (latest) | CSS framework | The migration target |
| @tailwindcss/vite | 4.2.2 (latest) | Vite integration for TW v4 | Official Tailwind Vite plugin; replaces @astrojs/tailwind |
| tw-animate-css | 1.4.0 (latest) | Animation utilities | CSS-first replacement for tailwindcss-animate; drop-in for animate-in/out/slide/fade/zoom classes |

### Fonts

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @fontsource-variable/manrope | 5.2.8 (latest) | Manrope variable font | Self-hosted, single woff2-variations file; CLS-safe via font-display:swap |
| @fontsource-variable/inter | 5.2.8 (latest) | Inter variable font | Self-hosted, weights 100–900 in one file |

### Removed

| Package | Was In | Why Removed |
|---------|--------|-------------|
| @astrojs/tailwind | integrations[] | Deprecated for TW v4; replaced by @tailwindcss/vite |
| tailwindcss-animate | dependencies | Replaced by tw-animate-css |
| autoprefixer | devDependencies | TW v4 uses Lightning CSS internally; autoprefixer is redundant |
| tailwind.config.mjs | root | CSS-first configuration replaces JS config entirely |

### Installation

```bash
# Install new packages
npm install tailwindcss @tailwindcss/vite tw-animate-css
npm install @fontsource-variable/manrope @fontsource-variable/inter

# Remove old packages
npm uninstall @astrojs/tailwind tailwindcss-animate autoprefixer

# tailwindcss moves from devDependencies to dependencies in v4 (peer of @tailwindcss/vite)
```

---

## Architecture Patterns

### Recommended Final File State

```
astro.config.mjs          # @tailwindcss/vite in vite.plugins[], @astrojs/tailwind removed
src/styles/globals.css    # @import "tailwindcss"; @import "tw-animate-css"; @theme inline {}; @custom-variant dark; @utility
tailwind.config.mjs       # DELETED
postcss.config.cjs        # Already absent — nothing to do
src/layouts/Layout.astro  # New font imports added alongside existing
```

### Pattern 1: Astro Config — Vite Plugin Placement

**What:** `@tailwindcss/vite` goes under `vite.plugins[]`, NOT in `integrations[]`.

**Critical:** The upgrade CLI may place it in `integrations[]` — this is wrong and will silently fail or produce broken output. Always verify after running the CLI.

```javascript
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import indexnow from 'astro-indexnow';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://spicegrillbar66.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],  // <-- HERE, not in integrations[]
  },
  integrations: [
    indexnow({ key: '5a973t3xfryc2gchkn1q6chy26ss2au9' }),
    react(),
    // tailwind() REMOVED
    sitemap(),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  devToolbar: { enabled: false },
});
```

### Pattern 2: globals.css — Full CSS-First Structure

**What:** The complete target state for `src/styles/globals.css` after migration.

**Key points:**
- `@tailwind base/components/utilities` → `@import "tailwindcss"`
- `tailwindcss-animate` plugin → `@import "tw-animate-css"`
- `@layer base { :root {...} }` → plain `:root {}` and `.dark {}`; HSL triples get `hsl()` wrapper
- `@theme inline` exposes CSS variables as Tailwind utilities
- `@custom-variant dark` for class-based dark mode
- `@layer utilities { .glass {...} }` → `@utility` directives in v4

```css
/* Source: https://tailwindcss.com/docs/upgrade-guide + https://ui.shadcn.com/docs/tailwind-v4 */
@import "tailwindcss";
@import "tw-animate-css";

/* Dark mode via class on <html> */
@custom-variant dark (&:where(.dark, .dark *));

/* Step 1: Raw color values in :root/.dark (hsl() wrapper added) */
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222.2 84% 4.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(222.2 84% 4.9%);
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);
  --muted: hsl(210 40% 96.1%);
  --muted-foreground: hsl(215.4 16.3% 46.9%);
  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);
  --ring: hsl(222.2 84% 4.9%);
  --radius: 0.5rem;
  /* Brand Colors */
  --brand-orange: hsl(14 100% 53.5%);
  --brand-green: hsl(111 40% 25%);
  --brand-gold: hsl(36 100% 69%);
}

.dark {
  --background: hsl(222.2 84% 4.9%);
  --foreground: hsl(210 40% 98%);
  --card: hsl(222.2 84% 4.9%);
  --card-foreground: hsl(210 40% 98%);
  --popover: hsl(222.2 84% 4.9%);
  --popover-foreground: hsl(210 40% 98%);
  --primary: hsl(210 40% 98%);
  --primary-foreground: hsl(222.2 47.4% 11.2%);
  --secondary: hsl(217.2 32.6% 17.5%);
  --secondary-foreground: hsl(210 40% 98%);
  --muted: hsl(217.2 32.6% 17.5%);
  --muted-foreground: hsl(215 20.2% 65.1%);
  --accent: hsl(217.2 32.6% 17.5%);
  --accent-foreground: hsl(210 40% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(217.2 32.6% 17.5%);
  --input: hsl(217.2 32.6% 17.5%);
  --ring: hsl(212.7 26.8% 83.9%);
  --brand-orange: hsl(14 100% 53.5%);
  --brand-green: hsl(111 40% 25%);
  --brand-gold: hsl(36 100% 69%);
}

/* Step 2: Wire CSS variables into Tailwind utility system via @theme inline */
/* @theme inline ensures utilities resolve var() at the point of use */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand-orange: var(--brand-orange);
  --color-brand-green: var(--brand-green);
  --color-brand-gold: var(--brand-gold);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  /* New fonts registered alongside old ones (D-03) */
  --font-sans: "Inter Variable", ui-sans-serif, sans-serif;
  --font-display: "Manrope Variable", ui-sans-serif, sans-serif;
}

/* Base resets */
html {
  scroll-behavior: smooth;
}

* {
  border-color: var(--border);
}

body {
  background-color: var(--background);
  color: var(--foreground);
}

/* Custom utilities — converted from @layer utilities */
@utility glass {
  background-color: color-mix(in srgb, white 70%, transparent);
  backdrop-filter: blur(24px);
  border: 1px solid color-mix(in srgb, white 20%, transparent);
  box-shadow: var(--shadow-lg);
}

@utility glass-card {
  background-color: color-mix(in srgb, theme(--color-zinc-100) 50%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, theme(--color-zinc-200) 50%, transparent);
  box-shadow: var(--shadow-sm);
}
```

**Note on `@utility` with `@apply`:** `@apply` is supported inside `@utility` but `dark:` variant classes inside `@apply` in `@utility` can be unreliable. The glass utilities above use direct CSS properties instead. If `@apply` approach is preferred, test thoroughly — the `dark:` modifier inside `@apply` inside `@utility` is a known edge case.

### Pattern 3: Dark Mode — @custom-variant Syntax

**What:** Class-based dark mode uses `@custom-variant` in v4, replacing `darkMode: ['class']` from `tailwind.config.mjs`.

**Exact syntax required (from official docs):**

```css
/* Source: https://tailwindcss.com/docs/dark-mode */
@custom-variant dark (&:where(.dark, .dark *));
```

**How it works:** The `&:where(.dark, .dark *)` selector means the element itself or any descendant of `.dark`. This matches how `mode-toggle.tsx` sets `document.documentElement.classList.add('dark')`.

**Verification:** After migration, toggle `class="dark"` on `<html>` in DevTools — Header glassmorphism background and Sheet panel background must switch correctly.

### Pattern 4: Variable Font Import

**What:** Add new variable fonts to `Layout.astro` alongside existing fonts (D-02).

```astro
---
// Source: https://fontsource.org/fonts/manrope/install
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/inter/wght.css';
// Keep old fonts until Phase 9
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/700.css';
import '../styles/globals.css';
---
```

**Font name in CSS:** `"Manrope Variable"` and `"Inter Variable"` (fontsource-variable appends " Variable" to the family name).

### Pattern 5: tw-animate-css Integration

**What:** CSS `@import` replaces the JavaScript plugin registration.

```css
/* In globals.css — replaces: plugins: [require('tailwindcss-animate')] in tailwind.config.mjs */
@import "tw-animate-css";
```

**Confirmed compatible class names** (all used in this project):
- `animate-in`, `animate-out`
- `fade-in-0`, `fade-out-0`
- `slide-in-from-top`, `slide-in-from-bottom`, `slide-in-from-left`, `slide-in-from-right`
- `slide-out-to-top`, `slide-out-to-bottom`, `slide-out-to-left`, `slide-out-to-right`
- `slide-in-from-bottom-4` (with numeric suffix)
- `zoom-in-95`, `zoom-out-95`
- `duration-300`, `duration-500`, `duration-700`

### Anti-Patterns to Avoid

- **Placing `@tailwindcss/vite` in `integrations[]`:** The upgrade CLI may do this. It is wrong. Tailwind v4 Vite plugin MUST be in `vite.plugins[]`.
- **Keeping `@tailwind base/components/utilities` directives:** Replace with single `@import "tailwindcss"`.
- **Keeping bare HSL triples without `hsl()` wrapper:** `--background: 0 0% 100%` does NOT work in v4 — must be `--background: hsl(0 0% 100%)`.
- **Using `@layer utilities` for custom utilities:** Must become `@utility` directives in v4.
- **Using `hsl(var(--primary))` in component classes:** In v4 with `@theme inline`, reference token directly: `bg-primary` resolves via `--color-primary: var(--primary)`.
- **Keeping `darkMode: ['class']` in tailwind.config.mjs:** File is deleted; use `@custom-variant dark` in CSS instead.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS autoprefixing for vendor prefixes | Manual vendor prefixes | Nothing — TW v4 uses Lightning CSS | Built into the compiler |
| Animation enter/exit utilities | Custom CSS keyframes | tw-animate-css | Provides all 9 class patterns currently used |
| Variable font loading | Custom @font-face declarations | @fontsource-variable/* | Handles font-display, woff2-variations, weight ranges correctly |
| Token-to-utility mapping | JS config color extension | @theme inline {} in CSS | The v4 CSS-first mechanism for this exact problem |

**Key insight:** Every hand-rolled solution in this phase introduces a maintenance burden that CSS-first Tailwind v4 was specifically designed to eliminate. The `@theme inline` pattern exists precisely to bridge CSS custom property tokens and Tailwind utility classes.

---

## Breaking Changes Inventory

This is an audit of this specific codebase's exposure to v4 breaking changes.

### INFRA-03 Utility Renames (Complete List)

| v3 Class | v4 Class | Affected Files |
|----------|----------|----------------|
| `shadow-sm` | `shadow-xs` | `button.tsx` (3×), `AstroButton.astro` (1×), `near-grand-canyon.astro` (6×), `directions.astro` (8×), `MenuSection.tsx` (1×), `faq.astro` (1×) |
| `outline-none` | `outline-hidden` | `dropdown-menu.tsx` (4×), `sheet.tsx` (indirectly via `focus:outline-none`) |
| `ring` (default 3px) | `ring-3` | `sheet.tsx` (`focus:ring-2` — already explicit, safe), `button.tsx` (`focus-visible:ring-1` — explicit, safe) |
| `!` prefix → suffix | e.g., `!rounded-full` → `rounded-full!` | `AstroButton.astro` (1× `!rounded-full`) |

**Note on actual shadow-sm count:** Codebase audit (grep confirmed) shows 19 total `shadow-sm` usages across 6 files: `button.tsx` (3×), `AstroButton.astro` (1×), `MenuSection.tsx` (1×), `near-grand-canyon.astro` (6×), `directions.astro` (8×), `faq.astro` (1×). The upgrade CLI should catch these automatically; manual verification via grep after CLI run is required.

**Grep commands to find all instances before running the upgrade CLI:**

```bash
# Find shadow-sm usages
grep -rn "shadow-sm" src/ --include="*.tsx" --include="*.astro"

# Find outline-none usages
grep -rn "outline-none" src/ --include="*.tsx" --include="*.astro"

# Find bare ring (not ring-1, ring-2, etc.)
grep -rn "\bring\b" src/ --include="*.tsx" --include="*.astro"

# Find ! prefix (important modifier, now suffix in v4)
grep -rn "!\w" src/ --include="*.tsx" --include="*.astro"
```

**Note on `outline-none`:** The `dropdown-menu.tsx` uses `outline-none` as a standalone class (not `focus:outline-none`) for the Radix UI menu items. In v4, `outline-none` becomes `outline-hidden`. The distinction matters: `outline-hidden` hides the outline visually but keeps it accessible; `outline-0` removes it entirely. Use `outline-hidden` for all existing `outline-none` replacements to maintain accessibility behavior.

### Additional v4 Changes to Verify

- **Border color default changed:** v4 default border color is `currentColor` (was `gray-200`). Components using `border` without explicit color (e.g., `SheetContent` uses `border-l`) may render differently. Check Header, Sheet, DropdownMenu borders.
- **Ring color/width defaults changed:** Ring width default is 1px (was 3px), ring color is `currentColor` (was `blue-500`). All `ring` uses in this codebase are explicit (`ring-2`, `ring-orange-500`) so this should be safe.
- **Arbitrary value syntax:** `bg-[--brand-color]` becomes `bg-(--brand-color)` in v4. Check for arbitrary variable references in component classes.

---

## Common Pitfalls

### Pitfall 1: Upgrade CLI Puts Plugin in Wrong Location

**What goes wrong:** `@tailwindcss/upgrade` updates `astro.config.mjs` but may add `@tailwindcss/vite` to the `integrations[]` array instead of `vite.plugins[]`. This causes Tailwind to silently not process CSS or produce "Cannot apply unknown utility class" build errors.

**Why it happens:** The CLI does not have Astro-specific knowledge about where Vite plugins should go. Astro's `integrations[]` is for Astro integrations, not Vite plugins.

**How to avoid:** Immediately after running the CLI, open `astro.config.mjs` and verify `tailwindcss` is under `vite: { plugins: [tailwindcss()] }`.

**Warning signs:** Build succeeds but no Tailwind classes appear in the rendered page; or build fails with "Cannot apply unknown utility class 'bg-background'".

### Pitfall 2: @layer base Removal Breaks Base Styles

**What goes wrong:** Removing `@layer base { * { @apply border-border; } body { @apply bg-background text-foreground; } }` without replacing the base resets causes components to lose their background and text color defaults.

**Why it happens:** In v3, `@layer base` registered these with Tailwind's cascade. In v4, use plain CSS outside any layer.

**How to avoid:** Replace with direct CSS properties in `globals.css`:

```css
* { border-color: var(--border); }
body { background-color: var(--background); color: var(--foreground); }
```

**Warning signs:** Page renders with white background and black text regardless of dark mode toggle.

### Pitfall 3: CSS Variables Not Available as Utilities

**What goes wrong:** After migration, classes like `bg-primary`, `text-muted-foreground`, `border-border` stop working because the CSS custom properties are not registered in `@theme`.

**Why it happens:** In v3, these worked because `tailwind.config.mjs` mapped them via `colors: { primary: 'hsl(var(--primary))' }`. In v4, that JS config is deleted. Without `@theme inline`, Tailwind doesn't know about these variables.

**How to avoid:** Every token that was in `tailwind.config.mjs` under `theme.extend.colors` must have a corresponding `--color-*: var(--token)` entry in `@theme inline`.

**Warning signs:** Specific color utilities produce no output; components appear unstyled even though Tailwind base loads.

### Pitfall 4: Dark Mode Toggle Stops Working

**What goes wrong:** After replacing `darkMode: ['class']` with `@custom-variant dark`, the dark mode classes render but the toggle (`mode-toggle.tsx`) has no effect.

**Why it happens:** Wrong `@custom-variant` selector. Common wrong versions:
- `@custom-variant dark (&.dark, .dark &)` — old v4 beta syntax
- `@custom-variant dark (&:is(.dark *))` — missing self-match

**How to avoid:** Use the exact selector from the official docs:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

The `&:where(.dark, .dark *)` matches both the `.dark` element itself AND its descendants, matching how `mode-toggle.tsx` adds `dark` to `<html>`.

**Warning signs:** Toggling dark mode in DevTools (adding/removing `dark` class on `<html>`) has no visible effect.

### Pitfall 5: tw-animate-css Animation Classes Not Loading

**What goes wrong:** Sheet, DropdownMenu, and MobileActionButtons lose their enter/exit animations — panel appears/disappears instantly without slide or fade.

**Why it happens:** `@import "tw-animate-css"` was not added to `globals.css`, or it was placed after `@theme`/`@custom-variant` blocks in a position where it conflicts.

**How to avoid:** Import `tw-animate-css` immediately after `@import "tailwindcss"` at the top of `globals.css`. Test Sheet open/close animation visually before calling INFRA-06 complete.

**Warning signs:** Radix UI Sheet/DropdownMenu open instantly with no transition; `MobileActionButtons` div appears without slide-in.

### Pitfall 6: Font Display Shift During Load (CLS)

**What goes wrong:** Inter Variable or Manrope Variable fonts load late and cause text to reflow, increasing CLS above 0.1 threshold.

**Why it happens:** Variable font files are larger than static-weight files. Without `font-display: swap` in the `@font-face`, the browser may hold layout until font loads.

**How to avoid:** The `@fontsource-variable` packages use `font-display: swap` by default in their pre-built CSS files. Importing `@fontsource-variable/manrope/wght.css` (not manual `@font-face`) ensures correct behavior. Verify CLS via `npm run test:lhci` after font imports are added.

**Warning signs:** Lighthouse reports CLS > 0.1; text visibly shifts from system font to custom font during page load.

### Pitfall 7: @utility with dark: @apply Edge Case

**What goes wrong:** The `.glass` utility uses `dark:bg-black/70` in the current `@apply` implementation. Converting this to `@utility` with `@apply dark:bg-black/70` may fail because `dark:` inside `@apply` inside `@utility` is a known unreliable pattern in v4.

**Why it happens:** `@apply` in v4 applies utility classes but variant handling inside `@apply` (especially `dark:`) can be inconsistent when in a `@utility` block.

**How to avoid:** Write the glass utilities using direct CSS properties with the `dark` `@custom-variant`:

```css
@utility glass {
  background-color: color-mix(in srgb, white 70%, transparent);
  backdrop-filter: blur(24px);
  border: 1px solid color-mix(in srgb, white 20%, transparent);
  box-shadow: var(--shadow-lg);
}
```

For dark mode within `@utility`, use CSS nesting with the `&:where(.dark, .dark *)` selector directly, or accept that the Phase 7 goal is "just compile" — the dark-mode glass appearance is redesigned in Phase 9 anyway.

---

## Code Examples

### Verified: Full astro.config.mjs After Migration

```javascript
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import indexnow from 'astro-indexnow';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://spicegrillbar66.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    indexnow({ key: '5a973t3xfryc2gchkn1q6chy26ss2au9' }),
    react(),
    sitemap(),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
  devToolbar: { enabled: false },
});
```

### Verified: @theme inline Mapping for This Project's Tokens

```css
/* Source: https://ui.shadcn.com/docs/tailwind-v4 — pattern adapted for this project */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand-orange: var(--brand-orange);
  --color-brand-green: var(--brand-green);
  --color-brand-gold: var(--brand-gold);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --font-sans: "Inter Variable", ui-sans-serif, sans-serif;
  --font-display: "Manrope Variable", ui-sans-serif, sans-serif;
}
```

### Verified: Dark Mode Variant

```css
/* Source: https://tailwindcss.com/docs/dark-mode */
@custom-variant dark (&:where(.dark, .dark *));
```

### Verified: tw-animate-css Import

```css
/* Source: https://github.com/Wombosvideo/tw-animate-css README */
@import "tw-animate-css";
```

---

## Validation Architecture

This section defines how to verify each INFRA requirement is correctly implemented. The planner MUST include these validation steps as explicit tasks or sub-tasks in the plan.

### Automated Validation Commands

| Command | What It Checks | When to Run |
|---------|----------------|-------------|
| `npm run build` | Full Astro/Vite build compiles; no CSS errors; no unknown utility class errors | After every configuration change |
| `npm run typecheck` | TypeScript types valid after package changes | After package installs |
| `npm run lint` | No linting errors in migrated files | After editing globals.css, astro.config.mjs |
| `npm run test:lhci` | Lighthouse scores on all 4 pages; CLS < 0.1 confirms font install is safe | Final validation gate |
| `npm run qa` | Full gate: build + lint + knip + typecheck + aeo + lhci | Phase complete gate |

### Per-Requirement Validation

#### INFRA-01: Build on TailwindCSS v4

**Automated:**
```bash
npm run build
# SUCCESS: exits 0, no "Cannot apply unknown utility class" errors in output
# FAILURE: any non-zero exit, or "Cannot apply unknown utility class 'bg-background'" in stderr
```

**Verify package state:**
```bash
# Confirm new packages installed
node -e "require('@tailwindcss/vite'); console.log('vite plugin OK')"
node -e "const p = require('./package.json'); console.log('TW version:', p.dependencies.tailwindcss || p.devDependencies.tailwindcss)"

# Confirm old package removed
node -e "try { require('@astrojs/tailwind'); console.log('FAIL: still installed') } catch(e) { console.log('OK: removed') }"
```

**Verify astro.config.mjs placement (critical):**
```bash
grep -n "tailwindcss" astro.config.mjs
# SUCCESS: line shows  plugins: [tailwindcss()]  under vite: {}
# FAILURE: tailwindcss appears in integrations[] array
```

**Success criteria:** `npm run build` exits 0. `@tailwindcss/vite` appears under `vite.plugins[]` in `astro.config.mjs`. `tailwind()` does NOT appear in `integrations[]`.

---

#### INFRA-02: CSS-First Configuration

**Automated:**
```bash
# tailwind.config.mjs must not exist
ls tailwind.config.mjs 2>/dev/null && echo "FAIL: file still exists" || echo "OK: deleted"

# globals.css must not contain old directives
grep -n "@tailwind base\|@tailwind components\|@tailwind utilities" src/styles/globals.css
# SUCCESS: no output (no matches)
# FAILURE: any matched line

# globals.css must contain new import
grep -n "@import \"tailwindcss\"" src/styles/globals.css
# SUCCESS: line found
```

**Manual check:** Open browser DevTools after `npm run dev`. Elements using `bg-background`, `text-foreground`, `bg-primary` must have computed CSS values (not empty/transparent). Check `body` element — it should have a non-white/non-default computed `background-color` set via the token system.

**Success criteria:** `tailwind.config.mjs` deleted. `src/styles/globals.css` starts with `@import "tailwindcss"`. `@theme inline { ... }` block present with all token mappings. Build succeeds.

---

#### INFRA-03: Breaking Utility Renames Applied

**Automated — pre-migration audit (run before CLI):**
```bash
# Find all shadow-sm (should be 19 instances across 6 files)
grep -rn "shadow-sm" src/ --include="*.tsx" --include="*.astro"

# Find all outline-none (dropdown-menu.tsx — 4 instances)
grep -rn "outline-none" src/ --include="*.tsx" --include="*.astro"

# Find ! prefix — AstroButton.astro has !rounded-full
grep -rn " !\w" src/ --include="*.tsx" --include="*.astro"
```

**Automated — post-migration verification:**
```bash
# After migration: shadow-sm must be shadow-xs in all files
grep -rn "shadow-sm" src/ --include="*.tsx" --include="*.astro"
# SUCCESS: zero matches (all converted to shadow-xs)

# outline-none must be outline-hidden
grep -rn "\boutline-none\b" src/ --include="*.tsx" --include="*.astro"
# SUCCESS: zero matches

# ! prefix must be gone (suffix form instead)
grep -rn " !\w" src/ --include="*.tsx" --include="*.astro"
# SUCCESS: zero matches (AstroButton.astro now has rounded-full!)
```

**Visual check:** `button.tsx` destructive variant and outline variant — rendered buttons must have correct shadow depth (should be imperceptibly smaller, not missing). The visual difference between `shadow-sm` (v3) and `shadow-xs` (v4) is purely semantic; the rendered output size is equivalent.

**Success criteria:** Zero grep matches for `shadow-sm`, `\boutline-none\b`, and `! `-prefixed utilities in `src/` after migration.

---

#### INFRA-04: Dark Mode Functional

**Automated — build check:**
```bash
# globals.css must contain exact @custom-variant syntax
grep -n "@custom-variant dark" src/styles/globals.css
# SUCCESS: shows: @custom-variant dark (&:where(.dark, .dark *));
# FAILURE: missing, or wrong selector like &.dark or &:is(.dark *)
```

**Manual verification (required — cannot be fully automated):**

1. Run `npm run dev`
2. Open `http://localhost:4321` in browser
3. Open DevTools → Elements panel
4. Select the `<html>` element
5. Add class `dark` to it manually in DevTools
6. **Pass criteria:**
   - Header background changes from light glass (white-tinted) to dark glass (dark-tinted)
   - Sheet panel background changes from light (`--background` light) to dark (`--background` dark)
   - Body background shifts from near-white to near-black
   - Text colors invert correctly
7. Remove `dark` class — page returns to light mode
8. Test the mode-toggle button in the Header — clicking it must toggle dark/light reliably

**Success criteria:** Adding `class="dark"` to `<html>` in DevTools produces correct dark backgrounds on Header and Sheet. The mode-toggle button in `Header.tsx` toggles dark mode correctly via `document.documentElement.classList.toggle('dark')`.

---

#### INFRA-05: autoprefixer Removed

**Automated:**
```bash
# postcss.config.cjs already absent — confirm
ls postcss.config* 2>/dev/null && echo "FAIL: postcss config found" || echo "OK: no postcss config"

# autoprefixer must not be in package.json
node -e "const p = require('./package.json'); const all = {...p.dependencies,...p.devDependencies}; console.log(all.autoprefixer ? 'FAIL: autoprefixer present: ' + all.autoprefixer : 'OK: autoprefixer removed')"

# tailwindcss must NOT be in devDependencies (should be in dependencies as a peer of @tailwindcss/vite)
node -e "const p = require('./package.json'); console.log('TW in deps:', !!p.dependencies?.tailwindcss, '| TW in devDeps:', !!p.devDependencies?.tailwindcss)"
```

**Build confirmation:** `npm run build` must succeed. If autoprefixer was providing necessary vendor prefixes, removal would break specific CSS properties. Since TW v4 uses Lightning CSS internally, the build should be clean.

**Success criteria:** No `postcss.config.*` file exists (already absent). `autoprefixer` not present in `package.json` dependencies or devDependencies. `npm run build` exits 0.

---

#### INFRA-06: Animation Plugin Swap Verified

**Automated:**
```bash
# tw-animate-css must be in package.json dependencies
node -e "const p = require('./package.json'); const all = {...p.dependencies,...p.devDependencies}; console.log(all['tw-animate-css'] ? 'OK: tw-animate-css ' + all['tw-animate-css'] : 'FAIL: not installed')"

# tailwindcss-animate must be removed
node -e "const p = require('./package.json'); const all = {...p.dependencies,...p.devDependencies}; console.log(all['tailwindcss-animate'] ? 'FAIL: tailwindcss-animate still present' : 'OK: removed')"

# @import must be in globals.css
grep -n "tw-animate-css" src/styles/globals.css
# SUCCESS: shows @import "tw-animate-css";

# No plugin reference in config (tailwind.config.mjs is deleted, so this is already satisfied)
# Double-check no require() of tailwindcss-animate remains in any config
grep -rn "tailwindcss-animate" . --include="*.mjs" --include="*.cjs" --include="*.js" --include="*.ts" --exclude-dir=node_modules
# SUCCESS: zero matches
```

**Manual verification (required — animations cannot be confirmed by grep):**

1. Run `npm run dev`
2. Open `http://localhost:4321` in browser
3. **Sheet animation test:** Click the hamburger menu in the header on mobile viewport (< 768px). The Sheet must slide in from the right with a transition. Close it — must slide out. If it appears/disappears instantly with no motion, INFRA-06 fails.
4. **DropdownMenu animation test:** Click the mode-toggle or any DropdownMenu trigger. The menu must fade/zoom in. Clicking away must fade/zoom out.
5. **MobileActionButtons animation test:** On mobile viewport, page load must show the bottom bar sliding up from below with a fade. It uses `animate-in slide-in-from-bottom-4 duration-700 fade-in` — should animate on first render.

**Specific animation classes confirmed in this codebase:**

| Component | File | Animation Classes Used |
|-----------|------|----------------------|
| SheetOverlay | `sheet.tsx:22` | `data-[state=open]:animate-in`, `data-[state=closed]:animate-out`, `fade-out-0`, `fade-in-0` |
| SheetContent | `sheet.tsx:32` | `animate-in`, `animate-out`, `slide-out-to-right`, `slide-in-from-right` (and other sides) |
| DropdownMenuSubContent | `dropdown-menu.tsx:49` | `animate-in`, `animate-out`, `fade-out-0`, `fade-in-0`, `zoom-out-95`, `zoom-in-95`, `slide-in-from-top-2` etc. |
| DropdownMenuContent | `dropdown-menu.tsx:66` | Same as SubContent |
| MobileActionButtons | `MobileActionButtons.astro:6` | `animate-in`, `slide-in-from-bottom-4`, `duration-700`, `fade-in` |

**Success criteria:** Sheet slides in/out with transition. DropdownMenu fades/zooms. MobileActionButtons slides up on load. Build exits 0 with no animation-related errors.

---

### Font Validation (Cross-Requirement: INFRA-01 + Lighthouse)

**Automated:**
```bash
# Variable font packages installed
node -e "require('@fontsource-variable/manrope'); console.log('manrope OK')"
node -e "require('@fontsource-variable/inter'); console.log('inter OK')"

# Font imports present in Layout.astro
grep -n "fontsource-variable" src/layouts/Layout.astro
# SUCCESS: shows both manrope/wght.css and inter/wght.css import lines
```

**Lighthouse CLS test:**
```bash
npm run build && npm run test:lhci
# SUCCESS: cumulative-layout-shift passes (< 0.1 on all 4 pages)
# FAILURE: lhci reports CLS > 0.1 — indicates font swap causing layout shift
```

**Manual font rendering check:**
1. Run `npm run build && npm run preview`
2. Open `http://localhost:4321`
3. Open DevTools → Network tab, filter by "Font"
4. Reload page
5. Verify `.woff2` files load for both `manrope` and `inter` variable fonts
6. Check Elements → Computed styles on body — `font-family` computed value should include "Inter Variable"
7. No visible text jump/reflow during page load

**Success criteria:** CLS < 0.1 on all 4 pages via `npm run test:lhci`. Both variable font woff2 files appear in Network tab. No visible layout shift during font load.

---

### Full Phase Gate: npm run qa

The phase is NOT complete until `npm run qa` passes cleanly. This command runs:

1. `npm run build` — Astro build
2. `npm run test:quality` → `npm run lint && npm run knip && npm run typecheck && npm run test:aeo`
3. `npm run test:lhci` — Lighthouse CI on all 4 pages

**Lighthouse thresholds (from `.lighthouserc.json`):**

| Metric | Threshold | Notes |
|--------|-----------|-------|
| LCP | < 4000ms | Unchanged from v1.0 baseline |
| TBT | < 600ms | Migration must not add blocking scripts |
| CLS | < 0.1 | Critical for font swap validation |
| Accessibility | ≥ 90 | `outline-none` → `outline-hidden` must not break focus indicators |
| Best Practices | ≥ 80 | |
| SEO | ≥ 90 | |

**Pages tested by LHCI:** `/`, `/near-grand-canyon/`, `/directions/`, `/faq/`

**Success criteria for phase complete:** `npm run qa` exits 0 with all assertions passing. No scores regressed from v1.0 baseline.

---

### Manual Verification Checklist

This checklist is for the implementer to run before marking the phase complete:

```
[ ] npm run build exits 0
[ ] tailwindcss appears under vite.plugins[] in astro.config.mjs (NOT integrations[])
[ ] tailwind.config.mjs deleted (ls tailwind.config.mjs returns error)
[ ] globals.css starts with @import "tailwindcss"
[ ] @theme inline block present with all color token mappings
[ ] @custom-variant dark (&:where(.dark, .dark *)) present in globals.css
[ ] autoprefixer not in package.json (devDependencies or dependencies)
[ ] tw-animate-css in package.json dependencies
[ ] tailwindcss-animate not in package.json
[ ] @fontsource-variable/manrope imported in Layout.astro
[ ] @fontsource-variable/inter imported in Layout.astro
[ ] Old @fontsource/open-sans and @fontsource/playfair-display still imported (D-02)
[ ] grep for shadow-sm in src/ returns zero matches
[ ] grep for outline-none in src/ returns zero matches
[ ] grep for "! " prefix pattern in src/ returns zero matches
[ ] Dark mode: adding class="dark" to <html> in DevTools changes Header + Sheet backgrounds
[ ] Sheet animation: slides in/out with motion (not instant appear/disappear)
[ ] DropdownMenu animation: fades/zooms in/out
[ ] MobileActionButtons: slides up from bottom on mobile viewport
[ ] npm run test:lhci passes all 4 pages with no score regressions
[ ] npm run qa exits 0 (full gate)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.mjs` JS config | `@theme` CSS directive | TW v4 (2025) | No JS file needed; design tokens live in CSS |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | TW v4 (2025) | Single import replaces three directives |
| `@astrojs/tailwind` Astro integration | `@tailwindcss/vite` Vite plugin | TW v4 + Astro 5.2 | Plugin goes in `vite.plugins[]`, not `integrations[]` |
| `darkMode: ['class']` in JS config | `@custom-variant dark` in CSS | TW v4 (2025) | Dark mode selector defined in CSS; more flexible |
| `@layer utilities { .glass { @apply ... } }` | `@utility glass { ... }` | TW v4 (2025) | Custom utilities auto-participate in modifier system |
| `tailwindcss-animate` JS plugin | `tw-animate-css` CSS import | 2025 | CSS-first; same class names, no JS plugin overhead |
| `autoprefixer` PostCSS plugin | Nothing (Lightning CSS) | TW v4 (2025) | Tailwind's compiler handles prefixing internally |
| Bare HSL triples `--bg: 0 0% 100%` | Full values `--bg: hsl(0 0% 100%)` | TW v4 (2025) | v4 does not auto-wrap in `hsl()`; values must be valid CSS |

**Deprecated/outdated in this project:**
- `require('tailwindcss-animate')` plugin syntax — replaced by CSS import
- `colors: { primary: 'hsl(var(--primary))' }` pattern — replaced by `@theme inline`
- `@astrojs/tailwind` package — deprecated for TW v4 usage

---

## Open Questions

1. **`@tailwindcss/upgrade` CLI exact Astro behavior**
   - What we know: CLI is confirmed to require manual review for Astro projects; it may misplace the Vite plugin
   - What's unclear: Whether the current CLI version (as of March 2026) has improved Astro detection
   - Recommendation: Treat CLI output as a starting point requiring manual verification; do not trust `astro.config.mjs` output without inspection

2. **`border-color` default change impact on Sheet and DropdownMenu**
   - What we know: TW v4 changes default border color from `gray-200` to `currentColor`
   - What's unclear: Sheet uses `border-l` and `border-r` without explicit color; DropdownMenu uses `border` — these may render dark or invisible borders after migration
   - Recommendation: After migration, visually inspect Sheet open/close in both light and dark mode; add explicit `border-zinc-200 dark:border-zinc-800` if needed

3. **`@utility glass` dark-mode behavior**
   - What we know: The current `.glass` uses `dark:bg-black/70 dark:border-white/10` via `@apply`; `@apply` with `dark:` inside `@utility` is unreliable
   - What's unclear: Whether the current tw v4.2.2 has fixed this or still has the limitation
   - Recommendation: Write `@utility glass` using direct CSS; note that visual correctness of glass in dark mode is a Phase 9 concern, so "good enough to compile and not break layout" is the Phase 7 bar

---

## Sources

### Primary (HIGH confidence)
- `https://tailwindcss.com/docs/upgrade-guide` — Complete v4 breaking changes; utility renames; @layer to @utility migration
- `https://tailwindcss.com/docs/installation/framework-guides/astro` — Exact `astro.config.mjs` pattern with `vite.plugins[]`
- `https://tailwindcss.com/docs/dark-mode` — `@custom-variant dark (&:where(.dark, .dark *))` syntax
- `https://tailwindcss.com/docs/theme` — `@theme` and `@theme inline` directives; `--font-*`, `--color-*` naming
- `https://tailwindcss.com/docs/adding-custom-styles` — `@utility` directive syntax
- `https://fontsource.org/fonts/manrope/install` — `@fontsource-variable/manrope` install and CSS import
- `https://fontsource.org/fonts/inter/install` — `@fontsource-variable/inter` install and CSS import
- `.lighthouserc.json` — Actual LHCI thresholds used in `npm run test:lhci`

### Secondary (MEDIUM confidence)
- `https://ui.shadcn.com/docs/tailwind-v4` — shadcn/ui `@theme inline` pattern for token migration; HSL variable format
- `https://github.com/Wombosvideo/tw-animate-css` — tw-animate-css README; animation class list confirmation

### Tertiary (LOW confidence)
- `https://github.com/tailwindlabs/tailwindcss/issues/18055` — Community-reported Astro upgrade CLI issues; "Cannot apply unknown utility class" on Astro projects
- `https://blog.okaryo.studio/en/20250201-astro-tailwindcss-v4-upgrade/` — Real-world Astro upgrade notes; `@reference` directive for component `<style>` blocks
- `https://bhdouglass.com/blog/how-to-upgrade-your-astro-site-to-tailwind-v4/` — Additional Astro upgrade experience

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — package names and versions verified from npm registry directly; official Tailwind docs confirm @tailwindcss/vite is the correct Astro integration
- Architecture: HIGH — CSS patterns sourced from official Tailwind v4 docs and shadcn/ui v4 migration guide
- Breaking Changes Inventory: HIGH — rename list sourced from official upgrade guide; grep audit of codebase confirms which files are affected (19 shadow-sm instances confirmed across 6 files)
- Validation Architecture: HIGH — commands verified against actual project scripts, package.json, and .lighthouserc.json; manual steps derived from actual component code in sheet.tsx, dropdown-menu.tsx, MobileActionButtons.astro
- tw-animate-css compatibility: MEDIUM — package confirmed to provide all class names used in this codebase per README; not independently run against this codebase
- @utility glass dark-mode behavior: LOW — community reports of `@apply dark:` issues inside `@utility` but no official confirmation of fix status in v4.2.2

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable migration tooling; 30-day window before re-checking tw-animate-css v2.0.0 release status)
