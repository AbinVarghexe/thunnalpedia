# THUNNAL Coding Standards & Conventions

This document defines the development practices, file naming patterns, and coding conventions for the THUNNAL e-commerce frontend.

---

## 1. General Principles

- **Single Responsibility**: Keep React components and utility files focused on one core job.
- **Server Components by Default**: Next.js App Router route components (`page.js`, `layout.js`) must be Server Components. 
- **Client Components on Demand**: Use `"use client"` only when a component relies on:
  - React hooks (`useState`, `useEffect`, `useContext`).
  - Browser-only APIs (cookies, localStorage, intersection observers).
  - Framer Motion or interactive animations.
- **No Private Credential Exposure**: Never prefix sensitive keys (like admin webhook keys) with `NEXT_PUBLIC_`. Keep them hidden in server-only modules.

---

## 2. Styling Standards (Tailwind CSS)

- **Map to Design Tokens**: Do not use hardcoded hex values in component inline styles or raw Tailwind classes. Use mapped theme classes:
  - Backgrounds: `bg-primary`, `bg-secondary`.
  - Text: `text-primary`, `text-secondary`, `text-accent`.
  - Borders: `border-divider`.
- **Responsive Layouts**: Utilize Tailwind's breakpoints (`sm:`, `md:`, `lg:`, `xl:`) systematically. Default layout rules must be mobile-first.
- **Sharp Aesthetics**: Adhere to sharp, square corners (`rounded-none`) as established in the design context.

---

## 3. Data Fetching & Shopify Integrations

- **GraphQL Client Helpers**: Write queries inside `lib/shopify/queries.js` and mutations in `lib/shopify/mutations.js`. Use parameterized variables instead of string interpolation to prevent injection bugs.
- **Storefront SDK Wrappers**: Wrap cart operations inside client-side helpers that trigger Shopify cart mutation queries, updating the local Zustand cart store on completion.
- **ISR Tagging**: When fetching products or collections from Server Components, tag the fetch with appropriate revalidation keys:
  ```javascript
  const response = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { tags: ['products'] } // Enables instant purging via Webhooks
  });
  ```

---

## 4. State Management (Zustand)

- **Atomic Stores**: Keep stores simple. Use a `useCartStore` to toggle the drawer open state and cache optimistic cart items, and a `useUIStore` for banners and navigation indicators.
- **Actions alongside State**: Define state mutation actions directly within the Zustand store definition to keep the logic self-contained.

---

## 5. Directory & File Naming Conventions

- **Component Folders**: Save storefront sections inside `components/storefront/` and small UI parts (buttons, badges) inside `components/ui/`.
- **CamelCase / Kebab-case**: 
  - Use PascalCase for React component file names (e.g., `ProductScroll.jsx`, `HeroSection.jsx`).
  - Use kebab-case for Next.js folder routes and static utility assets (e.g., `/products/[handle]`, `/api/revalidate`).
- **Clean Imports**: Use `@/*` imports defined in `jsconfig.json` (or `tsconfig.json` if using TypeScript) to keep imports neat and readable.
