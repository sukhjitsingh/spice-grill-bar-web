# Phase 8: Token System - Research

**Researched:** 2026-03-25
**Domain:** CSS design token architecture — Material Design 3 palette, Tailwind v4 `@theme inline`, shadcn-to-M3 migration
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Token Source of Truth**
- D-01: Use the M3 palettes from `docs/UI-template.html` (dark) and `docs/UI-light-template.html` (light) as the authoritative token source — these are Material Design 3 palettes generated from the `#FF4B12` seed color
- D-02: Implement the full M3 surface depth (lowest, dim, low, container, high, highest, bright, variant) — not limited to DESIGN.md's original 5 levels
- D-03: Implement the full M3 semantic set: primary, secondary, tertiary, error, surface, outline, and inverse families with all `on-*` contrast pairs

**Dynamic Architecture**
- D-04: All colors must be CSS custom properties in `globals.css` (`:root` for light, `.dark` for dark) — zero hardcoded hex values in component classes
- D-05: All utilities (.glass, .glass-card, .hero-gradient, .cta-gradient) must reference `var(--*)` tokens so they adapt when the palette changes
- D-06: Palette swap = update `globals.css` only — regenerate from a new seed, paste new values, everything cascades
- D-07: Light mode is the default (`:root`). Dark mode activates via `.dark` class — matches current site behavior

**Shadcn Token Removal**
- D-08: Remove shadcn token names entirely — replace with M3 token names directly (no aliasing)
- D-09: Update all Radix component (Button, Sheet, DropdownMenu) class references to use M3 token names — token swap only, no visual reskin in this phase
- D-10: Button mapping: shadcn `bg-primary` → M3 `bg-primary-container` (high-saturation orange CTA)
- D-11: Drop chart-1 through chart-5 tokens (no charts on site)
- D-12: Remove old brand tokens (`--brand-orange`, `--brand-green`, `--brand-gold`) — M3 primary-container replaces brand orange; grep for usage and replace

**Glass & Blur Utilities**
- D-13: Update `.glass` and `.glass-card` in Phase 8 — overrides Phase 7 D-10 deferral
- D-14: `.glass` = full glassmorphism: `backdrop-blur: 32px`, surface-container-high at 70% opacity, 0.5px inner glow stroke using outline-variant at 20% — reserved for Header, Sheet, DropdownMenu ONLY
- D-15: `.glass-card` = tonal surface treatment with NO backdrop-blur per DESIGN.md blur budget — cards use surface background shifts (surface-container/surface-container-high), ghost border (outline-variant at 15%), tinted shadow
- D-16: `.glass` is mode-adaptive via CSS custom variables (`--glass-bg`, `--glass-border`) — dark mode uses warm brown tint, light mode uses warm cream/white tint. Single utility definition, auto-adapts per mode

**Shadows**
- D-17: Define `--shadow-color` token: dark mode `rgba(25,10,7,0.4)`, light mode `rgba(243,211,203,0.3)` — all shadows tinted, never neutral gray per DESIGN.md

**Gradient Utilities**
- D-18: Define `.hero-gradient` using M3 tokens: 135deg from primary-container at 15% opacity (dark) / 10% opacity (light) → transparent
- D-19: Define `.cta-gradient` using M3 tokens: 135deg from primary-container → inverse-primary — auto-adapts per mode

**Token Naming**
- D-20: Kebab-case matching Tailwind utility classes: `--surface-container-low`, `--on-primary-container`, `--outline-variant`
- D-21: Flat namespace for all tokens including `on-*` contrast pairs — no grouping or nesting

**CSS Format & Theme Pattern**
- D-22: Use hex color values from templates directly (not HSL) — `--surface-container: #2d1b17` not `hsl(13 36% 13%)`. Tailwind v4 handles hex natively
- D-23: Continue `@theme inline` pattern from Phase 7 — tokens defined as CSS vars in `:root`/`.dark`, wired into Tailwind via `@theme inline { --color-surface-container: var(--surface-container); }`
- D-24: Two-layer architecture: (1) `:root`/`.dark` blocks hold raw token values (hex), (2) `@theme inline` block maps each token to Tailwind's `--color-*` namespace so utility classes like `bg-surface-container` resolve correctly

**Typography**
- D-25: Font families only in Phase 8 per TOKEN-04: `--font-sans: "Inter"`, `--font-display: "Manrope"` — typography scale deferred to Phase 9

### Claude's Discretion
- Remaining shadcn → M3 mappings for card, muted, accent, border, input, ring, popover, destructive (Claude picks best M3 equivalent based on template usage patterns)
- Specific opacity values for light mode glass tint
- Order of implementation within the phase

