# Phase 9: Visual Redesign — Research

**Researched:** 2026-03-26
**Domain:** Astro/React component reskinning — TailwindCSS v4, M3 token system, editorial typography, glassmorphism budget
**Confidence:** HIGH — all findings come directly from reading the live codebase, approved UI-SPEC, and locked CONTEXT decisions. No speculative external research required; this phase is a pure implementation of an already-specified design system.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Typography Scale**
- D-01: Implement typography as CSS `@utility` classes bundling font-size + line-height + letter-spacing + font-family. Components use `.text-display-lg` etc.
- D-02: Define 7 editorial scale levels: `display-lg`, `display-md`, `heading-lg`, `heading-md`, `body-lg`, `body-md`, `label-sm`
- D-03: `display-lg` = 3.5rem, Manrope, letter-spacing -0.02em — hero moments only
- D-04: Remove `@fontsource/open-sans` and `@fontsource/playfair-display` packages in this phase

**Hero Section**
- D-05: Info-rich hero layout — H1 is "Spice Grill & Bar" with cuisine type, location, hours, and phone above the fold
- D-06: Hero includes star rating badge, hero-gradient overlay, primary orange CTA "ORDER NOW" + tertiary "VIEW MENU"
- D-07: All hero text is crawlable HTML, maps to RestaurantSchema

**Home Page Section Flow**
- D-08: Story-driven flow: Hero → OurStory → Reviews → Menu → Order → Location
- D-09: Per-section personality within the Radiant Sommelier system
- D-10: Sections alternate surface depths — Hero (surface-dim + hero-gradient), OurStory (surface-container-low), Reviews (surface-dim), Menu (surface-container-low), Order (surface-dim + cta-gradient), Location (surface-container)

**Secondary Pages**
- D-11: Claude decides redesign depth per page based on current state and SEO/AEO value

**Orange Restraint (VISUAL-10)**
- D-12: Orange `#FF4B12` / `primary-container` limited to exactly 4 visual contexts:
  1. Primary CTA buttons (ORDER NOW, Start Order, Directions link)
  2. Star ratings / review scores
  3. Active navigation state in header
  4. Section accent details (gradient underlines, icon highlights, stat numbers)
- D-13: Everything outside these 4 contexts uses muted surface tones, secondary/tertiary tokens, or on-surface-variant text

**Border Removal (VISUAL-03)**
- D-14: Cards use surface-container on surface-container-low parent — separation via background color difference + 1rem vertical spacing. No borders, no shadows on cards
- D-15: Section-to-section boundaries use pure surface alternation — no dividers
- D-16: Ghost borders (outline-variant at 15% opacity) only where accessibility demands it

### Claude's Discretion
- Specific font sizes for display-md, heading-lg, heading-md, body-lg, body-md, label-sm (derive from DESIGN.md principles — already specified in UI-SPEC)
- Per-component line-height and letter-spacing values for each scale level (specified in UI-SPEC)
- How much redesign each secondary page (FAQ, Near Grand Canyon, Directions) needs
- Specific section accent detail implementations (gradient line style, icon highlight approach)
- How to handle glass utility visual updates if tuning is needed beyond Phase 8 work
- Responsive breakpoint behavior for typography scale

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VISUAL-01 | Manrope (display/headlines) + Inter (body/labels) replace Open Sans + Playfair Display across all 4 pages | D-04: remove old packages from Layout.astro; fonts already installed via Phase 7/8 |
| VISUAL-02 | Glassmorphism utilities updated per DESIGN.md — `backdrop-blur(20px-32px)`, tinted shadows, budgeted to Header/Sheet/Dropdown only | `globals.css` `.glass` utility already correct from Phase 8; need to audit card/section usage |
| VISUAL-03 | "No-Line Rule" enforced — structural borders replaced with background tonal shifts | Audit found borders in: Footer, MenuSection, ReviewsSection cards, SheetContent, directions page (7 city sections), near-grand-canyon page, faq page items |
| VISUAL-04 | Editorial typography scale applied — `display-lg` (3.5rem) for hero moments, dramatic scale shifts | Requires new `@utility` block in `globals.css` (7 classes); all heading components updated |
| VISUAL-05 | `.glass` and `.glass-card` utilities migrated to `@utility` directive syntax | Already done in Phase 8 — `globals.css` lines 251–261 use `@utility` syntax; VISUAL-05 is already satisfied |
| VISUAL-06 | Home page sections redesigned (Hero, OurStory, Reviews, Menu, Order, Location) following DESIGN.md | Hero needs complete rewrite per D-05/D-06/D-07; all other sections need token/class updates |
| VISUAL-07 | FAQ page redesigned following DESIGN.md surface hierarchy and typography | `faq.astro` uses `bg-surface` + `border border-outline-variant` on FAQ items — needs border removal + typography update |
| VISUAL-08 | Near Grand Canyon page redesigned following DESIGN.md | Uses `bg-surface` + `border border-outline-variant` throughout — full border removal + typography |
| VISUAL-09 | Directions page redesigned following DESIGN.md | Uses `bg-surface` + `border border-outline-variant` on all 7 city sections + city nav — full border removal + typography |
| VISUAL-10 | Primary orange `#FF4B12` used sparingly as "laser not floodlight" | Audit: phone number in hero gets orange; menu item prices currently `text-on-surface-variant` (not orange — correct per UI-SPEC); stat numbers get orange as accent context 4 |
</phase_requirements>

