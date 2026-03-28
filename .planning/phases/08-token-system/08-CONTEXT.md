# Phase 8: Token System - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Define every color, surface, and semantic token in the design system as CSS custom properties in `globals.css`, with both light and dark mode values, plus token-based utility classes (.glass, .glass-card, .hero-gradient, .cta-gradient). Update Radix component references from shadcn naming to M3 naming. After this phase, any component can reference `bg-surface-container` or `text-on-primary-container` without knowing raw color values, and changing the primary seed color cascades through both modes automatically.

Requirements: TOKEN-01, TOKEN-02, TOKEN-03, TOKEN-04, TOKEN-05

</domain>

<decisions>
## Implementation Decisions

### Token Source of Truth
- **D-01:** Use the M3 palettes from `docs/UI-template.html` (dark) and `docs/UI-light-template.html` (light) as the authoritative token source — these are Material Design 3 palettes generated from the `#FF4B12` seed color
- **D-02:** Implement the full M3 surface depth (lowest, dim, low, container, high, highest, bright, variant) — not limited to DESIGN.md's original 5 levels
- **D-03:** Implement the full M3 semantic set: primary, secondary, tertiary, error, surface, outline, and inverse families with all `on-*` contrast pairs

### Dynamic Architecture
- **D-04:** All colors must be CSS custom properties in `globals.css` (`:root` for light, `.dark` for dark) — zero hardcoded hex values in component classes
- **D-05:** All utilities (.glass, .glass-card, .hero-gradient, .cta-gradient) must reference `var(--*)` tokens so they adapt when the palette changes
- **D-06:** Palette swap = update `globals.css` only — regenerate from a new seed, paste new values, everything cascades
- **D-07:** Light mode is the default (`:root`). Dark mode activates via `.dark` class — matches current site behavior

### Shadcn Token Removal
- **D-08:** Remove shadcn token names entirely — replace with M3 token names directly (no aliasing)
- **D-09:** Update all Radix component (Button, Sheet, DropdownMenu) class references to use M3 token names — token swap only, no visual reskin in this phase
- **D-10:** Button mapping: shadcn `bg-primary` → M3 `bg-primary-container` (high-saturation orange CTA)
- **D-11:** Drop chart-1 through chart-5 tokens (no charts on site)
- **D-12:** Remove old brand tokens (`--brand-orange`, `--brand-green`, `--brand-gold`) — M3 primary-container replaces brand orange; grep for usage and replace

### Glass & Blur Utilities
- **D-13:** Update `.glass` and `.glass-card` in Phase 8 — overrides Phase 7 D-10 deferral to satisfy Phase 8 success criteria #4
- **D-14:** `.glass` = full glassmorphism: `backdrop-blur: 32px`, surface-container-high at 70% opacity, 0.5px inner glow stroke using outline-variant at 20% — reserved for Header, Sheet, DropdownMenu ONLY
- **D-15:** `.glass-card` = tonal surface treatment with NO backdrop-blur per DESIGN.md blur budget — cards use surface background shifts (surface-container/surface-container-high), ghost border (outline-variant at 15%), tinted shadow
- **D-16:** `.glass` is mode-adaptive via CSS custom variables (`--glass-bg`, `--glass-border`) — dark mode uses warm brown tint, light mode uses warm cream/white tint. Single utility definition, auto-adapts per mode

### Shadows
- **D-17:** Define `--shadow-color` token: dark mode `rgba(25,10,7,0.4)`, light mode `rgba(243,211,203,0.3)` — all shadows tinted, never neutral gray per DESIGN.md

### Gradient Utilities
- **D-18:** Define `.hero-gradient` using M3 tokens: 135deg from primary-container at 15% opacity (dark) / 10% opacity (light) → transparent
- **D-19:** Define `.cta-gradient` using M3 tokens: 135deg from primary-container → inverse-primary — auto-adapts per mode

### Token Naming
- **D-20:** Kebab-case matching Tailwind utility classes: `--surface-container-low`, `--on-primary-container`, `--outline-variant`
- **D-21:** Flat namespace for all tokens including `on-*` contrast pairs — no grouping or nesting

### CSS Format & Theme Pattern
- **D-22:** Use hex color values from templates directly (not HSL) — `--surface-container: #2d1b17` not `hsl(13 36% 13%)`. Tailwind v4 handles hex natively; HSL was a shadcn convention no longer needed
- **D-23:** Continue `@theme inline` pattern from Phase 7 — tokens defined as CSS vars in `:root`/`.dark`, wired into Tailwind via `@theme inline { --color-surface-container: var(--surface-container); }`. Enables dynamic mode switching via CSS vars
- **D-24:** The two-layer architecture: (1) `:root`/`.dark` blocks hold raw token values (hex), (2) `@theme inline` block maps each token to Tailwind's `--color-*` namespace so utility classes like `bg-surface-container` resolve correctly

