---
phase: quick-260401-rmp
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/styles/globals.css
autonomous: true
requirements: [QUICK-RMP]

must_haves:
  truths:
    - "Order section gradient reads as a barely-there warm hint, not a vivid orange band"
    - "Light mode shows a faint warm tint over bg-surface-dim"
    - "Dark mode shows a faint ember glow over bg-surface-dim"
  artifacts:
    - path: "src/styles/globals.css"
      provides: "Toned-down cta-gradient utility"
      contains: "color-mix"
  key_links:
    - from: "src/components/OrderSection.astro"
      to: "src/styles/globals.css"
      via: "cta-gradient utility class"
      pattern: "cta-gradient"
---

<objective>
Tone down the `cta-gradient` utility so the Order section background reads as a subtle ~20% warm hint instead of a vivid full-saturation orange gradient. Both light and dark modes should show barely-there warmth over the `bg-surface-dim` base.

Purpose: The current gradient is too visually dominant, competing with content and breaking the M3 tonal separation philosophy.
Output: Updated `cta-gradient` utility in globals.css using `color-mix` approach.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/styles/globals.css
@src/components/OrderSection.astro

<interfaces>
<!-- Current cta-gradient at line 294 of globals.css -->
```css
@utility cta-gradient {
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--inverse-primary) 100%);
}
```

<!-- Reference pattern: hero-gradient at line 286 -->
```css
@utility hero-gradient {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--primary-container) 15%, transparent) 0%,
    transparent 60%
  );
}
```

<!-- OrderSection uses: class="py-32 bg-surface-dim cta-gradient relative ..." -->
<!-- cta-gradient is ONLY used by OrderSection.astro — safe to modify directly -->
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Reduce cta-gradient to ~20% subtle warm hint using color-mix</name>
  <files>src/styles/globals.css</files>
  <action>
Replace the `cta-gradient` utility (line 294-296 in globals.css) with a color-mix approach that creates a barely-there warm tint. Follow the `hero-gradient` pattern as reference.

Change from:
```css
@utility cta-gradient {
  background: linear-gradient(135deg, var(--primary-container) 0%, var(--inverse-primary) 100%);
}
```

Change to a subtle version using `color-mix(in srgb, ...)` with ~20% opacity for the start color and ~10% for the end color, blending into transparent so the underlying `bg-surface-dim` shows through. Keep the 135deg angle.

Target:
```css
@utility cta-gradient {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--primary-container) 20%, transparent) 0%,
    color-mix(in srgb, var(--inverse-primary) 10%, transparent) 100%
  );
}
```

The exact percentages (start ~20%, end ~10%) can be adjusted slightly if needed, but must stay in the "barely-there" range (15-25% max). The gradient should be a faint warm overlay, not a visible color band.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -5</automated>
  </verify>
  <done>The cta-gradient utility uses color-mix with ~20% or less opacity, build passes without errors</done>
</task>

</tasks>

<verification>
- `npm run build` completes without errors
- Grep `cta-gradient` in globals.css confirms `color-mix` is used
- Visual check: Order section shows subtle warm tint, not vivid orange
</verification>

<success_criteria>
- The cta-gradient utility uses color-mix approach with ~20% intensity
- Build passes cleanly
- No other components affected (cta-gradient only used by OrderSection)
</success_criteria>

<output>
After completion, create `.planning/quick/260401-rmp-restore-order-section-background-image-f/260401-rmp-SUMMARY.md`
</output>
