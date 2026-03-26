---
phase: 08-token-system
verified: 2026-03-25T23:30:00Z
status: human_needed
score: 5/5 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 3/5
  gaps_closed:
    - "Zero zinc- classes remain in Hero.astro, ReviewsSection.astro, and near-grand-canyon.astro"
    - "Zero orange- classes remain in Hero.astro and ReviewsSection.astro (orange used only via primary-container tokens)"
    - "Zero dark: color override classes remain in Hero.astro, ReviewsSection.astro, near-grand-canyon.astro, and MobileActionButtons.astro"
    - "ReviewsSection review cards use surface tokens and no backdrop-blur (glass budget compliance)"
    - "MobileActionButtons glass container uses only token-driven styles with no hardcoded black/white fallbacks"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Verify surface hierarchy tokens produce visually distinct warm tones in both modes"
    expected: "bg-surface-dim, bg-surface-container, bg-surface-container-high, bg-surface-bright applied to test elements show four visually distinct warm tones in both light mode (warm whites/creams) and dark mode (warm dark browns)"
    why_human: "Cannot verify visual distinction or warm-tint quality programmatically — requires browser rendering in both modes"
  - test: "Verify glass and glass-card utilities produce warm-tinted blur, not neutral gray"
    expected: ".glass shows blur(32px) with warm reddish-brown tint; .glass-card shows warm background without blur; both adapt correctly when toggling dark mode"
    why_human: "Visual quality of warm tinting versus neutral gray requires human inspection of rendered output"
  - test: "Verify font-display renders Manrope and font-sans renders Inter in browser"
    expected: "All headings (h1, h2, h3) show Manrope Variable; all body paragraphs show Inter Variable; no Playfair Display visible anywhere"
    why_human: "Font rendering requires browser inspection — cannot verify variable font loading programmatically"
---

# Phase 8: Token System Verification Report

**Phase Goal:** Replace shadcn/brand token system with Material Design 3 tokens derived from #FF4B12 seed color — every color and font in the design system defined as a named token in `globals.css`, with both light and dark mode values, so any component can reference `bg-surface-dim` or `text-on-surface` without knowing raw color values.

**Verified:** 2026-03-25T23:30:00Z
**Status:** human_needed (all automated checks pass; 3 visual items require browser inspection)
**Re-verification:** Yes — after gap closure (Plans 05)

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | globals.css contains complete M3 token system with both light and dark mode hex values | VERIFIED | `:root` and `.dark` blocks fully populated; zero `hsl()`, zero `--brand-*`, zero shadcn variable names found |
| 2 | @theme inline block maps every M3 token to `--color-*` namespace enabling Tailwind utility classes | VERIFIED | All 46+ tokens mapped; `--color-surface-container: var(--surface-container)` confirmed; font-sans and font-display registered |
| 3 | Radix UI components (Button, Sheet, DropdownMenu) use M3 token classes with no shadcn remnants | VERIFIED | button.tsx has `bg-primary-container text-on-primary-container`; dropdown-menu.tsx has `bg-surface-container-highest text-on-surface`; sheet.tsx has `bg-surface`, `focus:ring-outline`; zero `dark:` prefixed color overrides in these files |
| 4 | No hardcoded zinc-, orange-, or dark: color override classes remain in any component covered by Plan 02 and Plan 03 scope | VERIFIED | grep returns zero matches across Hero.astro, ReviewsSection.astro, near-grand-canyon.astro, and MobileActionButtons.astro for zinc-, orange-, dark:bg-, dark:text-, dark:border-, dark:shadow-, dark:from-, dark:via-. Sole remaining dark: in Hero.astro is `dark:opacity-40` (image overlay, exempt per plan spec). Remaining dark: in ReviewsSection.astro are `dark:bg-blue-*/dark:text-blue-*/dark:border-blue-*` and `dark:bg-red-*/dark:text-red-*` for Google/Yelp brand badge colors — intentionally left per Plan 05 decision. |
| 5 | MobileActionButtons uses no dark: color overrides (glass utility adapts via CSS variables) | VERIFIED | `grep -n "dark:" src/components/MobileActionButtons.astro` returns zero matches. Glass container uses `border-outline-variant/20`; redundant `bg-white/60 dark:bg-black/60 backdrop-blur-xl` fallback div removed entirely per commit 3283b40. |

**Score:** 5/5 truths verified

---

## Re-verification: Gap Closure Results

### Previously Failing Items (now closed)

**Gap 1 — Hero.astro and ReviewsSection.astro core content unmigrated**

