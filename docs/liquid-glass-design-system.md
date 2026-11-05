# Roam Liquid Glass Design System

This is the shared visual system for Roam's existing component library. It is implemented in `css/liquid-glass.css`, loaded after the legacy stylesheets so the same component builders and interaction classes continue to work.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| Primary | `#4792E6` | Active navigation, primary actions, selection, route accents |
| Secondary | `#FDD8C7` | Warm aura highlights and restrained decorative warmth |
| Ink | `#171D29` | Main text and dark navigation |
| Canvas | `#F3F7FD` | Cool, near-white page foundation |

## Surface recipe

Use `glass-surface` for new cards and panels, and `glass-control` for compact controls. The surface combines a low-opacity white fill, saturated background blur, a thin diagonal white-to-blue border highlight, and a very soft inset/exterior shadow. Existing components such as `.feat`, `.tile`, `.ban`, `.srow`, `.fcard`, `.pc2`, and map sheets are mapped to the same surface recipe.

Do not create a different solid card color for each category. Keep meaning in labels, text, icons, and data rather than card fills. Photos and full-bleed reel media remain media, not card surfaces.

## Headers

Top-level `.hd` hero headers share one 208px geometry and a curved lower edge. Their aura blends the primary blue with a small amount of secondary peach. The status bar remains legible above the glass. Trip-detail `.th` uses the same finish while preserving its existing content layout.

## Navigation and icons

The existing five-slot tab layout, raised centre action, hit areas, and placement are preserved. The rail is black; the selected state uses the primary blue. Interface icons are outline-only, including the centre action icon.

## Component rules

- Primary action: blue, white label, pill geometry.
- Secondary action: translucent glass with ink label.
- Selected controls: a subtle primary-blue tint and border.
- Passive cards and grouped rows: shared neutral glass; no per-category color fills.
- Keep the existing spacing, content order, breakpoints, and interaction hooks.
- Do not add presentation state or change JavaScript logic for visual work.
