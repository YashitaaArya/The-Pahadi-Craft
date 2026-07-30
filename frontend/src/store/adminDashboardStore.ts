import { create } from 'zustand';
import { Product, Order, User, Analytics, SalesTrend, Review, Feedback, Testimonial, Banner } from '../types';
import {
  getAnalytics,
  getProducts,
  createProduct,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
  getOrders,
  getUsers,
  getReviews,
  getFeedback,
  getTestimonials,
  getBanners,
  updateOrderStatusApi,
} from '../api/adminApi';
import { useProductStore } from './productStore';

interface AdminDashboardStore {
  // Analytics
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;

  // Data Management
  products: Product[];
  orders: Order[];
  users: User[];
  reviews: Review[];
  feedback: Feedback[];
  testimonials: Testimonial[];
  banners: Banner[];

  // Fetch methods
  fetchAnalytics: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchReviews: () => Promise<void>;
  fetchFeedback: () => Promise<void>;
  fetchTestimonials: () => Promise<void>;
  fetchBanners: () => Promise<void>;

  // Product operations
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Order operations
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  updateOrderShipping: (orderId: string, trackingNumber: string) => Promise<void>;

  // User operations
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;

  // Review operations
  approveReview: (reviewId: string) => void;
  rejectReview: (reviewId: string) => void;

  // Feedback operations
  markFeedbackAsRead: (feedbackId: string) => void;
  respondToFeedback: (feedbackId: string, response: string) => void;

  // Testimonial operations
  approveTestimonial: (testimonialId: string) => void;
  rejectTestimonial: (testimonialId: string) => void;

  // Banner operations
  createBanner: (banner: Banner) => void;
  updateBanner: (banner: Banner) => void;
  deleteBanner: (bannerId: string) => void;
}

export const useAdminDashboardStore = create<AdminDashboardStore>((set, get) => ({
  analytics: null,
  loading: false,
  error: null,
  products: [],
  orders: [],
  users: [],
  reviews: [],
  feedback: [],
  testimonials: [],
  banners: [],

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const analytics = await getAnalytics();
      set({ analytics, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load analytics', loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await getProducts();
      set({ products, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load products', loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await getOrders();
      set({ orders, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load orders', loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await getUsers();
      set({ users, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load users', loading: false });
    }
  },

  fetchReviews: async () => {
    set({ loading: true, error: null });
    try {
      const reviews = await getReviews();
      set({ reviews, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load reviews', loading: false });
    }
  },

  fetchFeedback: async () => {
    set({ loading: true, error: null });
    try {
      const feedback = await getFeedback();
      set({ feedback, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load feedback', loading: false });
    }
  },

  fetchTestimonials: async () => {
    set({ loading: true, error: null });
    try {
      const testimonials = await getTestimonials();
      set({ testimonials, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load testimonials', loading: false });
    }
  },

  fetchBanners: async () => {
    set({ loading: true, error: null });
    try {
      const banners = await getBanners();
      set({ banners, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to load banners', loading: false });
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const created = await createProduct(product);
      set({ products: [...get().products, created], loading: false });
      // refresh public product list
      try { useProductStore.getState().fetchProducts(); } catch (e) {}
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to add product', loading: false });
    }
  },

  updateProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateProductApi(product.id, product);
      set({
        products: get().products.map((p) => (p.id === updated.id ? updated : p)),
        loading: false,
      });
      // refresh public product list
      try { useProductStore.getState().fetchProducts(); } catch (e) {}
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to update product', loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      await deleteProductApi(productId);
      set({ products: get().products.filter((p) => p.id !== productId), loading: false });
      // refresh public product list
      try { useProductStore.getState().fetchProducts(); } catch (e) {}
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Unable to delete product', loading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    // Optimistic update, then sync with backend
    set({
      orders: get().orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ),
    });
    try {
      await updateOrderStatusApi(orderId, { status });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Failed to update order status' });
    }
  },

  updateOrderShipping: async (orderId, trackingNumber) => {
    set({
      orders: get().orders.map(order =>
        order.id === orderId ? { ...order, trackingNumber } : order
      ),
    });
    try {
      await updateOrderStatusApi(orderId, { trackingNumber });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || err.message || 'Failed to update tracking number' });
    }
  },

  blockUser: (userId) => {
    set({
      users: get().users.map(user =>
        user.id === userId ? { ...user, status: 'blocked' } : user
      ),
    });
  },

  unblockUser: (userId) => {
    set({
      users: get().users.map(user =>
        user.id === userId ? { ...user, status: 'active' } : user
      ),
    });
  },

  approveReview: (reviewId) => {
    set({
      reviews: get().reviews.map(review =>
        review.id === reviewId ? { ...review, status: 'approved' } : review
      ),
    });
  },

  rejectReview: (reviewId) => {
    set({
      reviews: get().reviews.map(review =>
        review.id === reviewId ? { ...review, status: 'rejected' } : review
      ),
    });
  },

  markFeedbackAsRead: (feedbackId) => {
    set({
      feedback: get().feedback.map(fb =>
        fb.id === feedbackId ? { ...fb, status: 'read' } : fb
      ),
    });
  },

  respondToFeedback: (feedbackId, response) => {
    set({
      feedback: get().feedback.map(fb =>
        fb.id === feedbackId ? { ...fb, status: 'responded', response } : fb
      ),
    });
  },

  approveTestimonial: (testimonialId) => {
    set({
      testimonials: get().testimonials.map(test =>
        test.id === testimonialId ? { ...test, status: 'approved' } : test
      ),
    });
  },

  rejectTestimonial: (testimonialId) => {
    set({
      testimonials: get().testimonials.map(test =>
        test.id === testimonialId ? { ...test, status: 'rejected' } : test
      ),
    });
  },

  createBanner: (banner) => {
    set({ banners: [...get().banners, banner] });
  },

  updateBanner: (banner) => {
    set({
      banners: get().banners.map(b => b.id === banner.id ? banner : b),
    });
  },

  deleteBanner: (bannerId) => {
    set({
      banners: get().banners.filter(b => b.id !== bannerId),
    });
  },
}));
