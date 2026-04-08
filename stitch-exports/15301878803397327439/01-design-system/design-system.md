# Design System Document: The Artisanal Hearth

## 1. Overview & Creative North Star
**Creative North Star: "The Modern Agrarian"**

This design system moves away from the sterile, high-speed aesthetic of typical food delivery apps. Instead, it leans into a "High-End Editorial" experience that mirrors the slow, intentional process of home-cooked meals. We break the "template" look by utilizing intentional asymmetry, generous whitespace, and a "paper-on-paper" layering technique. By avoiding harsh grids and standard borders, we create a digital space that feels as warm and inviting as a sun-drenched kitchen.

## 2. Colors & Tonal Depth
Our palette is rooted in the earth. It uses deep forest greens to signal health and soft terracotta to evoke the warmth of a tiffin container.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts. For instance, a `surface-container-low` section should sit directly against a `surface` background to define its territory.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine, organic papers. 
- Use `surface` as your base "tabletop."
- Use `surface-container-low` for large content blocks.
- Use `surface-container-highest` or `surface-container-lowest` for nested cards to create depth without shadows.

### The "Glass & Gradient" Rule
To elevate the "Artisanal" feel, use Glassmorphism for floating navigation bars or "Quick Add" overlays. Use `surface` with a 70% opacity and a `20px` backdrop blur. 
**Signature Textures:** Apply a subtle linear gradient from `primary` (#37563b) to `primary-container` (#4f6f52) on main Call-to-Actions to give them a three-dimensional, "organic" soul.

## 3. Typography
The type scale balances the authoritative beauty of a serif with the functional clarity of a modern sans-serif.

| Level | Font Family | Size | Intent |
| :--- | :--- | :--- | :--- |
| **Display-lg** | Noto Serif | 3.5rem | Hero moments; editorial storytelling. |
| **Headline-md** | Noto Serif | 1.75rem | Section headers; artisanal dish names. |
| **Title-lg** | Plus Jakarta Sans | 1.375rem | Card titles; navigation anchors. |
| **Body-lg** | Plus Jakarta Sans | 1rem | Main descriptions; high readability. |
| **Label-md** | Plus Jakarta Sans | 0.75rem | Nutritional badges; metadata. |

**Creative Note:** Use `Noto Serif` for all brand-heavy moments. The "friendly serif" should feel like a masthead of a boutique food magazine.

## 4. Elevation & Depth
We eschew heavy "material" shadows in favor of **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` background creates a natural lift that feels sophisticated and tactile.
- **Ambient Shadows:** If a floating element (like a WhatsApp button) requires a shadow, use a highly diffused blur (32px+) at 6% opacity. Use a tint of `on-surface` (#1c1c19) rather than pure black.
- **The "Ghost Border":** If a boundary is required for accessibility in input fields, use the `outline-variant` token at 20% opacity. Never use 100% opaque borders.

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), white text, `xl` (1.5rem) rounded corners.
- **Secondary:** `secondary` (#934a2e) text on `secondary-fixed` (#ffdbcf) background. No border.
- **Tertiary:** `primary` text, no background, `label-md` uppercase with 0.05em tracking.

### Food Cards & Nutritional Badges
- **Cards:** Forbid divider lines. Use `vertical white space` (24px - 32px) to separate elements. Use `surface-container-high` for the card background.
- **Nutritional Badges:** Use `tertiary-container` (#5e6d33) with `on-tertiary-container` text. Apply `full` (9999px) roundness to create "pill" shapes that feel like organic pebbles.

### WhatsApp Contact Section
- **The Floating Action:** A glassmorphic circle using `primary` at 90% opacity with a white icon.
- **The Contextual Bar:** A `surface-container-lowest` banner at the bottom of the screen with a `secondary` terracotta accent line (2px) at the very top to draw the eye.

### Input Fields
- Use `surface-variant` for the background fill. Soften the top-left and top-right corners with `md` (0.75rem) and keep the bottom flat to imply the field is "resting" on the page.

## 6. Do's and Don'ts

### Do:
- **Asymmetric Layouts:** Place food photography slightly off-center, overlapping with `headline-lg` text to create an editorial feel.
- **Macro Photography:** Use high-resolution, warm-toned images of ingredients. The design system relies on the "Texture" of the food to provide visual interest.
- **Negative Space:** Allow sections to breathe. Use at least 80px of vertical padding between major homepage sections.

### Don't:
- **No Harsh Lines:** Never use pure black (#000000) or high-contrast 1px dividers.
- **No Rigid Grids:** Avoid the "three-column-box" look. Vary the widths of your containers to make the page feel curated, not generated.
- **No Standard Icons:** Use thin-stroke, custom-drawn icons that match the "Artisanal" weight of Noto Serif.