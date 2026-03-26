---
phase: 08-token-system
plan: "02"
subsystem: styling
tags: [css, tokens, material-design-3, components, tailwindcss, dark-mode]
dependency_graph:
  requires: [08-01]
  provides: [TOKEN-03-complete]
  affects: [all-components, all-pages]
tech_stack:
  added: []
  patterns: [M3-token-classes, shadcn-to-M3-remapping, brand-token-elimination]
key_files:
  created: []
  modified:
    - src/components/ui/button.tsx
    - src/components/ui/sheet.tsx
    - src/components/ui/dropdown-menu.tsx
    - src/components/ReviewsSection.astro
    - src/components/Header.tsx
    - src/components/Hero.astro
    - src/components/MenuSection.tsx
    - src/components/MobileActionButtons.astro
    - src/pages/faq.astro
    - src/pages/directions.astro
    - src/pages/near-grand-canyon.astro
decisions:
  - "All dark: prefixed overrides removed from button variants — M3 tokens auto-switch via CSS variables"
  - "ReviewsSection: avatar gradient uses primary-container/secondary-container instead of brand-orange/brand-gold"
  - "Header zinc/dark: patterns fully eliminated — M3 on-surface/on-surface-variant equivalents used throughout"
  - "MobileActionButtons CTA uses from-primary-container to-inverse-primary instead of from-brand-orange to-red-600"
  - "Layout.astro bg-background retained — --color-background is a valid M3 token defined in Plan 01"
metrics:
  duration: "15m"
  completed: "2026-03-26"
  tasks_completed: 2
  files_modified: 11
---

# Phase 08 Plan 02: Component Token Migration Summary

**One-liner:** Migrated all Radix UI components and page files from shadcn semantic tokens and brand-* class names to M3 token utility classes, completing TOKEN-03 with zero remaining shadcn or brand-* references in src/.

## What Was Built

### Task 1: Radix UI Component Updates (button.tsx, sheet.tsx, dropdown-menu.tsx)

Replaced all shadcn token class names and hardcoded neutral/zinc colors with M3 token equivalents.

**button.tsx:**
- Base: `focus-visible:ring-neutral-950/dark:ring-neutral-300` → `focus-visible:ring-outline`
- Default variant: `bg-neutral-900 text-neutral-50` → `bg-primary-container text-on-primary-container`
- Destructive: `bg-red-500` → `bg-error-container text-on-error-container`
- Outline: `border-neutral-200 bg-white` → `border-outline-variant bg-surface`
- Secondary: `bg-neutral-100 text-neutral-900` → `bg-surface-container-high text-on-surface`
- Ghost: `hover:bg-neutral-100` → `hover:bg-surface-container hover:text-on-surface`
- Link: `text-neutral-900` → `text-primary-container`
- Removed ALL `dark:` prefixed overrides

**sheet.tsx:**
- `bg-background` → `bg-surface` (sheetVariants base)
- `ring-offset-background` → `ring-offset-surface` (SheetClose)
- `focus:ring-ring` → `focus:ring-outline` (SheetClose)
- `data-[state=open]:bg-secondary` → `data-[state=open]:bg-surface-container-high` (SheetClose)
- `text-foreground` → `text-on-surface` (SheetTitle)
- `text-muted-foreground` → `text-on-surface-variant` (SheetDescription)

**dropdown-menu.tsx:**
- `focus:bg-accent data-[state=open]:bg-accent` → `focus:bg-surface-container-high data-[state=open]:bg-surface-container-high` (SubTrigger)
- `bg-popover text-popover-foreground` → `bg-surface-container-highest text-on-surface` (SubContent + Content)
- `focus:bg-accent focus:text-accent-foreground` → `focus:bg-surface-container-high focus:text-on-surface` (MenuItem, CheckboxItem, RadioItem)
- `bg-muted` → `bg-outline-variant` (Separator)

### Task 2: Component and Page Token Migration

Replaced all `brand-*` and remaining shadcn class references across 8 files.

**ReviewsSection.astro:** Background orbs, heading, description, avatar gradients all migrated to M3 tokens.

**Header.tsx:** Navigation links, CTA button, phone button, sheet sidebar, all zinc/dark: patterns eliminated.

**Hero.astro:** Gradient overlay and H1 accent span updated to primary-container.

**MenuSection.tsx:** Section background, sticky header, nav pills (mobile + desktop), category headings with border, item titles — all converted. Comprehensive dark:/zinc- elimination.