---

## Summary

Phase 9 is a **pure reskinning phase** — no new architecture, no new dependencies, no data model changes. The design system (M3 tokens, glass utilities, font variables) is fully implemented from Phase 7 and 8. This phase applies that system to every component across all 4 pages.

The work is well-specified: the approved UI-SPEC (09-UI-SPEC.md) provides pixel-level contracts for every component. The CONTEXT.md provides locked decisions (D-01 through D-16) that cannot be altered. Research consists primarily of auditing what exists vs. what the spec requires, then documenting the exact delta for each file.

**Primary recommendation:** Implement in waves organized by file scope. Wave 0: add typography `@utility` block to `globals.css` + remove old font imports. Wave 1: Hero redesign (largest change, SEO-critical). Wave 2: Home page sections (OurStory, Reviews, Menu, Order, Location, Footer). Wave 3: Secondary pages (FAQ, Near Grand Canyon, Directions). This order ensures the font system is ready before any component touches it.

---

## Standard Stack

### Core (All pre-installed — no new packages needed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `@fontsource-variable/manrope` | 5.2.8 | Manrope Variable font (display/headlines) | Installed, in use |
| `@fontsource-variable/inter` | 5.2.8 | Inter Variable font (body/labels) | Installed, in use |
| `tailwindcss` (v4) | 4.2.2 | Utility classes, `@utility` directive | Active |
| `astro` | 5.17.1 | Static site framework, `.astro` components | Active |
| `lucide-react` | existing | Icon library (Star, Quote, ShoppingBag, etc.) | Active |

### To Remove (VISUAL-01 / D-04)

| Package | Reason | Action |
|---------|--------|--------|
| `@fontsource/open-sans` | Replaced by Inter Variable | `npm uninstall @fontsource/open-sans` + remove 3 imports from Layout.astro |
| `@fontsource/playfair-display` | Replaced by Manrope Variable | `npm uninstall @fontsource/playfair-display` + remove 3 imports from Layout.astro |

### No New Packages Required

All required capabilities (fonts, tokens, glass utilities, animation) are already installed. Phase 9 is class/token changes only.

---

## Architecture Patterns

### Pattern 1: Typography `@utility` Classes (D-01/D-02/D-03)

New block to add to `globals.css` after the existing `@utility glass` block. The UI-SPEC provides the exact values:

```css
@utility text-display-lg {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
/* ... 6 more levels per UI-SPEC typography table */
```

Components then use `.text-display-lg` instead of composing `font-display text-5xl font-medium tracking-tight leading-tight` manually.

**Responsive overrides** are applied at the component level with Tailwind breakpoint variants:
- `text-display-lg` on mobile needs a separate mobile class or a `@media` override inside the utility
- Per UI-SPEC: `display-lg` = 2.25rem on mobile, 3.5rem on md+
- Implementation: define `text-display-lg` at mobile size, add `md:text-display-lg-desktop` OR use responsive modifiers at the component level: `text-[2.25rem] md:text-display-lg`

**Recommended approach:** Define `@utility text-display-lg` at desktop size (3.5rem). Apply responsive override at component level: `class="text-[2.25rem] md:text-display-lg"` on the H1. This keeps utilities simple and follows Tailwind v4 patterns.

### Pattern 2: Tonal Card Separation (D-14 — No-Line Rule)

Replace all instances of:
```html
class="bg-surface border border-outline-variant shadow-xs"
```
with:
```html
class="bg-surface-container"
```
on a parent that uses `bg-surface-container-low`. The background color difference (approximately 8–12 luminance points in dark mode) creates the visual edge without a drawn line.

### Pattern 3: Section Surface Alternation (D-10/D-15)

