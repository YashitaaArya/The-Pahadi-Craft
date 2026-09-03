import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const loginAdmin = async (email: string, password: string) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductCategories = async (): Promise<{
  mainCategories: string[];
  subcategoriesByCategory: Record<string, string[]>;
  primeSubcategories: string[];
  secondarySubcategories: string[];
}> => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const downloadProductTemplate = async () => {
  const response = await api.get('/products/bulk-import/template', { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'pahadi-craft-product-template.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export interface BulkImportResult {
  totalRows: number;
  successCount: number;
  failCount: number;
  errors: { row: number | string; error: string }[];
}

export const bulkImportProducts = async (file: File): Promise<BulkImportResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/products/bulk-import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const createProduct = async (product: object) => {
  const response = await api.post('/products', product);
  return response.data;
};

export const updateProduct = async (productId: string, product: object) => {
  const response = await api.put(`/products/${productId}`, product);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  await api.delete(`/products/${productId}`);
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const updateOrderStatusApi = async (
  orderId: string,
  update: { status?: string; trackingNumber?: string }
) => {
  const response = await api.patch(`/orders/${orderId}/status`, update);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getReviews = async () => {
  const response = await api.get('/reviews');
  return response.data;
};

export const getFeedback = async () => {
  const response = await api.get('/feedback');
  return response.data;
};

export const getTestimonials = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

// Admin dashboard: every testimonial regardless of approval status
export const getAllTestimonialsAdmin = async () => {
  const response = await api.get('/testimonials/admin');
  return response.data;
};

export const createTestimonial = async (data: {
  name: string;
  content: string;
  rating: number;
  images?: string[];
  status?: 'pending' | 'approved' | 'rejected';
}) => {
  const response = await api.post('/testimonials', data);
  return response.data;
};

export const updateTestimonial = async (id: string, data: Partial<{
  name: string;
  content: string;
  rating: number;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
}>) => {
  const response = await api.put(`/testimonials/${id}`, data);
  return response.data;
};

export const deleteTestimonial = async (id: string) => {
  await api.delete(`/testimonials/${id}`);
};

export const getLikedProductIds = async (uid: string): Promise<string[]> => {
  const response = await api.get(`/user/liked-products`, { params: { uid } });
  return response.data.likedProducts;
};

export const toggleProductLike = async (uid: string, productId: string): Promise<{ liked: boolean }> => {
  const response = await api.post('/user/liked-products/toggle', { uid, productId });
  return response.data;
};

export const uploadCustomerReviewImage = async (file: File, uid: string): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('uid', uid);
  const response = await api.post('/upload/customer-review', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.url;
};

// Public - any logged-in customer can call this. Always lands as "pending"
// on the backend, so nothing shows on the site until an admin approves it.
export const submitCustomerTestimonial = async (data: {
  name: string;
  content: string;
  rating: number;
  images?: string[];
}) => {
  const response = await api.post('/testimonials/submit', data);
  return response.data;
};

export const getBanners = async () => {
  const response = await api.get('/banners');
  return response.data;
};

export const getAllBannersAdmin = async () => {
  const response = await api.get('/banners/admin');
  return response.data;
};

export const createBanner = async (data: {
  title: string;
  description?: string;
  image: string;
  link?: string;
  active?: boolean;
  position?: number;
}) => {
  const response = await api.post('/banners', data);
  return response.data;
};

export const updateBanner = async (id: string, data: Partial<{
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
  position: number;
}>) => {
  const response = await api.put(`/banners/${id}`, data);
  return response.data;
};

export const deleteBanner = async (id: string) => {
  await api.delete(`/banners/${id}`);
};

// --- Collections (homepage category showcase) ---

export interface CollectionCard {
  category: string;
  image: string;
  tagline: string;
}

export const getCollections = async (): Promise<CollectionCard[]> => {
  const response = await api.get('/collections');
  return response.data;
};

export const updateCollection = async (category: string, data: { image?: string; tagline?: string }) => {
  const response = await api.put(`/collections/${encodeURIComponent(category)}`, data);
  return response.data;
};

// --- Admin team management (developer only) ---

export const bulkDeleteProducts = async (ids: string[]): Promise<{ deletedCount: number }> => {
  const response = await api.post('/products/bulk-delete', { ids });
  return response.data;
};

export const getAdminTeam = async () => {
  const response = await api.get('/admin/team');
  return response.data;
};

export const createAdminTeamMember = async (data: {
  email: string;
  password: string;
  name: string;
  adminRole: 'developer' | 'owner' | 'sales';
}) => {
  const response = await api.post('/admin/team', data);
  return response.data;
};

export const deleteAdminTeamMember = async (id: string) => {
  await api.delete(`/admin/team/${id}`);
};

// --- Product image upload (Cloudinary, via our backend) ---

export const uploadProductImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.url;
};