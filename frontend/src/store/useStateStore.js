import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useStateStore = create((set, get) => ({
  states: [],
  isLoading: false,

  fetchStates: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get("/states");
      set({ states: response.data.data || [], isLoading: false }); 
    } catch (error) {
      console.error("Error fetching states:", error);
      set({ isLoading: false });
    }
  },

fetchStateById: async (id) => {
  try {
    set({ isLoading: true });
    const response = await api.get(`/states/${id}`);
    set({ isLoading: false }); 
    
    return response.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to fetch state details";
    console.error(msg, error);
    
    set({ isLoading: false });
    return null;
  }
},

  createState: async (data, navigate) => {
    try {
      set({ isLoading: true });
      const response = await api.post("/states", data);
      const currentStates = get().states;
      set({ states: [...currentStates, response.data.data], isLoading: false });
      
      toast.success(response.data.message || "State created successfully");
      navigate("/admin/regions");
    } catch (error) {
      const msg = error.response?.data?.message || "Server connection failed";
      toast.error(msg);
      set({ isLoading: false });
    }
  },

  updateState: async (id, data, navigate) => {
    try {
      set({ isLoading: true });
      const response = await api.patch(`/states/${id}`, data); 
      
      const currentStates = get().states;
      set({
        states: currentStates.map((state) =>
          state._id === id ? response.data.data : state
        ),
        isLoading: false,
      });
      
      toast.success("State updated successfully");
      navigate("/admin/regions");
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
      set({ isLoading: false });
    }
  },

  deleteState: async (id) => {
    try {
      set({ isLoading: true });
      await api.delete(`/states/${id}`);
      
      const currentStates = get().states;
      set({
        states: currentStates.filter((state) => state._id !== id),
        isLoading: false,
      });
      
      toast.success("Region purged from registry");
    } catch (error) {
      const msg = error.response?.data?.message || "Could not connect to server";
      toast.error(msg);
      set({ isLoading: false });
    }
  },

  reset: () => set({ states: [], isLoading: false }),
}));