# Quick Task 260401-rmp: Tone down cta-gradient in Order Section - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Task Boundary

The Order section on the homepage (`src/components/OrderSection.astro`) uses the `cta-gradient` utility class, which applies a full-saturation gradient from `--primary-container` to `--inverse-primary`. In light mode this is `#c03200 → #ffb5a1`; in dark mode `#ff5626 → #b12d00`. Both are visually too vivid/bright.

The task: tone down the `cta-gradient` so it reads as a subtle warm hint rather than a dominant orange gradient.

**Note:** The Unsplash background image that previously existed in the Order section was intentionally removed as part of the Milestone 2 UI Facelift redesign. It stays removed.

</domain>

<decisions>
## Implementation Decisions

### Gradient intensity
- **~20% subtle hint**: Use `color-mix(in srgb, var(--primary-container) 20%, transparent)` blended with the `bg-surface-dim` base, so the gradient is barely-there warmth rather than vivid orange.
- Both light and dark modes should follow the same approach — faint ember glow on dark, soft warm tint on light.

### Scope
- Modify the `cta-gradient` utility in `src/styles/globals.css` only if the utility is used exclusively by the Order section. If it's shared, add a scoped override in `OrderSection.astro` instead to avoid unintended side effects.

### Claude's Discretion
- Exact `color-mix` percentages (target ~20%), stop positions, and angle — Claude's call to match the "barely-there" intent.
- Whether to keep the 135deg angle or adjust for visual balance.

</decisions>

<specifics>
## Specific Ideas

- Current: `linear-gradient(135deg, var(--primary-container) 0%, var(--inverse-primary) 100%)`
- Target feel: the M3 `hero-gradient` approach in the same file (`color-mix(in srgb, var(--primary-container) 15%, transparent)`) is a useful reference for the pattern.
- The section already has `bg-surface-dim` as the base — the gradient should layer as a subtle tint over that base color.

</specifics>

<canonical_refs>
## Canonical References

- `src/styles/globals.css` line 294 — `@utility cta-gradient` definition
- `src/components/OrderSection.astro` — consumer of `cta-gradient`
- Light tokens: `--primary-container: #c03200`, `--inverse-primary: #ffb5a1`
- Dark tokens: `--primary-container: #ff5626`, `--inverse-primary: #b12d00`
- Reference pattern: `hero-gradient` utility (line ~286) uses `color-mix(in srgb, var(--primary-container) 15%, transparent)`

</canonical_refs>