Home page flow matches exactly:
```
Hero                → bg-surface-dim + hero-gradient overlay
OurStory            → bg-surface-container-low
Reviews             → bg-surface-dim
Menu                → bg-surface-container-low
Order               → bg-surface-dim + cta-gradient
Location            → bg-surface-container
Footer              → bg-surface-container-low (replaces bg-surface + border-t)
Copyright bar       → bg-surface-container (tonal shift, no border-t)
```

**index.astro must also be reordered** — current order is Hero → Reviews → Menu → OurStory → Location → Order. Target order per D-08: Hero → OurStory → Reviews → Menu → Order → Location.

### Pattern 4: Font Import Cleanup (VISUAL-01 / D-04)

`Layout.astro` currently imports 6 fontsource packages. After cleanup, only 2 remain:

```typescript
// KEEP:
import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/inter/wght.css';

// REMOVE:
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/700.css';
```

### Anti-Patterns to Avoid

- **Raw Tailwind size classes for headings:** Never `text-5xl font-medium` on a heading — always a named `@utility` level
- **`backdrop-blur` on cards:** Only `.glass` on Header/Sheet/Dropdown. Remove all `backdrop-blur-sm`, `backdrop-blur-md` from non-glass surfaces (MenuSection nav wrapper, OurStory stat cards currently use `glass-card` with no blur — those are fine, just need border-removal treatment)
- **`bg-surface` as card background:** `bg-surface` is the page base color, not a card color. Cards need `bg-surface-container`
- **`border-t border-outline-variant` for section separation:** Replace with background tonal shift
- **`shadow-xs` / `shadow-lg` on content cards:** Remove from menu cards, FAQ cards, directions city sections — tonal separation replaces shadows
- **`text-primary-container` outside the 4 approved contexts:** Menu item prices per UI-SPEC use `text-primary-container` — this IS approved as accent context 1 (co-located with order action). Everything else needs audit

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Typography responsive behavior | Custom JS | CSS `@utility` + Tailwind breakpoint classes | Zero JS, standard pattern |
| Dark mode token switching | Component-level `dark:` overrides | CSS variable two-layer architecture (Phase 8) | Already implemented — trust the token system |
| Glass blur effects | Custom backdrop-filter code | `.glass` and `.glass-card` utilities in globals.css | Already tokenized with light/dark adaptive vars |
| Section gradients | Inline style gradients | `.hero-gradient` and `.cta-gradient` utilities | Already defined in globals.css |
| Font loading | Manual font-face declarations | `@fontsource-variable` package imports | Handles subsetting, FOUT prevention, WOFF2 |

---

## Complete Component Audit

This section documents the exact delta between current state and target state for every file in scope.

### globals.css

**What needs to change:**
- ADD: 7 `@utility` classes for the typography scale (the entire `text-display-lg` through `text-label-sm` block from UI-SPEC)
- VERIFY: `.glass` utility has `backdrop-filter: blur(32px)` — confirmed correct in Phase 8
- VERIFY: `.glass-card` has NO `backdrop-filter` — confirmed correct (no blur in glass-card)
- VERIFY: `.hero-gradient` and `.cta-gradient` exist — confirmed correct

**VISUAL-05 status:** Already satisfied. Both `.glass` and `.glass-card` use `@utility` syntax since Phase 8.

### Layout.astro

**What needs to change:**
- REMOVE: 6 lines of `@fontsource/open-sans` and `@fontsource/playfair-display` imports
- KEEP: Manrope Variable and Inter Variable imports

### index.astro

**What needs to change:**
- REORDER sections: current order is Hero → Reviews → Menu → OurStory → Location → Order
- Target order per D-08: Hero → OurStory → Reviews → Menu → Order → Location

### Hero.astro

**What needs to change (largest delta in the phase):**
- Complete rewrite per D-05/D-06/D-07 and UI-SPEC Hero contract
- Current H1 "The Soul of Punjab" → new H1 "Spice Grill & Bar" (SEO requirement D-07)
- Current: poetic tagline, 2 CTAs, no business info above fold
- Target: H1 business name, cuisine type, location, hours, phone, star rating badge, 2 CTAs — all crawlable HTML
- Background: `bg-surface-dim` + `.hero-gradient` (not `bg-surface`)
- EST. 2024 badge: `bg-surface-container-high/50` (keep existing)
- Remove: `<span class="text-primary-container">Punjab</span>` orange on H1 — no orange on H1

### OurStorySection.astro

