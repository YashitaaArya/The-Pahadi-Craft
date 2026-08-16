import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth';
import axios from 'axios';
import { auth, googleProvider } from '../firebase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Saves/updates the customer record in our own database (not Firebase) -
// this is what makes them show up in the admin dashboard's Customers list
// and lets the owner send promotions/discounts down the line. Every login
// path (sign up, sign in, Google) calls this, since it's how a customer
// actually gets into the database, not just Firebase's own user store.
async function saveCustomerToDatabase(data: {
  uid: string;
  email: string;
  name?: string;
  photo?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) {
  try {
    await axios.post(`${BACKEND_URL}/api/user/save`, data);
  } catch (err) {
    // Don't block login if this fails - the person is still authenticated
    // via Firebase either way. Just log it so it's visible for debugging.
    console.error('Failed to save customer record:', err);
  }
}

interface SignUpData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;

  signIn: (data: { email: string; password: string }) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      set({ user: result.user });
      await saveCustomerToDatabase({
        uid: result.user.uid,
        email: result.user.email || email,
        name: result.user.displayName || undefined,
        photo: result.user.photoURL || undefined,
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async ({ email, password, name, phone, street, city, state, pincode }) => {
    set({ loading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      set({ user: result.user });
      await saveCustomerToDatabase({
        uid: result.user.uid,
        email: result.user.email || email,
        name,
        phone,
        street,
        city,
        state,
        pincode,
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      set({ user: result.user });
      await saveCustomerToDatabase({
        uid: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || undefined,
        photo: result.user.photoURL || undefined,
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));

// 🔄 Persist auth state on refresh/login/logout
onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});