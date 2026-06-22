import { create } from 'zustand';
import { shopifyLogin, shopifySignup, shopifyGetCustomer, shopifyAddAddress, shopifyUpdateAddress, shopifyDeleteAddress } from '@/lib/shopify/client';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  // Load session from localStorage on client-side startup
  initializeAuth: async () => {
    if (typeof window === 'undefined' || get().isInitialized) return;

    const savedToken = localStorage.getItem('thunnal_customer_token');
    const savedUser = localStorage.getItem('thunnal_customer_user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        set({ token: savedToken, user: parsedUser, isInitialized: true });
        
        // Sync with background check to get fresh data (e.g. fresh orders or address modifications)
        const customer = await shopifyGetCustomer(savedToken);
        if (customer) {
          localStorage.setItem('thunnal_customer_user', JSON.stringify(customer));
          set({ user: customer });
        }
      } catch (err) {
        console.error("Failed to restore customer session, clearing storage:", err);
        localStorage.removeItem('thunnal_customer_token');
        localStorage.removeItem('thunnal_customer_user');
        set({ token: null, user: null, isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },

  // Native Shopify storefront customer login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopifyLogin(email, password);
      if (response.error) {
        set({ isLoading: false, error: response.error });
        return { success: false, error: response.error };
      }

      const { token, customer } = response;
      localStorage.setItem('thunnal_customer_token', token);
      localStorage.setItem('thunnal_customer_user', JSON.stringify(customer));
      
      set({ token, user: customer, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: err.message || "An unexpected error occurred" });
      return { success: false, error: err.message };
    }
  },

  // Native Shopify storefront customer registration
  signup: async (firstName, lastName, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shopifySignup(firstName, lastName, email, password);
      if (response.error) {
        set({ isLoading: false, error: response.error });
        return { success: false, error: response.error };
      }

      // Automatically login after signup
      return get().login(email, password);
    } catch (err) {
      set({ isLoading: false, error: err.message || "An unexpected error occurred" });
      return { success: false, error: err.message };
    }
  },

  // Ahoor external OAuth/Auth0 login simulation
  loginWithAhoor: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate external redirect handshake delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockAhoorToken = "ahoor_oauth_token_" + Math.random().toString(36).substring(7);
      const mockAhoorUser = {
        id: "gid://shopify/Customer/ahoor-999",
        firstName: "Ahoor",
        lastName: "User",
        email: "ahoor.shopper@thunnal.com",
        phone: "+91 94460 12345",
        defaultAddress: {
          id: "gid://shopify/MailingAddress/ahoor-addr-1",
          address1: "Brand Studio, 4th Floor",
          city: "Kochi",
          province: "Kerala",
          country: "India",
          zip: "682018"
        },
        addresses: [
          {
            id: "gid://shopify/MailingAddress/ahoor-addr-1",
            address1: "Brand Studio, 4th Floor",
            city: "Kochi",
            province: "Kerala",
            country: "India",
            zip: "682018"
          }
        ],
        orders: [
          {
            id: "gid://shopify/Order/ahoor-ord-1",
            orderNumber: 2045,
            processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            financialStatus: "PAID",
            fulfillmentStatus: "DELIVERED",
            totalPrice: {
              amount: "185.00",
              currencyCode: "USD"
            },
            lineItems: [
              {
                title: "MALABAR UTILITY JACKET",
                quantity: 1,
                variantTitle: "M",
                price: "185.00",
                image: "/products/jacket-front.png"
              }
            ]
          }
        ]
      };

      localStorage.setItem('thunnal_customer_token', mockAhoorToken);
      localStorage.setItem('thunnal_customer_user', JSON.stringify(mockAhoorUser));
      
      set({ token: mockAhoorToken, user: mockAhoorUser, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false, error: "Ahoor sign-in aborted" });
      return { success: false, error: err.message };
    }
  },

  // Clear customer session
  logout: () => {
    localStorage.removeItem('thunnal_customer_token');
    localStorage.removeItem('thunnal_customer_user');
    set({ token: null, user: null });
  },

  // Add new mailing address
  addAddress: async (addressData) => {
    const currentToken = get().token;
    if (!currentToken) return { success: false, error: "Unauthorized" };

    try {
      const updatedUser = await shopifyAddAddress(currentToken, addressData);
      if (updatedUser) {
        localStorage.setItem('thunnal_customer_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
        return { success: true };
      }
      return { success: false, error: "Failed to add address" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Update mailing address
  updateAddress: async (addressId, addressData) => {
    const currentToken = get().token;
    if (!currentToken) return { success: false, error: "Unauthorized" };

    try {
      const updatedUser = await shopifyUpdateAddress(currentToken, addressId, addressData);
      if (updatedUser) {
        localStorage.setItem('thunnal_customer_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
        return { success: true };
      }
      return { success: false, error: "Failed to update address" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Delete mailing address
  deleteAddress: async (addressId) => {
    const currentToken = get().token;
    if (!currentToken) return { success: false, error: "Unauthorized" };

    try {
      const updatedUser = await shopifyDeleteAddress(currentToken, addressId);
      if (updatedUser) {
        localStorage.setItem('thunnal_customer_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
        return { success: true };
      }
      return { success: false, error: "Failed to delete address" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}));
