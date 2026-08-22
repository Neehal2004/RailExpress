# DESIGN SYSTEM — RailExpress (Heritage + Modern Product Design)

<!-- Taste Skill & Impeccable Design Token Specification -->

## Concept: "INK + PAPER + SIGNAL + BRASS"

An iconic railway reservation system redesigned for the modern web — combining physical railway timetables, station signage, printed ticket geometry, and brass hardware with high-density, production-grade digital utility.

---

## 🎨 Color Tokens (Strict Heritage Palette)

### Core Brand & Surfaces
- `--color-paper`: `#F5F0E6` (Warm Ivory background canvas)
- `--color-surface`: `#EAE3D2` (Structured panel surface fill)
- `--color-card`: `#FFFFFF` (Pure White ticket/paper card inset)
- `--color-charcoal`: `#202321` (Deep Charcoal structural headers, navbars, timetable heads)
- `--color-charcoal-hover`: `#2E3330` (Charcoal container hover)
- `--color-signal-red`: `#B52A2A` (Signal Red primary actions & brand badges)
- `--color-signal-red-hover`: `#8F1D1D` (Signal Red hover state)
- `--color-brass`: `#B08A45` (Brass Gold secondary accents & rules)
- `--color-brass-light`: `#D4AF67` (Brass hover & active borders)

### Typography & Border Tokens
- `--color-text-dark`: `#141715` (Primary crisp dark text)
- `--color-text-charcoal`: `#202321` (Secondary header text)
- `--color-text-muted`: `#6E6A63` (Captions, dates, timetable labels)
- `--color-text-light`: `#F5F0E6` (Text on dark charcoal surfaces)
- `--color-border`: `#D6CDBC` (Subtle fine paper rule)
- `--color-border-dark`: `#202321` (Strong structural border)

### Railway Status System
- `--color-confirmed-bg`: `#E6F4EA` | `--color-confirmed-text`: `#137333` | `--color-confirmed-border`: `#CEEAD6`
- `--color-rac-bg`: `#FEF7E0` | `--color-rac-text`: `#B08A45` | `--color-rac-border`: `#FCE8B2`
- `--color-cancelled-bg`: `#FCE8E6` | `--color-cancelled-text`: `#B52A2A` | `--color-cancelled-border`: `#FAD2CF`

---

## 📐 Shape & Geometry Rules

- **Corner Radii**: Clean, subtle radii only (`4px` default, `6px` max). No pill-shaped cards or giant rounded shapes.
- **Borders & Rules**: 1px crisp rules (`1px solid #D6CDBC`) with optional double-line borders (`border-bottom: 3px double #202321`) for timetable headers.
- **Shadows**: Minimal flat paper shadows (`box-shadow: 0 1px 3px rgba(32, 35, 33, 0.08)`). Zero glowing ambient blurs or ambient color drop-shadows.
- **Glassmorphism & Gradients**: **STRICTLY BANNED**. All backgrounds are solid `#F5F0E6`, `#EAE3D2`, `#FFFFFF`, or `#202321`.

---

## 🔤 Typography System

- **Primary Headings**: `Outfit` / `Inter` (Bold, structured, uppercase station codes & titles).
- **Body & Timetables**: `Inter` (Compact, high-scannability, tabular figures for times and fares).
- **Monospace Code & PNRs**: `ui-monospace`, `Consolas` (10-digit PNRs, train numbers `#12952`, seat numbers `B1-24`).
