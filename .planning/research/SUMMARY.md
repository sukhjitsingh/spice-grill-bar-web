# Project Research Summary

**Project:** Spice Grill & Bar — v2.0 UI Facelift ("The Radiant Sommelier")
**Domain:** CSS framework migration + full visual design system overhaul on existing Astro 5 restaurant site
**Researched:** 2026-03-24
**Confidence:** HIGH

## Executive Summary

The Radiant Sommelier facelift is a tightly scoped visual redesign of an existing, working Astro 5 site. The entire effort is gated behind a single prerequisite: migrating TailwindCSS from v3 to v4. This migration is non-trivial — it requires swapping the Astro integration (`@astrojs/tailwind` out, `@tailwindcss/vite` in), deleting `tailwind.config.mjs` entirely, rewriting `globals.css` to use v4's CSS-first `@theme` directive, replacing the animation plugin (`tailwindcss-animate` out, `tw-animate-css` in), and handling 6+ documented breaking changes. Nothing in the visual redesign can begin until the build is green on v4 and dark mode is verified working.

Once the migration foundation is established, the redesign follows a clear dependency chain: surface hierarchy color tokens must be defined before any component re-skin can occur, and the shadcn semantic token layer (`--background`, `--card`, `--popover`, etc.) must be remapped to those surface values without breaking the existing Radix UI components (Sheet, DropdownMenu, Button). The visual changes themselves — glassmorphism overhaul, no-line rule, font swap, editorial typography, orange restraint — are individually low-complexity. Their risk comes from combined scope (12+ component files) and the hard Lighthouse CI gate: LCP < 4000ms, TBT < 600ms, CLS < 0.1, Accessibility >= 90.

The primary risks are well-understood and preventable: the upgrade tool produces incorrect output for Astro-specific patterns and must be treated as a 70% solution requiring manual completion; `backdrop-filter: blur()` on too many simultaneous elements will kill TBT on mobile; font swaps without metric-adjusted fallbacks will cause CLS failures; and the DESIGN.md spec is dark-mode-first with no explicitly specified light mode tokens, requiring that gap to be filled before implementation begins. None of these risks are novel — all have documented mitigations in the pitfalls research.

## Key Findings

### Recommended Stack

The stack changes are minimal and surgical: four packages removed, five added, one config file deleted, and two integration points moved. The core Astro 5 + React islands architecture is entirely unchanged. See `.planning/research/STACK.md` for full package versions and install commands.

**Core technology changes:**
- `tailwindcss ^4.2.2` (devDep): replaces v3.4.19 — CSS-first, Lightning CSS built-in, no PostCSS needed
- `@tailwindcss/vite ^4.2.2` (devDep): replaces `@astrojs/tailwind` — moves from `integrations[]` to `vite.plugins[]`
- `tw-animate-css ^1.4.0` (dep): replaces `tailwindcss-animate` — pure CSS, v4-native, drop-in for Sheet/DropdownMenu animations
- `@fontsource-variable/manrope ^5.2.8` (dep): replaces `@fontsource/playfair-display` — geometric display/headline font per DESIGN.md
- `@fontsource-variable/inter ^5.2.8` (dep): replaces `@fontsource/open-sans` — clean body/label font per DESIGN.md
- `tailwind.config.mjs` deleted — all config moves to `@theme {}` block in `globals.css`
- `autoprefixer` removed — Lightning CSS in v4 handles vendor prefixing natively

**Critical procedural note:** The `@tailwindcss/upgrade` CLI tool handles template scanning (renamed utilities) but is documented to produce incorrect output for Astro-specific patterns (wrong `astro.config.mjs` placement, invalid `@custom-variant` syntax). Use it for the utility rename pass only; complete all Astro integration steps manually.

### Expected Features

Every feature maps to an existing component being re-skinned, not a new component being built. The site is already working — this is entirely a visual overhaul. See `.planning/research/FEATURES.md` for per-feature complexity ratings and the complete dependency map.

