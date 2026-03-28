# Quick Task: Preserve Hero Section Tagline and Subtitle

**Researched:** 2026-03-28
**Domain:** Hero section content — `src/components/Hero.astro`
**Confidence:** HIGH

## Summary

The user wants to restore three specific strings to the hero section that were removed during the Phase 09 redesign (commit `f1a09e5`). The current hero shows a factual info-rich layout ("Spice Grill & Bar" as h1, cuisine/address/hours/phone/ratings). The desired text was last live in commit `54a701f` (Phase 08 token migration).

**Primary recommendation:** Edit `src/components/Hero.astro` to restore the three content strings into the existing structure, aligning with the current M3 token design system.

---

## Finding: What the User Wants

| Element | Desired Text |
|---------|-------------|
| Heading (h1) | `The Soul of Punjab` |
| Subtitle | `Where the rich traditions of Punjabi cooking meet the history of Route 66 right here in Ash Fork, AZ.` |
| Feature highlight | `Authentic spices, clay oven cooking, and modern elegance.` |

---

## Finding: Current State (post Phase 09)

File: `src/components/Hero.astro` (current HEAD)

The h1 currently reads: **"Spice Grill & Bar"**

There is no subtitle or feature highlight text. The current layout shows:
- EST. 2024 badge
- h1: "Spice Grill & Bar"
- "Authentic Punjabi Cuisine · Ash Fork, AZ · Route 66"
- Hours
- Phone number
- 4.8-star rating block
- CTA buttons (ORDER NOW / VIEW MENU)

---

## Finding: Original Implementation (commit 54a701f)

The original hero used this structure:

```astro
<h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-on-surface leading-tight mb-6">
  The Soul of{' '}
  <span class="text-primary-container">Punjab</span>
</h1>
<p class="text-lg md:text-xl text-on-surface-variant font-normal max-w-2xl mx-auto leading-relaxed mb-10">
  Where the rich traditions of Punjabi cooking meet the history of Route 66 right here in Ash
  Fork, AZ.
  <br />
  Authentic spices, clay oven cooking, and modern elegance.
</p>
```

Note: "Punjab" was accented with `text-primary-container` (orange). The subtitle and feature highlight were a single `<p>` separated by a `<br />`.

---

## Implementation Approach

The planner should restore the desired content while preserving the current layout's SEO additions (address, hours, phone, ratings). Two options:

**Option A — Replace h1 only, keep SEO content below.**
Swap "Spice Grill & Bar" for "The Soul of Punjab" (with Punjab in `text-primary-container`), add the subtitle `<p>` immediately after, keep the existing address/hours/phone/rating block beneath.

**Option B — Full restore of pre-Phase-09 layout.**
Remove SEO info block entirely and use the Phase 08 structure. Risk: loses phone/hours/rating signals in hero.

**Recommendation: Option A.** The user asked to preserve/restore specific text, not to revert the full redesign. Restoring the heading and adding the subtitle `<p>` before the factual block gives both the emotional tagline and the SEO-dense content.

---

## Design System Compliance

From CLAUDE.md:
- Typography: `font-display` (Manrope Variable) for headings — use `text-display-lg` utility or explicit `font-display` classes
- Orange budget: `text-primary-container` on "Punjab" accent is fine (nav hover / CTA / star ratings / accent detail — 4 slots)
- The current h1 uses `text-[2.25rem] md:text-display-lg` — keep consistent or use the full `font-display` large sizing from the original (the original `text-5xl md:text-7xl lg:text-8xl` was replaced in Phase 09 with the smaller size)
- Subtitle uses `text-body-lg text-on-surface-variant` or `text-on-surface-variant` per M3 tokens

---

## Files to Change

| File | Change |
|------|--------|
| `src/components/Hero.astro` | Replace h1 content; add subtitle paragraph |

No schema changes needed — `RestaurantSchema.astro` uses structured data from constants, not hero copy.

---

## Sources

- `git show 54a701f:src/components/Hero.astro` — original content (HIGH confidence)
- `src/components/Hero.astro` HEAD — current state (HIGH confidence)
- `git log --oneline src/components/Hero.astro` — change history (HIGH confidence)
