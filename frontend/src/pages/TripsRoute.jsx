import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, MapPin, ArrowRight, Sparkles, 
  Compass, SlidersHorizontal, Info, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTripStore } from '../store/useTripStore';
import { useAuthStore } from '../store/useAuthStore';

const TripsPage = () => {
  const navigate = useNavigate();
  const { trips, fetchUserTrips, isLoading } = useTripStore();
  const { user } = useAuthStore();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const categories = ["All", "Heritage", "Adventure", "Nature", "Luxury", "Solo"];

  useEffect(() => {
    if (user?.id) {
      fetchUserTrips(user.id);
    }
  }, [user?.id, fetchUserTrips]);

  // Combined Search & Filter Logic based on the real Mongoose payload structures
  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesCategory = activeCategory === "All" || 
        trip.placeId?.category?.toLowerCase() === activeCategory.toLowerCase();
      
      const matchesStatus = statusFilter === "All" || 
        trip.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesSearch = trip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.placeId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.placeId?.cityName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [trips, activeCategory, statusFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-sm font-black text-slate-700 tracking-wider uppercase">Loading Travel Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* --- Section Header Layout --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-[#00A699] font-black text-[10px] tracking-widest uppercase rounded-lg border border-teal-100/60">
              <Compass size={12} /> Personal Travel Vault
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              MY <span className="text-[#00A699]">EXPLORATIONS</span>
            </h1>
            <p className="text-slate-400 font-bold text-sm">Review, track, and manage your dynamic travel infrastructure configurations.</p>
          </div>

          {/* Combined Live Search Bar */}
          <div className="relative w-full md:w-96 shadow-xs rounded-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by trip title, city or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200/80 rounded-2xl font-bold text-sm outline-none focus:border-[#00A699] transition-all"
            />
          </div>
        </div>

        {/* --- Filter Bar Hub Control --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          
          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 border ${
                  activeCategory === cat 
                    ? 'bg-[#00A699] border-[#00A699] text-white' 
                    : 'bg-slate-50 border-slate-200/60 text-slate-500 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Workflow Status Dropdown Filter */}
          <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">State:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 font-bold text-xs text-slate-700 outline-none focus:border-[#00A699]"
            >
              <option value="All">All States</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

        </div>

        {/* --- Itineraries Results Dynamic Grid --- */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-24 bg-white border border-slate-100 rounded-[2rem] shadow-xs space-y-3">
            <Info className="mx-auto text-slate-300" size={40} />
            <p className="text-slate-700 font-black text-lg">No Matching Itineraries</p>
            <p className="text-slate-400 font-bold text-xs max-w-sm mx-auto">Try adjusting your active category query terms or search string parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTrips.map((trip) => {
                const formattedStart = trip.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : '';
                const formattedEnd = trip.endDate ? new Date(trip.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : '';
                
                return (
                  <motion.div
                    layout
                    key={trip._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Window */}
                      <div className="relative h-60 rounded-[2rem] overflow-hidden mb-5">
                        <img 
                          src={trip.placeId?.coverImage || "https://images.unsplash.com/photo-15424492412937-b28074a5d7da"} 
                          alt={trip.title} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" 
                        />
                        
                        {/* Status Float Badge */}
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-wider shadow-xs ${
                            trip.status === 'upcoming' ? 'bg-emerald-500/90 text-white' :
                            trip.status === 'completed' ? 'bg-slate-800/90 text-white' : 'bg-amber-500/90 text-white'
                          }`}>
                            {trip.status}
                          </span>
                        </div>

                        {/* Category Float Tag */}
                        {trip.placeId?.category && (
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1 shadow-2xs">
                              <Tag size={10} className="text-[#00A699]" /> {trip.placeId.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info Body */}
                      <div className="px-2 space-y-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          <Calendar size={12} className="text-[#00A699]" />
                          <span>{formattedStart} — {formattedEnd}</span>
                          <span>•</span>
                          <span className="text-slate-500">{trip.numberOfDays || 1} Days Stay</span>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-[#00A699] transition-colors line-clamp-1">
                          {trip.title}
                        </h3>

                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 pb-2">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{trip.placeId?.name} ({trip.placeId?.cityName})</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary & Action Line */}
                    <div className="mt-4 pt-4 border-t border-slate-100/80 px-2 flex items-center justify-between">
                      <div>
                        <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Valuation</span>
                        <p className="text-lg font-black text-slate-800">
                          ₹{trip.budgetCalculation?.estimatedTotalCost?.toLocaleString() || "0"}
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => navigate(`/trips/details/${trip._id}`)}
                        className="h-10 px-4 bg-slate-50 group-hover:bg-[#00A699] text-slate-700 group-hover:text-white rounded-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-2xs transition-all"
                      >
                        Explore <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};

export default TripsPage;