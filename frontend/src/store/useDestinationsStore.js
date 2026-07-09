import {create} from "zustand";
import axios from "../api/axios";
export const useDestinationsStore = create((set) => ({
    destinations: [],
    destinationsById: [],
    destinationsCollection: [],
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

    fetchDestinationsCollection: async () =>{
        try {
        set({isLoading:true});
         const response = await axios.get("/destinations/collections/all");
         set({destinationsCollection: response.data.destinations || []})
        } catch (error) {
            console.error("Error fetch destinationsCollection: " , error);
        }finally{
            set({isLoading:false});
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