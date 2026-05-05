import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRegionsStore } from '../../../../store/useRegionStore';
import { 
  ChevronLeft, Plus, Star, MapPin, Navigation, 
  Search, Filter, Edit3, Trash2, ChevronRight, Globe, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaceStore } from '../../../../store/usePlaceStore';
const DUMMY_PLACES = [
  { _id: "p1", name: "Golden Temple", category: "Religious", rating: 4.9, image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=600", isPopular: true },
  { _id: "p2", name: "Jallianwala Bagh", category: "Historical", rating: 4.7, image: "https://images.unsplash.com/photo-1626078297492-b7cd552745d5?auto=format&fit=crop&w=600", isPopular: true },
  { _id: "p3", name: "Partition Museum", category: "Museum", rating: 4.8, image: "https://images.unsplash.com/photo-1598192002933-288926955d50?auto=format&fit=crop&w=600", isPopular: false },
  { _id: "p4", name: "Wagah Border", category: "Historical", rating: 4.6, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600", isPopular: true },
  { _id: "p5", name: "Gobindgarh Fort", category: "Historical", rating: 4.5, image: "https://images.unsplash.com/photo-1621259182978-f09e5e2ca09a?auto=format&fit=crop&w=600", isPopular: false },
];

const CategoryOptions = [
  { value: "historical", label: "Historical" },
  { value: "natural", label: "Natural" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
  { value: "religious", label: "Religious" },
];

const Places = () => {
  const navigate = useNavigate();
  const { cityId  , stateName} = useParams();
  const { places , fetchPlacesByCity , isLoading} = usePlaceStore();
  const { cities } = useRegionsStore();
  const city = cities.find((c) => c._id === cityId);
  console.log(cityId);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchPlacesByCity(cityId);
  }, [fetchPlacesByCity, cityId]);

  // Filter Logic
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || place.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory, places]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats Calculation
  const totalPlaces = places.length;
  const popularPlacesCount = places.filter(p => p.isPopular).length;

  return (
    <div className="w-full space-y-6">
      <div className='flex items-center justify-between px-2'>
        <button 
            onClick={() => navigate(-1)}
            className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>

        <button onClick={()=>navigate("add")} className="flex items-center justify-center gap-3 px-8 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:scale-[1.02] transition-all">
              <Plus size={18} strokeWidth={3} /> Add New Place
        </button>

      </div>
      {/* 1. City Info Card Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6"
      >
          <div className={`h-32 relative w-32 md:h-40 md:w-40 rounded-xl overflow-hidden border-4 border-slate-50 shadow-inner ${city?.isPopular ? 'ring-4 ring-orange-500' : ''}`}>
            {city?.isPopular && (
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Popular
              </span>
            )}
            <img src={city?.cityImages[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="city" />
          </div>

        <div className="flex-1 text-center md:text-left space-y-2">
            <div>
              <p className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.3em]">Places Configuration</p>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{city?.cityName || "Amritsar City"} City</h1>
            </div>
          <p className="text-slate-500 font-medium line-clamp-2 max-w-3xl">
            Manage all tourist attractions, historical landmarks, and local favorites for this city hub. Add new places, update details, and ensure visitors have the best experience exploring the heart of the region.
          </p>
        </div>
      </motion.div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Navigation size={20}/>} label="Total Places" value={totalPlaces} color="text-slate-900" />
        <StatCard icon={<Star size={20}/>} label="Popular Sites" value={popularPlacesCount} color="text-orange-500" />
        <StatCard icon={<Globe size={20}/>} label="Status" value="Live" color="text-[#00A699]" />
        <StatCard icon={<Info size={20}/>} label="Region" value={stateName || "Punjab"} color="text-slate-900" />
      </div>

      <hr className="border-slate-100 my-4" />

      {/* 3. Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by place name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-[#00A699] transition-all font-semibold text-slate-700"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-14 pr-12 py-5 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:border-[#00A699] font-black text-[10px] uppercase tracking-[0.15em] text-slate-600 cursor-pointer min-w-55"
          >
            <option value="All">All Categories</option>
            {
               CategoryOptions.map(option => (
                <option key={option.value} value={option.label}>{option.label}</option>
              ))
            }
          </select>
        </div>
      </div>

      {/* 4. Vertical Place Cards */}
      <div className="space-y-4 pt-2">
        <AnimatePresence mode='popLayout'>
          {paginatedPlaces.length > 0 ? (
            paginatedPlaces.map((place, index) => (
              <PlaceVerticalCard key={place._id} loading={true} place={place} index={index} />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No results found</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-4 bg-white border border-slate-200 rounded-2xl disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-12 w-12 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-[#00A699] text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-900'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-4 bg-white border border-slate-200 rounded-2xl disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

/* --- Shared Components --- */

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-5">
    <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

const PlaceVerticalCard = ({ place, index , loading }) => (
  <>
     {
       loading === true ? (
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl hover:shadow-slate-100 transition-all cursor-default animate-pulse"
        >
          <div className="h-32 w-full md:w-48 shrink-0 rounded-2xl bg-slate-200" />
          <div className="flex-1 w-full text-center md:text-left space-y-4 py-2">
            <div className="h-6 w-1/3 bg-slate-200 rounded-xl mx-auto md:mx-0" />
            <div className="h-4 w-1/2 bg-slate-200 rounded-xl mx-auto md:mx-0" />
            <div className="h-4 w-1/4 bg-slate-200 rounded-xl mx-auto md:mx-0" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 rounded-xl font-bold text-xs">
              <Edit3 size={14} />
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <Trash2 size={16} />
            </div>
          </div>
        </motion.div>
       ) : (
           <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl hover:shadow-slate-100 transition-all cursor-default"
              >
                <div className="h-32 w-full md:w-48 shrink-0 rounded-2xl overflow-hidden relative">
                  <img src={place.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={place.name} />
                  {place.isPopular && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm">
                      <Star fill="#f97316" className="text-orange-500" size={14} />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-[#00A699] uppercase tracking-widest">{place.category}</span>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{place.name}</h3>
                      <div className="flex items-center justify-center md:justify-start gap-1 text-slate-400">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{place.rating} Rating</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
            </motion.div>
       )
     }
  </>

);

export default Places;