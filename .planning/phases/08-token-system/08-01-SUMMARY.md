---
phase: 08-token-system
plan: "01"
subsystem: styling
tags: [css, tokens, material-design-3, tailwindcss, dark-mode]
dependency_graph:
  requires: [07-01, 07-02]
  provides: [M3-token-foundation]
  affects: [all-components]
tech_stack:
  added: []
  patterns: [M3-two-layer-token-architecture, CSS-custom-properties, @theme-inline]
key_files:
  created: []
  modified:
    - src/styles/globals.css
decisions:
  - "M3 two-layer architecture: :root/.dark hold raw hex values; @theme inline maps to --color-* Tailwind namespace"
  - "All tokens use hex values (not hsl) per D-22 — palette-swappable by updating globals.css only"
  - "glass uses backdrop-blur(32px); glass-card uses NO backdrop-filter per DESIGN.md blur budget"
  - "Worktree initialized to Phase 7 baseline (astro.config.mjs, packages, components)"
metrics:
  duration: "4m 19s"
  completed: "2026-03-26"
  tasks_completed: 1
  files_modified: 1
---

# Phase 08 Plan 01: M3 Token System — globals.css Rewrite Summary

**One-liner:** Complete Material Design 3 token system replacing shadcn/brand tokens with #FF4B12-seeded M3 palette, two-layer CSS variable architecture for Tailwind utility class generation with automatic light/dark mode switching.

## What Was Built

Completely rewrote `src/styles/globals.css` to replace the entire shadcn/brand token system with Material Design 3 tokens derived from the `#FF4B12` seed color.

### Token Architecture

**Layer 1 — Raw values** (`:root` / `.dark` blocks):
- Full M3 surface hierarchy: `--surface-dim`, `--surface`, `--surface-container-lowest` through `--surface-container-highest`, `--surface-bright`, `--surface-variant`
- Complete semantic families: primary, secondary, tertiary, error — each with `on-*`, `container`, `on-container`, `fixed`, `fixed-dim`, `on-fixed`, `on-fixed-variant` tokens
- Outline tokens: `--outline`, `--outline-variant`
- Inverse tokens: `--inverse-surface`, `--inverse-on-surface`, `--inverse-primary`
- Background: `--background`, `--on-background`, `--surface-tint`
- Adaptive glass vars: `--glass-bg`, `--glass-border` (mode-specific rgba values)
- Tinted shadow: `--shadow-color` (warm tint, never neutral gray)

**Layer 2 — Tailwind wiring** (`@theme inline` block):
- All 46+ tokens mapped to `--color-*` namespace enabling `bg-surface-container`, `text-on-primary-container`, etc.
- Radius: `--radius-lg`, `--radius-md`, `--radius-sm`
- Fonts: `--font-sans: "Inter Variable"`, `--font-display: "Manrope Variable"`

### Utility Classes Rewritten

| Utility | Key Properties |
|---------|----------------|
| `.glass` | `backdrop-filter: blur(32px)`, `var(--glass-bg)`, `0.5px` border via `var(--glass-border)` |
| `.glass-card` | `var(--glass-bg)`, `0.5px` border, `box-shadow` via `var(--shadow-color)` — NO backdrop-filter |
| `.hero-gradient` | `color-mix(in srgb, var(--primary-container) 15%, transparent)` → transparent |
| `.cta-gradient` | `var(--primary-container)` → `var(--inverse-primary)` |

### Base Resets Updated
- `border-color: var(--outline-variant)` (was `var(--border)`)
- `color: var(--on-surface)` on body (was `var(--foreground)`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree initialized to Phase 7 baseline**
- **Found during:** Task 1 — build failed with `Cannot find module '@astrojs/tailwind'`
- **Issue:** The worktree branch `worktree-agent-a4040b33` was based on an old commit predating the Phase 7 TailwindCSS v4 migration. The worktree had the old `@astrojs/tailwind` integration, `@tailwind base/components/utilities` directives, and old component syntax incompatible with Tailwind v4.
- **Fix:** Checked out `astro.config.mjs`, `package.json`, `package-lock.json`, `knip.json`, and all component files from the `main` branch into the worktree. This brought the Phase 7 baseline into the worktree so the M3 token work could build successfully.
- **Files modified:** `astro.config.mjs`, `package.json`, `package-lock.json`, `knip.json`, `src/components/Footer.astro`, `src/components/Header.tsx`, `src/components/MenuSection.tsx`, `src/components/ui/AstroButton.astro`, `src/components/ui/button.tsx`, `src/components/ui/dropdown-menu.tsx`, `src/components/ui/sheet.tsx`, `src/layouts/Layout.astro`, `src/pages/faq.astro`, `src/pages/directions.astro`, `src/pages/near-grand-canyon.astro`
- **Commit:** d606a08

## Verification Results

All acceptance criteria met:

| Check | Result |
|-------|--------|
| `--surface-container: #ffe9e4` in `:root` | PASS |
| `--surface-container: #2d1b17` in `.dark` | PASS |
| `--color-surface-container: var(--surface-container)` in `@theme inline` | PASS |
| `--primary-container: #d93900` in `:root` | PASS |
| `--primary-container: #ff5626` in `.dark` | PASS |
| `--on-primary-container: #fffbff` in `:root` | PASS |
| `--glass-bg: rgba(255, 226, 219, 0.70)` in `:root` | PASS |
| `--glass-bg: rgba(56, 38, 33, 0.70)` in `.dark` | PASS |
| `--shadow-color: rgba(243, 211, 203, 0.3)` in `:root` | PASS |
| `--shadow-color: rgba(25, 10, 7, 0.4)` in `.dark` | PASS |
| `backdrop-filter: blur(32px)` in `@utility glass` | PASS |
| `@utility glass-card` has NO `backdrop-filter` | PASS |
| `@utility hero-gradient` present | PASS |
| `@utility cta-gradient` present | PASS |
| `border-color: var(--outline-variant)` | PASS |
| `color: var(--on-surface)` on body | PASS |
| `--font-sans: "Inter Variable"` | PASS |
| `--font-display: "Manrope Variable"` | PASS |
| No `--brand-orange` | PASS |
| No `--brand-green` | PASS |
| No `--brand-gold` | PASS |
| No `--chart-` tokens | PASS |
| No `hsl()` values | PASS |
| No `--card:` token | PASS |
| No `--muted:` token | PASS |
| No `--accent:` token | PASS |
| No `--font-serif` | PASS |
| `npm run build` completes | PASS |

## Known Stubs

None. The token system is fully wired. Component files in the worktree still reference shadcn token class names (`bg-primary`, `text-foreground`, etc.) — these are addressed in Plan 02 (component token migration).

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | d606a08 | feat(08-01): Rewrite globals.css with complete M3 token system |

## Self-Check: PASSED