**MobileActionButtons.astro:** Call button text, divider, CTA gradient fully migrated.

**faq.astro:** Main container, heading span, card containers, question/answer text.

**directions.astro:** H1, lead paragraphs, nav container, all 7 city navigation links (replace_all), all 7 city section cards and their headings/body/addresses, phone tel links, cross-link CTA buttons.

**near-grand-canyon.astro:** H1 span, lead text, section headings, Why Stop Here card, Distance paragraphs, all 5 dish cards (name, price, description), Hours paragraph, Plan Your Visit CTAs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree missing Plan 01 foundation (cherry-pick required)**
- **Found during:** Task 1 — build failed with `Cannot find module '@astrojs/tailwind'`
- **Issue:** The worktree branch `worktree-agent-ae97ff06` was based on an old commit predating both the Phase 7 TailwindCSS v4 migration AND the Plan 01 globals.css rewrite. The worktree had the old `@astrojs/tailwind` integration with no M3 tokens.
- **Fix:** Cherry-picked commit `d606a08` (Plan 01: M3 token system + Phase 7 baseline) into the current worktree. Then re-applied all Task 1 edits on top of the cherry-picked baseline. The cherry-pick also changed `outline-none` → `outline-hidden` and `shadow-sm` → `shadow-xs` in Radix components (Phase 7 fix), which were preserved.
- **Files modified:** All files from Plan 01 baseline (astro.config.mjs, package files, src/ components)
- **Commit:** dd49054

**2. Additional zinc/dark: patterns cleaned across modified files**
- **Found during:** Task 2 — comprehensive scan of modified files revealed extensive `dark:bg-zinc-*`, `text-zinc-*` patterns beyond those explicitly called out in the plan
- **Fix:** Replaced all zinc/dark: patterns within the 11 files in scope with appropriate M3 token equivalents per the IMPORTANT note in the plan action
- **Examples:** `bg-zinc-50 dark:bg-zinc-950` → `bg-surface-container-lowest`, `text-zinc-900 dark:text-white` → `text-on-surface`, `text-zinc-600 dark:text-zinc-300` → `text-on-surface-variant`, `border-zinc-200 dark:border-white/10` → `border-outline-variant`, etc.

## Verification Results

| Check | Result |
|-------|--------|
| `grep -r "brand-orange" src/` returns zero matches | PASS |
| `grep -r "brand-green" src/` returns zero matches | PASS |
| `grep -r "brand-gold" src/` returns zero matches | PASS |
| `grep -r "text-foreground" src/` returns zero matches | PASS |
| `grep -r "text-muted-foreground" src/` returns zero matches | PASS |
| `grep -r "bg-popover" src/` returns zero matches | PASS |
| `grep -r "bg-accent" src/` returns zero matches | PASS |
| `grep -r "ring-ring" src/` returns zero matches | PASS |
| `button.tsx` contains `bg-primary-container text-on-primary-container` | PASS |
| `button.tsx` does NOT contain `neutral-` | PASS |
| `button.tsx` does NOT contain `dark:` | PASS |
| `sheet.tsx` contains `bg-surface` | PASS |
| `sheet.tsx` contains `ring-offset-surface` | PASS |
| `sheet.tsx` contains `focus:ring-outline` | PASS |
| `dropdown-menu.tsx` contains `bg-surface-container-highest` | PASS |
| `dropdown-menu.tsx` contains `focus:bg-surface-container-high` | PASS |
| `dropdown-menu.tsx` contains `bg-outline-variant` | PASS |
| `ReviewsSection.astro` contains `text-primary-container` | PASS |
| `Header.tsx` contains `hover:text-primary-container` | PASS |
| `directions.astro` contains `bg-primary-container text-on-primary-container` | PASS |
| `MenuSection.tsx` contains `border-outline-variant` | PASS |
| `npm run build` completes without errors | PASS |

## Known Stubs

None. All M3 token classes are fully wired through the @theme inline token system established in Plan 01. All component values flow from real CSS custom properties.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| Prerequisite | dd49054 | feat(08-01): Rewrite globals.css with complete M3 token system (cherry-pick from Plan 01) |
| Task 1 | 00a0832 | feat(08-02): Update Radix UI components from shadcn to M3 token classes |
| Task 2 | eec0491 | feat(08-02): Replace brand-* and shadcn class references with M3 tokens across all components |

## Self-Check: PASSED
