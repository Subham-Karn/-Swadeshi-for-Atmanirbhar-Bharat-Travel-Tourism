import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useCitiesStore = create((set, get) => ({
  cities: [],
  isLoading: false,

  fetchCitiesByStateId: async (stateId) => {
    if (!stateId) return;
    try {
      set({ isLoading: true });
      const response = await api.get(`/cities/state/${stateId}`);
      set({ cities: response.data.data || [] });
    } catch (error) {
      console.error("Error fetching cities:", error);
      set({ cities: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCityById: async (cityId) => {
    set({ isLoading: true });
    try {
      if (!cityId) throw new Error("City ID is required");
      const response = await api.get(`/cities/${cityId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching city details:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createCity: async (city, navigate) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/cities", city);
      const newCity = response.data.data;
      
      set((state) => ({ cities: [...state.cities, newCity] }));
      toast.success("City created successfully");
      await get().fetchCitiesByStateId(city.regionId);
      
      if (navigate) navigate(`/admin/regions/${city.regionId}/view`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create city");
    } finally {
      set({ isLoading: false });
    }
  },

  updateCity: async (cityId, cityData, stateId, navigate) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(`/cities/${cityId}`, cityData);
      const updatedCity = response.data.data;
      
      set((state) => ({
        cities: state.cities.map((c) => (c._id === cityId ? updatedCity : c)),
      }));
      
      toast.success("City updated successfully");
      await get().fetchCitiesByStateId(stateId);
      
      if (navigate) navigate(`/admin/regions/${stateId}/view`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update city");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCity: async (cityId, stateId) => {
    try {
      await api.delete(`/cities/${cityId}`);
      
      set((state) => ({
        cities: state.cities.filter((c) => c._id !== cityId),
      }));
      
      toast.success("City deleted successfully");
      get().fetchCitiesByStateId(stateId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete city");
    }
  },
}));