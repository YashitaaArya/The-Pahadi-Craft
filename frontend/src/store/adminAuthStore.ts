import { create } from 'zustand';
import { AdminUser } from '../types';
import { loginAdmin, setAuthToken } from '../api/adminApi';

interface AdminAuthStore {
  adminUser: AdminUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Auth methods
  adminLogin: (email: string, password: string) => Promise<void>;
  adminLogout: () => Promise<void>;
  verifyAdminRole: (requiredRole?: string) => boolean;
  setAdminUser: (user: AdminUser) => void;
  clearError: () => void;
}

// Note: demo credentials removed from frontend for security. Use backend admin users.

export const useAdminAuthStore = create<AdminAuthStore>((set, get) => ({
  adminUser: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  adminLogin: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { token, adminUser } = await loginAdmin(email, password);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      setAuthToken(token);
      set({
        adminUser,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err.message || 'Admin login failed';
      set({
        error: errorMessage,
        loading: false,
        isAuthenticated: false,
      });
      throw err;
    }
  },

  adminLogout: async () => {
    set({ loading: true });
    try {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAuthToken(null);

      set({
        adminUser: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      set({
        error: err.message,
        loading: false,
      });
      throw err;
    }
  },

  verifyAdminRole: (requiredPermission?: string): boolean => {
    const { adminUser } = get();

    if (!adminUser) return false;

    if (requiredPermission) {
      return adminUser.permissions.includes(requiredPermission) || adminUser.permissions.includes('all');
    }

    return true;
  },

  setAdminUser: (user: AdminUser) => {
    set({ adminUser: user });
    localStorage.setItem('adminUser', JSON.stringify(user));
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Persist admin auth state on app load
export const initializeAdminAuth = () => {
  try {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('adminUser');

    if (storedToken && storedUser) {
      const adminUser = JSON.parse(storedUser) as AdminUser;
      setAuthToken(storedToken);
      useAdminAuthStore.setState({
        token: storedToken,
        adminUser,
        isAuthenticated: true,
      });
    }
  } catch (error) {
    console.error('Failed to initialize admin auth:', error);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};
