import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (cartItemKey: string) => void;
  updateQuantity: (cartItemKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  
}

export const getCartItemKey = (product: Product) => [
  product.id,
  product.selectedColorVariant?.sku || product.selectedColorVariant?.colorName || '',
  product.selectedFragranceVariant?.sku || product.selectedFragranceVariant?.fragranceName || '',
].join('::');

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product, quantity = 1) => {
    const items = get().items;
    const cartItemKey = getCartItemKey(product);
    const existingItem = items.find(item => getCartItemKey(item.product) === cartItemKey);

    if (existingItem) {
      const nextItems = items.map(item =>
        getCartItemKey(item.product) === cartItemKey
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      set({ items: nextItems, isOpen: true });
    } else {
      set({ items: [...items, { product, quantity }], isOpen: true });
    }
  },
  removeItem: (cartItemKey) => {
    const nextItems = get().items.filter(item => getCartItemKey(item.product) !== cartItemKey);
    set({ items: nextItems, isOpen: nextItems.length > 0 ? get().isOpen : false });
  },
  updateQuantity: (cartItemKey, quantity) => {
    set({
      items: get().items.map(item =>
        getCartItemKey(item.product) === cartItemKey
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    });
  },
  clearCart: () => set({ items: [], isOpen: false }),
  toggleCart: () => set({ isOpen: get().items.length === 0 ? false : !get().isOpen }),
  getTotal: () =>
    get().items.reduce(
      (sum, item) => sum + (Number(item.product.price) * 1.18) * item.quantity,
      0
    ),
}));