**Must have (table stakes — facelift is incomplete without these):**
- TailwindCSS v3 to v4 migration — prerequisite gate; blocks everything else
- Surface hierarchy token system (5 depth levels) — replaces zinc-based backgrounds with warm brown obsidian tones per DESIGN.md
- Hybrid token migration — remap shadcn semantic tokens (`--background`, `--card`, `--popover`) to surface hierarchy without breaking Radix components
- Font swap: Manrope Variable (display) + Inter Variable (body) — variable fonts reduce from 6 HTTP requests to 2
- No-line rule implementation across ~8 components — border removal paired with background tonal shifts
- Glassmorphism overhaul — warm-tinted surfaces using `color-mix()`, `backdrop-blur: 32px`, inner glow strokes
- Light and dark mode both redesigned — class-based toggle preserved; `@custom-variant dark` replaces `darkMode: ['class']`

**Should have (differentiators that complete the editorial aesthetic):**
- Editorial typography scale — `display-lg` (3.5rem) contrasted with `label-sm` (0.625rem, tracking 0.15em) for magazine tension
- Tinted ambient shadows — warm brown-black tint using `oklch()` instead of neutral gray/black
- Orange restraint — reduce 15+ uses of `#FF4B12` to 3-4 high-impact moments; everything else reverts to `on_surface_variant`
- Asymmetric editorial layout moments — small labels positioned opposite large headlines in Hero and MenuSection

**Defer to post-facelift:**
- Per-component micro-animations beyond existing `tw-animate-css` repertoire
- Asymmetric layout moments if schedule is tight (nice-to-have, not required for spec compliance)

**Anti-features (explicitly do not do):**
- No new npm packages beyond the Tailwind v4 migration set — Lighthouse TBT budget is non-negotiable
- No animating `backdrop-filter` on scroll — GPU paint storms on mobile
- No rewriting React islands (Header, MenuSection) as Astro components — they exist as islands for good reason
- No removing the `.dark` class toggle mechanism — pre-paint `theme.js` pattern must be preserved
- No neutral grays (`zinc-*`, `gray-*`) anywhere — always use the warm surface hierarchy token equivalent
- No changes to JSON-LD schema components — purely functional, out of facelift scope, SEO score must not regress

### Architecture Approach

The v2.0 architecture is a re-skin, not a restructure. The Astro 5 + React islands split remains unchanged. Astro components handle all layout and static structure; React components (Header, MenuSection) remain islands hydrated with `client:load` and `client:visible` respectively. No new components are needed — all work is editing existing ones.

The token architecture follows a two-layer model in `globals.css`: CSS custom properties in `:root` and `.dark {}` hold the raw surface values; `@theme inline` exposes both the new surface hierarchy tokens AND the existing shadcn semantic tokens as Tailwind utility classes. This dual-layer approach keeps shadcn components (Button, Sheet, DropdownMenu) working without modification while simultaneously making the new `bg-surface-dim`, `bg-surface-container`, etc. classes available for component re-skins.

**Major components being re-skinned:**
1. `globals.css` — rewritten in full; the v4 CSS configuration source of truth for the entire design system
2. `Header.tsx` — glassmorphism scrolled state updated, nav borders removed, dark mode variants verified
3. `MenuSection.tsx` — structural borders removed, category header color changed from orange to `on_surface`
4. `Footer.astro` — all `border-t`/`border-b` removed, section background shifts applied
5. `MobileActionButtons.astro` — glassmorphism container updated, animation dependency swapped
6. `OurStorySection.astro` — glass-card caption updated, tinted shadows applied
7. `OrderSection.astro` — CTA container glassmorphism updated to warm tint
8. `ReviewsSection.astro` — card border-to-surface migration, tinted shadow replacement