**What needs to change:**
- Background: `bg-surface` → `bg-surface-container-low`
- H2: raw Tailwind classes → `.text-display-md` (+ responsive: `text-[1.875rem] md:text-display-md`)
- Body paragraphs: `.text-body-md text-on-surface-variant`
- Stat cards: `glass-card` → `bg-surface-container p-6 rounded-2xl` (no glass, no border)
- Stat numbers: `text-3xl font-bold` → `.text-heading-lg text-primary-container` (stays orange — accent context 4)
- Mission/Vision/Values cards: `glass-card` → `bg-surface-container` (no glass, no border, keep hover translate)
- Card H3: `text-xl font-semibold text-primary-container` — stays (heading-md approximation, orange is accent context 4 for "icon highlights" on cards)
- Photo caption glass overlay: `.glass` — this is a floating overlay on an image, which is on the budget boundary. Per DESIGN.md floating overlays use glass. Retain `.glass` on this specific element.

### ReviewsSection.astro

**What needs to change:**
- ADD: `bg-surface-dim` to section element (currently no background set — inherits body)
- H2: `text-4xl md:text-5xl font-bold` → `.text-heading-lg text-on-surface`
- "Guests Say" span: keep `text-primary-container` (accent context 4 — section accent detail)
- Lead paragraph: `.text-body-lg text-on-surface-variant`
- Review cards: `bg-surface-container/80 border border-outline-variant shadow-lg hover:border-primary-container/50 hover:shadow-xl` → `bg-surface-container` (no border, no shadow, no hover-border — Phase 8 decision already documents this)
- Remove: decorative blob backgrounds (`bg-primary-container/10 rounded-full blur-3xl`) — these are "standard shadows" that violate DESIGN.md Do Not rules
- Marquee gradient masks: `from-background` → `from-surface-dim` (match section background)
- Avatar gradient circles: `from-primary-container to-secondary-container` border glow — simplify to flat `bg-surface-container-high` (no glow blur)
- Source badges (Google/Yelp): keep platform colors per UI-SPEC note — these are informational, not brand accent
- Star icons: already `fill-primary-container text-primary-container` — correct

### MenuSection.tsx

**What needs to change:**
- Section outer: `bg-surface-container-lowest border-t border-outline-variant` → `bg-surface-container-low` (no border-t)
- Sticky header wrapper: `bg-surface-container-lowest` → `bg-surface-container-low`
- Section H2: raw classes → `.text-heading-lg text-on-surface`
- Mobile nav wrapper: `border border-outline-variant bg-surface-container/50 backdrop-blur-sm` → `bg-surface-container` (no border, no blur — outside glass budget)
- Mobile nav button active: `bg-surface shadow-xs border-outline-variant` → `bg-surface-container-high text-on-surface` (no border)
- Desktop sidebar nav: `.glass rounded-xl` — this IS on the glass budget as it's a floating sidebar (keep .glass). However, it's an ambient card, not Header/Sheet/Dropdown. Per VISUAL-02, glass is budgeted to Header/Sheet/Dropdown only. **Decision:** Remove `.glass` from menu sidebar, replace with `bg-surface-container-high rounded-xl` (ambient card, not floating overlay)
- Active sidebar button: `bg-primary-container text-on-primary-container` — correct (accent context 1, co-located with order action)
- Category heading: `text-2xl font-medium text-primary-container border-b border-outline-variant pb-4` → `.text-heading-md text-on-surface` (remove orange from heading, remove border-b; category name is NOT an accent context)
- Item name: `text-xl font-medium font-display` → `.text-heading-md text-on-surface`
- Item price: `text-lg font-medium text-on-surface-variant` → `.text-heading-md text-primary-container` (per UI-SPEC: price IS accent context 1)
- Item description: `text-base text-on-surface-variant` → `.text-body-md text-on-surface-variant`

### OrderSection.astro

**What needs to change:**
- Background: `bg-surface-container-low` → `bg-surface-dim` + `.cta-gradient` (per D-10)
- Remove: Unsplash background image (`bg-[url(...)]`) — not part of DESIGN.md spec
- Glass card: `.glass` retained — this is the CTA focal point container, a floating element (per UI-SPEC: "this IS a budgeted glass surface")
- H2: raw classes → `.text-display-md text-on-surface`
- Lead paragraph: `.text-body-lg text-on-surface-variant`; "Pickup" and "Curbside" in `text-primary-container` (already present)
- CTA button: AstroButton with `py-7` padding → standard height; text "Start Order" (currently correct)

### LocationSection.astro

