import { create } from 'zustand';
import api from '../api/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: null,
  loading: false,
  adminUsers: [],
  adminDashboard: null,

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
      localStorage.setItem('token', data.token);
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
      localStorage.setItem('token', data.token);
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
  forgetPassword: async (email) => {
    try {
      const response = await api.post('/auth/forget-password', { email });
      const msg = response.data.message || "Password reset link has been sent to your email";
      toast.success(msg);
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } 
  },
  resetPassword: async (id, token, formData) => {
    try {
       const response = await api.post(`/auth/reset-password/${id}/${token}`, formData);
       const msg = response.data.message || "Password reset successfully";
       toast.success(msg);
       return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  },
  fetchAdminUsers: async (search = "", role = "all") => {
    set({ loading: true });
    try {
      const params = new URLSearchParams({ search, role });
      const { data } = await api.get(`/auth/admin/users?${params.toString()}`);
      set({ adminUsers: data.data || [], loading: false });
      return data.data || [];
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to load users");
      return [];
    }
  },
  createAdminUser: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/admin/users', payload);
      set((state) => ({
        adminUsers: [data.data, ...state.adminUsers],
        loading: false,
      }));
      toast.success(data.message || "User created");
      return { success: true, data: data.data };
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to create user");
      return { success: false };
    }
  },
  updateAdminUser: async (id, payload) => {
    try {
      const { data } = await api.patch(`/auth/admin/users/${id}`, payload);
      set((state) => ({
        adminUsers: state.adminUsers.map((user) => user._id === id ? data.data : user)
      }));
      toast.success(data.message || "User updated");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
      return false;
    }
  },
  fetchAdminDashboard: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/auth/admin/dashboard");
      set({ adminDashboard: data.data, loading: false });
      return data.data;
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Failed to load dashboard");
      return null;
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
      if (navigate) navigate('/auth/login');
    } catch (error) {
      set({ user: null, accessToken: null });
      console.error(error);
    }
  }
}));