**Architecture note:** The ARCHITECTURE.md research file (dated 2026-02-20) documents architecture for GEO/AEO content pages from a prior milestone, not the v2.0 UI Facelift. The v2.0 architecture is derived from FEATURES.md and STACK.md. No new pages, routing changes, or data layer files are part of this milestone.

### Critical Pitfalls

See `.planning/research/PITFALLS.md` for the complete catalog (14 pitfalls with mitigations). The top-priority items:

1. **Dark mode breaks silently after migration** — The upgrade tool generates an incorrect `@custom-variant` declaration. Manually verify `globals.css` contains exactly `@custom-variant dark (&:where(.dark, .dark *))`. Test by adding `class="dark"` to `<html>` in devtools and confirming dark backgrounds apply to Header and Sheet before touching any design tokens.

2. **Sheet and DropdownMenu animations break without `tw-animate-css`** — `tailwindcss-animate` is officially deprecated and its v4 shim does not correctly emit the CSS variables that Radix UI's `data-[state]` patterns depend on. Remove it, install `tw-animate-css`, add `@import "tw-animate-css"` to `globals.css`. This is a Phase 1 blocker — mobile nav is broken until resolved.

3. **`@apply` in Astro `<style>` blocks causes build failure** — v4 does not auto-inject theme context into scoped styles. Migrate `.glass` and `.glass-card` from `@layer utilities { .glass { @apply ... } }` to `@utility glass { ... }` in `globals.css`. This is the v4-idiomatic approach and eliminates the `@apply` dependency entirely.

4. **shadcn HSL channel tuples break in `@theme`** — The current `globals.css` uses `:root { --background: 0 0% 100%; }` (raw HSL channels). Tailwind v4 requires complete color values in `@theme`. Wrap all HSL tuples in `hsl()` as part of the migration step before defining any `@theme inline` mappings.

5. **`container` utility loses its configuration** — `tailwind.config.mjs` configures `container` with `center: true`, `padding: '2rem'`, and `screens: { '2xl': '1400px' }`. This does not auto-migrate. After migration, add `@utility container { margin-inline: auto; padding-inline: 2rem; max-width: 1400px; }` to `globals.css` or layout breaks on 1600px+ viewports.

6. **Font swap causes CLS regression** — Swapping at display sizes (3.5rem for `display-lg`) risks CLS > 0.1 without metric-adjusted fallbacks. Preload the critical Manrope weight, define `@font-face` metric override descriptors, and run `npm run test:lhci` immediately after font installation as a checkpoint.

7. **`backdrop-blur` budget on mobile** — Applying `backdrop-filter: blur()` to ambient card elements simultaneously with the fixed Header will push TBT above 600ms on low-end devices. Reserve blur for: Header (scrolled state only), Sheet overlay, DropdownMenu. Cards use surface background color shifts, not blur.

8. **Light mode not specified in DESIGN.md** — The spec is dark-first with no explicit light mode token values. This must be resolved as a design decision before Phase 2 begins. FEATURES.md provides working recommended values (warm cream inversions: `#fdf6f0`, `#f5ece4`, `#ede0d4`, `#e0cfc4`) pending owner sign-off.

## Implications for Roadmap

The FEATURES.md dependency map is unambiguous: Tailwind v4 migration gates the token system, which gates all component re-skins, which gate editorial polish. The roadmap follows this chain exactly in three phases.

### Phase 1: Infrastructure — Tailwind v4 Migration + Font Foundation

**Rationale:** Every other task in this milestone is blocked until the build is green on v4 with dark mode working, animations working, fonts installed, and the container utility preserved. This phase has the most breaking-change surface area and must be fully verified before any visual work begins. Partial completion is not a valid intermediate state — a half-migrated codebase has compounding failures.

