# Phase 8: Token System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-25
**Phase:** 08-token-system
**Areas discussed:** Light mode palette, Shadcn token remapping, Glass utility update, Token naming

---

## Light Mode Palette

| Option | Description | Selected |
|--------|-------------|----------|
| Warm cream inversions | Use suggested warm cream tones (#fdf6f0 → #e0cfc4) from STATE.md | |
| Pure warm whites | Lighter, more subtle hierarchy — barely perceptible depth shifts | |
| Match DESIGN.md exactly | Only implement dark mode, skip light until DESIGN.md updated | |
| **Use M3 templates as-is** | **Extract all tokens from UI-template.html (dark) and UI-light-template.html (light)** | **User provided template files** |

**User's choice:** Use the exact M3 palettes from both HTML template files as the authoritative source of truth. User provided `docs/UI-light-template.html` and `docs/UI-template.html` as reference files with complete Material Design 3 palettes generated from #FF4B12 seed.

### Sub-decisions

| Question | Options | Selected |
|----------|---------|----------|
| Surface depth levels | Full M3 set / Only DESIGN.md's 5 levels | Full M3 set |
| Token scope | Full M3 semantic set / Surfaces + primary + outline only | Full M3 semantic set |
| Custom utilities timing | Define in Phase 8 / Defer to Phase 9 | Define in Phase 8 |
| Glass mode behavior | Mode-adaptive glass / Same both modes / You decide | Mode-adaptive glass |
| Default mode | Light default / Dark default | Light default |
| Backdrop-blur on cards | Templates override DESIGN.md / DESIGN.md wins / You decide | DESIGN.md wins (no blur on cards) |
| Shadow token | Add --shadow-color / Defer to Phase 9 / You decide | Add shadow token |
| Typography scale | Font families only / Full type scale | Font families only |

**Notes:** User emphasized that the entire token system must be dynamic — changing the primary seed color should cascade through both modes automatically. All colors as CSS custom properties, zero hardcoded hex in components. "Palette swap = update globals.css only."

---

## Shadcn Token Remapping

| Option | Description | Selected |
|--------|-------------|----------|
| Alias shadcn to M3 | Keep shadcn names pointing to M3 values | |
| Replace shadcn with M3 directly | Remove shadcn naming, update component refs | ✓ |
| Keep both independent | Two parallel token systems | |

**User's choice:** Replace shadcn entirely with M3 tokens. Clean break.

### Sub-decisions

| Question | Options | Selected |
|----------|---------|----------|
| Component update scope | Token swap only / Full reskin | Token swap only |
| Button mapping | primary → primary-container / primary → primary | primary → primary-container |
| Remaining mappings | Claude's discretion / User specifies | Claude's discretion |
| Chart tokens | Drop / Keep | Drop |

---

## Glass Utility Update

| Option | Description | Selected |
|--------|-------------|----------|
| Update glass in Phase 8 | Rewrite with M3 tokens, warm tints, satisfies SC #4 | ✓ |
| Defer to Phase 9 | Keep Phase 7 compile-only fix | |

**User's choice:** Update glass in Phase 8.

### Sub-decisions

| Question | Options | Selected |
|----------|---------|----------|
| Which utilities | Both .glass and .glass-card / Merge into one / You decide | Both, differentiated |
| Glass mode adaptation | CSS variables / dark: prefix classes | CSS variables |
| Gradient utilities | Include in Phase 8 / Defer / You decide | Include in Phase 8 |
| Blur on cards (DESIGN.md vs templates) | Templates win / DESIGN.md wins / You decide | DESIGN.md wins |

**Notes:** .glass = full glassmorphism (blur, opacity, inner glow) for Header/Sheet/Dropdown only. .glass-card = tonal surface treatment, NO blur, for cards. User confirmed effect breakdown across both modes.

---

## Token Naming

| Option | Description | Selected |
|--------|-------------|----------|
| Kebab-case matching Tailwind | --surface-container-low | ✓ |
| Kebab-case with prefix | --color-surface-container-low | |
| Snake_case matching DESIGN.md | --surface_container_low | |

**User's choice:** Kebab-case matching Tailwind classes.

### Sub-decisions

| Question | Options | Selected |
|----------|---------|----------|
| Contrast token namespace | Flat namespace / Nested grouping | Flat namespace |
| Old brand tokens | Remove / Keep as aliases / You decide | Remove |

---

## Claude's Discretion

- Remaining shadcn → M3 mappings (card, muted, accent, border, input, ring, popover, destructive)
- Specific opacity for light mode glass tint
- Implementation order within the phase

## Deferred Ideas

- Typography scale classes (display-lg, body-md, label-sm) — Phase 9
- Visual reskin of Radix components (layout, spacing, animations) — Phase 9
