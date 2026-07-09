import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useBookingStore = create((set) => ({
  bookings: [],
  adminBookings: [],
  isLoading: false,

  checkoutAndBook: async (payload) => {
    try {
      set({ isLoading: true });
      const res = await api.post("/bookings/create", payload);
      toast.success("Seat reservation ledger initialized successfully!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking creation failure context");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserBookings: async (userId) => {
    try {
      set({ isLoading: true });
      const res = await api.get(`/bookings/user/${userId}`);
      set({ bookings: res.data?.data || [] });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAdminBookings: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/bookings/admin/all");
      set({ adminBookings: res.data?.data || [] });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  alterStatus: async (id, payload) => {
    try {
      await api.patch(`/bookings/admin/status/${id}`, payload);
      toast.success("Manifest record state synchronized");
      return true;
    } catch (err) {
      return false;
    }
  }
}));