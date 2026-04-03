# Design System Specification: The Radiant Sommelier

## 1. Overview & Creative North Star

**Creative North Star: "The Luminous Decanter"**

This design system moves away from static, boxed layouts toward a high-end editorial experience that feels fluid, curated, and pressurized. We are building a "Digital Sommelier"—an interface that possesses the authority of a wine expert and the precision of a luxury timepiece.

By utilizing the energetic `#FF4B12` seed, we transition from the "dusty" reds of the past to a "glowing" orange that feels like light passing through a rare vintage. We break the "template" look through **intentional asymmetry**, where large Display typography anchors the layout, and content flows across layered glass surfaces. The goal is a "pressure-cooked" aesthetic: high-contrast, dense information balanced by expansive breathing room.

---

## 2. Colors

Our palette is rooted in deep, obsidian tones (`surface: #1f0f0b`) contrasted against the high-octane vibrance of our primary orange.

- **Primary Core:** Use `primary_container (#ff5626)` for critical brand moments. This color represents the "soul" of the interface.
- **The "No-Line" Rule:** Under no circumstances are 1px solid borders to be used for sectioning or layout containment. Boundaries must be defined strictly through background shifts. For instance, a `surface_container_low` section sitting on a `surface` background creates a structural edge without the "cheapness" of a drawn line.
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers of smoked glass.
- **Level 0 (Base):** `surface_dim (#1f0f0b)`
- **Level 1 (Sectioning):** `surface_container_low (#281713)`
- **Level 2 (Active Cards):** `surface_container (#2d1b17)`
- **Level 3 (Floating Elements):** `surface_bright (#49342f)`
- **The "Glass & Gradient" Rule:** For primary CTAs and hero backgrounds, use a barely-there warm gradient implemented via `color-mix` — not full-saturation token values. The `cta-gradient` utility blends `primary_container` at 20% and `inverse_primary` at 10% with `transparent` at 135deg, layered over `bg-surface-dim`. This produces a faint ember warmth rather than a vivid orange band. Full-saturation gradients are prohibited — they overpower the tonal hierarchy.
- **Signature Textures:** Apply a `backdrop-filter: blur(20px)` to any surface using `surface_variant` at 60% opacity to achieve the signature "Digital Sommelier" glass effect.

---

## 3. Typography

We use a dual-font strategy to balance character with legibility.

- **Display & Headlines (Manrope):** These are our "Voice" tokens. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. The geometric nature of Manrope provides a modern, architectural feel.
- **Body & Labels (Inter):** These are our "Utility" tokens. Inter provides maximum readability at small scales. Use `body-md` for standard descriptions and `label-sm` for technical data (like vintage years or alcohol percentages).
- **Editorial Hierarchy:** Do not be afraid of massive scale shifts. Placing a `display-md` headline next to a `label-md` caption creates a high-end, magazine-style tension that feels intentional rather than accidental.

---

## 4. Elevation & Depth

In this system, depth is not an effect—it is the architecture.

- **The Layering Principle:** Achieve lift through tonal shifts. A `surface_container_highest` element placed on a `surface_container` background provides enough contrast to signify importance without visual clutter.
- **Ambient Shadows:** If a floating state is required (e.g., a dropdown), use a custom shadow: `0px 24px 48px rgba(25, 10, 7, 0.4)`. The shadow must be tinted with the `surface_container_lowest` color to ensure it feels like a natural occlusion of light, not a gray smudge.
- **The "Ghost Border" Fallback:** If accessibility demands a border, use the `outline_variant` token at 15% opacity. It should feel like a suggestion of an edge, not a hard stop.
- **Glassmorphism:** All floating overlays must use a combination of `surface_container_high` (at 70% opacity), `backdrop-blur: 32px`, and a 0.5px "inner glow" stroke using `outline_variant` at 20% opacity.

---

## 5. Components

### Buttons

- **Primary:** High-saturation `primary_container` with `on_primary_container` text. Use `rounded-md` (0.75rem).
- **Tertiary:** Transparent background with `primary` colored text. Use these for low-emphasis actions to prevent the "orange overwhelm."

### Chips (The "Sommelier" Tags)

- Use `surface_container_highest` for the container and `on_surface_variant` for the text.
- **Interaction:** On hover, the chip should transition to `secondary_container` with a subtle 2px vertical lift.

### Input Fields

- Background: `surface_container_lowest`.
- Bottom Indicator: Instead of a full border, use a 2px bottom-only accent in `outline_variant` that expands to `primary` on focus.

### Cards & Lists

- **Strict Rule:** No dividers. Separate list items using `spacing-3` (1rem) of vertical whitespace.
- **The Nested Card:** A card should use `surface_container_low`. Internal elements (like a "Buy" section) should use `surface_container_high` to create a "recessed" or "elevated" sub-zone.

### Tooltips

- Use `inverse_surface` with `inverse_on_surface` text. These should feel like high-contrast "pop-outs" against the dark theme.

---

## 6. Do's and Don'ts

### Do:

- **Embrace Negative Space:** Use `spacing-12` and `spacing-16` to let large headlines breathe.
- **Use Asymmetry:** Place a small label far to the right of a large headline to create a "premium" editorial grid.
- **Color as Signal:** Use the `#FF4B12` primary color sparingly. It is a laser, not a floodlight.

### Don't:

- **No "Pure" Grays:** Never use `#888888`. Always use the tinted tokens (like `outline` or `on_surface_variant`) to maintain the warm, "spice" undertone of the system.
- **No Hard Boxes:** Avoid the "Stripe/SaaS" look. We are not a dashboard; we are a curated experience.
- **No High-Opacity Borders:** If you can see the border clearly from a distance, it is too thick. Lower the opacity until it "felt" rather than "seen."
- **No Standard Shadows:** Never use `rgba(0,0,0,0.5)`. Shadows must always be tinted with our deep brown `surface_container_lowest`.

---

**Director's Note:** Every pixel should feel like a choice. If an element doesn't have a reason to be there, remove it. If a color doesn't serve the "Digital Sommelier" narrative, mute it.
