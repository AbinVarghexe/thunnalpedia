# Landing Page Architecture: Layout, Components & Interactions

This document outlines the layout, component structures, interactive requirements, and Shopify integrations for the **THUNNAL** E-Commerce Landing Page.

---

## 1. Page Flow Overview

The landing page is designed to guide users from brand storytelling down to product discovery and purchase. The section sequence is as follows:

1. **Promotion / Countdown Banner** ("The Hour" Component)
2. **Global Navigation Bar** (Header with Hover states)
3. **Hero Section** (Immersive editorial intro)
4. **Product Collection Section** (Horizontal scroll/carousel displaying dynamic products)
5. **Brand Board Section** (Asymmetric visual collage / mood board)
6. **Testimonials** (Sleek slider showcasing client feedback)
7. **Footer** (Detailed navigation, legal, and newsletter capture)

---

## 2. Component Specifications

### A. The "Hour" Banner (Countdown Drop Component)
- **Purpose**: Creates urgency by highlighting time-limited releases ("Drops"), a popular model for modern apparel brands.
- **Layout & Structure**:
  - Thin, full-width banner at the absolute top of the page.
  - Left: "DROP 04 / WINTER COLLECTION".
  - Center: Live ticking countdown timer `[ HH : MM : SS ]`.
  - Right: CTA link "JOIN WAITING LIST" or "VIEW LOOKBOOK".
- **Interactions**:
  - Countdown script updates every second via React `useEffect`.
  - Smooth flash animation on number changes.
- **Shopify Context**:
  - The drop time is retrieved from a Shopify Collection metafield (`custom.drop_time`).

---

### B. Header / Navigation
- **Purpose**: Brand identification and key links.
- **Layout**:
  - Logo centered. Left links: Shop, Collections, About. Right links: Search, Account, Cart (with bubble indicator showing item count).
- **Interactions**:
  - **Sticky Fade**: Header goes from transparent to backdrop-blurred glassmorphism (`backdrop-filter: blur(12px)`) after scrolling `50px`.
  - **Category Hover Menu**: Hovering over "Shop" reveals a mega-menu showing categories with text fade-in transitions.
  - **Cart Slide-Over**: Clicking the Cart icon slides open a side-drawer displaying items, quantity adjusters, and a Checkout button that links to the Shopify `checkoutUrl`.

---

### C. Hero Section
- **Purpose**: Establish brand atmosphere with high-fidelity media and core calls-to-action.
- **Layout**:
  - Full-screen background video or high-definition image slider.
  - Left-aligned or centered overlay text using large, editorial serif typography.
  - Primary button: "DISCOVER THE COLLECTION" (scrolls to the Product Section).
  - Secondary button: "EXPLORE THE STORY".
- **Interactions**:
  - **Parallax Scroll**: The background media moves at a slower rate than the foreground text during scroll (`transform: translateY(Y * 0.3px)`).
  - **Reveal Transition**: Character-by-character text reveal on initial page load.

---

### D. The Product Collection Section (Dynamic Scroll Grid)
- **Purpose**: Showcases curated clothing items in a highly interactive horizontal viewport.
- **Layout**:
  ```
  +-----------------------------------------------------------+
  |  COLLECTION TITLE                                         |
  |  < Swipe to explore >                                     |
  |  [Card 1]       [Card 2]       [Card 3]       [Card 4]    |
  |  ======== Progress Indicator: [------|---------------] == |
  +-----------------------------------------------------------+
  ```
  - Horizontal viewport with CSS Flexbox (`display: flex; overflow-x: scroll; scroll-snap-type: x mandatory`).
- **Interactions**:
  - **Hover Action**: Hovering over a card replaces the primary product photo (e.g., front view) with a secondary photo (e.g., back view or styling shot) using a CSS opacity/scale transition.
  - **Slide-up Details**: On hover, pricing and quick-add size selectors slide up from the bottom of the card.
  - **Dynamic Progress Bar**: Built by tracking the container's `scrollLeft` divided by its maximum scroll width, translating into a percentage (`width: 0%` to `100%`) for a thin progress bar below the products.
- **Shopify Context**:
  - Fetched via Shopify Storefront API:
    ```graphql
    query GetProducts {
      products(first: 8) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
    ```

---

### E. Brand Board Section
- **Purpose**: An editorial mood board that communicates the lifestyle and ethos of the brand.
- **Layout**:
  - Asymmetric grid (using CSS Grid) with 4-5 tiles.
  - Mix of static photography, slow-looping mood videos (without controls), and short text blocks.
  - Example layout:
    - Tile 1 (2 cols, 2 rows): High-contrast lifestyle shot.
    - Tile 2 (1 col, 1 row): Vertical quote about sustainability/craftsmanship.
    - Tile 3 (1 col, 2 rows): Looping detail video of textile weaving.
    - Tile 4 (2 cols, 1 row): Editorial CTA to "READ THE BRAND MANIFESTO".
- **Interactions**:
  - **Hover Zoom**: Images scale slightly inside their containers on mouse-over (`overflow: hidden` on tiles, `scale(1.03)` on hover).

---

### F. Testimonials
- **Purpose**: Build social proof and customer trust.
- **Layout**:
  - Centered block showing a single quote, customer name, and verified purchaser tag.
  - Smooth dot pagination at the bottom to toggle reviews.
- **Interactions**:
  - Horizontal carousel that transitions reviews with a cross-fade (`opacity` and `translateX` translate shifts).
  - Autoplay toggle that pauses when the user hovers over the section.

---

### G. Footer
- **Purpose**: Navigation fallback, legal disclosures, and subscriber capture.
- **Layout**:
  - Grid containing:
    - Col 1: Newsletter subscription (email form with success micro-animations).
    - Col 2: Brand links (Collections, Sizing Chart, Care Guide).
    - Col 3: Customer service links (Returns, FAQs, Contact).
    - Col 4: Legal & Social links (Instagram, Pinterest, Terms, Privacy).
  - Bottom row: Copyright notice and payment logos.
- **Interactions**:
  - Submit button validates email dynamically and triggers a Shopify customer creation API/newsletter hook, showing a clean checkmark animation upon success.
