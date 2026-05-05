import axios from "../api/axios";
import { create } from "zustand";
export const usePlaceStore = create((set) => ({
    places: [],
    isLoading: false,

    fetchPlacesByCity: async (cityId) => {
        set({ isLoading: true });
        try {
            if(!cityId) throw new Error("City ID is required to fetch places"); 
            const response = await axios.get(`/places/city/${cityId}`);
            set({ places: response.data });
        } catch (error) {
            console.error("Error fetching places:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchPlaceById: async (placeId) => {
        set({ isLoading: true });
        try {
            if(!placeId) throw new Error("Place ID is required to fetch place details");
            const response = await axios.get(`/places/view/${placeId}`);
            return response.data.place; 
        }
        catch (error) {
            console.error("Error fetching place details:", error);
            return null; 
        } finally {
            set({ isLoading: false });
        }
    },
    addPlace: async (place) => {
        set({ isLoading: true });
      try {
        if(!place)          throw new Error("Place data is required");
        if(!place.name)     throw new Error("Place name is required");
        if(!place.cityId)   throw new Error("City ID is required");
        if(!place.cityName) throw new Error("City Name is required");
        if(!place.category)     throw new Error("Place category is required");
        if(!place.images)   throw new Error("Place images are required");
        if(!place.overview) throw new Error("Place overview is required");
        const response = await axios.post("/places/create", place);
        const newPlace = response.data;
        set((state) => ({ places: newPlace }));
      } catch (error) {
        console.error("Error adding place:", error);
      } finally {
        set({ isLoading: false });
      }
    },
    updatePlace: async (updatedPlace) =>{
        set({ isLoading: true });
        try {   
            if(!updatedPlace)          throw new Error("Updated place data is required");
            if(!updatedPlace._id)     throw new Error("Place ID is required for update");
            if(!updatedPlace.name)     throw new Error("Place name is required");
            if(!updatedPlace.cityId)   throw new Error("City ID is required");
            if(!updatedPlace.cityName) throw new Error("City Name is required");
            if(!updatedPlace.category)     throw new Error("Place category is required");
            if(!updatedPlace.images)   throw new Error("Place images are required");
            if(!updatedPlace.overview) throw new Error("Place overview is required");
            const response = await axios.put(`/places/update/${updatedPlace._id}`, updatedPlace);
            const place = response.data;
            set((state) => ({
                places: state.places.map((p) => p._id === place._id ? place : p)
            }));
        } catch (error) {
            console.error("Error updating place:", error);
        } finally {
            set({ isLoading: false });
        }
    },
    deletePlace: async (placeId) => {
        set({ isLoading: true });
        try {
            await axios.delete(`/places/delete/${placeId}`);
            set((state) => ({
                places: state.places.filter((place) => place._id !== placeId)
            }));
        } catch (error) {
            console.error("Error deleting place:", error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
