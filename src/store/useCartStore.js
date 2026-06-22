import { create } from 'zustand';
import { shopifyFetch } from '@/lib/shopify/client';
import {
  createCartMutation,
  addToCartMutation,
  getCartQuery,
  updateCartMutation,
  removeFromCartMutation
} from '@/lib/shopify/queries';

export const useCartStore = create((set, get) => ({
  cartItems: [],
  cartId: null,
  checkoutUrl: null,
  isUpdating: false,

  // Initialize and sync cart from session on load
  initializeCart: async () => {
    if (typeof window === 'undefined') return;
    const savedCartId = localStorage.getItem('thunnal_cart_id');
    if (!savedCartId) return;

    set({ isUpdating: true });
    try {
      const response = await shopifyFetch({
        query: getCartQuery,
        variables: { cartId: savedCartId }
      });

      const cart = response?.data?.cart;
      if (cart) {
        const mappedItems = cart.lines.edges.map((edge) => {
          const line = edge.node;
          const variant = line.merchandise;
          return {
            id: line.id, // Shopify Line ID
            variantId: variant.id,
            title: variant.product?.title || "Product",
            price: variant.price.amount,
            currencyCode: variant.price.currencyCode,
            image: variant.product?.images?.edges?.[0]?.node?.url || "/products/placeholder.png",
            handle: variant.product?.handle || "",
            size: variant.title,
            quantity: line.quantity
          };
        });

        set({
          cartId: cart.id,
          checkoutUrl: cart.checkoutUrl,
          cartItems: mappedItems,
          isUpdating: false
        });
      } else {
        // Clear if cart has expired or doesn't exist on Shopify
        localStorage.removeItem('thunnal_cart_id');
        set({ cartId: null, checkoutUrl: null, cartItems: [], isUpdating: false });
      }
    } catch (err) {
      console.error("Failed to sync shopify cart session:", err);
      set({ isUpdating: false });
    }
  },

  // Add item to cart (Optimistic + Shopify API Sync)
  addToCart: async (item) => {
    const currentItems = get().cartItems;
    const currentCartId = get().cartId;

    // 1. Optimistic UI update
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => cartItem.variantId === item.variantId
    );

    let newItems = [...currentItems];
    if (existingItemIndex > -1) {
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + (item.quantity || 1)
      };
    } else {
      newItems.push({
        id: item.id || `local-${Date.now()}`, // Temporary ID
        variantId: item.variantId,
        title: item.title,
        price: item.price,
        currencyCode: item.currencyCode || 'USD',
        image: item.image,
        handle: item.handle,
        size: item.size,
        quantity: item.quantity || 1
      });
    }

    set({ cartItems: newItems, isUpdating: true });

    // 2. Synchronize in the background
    try {
      if (!currentCartId) {
        // Create new Shopify cart session
        const response = await shopifyFetch({
          query: createCartMutation,
          variables: {
            input: {
              lines: [{
                merchandiseId: item.variantId,
                quantity: item.quantity || 1
              }]
            }
          }
        });

        const newCart = response?.data?.cartCreate?.cart;
        if (newCart) {
          localStorage.setItem('thunnal_cart_id', newCart.id);
          
          const mappedItems = newCart.lines.edges.map((edge) => {
            const line = edge.node;
            const variant = line.merchandise;
            return {
              id: line.id, // Shopify Line ID
              variantId: variant.id,
              title: variant.product?.title || item.title,
              price: variant.price.amount,
              currencyCode: variant.price.currencyCode,
              image: variant.product?.images?.edges?.[0]?.node?.url || item.image,
              handle: variant.product?.handle || item.handle,
              size: variant.title,
              quantity: line.quantity
            };
          });

          set({
            cartId: newCart.id,
            checkoutUrl: newCart.checkoutUrl,
            cartItems: mappedItems,
            isUpdating: false
          });
        } else {
          throw new Error("Unable to create cart session");
        }
      } else {
        // Add to existing Shopify cart
        const response = await shopifyFetch({
          query: addToCartMutation,
          variables: {
            cartId: currentCartId,
            lines: [{
              merchandiseId: item.variantId,
              quantity: item.quantity || 1
            }]
          }
        });

        const updatedCart = response?.data?.cartLinesAdd?.cart;
        if (updatedCart) {
          // If live API returned mapping edges, overwrite the optimistic elements
          if (updatedCart.lines?.edges?.length > 0) {
            const mappedItems = updatedCart.lines.edges.map((edge) => {
              const line = edge.node;
              const variant = line.merchandise;
              return {
                id: line.id,
                variantId: variant.id,
                title: variant.product?.title || item.title,
                price: variant.price.amount,
                currencyCode: variant.price.currencyCode,
                image: variant.product?.images?.edges?.[0]?.node?.url || item.image,
                handle: variant.product?.handle || item.handle,
                size: variant.title,
                quantity: line.quantity
              };
            });
            set({ cartItems: mappedItems, isUpdating: false });
          } else {
            // Mock mode fallback
            set({ isUpdating: false });
          }
        } else {
          throw new Error("Unable to add lines to cart");
        }
      }
    } catch (err) {
      console.error("Shopify cart add failed, rolling back:", err);
      // Rollback to previous state
      set({ cartItems: currentItems, isUpdating: false });
      alert("Unable to sync cart. Changes rolled back.");
    }
  },

  // Remove item (Optimistic + Shopify API Sync)
  removeFromCart: async (variantId) => {
    const currentItems = get().cartItems;
    const currentCartId = get().cartId;

    const targetItem = currentItems.find(item => item.variantId === variantId);
    if (!targetItem) return;

    // 1. Optimistic UI update
    const newItems = currentItems.filter((item) => item.variantId !== variantId);
    set({ cartItems: newItems, isUpdating: true });

    if (!currentCartId) {
      // Local fallback mode
      set({ isUpdating: false });
      return;
    }

    // 2. Sync background
    try {
      if (targetItem.id.startsWith('local-')) {
        set({ isUpdating: false });
        return;
      }

      const response = await shopifyFetch({
        query: removeFromCartMutation,
        variables: {
          cartId: currentCartId,
          lineIds: [targetItem.id]
        }
      });

      const updatedCart = response?.data?.cartLinesRemove?.cart;
      if (updatedCart) {
        if (updatedCart.lines?.edges?.length > 0) {
          const mappedItems = updatedCart.lines.edges.map((edge) => {
            const line = edge.node;
            const variant = line.merchandise;
            return {
              id: line.id,
              variantId: variant.id,
              title: variant.product?.title || targetItem.title,
              price: variant.price.amount,
              currencyCode: variant.price.currencyCode,
              image: variant.product?.images?.edges?.[0]?.node?.url || targetItem.image,
              handle: variant.product?.handle || targetItem.handle,
              size: variant.title,
              quantity: line.quantity
            };
          });
          set({ cartItems: mappedItems, isUpdating: false });
        } else {
          set({ isUpdating: false });
        }
      } else {
        throw new Error("Unable to delete line");
      }
    } catch (err) {
      console.error("Shopify cart remove failed, rolling back:", err);
      set({ cartItems: currentItems, isUpdating: false });
      alert("Unable to remove item. Changes rolled back.");
    }
  },

  // Update item quantity (Optimistic + Shopify API Sync)
  updateQuantity: async (variantId, quantity) => {
    const currentItems = get().cartItems;
    const currentCartId = get().cartId;

    if (quantity <= 0) {
      get().removeFromCart(variantId);
      return;
    }

    const targetItem = currentItems.find(item => item.variantId === variantId);
    if (!targetItem) return;

    // 1. Optimistic UI update
    const newItems = currentItems.map((item) =>
      item.variantId === variantId ? { ...item, quantity } : item
    );
    set({ cartItems: newItems, isUpdating: true });

    if (!currentCartId) {
      // Local fallback mode
      set({ isUpdating: false });
      return;
    }

    // 2. Sync background
    try {
      if (targetItem.id.startsWith('local-')) {
        set({ isUpdating: false });
        return;
      }

      const response = await shopifyFetch({
        query: updateCartMutation,
        variables: {
          cartId: currentCartId,
          lines: [{
            id: targetItem.id,
            quantity: quantity
          }]
        }
      });

      const updatedCart = response?.data?.cartLinesUpdate?.cart;
      if (updatedCart) {
        if (updatedCart.lines?.edges?.length > 0) {
          const mappedItems = updatedCart.lines.edges.map((edge) => {
            const line = edge.node;
            const variant = line.merchandise;
            return {
              id: line.id,
              variantId: variant.id,
              title: variant.product?.title || targetItem.title,
              price: variant.price.amount,
              currencyCode: variant.price.currencyCode,
              image: variant.product?.images?.edges?.[0]?.node?.url || targetItem.image,
              handle: variant.product?.handle || targetItem.handle,
              size: variant.title,
              quantity: line.quantity
            };
          });
          set({ cartItems: mappedItems, isUpdating: false });
        } else {
          set({ isUpdating: false });
        }
      } else {
        throw new Error("Unable to update quantity");
      }
    } catch (err) {
      console.error("Shopify cart update failed, rolling back:", err);
      set({ cartItems: currentItems, isUpdating: false });
      alert("Unable to update quantity. Changes rolled back.");
    }
  },

  // Clear all items
  clearCart: () => {
    localStorage.removeItem('thunnal_cart_id');
    set({ cartItems: [], cartId: null, checkoutUrl: null });
  },

  // Totals calculations
  getCartTotal: () => {
    const items = get().cartItems;
    return items.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);
  },

  getCartCount: () => {
    const items = get().cartItems;
    return items.reduce((acc, item) => acc + item.quantity, 0);
  },

  // Checkout redirect
  triggerCheckout: () => {
    const checkoutUrl = get().checkoutUrl;
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      const items = get().cartItems;
      if (items.length === 0) return;
      alert(`Redirecting to secure Shopify checkout...\nItems: ${items.length}\nTotal: $${get().getCartTotal().toFixed(2)}`);
      window.location.href = "https://checkout.shopify.com/mock-checkout";
    }
  }
}));
