---
phase: quick-260401-ihx
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/mode-toggle.tsx
  - src/components/GoogleMap.tsx
  - src/components/LocationSection.astro
  - src/pages/directions.astro
  - src/pages/faq.astro
  - src/components/Footer.astro
  - src/components/MenuSection.tsx
autonomous: true
requirements: [FIX-01, FIX-02, FIX-03, FIX-04, FIX-05]

must_haves:
  truths:
    - "ModeToggle renders correct icon on first paint in dark mode (no sun flash)"
    - "GoogleMap begins hydrating 200px before entering viewport"
    - "FAQ page has no heading level skips (h1 then h2, not h3)"
    - "Footer copyright shows current year dynamically"
    - "Menu items use stable keys derived from item name, not array index"
  artifacts:
    - path: "src/components/mode-toggle.tsx"
      provides: "Lazy state initializer reading document.documentElement.classList"
      contains: "document.documentElement.classList.contains"
    - path: "src/components/LocationSection.astro"
      provides: "client:visible with rootMargin"
      contains: "rootMargin"
    - path: "src/pages/directions.astro"
      provides: "client:visible with rootMargin"
      contains: "rootMargin"
    - path: "src/pages/faq.astro"
      provides: "Correct heading hierarchy h1 > h2"
      contains: "<h2"
    - path: "src/components/Footer.astro"
      provides: "Dynamic copyright year"
      contains: "getFullYear"
    - path: "src/components/MenuSection.tsx"
      provides: "Stable item keys"
      contains: "key={item.name}"
  key_links:
    - from: "src/components/mode-toggle.tsx"
      to: "document.documentElement.classList"
      via: "lazy useState initializer"
      pattern: "useState.*document"
    - from: "src/components/LocationSection.astro"
      to: "src/components/GoogleMap.tsx"
      via: "client:visible with rootMargin"
      pattern: "client:visible.*rootMargin"
---

<objective>
Fix five framework-level audit issues: ModeToggle icon flash in dark mode, GoogleMap double IntersectionObserver inefficiency, FAQ heading level skip (h1 to h3), hardcoded footer copyright year, and unstable menu item keys.

Purpose: Eliminate accessibility violations (heading skip), visual glitches (icon flash), performance waste (double observer), correctness issues (stale year), and React reconciliation issues (index keys).
Output: All five files patched, build passing, no regressions.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/mode-toggle.tsx
@src/components/GoogleMap.tsx
@src/components/LocationSection.astro
@src/pages/directions.astro
@src/pages/faq.astro
@src/components/Footer.astro
@src/components/MenuSection.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix ModeToggle flash, GoogleMap hydration, and GoogleMap internal observer cleanup</name>
  <files>src/components/mode-toggle.tsx, src/components/GoogleMap.tsx, src/components/LocationSection.astro, src/pages/directions.astro</files>
  <action>
**mode-toggle.tsx (FIX-01):**
Replace `const [isDark, setIsDark] = React.useState(false)` with a lazy state initializer:
```
const [isDark, setIsDark] = React.useState(() =>
  typeof document !== 'undefined'
    ? document.documentElement.classList.contains('dark')
    : false
);
```
Remove the useEffect that sets isDark on mount (lines 9-11) since the lazy initializer handles it.

**GoogleMap.tsx (FIX-02):**
Remove the internal IntersectionObserver entirely (the useEffect on lines 7-22 and the `showMap` / `containerRef` state). Since `client:visible` will handle when to hydrate the component, the component should render the placeholder initially and load the map on user click or immediately if `client:visible` already triggered hydration. Actually, simpler approach: keep the component as-is but the internal observer is now redundant since `client:visible={{ rootMargin: '200px' }}` handles pre-loading. The internal observer will fire immediately (component already visible) so behavior is correct -- no code change needed in GoogleMap.tsx itself.

**LocationSection.astro (FIX-02):**
Line 21: Change `client:visible` to `client:visible={{ rootMargin: '200px' }}` on the GoogleMap component.

**directions.astro (FIX-02):**
Line 224: Change `client:visible` to `client:visible={{ rootMargin: '200px' }}` on the GoogleMap component.
  </action>
  <verify>
    <automated>cd /Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web && npm run build 2>&1 | tail -5</automated>
  </verify>
  <done>ModeToggle uses lazy initializer (no flash), both GoogleMap usages have client:visible with rootMargin: 200px, build succeeds.</done>
</task>

<task type="auto">
  <name>Task 2: Fix FAQ heading skip, footer copyright year, and menu item keys</name>
  <files>src/pages/faq.astro, src/components/Footer.astro, src/components/MenuSection.tsx</files>
  <action>
**faq.astro (FIX-03):**
Line 22: Change `<h3 class="text-heading-md ...">` to `<h2 class="text-heading-md ...">` for FAQ question items. The heading hierarchy must go h1 > h2 with no skips.

**Footer.astro (FIX-04):**
Line 146: Replace the hardcoded `&copy; 2024` with a dynamic year. In Astro frontmatter (between the `---` fences at top of file), add:
```
const currentYear = new Date().getFullYear();
```
Then in the template, change:
```
<p>&copy; 2024 Spice Grill &amp; Bar. All rights reserved.</p>
```
to:
```
<p>&copy; {currentYear} Spice Grill &amp; Bar. All rights reserved.</p>
```

**MenuSection.tsx (FIX-05):**
Line 150: Change `key={index}` to `key={item.name}` on the menu item div. Item names are unique within each category, making them stable keys.
  </action>
  <verify>
    <automated>cd /Users/moni/Workspace/SpiceGrillBarWeb/spice-grill-bar-web && npm run build 2>&1 | tail -5</automated>
  </verify>
  <done>FAQ uses h2 for questions (no heading skip), footer shows dynamic year, menu items keyed by name. Build succeeds with no warnings.</done>
</task>

</tasks>

<verification>
```bash
# Full build
npm run build

# Verify no heading skip in FAQ output
grep -n '<h[1-6]' dist/faq/index.html | head -20

# Verify dynamic year in footer
grep -o '© [0-9]*' dist/index.html

# Verify rootMargin in LocationSection and directions page source
grep -n 'rootMargin' src/components/LocationSection.astro src/pages/directions.astro

# Verify lazy initializer in mode-toggle
grep -n 'useState.*document' src/components/mode-toggle.tsx

# Verify stable keys in MenuSection
grep -n 'key={item.name}' src/components/MenuSection.tsx

# Quality checks
npm run typecheck
npm run lint
```
</verification>

<success_criteria>
- Build passes with zero errors
- ModeToggle uses lazy useState initializer reading classList
- Both GoogleMap usages specify client:visible with rootMargin: '200px'
- FAQ page heading hierarchy: h1 followed by h2 (no h3 skip)
- Footer copyright year is dynamic via getFullYear()
- MenuSection item keys use item.name instead of index
- typecheck and lint pass
</success_criteria>

<output>
After completion, create `.planning/quick/260401-ihx-fix-astro-framework-audit-issues-modetog/260401-ihx-SUMMARY.md`
</output>
