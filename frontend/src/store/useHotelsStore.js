import { create } from "zustand";
import axios from "../api/axios";

export const useHotelStore = create((set, get) => ({
  allHotels: [],               
  cityHotels: [],             
  currentHotel: null,         
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedTier: "all",


  getMetrics: () => {
    const { cityHotels } = get();
    if (cityHotels.length === 0) return { total: 0, luxuryCount: 0, avgPrice: 0 };

    const total = cityHotels.length;
    const luxuryCount = cityHotels.filter(
      (h) => h.tier === "luxury" || h.tier === "premium-luxury"
    ).length;
    const avgPrice = Math.round(
      cityHotels.reduce((acc, h) => acc + h.pricePerNight, 0) / total
    );

    return { total, luxuryCount, avgPrice };
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTier: (tier) => set({ selectedTier: tier }),

  fetchAllHotels: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/hotels`);
      set({ allHotels: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Global lookup failure", isLoading: false });
    }
  },

  fetchHotelsByCityId: async (cityName, cityId) => {
    if (!cityId) return;
    set({ isLoading: true, error: null });
    try {
      const url = `/hotels/${cityName.replace(/\s+/g , '-')}/${cityId}/all`;
      const response = await axios.get(url);
      set({ cityHotels: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ cityHotels: [], error: err.response?.data?.message || "City index lookup failure", isLoading: false });
    }
  },

  fetchHotelById: async (id) => {
    if (!id) return;
    set({ isLoading: true, error: null, currentHotel: null });
    try {
      const response = await axios.get(`/hotels/${id}`);
      set({ currentHotel: response.data?.data || null, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Document retrieval failure", isLoading: false });
    }
  },


  createHotel: async (stateName, cityName, cityId, hotelPayload) => {
    set({ isLoading: true, error: null });
    try {
      const url = `hotels/${cityName?.replace(/\s+/g, '-')}/${cityId}/create`;
      const response = await axios.post(url, hotelPayload);

      set((state) => ({
        cityHotels: [response.data.data, ...state.cityHotels],
        allHotels: [response.data.data, ...state.allHotels],
        isLoading: false
      }));
      return { success: true, data: response.data.data };
    } catch (err) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || "Failed to publish hotel profile");
    }
  },

  updateHotel: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/hotels/${id}/update`, updatedFields);
      const updatedNode = response.data.data;
      set((state) => ({
        currentHotel: state.currentHotel?._id === id ? updatedNode : state.currentHotel,
        cityHotels: state.cityHotels.map((h) => (h._id === id ? updatedNode : h)),
        allHotels: state.allHotels.map((h) => (h._id === id ? updatedNode : h)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || "Failed to update target hotel parameters");
    }
  },

  deleteHotel: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/hotels/${id}`);
    
      set((state) => ({
        cityHotels: state.cityHotels.filter((h) => h._id !== id),
        allHotels: state.allHotels.filter((h) => h._id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || "Purge mutation failure exception processing");
    }
  }
}));