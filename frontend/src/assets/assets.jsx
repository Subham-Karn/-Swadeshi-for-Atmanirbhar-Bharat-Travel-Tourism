import { LayoutDashboard, Map, Settings,  Tickets, TicketsPlane, Users } from "lucide-react";

// Slider 
export const slider = [
    {label: "Dashboard", link: "/admin/dashboard" , icon: <LayoutDashboard size={20}/>},
    {label: "Users", link: "/admin/users" , icon: <Users size={20}/>},
    {label: "Regions", link: "/admin/regions" , icon: <Map size={20}/>},
    {label: "Trips", link: "/admin/trips" , icon: <TicketsPlane size={20}/>},
    {label: "Bookings", link: "/admin/bookings" , icon: <Tickets size={20}/>},
    {label: "Setting", link: "/admin/setting" , icon: <Settings size={20}/>},
]


export const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"

// Regions

export const regionsStats = [
  {name: "Total Regions", value: "3"},
  {name: "Total Cities", value: "2"},
  {name: "Total States", value: "1"},
  {name: "Total Reached", value: "1"},
]


export const dummyRegions = [
  {
    id: 1,
    state: "Kerala",
    regionType: "South India",
    stateImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop",
    citiesCount: 4,
    status: "Active",
    reach: "High",
    description: "Known as God's Own Country, famous for its backwaters and greenery."
  },
  {
    id: 2,
    state: "Rajasthan",
    regionType: "West India",
    stateImage: "https://images.unsplash.com/photo-1599661046289-e31887846eac?q=80&w=2000&auto=format&fit=crop",
    citiesCount: 5,
    status: "Active",
    reach: "High",
    description: "The land of kings, featuring majestic forts and the Thar desert."
  },
  {
    id: 3,
    state: "Himachal Pradesh",
    regionType: "North India",
    stateImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000&auto=format&fit=crop",
    citiesCount: 3,
    status: "Active",
    reach: "Medium",
    description: "A paradise for trekkers and mountain lovers in the heart of the Himalayas."
  },
  {
    id: 4,
    state: "Goa",
    regionType: "West India",
    stateImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2000&auto=format&fit=crop",
    citiesCount: 2,
    status: "Active",
    reach: "High",
    description: "Famous for its stunning beaches, nightlife, and Portuguese heritage."
  },
  {
    id: 5,
    state: "Uttarakhand",
    regionType: "North India",
    stateImage: "https://images.unsplash.com/photo-1584128676211-1400263f237f?q=80&w=2000&auto=format&fit=crop",
    citiesCount: 3,
    status: "Seasonal",
    reach: "Medium",
    description: "The spiritual hub of India, home to the Ganges and high peaks."
  }
];


export const dummyCities = [
  // Kerala Cities
  {
    id: 101,
    regionId: 1,
    cityName: "Munnar",
    imageUrl: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?q=80&w=1000",
    description: "Lush green tea plantations and cool mist-covered hills."
  },
  {
    id: 102,
    regionId: 1,
    cityName: "Alleppey",
    imageUrl: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1000",
    description: "Cruising through the serene backwaters on traditional houseboats."
  },
  // Rajasthan Cities
  {
    id: 103,
    regionId: 2,
    cityName: "Jaipur",
    imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=1000",
    description: "The Pink City, home to the Hawa Mahal and Amer Fort."
  },
  {
    id: 104,
    regionId: 2,
    cityName: "Udaipur",
    imageUrl: "https://images.unsplash.com/photo-1590050853549-3663675003c2?q=80&w=1000",
    description: "The City of Lakes, known for its romantic palaces and architecture."
  }
];

export const statusStyles = {
  Active: "bg-emerald-100 text-emerald-600",
  Inactive: "bg-gray-100 text-gray-500",
  Seasonal: "bg-orange-100 text-orange-600",
  Draft: "bg-blue-100 text-blue-600",
};

export const regions  = [
    "North India",
    "South India",
    "West India",
    "East India",
]