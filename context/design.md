# Design System: THUNNAL

This document defines the design system, brand identity, and UI/UX guidelines for **THUNNAL**, a premium, modern clothing brand. The system is built for a headless Next.js frontend, focusing on a minimalist, editorial, and immersive shopping experience.

---

## 1. Brand Identity & Aesthetic Direction

THUNNAL is a high-end, contemporary apparel brand that merges traditional craftsmanship with modern silhouettes. The design aesthetic is **editorial, clean, and spacious**, prioritizing large photography, refined typography, and subtle micro-interactions to create a luxury feel.

- **Design Philosophy**: "Less but better." Every element must serve a purpose. Heavy use of whitespace, high-contrast imagery, and smooth transitions.
- **Tone**: Sophisticated, avant-garde, yet accessible.

---

## 2. Color Palette

The color system uses refined HSL values to support smooth light/dark mode transitions and high-end visual harmony. We avoid pure blacks and raw primary colors.

| Token | Use Case | Light Mode (Hex / HSL) | Dark Mode (Hex / HSL) |
| :--- | :--- | :--- | :--- |
| **Primary (Background)** | Main page canvas | `#FDFDFB` (HSL 60, 20%, 99%) | `#0F0F0E` (HSL 60, 5%, 6%) |
| **Secondary (Canvas)** | Card backdrops, subtle sections | `#F4F4F0` (HSL 60, 10%, 95%) | `#181816` (HSL 60, 6%, 9%) |
| **Text Primary** | Headings, body, main labels | `#1C1C1A` (HSL 60, 5%, 10%) | `#EFEFEA` (HSL 60, 10%, 94%) |
| **Text Secondary** | Subtitles, meta-text, captions | `#6B6B64` (HSL 60, 4%, 41%) | `#A2A29B` (HSL 60, 4%, 63%) |
| **Accent Gold** | Special highlights, interactive states | `#C5A880` (HSL 35, 38%, 64%) | `#DCC29E` (HSL 35, 42%, 74%) |
| **Border / Divider** | Minimal separator lines | `#E5E5E0` (HSL 60, 8%, 90%) | `#2A2A26` (HSL 60, 5%, 16%) |
| **Error / Alert** | System messages, low stock | `#B54D4D` (HSL 0, 45%, 50%) | `#E87070` (HSL 0, 72%, 67%) |

---

## 3. Typography

The type scale uses a pairing of a high-fashion serif font for headings and an ultra-clean sans-serif font for utility, pricing, and body text.

- **Heading Font**: *Syne* or *Playfair Display* (Editorial, bold, characterful)
- **Body & Interface Font**: *Outfit* or *Inter* (Clean, legible, modern geometric)

### Typographic Scale

```css
--font-size-xs:   0.75rem (12px)  /* Micro-labels, badge text */
--font-size-sm:   0.875rem (14px) /* Buttons, pricing, descriptions */
--font-size-base: 1.0rem (16px)   /* Body text, inputs */
--font-size-lg:   1.25rem (20px)  /* Card headings, sub-sections */
--font-size-xl:   1.75rem (28px)  /* Section titles */
--font-size-2xl:  2.5rem (40px)   /* Sub-hero headers */
--font-size-3xl:  4.0rem (64px)   /* Main hero titles */
--font-size-display: 6.0rem (96px) /* Oversized branding / editorial overlay */
```

---

## 4. Layout & Grid System

- **Container**: Max width of `1440px` for desktop, centered, with `2rem` horizontal padding (`1rem` on mobile).
- **Asymmetric Grid**: For editorial layouts (e.g., the Brand Mood Board), utilize a hybrid 12-column grid or CSS Grid with varying row heights.
- **Whitespace**: Generous vertical margins (`clamp(4rem, 8vw, 10rem)`) to let products "breathe."

---

## 5. UI Components & Interaction States

### A. Buttons (Interactive States)
- **Primary CTA**: Solid background matching Text Primary, label matching Primary Canvas. On hover: scales up slightly (`1.02`), background transitions to Accent Gold, label changes.
- **Secondary CTA**: Transparent background, 1px border matching Text Primary. On hover: background fills with Text Primary, text color inverts.
- **Text CTA (Inline)**: Underlined link. Hover transitions the underline width from 0% to 100% from left to right.

### B. Product Cards & Hover Effects
- **Image Shift**: Hovering on a card smoothly fades in the second product image (lifestyle shot or reverse view) with a scale transition (`scale(1.05)`).
- **Quick Add Accordion**: A slide-up drawer from the bottom of the card on hover, offering immediate size selection (S, M, L, XL) with direct cart addition.
- **Hover Cursor**: Custom cursor showing "VIEW" or "DRAG" when hovering over interactive carousels or editorial zones.

### C. The Product Scroll (Horizontal Carousel)
- **Behavior**: Horizontal scrolling viewport powered by CSS scroll-snapping (`scroll-snap-type: x mandatory`).
- **Scroll Indicator**: An ultra-thin, sleek progress bar below the carousel that dynamically fills from `0%` to `100%` as the user scrolls.
- **Controls**: Minimalist arrow icons (left/right) positioned as floating overlay elements or grouped neatly in the header.

---

## 6. Animations & Micro-Interactions

Transitions should feel fluid and organic, mimicking luxury motion.

- **Page Transitions**: Framer Motion layout animations for smooth exit/entry.
- **Easing Curve**: `cubic-bezier(0.16, 1, 0.3, 1)` (Ultra-smooth custom ease-out).
- **Duration**: `400ms` for primary movements, `200ms` for hover reactions.
- **Scroll Reveal**: Elements fade and translate upward (`translateY(20px)`) as they enter the viewport.
