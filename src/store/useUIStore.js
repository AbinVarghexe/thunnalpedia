import { create } from 'zustand';

export const useUIStore = create((set) => ({
  cartOpen: false,
  searchOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  setSearchOpen: (open) => set({ searchOpen: open }),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
}));