**What needs to change:**
- Background: `bg-surface-container-low` → `bg-surface-container` (per D-10)
- H2: raw classes → `.text-heading-lg text-on-surface`
- Lead paragraph: `.text-body-md text-on-surface-variant`
- Map container: `glass-card p-2 rounded-2xl` → `bg-surface-container-high rounded-2xl` (no glass-card, no border-ish treatment — tonal lift only per UI-SPEC)

### Header.tsx

**What needs to change:**
- Logo: `text-lg tracking-tighter font-display font-semibold text-on-surface` → `.text-label-sm uppercase tracking-tighter font-semibold text-on-surface` (per UI-SPEC)
- Nav links: `text-xs font-bold font-display` → `.text-body-md text-on-surface-variant` (remove font-display and font-bold from nav; nav links use body-md not display)
- Active nav state: `text-primary-container` (accent context 3) — already present via hover class
- Desktop separator: `border-l border-outline-variant` — keep (this is a functional separator in the header, not structural layout)
- Sheet (mobile nav): `bg-surface border-l border-outline-variant` → `bg-surface-container-low` with `.glass-card` (it IS on the glass budget). Remove `border-l` — the glass utility provides the subtle inner glow instead

### Footer.astro

**What needs to change:**
- Element: `bg-surface py-16 border-t border-outline-variant` → `bg-surface-container-low py-16` (background tonal shift replaces border-t)
- Section headers: `text-on-surface text-xs font-semibold tracking-wider uppercase` → `.text-label-sm text-on-surface uppercase tracking-wider` (equivalent, just use utility class)
- Links: `.text-body-md text-on-surface-variant` with hover `text-on-surface`
- Instagram/Facebook social list item: `mt-3 pt-3 border-t border-outline-variant` → `mt-3 pt-3` (remove border-t)
- Copyright bar: `mt-16 pt-8 pb-20 md:pb-8 border-t border-outline-variant` → `bg-surface-container py-4` as its own div (tonal shift from surface-container-low parent creates the separation)

### faq.astro

**What needs to change:**
- `main` class: `bg-surface-container-lowest` → `bg-surface-container-low` (per UI-SPEC FAQ section)
- H1: raw `font-display font-bold text-4xl md:text-5xl` → `.text-display-md text-center text-on-surface`
- "Questions" span: keep `text-primary-container` (accent context 4 — section accent detail)
- FAQ item cards: `bg-surface p-8 rounded-2xl border border-outline-variant shadow-xs` → `bg-surface-container p-8 rounded-2xl` (no border, no shadow)
- Item spacing: `space-y-8` → `space-y-4` (16px gap per UI-SPEC)
- Item H3: `font-display font-semibold text-xl` → `.text-heading-md text-on-surface`
- Item answer: `text-on-surface-variant leading-relaxed font-sans` → `.text-body-md text-on-surface-variant`

### near-grand-canyon.astro

**What needs to change:**
- `main` class: `bg-surface-container-lowest` — KEEP (per UI-SPEC: `bg-surface-container-lowest min-h-screen`)
- H1: raw `font-display font-bold text-4xl md:text-5xl` → `.text-display-md text-on-surface`
- Distance span: `text-primary-container` — keep (accent context 4 — heading accent detail)
- Lead paragraphs: `text-lg leading-relaxed text-on-surface-variant` → `.text-body-lg text-on-surface-variant`
- "Why Stop Here" block: `bg-surface p-8 rounded-2xl border border-outline-variant shadow-xs` → `bg-surface-container p-8 rounded-2xl`
- Section H2s: raw `font-display font-bold text-2xl md:text-3xl` → `.text-heading-lg text-on-surface`
- Dish cards (What to Order grid): `bg-surface p-6 rounded-2xl border border-outline-variant shadow-xs` → `bg-surface-container p-6 rounded-2xl`
- Dish name: `font-display font-semibold text-on-surface` → `.text-heading-md text-on-surface`
- Price: `text-primary-container font-semibold` — keep (accent context 1, co-located with menu action)
- Plan Your Visit CTAs: primary link already uses `bg-primary-container` — keep; secondary links `border border-outline-variant` → `bg-surface-container text-on-surface hover:bg-surface-container-high` (no border per no-line rule)

### directions.astro

