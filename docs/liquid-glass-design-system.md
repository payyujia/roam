# Roam Liquid Glass Design System — Blue Edition (v6)

The editable, standalone component sheet is [docs/sticker-sheet.html](./sticker-sheet.html). It replaces the old pink/teal/yellow specimen as the design-review reference. This **sticker sheet is a design proposal**; app runtime styles are deliberately not changed until the components are approved.

## Palette and typography

| Token | Value | Usage |
| --- | --- | --- |
| Primary | `#4792E6` | The single brand/accent colour, highlighted buttons and active states |
| Deep blue | `#2478D2` | High-contrast active text and accents |
| Soft blue | `#DCEBFD` | Blue-only inactive/done stepper tones |
| Canvas | `#EDF4FC` | Cool, soft near-white surroundings |
| Ink | `#0F1118` | Strongest text, dark button faces |
| Glass | `rgba(255,255,255,.45)` | **Shared** low-opacity white across passive card variants |
| Text secondary | `#58677C` | Captions and supporting copy |
| Success | `#168365` | Semantic status only |
| Error | `#B33E44` | Semantic status/error only |

No lilac or rose accent tokens. Type system: **Plus Jakarta Sans** (display 36/800, section 23/800, title 17/700, body 14/500, caption 12/500, eyebrow 10/800).

## Glass materials

**Cards, rows, input fields, chat bubbles and panels use the same low-opacity white surface**: `rgba(255,255,255,.45)`, a translucent white border and restrained blur. Status variants should not change the card background. Convey state using status icons, dots, or labels instead.

**Do not place diagonal beams, specular streaks or centre-glow effects across card interiors.**

## Button material: diagonal rim, dimensional centre

Large action/icon button baseline is **66×66px** with **34px radius**. The dark button follows the supplied layered-black blend:
```css
background: linear-gradient(0deg,#0F0F0F,#0F0F0F),
  linear-gradient(0deg,rgba(51,51,51,.45),rgba(51,51,51,.45)),
  rgba(153,153,153,.3);
background-blend-mode:plus-lighter,luminosity,darken;
backdrop-filter:blur(6px);
border-radius:34px;
```
Combine with directional inset/exterior shadows. The **132° specular highlight is constrained to a thin rim** via `::before` and `mask-composite:exclude`, not a radial white highlight in the centre of the button. Blue `#4792E6`, dark `#0F0F0F`, and clear-white glass are button *face* variants; their dimensional rim treatment stays consistent.

## Interaction and selection

- Stepper: active step uses solid primary blue, completed/future stages use subtle blue; **no green, pink, grey-black or other accent in the stepper**.
- Segmented controls: translucent-white track, subtle blue selected pill; no black underline.
- Filter chips: identical translucent-white fill in every state; a blue edge and label show selection.
- Toggle: primary-blue track on, muted neutral translucent track off, white sliding thumb.
- Statuses: semantic dots and copy, not card background variation.
- Focus: retain visible keyboard focus indicators; do not rely only on hover.

## Components on the sheet

1. Colour tokens and shared surface sample.
2. Typography samples at the intended scale.
3. Filter chips, removable tags, and status indicators.
4. Raised circular buttons and pill buttons, including disabled and icon-only variations.
5. Text inputs, dates, budget, friends, and switches.
6. Blue-only stepper, segmented control, checkboxes.
7. Task cards, including different states on the same glass background.
8. Trip cards and member avatars.
9. Navigation and floating primary action.
10. Toast, chat messages, and a menu panel.

The HTML contains editable CSS, an inline SVG icon library and small interactive selection demos. It is responsive; view it directly in a browser. The legacy `docs/sticker-sheet-v5.html` remains available for historical comparison.
