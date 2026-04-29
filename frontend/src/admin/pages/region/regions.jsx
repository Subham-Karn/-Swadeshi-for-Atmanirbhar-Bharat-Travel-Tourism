import { MapPlus, Globe, MapPin, Navigation, Star, Map, ChevronLeft, ChevronRight, Building2, View, Search, FilterX, Eye, SquarePen, Loader2 } from 'lucide-react';
import { Edit3, Trash2 } from 'lucide-react';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { statusStyles } from '../../../assets/assets';
import { useRegionsStore } from '../../../store/useRegionStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Regions = () => {
  const { regions, fetchStates, isLoading } = useRegionsStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const filteredRegions = useMemo(() => {
    return regions.filter((region) => {
      const matchesSearch = region.stateName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "All" || region.regionType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [regions, searchQuery, selectedType]);

  useEffect(() => {
    fetchStates();
    document.title = "Bharat Darshan - Regions";
  }, [fetchStates]);

  return (
    <div className='w-full min-h-screen bg-[#F7F7F7]'>
      {/* Header */}
      <div className='flex items-center w-full justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-black text-slate-800 tracking-tight'>Regions</h1>
          <p className='text-slate-500 font-medium'>Manage travel coverage across India</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/admin/regions/add`)}
          className='flex items-center gap-2 bg-[#00A699] text-white px-6 py-3 rounded-2xl shadow-lg shadow-teal-100 font-bold'
        >
          <MapPlus size={20} />
          <span className='hidden sm:inline'>Add Region</span>
        </motion.button>
      </div>

      <RegionStats />

      {/* Filter Bar */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search state..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-transparent bg-gray-50 focus:bg-white focus:border-[#00A699] outline-none font-medium transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1  px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-[#00A699] outline-none font-bold text-gray-600"
          >
            <option value="All">All Regions</option>
            {['North', 'South', 'East', 'West', 'Central', 'North-East'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          {(searchQuery || selectedType !== "All") && (
            <button onClick={() => {setSearchQuery(""); setSelectedType("All")}} className="p-3 text-red-500 bg-red-50 rounded-xl">
              <FilterX size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <RegionsTable regionData={filteredRegions} isLoading={isLoading} />
    </div>
  );
};

const RegionStats = () => {
  const { regions } = useRegionsStore();
  
  const statsData = [
    { name: "Coverage Area", value: regions.length, icon: <Globe size={24} />, color: "bg-teal-50 text-[#00A699]" },
    { name: "Live States", value: regions.filter(r => r.status === 'Active').length, icon: <MapPin size={24} />, color: "bg-orange-50 text-orange-600" },
    { name: "Cities Tracked", value: regions.reduce((acc, r) => acc + (r.citiesCount || 0), 0), icon: <Building2 size={24} />, color: "bg-blue-50 text-blue-600" },
    { name: "Popular", value: regions.filter(r => r.isPopular).length, icon: <Navigation size={24} />, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {statsData.map((item, idx) => (
        <div key={idx} className='bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-5'>
          <div className={`p-4 rounded-xl ${item.color}`}>{item.icon}</div>
          <div>
            <h1 className='text-2xl font-black text-slate-800'>{item.value}</h1>
            <p className='text-slate-500 text-xs font-bold uppercase tracking-widest'>{item.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ITEMS_PER_PAGE = 5;

const RegionsTable = ({ regionData = [], isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { deleteRegion } = useRegionsStore();
  const navigate = useNavigate();

  const totalPages = Math.ceil(regionData.length / ITEMS_PER_PAGE) || 1;
  const currentData = regionData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => setCurrentPage(1), [regionData.length]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}? All associated cities will be lost.`)) {
      await deleteRegion(id);
    }
  };

  return (
    <div className="w-full mt-8 relative">
      
      {/* Table Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-[#F7F7F7]/60 backdrop-blur-sm flex items-center justify-center rounded"
          >
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-[#00A699]" size={32} />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updating Ledger</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Header (Hidden on Mobile) */}
      <div className="hidden md:grid grid-cols-5 bg-white border border-gray-100 p-6 rounded shadow-sm mb-1">
        {["State", "Region", "Coverage", "Status", "Actions"].map(h => (
          <div key={h} className="text-[10px] font-black uppercase tracking-widest text-gray-400 last:text-right">{h}</div>
        ))}
      </div>

      {/* Main Container */}
      <div className="space-y-4 md:space-y-0 md:bg-white md:rounded-b md:border md:border-gray-100 md:shadow-sm md:divide-y md:divide-gray-50">
        {regionData.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem]">
            <FilterX size={64} strokeWidth={1} className="mb-4 text-gray-200" />
            <p className="font-bold text-gray-400">No matching regions found</p>
          </div>
        ) : (
          currentData.map((region) => (
            <motion.div 
              key={region._id} 
              layout
              className="bg-white md:bg-transparent p-5 md:p-6 rounded-2xl md:rounded-none border border-gray-100 md:border-none shadow-sm md:shadow-none flex flex-col md:grid md:grid-cols-5 gap-4 md:items-center hover:bg-teal-50/20 transition-all group"
            >
              {/* 1. STATE & IMAGE (Primary Info) */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img 
                    src={region.stateImage} 
                    referrerPolicy="no-referrer" 
                    className='w-14 h-14 md:w-12 md:h-12 rounded-xl object-cover shadow-md border-2 border-white' 
                    alt="" 
                  />
                  {region.isPopular && (
                    <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-1 rounded-full shadow-lg border-2 border-white">
                      <Star size={8} fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-gray-900 md:text-gray-800 text-lg md:text-base leading-tight">
                    {region.stateName}
                  </span>
                  <span className="md:hidden text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {region.regionType} • {region.status}
                  </span>
                </div>
              </div>

              {/* 2. REGION TYPE (Desktop Only) */}
              <div className="hidden md:block text-xs font-black text-gray-500 uppercase tracking-tighter">
                {region.regionType}
              </div>
              
              {/* 3. COVERAGE / DETAILS */}
              <div className="flex items-center justify-between md:justify-start gap-4 bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                   <div className="flex items-center gap-1.5">
                     <Building2 size={14} className="text-[#00A699]" />
                     <span className="text-sm font-black text-gray-800">{region.citiesCount || 0}</span>
                   </div>
                   <span className='text-[10px] font-bold text-gray-400 uppercase'>Active Cities</span>
                </div>
                
                {/* Mobile Exclusive: Connectivity Tag */}
                <div className="md:hidden flex flex-col items-end">
                   <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-lg uppercase tracking-widest">
                     {region.reach} Reach
                   </span>
                </div>
              </div>

              {/* 4. STATUS */}
              <div className="hidden md:block">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusStyles[region.status]}`}>
                  {region.status}
                </span>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0">
                <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/admin/regions/${region._id}/edit`)} 
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 md:px-3 py-3 md:py-2 bg-gray-900 md:bg-white text-white md:text-gray-400 rounded-2xl md:rounded-xl hover:text-[#00A699] transition-all shadow-lg shadow-gray-200 md:shadow-none"
                    >
                      <SquarePen size={18} />
                      <span className="md:hidden text-xs font-bold uppercase tracking-widest">Edit Region</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(region._id, region.stateName)} 
                      className="p-3 md:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl md:rounded-xl transition-all border md:border-none border-gray-100"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
                <button 
                   onClick={() => navigate(`/admin/regions/${region._id}/view`)}
                   className="p-3 bg-[#00A699] text-white rounded-2xl shadow-lg shadow-teal-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 mt-4 bg-white rounded border border-gray-100">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Showing {currentData.length} of {regionData.length} Territories
        </span>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 disabled:opacity-30 transition-all border border-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-1 px-2 py-1 bg-gray-50 rounded-2xl border border-gray-100">
             <span className="px-4 py-2 text-sm font-black text-[#00A699]">{currentPage}</span>
          </div>

          <button 
            disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#00A699] text-white disabled:opacity-30 shadow-lg shadow-teal-100 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Regions;