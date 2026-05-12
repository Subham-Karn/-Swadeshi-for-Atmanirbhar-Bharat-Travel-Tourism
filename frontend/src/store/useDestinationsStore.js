import {create} from "zustand";
import axios from "../api/axios";
export const useDestinationsStore = create((set) => ({
    destinations: [],
    destinationsById: [],
    isLoading: false,
    fetchDestinations: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get("/destinations/all");
            set({ destinations: response.data?.data || [] });
        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            set({ isLoading: false });
        }
    },
    fetchDestinationsById: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`/destinations/all/${id}`);
            console.log(response.data);
            
            set({ destinationsById: response.data?.data || [] });

        } catch (error) {
            console.error("Error fetching destinations:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));