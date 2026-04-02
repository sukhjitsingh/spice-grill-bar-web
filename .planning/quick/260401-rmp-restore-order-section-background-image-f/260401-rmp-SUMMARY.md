---
phase: quick-260401-rmp
plan: 01
subsystem: styling
tags: [design-system, m3-tokens, gradients, order-section]
dependency_graph:
  requires: []
  provides: [subtle-cta-gradient]
  affects: [src/components/OrderSection.astro]
tech_stack:
  added: []
  patterns: [color-mix, M3-tonal-separation]
key_files:
  modified:
    - src/styles/globals.css
decisions:
  - "Used color-mix(in srgb, ...) at 20%/10% opacity to match hero-gradient pattern and keep gradient barely-there"
metrics:
  duration: ~3min
  completed: 2026-04-01
---

# Quick Task 260401-rmp: Tone Down cta-gradient to Subtle Warm Hint

## One-liner

Replaced full-saturation `cta-gradient` with `color-mix` approach at 20%/10% opacity so the Order section shows a barely-there warm tint over `bg-surface-dim` instead of a vivid orange band.

## What Was Done

### Task 1: Reduce cta-gradient to ~20% subtle warm hint using color-mix

Updated `@utility cta-gradient` in `src/styles/globals.css` from:

```css
background: linear-gradient(135deg, var(--primary-container) 0%, var(--inverse-primary) 100%);
```

To:

```css
background: linear-gradient(
  135deg,
  color-mix(in srgb, var(--primary-container) 20%, transparent) 0%,
  color-mix(in srgb, var(--inverse-primary) 10%, transparent) 100%
);
```

This matches the existing `hero-gradient` pattern in the same file and aligns with the M3 tonal separation philosophy — no vivid orange bands, only subtle warmth over the `bg-surface-dim` base.

**Commit:** `1eb23c8`

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- Build: passed cleanly (`npm run build` completed in ~74s, 4 pages built)
- `cta-gradient` in globals.css confirmed to use `color-mix` with 20%/10% intensity
- No other components affected (`cta-gradient` only used by `OrderSection.astro`)

## Self-Check: PASSED

- File modified: `src/styles/globals.css` — exists and contains `color-mix`
- Commit `1eb23c8` — confirmed in git log