**What needs to change:**
- `main` class: `bg-surface-container-lowest` — KEEP (per UI-SPEC)
- H1: raw `font-display font-bold text-4xl md:text-5xl` → `.text-display-md text-on-surface`
- Exit span: `text-2xl md:text-3xl text-primary-container` → `.text-heading-lg text-primary-container` (per UI-SPEC)
- Lead paragraphs: → `.text-body-lg text-on-surface-variant`
- City nav container: `bg-surface rounded-2xl border border-outline-variant shadow-xs` → `bg-surface-container rounded-2xl` (no border, no shadow)
- City nav chips: `bg-surface-container text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container` — already correct per UI-SPEC (keep as is)
- "Jump to:" label: → `.text-label-sm text-on-surface-variant uppercase tracking-wide`
- City sections (7x): `bg-surface p-8 rounded-2xl border border-outline-variant shadow-xs` → `bg-surface-container p-8 rounded-2xl`
- Section H2s: `font-display font-bold text-2xl md:text-3xl` → `.text-heading-lg text-on-surface`
- Directions body: → `.text-body-md text-on-surface-variant`
- Address blocks: keep existing structure; phone link hover: `hover:text-primary-container` — already present
- Map embed container: `rounded-2xl overflow-hidden` — keep (no visual changes needed)
- Plan Your Visit: same treatment as near-grand-canyon (border removal on secondary links)

---

## Common Pitfalls

### Pitfall 1: Responsive Typography — @utility Classes Don't Auto-Respond

**What goes wrong:** Defining `text-display-lg` at 3.5rem and applying it to mobile — text overflows on small screens.
**Why it happens:** `@utility` classes in Tailwind v4 are single-value declarations. They do not contain media queries internally.
**How to avoid:** Apply the utility at desktop scale, add an explicit mobile override at the component level: `class="text-[2.25rem] md:text-display-lg"` on H1. The UI-SPEC specifies exactly which levels need responsive adjustment: only `display-lg` (3.5rem → 2.25rem mobile) and `display-md` (2.5rem → 1.875rem mobile).
**Warning signs:** H1 text causing horizontal scroll on 320px-375px viewport widths.

### Pitfall 2: Section Reorder Breaks Scroll Anchors

**What goes wrong:** `index.astro` sections are reordered per D-08 but anchor href values in Header.tsx navigation still point to old section IDs.
**Why it happens:** Header nav links like `#menu` and `#philosophy` are based on section `id` attributes, not position.
**How to avoid:** Check that section `id` attributes are preserved during the reorder. The `id` values don't change — only the import order in `index.astro` changes. This is safe.

### Pitfall 3: `bg-surface` vs `bg-background` Confusion

**What goes wrong:** Using `bg-background` on page wrappers or `bg-surface` on cards — these appear similar in dark mode but are distinct tokens.
**Why it happens:** In dark mode, `--surface-dim` and `--surface`/`--background` are all set to `#1f0f0b`. The review marquee fade uses `from-background` but the section background will be `bg-surface-dim` — same hex, but using the right semantic token matters for light mode (where they diverge: `--surface-dim: #f3d3cb` vs `--background: #fff8f6`).
**How to avoid:** Use `from-surface-dim` for the marquee fades (not `from-background`). Always use the semantic surface token matching the section's `bg-*` class.

### Pitfall 4: Orange Count Drift

**What goes wrong:** A developer adds an orange accent to a new element without checking the 4-context limit, causing VISUAL-10 to fail.
**Why it happens:** `text-primary-container` appears many times in the codebase and is easy to copy-paste.
**How to avoid:** The 4 approved contexts are: (1) CTA buttons, (2) star ratings, (3) active nav, (4) section accents (gradient underlines, stat numbers, heading accent spans, prices in menu/dish cards). Any other use of `text-primary-container` or `bg-primary-container` outside these contexts is a violation. Menu category headings (`text-primary-container` currently) must be changed to `text-on-surface`.

### Pitfall 5: Glass Budget Violations

**What goes wrong:** An ambient card or section gets `backdrop-blur` added during restyling, degrading Lighthouse TBT.
**Why it happens:** `.glass` is easy to apply; developers don't track the budget.
**How to avoid:** Glass with `backdrop-filter: blur(32px)` is ONLY for: Header, Sheet (mobile nav), DropdownMenu, OrderSection glass card (CTA focal point). The menu sidebar desktop nav currently uses `.glass` — this must be changed to `bg-surface-container-high`.

### Pitfall 6: Removing `border-outline-variant` Without Removing `shadow-xs`

**What goes wrong:** No-line rule is applied by removing `border` class but `shadow-xs` remains, creating a subtle box shadow that violates the "no hard boxes" rule.
**How to avoid:** When removing borders from cards, always remove both `border border-outline-variant` AND `shadow-xs` / `shadow-lg` in the same edit.

---

## Environment Availability

Step 2.6: SKIPPED — Phase 9 is pure code/CSS/markup changes. No external dependencies, CLI tools, databases, or services are required beyond the project's existing dev environment (`npm run dev`, `npm run build`).

---

## Validation Architecture

