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

export const getBanners = async () => {
  const response = await api.get('/banners');
  return response.data;
};

// --- Admin team management (developer only) ---

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
