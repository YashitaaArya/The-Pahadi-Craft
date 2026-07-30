import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      set({
        items: items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }
  },
  removeItem: (productId) => {
    set({ items: get().items.filter(item => item.product.id !== productId) });
  },
  updateQuantity: (productId, quantity) => {
    set({
      items: get().items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  toggleCart: () => set({ isOpen: !get().isOpen }),
  getTotal: () =>
    get().items.reduce(
      (sum, item) => sum + (Number(item.product.price) * 1.18) * item.quantity,
      0
    ),
}));
