# Technology Stack

**Project:** Spice Grill & Bar — v2.0 UI Facelift ("The Radiant Sommelier")
**Researched:** 2026-03-24
**Scope:** NEW additions and changes only. Existing validated capabilities (Astro 5.17.1, React islands, `@astrojs/react`, Partytown, schema components, Apache deploy, Radix UI primitives, shadcn patterns) are not re-researched here.

---

## Executive Summary

This milestone requires exactly four package-level changes: swap TailwindCSS v3 for v4 (different packages, different integration point), replace the v3-only animation plugin with its v4 CSS-native replacement, and swap two font packages. Everything else in the stack is untouched. The largest complexity is not in the packages themselves but in the migration procedure — the `@tailwindcss/upgrade` CLI tool partially works with Astro but leaves Astro-specific gaps that must be completed manually.

---

## What Changes

### Remove

| Package | Reason |
|---------|--------|
| `tailwindcss ^3.4.19` (devDep) | Replaced by Tailwind v4. Different package behavior — v4 bundles Lightning CSS, removes PostCSS dependency. |
| `@astrojs/tailwind ^6.0.2` (devDep) | Deprecated for Tailwind v4. The Vite-native `@tailwindcss/vite` plugin is the v4 replacement. |
| `autoprefixer ^10.4.24` (devDep) | Tailwind v4 bundles Lightning CSS which handles vendor prefixing natively. Autoprefixer is a no-op in v4 and should be removed. |
| `tailwindcss-animate ^1.0.7` (dep) | Uses the v3 JS plugin API (`plugins: [require('tailwindcss-animate')]`). That plugin API does not exist in v4. Must be replaced before running the upgrade tool. |
| `@fontsource/open-sans ^5.2.7` (dep) | Font swap per DESIGN.md: Open Sans replaced by Inter. |
| `@fontsource/playfair-display ^5.2.8` (dep) | Font swap per DESIGN.md: Playfair Display replaced by Manrope. |
| `tailwind.config.mjs` (file) | v4 uses CSS-first `@theme` configuration. The JS config file is deleted entirely. |

Note: there is no `postcss.config.*` file in this project root. If the `@tailwindcss/upgrade` tool creates one, delete it — Astro uses the Vite plugin, not PostCSS.

### Add

| Package | Version | Location | Why |
|---------|---------|----------|-----|
| `tailwindcss` | `^4.2.2` | devDep | v4 core — CSS-first, Lightning CSS built-in, no PostCSS config needed |
| `@tailwindcss/vite` | `^4.2.2` | devDep | Vite-native plugin. Replaces `@astrojs/tailwind` in `astro.config.mjs`. Goes in `vite.plugins[]`, not `integrations[]`. |
| `tw-animate-css` | `^1.4.0` | dep | v4-compatible replacement for `tailwindcss-animate`. Pure CSS. Imported with `@import "tw-animate-css"` in the global CSS file. Ships the same accordion-down/up, animate-in/out utilities used by the Radix Dialog, DropdownMenu, and Sheet components. |
| `@fontsource-variable/manrope` | `^5.2.8` | dep | Variable font, self-hosted, weight range 200–800. DESIGN.md display/headline font. Same import pattern as existing `@fontsource/open-sans`. |
| `@fontsource-variable/inter` | `^5.2.8` | dep | Variable font, self-hosted, weight range 100–900. DESIGN.md body/label font. Same import pattern as existing `@fontsource/playfair-display`. |

**Confidence — packages:** HIGH. `@tailwindcss/vite` at 4.2.2 verified via npm registry (March 2026). `tw-animate-css` at 1.4.0 verified via npm registry. `@fontsource-variable/*` at 5.2.8 verified via npm registry.

---

## Integration Changes

### 1. astro.config.mjs — Replace Integration with Vite Plugin

The `@tailwindcss/vite` plugin is not an Astro integration — it is a Vite plugin. It must live in `vite.plugins`, not `integrations`.

**Before:**
```js
import tailwind from '@astrojs/tailwind';
// ...
integrations: [react(), tailwind(), sitemap(), ...],
```

**After:**
```js
import tailwindcss from '@tailwindcss/vite';
// ...
integrations: [react(), sitemap(), ...],  // tailwind removed from integrations
vite: {
  plugins: [tailwindcss()],
},
```

Remove `import tailwind from '@astrojs/tailwind'` entirely. The `@astrojs/tailwind` import will throw if the package is uninstalled.

### 2. Global CSS Rewrite (src/styles/globals.css)

The current `globals.css` uses `@tailwind base/components/utilities` and a shadcn-style HSL variable system in `@layer base`. In v4 this file becomes the configuration source of truth using new directives.

