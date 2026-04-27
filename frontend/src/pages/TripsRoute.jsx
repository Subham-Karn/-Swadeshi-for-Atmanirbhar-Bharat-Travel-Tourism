import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Clock, 
  Star, 
  ArrowRight, 
  Flame, 
  Search,
  ChevronDown,
  Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TripsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "Solo", "Family", "Honeymoon", "Adventure", "Luxury"];

  // Dummy Data for Trip Marketplace
  const allTrips = [
    { id: 1, title: "Golden Triangle Tour", duration: "6 Days", price: 18500, rating: 4.8, category: "Family", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da", tag: "Best Seller" },
    { id: 2, title: "Manali Snow Escape", duration: "4 Days", price: 9999, rating: 4.9, category: "Adventure", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23", tag: "Trending" },
    { id: 3, title: "Romantic Udaipur Lake Stay", duration: "3 Days", price: 15000, rating: 5.0, category: "Honeymoon", img: "https://images.unsplash.com/photo-1590050853549-3663675003c2", tag: "Romantic" },
    { id: 4, title: "Backpackers Kerala", duration: "7 Days", price: 12500, rating: 4.7, category: "Solo", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", tag: "Budget" },
    { id: 5, title: "Ladakh Bike Trip", duration: "10 Days", price: 32000, rating: 4.9, category: "Adventure", img: "https://images.unsplash.com/photo-1581791534721-e599df4417f7", tag: "High Demand" },
    { id: 6, title: "Goa Beach Luxury Villa", duration: "5 Days", price: 45000, rating: 4.8, category: "Luxury", img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", tag: "Premium" },
  ];

  const filteredTrips = allTrips.filter(trip => {
    const matchesCat = filter === "All" || trip.category === filter;
    const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-4">
              READY TO <span className="text-[#00A699]">GO?</span>
            </h1>
            <p className="text-gray-500 font-medium text-lg">Browse curated itineraries designed for every type of traveler.</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Find a specific trip..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- Filter Bar --- */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shrink-0">
            <Filter size={16} /> Filters
          </div>
          <div className="h-8 w-px bg-gray-200 mx-2" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                filter === cat 
                ? 'bg-[#00A699] text-white shadow-lg shadow-teal-100' 
                : 'bg-gray-50 text-gray-400 hover:text-gray-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- Spotlight Card (Optional) --- */}
        {filter === "All" && !search && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[350px] rounded-[3rem] overflow-hidden mb-16 group cursor-pointer"
            onClick={() => navigate('/trips/5')}
          >
            <img src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3" className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 p-12 flex flex-col justify-center">
              <span className="flex items-center gap-2 text-teal-400 font-black text-xs uppercase tracking-[0.3em] mb-4">
                <Flame size={16} /> Limited Time Deal
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                The Ultimate <br /> Ladakh Expedition
              </h2>
              <p className="text-white/70 max-w-sm mb-6 font-medium">Get 20% off on bike rentals and group bookings this summer.</p>
              <div className="flex items-center gap-6">
                 <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black tracking-widest text-xs hover:bg-[#00A699] hover:text-white transition-all">
                    EXPLORE DEAL
                 </button>
                 <span className="text-white font-black text-2xl">₹28,000 <span className="text-sm text-white/50 line-through">₹35,000</span></span>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Trips Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {filteredTrips.map((trip) => (
              <motion.div
                layout
                key={trip.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="group flex flex-col"
              >
                <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-6">
                  <img src={trip.img} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-gray-900 uppercase shadow-sm">
                      {trip.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <button 
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      className="w-12 h-12 bg-[#00A699] text-white rounded-full flex items-center justify-center shadow-xl translate-y-20 group-hover:translate-y-0 transition-transform duration-500"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#00A699] font-black text-[10px] uppercase tracking-widest flex items-center gap-1">
                       <Clock size={12} /> {trip.duration}
                    </span>
                    <div className="flex items-center gap-1 text-gray-900 font-bold text-xs">
                       <Star size={12} fill="currentColor" className="text-orange-400" /> {trip.rating}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 tracking-tighter mb-4 group-hover:text-[#00A699] transition-colors">
                    {trip.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                       <Tag size={14} className="text-gray-400" />
                       <span className="text-xs font-bold text-gray-400">{trip.category}</span>
                    </div>
                    <p className="text-xl font-black text-gray-900">₹{trip.price.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default TripsPage;