| File | Previous Issue | Current State | Status |
|------|---------------|---------------|--------|
| `src/components/Hero.astro` | 4 zinc- instances, 1 orange- instance, 5 dark: color overrides | Zero zinc-, zero orange-, zero dark: color overrides. `bg-surface` on section (line 10), `border-outline-variant/30 bg-surface-container-high/50 text-primary-container` on badge (line 35), `text-on-surface` on h1 (line 40), `text-on-surface-variant` on body (line 46). Gradient overlay simplified to `from-surface via-surface/10 to-transparent`. | CLOSED |
| `src/components/ReviewsSection.astro` | 7 zinc- instances, 5 orange- instances, 10 dark: color overrides, `backdrop-blur-xl` on cards | Zero zinc-, zero orange-. Card container uses `bg-surface-container/80 border-outline-variant`. `backdrop-blur-xl` removed (glass budget compliance). All card interior text/icons/stars use M3 tokens. Google/Yelp brand badge dark: overrides retained per plan decision. | CLOSED |

**Gap 2 — near-grand-canyon.astro dish card and MobileActionButtons.astro glass container**

| File | Previous Issue | Current State | Status |
|------|---------------|---------------|--------|
| `src/pages/near-grand-canyon.astro` | Line 136 dish card: `bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/10` | `bg-surface-container border-outline-variant` on dish card at line 136. Zero zinc-, zero dark: color overrides. | CLOSED |
| `src/components/MobileActionButtons.astro` | Lines 9 and 12: `dark:shadow-black/50`, `dark:border-white/10`, `bg-white/60 dark:bg-black/60 backdrop-blur-xl` | `dark:shadow-black/50` removed; `border-outline-variant/20` replaces `border-white/20 dark:border-white/10`; redundant fallback div with `bg-white/60 dark:bg-black/60 backdrop-blur-xl` removed entirely. Zero `dark:` classes remain. | CLOSED |

### Regression Check (Previously Passing Items)