**Structure of the new globals.css:**
```css
/* 1. Import Tailwind v4 */
@import "tailwindcss";

/* 2. Import animation utilities (replaces tailwindcss-animate plugin) */
@import "tw-animate-css";

/* 3. Dark mode variant (replaces darkMode: ['class'] in tailwind.config.mjs) */
@custom-variant dark (&:is(.dark *));

/* 4. CSS-first theme (replaces tailwind.config.mjs @theme extension) */
@theme inline {
  /* Font families */
  --font-sans: 'Inter Variable', sans-serif;
  --font-display: 'Manrope Variable', sans-serif;

  /* DESIGN.md surface hierarchy — 5 depth levels */
  --color-surface-dim:              #1f0f0b;   /* Level 0: base/page background */
  --color-surface-container-low:    #281713;   /* Level 1: sectioning */
  --color-surface-container:        #2d1b17;   /* Level 2: active cards */
  --color-surface-container-high:   #3d2620;   /* Level 3: floating elements */
  --color-surface-bright:           #49342f;   /* Level 3 alt: floating (DESIGN.md exact value) */

  /* Brand colors from DESIGN.md */
  --color-primary:                  #ff5626;
  --color-primary-container:        #ff5626;
  --color-inverse-primary:          #ff8f6a;
  --color-brand-orange:             #ff4b12;
  --color-brand-green:              #2d5a27;
  --color-brand-gold:               #ffc062;

  /* Semantic tokens (shadcn-compatible remapping) */
  /* ... full token map driven by DESIGN.md palette ... */
  --color-background:               var(--color-surface-dim);
  --color-foreground:               #f5ece9;
  --color-border:                   color-mix(in srgb, var(--color-surface-bright) 30%, transparent);
}

/* 5. Custom utilities for glassmorphism (replaces @layer utilities .glass/.glass-card) */
@utility glass {
  background: color-mix(in srgb, var(--color-surface-container-high) 70%, transparent);
  backdrop-filter: blur(32px);
  box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--color-surface-bright) 20%, transparent);
}

@utility glass-card {
  background: color-mix(in srgb, var(--color-surface-container) 80%, transparent);
  backdrop-filter: blur(20px);
}
```

The `@theme inline` variant (as used by shadcn/ui v4 migration) avoids the need for `hsl()` wrappers by making token values directly available as CSS variables without generating duplicate `--tw-*` shadow variables.

### 3. Delete tailwind.config.mjs

All configuration moves into `@theme {}` in globals.css. The file must be deleted — v4 ignores it and keeping it creates confusion.

### 4. Font Imports in Layout.astro

Replace existing `@fontsource` imports:

```js
// Remove:
import '@fontsource/open-sans';
import '@fontsource/playfair-display';

// Add:
import '@fontsource-variable/manrope';
import '@fontsource-variable/inter';
```

Variable font CSS from `@fontsource-variable/*` packages is self-hosted WOFF2 — no Google Fonts CDN, no DNS lookup, no FOUT risk, fonts are bundled at build time. This is the correct approach for LCP and CLS requirements. The `@fontsource-variable/*` packages are the variable-font equivalents of the `@fontsource/*` packages already in use.

Do NOT use Astro 5.7's experimental Fonts API (`experimental.fonts`). It was added in Astro 5.7 and is still experimental (flagged in official docs). The `@fontsource-variable` approach is stable, already follows the project pattern, and requires zero Astro config changes.

---

## v4 Breaking Changes That Will Affect This Codebase

### @apply in Astro Component `<style>` Blocks

This is the most likely source of build failures after migration. Tailwind v4 no longer auto-injects theme variables into scoped `<style>` blocks in `.astro` files. Any `<style>` block using `@apply` with custom tokens or any utility class that depends on theme values will fail.

The current `globals.css` uses `@apply border-border` and `@apply bg-background text-foreground` in `@layer base`. These move to direct CSS in v4.

**Fix options:**
1. Add `@reference "../styles/globals.css";` as the first line of any `<style>` block using `@apply`
2. Move custom utility definitions to `@utility` in globals.css (shown above for `.glass` and `.glass-card`) — this is the v4-native approach and should be preferred

The project currently uses `.glass` and `.glass-card` in JSX components. Moving these to `@utility glass` and `@utility glass-card` in globals.css makes them available as utility classes (`class="glass"`) without needing `@apply` in scoped styles.

**Confidence:** HIGH. Multiple community reports and official v4 docs confirm this scope change. It is the most-reported migration pain point for Astro + Tailwind v4.

### Dark Mode Variant

`darkMode: ['class']` in `tailwind.config.mjs` does not exist in v4. The HTML `.dark` class toggle the site already uses is preserved with a one-line CSS replacement:

