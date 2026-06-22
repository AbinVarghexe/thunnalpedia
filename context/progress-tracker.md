# Progress Tracker

## Current Phase

- **Phase 1**: Project Setup & Base Template Configuration

## Current Goal

- Initialize Next.js base app with Tailwind CSS, configure Zustand stores, set up Shopify storefront GraphQL clients, and install `@shopify/hydrogen-react`.

## Completed

- [x] Create project specification files: `design.md`, `shopify_integration.md`, `landing_page.md`
- [x] Configure project rules (`AGENTS.md` and updated existing workspace contexts)
- [x] Initialize Git repository
- [x] Create production `main` and development `dev` branches

## In Progress

- [ ] Initialize Next.js project with Tailwind CSS in the root directory
- [ ] Install node dependencies (`zustand`, `@shopify/hydrogen-react`, `graphql`)
- [ ] Configure jsconfig path mappings (`@/*`) and tailwind theme values

## Next Up

- Deploy parallel subagents to build features:
  - `feature/countdown-banner`: Real-time Hour Countdown Drop banner.
  - `feature/product-scroll`: Smooth snapping horizontal scroll view, size picker hover selector, and dual-image swaps.
  - `feature/hero-moodboard`: Editorial landing hero sections and asymmetric grid mood board.

## Open Questions

- *None at this moment.* (Resolved "Theravn CSS" query as Tailwind CSS).

## Architecture Decisions

- **Styling**: Tailwind CSS for grid alignments, transitions, and flexible mobile layout scaling.
- **Client State**: Zustand for single-store client states (Cart visibility, drop lock states).
- **Commerce Wrapper**: Hydrogen React SDK for checkout redirection URL resolution and storefront queries.
