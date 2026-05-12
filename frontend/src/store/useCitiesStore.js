import { create } from "zustand";
import api from "../api/axios";
export const useCitiesStore = create((set) => ({
    cities: [],
    isLoading: false,
    fetchCitiesByStateId: async (stateId) => {
        try {
            set({ isLoading: true });
            const response = await api.get(`/cities/state/${stateId}`);
            set({ cities: response.data.data || [] });
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            set({ isLoading: false });
        }
    },
    setIsLoading: (isLoading) => set({ isLoading }),
}));