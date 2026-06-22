# THUNNAL Clothing E-Commerce: Project Overview

## Overview

THUNNAL is a premium, headless e-commerce website for a clothing brand. It decoupled the frontend user interface (built with **Next.js** and **Tailwind CSS**) from the backend e-commerce engine (**Shopify**). The site delivers an immersive, editorial brand narrative with dynamic styling, smooth micro-animations, and a seamless shopping experience, ultimately redirecting to Shopify's secure, hosted checkout page.

---

## Goals

1. **Brand Storytelling**: Build a high-fidelity visual experience that conveys the brand's premium identity.
2. **Catalog Discovery**: Display products and collection listings retrieved from the Shopify Storefront API in a highly engaging, interactive format.
3. **Cart Operations**: Enable users to add/remove variants and adjust quantities, synchronized in real-time with Shopify's Cart endpoints.
4. ** Urgency & Drops**: Showcase exclusive limited-time drops with a live "Hour" countdown banner.
5. **Secure Checkout**: Seamlessly redirect users to Shopify's optimized, secure checkout flow to process payments.

---

## Core User Flow

1. **Storefront Entry**: User lands on the home page and sees the active drop countdown banner and the editorial video/image hero section.
2. **Product Discovery**: User navigates collection carousels using horizontal scrolling, hovering to view variant details (alternative images, sizes).
3. **Cart Insertion**: User selects a size drawer on hover or a product page, adding the item to the cart slide-over drawer (powered by Zustand & Shopify Cart SDK).
4. **Quantity Adjustments**: User edits item counts inside the slide-over cart drawer with instant API synchronization.
5. **Redirection to Payment**: User clicks "Checkout" and is redirected to the Shopify-hosted checkout page.
6. **Confirmation**: Shopify redirects the user back to the custom Next.js thank-you page after successful payment.

---

## Features

### Hero Section
- Immersive fullscreen background video or high-definition image slider.
- Editorial typography overlay with smooth entry transitions.
- Interactive scroll triggers leading to the product discovery sections.

### The Product Collection Section
- Horizontal scroll viewport with CSS snap scrolling and dynamic filling scrollbars.
- Smooth hover triggers: swapping primary images for lifestyle variant views and displaying quick-add size drawers.
- Real-time stock availability queries.

### The "Hour" countdown Drop Banner
- Prominent banner showing drop announcements and live countdown timers to create exclusive urgency.
- Trigger states that lock/unlock product collections as drops go live.

### Asymmetric Brand Board Section
- Masonry/asymmetric grid communicating styling, sourcing, and brand story.
- Subtle zoom animations and looping ambient video.

### Testimonials & Social Proof
- Customer testimonials with smooth cross-fade slides.

### Slide-Over Shopping Cart
- A persistent sidebar containing the cart list, price totals, and promotional code entry.
- Direct link redirection to Shopify's checkout.

---

## Scope

### In Scope
- Next.js frontend with Tailwind CSS styling.
- Headless cart session initialization and Storefront API GraphQL integrations.
- Countdown-driven collection availability triggers.
- Dynamic responsive layouts (mobile, tablet, desktop).
- Local states managed via Zustand.

### Out of Scope
- Direct credit card processing or custom checkout payment pages (all handled by Shopify).
- Direct inventory/product administration interfaces (managed via Shopify Admin by the backend operator).
- Complex custom user reviews database (can be integrated with third-party app widgets).
