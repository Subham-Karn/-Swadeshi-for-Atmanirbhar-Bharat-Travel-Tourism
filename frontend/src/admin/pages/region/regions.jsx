import { MapPlus, Globe, MapPin, Navigation, Map, ChevronLeft, ChevronRight, Building, Building2, View, Search, FilterX } from 'lucide-react';
import { Edit3, Trash2, MoreVertical } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { statusStyles } from '../../../assets/assets';
import { useRegionsStore } from '../../../store/useRegionStore';
import { useNavigate } from 'react-router-dom';

const Regions = () => {
  const { regions } = useRegionsStore();
  const navigate = useNavigate();

  // 1. Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // 2. Logic to filter data
  const filteredRegions = useMemo(() => {
    return regions.filter((region) => {
      const matchesSearch = region.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "All" || region.regionType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [regions, searchQuery, selectedType]);

  return (
    <div className='w-full min-h-screen bg-[#F7F7F7]'>
      {/* Header */}
      <div className='flex items-center w-full justify-between mb-6'>
        <span>
          <h1 className='text-3xl font-extrabold text-slate-800 tracking-tight'>
            Regions
          </h1>
          <p className='text-slate-500 font-medium'>Manage your travel destinations and coverage</p>
        </span>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/admin/regions/add`)}
          className='flex items-center gap-2 bg-[#00A699] hover:bg-[#008f84] transition-colors rounded-xl shadow-lg shadow-teal-200 text-white px-6 py-3 font-semibold'
        >
          <MapPlus size={20} />
          <span className='text-xs md:text-sm'>Add Region</span>
        </motion.button>
      </div>

      {/* Stats Section */}
      <RegionStats />

      {/* 3. Search & Filter Bar */}
      <div className="mt-8 flex w-full flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full flex-1 md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by state name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#00A699] outline-none transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Globe size={18} className="text-gray-400 hidden sm:block" />
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1 md:w-48 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:border-[#00A699] outline-none text-sm font-medium text-gray-600 cursor-pointer"
          >
            <option value="All">All Regions</option>
            <option value="North India">North India</option>
            <option value="South India">South India</option>
            <option value="West India">West India</option>
            <option value="East India">East India</option>
            <option value="Central India">Central India</option>
            <option value="Northeast India">Northeast India</option>
          </select>

          {(searchQuery || selectedType !== "All") && (
            <button 
              onClick={() => {setSearchQuery(""); setSelectedType("All");}}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Clear Filters"
            >
              <FilterX size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Regions Table */}
      <RegionsTable regionData={filteredRegions} />
    </div>
  );
};

// ... keep RegionStats component as is ...

const RegionStats = () => {
  const { regions } = useRegionsStore(); // Dynamic stats
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const statsData = [
    { name: "Total Regions", value: regions.length, icon: <Globe size={24} />, color: "bg-teal-50 text-[#00A699]" },
    { name: "Total Cities", value: "12", icon: <MapPin size={24} />, color: "bg-orange-50 text-[#FF5A5F]" },
    { name: "Total States", value: "5", icon: <Map size={24} />, color: "bg-blue-50 text-blue-600" },
    { name: "Total Reached", value: "85%", icon: <Navigation size={24} />, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'
    >
      {statsData.map((item, index) => (
        <motion.div
          key={index}
          variants={itemAnim}
          className='bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow'
        >
          <div className={`p-4 rounded-xl ${item.color}`}>
            {item.icon}
          </div>
          <div>
            <h1 className='text-2xl font-bold text-slate-800'>{item.value}</h1>
            <p className='text-slate-500 text-sm font-medium'>{item.name}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};



const ITEMS_PER_PAGE = 5;

const RegionsTable = ({ regionData = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Reset to page 1 if data length changes (e.g., after filtering)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [regionData.length]);

  const totalPages = Math.ceil(regionData.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = regionData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
 
  return (
    <div className="w-full mt-6 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header - Desktop Only */}
      <div className="hidden md:grid grid-cols-5 bg-gray-50/50 border-b border-gray-200 p-5">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">State</div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Region Type</div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Cities</div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 text-right">Actions</div>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-100 min-h-100">
        {regionData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-100 text-gray-400">
             <FilterX size={48} className="mb-2 opacity-20" />
             <p className="font-medium">No regions found matching your criteria</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {currentData.map((region) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-5 p-5 md:items-center hover:bg-teal-50/30 transition-colors group"
              >
                {/* State */}
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={region.stateImage} className='object-cover h-full w-full' alt={region.state} />
                  </div>
                  <span className="font-bold text-gray-800 truncate">{region.state}</span>
                </div>

                {/* Region Type */}
                <div className="flex items-center gap-2 text-gray-600 mb-2 md:mb-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#00A699] shrink-0">
                    <MapPin size={14} />  
                  </div>
                  <span className="text-sm">{region.regionType}</span>
                </div>

                {/* Cities */}
                <div className="flex items-center gap-2 text-gray-600 mb-2 md:mb-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#00A699] shrink-0">
                    <Building2 size={14} />  
                  </div>
                  <span className="text-sm font-medium text-gray-700">{region.citiesCount || 0}</span> <span className='text-xs'>Locations</span>
                </div>

                {/* Status */}
                <div className="mb-4 md:mb-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${statusStyles[region.status] || 'bg-gray-100 text-gray-500'}`}>
                    {region.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center md:justify-end gap-2 border-t md:border-none pt-3 md:pt-0">
                  <button onClick={()=>navigate(`/admin/regions/${region.id}/view`)} className="p-2 text-gray-400 hover:text-[#00A699] hover:bg-white rounded-lg transition-all shadow-sm md:shadow-none border md:border-none">
                    <View size={16} />
                  </button>
                  <button onClick={()=>navigate(`/admin/regions/${region.id}/edit`)} className="p-2 text-gray-400 hover:text-[#00A699] hover:bg-white rounded-lg transition-all shadow-sm md:shadow-none border md:border-none">
                    <Edit3 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm md:shadow-none border md:border-none">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-500">
          Showing <span className="text-gray-800">{currentData.length}</span> of {regionData.length} results
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-[#00A699] disabled:opacity-40 transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                  ${currentPage === i + 1
                    ? "bg-[#00A699] text-white shadow-teal-200 shadow-lg"
                    : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-[#00A699] disabled:opacity-40 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Regions;