```css
@custom-variant dark (&:is(.dark *));
```

This goes in globals.css. The `dark:` prefix on utility classes continues to work identically.

**Confidence:** HIGH. Documented in v4 upgrade guide. shadcn/ui v4 migration uses this exact pattern.

### Border Default Changed

In v3, `@apply border` applied a `solid currentColor` border. In v4, `border` uses `var(--color-border)`. The existing `@layer base { * { @apply border-border; } }` pattern is a v3 reset. In v4, the equivalent is either:
- Remove it entirely (v4 default border color is already `var(--color-border)`)
- Replace with `*, *::before, *::after { border-color: var(--color-border); }` in a `@layer base` block

**Confidence:** HIGH. Official v4 upgrade guide.

### Renamed Utilities (Template Scan Required)

v4 renames several utilities that may be used in this codebase:

| v3 Class | v4 Class |
|----------|----------|
| `shadow-sm` | `shadow-xs` |
| `drop-shadow-sm` | `drop-shadow-xs` |
| `blur-sm` | `blur-xs` |
| `ring-offset-*` | Removed — use `outline-offset-*` |
| `flex-shrink-*` | `shrink-*` |
| `flex-grow-*` | `grow-*` |
| `overflow-ellipsis` | `text-ellipsis` |
| `decoration-slice` | `box-decoration-slice` |

The `@tailwindcss/upgrade` CLI tool handles these template renames automatically.

---

## The @tailwindcss/upgrade CLI Tool

**Verdict: Use it for template scanning. Manually complete the Astro-specific steps.**

The tool (`npx @tailwindcss/upgrade`) runs three passes:
1. Template scan — renames deprecated utility classes in all `.astro`, `.tsx`, `.ts` files
2. Config migration — converts `tailwind.config.mjs` to a draft CSS `@theme` block
3. Dependency update — updates `package.json`

**Known Astro-specific failures (multiple community reports, Feb–Mar 2025/2026):**

- Crashes with "Cannot apply unknown utility class" when the project has `@apply` using HSL CSS variables — the tool cannot resolve them during its scan pass
- Does not correctly rewrite `astro.config.mjs` — it may add `@tailwindcss/vite` to `integrations[]` instead of `vite.plugins[]`
- PostCSS config migration step fails or creates an unnecessary `postcss.config.cjs` (not relevant here since we have none)
- Crashes on `plugins: [require('tailwindcss-animate')]` in `tailwind.config.mjs`

**Recommended procedure:**

```
1. Remove tailwindcss-animate from tailwind.config.mjs plugins array before running the tool
   (comment it out: // plugins: [require('tailwindcss-animate')])

2. Run: npx @tailwindcss/upgrade
   - Accept the template rename pass (shadow-sm → shadow-xs etc.)
   - Use the generated CSS @theme block as a draft/reference only

3. Manually fix astro.config.mjs:
   - Move @tailwindcss/vite from integrations[] to vite.plugins[]
   - Remove @astrojs/tailwind import

4. Write the final globals.css @theme block from DESIGN.md spec
   (the tool's draft will have the old shadcn tokens — use it as a starting point)

5. Delete tailwind.config.mjs
```

