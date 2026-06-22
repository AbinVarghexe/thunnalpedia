# THUNNAL UI Context & Design Tokens

This document details the color palette, typography scales, layout specs, and interactive patterns implemented via CSS variables, Tailwind CSS configurations, and motion systems, directly derived from the Design System (Version 1.0).

---

## 1. Brand Identity & Aesthetic Philosophy

The visual language of THUNNAL combines contemporary Malayalam typography, premium editorial design, and Apple's visual philosophy: **"Apple meets Malayalam Typography."**

### Core Design Principles
* **Typography First**: Typography is the primary visual element. Large Malayalam typography should behave as visual artwork rather than text.
* **Minimalism**: Every element must have a purpose. Remove unnecessary decorations.
* **Cultural Modernism**: Blend Malayalam visual culture with modern digital interfaces, avoiding traditional clichés.
* **Premium Simplicity**: Interfaces should feel expensive, spacious, and intentional.

---

## 2. Color Palette System

Defined as CSS variables in `globals.css` and mapped to Tailwind configurations.

### Primary Palette (Brand Reds)
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

### Neutral Palette
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

### Gradients
* **Brand Gradient**:
  ```css
  linear-gradient(135deg, #FF9B9B 0%, #FF6B6B 40%, #E11D2E 100%)
  ```
* **Typography Gradient**:
  ```css
  linear-gradient(180deg, #FFB2B2 0%, #FF7A7A 50%, #E11D2E 100%)
  ```

---

## 3. Typography Specs

* **Malayalam Fonts (Hero/Titles/Headers/Quotes/Brand/Decoratives)**:
  1. *FSL Malabar*
  2. *Manjari*
  3. *Noto Sans Malayalam*
* **English Fonts (UI/Body/Utility/Controls)**:
  ```css
  font-family: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif;
  /* Fallback */
  font-family: "Inter", sans-serif;
  ```

### Typography Scale
* **Hero Display**: `font-size: clamp(4rem, 10vw, 10rem); font-weight: 700; line-height: 0.9; letter-spacing: -0.04em;`
* **H1**: `font-size: clamp(3rem, 7vw, 5rem); font-weight: 700;`
* **H2**: `font-size: clamp(2rem, 5vw, 3rem); font-weight: 600;`
* **H3**: `font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600;`
* **Body**: `font-size: 1rem; line-height: 1.8; font-weight: 400;`

---

## 4. Layout & Grid System

### Container
```css
max-width: 1440px;
padding-inline: 32px;
margin-inline: auto;
```

### Grid
* **Desktop**: 12 Columns | 24px Gap
* **Tablet**: 6 Columns
* **Mobile**: 4 Columns

### Section Spacing (padding-block)
* **Desktop**: `120px`
* **Tablet**: `96px`
* **Mobile**: `72px`

---

## 5. Visual Styling & Decoratives

### Backgrounds
* **Default**: `#FFFFFF`
* **Editorial Grid Background**:
  ```css
  background-image:
    linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  ```
  *(Used for Hero Sections, Editorial Pages, Case Studies, Portfolio Pages)*

### Borders & Radii
```css
--radius-sm: 12px;
--radius-md: 20px;
--radius-lg: 32px;
--radius-xl: 48px;
```

### Shadows
* **Soft**: `box-shadow: 0 8px 32px rgba(255,79,79,0.08);`
* **Elevated**: `box-shadow: 0 12px 40px rgba(255,79,79,0.15);`

### Glassmorphism
```css
background: rgba(255,255,255,0.85);
backdrop-filter: blur(12px);
border: 1px solid rgba(255,255,255,0.5);
```

### Decorative Elements
* Use: Spirals, Dots, Curves, Flourishes, and Circular Accents.
* Avoid: Heavy Icons, Sharp Geometry, and Aggressive Shapes.

---

## 6. Components Specifications

* **Hero Section**:
  * Large Malayalam Typography
  * Brand Gradient
  * Editorial Grid Background
  * Decorative Flourishes
  * Minimal Supporting Text
  * Strong CTA
* **Story Card**:
  * Glassmorphism layout
  * Soft Shadows
  * Rounded Corners
  * Large Visuals
  * Aspect Ratio: `4 / 5`
* **Feature Section**:
  * Layout: Text Left / Image Right (alternating every section)
* **Testimonial Section**:
  * Large Quote
  * Minimal Decoration
  * Typography Focused
* **Footer**:
  * Editorial Grid Background
  * Minimal Navigation
  * Social Links
  * Brand Signature

---

## 7. Interactive Elements & Motion System

### Buttons
* **Primary Button**:
  ```css
  background: linear-gradient(135deg, #FF9B9B, #E11D2E);
  color: white;
  padding: 16px 32px;
  border-radius: 999px;
  ```
  * Hover state: `transform: translateY(-2px);`
* **Secondary Button**:
  ```css
  background: transparent;
  border: 1px solid #E11D2E;
  color: #E11D2E;
  ```

### Motion System
* **Philosophy**: Elegant, organic, slow, refined. No bouncy effects, excessive rotation, or flashy motion.
* **Default Transition**:
  ```css
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  ```
* **Floating Animation**:
  ```css
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  ```

---

## 8. Accessibility & Development Stack

### Accessibility Requirements
* WCAG AA Contrast
* Visible Focus States
* Minimum Button Height `48px`
* Keyboard Navigable

### Development Stack
* Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis

### Do Not Use
* Bootstrap Styling, Material Design Defaults, Generic SaaS Components, Neon Colors, Heavy Gradients, Dark Corporate Themes.