### Deferred Ideas (OUT OF SCOPE)
- Typography scale classes (display-lg, body-md, label-sm with sizes/line-heights/letter-spacing) — Phase 9
- Visual reskin of Radix components (layout, spacing, animations) — Phase 9
- Component-level design polish — Phase 9
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOKEN-01 | Surface hierarchy tokens defined (5 depth levels: dim, container-low, container, container-high, bright) for dark mode per DESIGN.md | Dark mode hex values extracted from `docs/UI-template.html` — all 8 surface levels present |
| TOKEN-02 | Light mode surface hierarchy tokens defined as warm-tint inversions of dark palette | Light mode hex values extracted from `docs/UI-light-template.html` — warm creams not cool grays |
| TOKEN-03 | Shadcn semantic tokens (primary, card, muted, accent, etc.) remapped to DESIGN.md colors via hybrid `@theme inline` pattern | Full mapping table documented in Architecture Patterns section |
| TOKEN-04 | Font families registered in `@theme` — `--font-sans: "Inter"`, `--font-display: "Manrope"` | Already partially set up in Phase 7 globals.css; requires cleanup and confirmation |
| TOKEN-05 | All CSS variables use full color values (not bare HSL triples) compatible with Tailwind v4 | Phase 7 delivered HSL full values; Phase 8 converts to hex per D-22; hex is fully v4-compatible |
</phase_requirements>

---

## Summary

Phase 8 replaces the current `globals.css` shadcn token system entirely with a Material Design 3 palette derived from the `#FF4B12` seed color. The authoritative hex values live in `docs/UI-template.html` (dark mode) and `docs/UI-light-template.html` (light mode) — these are the only source of truth; no recalculation is needed.

The implementation follows a strict two-layer CSS architecture. Layer 1 is the `:root` and `.dark` blocks holding raw hex values as named CSS custom properties (e.g., `--surface-container: #2d1b17`). Layer 2 is a single `@theme inline` block that maps each custom property into Tailwind's `--color-*` namespace (e.g., `--color-surface-container: var(--surface-container)`), making `bg-surface-container` work as a Tailwind utility class. This pattern is already established in Phase 7 and just needs its shadcn entries replaced with M3 entries.

Beyond colors, Phase 8 also rewrites the `.glass` and `.glass-card` utilities to reference tokens, defines `.hero-gradient` and `.cta-gradient` as token-based utilities, updates all three Radix UI components (Button, Sheet, DropdownMenu) to use M3 class names, removes the `--brand-*` tokens and their usages across the codebase, and registers the `--font-sans`/`--font-display` families cleanly.

**Primary recommendation:** Work in a single globals.css rewrite followed by component class updates. Do not alias — remove shadcn names outright per D-08.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TailwindCSS v4 | Already installed | Utility class generation from `@theme inline` | Foundation from Phase 7 |
| CSS Custom Properties | Native | Token storage in `:root`/`.dark` | Zero-runtime, cascade-native |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@theme inline` directive | TW v4 feature | Wire CSS vars into utility namespace | Required for `bg-surface-container` etc. |
| `@utility` directive | TW v4 feature | Define `.glass`, `.glass-card` etc. | Required for custom utilities in v4 |
| `@custom-variant dark` | TW v4 feature | Dark mode via `.dark` class | Already configured in globals.css line 5 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hex values (D-22) | HSL values | HSL was shadcn convention; hex is cleaner for M3 templates that output hex; no functional difference in TW v4 |
| Direct `@theme inline` mapping | CSS-only vars without `@theme` | Without `@theme inline`, utility classes like `bg-surface-container` would not be generated |

---

## Architecture Patterns

### globals.css Structure After Phase 8
```
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  /* LAYER 1: Raw M3 tokens — light mode */
  --surface-dim: #f3d3cb;
  --surface: #fff8f6;
  --surface-container-lowest: #ffffff;
  --surface-container-low: #fff1ed;
  --surface-container: #ffe9e4;
  --surface-container-high: #ffe2db;
  --surface-container-highest: #fcdcd3;
  --surface-bright: #fff8f6;
  --surface-variant: #fcdcd3;
  --on-surface: #281713;
  --on-surface-variant: #5c4038;
  --primary: #ad2b00;
  --primary-container: #d93900;
  --on-primary: #ffffff;
  --on-primary-container: #fffbff;
  --primary-fixed: #ffdbd1;
  --primary-fixed-dim: #ffb5a1;
  --on-primary-fixed: #3b0900;
  --on-primary-fixed-variant: #882000;
  --secondary: #a53c1e;
  --secondary-container: #fe7d5a;
  --on-secondary: #ffffff;
  --on-secondary-container: #701900;
  --secondary-fixed: #ffdbd1;
  --secondary-fixed-dim: #ffb5a1;
  --on-secondary-fixed: #3b0900;
  --on-secondary-fixed-variant: #842407;
  --tertiary: #005ea2;
  --tertiary-container: #0077cb;
  --on-tertiary: #ffffff;
  --on-tertiary-container: #fdfcff;
  --tertiary-fixed: #d2e4ff;
  --tertiary-fixed-dim: #a0c9ff;
  --on-tertiary-fixed: #001c37;
  --on-tertiary-fixed-variant: #00497f;
  --error: #ba1a1a;
  --error-container: #ffdad6;
  --on-error: #ffffff;
  --on-error-container: #93000a;
  --outline: #916f66;
  --outline-variant: #e6beb3;
  --inverse-surface: #3f2c27;
  --inverse-on-surface: #ffede9;
  --inverse-primary: #ffb5a1;
  --surface-tint: #b12d00;
  --background: #fff8f6;
  --on-background: #281713;
  /* Glass adaptive vars (light mode) */
  --glass-bg: rgba(255, 226, 219, 0.70);
  --glass-border: rgba(230, 190, 179, 0.20);
  /* Shadow token (light mode) */
  --shadow-color: rgba(243, 211, 203, 0.3);
  --radius: 0.5rem;
}

