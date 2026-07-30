import { create } from 'zustand';
import { Product, Order, User } from '../types';

interface AdminStore {
  products: Product[];
  orders: Order[];
  users: User[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  products: [],
  orders: [],
  users: [],
  addProduct: (product) => {
    set({ products: [...get().products, product] });
  },
  updateProduct: (product) => {
    set({
      products: get().products.map(p =>
        p.id === product.id ? product : p
      ),
    });
  },
  deleteProduct: (productId) => {
    set({
      products: get().products.filter(p => p.id !== productId),
    });
  },
  updateOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ),
    });
  },
}));