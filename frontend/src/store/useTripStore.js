import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useTripStore = create((set, get) => ({
  trips: [],
  adminTrips: [],
  currentTrip: null,
  isLoading: false,
  error: null,
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
  },

  fetchUserTrips: async (userId) => {
    if (!userId) return;
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/trips/user/${userId}`);
      const data = response.data?.data || response.data || [];
      set({ trips: data });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to parse travel logs";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAdminTrips: async (page = 1, limit = 20, status = 'all', search = '') => {
    try {
      set({ isLoading: true, error: null });
      
      let queryPath = `/trips/admin/all?page=${page}&limit=${limit}`;
      if (status && status !== 'all') queryPath += `&status=${status}`;
      if (search) queryPath += `&search=${encodeURIComponent(search)}`;

      const response = await api.get(queryPath);
      const payload = response.data;
      
      set({ 
        adminTrips: payload?.data || [],
        pagination: payload?.pagination || {
          totalRecords: payload?.data?.length || 0,
          currentPage: page,
          totalPages: 1,
          hasNextPage: false
        }
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to retrieve master registry logs";
      set({ error: msg });
      toast.error(msg);
    } finally {
      set({ isLoading: false });
    }
  },

  createTrip: async (tripPayload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/trips/admin/create', tripPayload);
      const newTrip = response.data?.data || response.data;
      
      set((state) => ({
        adminTrips: [newTrip, ...state.adminTrips],
        trips: state.trips.some(t => t.userId === newTrip.userId) 
          ? [newTrip, ...state.trips] 
          : state.trips
      }));

      toast.success(response.data?.message || 'Itinerary logged and compiled successfully');
      return { success: true, data: newTrip };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to compile itinerary profile";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  

  updateTrip: async (tripId, tripPayload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.put(`/trips/admin/update/${tripId}`, tripPayload);
      const updatedTrip = response.data?.data || response.data;

      set((state) => ({
        adminTrips: state.adminTrips.map((t) => t._id === tripId ? updatedTrip : t),
        trips: state.trips.map((t) => t._id === tripId ? updatedTrip : t),
        currentTrip: state.currentTrip?._id === tripId ? updatedTrip : state.currentTrip
      }));

      toast.success(response.data?.message || 'Itinerary modifications updated successfully');
      return { success: true, data: updatedTrip };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update itinerary modifications";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      set({ isLoading: false });
    }
  },

  updateTripStatus: async (tripId, status) => {
    try {
      set({ error: null });
      const response = await api.patch(`/trips/admin/status/${tripId}`, { status });
      const updatedTrip = response.data?.data || response.data;

      set((state) => ({
        adminTrips: state.adminTrips.map((t) => t._id === tripId ? { ...t, status: updatedTrip.status } : t),
        trips: state.trips.map((t) => t._id === tripId ? { ...t, status: updatedTrip.status } : t),
        currentTrip: state.currentTrip?._id === tripId ? { ...state.currentTrip, status: updatedTrip.status } : state.currentTrip
      }));

      toast.success(response.data?.message || 'Itinerary state altered successfully');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update target status";
      toast.error(msg);
      return false;
    }
  },

  deleteTrip: async (tripId) => {
    try {
      set({ error: null });
      const response = await api.delete(`/trips/admin/delete/${tripId}`);

      set((state) => ({
        adminTrips: state.adminTrips.filter((t) => t._id !== tripId),
        trips: state.trips.filter((t) => t._id !== tripId),
        currentTrip: state.currentTrip?._id === tripId ? null : state.currentTrip
      }));

      toast.success(response.data?.message || 'Itinerary record permanently erased');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to execute document deletion";
      toast.error(msg);
      return false;
    }
  },

  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  
  clearTripErrors: () => set({ error: null }),
  
  resetTripStore: () => set({ 
    trips: [], 
    adminTrips: [], 
    currentTrip: null, 
    error: null, 
    isLoading: false,
    pagination: { totalRecords: 0, currentPage: 1, totalPages: 1, hasNextPage: false }
  })
}));