**Delivers:**
- Green `npm run build` on `tailwindcss ^4.2.2` with `@tailwindcss/vite` in `vite.plugins[]`
- `tailwind.config.mjs` deleted; all config in `globals.css` using `@theme`
- Dark mode variant confirmed working (`@custom-variant dark` manually verified in devtools)
- Sheet and DropdownMenu animations confirmed working (`tw-animate-css` installed and imported)
- Manrope Variable + Inter Variable fonts installed, critical weight preloaded, CLS < 0.1 verified via `test:lhci`
- `container` utility ported to `@utility container` (1400px max-width preserved)
- All renamed utilities corrected in source files (shadow-sm, rounded-sm, outline-none, ring, etc.)
- Existing Lighthouse scores preserved — no regressions introduced by the migration itself

**Addresses (from FEATURES.md):** Tailwind v4 migration (table stake #1), font migration (table stake #4), `tw-animate-css` swap

**Avoids (from PITFALLS.md):** Pitfalls 1, 2, 3, 4, 6 (integration conflict), 8 (CLS), 10, 11

**Research flag:** Standard, well-documented migration path. No additional research phase needed. The official Tailwind v4 upgrade guide, shadcn/ui v4 migration guide, and Astro 5.2 blog post collectively cover all steps. Treat the upgrade tool as a 70% solution and complete manually.

---

### Phase 2: Token System + Light/Dark Mode

**Rationale:** With the build stable on v4, the token architecture must be established in full before any component can be re-skinned. Writing component code that references token names (`bg-surface-dim`, `bg-surface-container`) before those tokens exist causes silent style failures that are hard to debug. Both light mode and dark mode values must be defined together in this phase — not iteratively — because every component must be validated in both modes before moving on.

**Delivers:**
- 5-level surface hierarchy tokens defined in `@theme` (`--color-surface-dim` through `--color-surface-container-high`)
- Light mode warm cream token values defined in `:root {}` (fills the DESIGN.md gap)
- Dark mode values overriding in `.dark {}` per DESIGN.md spec exactly
- `@theme inline` hybrid mapping: all shadcn semantic tokens (`--color-background`, `--color-card`, `--color-popover`, etc.) resolve to surface hierarchy values
- `@utility glass` and `@utility glass-card` rewritten with DESIGN.md warm-tinted spec (`color-mix()`, `backdrop-blur: 32px`, inner glow stroke)
- All text/background color pairs verified against WCAG AA (4.5:1) contrast ratios for both modes

**Addresses (from FEATURES.md):** Surface hierarchy token system (table stake #2), hybrid token migration (table stake #3), glassmorphism overhaul (table stake #6), light + dark mode redesign (table stake #7)

**Avoids (from PITFALLS.md):** Pitfalls 5 (HSL format in `@theme`), 9 (accessibility contrast regression), 12 (token naming collision), 13 (light mode undefined)

**Prerequisite design deliverable:** Light mode surface token values must be signed off before this phase begins. FEATURES.md recommended values provide a working starting point but require owner or designer confirmation.

**Research flag:** Token architecture pattern (`:root` + `@theme inline` hybrid) is fully documented in the shadcn/ui v4 migration guide. Material Design 3 color roles documentation covers the semantic mapping model. No additional research phase needed.

---

### Phase 3: Visual Re-skin — Component by Component

**Rationale:** With tokens established, the component re-skins are individually mechanical. Each component is an isolated set of class changes: remove structural borders, apply surface token backgrounds, update glassmorphism classes, apply editorial typography, reduce orange usage. Components can be re-skinned in any order since they share tokens but are otherwise independent. Run `npm run test:lhci` as a checkpoint after each page's components are complete — do not accumulate all re-skins and run Lighthouse once at the end.

**Delivers:**
- No-line rule implemented across all 8 affected components — borders replaced by background tonal shifts
- Header glassmorphism updated to warm-tinted spec with correct dark mode variants
- MenuSection borders removed; category header color changed from orange to `on_surface`
- Footer all borders removed; section background shifts applied
- MobileActionButtons, OurStorySection, OrderSection, ReviewsSection all updated to warm-tinted glassmorphism and tinted shadows
- Manrope applied as display font across all headings; `display-lg`/`label-sm` scale applied in Hero and section headers
- Orange reduced to 3-4 intentional moments site-wide (primary CTA, active state, brand gradient, logo)
- Tinted ambient shadows replacing neutral `shadow-*` utilities site-wide
- All 4 Lighthouse-audited pages passing CI thresholds after re-skin

**Addresses (from FEATURES.md):** No-line rule (table stake #5), editorial typography scale (differentiator #1), tinted shadows (differentiator #2), orange restraint (differentiator #4); asymmetric layout moments (differentiator #3) if schedule allows

**Avoids (from PITFALLS.md):** Pitfall 7 (`backdrop-blur` budget on cards), Pitfall 9 (per-component contrast checks), Pitfall 14 (per-page checkpoint builds rather than end-of-milestone Lighthouse run)

**Research flag:** Pure CSS and component editing. No external APIs, no novel integrations, no dependency research needed. Standard patterns throughout.

---

### Phase Ordering Rationale

- Phase 1 before Phase 2: `@theme` directives only exist in v4; the migration must land and build must be green before token definitions are written
- Phase 2 before Phase 3: component class names reference token names that must be defined before those classes are valid; writing `bg-surface-dim` before the token exists causes silent transparent backgrounds
- Phase 3 is internally parallelizable: Header, MenuSection, Footer, and content section components can be re-skinned in any order once tokens exist
- Light mode token gap must be resolved as a design decision before Phase 2 planning tasks are written — flag it as a prerequisite deliverable

### Research Flags

**Phases where additional research is not needed:**
- **Phase 1:** Migration path is fully documented. All breaking changes cataloged with specific mitigations. Execute from the research; no further research required.
- **Phase 2:** Token architecture pattern is established art (shadcn/ui v4 guide, Material Design 3). The light mode gap is a design decision, not a research question.
- **Phase 3:** CSS and component edits only. No unknowns.

**Design gap requiring owner/designer decision before Phase 2 planning:**
- Light mode surface token values are not specified in DESIGN.md. FEATURES.md provides recommended warm cream values (`#fdf6f0`, `#f5ece4`, `#ede0d4`, `#e0cfc4`). These need sign-off before Phase 2 tasks are scoped. The roadmapper should flag this as a blocking prerequisite with an explicit decision point before Phase 2 begins.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified against npm registry (March 2026). Upgrade tool limitations verified via multiple GitHub issues. Astro 5.2 blog post is the authoritative confirmation of `@tailwindcss/vite` as the v4 path. |
| Features | HIGH | Feature list derives directly from DESIGN.md (authoritative design spec). Complexity estimates grounded in specific named component files and class names from the actual codebase. Anti-features have documented rationale. |
| Architecture | MEDIUM | ARCHITECTURE.md is mismatched to this milestone — it documents GEO/AEO page architecture from a prior milestone. v2.0 architecture for the UI Facelift is inferred from FEATURES.md and STACK.md. The re-skin approach is correct and consistent with the existing codebase, but the dedicated architecture research file did not cover v2.0 scope. |
| Pitfalls | HIGH | 14 pitfalls, all grounded in specific GitHub issues (issue numbers cited), official Tailwind v4 upgrade guide entries, or documented community reports. Lighthouse thresholds are from CLAUDE.md project constraints. All mitigation steps are concrete and actionable. |

**Overall confidence:** HIGH

### Gaps to Address

- **Light mode token values (design gap, not code):** DESIGN.md does not specify light mode surface token values. FEATURES.md provides a working recommendation but owner/designer sign-off is needed before Phase 2 implementation begins. This is a blocking prerequisite for Phase 2 — it should be resolved during roadmap planning or as the first task before Phase 2 work begins.

- **ARCHITECTURE.md mismatch:** The architecture research file covers a previous milestone's scope. The v2.0 facelift architecture is straightforwardly a re-skin with no new components or routing — the gap does not block the roadmap. A dedicated v2.0 architecture document would cover the `globals.css` token architecture, the `@theme inline` dual-layer pattern, and the component re-skin scope if additional documentation is desired.

- **`@tailwindcss/upgrade` tool reliability (MEDIUM confidence):** Tool failure modes are documented but may vary by patch version. Treat Phase 1 as requiring manual verification after every automated step, not blind execution of tool output. Factor extra review time into Phase 1 task estimates.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS official install guide for Astro](https://tailwindcss.com/docs/installation/framework-guides/astro) — `@tailwindcss/vite` in `vite.plugins[]`, correct integration pattern
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — breaking changes, renamed utilities, `@custom-variant dark`, container changes
- [Tailwind CSS v4.0 release blog](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first architecture, Lightning CSS, `@theme` directive
- [Tailwind CSS Theme Variables docs](https://tailwindcss.com/docs/theme) — `@theme`, `@utility`, `@custom-variant` directives
- [shadcn/ui Tailwind v4 migration guide](https://ui.shadcn.com/docs/tailwind-v4) — `@theme inline`, HSL format fix, hybrid token pattern
- [tw-animate-css GitHub](https://github.com/Wombosvideo/tw-animate-css) + [npm](https://www.npmjs.com/package/tw-animate-css) — v4-compatible replacement for `tailwindcss-animate`, version 1.4.0
- [@fontsource-variable/manrope npm](https://www.npmjs.com/package/@fontsource-variable/manrope) — version 5.2.8 confirmed
- [@fontsource-variable/inter npm](https://www.npmjs.com/package/@fontsource-variable/inter) — version 5.2.8 confirmed
- [Astro 5.2 blog post](https://astro.build/blog/astro-520/) — official confirmation of `@tailwindcss/vite` as the v4 integration path in Astro
- [shadcn/ui Sheet animation v4 issue #6440](https://github.com/shadcn-ui/ui/issues/6440) — `tailwindcss-animate` breakage in v4 documented
- [Tailwind dark mode `@custom-variant` incorrect syntax discussion #16517](https://github.com/tailwindlabs/tailwindcss/discussions/16517) — upgrade tool failure mode documented
- [Font loading CLS — debugbear.com](https://www.debugbear.com/blog/web-font-layout-shift) — font swap CLS risk analysis and preload guidance

### Secondary (MEDIUM confidence)
- [okaryo.log — Upgrading Astro to Tailwind v4](https://blog.okaryo.studio/en/20250201-astro-tailwindcss-v4-upgrade/) — `@reference` workaround for Astro `<style>` blocks, practical migration experience
- [Brian Douglass — Upgrade Astro site to Tailwind v4](https://bhdouglass.com/blog/how-to-upgrade-your-astro-site-to-tailwind-v4/) — `vite.plugins` vs `integrations` practical guide
- [tailwindlabs/tailwindcss GitHub issue #18055](https://github.com/tailwindlabs/tailwindcss/issues/18055) — upgrade tool failures specific to Astro projects
- [Tailwind upgrade tool complex config discussion #17018](https://github.com/tailwindlabs/tailwindcss/discussions/17018) — tool fails on complex `tailwind.config.mjs` with nested objects
- [Material Design 3 surface color roles](https://m3.material.io/styles/color/roles) — surface hierarchy conceptual model and semantic naming
- [backdrop-filter performance — Mozilla bugzilla](https://bugzilla.mozilla.org/show_bug.cgi?id=1718471) — GPU compositing cost for concurrent `backdrop-filter` elements
- [WCAG vs APCA contrast for dark mode](https://capellic.com/insights/accessible-colors) — contrast validation methodology

---
*Research completed: 2026-03-24*
*Ready for roadmap: yes*
