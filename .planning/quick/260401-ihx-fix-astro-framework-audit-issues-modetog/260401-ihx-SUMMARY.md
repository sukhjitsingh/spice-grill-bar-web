---
phase: quick-260401-ihx
plan: 01
subsystem: components
tags: [bugfix, accessibility, performance, react, astro]
dependency_graph:
  requires: []
  provides: [FIX-01, FIX-02, FIX-03, FIX-04, FIX-05]
  affects: [src/components/mode-toggle.tsx, src/components/GoogleMap.tsx, src/components/LocationSection.astro, src/pages/directions.astro, src/pages/faq.astro, src/components/Footer.astro, src/components/MenuSection.tsx]
tech_stack:
  added: []
  patterns: [lazy-useState-initializer, client-visible-rootMargin, dynamic-template-expressions]
key_files:
  created: []
  modified:
    - src/components/mode-toggle.tsx
    - src/components/LocationSection.astro
    - src/pages/directions.astro
    - src/pages/faq.astro
    - src/components/Footer.astro
    - src/components/MenuSection.tsx
decisions:
  - Removed mount-useEffect from ModeToggle in favor of lazy useState initializer to eliminate sun icon flash on dark-mode first paint
  - GoogleMap internal IntersectionObserver retained (no change) — client:visible rootMargin handles pre-loading; internal observer fires immediately and is harmless
metrics:
  duration: "4 minutes"
  completed: "2026-04-01"
  tasks_completed: 2
  files_modified: 6
---

# Quick Task 260401-ihx: Fix Astro Framework Audit Issues Summary

**One-liner:** Five targeted fixes — ModeToggle lazy initializer (no dark-mode flash), GoogleMap rootMargin pre-hydration, FAQ h1>h2 heading hierarchy, dynamic copyright year via getFullYear(), and stable React menu keys by item name.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | Fix ModeToggle flash and GoogleMap double observer | 0cc58e1 |
| 2 | Fix FAQ heading skip, footer year, and menu item keys | edf1d31 |

## Changes Made

### FIX-01: ModeToggle icon flash on dark-mode first paint

**File:** `src/components/mode-toggle.tsx`

Replaced the two-step `useState(false)` + `useEffect(() => setIsDark(...), [])` pattern with a single lazy useState initializer:

```tsx
const [isDark, setIsDark] = React.useState(() =>
  typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false
);
```

The previous pattern caused a sun icon flash on dark-mode first paint because the component hydrated with `false` for one render cycle before the effect ran. The lazy initializer reads the correct class on first render.

### FIX-02: GoogleMap double IntersectionObserver inefficiency

**Files:** `src/components/LocationSection.astro`, `src/pages/directions.astro`

Added `rootMargin: '200px'` to both `client:visible` directives:

```astro
<GoogleMap apiKey={API_KEY} client:visible={{ rootMargin: '200px' }} />
```

Astro's `client:visible` now pre-hydrates the component 200px before the viewport — matching the internal observer's intent. No change to `GoogleMap.tsx` was needed; the internal observer fires immediately after hydration (component is already visible) and disconnects cleanly.

### FIX-03: FAQ heading level skip (h1 to h3)

**File:** `src/pages/faq.astro`

Changed FAQ question headings from `<h3>` to `<h2>`. The page has one `<h1>` ("Frequently Asked Questions") and now correctly follows with `<h2>` per question — no heading level skip, fixing the accessibility violation.

### FIX-04: Hardcoded footer copyright year

**File:** `src/components/Footer.astro`

Added `const currentYear = new Date().getFullYear();` to the Astro frontmatter and replaced the hardcoded `&copy; 2024` with `&copy; {currentYear}`. The built output now shows 2026 and will auto-update each build year.

### FIX-05: Unstable React menu item keys

**File:** `src/components/MenuSection.tsx`

Changed `key={index}` to `key={item.name}` on menu item divs. Item names are unique within each category, providing stable keys that survive reordering and prevent unnecessary React reconciliation.

## Verification Results

- Build: passed (4 pages, zero errors)
- Typecheck: 0 errors, 0 warnings
- Lint: clean
- FAQ heading hierarchy: h1 > h2 confirmed in dist/faq/index.html
- Footer year: 2026 confirmed in dist/index.html
- rootMargin: present in both GoogleMap usages
- Lazy initializer: document.documentElement.classList.contains confirmed
- Stable keys: key={item.name} confirmed

## Deviations from Plan

None - plan executed exactly as written. (Note: plan correctly anticipated no GoogleMap.tsx changes needed for FIX-02, only the Astro component call sites required the rootMargin addition.)

## Known Stubs

None.

## Self-Check: PASSED

- src/components/mode-toggle.tsx: modified (lazy initializer, removed useEffect)
- src/components/LocationSection.astro: modified (rootMargin added)
- src/pages/directions.astro: modified (rootMargin added)
- src/pages/faq.astro: modified (h3 -> h2)
- src/components/Footer.astro: modified (dynamic year)
- src/components/MenuSection.tsx: modified (key={item.name})
- Commit 0cc58e1: FOUND
- Commit edf1d31: FOUND
