import { create } from 'zustand'

export const useRegionsStore = create((set) => ({
    regions: [
    {
        id: 1,
        regionType: "North India",
        state: "Himachal Pradesh",
        stateImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
        cities: 12,
        status: "Active",
        reach: "High"
    },
    {
        id: 2,
        regionType: "North India",
        state: "Uttarakhand",
        stateImage: "https://images.unsplash.com/photo-1594819047050-99defca82545",
        cities: 9,
        status: "Active",
        reach: "High"
    },
    {
        id: 3,
        regionType: "West India",
        state: "Rajasthan",
        stateImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41",
        cities: 15,
        status: "Active",
        reach: "High"
    },
    {
        id: 4,
        regionType: "West India",
        state: "Goa",
        stateImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        cities: 6,
        status: "Seasonal",
        reach: "High"
    },
    {
        id: 5,
        regionType: "South India",
        state: "Kerala",
        stateImage: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355",
        cities: 10,
        status: "Active",
        reach: "High"
    },
    {
        id: 6,
        regionType: "South India",
        state: "Tamil Nadu",
        stateImage: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3",
        cities: 11,
        status: "Active",
        reach: "Medium"
    },
    {
        id: 7,
        regionType: "East India",
        state: "West Bengal",
        stateImage: "https://images.unsplash.com/photo-1609947017136-9daf32a5eb16",
        cities: 8,
        status: "Active",
        reach: "Medium"
    },
    {
        id: 8,
        regionType: "East India",
        state: "Odisha",
        stateImage: "https://images.unsplash.com/photo-1605440657288-7d0cfc3a5c7b",
        cities: 7,
        status: "Seasonal",
        reach: "Medium"
    },
    {
        id: 9,
        regionType: "Central India",
        state: "Madhya Pradesh",
        stateImage: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1",
        cities: 9,
        status: "Active",
        reach: "Medium"
    },
    {
        id: 10,
        regionType: "North-East India",
        state: "Assam",
        stateImage: "https://images.unsplash.com/photo-1622308644420-b20142dc993c",
        cities: 6,
        status: "Emerging",
        reach: "Low"
    }

],
    cities: [
    { 
        id:1,
        regionId: 1,
        cityName: "Munnar", 
        imageUrl: "https://images.unsplash.com/photo-1510009489794-352fba39acd3", 
        description: "Famous for its tea plantations and rolling hills." 
      },
      { 
        id:2,
        regionId: 1,
        cityName: "Alleppey", 
        imageUrl: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b", 
        description: "Known for its beautiful backwaters and houseboat stays." 
      }
    ],
    setRegions: (regions) => set({ regions }),
    setCities: (cities) => set({ cities }),
}))