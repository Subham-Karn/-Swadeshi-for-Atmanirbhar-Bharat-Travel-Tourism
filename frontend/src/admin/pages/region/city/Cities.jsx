import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, ChevronLeft, Plus, Edit, 
  Trash2, Search, Filter, Globe, Building2, 
  TrendingUp, ShieldCheck, Eye, Clock, Calendar, User
} from 'lucide-react';
import { useRegionsStore } from '../../../../store/useRegionStore';
import { formatDateTime } from '../../../../util/formatDateTime';

const AdminCities = () => {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const { regions, cities, fetchCitiesByState, isLoading, deleteCity } = useRegionsStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPopular, setFilterPopular] = useState('all');

  const region = useMemo(() => regions.find(r => r._id === regionId), [regions, regionId]);

  useEffect(() => {
    if (regionId) fetchCitiesByState(regionId);
  }, [regionId, fetchCitiesByState]);

  const filteredCities = useMemo(() => {
    const displayCities = cities.length > 0 ? cities : [
      {
        _id: "1",
        cityName: "Jaipur",
        cityImages: ["https://images.unsplash.com/photo-1599661046289-e31897846e41"],
        isPopular: true,
        rating: 4.8,
        bestTimeToVisit: "Oct - Mar",
        createdBy: { name: "Subham Karn", role: "Admin" } // Dummy Creator
      },
      {
        _id: "2",
        cityName: "Udaipur",
        cityImages: ["https://images.unsplash.com/photo-1590050752117-238cb0fb12b1"],
        isPopular: false,
        rating: 4.5,
        bestTimeToVisit: "Nov - Feb",
        createdBy: { name: "Praveer Singh", role: "Editor" } // Dummy Creator
      }
    ];

    return displayCities.filter(city => {
      const matchesSearch = city.cityName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPopular = filterPopular === 'all' ? true : 
                            filterPopular === 'popular' ? city.isPopular : !city.isPopular;
      return matchesSearch && matchesPopular;
    });
  }, [cities, searchQuery, filterPopular]);

  if (isLoading && !region) return <LoadingSpinner />;
  if (!region) return null;

  return (
    <div className="min-h-screen ">
      {/* ─── HEADER ─── */}
      <header className="bg-white border-b border-gray-100 pt-8 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin/regions')} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 bg-gray-50 hover:text-gray-900 transition-all">
                <ChevronLeft size={20} />
              </button>
              <div>
                <span className="text-[10px] font-black text-[#00A699] uppercase tracking-widest">{region.regionType} Registry</span>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                  {region.stateName} <span className="text-gray-300">/</span> Cities
                </h1>
              </div>
            </div>
            <button
              onClick={() => navigate(`/admin/regions/${regionId}/cities/add`)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all bg-[#00A699] shadow-xl shadow-teal-100/50"
            >
              <Plus size={16} strokeWidth={3} /> Add New City
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Building2 size={18}/>} label="Total Nodes" value={cities.length} />
            <StatCard icon={<Star size={18}/>} label="Popular" value={cities.filter(c=>c.isPopular).length} />
            <StatCard icon={<Globe size={18}/>} label="Status" value="Live" />
            <StatCard icon={<ShieldCheck size={18}/>} label="Verified" value="Yes" />
          </div>
        </div>
      </header>

      {/* ─── MAIN TOOLBAR ─── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search city registry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold focus:border-[#00A699] outline-none transition-all shadow-sm"
            />
          </div>
          <select 
            value={filterPopular}
            onChange={(e) => setFilterPopular(e.target.value)}
            className="px-6 py-4 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 outline-none cursor-pointer"
          >
            <option value="all">All Registry</option>
            <option value="popular">Popular Selection</option>
          </select>
        </div>

        {/* ─── RESPONSIVE CARDS ─── */}
        <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {filteredCities.map((city, idx) => (
              <CityAdminCard 
                key={city._id} 
                city={city} 
                index={idx} 
                region={region}
                onDelete={() => deleteCity(city._id)}
                navigate={navigate}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

/* ─── CITY CARD WITH CREATOR INFO ─── */
const CityAdminCard = ({ city, index, region, onDelete, navigate }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white border border-gray-100 rounded-[2.5rem] p-5 flex flex-col md:flex-row items-center gap-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group"
  >
    {/* Media Thumbnail */}
    <div className="relative w-full md:w-44 h-48 md:h-32 rounded-3xl overflow-hidden shrink-0 shadow-inner">
      <img src={city.cityImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={city.cityName} />
      {city.isPopular && (
        <div className="absolute top-3 left-3 bg-[#00A699] text-white text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.1em] shadow-lg">
          Featured
        </div>
      )}
    </div>

    {/* Info Bundle */}
    <div className="flex-1 w-full text-center md:text-left space-y-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
             <span className="text-[10px] font-black text-[#00A699] uppercase tracking-widest">
               {city.cityName} City Node
             </span>
             {/* CREATED BY DUMMY STAMP */}
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                <User size={10} className="text-slate-400" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  By {city.createdBy?.name || "System"}
                </span>
             </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{city.cityName}</h3>
          
          <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs font-black text-orange-500">
              <Star size={14} fill="currentColor" /> {city.rating || '0.0'}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={12} /> {city.bestTimeToVisit || 'Always'}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => navigate(`/admin/regions/${region.stateName}/cities/${city.cityName}/${city._id}/places`)}
            className="flex items-center gap-2 px-6 py-3.5 bg-teal-50 text-[#00A699] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00A699] hover:text-white transition-all shadow-sm"
          >
            <Eye size={16} /> Manage Places
          </button>
          <button 
            onClick={() => navigate(`/admin/regions/${region.stateName}/cities/${city.cityName}/${city._id}/edit`)}
            className="p-3.5 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={onDelete}
            className="p-3.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 text-[#00A699]">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-lg font-black text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="h-screen flex items-center justify-center bg-white">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-4 border-t-[#00A699] border-slate-100 rounded-full"
    />
  </div>
);

export default AdminCities;