**Confidence — upgrade tool behavior:** MEDIUM. Based on documented issues in tailwindlabs/tailwindcss GitHub (issues #18055, #16733, discussion #15809). Core breakages are well-documented. Tool may improve in patch releases.

---

## What NOT to Add

| Package | Why Not |
|---------|---------|
| Any CSS glassmorphism plugin (`@casoon/tailwindcss-glass` etc.) | DESIGN.md glassmorphism is specific enough to implement with 2 `@utility` blocks. A plugin adds a dep for 3 utility classes. |
| `@tailwindcss/typography` | Not needed for this site's content structure. |
| `@tailwindcss/forms` | Radix UI handles form styling. No native HTML forms on the site. |
| `tailwind-animate` (npm package) | Different package from `tw-animate-css`. Less active, less aligned with v4 CSS-first architecture. Avoid name confusion. |
| Astro experimental Fonts API | Flagged experimental in Astro 5.17. `@fontsource-variable/*` is stable and already follows the project pattern. No upside for added instability risk. |
| `postcss-import`, `autoprefixer` | Removed. Built into v4's Lightning CSS engine. Adding them does nothing. |
| Any new React animation library (Framer Motion, etc.) | PROJECT.md explicitly prohibits new deps beyond Tailwind v4 migration. Bundle constraint is non-negotiable. |

---

## Install Commands

```bash
# 1. Remove old packages
npm uninstall @astrojs/tailwind tailwindcss-animate @fontsource/open-sans @fontsource/playfair-display autoprefixer

# 2. Add new packages
npm install -D tailwindcss @tailwindcss/vite
npm install tw-animate-css @fontsource-variable/manrope @fontsource-variable/inter

# 3. Run upgrade tool for template scanning (after removing tailwindcss-animate from config)
npx @tailwindcss/upgrade
```

---

## Summary Table

| Category | v3 (Current) | v4 (New) | Confidence |
|----------|-------------|---------|------------|
| Tailwind core | `tailwindcss ^3.4.19` devDep | `tailwindcss ^4.2.2` devDep | HIGH |
| Astro integration | `@astrojs/tailwind` in `integrations[]` | `@tailwindcss/vite` in `vite.plugins[]` | HIGH |
| Configuration file | `tailwind.config.mjs` (JS) | Deleted — replaced by `@theme` in `globals.css` | HIGH |
| Dark mode | `darkMode: ['class']` in JS config | `@custom-variant dark (&:is(.dark *))` in CSS | HIGH |
| Animation plugin | `tailwindcss-animate ^1.0.7` dep | `tw-animate-css ^1.4.0` dep, `@import "tw-animate-css"` | HIGH |
| Vendor prefixing | `autoprefixer` devDep | Built into v4 Lightning CSS — remove autoprefixer | HIGH |
| Display/headline font | `@fontsource/playfair-display ^5.2.8` | `@fontsource-variable/manrope ^5.2.8` | HIGH |
| Body/label font | `@fontsource/open-sans ^5.2.7` | `@fontsource-variable/inter ^5.2.8` | HIGH |
| Custom utilities `.glass` | `@layer utilities { .glass { @apply ... } }` | `@utility glass { ... }` in globals.css | HIGH |
| `@apply` in scoped styles | Works automatically | Requires `@reference` prefix or refactor to `@utility` | HIGH |
| PostCSS config | None present | None needed (delete if tool creates one) | HIGH |

---

## Sources

- [Install Tailwind CSS with Astro — Tailwind CSS official](https://tailwindcss.com/docs/installation/framework-guides/astro) — authoritative Astro integration pattern (HIGH)
- [Tailwind CSS v4.0 release blog](https://tailwindcss.com/blog/tailwindcss-v4) — v4 feature overview, Lightning CSS, CSS-first (HIGH)
- [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — breaking changes, renamed utilities, @custom-variant (HIGH)
- [Tailwind CSS Theme Variables docs](https://tailwindcss.com/docs/theme) — @theme, @utility, @custom-variant directives (HIGH)
- [Tailwind CSS Dark Mode docs](https://tailwindcss.com/docs/dark-mode) — @custom-variant pattern for class-based dark mode (HIGH)
- [shadcn/ui Tailwind v4 migration guide](https://ui.shadcn.com/docs/tailwind-v4) — @theme inline, CSS variable pattern, component updates (HIGH)
- [tw-animate-css on GitHub (Wombosvideo)](https://github.com/Wombosvideo/tw-animate-css) — v4-compatible tailwindcss-animate replacement (HIGH)
- [tw-animate-css on npm](https://www.npmjs.com/package/tw-animate-css) — version 1.4.0, install and `@import` usage (HIGH)
- [@fontsource-variable/manrope on npm](https://www.npmjs.com/package/@fontsource-variable/manrope?activeTab=versions) — version 5.2.8 (HIGH)
- [@fontsource-variable/inter on npm](https://www.npmjs.com/package/@fontsource-variable/inter) — version 5.2.8 (HIGH)
- [Astro 5.2 — Tailwind v4 support announcement](https://astro.build/blog/astro-520/) — official confirmation @tailwindcss/vite is the v4 path in Astro (HIGH)
- [Upgrading TailwindCSS to v4 in an Astro Blog — okaryo.log](https://blog.okaryo.studio/en/20250201-astro-tailwindcss-v4-upgrade/) — Astro-specific migration experience, @reference workaround (MEDIUM)
- [How to Upgrade Your Astro Site to Tailwind v4 — Brian Douglass](https://bhdouglass.com/blog/how-to-upgrade-your-astro-site-to-tailwind-v4/) — vite.plugins vs integrations, postcss deletion (MEDIUM)
- [Astro site failing after upgrading Tailwind v3 to v4 — GitHub issue #18055](https://github.com/tailwindlabs/tailwindcss/issues/18055) — documented upgrade tool failures with Astro (MEDIUM)
- [Astro Experimental Fonts API docs](https://docs.astro.build/en/reference/experimental-flags/fonts/) — why we're NOT using it (experimental status confirmed) (HIGH)
