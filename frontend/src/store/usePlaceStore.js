import { create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

export const usePlaceStore = create((set, get) => ({
  places: [], 
  allPlaces: [],
  isLoading: false,

  // Fetch all places (The "Normal" one)
  fetchAllPlaces: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get("/places");
      set({ allPlaces: response.data.data || [] });
    } catch (error) {
      console.error("Error fetching all places:", error);
      toast.error("Failed to load places");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch places for a specific city
  fetchPlacesByCity: async (cityId) => {
    set({ isLoading: true });
    try {
      if (!cityId) return;
      const response = await api.get(`/places/city/${cityId}`);
      set({ places: response.data.data || [] });
    } catch (error) {
      console.error("Error fetching city places:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch single place details
  fetchPlaceById: async (placeId) => {
    set({ isLoading: true });
    try {
      const response = await api.get(`/places/${placeId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching place details:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new place
  addPlace: async (placeData, navigate) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/places", placeData);
      const newPlace = response.data.data;

      // Update local state
      set((state) => ({ 
        allPlaces: [newPlace, ...state.allPlaces],
        places: [newPlace, ...state.places] 
      }));

      toast.success("Place added successfully");
      if (navigate) navigate(-1); // Go back to the city view
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding place");
    } finally {
      set({ isLoading: false });
    }
  },

  // Update an existing place
  updatePlace: async (placeId, updatedData, navigate) => {
    set({ isLoading: true });
    try {
      const response = await api.patch(`/places/${placeId}`, updatedData);
      const updatedPlace = response.data.data;

      set((state) => ({
        allPlaces: state.allPlaces.map((p) => p._id === placeId ? updatedPlace : p),
        places: state.places.map((p) => p._id === placeId ? updatedPlace : p)
      }));

      toast.success("Place updated successfully");
      if (navigate) navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating place");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a place
  deletePlace: async (placeId) => {
    try {
      await api.delete(`/places/${placeId}`);

      set((state) => ({
        allPlaces: state.allPlaces.filter((p) => p._id !== placeId),
        places: state.places.filter((p) => p._id !== placeId)
      }));

      toast.success("Place removed");
    } catch (error) {
      toast.error("Failed to delete place");
    }
  }
}));