`workflow.nyquist_validation` key is absent from `.planning/config.json` — treat as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Lighthouse CI (lhci) + custom AEO audit script |
| Config file | `.lighthouserc.cjs` |
| Quick run | `npm run build && npm run test:lhci` |
| Full suite | `npm run qa` (build + lint + knip + typecheck + AEO + lhci) |
| AEO audit | `npm run test:aeo` |

### Phase Requirements — Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| VISUAL-01 | Manrope/Inter fonts load, no Open Sans/Playfair in rendered output | manual + build check | `npm run build` — check dist for fontsource import artifacts | Verify CSS does not reference open-sans/playfair paths |
| VISUAL-02 | Glassmorphism only on Header/Sheet/Dropdown | manual visual | `npm run dev` — inspect in DevTools, check for backdrop-filter outside 3 elements | |
| VISUAL-03 | No visible borders between sections or on cards | manual visual | `npm run dev` — visual scan all 4 pages, light + dark mode | DevTools: search for `border-outline-variant` class in rendered DOM |
| VISUAL-04 | `display-lg` = 3.5rem on md+, 2.25rem on mobile | manual visual + CSS verify | `npm run build` — check globals.css for @utility block | Open DevTools on Hero H1, confirm computed font-size |
| VISUAL-05 | `.glass` and `.glass-card` use `@utility` directive | static code check | Already satisfied — `grep '@utility glass' src/styles/globals.css` | Pre-confirmed in research |
| VISUAL-06 | All home sections match DESIGN.md surface hierarchy | manual visual | `npm run dev` — visual scan home page light + dark | Compare against UI-SPEC section flow diagram |
| VISUAL-07 | FAQ page matches DESIGN.md | manual visual | `npm run dev /faq/` | No border-outline-variant on FAQ items |
| VISUAL-08 | Near Grand Canyon page matches DESIGN.md | manual visual | `npm run dev /near-grand-canyon/` | No bg-surface + border pattern |
| VISUAL-09 | Directions page matches DESIGN.md | manual visual | `npm run dev /directions/` | No bg-surface + border pattern |
| VISUAL-10 | Orange in ≤ 4 visual contexts | manual visual audit | `npm run dev` — count orange elements on any page | Use DevTools color picker |
| Success-1 | Hero H1 at display-lg scale, no orange text on H1 | manual visual | `npm run dev` — inspect Hero section | H1 must be text-on-surface only |
| Success-5 | Header glass uses warm-tinted blur; ambient cards use bg only | manual visual | Scroll-triggered glass on Header; inspect all card elements | |

### Lighthouse CI Thresholds (from CLAUDE.md — must not regress)

| Metric | Threshold |
|--------|-----------|
| LCP | < 4000ms |
| TBT | < 600ms |
| CLS | < 0.1 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 80 |
| SEO | ≥ 90 |

**Glass budget enforcement directly affects TBT.** Each `backdrop-filter: blur(32px)` layer adds GPU compositing cost. Keeping glass to exactly 3 elements (Header, Sheet, Dropdown) protects TBT headroom.

### Wave 0 Gaps

- [ ] No automated test files exist for visual regression — this phase relies on manual visual verification + Lighthouse CI
- [ ] Lighthouse CI will catch accessibility regressions (heading hierarchy, contrast ratios) automatically
- [ ] `npm run test:aeo` will catch SEO regressions (crawlable hero content, H1 presence)

---

## State of the Art (Relevant to Phase)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.mjs` color config | `@theme inline` CSS-native config | Phase 7/8 | Token changes in globals.css only — no config file edits |
| `@layer utilities` | `@utility` directive | TailwindCSS v4 | All custom utilities use `@utility` syntax |
| `dark:` class variants | `@custom-variant dark` + CSS vars | Phase 7/8 | Zero `dark:` prefixes needed on individual components |
| Static font-size classes | Named `@utility` scale classes | Phase 9 (this phase) | D-01 — all headings use semantic scale names |
| `font-serif` for headings | `font-display` (Manrope Variable) | Phase 8 | TOKEN-04 already complete |

---

## Open Questions

1. **OrderSection background image (Unsplash)**
   - What we know: Current `OrderSection.astro` uses `bg-[url('https://images.unsplash.com/...')]` at 10% opacity
   - What's unclear: Whether to keep it as a subtle texture or remove it entirely
   - Recommendation: Remove — the `.cta-gradient` overlay is the intended background treatment per D-10. An external Unsplash URL also adds a network request and potential CLS. Remove for LCP/performance safety.

