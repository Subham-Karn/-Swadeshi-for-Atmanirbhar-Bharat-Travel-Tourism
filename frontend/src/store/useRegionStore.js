import { create } from 'zustand';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useRegionsStore = create((set, get) => ({
  regions: [],
  cities: [], 
  isLoading: false,

  // 1. CREATE REGION (State + City Workflow)
  createRegion: async (formData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/regions/create', formData);
      
      if (data.success) {
        // Update local state with the new data returned from backend
        set((state) => ({
          regions: [...state.regions, data.data.state],
          cities: [...state.cities, data.data.city]
        }));
        toast.success("Region created successfully!");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create region";
      toast.error(msg);
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. FETCH ALL STATES
  fetchStates: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/regions/states');
      if (data.success) set({ regions: data.data });
    } catch (error) {
      toast.error("Error loading states");
    } finally {
      set({ isLoading: false });
    }
  },

  // 3. FETCH CITIES BY STATE ID
  fetchCitiesByState: async (stateId) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/regions/cities/${stateId}`);
      if (data.success) set({ cities: data.data });
    } catch (error) {
      toast.error("Error loading cities");
    } finally {
      set({ isLoading: false });
    }
  },

  // 4. UPDATE REGION (State or City)
updateRegion: async (id, payload) => {
    set({ isLoading: true });
    try {
      const { data } = await api.patch(`/regions/update/${id}`, payload);
      if (data.success) {
        set((state) => ({
          regions: state.regions.map((r) => (r._id === id ? data.data : r))
        }));
        toast.success("Changes Saved!");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      set({ isLoading: false });
    }
  },

  // 5. DELETE REGION
   deleteRegion: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.delete(`/regions/delete/region/${id}`);
      if (data.success) {
        set((state) => ({
          regions: state.regions.filter((r) => r._id !== id)
        }));
        toast.success("Region Deleted");
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      set({ isLoading: false });
    }
  }
}));