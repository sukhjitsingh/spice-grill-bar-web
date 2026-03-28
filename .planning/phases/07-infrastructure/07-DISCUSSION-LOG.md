# Phase 7: Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 07-infrastructure
**Areas discussed:** Font installation, Migration strategy, Glass utility handling, CSS variable format

---

## Font Installation

| Option | Description | Selected |
|--------|-------------|----------|
| @fontsource-variable (Recommended) | Install @fontsource-variable/manrope and @fontsource-variable/inter. Matches existing pattern, self-hosted, variable font = single file per family. Best for CLS. | ✓ |
| Self-hosted woff2 files | Download variable woff2 files manually, add @font-face in CSS. No npm dependency but manual maintenance. | |
| Google Fonts CDN | Link from Google Fonts. Simplest but adds external request, CLS risk, privacy concerns. | |

**User's choice:** @fontsource-variable
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Remove old fonts now (Recommended) | Clean break — install new, remove old, update references in one shot. | |
| Keep both temporarily | Install new fonts alongside old ones. Remove old in Phase 9. | ✓ |

**User's choice:** Keep both temporarily
**Notes:** Safer approach — remove old fonts when components are reskinned in Phase 9

---

## Migration Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Upgrade CLI + manual fix (Recommended) | Run @tailwindcss/upgrade first for bulk renames, then fix Astro-specific issues manually. | ✓ |
| Fully manual migration | Skip upgrade CLI. Convert everything by hand. | |
| You decide | Claude picks approach. | |

**User's choice:** Upgrade CLI + manual fix
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Full QA (Recommended) | Run npm run qa (build + lint + knip + typecheck + AEO + Lighthouse CI). | ✓ |
| Build + Lighthouse only | Just build + test:lhci. | |
| Build only | Just build. | |

**User's choice:** Full QA
**Notes:** No shortcuts on quality gates

### Vite Setup

| Option | Description | Selected |
|--------|-------------|----------|
| Inline in astro.config.mjs (Recommended) | Add @tailwindcss/vite to vite.plugins[] inside astro.config.mjs. | ✓ |
| Separate vite.config.ts | Dedicated Vite config file. | |

**User's choice:** Inline in astro.config.mjs
**Notes:** None

### shadcn Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Migrate tokens in-place (Recommended) | Convert shadcn CSS variables to full values, register in @theme inline. | ✓ (modified) |
| Re-init shadcn for v4 | Run shadcn CLI to regenerate v4-compatible config. | |
| You decide | Claude picks approach. | |

**User's choice:** Option 1 AND remove shadcn references — purely CSS-first Tailwind based
**Notes:** User wants to remove shadcn naming convention entirely. Keep Radix UI components functional but move away from shadcn token system. Scope of "remove shadcn references" (tokens only vs components too) was not fully resolved — defaulting to token naming removal only, Radix components stay.

---

## Glass Utility Handling

| Option | Description | Selected |
|--------|-------------|----------|
| Just make them compile (Recommended) | Convert from @layer utilities to @utility directive. Keep neutral gray look. Phase 9 restyles. | ✓ |
| Strip them out | Remove entirely, replace with inline classes. Phase 9 rebuilds. | |
| You decide | Claude picks least disruptive approach. | |

**User's choice:** Just make them compile
**Notes:** Visual changes deferred to Phase 9

---

## CSS Variable Format

| Option | Description | Selected |
|--------|-------------|----------|
| Full HSL values (Recommended) | `--primary: hsl(222.2 47.4% 11.2%)`. Components use var(--primary) directly. Works with v4 opacity modifiers. | ✓ |
| Full oklch values | Convert to oklch() for perceptual uniformity. More modern but requires recalculating all colors. | |
| You decide | Claude picks format. | |

**User's choice:** Full HSL values
**Notes:** None

| Option | Description | Selected |
|--------|-------------|----------|
| Keep class names as-is (Recommended) | Register same token names in @theme. Rename to DESIGN.md tokens in Phase 8. | ✓ |
| Rename to DESIGN.md tokens now | Rename classes to surface-dim, surface-container, etc. now. | |

**User's choice:** Keep class names as-is
**Notes:** Token rename happens in Phase 8

---

## Claude's Discretion

- Specific order of migration sub-steps
- Edge case handling from upgrade CLI output
- Incremental vs single migration commit strategy

## Deferred Ideas

None — discussion stayed within phase scope