.dark {
  /* LAYER 1: Raw M3 tokens — dark mode */
  --surface-dim: #1f0f0b;
  ... (all dark mode hex values)
  /* Glass adaptive vars (dark mode) */
  --glass-bg: rgba(56, 38, 33, 0.70);
  --glass-border: rgba(92, 64, 56, 0.20);
  --shadow-color: rgba(25, 10, 7, 0.4);
}

@theme inline {
  /* LAYER 2: Wire all tokens to Tailwind utility namespace */
  --color-surface-dim: var(--surface-dim);
  --color-surface: var(--surface);
  --color-surface-container-lowest: var(--surface-container-lowest);
  --color-surface-container-low: var(--surface-container-low);
  --color-surface-container: var(--surface-container);
  --color-surface-container-high: var(--surface-container-high);
  --color-surface-container-highest: var(--surface-container-highest);
  --color-surface-bright: var(--surface-bright);
  --color-surface-variant: var(--surface-variant);
  --color-on-surface: var(--on-surface);
  --color-on-surface-variant: var(--on-surface-variant);
  --color-primary: var(--primary);
  --color-primary-container: var(--primary-container);
  --color-on-primary: var(--on-primary);
  --color-on-primary-container: var(--on-primary-container);
  ... (all other tokens)
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Manrope Variable", ui-sans-serif, system-ui, sans-serif;
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

/* Base resets */
* { border-color: var(--outline-variant); }
body { background-color: var(--background); color: var(--on-surface); }

/* Custom utilities */
@utility glass { ... }
@utility glass-card { ... }
@utility hero-gradient { ... }
@utility cta-gradient { ... }
```

### Pattern 1: Two-Layer Token Architecture
**What:** CSS vars in `:root`/`.dark` hold raw values. `@theme inline` maps them to Tailwind's `--color-*` namespace. Components only use Tailwind utilities (`bg-surface-container`, not `var(--surface-container)` directly in class attributes).
**When to use:** Always — this is the authoritative pattern per D-23/D-24.
**Example:**
```css
/* Layer 1: raw value */
:root { --surface-container: #ffe9e4; }
.dark { --surface-container: #2d1b17; }

/* Layer 2: Tailwind registration */
@theme inline { --color-surface-container: var(--surface-container); }
```
Then in components: `<div class="bg-surface-container">` — Tailwind resolves `bg-surface-container` → `background-color: var(--color-surface-container)` → which resolves to `var(--surface-container)` → which is hex from the active mode block.

### Pattern 2: Glass Utility with Mode-Adaptive CSS Vars
**What:** `.glass` defines background/border using `--glass-bg`/`--glass-border` custom properties, which are set differently in `:root` (light warm cream) vs `.dark` (warm brown). Single `@utility` definition, auto-adapts per mode.
**When to use:** `.glass` for Header, Sheet, DropdownMenu ONLY (blur budget). `.glass-card` for cards (no blur, tonal shifts only).
```css
/* In :root */
--glass-bg: rgba(255, 226, 219, 0.70);
--glass-border: rgba(230, 190, 179, 0.20);

/* In .dark */
--glass-bg: rgba(56, 38, 33, 0.70);
--glass-border: rgba(92, 64, 56, 0.20);

/* Single utility */
@utility glass {
  background-color: var(--glass-bg);
  backdrop-filter: blur(32px);
  border: 0.5px solid var(--glass-border);
}

@utility glass-card {
  background-color: var(--glass-bg);
  border: 0.5px solid var(--glass-border);
  /* NO backdrop-filter — blur budget enforced */
}
```

### Pattern 3: Gradient Utilities with Token References
**What:** `.hero-gradient` and `.cta-gradient` must use `var(--*)` so they adapt to palette changes (D-05/D-18/D-19).
```css
@utility hero-gradient {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--primary-container) 15%, transparent) 0%,
    transparent 60%
  );
}

@utility cta-gradient {
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--inverse-primary) 100%);
}
```
Note: For `.hero-gradient`, `color-mix` with transparency achieves the 15% opacity effect without hardcoding rgba. In dark mode the primary-container is `#ff5626`; in light mode it is `#d93900` — the gradient auto-adapts.

