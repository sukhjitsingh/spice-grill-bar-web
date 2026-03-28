# Phase 9: Visual Redesign - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-26
**Phase:** 09-visual-redesign
**Areas discussed:** Typography scale & hierarchy, Section-by-section redesign approach, Orange restraint strategy, Border removal & tonal separation

---

## Typography Scale & Hierarchy

### Q1: How should the typography scale be implemented?

| Option | Description | Selected |
|--------|-------------|----------|
| CSS utility classes (Recommended) | Define @utility classes like .text-display-lg that bundle font-size + line-height + letter-spacing + font-family | ✓ |
| Tailwind theme extension | Add to @theme as fontSize entries, font-family applied separately | |
| You decide | Claude picks best approach | |

**User's choice:** CSS utility classes (Recommended)
**Notes:** None

### Q2: How many typography scale levels?

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal (4 levels) | display-lg, heading-md, body-md, label-sm | |
| Full editorial (7 levels) | display-lg, display-md, heading-lg, heading-md, body-lg, body-md, label-sm | ✓ |
| You decide | Claude picks based on page needs | |

**User's choice:** Full editorial (7 levels)
**Notes:** None

### Q3: Remove old font packages?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, remove in Phase 9 (Recommended) | Remove @fontsource/open-sans and @fontsource/playfair-display | ✓ |
| Keep until Phase 10 QA | Defer removal as safety net | |

**User's choice:** Yes, remove in Phase 9

---

## Section-by-Section Redesign Approach

### Q1: Uniform treatment or per-section personality?

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform foundation + key moments | Same system, Hero and Order get special treatment | |
| Per-section personality | Each section has its own visual character | ✓ |
| You decide | Claude picks based on DESIGN.md | |

**User's choice:** Per-section personality

### Q2: Hero section layout (with ASCII previews)

| Option | Description | Selected |
|--------|-------------|----------|
| Info-rich hero (Recommended) | H1 = business name, cuisine, location, hours, phone above fold. Best for SEO/AEO | ✓ |
| Cinematic with SEO subtitle | Full-viewport dramatic, tagline as H1, info in subtitle | |
| Editorial asymmetric | Headline left, info offset right, complex grid | |

**User's choice:** Info-rich hero (Recommended)
**Notes:** User emphasized SEO/AEO/GEO priority — design must serve discoverability and customer acquisition

### Q3: Home page section flow

| Option | Description | Selected |
|--------|-------------|----------|
| Story-driven flow (Recommended) | Hero → OurStory → Reviews → Menu → Order → Location with surface alternation | ✓ |
| Conversion-optimized flow | Hero → Menu → Reviews → Order → OurStory → Location | |

**User's choice:** Story-driven flow (Recommended)

### Q4: Secondary pages redesign effort

| Option | Description | Selected |
|--------|-------------|----------|
| Full Sommelier treatment | Every page gets same level of redesign | |
| Consistent but lighter touch | Apply tokens but keep layouts mostly unchanged | |
| You decide per page | Claude assesses each page individually | ✓ |

**User's choice:** You decide per page

---

## Orange Restraint Strategy

### Q1: Which 4 contexts get primary orange? (multi-select)

| Option | Description | Selected |
|--------|-------------|----------|
| Primary CTA buttons | ORDER NOW, View Menu — conversion drivers | ✓ |
| Star ratings / review scores | Orange stars, rating badges — social proof | ✓ |
| Active navigation state | Current section indicator in header | ✓ |
| Section accent details | Gradient lines under headings, icon highlights | ✓ |

**User's choice:** All 4 selected — full orange budget allocated
**Notes:** Everything outside these 4 uses muted surface tones

---

## Border Removal & Tonal Separation

### Q1: Card/item boundaries without borders (with ASCII previews)

| Option | Description | Selected |
|--------|-------------|----------|
| Tonal background + spacing (Recommended) | surface-container on surface-container-low parent, 1rem spacing, no borders/shadows | ✓ |
| Tonal bg + ghost border | Same + outline-variant at 15% opacity ghost border | |
| You decide per component | Claude assesses each component | |

**User's choice:** Tonal background + spacing (Recommended)

### Q2: Section-to-section boundaries (with ASCII previews)

| Option | Description | Selected |
|--------|-------------|----------|
| Pure surface alternation (Recommended) | Background color change IS the boundary, no dividers | ✓ |
| Gradient blend between sections | Subtle CSS gradient (4-6rem) blending between surface tones | |

**User's choice:** Pure surface alternation (Recommended)

---

## Claude's Discretion

- Specific font sizes for non-display typography levels
- Per-component line-height and letter-spacing values
- How much redesign each secondary page needs
- Section accent detail implementations
- Glass utility visual tuning
- Responsive breakpoint behavior

## Deferred Ideas

None — discussion stayed within phase scope
