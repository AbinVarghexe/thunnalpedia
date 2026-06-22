# Progress Tracker

## Current Phase

- **Phase 2**: Parallel Feature Extensions & Live Shopify Syncing

## Current Goal

- Integrate client-side components with live Shopify Cart mutations, bind collection availability to the drop countdown, and hook up live queries to product storefronts.

## Completed

- [x] Create project specification files: `design.md`, `shopify_integration.md`, `landing_page.md`
- [x] Configure project rules (`AGENTS.md` and updated existing workspace contexts)
- [x] Initialize Git repository
- [x] Create production `main` and development `dev` branches
- [x] Rewrite `design.md` with the new design system (Apple meets Malayalam Typography)
- [x] Align `ui-context.md` with revised design system tokens
- [x] Initialize Next.js project with Tailwind CSS in the root directory
- [x] Install node dependencies (`zustand`, `@shopify/hydrogen-react`, `graphql`)
- [x] Configure jsconfig path mappings (`@/*`) and tailwind theme values
- [x] Create base template and landing page with full section workflow (Countdown, Header, Hero, ProductScroll, BrandBoard, Testimonials, Footer, CartDrawer)
- [x] Connect base template and landing page CartDrawer operations directly to dynamic Shopify Cart mutations (`cartLinesAdd`, `cartCreate`, `cartLinesUpdate`, `cartLinesRemove`)
- [x] Create dynamic detailed product page route (/products/[handle]) with size variant selections, details accordions, and related items gallery cards
- [x] Refactor pill navbar with sliding backdrop capsule animation, 200ms close delay (grace period), responsive mega menu grid columns, and animated link bullet list hovers
- [x] Connect landing page ProductScroll cards to redirect users to detailed product pages on image or detail click
- [x] Refactor navbar items (Home, About, Collection) to support global routing from product detail pages back to home anchors
- [x] Create and render FAQ accordion section on landing page
- [x] Implement Detailing overlays, Materials DNA showcase grid, tabbed recommendations with Recently Viewed tracking, and Customer Reviews dashboard on product pages
- [x] Integrate Herosection.png as a full-bleed hero section background image with left-aligned dark text, a white alpha fade covering only the left 30% of the image, a premium rounded bottom curve (rounded-b-[48px] with z-10 isolate to fix absolute child clipping bugs), and set Poppins as the global theme font family
- [x] Position HourBanner absolutely, apply bg-[#A51717], and disable navigation spacer on the homepage to completely eliminate the top white bar
- [x] Create search box in the nav bar that expands inline, executes debounced real-time storefront search queries, and shows a premium glassmorphic dropdown of search results with filtered mock fallback support
- [x] Create Zustand store (useAuthStore.js) for customer session and profile state management
- [x] Add Shopify customer GraphQL mutations and queries to queries.js
- [x] Implement customer client methods in client.js with local database persistence fallbacks
- [x] Build Login and Signup routes with Continue with Ahoor OAuth redirect simulation
- [x] Build Account Dashboard route with profile details, address book operations, and order history
- [x] Integrate Account navigation buttons and hover dropdown actions in Header.jsx
- [x] Create `.env.local` configuration template and setup guidelines to connect frontend with live Shopify Storefront API
- [x] Implement programmatic storefront password page bypass via session cookie caching in client.js

## In Progress

- [ ] Connect drop collection locks to Countdown timer expiration

## Next Up

- Deploy parallel subagents to build features:
  - `feature/countdown-lock`: Collection locking logic triggered by drop time expiration.
  - `feature/seo-sitemaps`: Dynamic sitemap route handler for all Shopify product handles.

## Open Questions

- *None at this moment.* (Resolved "Theravn CSS" query as Tailwind CSS).

## Architecture Decisions

- **Styling**: Tailwind CSS for grid alignments, transitions, and flexible mobile layout scaling.
- **Client State**: Zustand for single-store client states (Cart visibility, drop lock states).
- **Commerce Wrapper**: Hydrogen React SDK for checkout redirection URL resolution and storefront queries.
