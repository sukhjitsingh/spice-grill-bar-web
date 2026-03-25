# Phase 7: Infrastructure - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the site from TailwindCSS v3 to v4, swap animation and font packages, and verify the build is green with no Lighthouse regressions — so visual redesign work (Phases 8-10) can begin on a stable foundation.

Requirements: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06

</domain>

<decisions>
## Implementation Decisions

### Font Installation
- **D-01:** Install `@fontsource-variable/manrope` and `@fontsource-variable/inter` — matches existing @fontsource pattern, self-hosted variable fonts for best CLS performance
- **D-02:** Keep old font packages (`@fontsource/open-sans`, `@fontsource/playfair-display`) temporarily alongside new ones — remove in Phase 9 when components are reskinned
- **D-03:** Register new fonts in `@theme` (`--font-sans: "Inter"`, `--font-display: "Manrope"`) but keep existing font-family references (`font-sans: "Open Sans"`) working until Phase 9

### Migration Strategy
- **D-04:** Run `@tailwindcss/upgrade` CLI first as a 70% solution, then manually fix Astro-specific issues (wrong config placement, `@custom-variant` syntax)
- **D-05:** Add `@tailwindcss/vite` plugin inline in `astro.config.mjs` under `vite.plugins[]` — no separate `vite.config.ts` file
- **D-06:** Remove `@astrojs/tailwind` integration from `astro.config.mjs`
- **D-07:** Migrate CSS tokens in-place to full HSL values and remove shadcn references to become purely CSS-first Tailwind — while keeping the Radix UI components (Button, Sheet, DropdownMenu) functional
- **D-08:** Run full QA suite (`npm run qa`) as the verification step after migration — no shortcuts on quality gates

### Glass Utility Handling
- **D-09:** Convert `.glass` and `.glass-card` from `@layer utilities` with `@apply` to `@utility` directive syntax — just make them compile in v4, keep current neutral gray look
- **D-10:** Visual redesign of glass utilities (warm-tinted blur per DESIGN.md) deferred to Phase 9

### CSS Variable Format
- **D-11:** Convert all CSS variables from bare HSL triples (`--primary: 222.2 47.4% 11.2%`) to full HSL values (`--primary: hsl(222.2 47.4% 11.2%)`)
- **D-12:** Components reference tokens via `var(--primary)` directly instead of `hsl(var(--primary))` wrapper
- **D-13:** Keep existing class names (bg-primary, text-muted-foreground, etc.) working via `@theme` registration — token rename to DESIGN.md surface hierarchy happens in Phase 8

### Claude's Discretion
- Specific order of migration sub-steps (which files to convert first)
- How to handle any edge cases the upgrade CLI produces
- Whether to commit incrementally or in one migration commit

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design Specification
- `docs/DESIGN.md` — The Radiant Sommelier design system spec; defines surface hierarchy, typography, glassmorphism rules, and color palette that Phase 7 must support

### Current Configuration (to be migrated)
- `astro.config.mjs` — Current Astro config with `@astrojs/tailwind` integration to be replaced
- `tailwind.config.mjs` — Current Tailwind v3 JS config to be deleted after migration to CSS-first `@theme`
- `src/styles/globals.css` — Current CSS with `@tailwind` directives, shadcn HSL variables, and glass utilities to be converted
- `postcss.config.cjs` — PostCSS config with autoprefixer to be removed (INFRA-05)

### Requirements
- `.planning/REQUIREMENTS.md` §Infrastructure — INFRA-01 through INFRA-06 acceptance criteria

### Codebase Context
- `.planning/codebase/STACK.md` — Full dependency list and current versions
- `.planning/codebase/CONVENTIONS.md` — Coding patterns and import conventions
- `.planning/codebase/CONCERNS.md` — Known issues and fragile areas

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/utils.ts` — `cn()` function (clsx + tailwind-merge) — will continue to work in v4
- Radix UI components (Sheet, DropdownMenu, Button) — keep functional, just update CSS token format
- `src/components/mode-toggle.tsx` — Dark mode toggle; must work with new `@custom-variant` syntax

### Established Patterns
- shadcn CSS variable pattern in `globals.css` — all tokens as HSL triples with `hsl()` wrapper in config; converting to full values
- `@fontsource/*` packages imported in Layout — same pattern for new variable fonts
- `tailwindcss-animate` plugin in config — replacing with `tw-animate-css` import
- `@layer utilities` for custom classes — converting to `@utility` directive

### Integration Points
- `astro.config.mjs` — Remove `@astrojs/tailwind`, add `@tailwindcss/vite` to `vite.plugins[]`
- `src/styles/globals.css` — Primary migration target: directives, variables, utilities
- `src/layouts/Layout.astro` — Font imports and theme script
- All components using `dark:` prefix classes — must work with new `@custom-variant` syntax
- Components using `tailwindcss-animate` classes: Sheet, DropdownMenu, MobileActionButtons

</code_context>

<specifics>
## Specific Ideas

- User wants to move away from shadcn token naming convention toward purely CSS-first Tailwind — shadcn references removed during token migration, Radix components stay
- Old fonts kept alongside new ones as a safety net — clean removal in Phase 9
- Glass utilities are a "just make it work" concern in this phase, not a visual redesign target

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-infrastructure*
*Context gathered: 2026-03-24*
