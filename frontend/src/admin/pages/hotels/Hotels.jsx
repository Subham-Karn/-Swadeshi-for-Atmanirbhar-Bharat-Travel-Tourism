import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Search, Plus, MoreVertical, 
  MapPin, Star, Phone, Trash2, Edit3, 
  IndianRupee
} from 'lucide-react';
import { useHotelStore } from '../../../store/useHotelsStore';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
const Hotels = () => {
  const { cityId, cityName, stateName } = useParams();
  const navigate = useNavigate();

  const {
    cityHotels,
    isLoading,
    searchQuery,
    selectedTier,
    fetchHotelsByCityId,
    setSearchQuery,
    setSelectedTier,
    deleteHotel,
    getMetrics
  } = useHotelStore();

  // Trigger dynamic data layer hydration on path changes
  useEffect(() => {
    if (cityName && cityId) {
      fetchHotelsByCityId(cityName, cityId);
    }
  }, [cityName, cityId, fetchHotelsByCityId]);

  const handleDeleteHotel = async (id) => {
    if (window.confirm("Are you sure you want to remove this hotel profile from active indexation?")) {
      try {
        await deleteHotel(id);
        toast.success("Hotel data node purged successfully");
      } catch (err) {
        toast.error(err.message || "Failed to complete data deletion request");
      }
    }
  };

  // Pull computed data matrices dynamically from operational store getters
  const { total, luxuryCount, avgPrice } = getMetrics();

  // Local client filter processing run across live store arrays
  const filteredHotels = cityHotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.cityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === "all" || hotel.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER REGISTRY STRIP --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Hotels <span className="text-slate-400 font-normal">Directory</span>
            </h1>
            <p className="text-[#00A699] tracking-wide uppercase text-xs font-black mt-1">
              {cityName || "Active Index"} Directory Context
            </p>
          </div>
          <button 
            onClick={() => navigate("add")}
            className="flex items-center gap-2 bg-[#00A699] hover:bg-primary text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-[#00A699]/10 active:scale-95 w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add New Hotel</span>
          </button>
        </header>

        {/* --- PERFORMANCE ANALYTICS MATRICES --- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatMiniCard title="Total Properties" value={total} descriptor="Registered stays" />
          <StatMiniCard title="Premium/Luxury Stays" value={luxuryCount} descriptor="High-tier accommodations" />
          <StatMiniCard title="Avg Index Price" value={`₹${avgPrice}`} descriptor="Per night average cost" />
        </section>

        {/* --- CONTROL RIBBON FILTER PANEL --- */}
        <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col lg:flex-row gap-3 justify-between items-center shadow-sm shadow-slate-100/50">
          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00A699] transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              placeholder="Search by hotel name parameters..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-sm font-medium py-3 pl-11 pr-4 rounded-xl border border-transparent focus:outline-none focus:border-slate-200 focus:bg-white text-slate-700 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-2">Tier filter:</span>
            {["all", "budget", "mid-range", "luxury", "premium-luxury"].map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                  selectedTier === tier 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tier.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* --- DYNAMIC ROW LOG LIST WORKSPACE --- */}
        <main className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Accommodations Matrix</h2>
            {isLoading && <span className="text-xs text-[#00A699] font-black uppercase tracking-wider animate-pulse">Querying datasets...</span>}
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <HotelRowSkeleton key={i} />)
              ) : filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, idx) => (
                  <HotelListRow 
                    key={hotel._id} 
                    hotel={hotel} 
                    index={idx} 
                    onDelete={handleDeleteHotel}
                    onEdit={(id) => navigate(`/admin/regions/${cityName.replace(/\s+/g + '-')}/${cityId}/hotels/${id}/edit`)}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider border border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
                  No registered hotel nodes match your search configuration criteria.
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  );
};

// --- SUB-COMPONENT: HORIZONTAL LIST CARD ROW ---
const HotelListRow = ({ hotel, index, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTierColors = (tier) => {
    switch (tier) {
      case 'premium-luxury': return 'bg-primary/10 border-primary text-primary';
      case 'luxury': return 'bg-amber-50 border-amber-100 text-amber-600';
      case 'mid-range': return 'bg-blue-50 border-blue-100 text-blue-600';
      default: return 'bg-slate-50 border-slate-100 text-slate-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ delay: index * 0.03 }}
      className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-slate-200 transition-all duration-300 group relative"
    >
      {/* Left Column Area: Identity Matrix Metadata */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#00A699]/10 group-hover:border-[#00A699]/20 group-hover:text-[#00A699] transition-all shrink-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 2500 + index * 300 }}
          className="h-full w-full"
        >
          {hotel.images?.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                className="w-full h-full object-cover rounded"
                referrerPolicy="no-referrer"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase truncate">
              {hotel.name}
            </h4>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shrink-0 ${getTierColors(hotel.tier)}`}>
              {hotel.tier ? hotel.tier.replace("-", " ") : "standard"}
            </span>
            {hotel.isFeatured && (
              <span className="bg-[#00A699]/10 border border-[#00A699]/20 text-[#00A699] text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md">
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-300" /> {hotel.location}</span>
            {hotel.contactNumber && (
              <span className="flex items-center gap-1"><Phone size={12} className="text-slate-300" /> {hotel.contactNumber}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Column Area: Pricing Tiers & Management Triggers */}
      <div className="flex items-center justify-between md:justify-end gap-6 border-t border-slate-50 md:border-0 pt-3 md:pt-0 shrink-0">
        <div className="flex items-center gap-4 text-left md:text-right">
          <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] font-black">
            <Star size={10} fill="currentColor"/>
            <span>{hotel.rating || "4.0"}</span>
          </div>
          <div>
            <span className="hidden md:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Starting Rate</span>
            <span className="text-sm font-black text-slate-800 tracking-tight">₹{hotel.pricePerNight}<span className="text-[10px] text-slate-400 font-bold normal-case">/night</span></span>
          </div>
        </div>

        {/* Inline Actions Drawer trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl p-1 z-20">
                <button 
                  onClick={() => { onEdit(hotel._id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Edit3 size={13} className="text-blue-500" />
                  <span>Edit Profile</span>
                </button>
                <button 
                  onClick={() => { onDelete(hotel._id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={13} className="text-red-500" />
                  <span>Delete Hotel</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- MINI UTILITY STAT CARD ---
const StatMiniCard = ({ title, value, descriptor }) => (
  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm shadow-slate-100/50">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{title}</span>
    <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{value}</h3>
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-0.5">{descriptor}</span>
  </div>
);

const HotelRowSkeleton = () => (
  <div className="p-4 bg-white border border-slate-50 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-10" />
        </div>
        <div className="h-2.5 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
    <div className="flex items-center justify-between md:justify-end gap-6 border-t border-slate-50 md:border-0 pt-3 md:pt-0 shrink-0 pl-4">
      <div className="w-10 h-5 bg-slate-100 rounded-md" />
      <div className="w-20 h-5 bg-slate-100 rounded-md" />
      <div className="w-4 h-4 bg-slate-50 rounded" />
    </div>
  </div>
);

export default Hotels;