### Typography
- **D-25:** Font families only in Phase 8 per TOKEN-04: `--font-sans: "Inter"`, `--font-display: "Manrope"` — typography scale (display-lg, body-md, label-sm sizes/line-heights/letter-spacing) deferred to Phase 9

### Claude's Discretion
- Remaining shadcn → M3 mappings for card, muted, accent, border, input, ring, popover, destructive (Claude picks best M3 equivalent based on template usage patterns)
- Specific opacity values for light mode glass tint
- Order of implementation within the phase

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Templates (Token Source of Truth)
- `docs/UI-template.html` — Dark mode M3 palette with all color tokens, glass-card/hero-gradient/cta-gradient utility definitions, and component usage examples
- `docs/UI-light-template.html` — Light mode M3 palette with all color tokens and component usage examples
- `docs/DESIGN.md` — The Radiant Sommelier design system spec: surface hierarchy philosophy, no-line rule, blur budget (Header/Sheet/Dropdown only), tinted shadow mandate, typography principles

### Current Implementation (To Be Migrated)
- `src/styles/globals.css` — Current shadcn CSS variables, brand tokens, and glass utilities to be replaced with M3 tokens
- `src/components/ui/button.tsx` — Radix Button using shadcn token classes (bg-primary etc.) to be remapped
- `src/components/ui/sheet.tsx` — Radix Sheet using shadcn tokens + glass utility
- `src/components/ui/dropdown-menu.tsx` — Radix DropdownMenu using shadcn tokens

### Requirements
- `.planning/REQUIREMENTS.md` §Token System — TOKEN-01 through TOKEN-05 acceptance criteria

### Prior Phase Context
- `.planning/phases/07-infrastructure/07-CONTEXT.md` — Phase 7 decisions on CSS variable format (full HSL values), @theme registration, font installation, @utility directive syntax

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/utils.ts` — `cn()` function (clsx + tailwind-merge) — continues to work with M3 token names
- `src/components/mode-toggle.tsx` — Dark mode toggle; already works with `.dark` class pattern
- Phase 7 delivered: TailwindCSS v4 with `@tailwindcss/vite`, `@utility` directive syntax, full HSL CSS variables, `@custom-variant dark` syntax

### Established Patterns (Verified from Phase 7 output)
- `globals.css` line 1: `@import "tailwindcss"` + `@import "tw-animate-css"` — Phase 8 registers all M3 tokens in existing `@theme inline` block
- `globals.css` lines 70-104: `@theme inline` block already wiring CSS vars to `--color-*` namespace — Phase 8 replaces shadcn entries with M3 entries
- CSS variables currently use full HSL values — Phase 8 converts to hex per D-22
- Custom utilities already use `@utility` directive (glass, glass-card at lines 121-133) — Phase 8 rewrites their contents
- `* { border-color: var(--border); }` at line 113 — must update to M3 token (e.g., `var(--outline-variant)`)

### Integration Points
- `src/styles/globals.css` — Primary migration target: replace all shadcn/brand variables with M3 tokens, update utility definitions
- `src/components/ui/*.tsx` — All Radix components need class reference updates from shadcn to M3 naming
- `src/layouts/Layout.astro` — Font imports (Manrope + Inter already installed in Phase 7)
- All components using `dark:` prefix — should work unchanged since token values swap via CSS variables

</code_context>

<specifics>
## Specific Ideas

- Templates are a visual reference, not copy-paste code — hardcoded hex values like `bg-[#1f0f0b]/70` in templates must become token references like `bg-surface-dim/70` in implementation
- The system must be "palette-swappable" — changing the seed color and regenerating M3 values should only require updating globals.css
- DESIGN.md's blur budget is authoritative over templates — templates show glass-card with blur on cards, but implementation must NOT add blur to cards (tonal shifts only)
- Phase 7 is completed — the TailwindCSS v4 foundation is in place and ready for token work

</specifics>

<deferred>
## Deferred Ideas

- Typography scale classes (display-lg, body-md, label-sm with sizes/line-heights/letter-spacing) — Phase 9
- Visual reskin of Radix components (layout, spacing, animations) — Phase 9
- Component-level design polish — Phase 9

</deferred>

---

*Phase: 08-token-system*
*Context gathered: 2026-03-25*
