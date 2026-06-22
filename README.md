# Thunnal Clothing E-Commerce Website

This repository contains the architecture, design guidelines, and implementation strategy for **THUNNAL**, a premium clothing brand e-commerce website built with **Next.js** and integrated headlessly with **Shopify**.

## 📂 Project Documentation

All planning, architecture, and design documents are located in the `context/` directory:

1. **[Design System](file:///d:/DEV/Projects/thunnalpedia/context/design.md)**: Defines the brand's visual identity, typography (Syne + Outfit), curated color palettes (light & dark mode HSL configurations), layout margins, buttons, and interaction behaviors.
2. **[Shopify Headless Integration Guide](file:///d:/DEV/Projects/thunnalpedia/context/shopify_integration.md)**: Explains the headless flow between Next.js and Shopify Storefront API. Covers the tech stack, checkout redirection, API rate limits, dynamic inventory synchronization, and webhook-driven cache revalidation.
3. **[Landing Page Layout & Components](file:///d:/DEV/Projects/thunnalpedia/context/landing_page.md)**: Outlines the design patterns and functional requirements of the storefront components:
   - **The "Hour" Banner**: Urgent countdown component for daily drops.
   - **Header / Navigation**: Dynamic glassmorphism scroll effect and category dropdowns.
   - **Hero Section**: High-contrast, editorial layout with parallax scrolling backgrounds.
   - **Product Section**: An interactive, smooth horizontal scroll viewport showcasing products with hover swaps and size selection drawers.
   - **Brand Board**: Asymmetric 12-column grid styling for brand storytelling.
   - **Testimonials**: Clean cross-fade testimonial carousel.
   - **Footer**: Newsletter capture form and auxiliary navigation links.

---

## 🛠️ Tech Stack Overview

- **Frontend**: Next.js (App Router), React, React Server Components (RSC)
- **Data Fetching**: GraphQL Client querying Shopify Storefront API
- **Styling**: Vanilla CSS Modules (to maintain luxury layout control and lightweight stylesheets)
- **State Management**: Zustand / React Context (Cart drawer visibility, UI states)
- **Hosting**: Vercel or Netlify (configured with ISR revalidation webhooks)

---

## 🚀 Getting Started with Development

When you are ready to begin the implementation phase:
1. Initialize the Next.js project using `npx create-next-app@latest`.
2. Configure your environment variables in `.env.local` to link to your Shopify Storefront API:
   ```env
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token
   ```
3. Set up `@shopify/hydrogen-react` or write custom GraphQL query wrappers to interact with the Cart and Product Storefront endpoints.
