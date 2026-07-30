import { create } from 'zustand';
import { Product } from '../types';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    const items = get().items;
    if (!items.find(item => item.id === product.id)) {
      set({ items: [...items, product] });
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.id !== productId) });
  },
  isInWishlist: (productId) => {
    return get().items.some(item => item.id === productId);
  },
}));