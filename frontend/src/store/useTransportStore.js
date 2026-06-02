import { create } from "zustand";
import axios from "../api/axios";

const API_BASE_URL = "/transports";

export const useTransportStore = create((set, get) => ({
  allTransport: [],             
  cityTransport: [],            
  currentTransport: null,     
  isLoading: false,
  error: null,

  searchQuery: "",
  selectedMode: "all",



  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedMode: (mode) => set({ selectedMode: mode }),

  // Fetch all registered transit operators across the master platform ledger
  fetchAllTransport: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      set({ allTransport: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Global logistics lookup failure", 
        isLoading: false 
      });
    }
  },

  fetchTransportByCityId: async ( cityName, cityId) => {
    if (!cityId) return;
    set({ isLoading: true, error: null });
    try {
      const url = `${API_BASE_URL}/${cityName}/${cityId}/all`;
      const response = await axios.get(url);
      set({ cityTransport: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ 
        cityTransport: [], 
        error: err.response?.data?.message || "City transit tracking anomaly", 
        isLoading: false 
      });
    }
  },

  fetchTransportById: async (id) => {
    if (!id) return;
    set({ isLoading: true, error: null, currentTransport: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      set({ currentTransport: response.data?.data || null, isLoading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Transit row document retrieval block error", 
        isLoading: false 
      });
    }
  },

  // Publishes a new transit route profile directly into the database system registries
  createTransport: async (stateName, cityName, cityId, transportPayload) => {
    set({ isLoading: true, error: null });
    try {
      const sanitizedPayload = {
        ...transportPayload,
        mode: transportPayload.mode?.toLowerCase().trim(),
        coverage: transportPayload.coverage?.toLowerCase().trim(),
      };

      const url = `${API_BASE_URL}/${cityName}/${cityId}/create`;
      const response = await axios.post(url, sanitizedPayload);
      const newTransitData = response.data.data;
      set((state) => ({
        cityTransport: [newTransitData, ...state.cityTransport],
        allTransport: [newTransitData, ...state.allTransport],
        isLoading: false
      }));
      return { success: true, data: newTransitData };
    } catch (err) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || "Failed to publish transit line node profile");
    }
  },

  updateTransport: async (id, updatedFields) => {
    set({ isLoading: true, error: null });
    try {
      const sanitizedFields = { ...updatedFields };
      if (sanitizedFields.mode) sanitizedFields.mode = sanitizedFields.mode.toLowerCase().trim();
      if (sanitizedFields.coverage) sanitizedFields.coverage = sanitizedFields.coverage.toLowerCase().trim();

      const response = await axios.put(`${API_BASE_URL}/${id}/update`, sanitizedFields);
      const updatedNode = response.data.data;
      set((state) => ({
        currentTransport: state.currentTransport?._id === id ? updatedNode : state.currentTransport,
        cityTransport: state.cityTransport.map((t) => (t._id === id ? updatedNode : t)),
        allTransport: state.allTransport.map((t) => (t._id === id ? updatedNode : t)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || "Failed to modify targeted transport line settings");
    }
  },

  deleteTransport: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      set((state) => ({
        cityTransport: state.cityTransport.filter((t) => t._id !== id),
        allTransport: state.allTransport.filter((t) => t._id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      throw new Error(err.response?.data?.message || "Purge execution mutation process anomaly drop");
    }
  }
}));