<p align="center">
  <img src="assets/banner.svg" alt="THUNNAL - Bespoke Fashion & Headless Shopify Platform" width="100%" />
</p>

<p align="center">
  <strong>Luxury Bespoke Apparel & Tailoring Platform Engineered with Next.js 16, React 19, Shopify Hydrogen React, and Malayalam Typographic Aesthetics</strong>
</p>

<p align="center">
  <a href="https://github.com/AbinVarghexe/thunnalpedia/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Framework-Next.js%2016-black.svg?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://shopify.dev/docs/custom-storefronts/hydrogen"><img src="https://img.shields.io/badge/Commerce-Shopify%20Hydrogen-96BF48.svg?style=for-the-badge&logo=shopify&logoColor=white" alt="Shopify Hydrogen" /></a>
  <a href="https://graphql.org/"><img src="https://img.shields.io/badge/Data-Storefront%20GraphQL-E10098.svg?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS%20v4-38BDF8.svg?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /></a>
</p>

---

## Overview

**THUNNAL** is a luxury direct-to-consumer (D2C) bespoke tailoring and high-fashion apparel platform. Its digital aesthetic fuses contemporary Malayalam editorial typography with Apple Human Interface minimalist design principles: *"Apple meets Malayalam Typography"*.

The platform is architected as a headless e-commerce store utilizing **Next.js 16 App Router**, **@shopify/hydrogen-react**, and the **Shopify Storefront GraphQL API**, decoupling high-speed localized storefront rendering from backend catalog inventory and PCI-compliant checkout.

```
       +---------------------------------------------+
       |   Next.js 16 App Router Frontline           |
       |   - Editorial Parallax Typography           |
       |   - Reactive Zustand Cart Drawer            |
       |   - Daily Drop Countdown "Hour" Banner      |
       +----------------------+----------------------+
                              |
                              v
       +---------------------------------------------+
       |   @shopify/hydrogen-react Hook Pipeline     |
       |   - useCart, useShop, useProduct            |
       +----------------------+----------------------+
                              | Storefront GraphQL Queries
                              v
       +---------------------------------------------+
       |   Shopify Headless Commerce Backend         |
       |   - Inventory Sync & Catalog Webhooks       |
       |   - Secure Hosted Checkout Redirection      |
       +---------------------------------------------+
```

---

## Brand & Architectural Guides

All strategic design and implementation specifications are documented in the `context/` directory:

- 🎨 **[Design System](context/design.md)**: Visual identity specifications, HSL color tokens (`#FF4F4F` brand red ramp), fluid typography scales (FSL Malabar, Manjari, SF Pro), glassmorphism overlays, and organic easing curves.
- 🛍️ **[Shopify Headless Integration Guide](context/shopify_integration.md)**: Storefront API token authentication, rate limit mitigation, dynamic cart synchronization, and webhook cache revalidation.
- 📐 **[Landing Page Layout & Components](context/landing_page.md)**: Layout anatomy covering the Daily Drop Countdown Banner, Editorial Grid background, Asymmetric Brand Board, and Horizontal Product Rail.

---

## Quick Start

### 1. Prerequisites

- Node.js 18.18+ or 20.x
- A Shopify Partner Store with Storefront API Access enabled

### 2. Installation & Environment Configuration

```bash
# Clone the repository
git clone https://github.com/AbinVarghexe/thunnalpedia.git
cd thunnalpedia

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Add your Shopify credentials to `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN="your_storefront_access_token"
```

### 3. Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` to inspect the storefront.

### 4. Production Build

```bash
npm run build
npm run start
```

---

## Repository Structure

```
thunnalpedia/
├── assets/
│   └── banner.svg               # Vector visual banner
├── context/
│   ├── design.md                # Comprehensive typographic design system
│   ├── landing_page.md          # Visual section anatomy & component wireframes
│   └── shopify_integration.md   # Headless Shopify Storefront API guide
├── app/                         # Next.js App Router tree
├── public/                      # Static editorial assets
├── package.json
└── tsconfig.json
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
