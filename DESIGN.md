# DATUM Design System

## Color Tokens

- Deep technical blue: `#071426`
- Geospatial blue: `#007EA7`
- Ice white: `#F7FAFC`
- Technical gray: `#5E6B76`
- Graphite: `#1D252C`
- Coordinate green: `#2FBF71`, used sparingly for active status and validation.

## Typography

- Display and brand emphasis: Space Grotesk, weights 600-700.
- Interface and body: IBM Plex Sans, chosen from the brandbook's technical alternative for a less generic engineering feel.
- Institutional fallback: Inter when IBM Plex Sans is unavailable.
- Body line length should stay under 75 characters.

## Layout

- Use modular grids, horizontal alignment, large technical whitespace, and restrained surfaces.
- Cards are used only for framed tools, metrics, forms, or repeated items.
- Avoid nested cards.
- Sections should feel like operational bands, not decorative stacks.

## Motion

- Interaction feedback: 120-180ms.
- State changes: 220-320ms.
- Section entrance: 500-700ms.
- Easing: quart or expo ease-out.
- Respect `prefers-reduced-motion`.

## Components

- Buttons: 8px radius, clear focus ring, no glow.
- Tabs: segmented technical controls.
- Forms: visible labels, inline validation, clear success state.
- GIS panels: grid, contours, active pins, metric readouts.

## Imagery

Use the official PNG logo without any visual edits. Other visuals should be code-native cartographic or GIS-inspired elements.
