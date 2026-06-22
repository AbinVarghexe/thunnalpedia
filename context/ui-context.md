# THUNNAL UI Context & Design Tokens

This document details the color palette, typography scales, layout specs, and interactive patterns implemented via **Tailwind CSS** and custom stylesheets.

---

## 1. Color Palette System

Colors are defined as CSS variables in `globals.css` and mapped to Tailwind configurations. We use refined, high-end HSL palettes to ensure accessibility and smooth transitions.

| Role | CSS Variable | HSL Token Value | Description |
| :--- | :--- | :--- | :--- |
| **Canvas Base** | `--color-bg-primary` | `hsl(60, 20%, 99%)` | Soft, warm off-white light mode canvas |
| **Canvas Base (Dark)** | `--color-bg-primary-dark`| `hsl(60, 5%, 6%)` | Deep near-black background |
| **Canvas Secondary** | `--color-bg-secondary` | `hsl(60, 10%, 95%)` | Card backgrounds and alternative layouts |
| **Text Primary** | `--color-text-primary` | `hsl(60, 5%, 10%)` | Dark charcoal for high contrast headings |
| **Text Secondary** | `--color-text-secondary`| `hsl(60, 4%, 41%)` | Subtitles, details, and metadata |
| **Accent Gold** | `--color-accent-gold` | `hsl(35, 38%, 64%)` | Interactive highlights and custom states |
| **Borders** | `--color-border` | `hsl(60, 8%, 90%)` | Minimalist layout dividers |

*Note: Tailwinds configurations map utility classes (e.g. `bg-primary`, `text-primary`, `border-divider`, `text-accent`) directly to these CSS variables.*

---

## 2. Typography Specs

Our typography balances high-fashion editorial headers with geometric, legible functional interfaces.

- **Primary Headings**: *Syne* or *Playfair Display* (loaded via Google Fonts)
  - Applied using class `font-display`. Used on Hero titles, Collection names, and Promo highlights.
- **Body & Controls**: *Outfit* or *Inter* (loaded via Google Fonts)
  - Applied using class `font-sans`. Used on description paragraphs, pricing tags, cart items, buttons, and navigation menus.

---

## 3. Structural Components & Layouts

### A. The "Hour" Countdown Banner
- Fixed at the top of the viewport.
- Uses monospace styling for the digital numbers (`font-mono`) to prevent layout shift during countdown changes.

### B. The Horizontal Product Scroll
- **Container Styling**:
  - `display: flex;`
  - `overflow-x: auto;`
  - `scroll-snap-type: x mandatory;`
  - `-webkit-overflow-scrolling: touch;`
- **Product Card Transitions**:
  - Inner image containers set to `relative overflow-hidden`.
  - Primary image uses a smooth transition on hover: `group-hover:opacity-0 group-hover:scale-105 duration-500 ease-out`.
  - Secondary image displays as an absolute overlay, transitioning: `opacity-0 group-hover:opacity-100 group-hover:scale-105 duration-500 ease-out`.
  - Size selectors slide up from the bottom of the card using a translation transition: `translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out`.

### C. Brand Board (Asymmetric Masonry Grid)
- Utilizes CSS Grid (`grid-template-columns: repeat(12, 1fr)`) with dynamic column and row span assignments to create an editorial grid.
- Media tiles contain visual components that crop cleanly: `w-full h-full object-cover`.

### D. Cart Slide-Over Drawer
- Hidden off-screen using `translate-x-full`.
- Transitions into view: `translate-x-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)`.
- Backdrop overlay transitions from `opacity-0` to `opacity-50` to focus the user's attention.

---

## 4. Interaction States & Radii

### Radii Scale
- **Interactive UI (Buttons, badges)**: `rounded-none` or `rounded-sm` (maintaining a sharp, premium editorial aesthetic).
- **Cards & Banners**: `rounded-none` (editorial layouts look more premium without rounded corners).
- **Cart slide-overs / headers**: Sharp square borders.

### Animations
- All interactive links fade color over `200ms`.
- Primary CTA buttons grow by `scale-102` and shift color to Accent Gold over `300ms` with ease-out styling.