2. **OurStory photo caption glass overlay**
   - What we know: `<div class="glass p-4 rounded-xl">` inside the image overlay
   - What's unclear: Whether this counts as a "floating overlay" on the glass budget or is an ambient card
   - Recommendation: **Retain** — DESIGN.md explicitly lists "floating overlays" as appropriate glass use cases. This overlay floats on top of an image, which is the canonical use case. Budget remains: Header + Sheet + Dropdown + OrderSection glass card + OurStory image overlay caption = 5 instances. DESIGN.md and CONTEXT.md list only 3 component categories, but image overlays are a different pattern from ambient content cards.

3. **Menu sidebar nav glass removal**
   - What we know: Currently uses `.glass` class
   - What's unclear: UI-SPEC says glass is budgeted to "Header/Sheet/Dropdown only" but the sidebar is a sticky navigation overlay
   - Recommendation: Replace `.glass` with `bg-surface-container-high rounded-xl` — it is a content-level element, not a UI chrome overlay. This is the conservative/safe choice that matches the UI-SPEC letter.

---

## Project Constraints (from CLAUDE.md)

All CLAUDE.md directives that the planner must verify compliance with:

| Directive | Implication for Phase 9 |
|-----------|------------------------|
| Astro components for static content, React for interactive | Hero/OurStory/Reviews/Order/Location/Footer remain `.astro`; MenuSection/Header remain `.tsx` |
| No new pages in this phase | Confirmed in REQUIREMENTS.md Out of Scope |
| Schema components must reflect any hours/contact info changes | Hero redesign changes how hours/phone are displayed in HTML — RestaurantSchema already has canonical data; no schema change needed |
| Conventional commits enforced (commitlint) | All commits must use `feat:`, `fix:`, `refactor:`, etc. |
| Pre-push hook runs `npm run qa` | Full build + lint + test must pass before push |
| LCP < 4000ms, TBT < 600ms, CLS < 0.1 | Glass budget enforcement + image optimization in Hero |
| Accessibility ≥ 90 | Focus rings must be preserved on all interactive elements; heading hierarchy must be maintained |
| SEO ≥ 90 | H1 must remain present on every page; crawlable content must not be replaced with images |
| `PUBLIC_GOOGLE_MAPS_API_KEY` required | No change — GoogleMap component unchanged |

---

## Sources

### Primary (HIGH confidence)

All findings are derived from direct codebase inspection:

- `src/styles/globals.css` — Token system, glass utilities, gradient utilities (Phase 8 complete)
- `src/layouts/Layout.astro` — Font imports (confirmed 6 fontsource imports, 2 to remove)
- `src/pages/index.astro` — Section order (confirmed reorder needed)
- `src/components/Hero.astro` — Current hero (complete rewrite required)
- `src/components/OurStory Section.astro` — glass-card usage, bg-surface
- `src/components/ReviewsSection.astro` — border-outline-variant on cards, bg-background in fades
- `src/components/MenuSection.tsx` — border-t, glass sidebar, border on mobile nav
- `src/components/OrderSection.astro` — bg-surface-container-low (needs bg-surface-dim + cta-gradient)
- `src/components/LocationSection.astro` — glass-card on map container
- `src/components/Footer.astro` — border-t on both footer and copyright bar
- `src/components/Header.tsx` — logo typography, nav typography, SheetContent border-l
- `src/pages/faq.astro` — bg-surface + border on FAQ items, raw typography
- `src/pages/near-grand-canyon.astro` — bg-surface + border on all cards
- `src/pages/directions.astro` — bg-surface + border on 7 city sections + nav container
- `.planning/phases/09-visual-redesign/09-UI-SPEC.md` — Component-level visual contracts (approved 2026-03-26)
- `.planning/phases/09-visual-redesign/09-CONTEXT.md` — Locked decisions D-01 through D-16
- `docs/DESIGN.md` — Radiant Sommelier design system specification
- `package.json` — Confirmed `@fontsource/open-sans` and `@fontsource/playfair-display` present at 5.2.x

---

## Metadata

**Confidence breakdown:**
- Component audit: HIGH — direct code inspection of every file in scope
- Typography implementation: HIGH — pattern established by TailwindCSS v4 `@utility` directive (Phase 7 precedent)
- Glass budget decisions: HIGH — explicit budget list in UI-SPEC + CONTEXT
- Orange restraint audit: HIGH — 4 contexts defined in D-12/D-13, cross-checked against UI-SPEC
- Responsive typography approach: MEDIUM — `@utility` at single value + component-level responsive override is the standard pattern but not tested in this codebase yet

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (30-day window; this is stable implementation work)
