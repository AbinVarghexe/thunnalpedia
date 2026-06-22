# DESIGN SYSTEM

Version: 1.0

## Overview

This design system is inspired by contemporary Malayalam typography, premium editorial design, and Apple's visual philosophy.

The visual language combines:

* Modern Malayalam Typography
* Apple Human Interface Principles
* Editorial Layout Systems
* Minimal Luxury Aesthetics
* Cultural Storytelling

The experience should feel like:

"Apple meets Malayalam Typography."

---

# DESIGN PRINCIPLES

## Typography First

Typography is the primary visual element.

Large Malayalam typography should behave as visual artwork rather than text.

## Minimalism

Every element must have a purpose.

Remove unnecessary decorations.

## Cultural Modernism

Blend Malayalam visual culture with modern digital interfaces.

Avoid traditional clichés.

## Premium Simplicity

Interfaces should feel expensive, spacious, and intentional.

---

# COLOR SYSTEM

## Primary Palette

```css
--primary-50: #FFF1F1;
--primary-100: #FFE4E4;
--primary-200: #FFCACA;
--primary-300: #FFA3A3;
--primary-400: #FF7676;
--primary-500: #FF4F4F;
--primary-600: #F33434;
--primary-700: #E11D2E;
--primary-800: #C81E1E;
--primary-900: #A51717;
```

## Neutral Palette

```css
--white: #FFFFFF;

--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #E5E5E5;
--gray-300: #D4D4D4;
--gray-400: #A3A3A3;
--gray-500: #737373;
--gray-600: #525252;
--gray-700: #404040;
--gray-800: #262626;
--gray-900: #171717;
```

---

# GRADIENTS

## Brand Gradient

```css
linear-gradient(
135deg,
#FF9B9B 0%,
#FF6B6B 40%,
#E11D2E 100%
)
```

## Typography Gradient

```css
linear-gradient(
180deg,
#FFB2B2 0%,
#FF7A7A 50%,
#E11D2E 100%
)
```

---

# TYPOGRAPHY

## Typography Philosophy

Typography drives emotion.

Malayalam typography communicates personality.

English typography communicates clarity.

---

## Malayalam Fonts

Priority Order:

1. FSL Malabar
2. Manjari
3. Noto Sans Malayalam

Use For:

* Hero Titles
* Section Headers
* Quotes
* Brand Elements
* Decorative Headlines

---

## English Fonts

### UI Font Stack

```css
font-family:
"SF Pro Display",
"SF Pro Text",
-apple-system,
BlinkMacSystemFont,
sans-serif;
```

Fallback:

```css
font-family:
"Inter",
sans-serif;
```

---

## Typography Scale

### Hero Display

```css
font-size: clamp(4rem, 10vw, 10rem);
font-weight: 700;
line-height: 0.9;
letter-spacing: -0.04em;
```

### H1

```css
font-size: clamp(3rem, 7vw, 5rem);
font-weight: 700;
```

### H2

```css
font-size: clamp(2rem, 5vw, 3rem);
font-weight: 600;
```

### H3

```css
font-size: clamp(1.5rem, 3vw, 2rem);
font-weight: 600;
```

### Body

```css
font-size: 1rem;
line-height: 1.8;
font-weight: 400;
```

---

# LAYOUT SYSTEM

## Container

```css
max-width: 1440px;
padding-inline: 32px;
margin-inline: auto;
```

---

## Grid

Desktop

* 12 Columns
* 24px Gap

Tablet

* 6 Columns

Mobile

* 4 Columns

---

## Section Spacing

Desktop

```css
padding-block: 120px;
```

Tablet

```css
padding-block: 96px;
```

Mobile

```css
padding-block: 72px;
```

---

# BACKGROUNDS

## Default

```css
background: #FFFFFF;
```

## Editorial Grid

```css
background-image:
linear-gradient(
to right,
rgba(0,0,0,0.04) 1px,
transparent 1px
),
linear-gradient(
to bottom,
rgba(0,0,0,0.04) 1px,
transparent 1px
);

background-size: 40px 40px;
```

Use For:

* Hero Sections
* Editorial Pages
* Case Studies
* Portfolio Pages

---

# BORDERS

```css
--radius-sm: 12px;
--radius-md: 20px;
--radius-lg: 32px;
--radius-xl: 48px;
```

---

# SHADOWS

## Soft

```css
box-shadow:
0 8px 32px rgba(255,79,79,0.08);
```

## Elevated

```css
box-shadow:
0 12px 40px rgba(255,79,79,0.15);
```

---

# GLASSMORPHISM

```css
background:
rgba(255,255,255,0.85);

backdrop-filter:
blur(12px);

border:
1px solid rgba(255,255,255,0.5);
```

---

# BUTTONS

## Primary Button

```css
background:
linear-gradient(
135deg,
#FF9B9B,
#E11D2E
);

color: white;

padding:
16px 32px;

border-radius:
999px;
```

Hover:

```css
transform: translateY(-2px);
```

---

## Secondary Button

```css
background: transparent;

border:
1px solid #E11D2E;

color:
#E11D2E;
```

---

# MOTION SYSTEM

## Motion Philosophy

Animations should feel:

* Elegant
* Organic
* Slow
* Refined

Avoid:

* Bouncy Effects
* Excessive Rotation
* Flashy Motion

---

## Default Transition

```css
transition:
all 0.4s cubic-bezier(
0.22,
1,
0.36,
1
);
```

---

## Floating Animation

```css
@keyframes float {
0% {
transform: translateY(0);
}

50% {
transform: translateY(-10px);
}

100% {
transform: translateY(0);
}
}
```

---

# DECORATIVE ELEMENTS

Inspired by the reference typography.

Use:

* Spirals
* Dots
* Curves
* Flourishes
* Circular Accents

Avoid:

* Heavy Icons
* Sharp Geometry
* Aggressive Shapes

---

# COMPONENTS

## Hero Section

Requirements:

* Large Malayalam Typography
* Brand Gradient
* Editorial Grid Background
* Decorative Flourishes
* Minimal Supporting Text
* Strong CTA

---

## Story Card

Style:

* Glassmorphism
* Soft Shadows
* Rounded Corners
* Large Visuals

Aspect Ratio:

```css
4 / 5
```

---

## Feature Section

Layout:

Text Left

Image Right

Alternate every section.

---

## Testimonial Section

Requirements:

* Large Quote
* Minimal Decoration
* Typography Focused

---

## Footer

Requirements:

* Editorial Grid Background
* Minimal Navigation
* Social Links
* Brand Signature

---

# ACCESSIBILITY

Requirements:

* WCAG AA Contrast
* Visible Focus States
* Minimum Button Height 48px
* Keyboard Navigable

---

# DEVELOPMENT STACK

Recommended:

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion
* GSAP
* Lenis

---

# DO NOT USE

Avoid:

* Bootstrap Styling
* Material Design Defaults
* Generic SaaS Components
* Neon Colors
* Heavy Gradients
* Dark Corporate Themes

---

# VISUAL REFERENCE SUMMARY

The final experience should resemble:

* Apple.com
* Linear.app
* Framer
* Modern Editorial Publications

combined with

* Malayalam Typography
* Cultural Design
* Artistic Storytelling

The website should feel like a premium digital publication rather than a traditional business website.
