import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRegionsStore } from '../../../../store/useRegionStore';
import { 
  ChevronLeft, Plus, Star, MapPin, Navigation, 
  Search, Filter, Edit3, Trash2, ChevronRight, Globe, Info, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlaceStore } from '../../../../store/usePlaceStore';

const CategoryOptions = [
  { value: "heritage", label: "Heritage" },
  { value: "religious", label: "Religious" },
  { value: "historic", label: "Historic" },
  { value: "nature", label: "Nature" },
  { value: "market", label: "Market" },
  { value: "modern", label: "Modern" },
];

const Places = () => {
  const navigate = useNavigate();
  const { cityId, stateName } = useParams();
  const { places, fetchPlacesByCity, isLoading, fetchCityById, deletePlace } = usePlaceStore();
  
  const [city, setCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCityDetails = async () => {
      const cityData = await fetchCityById(cityId);
      setCity(cityData);
    }
    fetchCityDetails();
  }, [cityId, fetchCityById]);
  
  useEffect(() => {
    fetchPlacesByCity(cityId);
  }, [fetchPlacesByCity, cityId]);

  // Filter Logic
  const filteredPlaces = useMemo(() => {
    return places.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || place.category.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory, places]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const paginatedPlaces = filteredPlaces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this place?")) {
      await deletePlace(id);
    }
  };

  return (
    <div className="w-full space-y-6 min-h-screen pb-20">
      {/* HEADER ACTIONS */}
      <div className='flex items-center justify-between px-2'>
        <button 
          onClick={() => navigate(-1)}
          className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>

        <button 
          onClick={() => navigate("add")} 
          className="flex items-center justify-center gap-3 px-8 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:scale-[1.02] transition-all"
        >
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
          <img src={city?.cityImages} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="city" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div>
            <p className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.3em]">Parent Node: {stateName}</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{city?.cityName || "Loading..."}</h1>
          </div>
          <p className="text-slate-500 font-medium line-clamp-2 max-w-3xl">
            Managing directory for {city?.cityName}. Ensure all location data, media assets, and descriptions are updated for the best user experience.
          </p>
        </div>
      </motion.div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Navigation size={20}/>} label="Total Places" value={places.length} color="text-slate-900" />
        <StatCard icon={<Star size={20}/>} label="Popular Sites" value={places.filter(p => p.isPopular).length} color="text-orange-500" />
        <StatCard icon={<Globe size={20}/>} label="Status" value="Verified" color="text-[#00A699]" />
        <StatCard icon={<Info size={20}/>} label="Category Count" value={CategoryOptions.length} color="text-slate-900" />
      </div>

      {/* 3. Search & Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search within this city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#00A699] transition-all font-semibold"
          />
        </div>
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-6 py-5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-600 min-w-52 outline-none focus:border-[#00A699]"
        >
          <option value="All">All Categories</option>
          {CategoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* 4. Vertical Place Cards */}
      <div className="space-y-4">
        <AnimatePresence mode='popLayout'>
          {isLoading ? (
            [...Array(3)].map((_, i) => <PlaceVerticalCard key={i} loading={true} index={i} />)
          ) : paginatedPlaces.length > 0 ? (
            paginatedPlaces.map((place, index) => (
              <PlaceVerticalCard 
                key={place._id} 
                loading={false} 
                place={place} 
                index={index} 
                onEdit={() => navigate(`edit/${place.name}/${place._id}`)}
                onDelete={() => handleDelete(place._id)}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No places registered in this city yet</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Pagination - Same as your previous logic */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
           {/* ... Pagination Buttons ... */}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-5">
    <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

const PlaceVerticalCard = ({ place, index, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 animate-pulse">
        <div className="h-32 w-full md:w-48 shrink-0 rounded-2xl bg-slate-100" />
        <div className="flex-1 w-full space-y-3">
          <div className="h-6 w-1/3 bg-slate-100 rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-50 rounded-lg" />
          <div className="h-4 w-1/4 bg-slate-50 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition-all"
    >
      {/* Media Thumbnail */}
      <div className="h-32 w-full md:w-48 shrink-0 rounded-2xl overflow-hidden relative shadow-inner bg-slate-50">
        <img src={place.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={place.name} />
        {place.isPopular && (
          <div className="absolute top-2 right-2 bg-orange-500 p-1.5 rounded-lg shadow-lg">
            <Star fill="white" className="text-white" size={12} />
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="flex-1 w-full text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-[9px] font-black text-[#00A699] uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-md">
                {place.category}
              </span>
              {/* WHO CREATED - User Stamp */}
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 border-l border-slate-200 pl-2">
                <User size={10} />
                <span>By {place.createdBy?.name || "Administrator"}</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">{place.name}</h3>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
               <div className="flex items-center gap-1 text-orange-500">
                  <Star size={12} fill="currentColor" />
                  <span className="text-xs font-black">{place.rating}</span>
               </div>
               <div className="flex items-center gap-1 text-slate-400">
                  <MapPin size={12} />
                  <span className="text-[10px] font-bold truncate max-w-50">{place.location}</span>
               </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={onEdit}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00A699] transition-all"
            >
              <Edit3 size={14} /> Update
            </button>
            <button 
              onClick={onDelete}
              className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Places;