### Pattern 4: Shadcn → M3 Token Mapping for Radix Components
**What:** Radix UI components (Button, Sheet, DropdownMenu) use shadcn class names. These must be replaced with M3 equivalents without any visual regression.

**Complete mapping (Claude's discretion items resolved below):**

| Shadcn Class | M3 Replacement | Rationale |
|---|---|---|
| `bg-primary` | `bg-primary-container` | D-10: high-saturation orange CTA |
| `text-primary-foreground` | `text-on-primary-container` | Contrast pair for primary-container |
| `bg-secondary` | `bg-surface-container-high` | Tonal surface for secondary elements |
| `text-secondary-foreground` | `text-on-surface` | Standard text on surface |
| `bg-muted` | `bg-surface-container` | Muted = baseline container level |
| `text-muted-foreground` | `text-on-surface-variant` | Subdued text on surfaces |
| `bg-accent` | `bg-surface-container-high` | Accent state = elevated container |
| `text-accent-foreground` | `text-on-surface` | Text on accent surface |
| `bg-popover` | `bg-surface-container-highest` | Popover = topmost floating surface |
| `text-popover-foreground` | `text-on-surface` | Text on popover surface |
| `bg-card` | `bg-surface-container` | Card = container level |
| `text-card-foreground` | `text-on-surface` | Text on card surface |
| `bg-background` | `bg-surface` | Page base background |
| `text-foreground` | `text-on-surface` | Body text |
| `border-border` / `border` (bare) | `border-outline-variant` | Ghost border per DESIGN.md |
| `bg-input` | `bg-surface-container-lowest` | Input field background per DESIGN.md |
| `ring-ring` | `ring-outline` | Focus ring — use full outline color |
| `ring-offset-background` | `ring-offset-surface` | Offset matches page surface |
| `bg-destructive` | `bg-error-container` | M3 error family |
| `text-destructive-foreground` | `text-on-error-container` | M3 error contrast pair |
| `bg-primary`/CTA (Button default) | `bg-primary-container` | D-10 confirmed |
| `data-[state=open]:bg-secondary` | `data-[state=open]:bg-surface-container-high` | Sheet close button hover state |

**Token names NO LONGER needed (remove from globals.css entirely per D-08/D-11/D-12):**
- `--background`, `--foreground` (replaced by `--surface` / `--on-surface`)
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground` (shadcn versions — M3 `--primary` is a different value, stays)
- `--secondary`, `--secondary-foreground` (shadcn versions)
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--chart-1` through `--chart-5`
- `--brand-orange`, `--brand-green`, `--brand-gold`

**Important:** M3 has its own `--primary`, `--secondary`, `--tertiary` tokens — these are DIFFERENT from shadcn's `--primary`. After replacement, `--primary` in globals.css will mean the M3 primary (soft peach in dark mode), not shadcn's navy. The Button component's `bg-primary` class will switch to `bg-primary-container` (the high-saturation orange).

### Anti-Patterns to Avoid
- **Hardcoding hex in component classes:** `bg-[#ff5626]` in Header or other components must become `bg-primary-container`. Phase 8 handles Radix UI components; brand-orange usages elsewhere are also in scope (D-12).
- **Aliasing shadcn names through M3:** Do not do `--primary: var(--primary-container)`. Per D-08, remove shadcn names entirely — update the component class names directly.
- **Adding blur to .glass-card:** The DESIGN.md blur budget is `backdrop-blur` for Header/Sheet/Dropdown only. Cards must use tonal shifts.
- **Using rgba with hardcoded hex in utilities:** `.hero-gradient` and `.cta-gradient` must use `var(--primary-container)` not `rgba(255,86,38,0.15)` — otherwise palette swap breaks.
- **Forgetting `* { border-color }` update:** The current `* { border-color: var(--border); }` reset line 112 must update to `var(--outline-variant)` before `--border` is removed.

---

## Complete Token Reference

### Dark Mode Tokens (from `docs/UI-template.html`)
```
--surface-dim: #1f0f0b
--surface: #1f0f0b
--surface-container-lowest: #190a07
--surface-container-low: #281713
--surface-container: #2d1b17
--surface-container-high: #382621
--surface-container-highest: #44302b
--surface-bright: #49342f
--surface-variant: #44302b
--on-surface: #fcdcd3
--on-surface-variant: #e6beb3
--primary: #ffb5a1
--primary-container: #ff5626
--on-primary: #601400
--on-primary-container: #541000
--primary-fixed: #ffdbd1
--primary-fixed-dim: #ffb5a1
--on-primary-fixed: #3b0900
--on-primary-fixed-variant: #882000
--secondary: #ffb5a1
--secondary-container: #842407
--on-secondary: #601400
--on-secondary-container: #ff9b7f
--secondary-fixed: #ffdbd1
--secondary-fixed-dim: #ffb5a1
--on-secondary-fixed: #3b0900
--on-secondary-fixed-variant: #842407
--tertiary: #a0c9ff
--tertiary-container: #1394f7
--on-tertiary: #003259
--on-tertiary-container: #002b4e
--tertiary-fixed: #d2e4ff
--tertiary-fixed-dim: #a0c9ff
--on-tertiary-fixed: #001c37
--on-tertiary-fixed-variant: #00497f
--error: #ffb4ab
--error-container: #93000a
--on-error: #690005
--on-error-container: #ffdad6
--outline: #ad897f
--outline-variant: #5c4038
--inverse-surface: #fcdcd3
--inverse-on-surface: #3f2c27
--inverse-primary: #b12d00
--surface-tint: #ffb5a1
--background: #1f0f0b
--on-background: #fcdcd3
```

### Light Mode Tokens (from `docs/UI-light-template.html`)
```
--surface-dim: #f3d3cb
--surface: #fff8f6
--surface-container-lowest: #ffffff
--surface-container-low: #fff1ed
--surface-container: #ffe9e4
--surface-container-high: #ffe2db
--surface-container-highest: #fcdcd3
--surface-bright: #fff8f6
--surface-variant: #fcdcd3
--on-surface: #281713
--on-surface-variant: #5c4038
--primary: #ad2b00
--primary-container: #d93900
--on-primary: #ffffff
--on-primary-container: #fffbff
--primary-fixed: #ffdbd1
--primary-fixed-dim: #ffb5a1
--on-primary-fixed: #3b0900
--on-primary-fixed-variant: #882000
--secondary: #a53c1e
--secondary-container: #fe7d5a
--on-secondary: #ffffff
--on-secondary-container: #701900
--secondary-fixed: #ffdbd1
--secondary-fixed-dim: #ffb5a1
--on-secondary-fixed: #3b0900
--on-secondary-fixed-variant: #842407
--tertiary: #005ea2
--tertiary-container: #0077cb
--on-tertiary: #ffffff
--on-tertiary-container: #fdfcff
--tertiary-fixed: #d2e4ff
--tertiary-fixed-dim: #a0c9ff
--on-tertiary-fixed: #001c37
--on-tertiary-fixed-variant: #00497f
--error: #ba1a1a
--error-container: #ffdad6
--on-error: #ffffff
--on-error-container: #93000a
--outline: #916f66
--outline-variant: #e6beb3
--inverse-surface: #3f2c27
--inverse-on-surface: #ffede9
--inverse-primary: #ffb5a1
--surface-tint: #b12d00
--background: #fff8f6
--on-background: #281713
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Opacity modifiers on token colors | Custom rgba calculations | Tailwind `/opacity` syntax (`bg-surface-container/70`) | Works with CSS vars via color-mix internals in TW v4 |
| Mode-adaptive utility values | Duplicate `@utility` blocks with dark: prefix | CSS custom properties in `:root`/`.dark` that `@utility` references | Variables resolve at runtime; single utility definition works for both modes |
| Template's glass-card blur | Copying `backdrop-filter: blur(24px)` from template | No blur on `.glass-card` — DESIGN.md blur budget overrides template | Template is a visual reference, not implementation spec |

**Key insight:** The templates use hardcoded hex in their glass-card definition (`rgba(56,38,33,0.6)`). Do NOT copy-paste this into the implementation. All values must go through token variables. The templates demonstrate the visual intent, not the implementation pattern.

---

## Common Pitfalls

### Pitfall 1: Template Values Are Not Implementation Code
**What goes wrong:** Implementer copies `.glass-card { background: rgba(56, 38, 33, 0.6); backdrop-filter: blur(24px); }` directly from the template HTML.
**Why it happens:** The template looks like CSS and it is tempting to copy it verbatim.
**How to avoid:** Every hex or rgba in a template must be traced to a named token. The template's `rgba(56,38,33,0.6)` = `surface-container-high` at 70% opacity = `bg-surface-container-high/70` in implementation. Additionally, `glass-card` must NOT include `backdrop-filter` per DESIGN.md blur budget.
**Warning signs:** Any hardcoded hex or rgba in `@utility` definitions.

### Pitfall 2: `.glass-card` Gets Blur — Violating the Blur Budget
**What goes wrong:** Both templates define `.glass-card` with `backdrop-filter: blur(24px)`. Implementer adds blur to `.glass-card`.
**Why it happens:** The template spec and DESIGN.md spec conflict. The template is a visual prototype, DESIGN.md is the authoritative implementation spec.
**How to avoid:** DESIGN.md section 4: "All floating overlays" get `backdrop-blur: 32px` — but cards are not floating overlays. Section 5 cards: "no dividers", tonal shifts. The context decision D-15 explicitly locks this: `.glass-card` = tonal treatment, NO blur.
**Warning signs:** `backdrop-filter` appearing in the `glass-card` utility.

### Pitfall 3: Forgetting `* { border-color }` Update Breaks Build
**What goes wrong:** `--border` token is removed from globals.css but `* { border-color: var(--border); }` still references it. Default borders across the site become `transparent` or inherit browser default.
**Why it happens:** The border reset is 3 lines away from the utility block; easy to miss when removing tokens.
**How to avoid:** Plan explicitly: update `* { border-color: var(--outline-variant); }` BEFORE removing `--border`.
**Warning signs:** All borders disappearing in the build preview.

### Pitfall 4: `bg-background` in Layout.astro Not Updated
**What goes wrong:** `Layout.astro` line 123 uses `bg-background` on `<body>`. After shadcn tokens are removed, `--background` is gone, so `bg-background` produces no background-color.
**Why it happens:** `Layout.astro` is not a Radix UI component and might be missed when scanning "Radix components to update."
**How to avoid:** The file list is: `button.tsx`, `sheet.tsx`, `dropdown-menu.tsx`, `Layout.astro`, `ReviewsSection.astro` (uses `text-foreground`, `text-muted-foreground`). All must be updated.
**Warning signs:** Page body background disappearing in light mode preview.

### Pitfall 5: brand-orange Usages Not Fully Replaced
**What goes wrong:** `--brand-orange` is removed from globals.css but components still reference `text-brand-orange`, `bg-brand-orange`, `hover:bg-brand-orange`. Those classes no longer resolve.
**Why it happens:** `brand-orange` is used in 9 separate files across 30+ class occurrences. It is easy to miss some.
**How to avoid:** Before removing `--brand-orange`, run `grep -r "brand-orange" src/` to get the full list. Replace with `text-primary-container` (for text) and `bg-primary-container` (for backgrounds). Files with usages: `faq.astro`, `directions.astro`, `near-grand-canyon.astro`, `MobileActionButtons.astro`, `ReviewsSection.astro`, `Hero.astro`, `Header.tsx`, `MenuSection.tsx`.
**Warning signs:** Console errors about missing Tailwind utilities or visible orange fallback loss.

### Pitfall 6: Opacity Modifier Syntax on CSS Var Colors
**What goes wrong:** `bg-surface-container/70` fails because Tailwind v4 handles opacity on CSS variables differently than static colors.
**Why it happens:** Tailwind v4 uses `color-mix` internally for opacity modifiers on CSS variables registered via `@theme inline`. This works for colors registered as full values, but requires the `@theme inline` mapping to be in place.
**How to avoid:** Ensure all tokens are wired through `@theme inline` before using opacity modifiers. Use `color-mix(in srgb, var(--surface-container-high) 70%, transparent)` in `@utility` blocks where Tailwind opacity modifiers won't work (raw CSS context), and use the utility class syntax elsewhere.
**Warning signs:** Unexpected transparent backgrounds where opacity was intended.

### Pitfall 7: M3 `--primary` vs Shadcn `--primary` Token Name Collision
**What goes wrong:** Implementer keeps shadcn's `--primary` value while also defining M3's `--primary`. M3's primary (dark: soft peach `#ffb5a1`, light: deep red `#ad2b00`) is very different from shadcn's primary (navy `hsl(222.2 47.4% 11.2%)`).
**Why it happens:** The variable name is the same but the semantic is different.
**How to avoid:** Per D-08, remove ALL shadcn variable names and replace with M3 names. The final globals.css has only M3 tokens. Any component using `bg-primary` must be updated to the appropriate M3 class — for the CTA button, this is `bg-primary-container` (per D-10), not `bg-primary`.
**Warning signs:** Button appearing soft-peach instead of orange, or dark navy.

---

## Code Examples

### Verified Pattern: @theme inline with CSS Var Tokens (from existing globals.css Phase 7 output)
```css
/* Layer 1 — raw values in :root / .dark */
:root {
  --surface-container: #ffe9e4;
  --primary-container: #d93900;
}
.dark {
  --surface-container: #2d1b17;
  --primary-container: #ff5626;
}

/* Layer 2 — Tailwind registration */
@theme inline {
  --color-surface-container: var(--surface-container);
  --color-primary-container: var(--primary-container);
}
```
Source: `src/styles/globals.css` (Phase 7 output), lines 70-104 (pattern confirmed working)

### Verified Pattern: @utility directive (from existing globals.css)
```css
@utility glass {
  background-color: var(--glass-bg);
  backdrop-filter: blur(32px);
  border: 0.5px solid var(--glass-border);
}

@utility glass-card {
  background-color: var(--glass-bg);
  border: 0.5px solid var(--glass-border);
  /* NO backdrop-filter intentionally */
}
```
Source: `src/styles/globals.css` lines 121-133 (syntax confirmed working from Phase 7)

### Verified Pattern: Button component token update (representative example)
```tsx
// BEFORE (shadcn):
'bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900'
// This was already using neutral hardcodes, not shadcn vars

// Button default variant — AFTER (M3):
'bg-primary-container text-on-primary-container shadow hover:bg-primary-container/90'

// Button destructive variant — AFTER (M3):
'bg-error-container text-on-error-container shadow-xs hover:bg-error-container/90'

// Button outline variant — AFTER (M3):
'border border-outline-variant bg-surface shadow-xs hover:bg-surface-container hover:text-on-surface'

// Button secondary variant — AFTER (M3):
'bg-surface-container-high text-on-surface shadow-xs hover:bg-surface-container-high/80'

// Button ghost variant — AFTER (M3):
'hover:bg-surface-container hover:text-on-surface'

// Button link variant — AFTER (M3):
'text-primary-container underline-offset-4 hover:underline'
```
Note: `button.tsx` currently uses hardcoded neutral classes, not shadcn vars. The update to M3 is still required — it currently has no relationship to the token system at all.

### Verified Pattern: Sheet token update
```tsx
// SheetContent bg — BEFORE:
'bg-background'
// AFTER:
'bg-surface-container-highest glass'  // or just bg-surface-container-highest if no blur desired

// SheetTitle — BEFORE:
'text-foreground'
// AFTER:
'text-on-surface'

// SheetDescription — BEFORE:
'text-muted-foreground'
// AFTER:
'text-on-surface-variant'

// SheetClose — BEFORE:
'ring-offset-background ... data-[state=open]:bg-secondary'
// AFTER:
'ring-offset-surface ... data-[state=open]:bg-surface-container-high'

// SheetOverlay — stays as:
'bg-black/80'  // Black overlay for modal backdrop is intentional, not a token issue
```

### Verified Pattern: DropdownMenu token update
```tsx
// DropdownMenuContent and SubContent — BEFORE:
'bg-popover text-popover-foreground border'
// AFTER:
'bg-surface-container-highest text-on-surface border-outline-variant'

// DropdownMenuItem hover — BEFORE:
'focus:bg-accent focus:text-accent-foreground'
// AFTER:
'focus:bg-surface-container-high focus:text-on-surface'

// DropdownMenuSeparator — BEFORE:
'bg-muted'
// AFTER:
'bg-outline-variant'
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Shadcn token names (bg-primary, bg-muted) | M3 semantic token names (bg-primary-container, bg-surface-container) | Phase 8 | Component class names must change |
| HSL full values (`hsl(14 100% 53.5%)`) | Hex values (`#ff5626`) | Phase 8 (D-22) | Cleaner authoring, same runtime behavior in TW v4 |
| Brand tokens (--brand-orange) | M3 primary-container family | Phase 8 | 30+ usage sites across 8 files |
| Neutral gray glassmorphism | Warm-tinted glassmorphism via token vars | Phase 8 | .glass and .glass-card complete rewrite |
| No gradient utilities | .hero-gradient and .cta-gradient as token-based utilities | Phase 8 | New additions to globals.css |

**Removed in this phase:**
- `--chart-1` through `--chart-5`: No charts on site
- `--brand-orange`, `--brand-green`, `--brand-gold`: Replaced by M3 primary family
- All shadcn semantic vars (`--background`, `--foreground`, `--card`, `--popover`, `--muted`, `--accent`, `--border`, `--input`, `--ring`, `--destructive`)
- Corresponding `--color-*` entries in `@theme inline`

---

## Open Questions

1. **Light mode `.glass` tint opacity**
   - What we know: D-16 says light mode uses "warm cream/white tint." D-14 specifies 70% opacity for dark mode.
   - What's unclear: The exact opacity for light mode. The CONTEXT.md says "Claude's discretion."
   - Recommendation: Use the same 70% opacity for light mode glass-bg (`rgba(255,226,219,0.70)`) — surface-container-high at 70% in light mode produces a warm translucent cream. This maintains visual consistency between modes.

2. **`--background`/`--on-background` vs `--surface`/`--on-surface`**
   - What we know: The M3 templates define both `--background` and `--surface` with the same hex values (dark: both `#1f0f0b`, light: both `#fff8f6`).
   - What's unclear: Should both be defined in globals.css, or just use `--surface` everywhere?
   - Recommendation: Define both (they're identical in value for this palette) to preserve M3 completeness per D-03. The `body` background can use `var(--background)` and components use `var(--surface)`.

3. **Button.tsx current state: hardcoded neutrals, not shadcn vars**
   - What we know: `button.tsx` currently uses `bg-neutral-900` etc. (hardcoded neutrals), NOT shadcn token names. This was likely from a shadcn upgrade that happened before Phase 7.
   - What's unclear: Whether this was intentional or an oversight.
   - Recommendation: Treat it as needing the same M3 update. The default button must use `bg-primary-container text-on-primary-container` per D-10 for the CTA look. Other variants mapped per the table above.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 8 is purely CSS/token changes with no external tool dependencies. The build runs on Node.js + npm which are confirmed present from Phase 7.

---

## Validation Architecture

> `workflow.nyquist_validation` is not present in `.planning/config.json` — treating as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Lighthouse CI (`npm run test:lhci`) + manual visual check |
| Config file | `.lighthouserc.cjs` (from Phase 7) |
| Quick run command | `npm run build && npm run preview` (visual check) |
| Full suite command | `npm run qa` (build + lint + typecheck + lhci) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TOKEN-01 | `bg-surface-dim`, `bg-surface-container`, etc. produce visually distinct warm dark tones | manual-visual | `npm run build && npm run preview` | N/A |
| TOKEN-02 | Same utilities produce warm cream tones in light mode | manual-visual | `npm run build && npm run preview` | N/A |
| TOKEN-03 | Button/Sheet/DropdownMenu render without class errors in both modes | build+visual | `npm run build` (no missing class errors) | N/A |
| TOKEN-04 | Headings with `font-display` show Manrope; `font-sans` shows Inter | manual-visual | `npm run build && npm run preview` | N/A |
| TOKEN-05 | Build completes without CSS parse errors; no `hsl()` wrappers around tokens | automated | `npm run build` (build success = passing) | N/A |

**Note:** TOKEN-01 through TOKEN-04 are visual acceptance criteria. The success criteria from the phase spec require human visual verification: "visually distinct warm tones," "renders correctly," "shows Manrope." These cannot be automated at the class-level with Lighthouse alone.

**The automated gate is:** `npm run qa` must pass (no build errors, no lint errors, no typecheck errors, Lighthouse thresholds maintained). Visual correctness is a manual check.

### Sampling Rate
- **Per task commit:** `npm run build` (confirm no CSS/TypeScript errors)
- **Per wave merge:** `npm run qa` (full quality gate)
- **Phase gate:** `npm run qa` green + manual visual check of both light and dark mode before `/gsd:verify-work`

### Wave 0 Gaps
None — no new test files required. The existing `npm run qa` pipeline covers all automatable aspects. Visual correctness is human-verified.

---

## Project Constraints (from CLAUDE.md)

- **Framework:** Astro 5 static site — no SSR
- **CSS:** TailwindCSS v4 via `@tailwindcss/vite` (no `tailwind.config.mjs`)
- **CSS Config pattern:** `@import "tailwindcss"` + `@theme` directive
- **Dark mode:** `.dark` class on `<html>`, implemented via `@custom-variant dark (&:where(.dark, .dark *))`
- **Commit format:** Conventional commits enforced (`feat:`, `fix:`, `chore:`, etc.)
- **Pre-push hook:** `npm run qa` runs full build + quality checks — never skip with `--no-verify`
- **Lighthouse thresholds:** LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility >= 90, Best Practices >= 80, SEO >= 90
- **Analytics:** Google Analytics via GTM + Partytown — do not touch `astro.config.mjs` Partytown config
- **Fonts:** Self-hosted via `@fontsource-variable/*` packages
- **Component split:** `.astro` for static sections, `.tsx` for interactive (React hydrated with `client:visible`/`client:load`)
- **Import alias:** `@/*` resolves to `src/*`

---

## Sources

### Primary (HIGH confidence)
- `docs/UI-template.html` — Complete dark mode M3 hex palette, glass/gradient utility definitions, component usage patterns
- `docs/UI-light-template.html` — Complete light mode M3 hex palette
- `docs/DESIGN.md` — Authoritative design system spec: blur budget, no-line rule, shadow tinting, surface hierarchy philosophy
- `src/styles/globals.css` — Current Phase 7 output: `@theme inline` pattern, `@utility` directive syntax, `@custom-variant dark` syntax — all confirmed working
- `src/components/ui/button.tsx`, `sheet.tsx`, `dropdown-menu.tsx` — Current shadcn class names to be replaced (directly verified)
- `.planning/phases/08-token-system/08-CONTEXT.md` — All locked decisions (D-01 through D-25)

### Secondary (MEDIUM confidence)
- Grep results across `src/` — `brand-orange`/`brand-green`/`brand-gold` usage count and file list (30+ occurrences in 8 files) — verified by direct code scan

### Tertiary (LOW confidence)
None — all findings are from primary source code in this repository.

---

## Metadata

**Confidence breakdown:**
- Token values (dark + light): HIGH — extracted directly from authoritative template files
- Architecture pattern: HIGH — `@theme inline` + `@utility` confirmed working from Phase 7 globals.css
- Shadcn-to-M3 mapping: HIGH for locked decisions (D-08 through D-12), MEDIUM for Claude's discretion items (resolved with documented rationale)
- Brand-orange usage scope: HIGH — verified by direct grep
- Pitfalls: HIGH — all identified from direct code inspection, not assumptions

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable domain — CSS token architecture, no external API dependencies)
