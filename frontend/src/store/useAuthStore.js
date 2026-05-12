import { create } from 'zustand';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: null,
  loading: false,

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
  verifyOtp: async (email, otp) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      
      // Save tokens to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('token', data.accessToken);
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
  loginUser: async (formdata) =>{
    set({loading: true});
    try {
      const {data} = await api.post('/auth/login', formdata);
      localStorage.setItem('token', data.accessToken);
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
       return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  },
  logout: async (navigate) => {
    try {
      const { data } = await api.post('/auth/logout' , {token: localStorage.getItem('refreshToken')});
      if(data.success === false) return toast.error(data.message);
      toast.success("Logout successful"); 
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('token');
      set({ user: null, accessToken: null });
      navigate('/auth/login');
    } catch (error) {
      set({ user: null, accessToken: null });
      console.error(error);
    }
  }
}));