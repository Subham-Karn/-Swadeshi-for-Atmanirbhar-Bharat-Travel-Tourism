import { create } from 'zustand';
import api from '../api/axios.js';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: null,
  loading: false,

  // Step 1: Request OTP
  requestSignup: async (formData) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/request-signup', formData);
      set({ loading: false });
      return { success: true, message: data.message };
    } catch (error) {
      set({ loading: false });
      throw error.response?.data?.message || "Signup failed";
    }
  },

  // Step 2: Verify OTP & Finalize Account
  verifyOtp: async (email, otp) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      
      // Save tokens and user info
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      set({ 
        user: data.user, 
        accessToken: data.accessToken, 
        loading: false 
      });
      return { success: true };
    } catch (error) {
      set({ loading: false });
      throw error.response?.data?.message || "Verification failed";
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    set({ user: null, accessToken: null });
  }
}));