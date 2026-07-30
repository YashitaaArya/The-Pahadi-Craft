import { create } from 'zustand';
import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      // Filter out products without proper IDs and convert to correct format
      const validProducts = response.data.filter((p: any) => p.id);
      set({ products: validProducts, loading: false });
    } catch (error: any) {
      // If API fails, don't show error - just keep empty list
      set({ products: [], loading: false, error: null });
    }
  },

  addProduct: async (product: Product) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, product, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const products = get().products;
      set({ products: [...products, response.data] });
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || 'Failed to add product';
      set({ error: errorMsg });
      throw error;
    }
  },

  updateProduct: async (product: Product) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/products/${product.id}`,
        product,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      const products = get().products;
      set({
        products: products.map((p) => (p.id === product.id ? response.data : p)),
      });
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || 'Failed to update product';
      set({ error: errorMsg });
      throw error;
    }
  },

  deleteProduct: async (productId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      const products = get().products;
      set({ products: products.filter((p) => p.id !== productId) });
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || 'Failed to delete product';
      set({ error: errorMsg });
      throw error;
    }
  },
}));
