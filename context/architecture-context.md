# THUNNAL Architecture Context

This document defines the system boundaries, data layers, integration interfaces, and architectural invariants for the headless **THUNNAL** clothing store.

---

## 1. Technology Stack & Roles

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router) | Structural skeleton, server/client code splitting, routing, dynamic sitemaps. |
| **Styling** | Tailwind CSS | Utility-first responsive design framework. |
| **Global Client State** | Zustand | Manages UI state: Cart open/close, search overlay, mobile navigation, global alerts. |
| **Commerce SDK** | Shopify Hydrogen React SDK | Integrates the Shopify `CartProvider`, fetches storefront sessions, and handles checkout URL generations. |
| **Data Fetching Layer** | Storefront GraphQL API | Fetching products, collection data, and variants. |
| **API Middleware** | Next.js Route Handlers | Receives Shopify admin webhooks for Instant Cache Revalidation. |
| **Hosting & Deployment** | Vercel / Netlify | Edge caching, serverless function executions, global CDN distribution. |

---

## 2. System Boundaries & File Structure

The project structure is organized to separate concerns and ensure high performance:

- `/app` — Routing and layouts. Product pages (`/products/[handle]`) and Collections (`/collections/[handle]`) are defined here as **Next.js Server Components** to run server-side GraphQL fetches.
- `/app/api` — Route handlers for webhook listeners (e.g. `/api/revalidate` for updating cached collection content when Shopify changes occur).
- `/components` — Split into:
  - `/components/ui`: Presentation components (buttons, badges, inputs).
  - `/components/storefront`: Landing page specific blocks (Hero, ProductScroll, CountdownBanner, BrandBoard, Testimonials).
- `/lib/shopify` — Queries and mutations defined in pure GraphQL, with custom request utilities communicating with the Storefront API client.
- `/context` — Static markdown context files describing project state.
- `/styles` — Global styling and tailwind initial configurations.

---

## 3. Storage & State Model

### A. Shopify Backend (Source of Truth)
- Inventory levels, pricing, currency mappings, descriptions, media assets, and legal documents are stored in the Shopify Admin.
- The checkout session data and order records live strictly on Shopify servers.

### B. Next.js Static Cache
- Product listings are statically rendered at build time and cached on the edge CDN.
- Whenever products are updated, a POST request is sent by Shopify to `/api/revalidate`, purging the page cache instantly using `revalidateTag` or `revalidatePath`.

### C. Client Session Cart
- Cart state (the `cartId`) is persisted in browser cookies or localStorage. 
- Updates to quantities or sizes trigger background mutations to the Shopify Cart API.

---

## 4. Webhook and Revalidation Flow

```
+---------------+                    +-------------------------+
| Shopify Admin | --[Product Update]--> | Next.js API Revalidate  |
+---------------+                    +-------------------------+
                                                  |
                                                  v
                                      revalidateTag('products')
                                                  |
                                                  v
                                      Next.js purges CDN Cache
```

- Webhook paths are secured using a HMAC signature check calculated against the shared Shopify Admin webhook secret.

---

## 5. Architectural Invariants

1. **Strict Decoupling**: Frontend components must never call Shopify Admin APIs (which contain private credentials). Only client-safe Storefront APIs should be queried.
2. **Standard Checkout**: No credit card or transactional input is collected on our Next.js frontend; checkout is handled entirely by Shopify's secure redirect.
3. **Optimistic Cart UI**: Cart state updates (adding/removing items) must reflect immediately in the client UI (using Zustand or optimist hooks) while background Storefront Cart mutations execute.
4. **Performance Budgets**: Hero assets and background videos must be compressed and lazy-loaded to prevent slowing down first contentful paint (FCP).
5. **No Hardcoded Storefront Credentials**: Shopify tokens must be loaded via environment variables (`process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`).