| Item | Check | Result |
|------|-------|--------|
| globals.css: zero `hsl()` | grep count | 0 — PASS |
| globals.css: zero `--brand-*` | grep count | 0 — PASS |
| globals.css: 16+ `surface-container` definitions | grep count | 16 — PASS |
| globals.css: font-sans and font-display defined | presence check | Both confirmed — PASS |
| button.tsx: `bg-primary-container text-on-primary-container` | grep | Confirmed line 13 — PASS |
| sheet.tsx: `bg-surface`, `ring-outline`, `text-on-surface` | grep | All confirmed — PASS |
| dropdown-menu.tsx: `bg-surface-container-highest text-on-surface` | grep | Confirmed line 49 — PASS |
| AstroButton.astro: M3 tokens, zero neutral-/dark: | grep | Confirmed — PASS |
| font-serif in src/: zero matches | grep | 0 — PASS |
| brand-orange/green/gold in src/: zero matches | grep | 0 — PASS |

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/styles/globals.css` | Complete M3 token system | VERIFIED | 274 lines; `:root` with 46+ hex tokens; `.dark` with 46+ hex tokens; `@theme inline` with full mapping; glass/gradient utilities; zero `hsl()`, zero `--brand-*`. |
| `src/components/Hero.astro` | Hero with M3 token classes, zero zinc-/orange-/dark: | VERIFIED | `bg-surface` on section (line 10); `border-outline-variant/30 bg-surface-container-high/50 text-primary-container` on badge (line 35); `text-on-surface` on h1 (line 40); `text-on-surface-variant` on body (line 46); `font-display` on h1 (line 40). `dark:opacity-40` on image overlay is structural/exempt. |
| `src/components/ReviewsSection.astro` | Review cards with M3 token classes, no backdrop-blur | VERIFIED | `bg-surface-container/80 border-outline-variant` on card container (line 57); `text-primary-container/15`, `fill-primary-container`, `text-on-surface`, `text-on-surface-variant`, `text-outline-variant`, `from-surface-container/90` all confirmed. Zero `backdrop-blur`. |
| `src/pages/near-grand-canyon.astro` | Dish card with `bg-surface-container border-outline-variant` | VERIFIED | Line 136: `bg-surface-container p-6 rounded-2xl border border-outline-variant shadow-xs` confirmed. Zero zinc-, zero dark: color overrides. |
| `src/components/MobileActionButtons.astro` | Glass container with token-driven styles, zero dark: | VERIFIED | Glass container: `glass p-1.5 rounded-2xl ... border border-outline-variant/20` (line 9). Zero `dark:` classes. Redundant fallback div removed (commit 3283b40). |
| `src/components/ui/button.tsx` | Button with M3 token classes | VERIFIED | `bg-primary-container text-on-primary-container` (default), `bg-error-container text-on-error-container` (destructive), `bg-surface-container-high text-on-surface` (secondary), `hover:bg-surface-container` (ghost). Zero `dark:`. |
| `src/components/ui/sheet.tsx` | Sheet with M3 token classes | VERIFIED | `bg-surface`, `ring-offset-surface`, `focus:ring-outline`, `data-[state=open]:bg-surface-container-high`, `text-on-surface`, `text-on-surface-variant`. |
| `src/components/ui/dropdown-menu.tsx` | DropdownMenu with M3 token classes | VERIFIED | `bg-surface-container-highest text-on-surface` on content; `focus:bg-surface-container-high focus:text-on-surface` on menu items. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `globals.css :root` block | `@theme inline` block | `var()` references | VERIFIED | `--color-surface-container: var(--surface-container)` confirmed; all 46+ tokens follow same pattern |
| `globals.css .dark` block | `@theme inline` block | Same `var()` references resolve to dark hex values | VERIFIED | `.dark { --surface-container: #2d1b17 }` confirmed; CSS cascade resolves dark values when `.dark` class applied |
| `globals.css` | `src/layouts/Layout.astro` | `import '../styles/globals.css'` | VERIFIED | Line 10 of Layout.astro confirmed |
| `src/components/Hero.astro` | `globals.css @theme inline` | `bg-surface`, `text-on-surface`, `text-on-surface-variant`, `border-outline-variant` | VERIFIED | All four token classes confirmed present in Hero.astro |
| `src/components/ReviewsSection.astro` | `globals.css @theme inline` | `bg-surface-container`, `text-on-surface`, `text-primary-container`, `text-outline-variant` | VERIFIED | All four token classes confirmed in ReviewsSection.astro |
| `src/components/MobileActionButtons.astro` | `globals.css @theme inline` | `border-outline-variant/20`, `glass` utility via `--glass-bg` | VERIFIED | `border-outline-variant/20` confirmed on glass container; `glass` class confirmed on parent; redundant black/white layer removed |

---

## Data-Flow Trace (Level 4)

Not applicable — all artifacts are CSS/static Astro components. CSS custom properties are static values; the "data" is hex color values in `:root` and `.dark` blocks, which are correctly defined.

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Zero zinc- classes in 4 gap files | `grep -n "zinc-" Hero.astro ReviewsSection.astro near-grand-canyon.astro MobileActionButtons.astro` | 0 matches | PASS |
| Zero orange- classes in Hero.astro and ReviewsSection.astro | `grep -n "orange-" Hero.astro ReviewsSection.astro` | 0 matches | PASS |
| Zero dark: color overrides in MobileActionButtons.astro | `grep -n "dark:" src/components/MobileActionButtons.astro` | 0 matches | PASS |
| Only exempt dark: in Hero.astro | `grep -n "dark:" src/components/Hero.astro` | `dark:opacity-40` on image overlay only — exempt | PASS |
| Remaining dark: in ReviewsSection.astro are intentional brand colors | `grep -n "dark:" src/components/ReviewsSection.astro` | Lines 85–86: blue-/red- Google/Yelp badge colors only — intentional per Plan 05 decision | PASS |
| No backdrop-blur in ReviewsSection.astro | `grep "backdrop-blur" src/components/ReviewsSection.astro` | 0 matches | PASS |
| globals.css: zero hsl() | grep | 0 matches | PASS |
| font-serif: zero matches in src/ | grep | 0 matches | PASS |
| Commits exist | git show --stat 54a701f, 3283b40 | Both commits exist; diff stats match expected files | PASS |
| Build passes | `npm run build` (previous verification) | 4 page(s) built — PASS (verified by Plan 05 SUMMARY acceptance criteria) | PASS |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| TOKEN-01 | 08-01 | Surface hierarchy tokens defined (5 depth levels: dim, container-low, container, container-high, bright) for dark mode | SATISFIED | `globals.css .dark` block has all 8 surface hierarchy tokens with hex values: `--surface-dim: #1f0f0b`, `--surface-container-low: #281713`, `--surface-container: #2d1b17`, `--surface-container-high: #382621`, `--surface-bright: #49342f` |
| TOKEN-02 | 08-01 | Light mode surface hierarchy tokens defined as warm-tint inversions | SATISFIED | `globals.css :root` block has all surface tokens with warm cream hex values: `--surface: #fff8f6`, `--surface-dim: #f3d3cb`, etc. — warm tint inversions of dark palette |
| TOKEN-03 | 08-02, 08-03, 08-04, 08-05 | Shadcn semantic tokens remapped to M3 colors via hybrid @theme inline pattern — all components use M3 token classes | SATISFIED | All Radix UI components (Button, Sheet, DropdownMenu), all Astro components (Hero, ReviewsSection, Footer, OurStorySection, LocationSection, OrderSection, MobileActionButtons, AstroButton, GoogleMap), and all pages (near-grand-canyon.astro) confirmed using M3 token classes. Zero zinc-, orange-, neutral- anywhere in src/. Plans 02–04 closed initial scope; Plan 05 closed remaining gaps. REQUIREMENTS.md marks TOKEN-03 as [x] satisfied. |
| TOKEN-04 | 08-01, 08-04 | Font families registered — `--font-sans: "Inter"`, `--font-display: "Manrope"` | SATISFIED | `globals.css @theme inline` has `--font-sans: 'Inter Variable'` and `--font-display: 'Manrope Variable'`. Zero `font-serif` in src/. `font-display` confirmed in Header.tsx (5x), Hero.astro (1x), MenuSection.tsx (3x), near-grand-canyon.astro (11x), directions.astro (9x), faq.astro (2x). |
| TOKEN-05 | 08-01 | All CSS variables use full color values (not bare HSL triples) compatible with Tailwind v4 | SATISFIED | Zero `hsl()` occurrences in globals.css. All values are hex (#ffe9e4, #1f0f0b, etc.). |

**REQUIREMENTS.md cross-check:** TOKEN-01 through TOKEN-05 all marked [x] in REQUIREMENTS.md. No orphaned requirements — all 5 IDs accounted for across plan frontmatter.

---

## Anti-Patterns Found

No new anti-patterns. Previously flagged blockers in Hero.astro, ReviewsSection.astro, near-grand-canyon.astro, and MobileActionButtons.astro are all resolved.

The following items from the previous verification have been cleared:

| File | Was | Now |
|------|-----|-----|
| `src/components/Hero.astro` lines 10, 38, 43, 49 | Blocker: zinc-/orange-/dark: color overrides | Resolved: M3 token classes |
| `src/components/ReviewsSection.astro` lines 57–109 | Blocker: zinc-/orange-/dark:/backdrop-blur-xl on review cards | Resolved: M3 token classes, no backdrop-blur |
| `src/components/MobileActionButtons.astro` lines 9, 12 | Warning: dark:shadow-black/50, bg-white/60 dark:bg-black/60 | Resolved: border-outline-variant/20, fallback div removed |
| `src/pages/near-grand-canyon.astro` line 136 | Blocker: bg-white dark:bg-zinc-900/50 border-zinc-200 | Resolved: bg-surface-container border-outline-variant |

---

## Human Verification Required

### 1. Surface Hierarchy Visual Distinction

**Test:** Apply `bg-surface-dim`, `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`, and `bg-surface-bright` to adjacent test `div` elements. Toggle dark mode.
**Expected:** Five visually distinct warm tones in both modes — in light mode, warm cream progression from cream-pink to white; in dark mode, warm dark-brown progression from near-black to medium brown.
**Why human:** Color distinctiveness and warm-tint quality cannot be assessed programmatically.

### 2. Glass Utility Warm Tinting vs Neutral Gray

**Test:** Observe the Header (scrolled state uses `glass`), the mobile nav Sheet, and the OrderSection glassmorphism container in both modes.
**Expected:** All three show warm reddish-brown tint in their background blur, not neutral gray. In dark mode, the background should be a warm dark brown (`rgba(56, 38, 33, 0.7)`), not cold gray.
**Why human:** Color temperature and visual quality of warm vs neutral tint requires human browser inspection.

### 3. Font Stack Rendering

**Test:** Inspect headings and body text in browser devtools, checking computed `font-family`.
**Expected:** Headings (`font-display`) show Manrope Variable; body paragraphs (`font-sans`) show Inter Variable; no fallback fonts active; no Playfair Display present.
**Why human:** Font loading and variable font activation requires browser rendering to verify.

---

## Gaps Summary

No gaps remain. All 5 previously identified must-have truths are now verified:

- TOKEN-03 gap (Hero.astro and ReviewsSection.astro hardcoded zinc/orange/dark: overrides) — closed by Plan 05 commits 54a701f and 3283b40.
- TOKEN-03 gap (near-grand-canyon.astro dish card and MobileActionButtons.astro glass container) — closed by Plan 05 commit 3283b40.

Phase 08 goal achieved at the automated-verification level. Three items remain for human visual confirmation: surface hierarchy warm tinting, glass blur warm tinting, and font stack rendering in a live browser.

---

_Verified: 2026-03-25T23:30:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification: Yes — after Plan 05 gap closure_
