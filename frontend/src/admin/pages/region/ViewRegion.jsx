import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Globe, Navigation, 
  TrendingUp, Building2, Edit, MapPin, 
  Plus, Eye, List
} from 'lucide-react';
import { useRegionsStore } from '../../../store/useRegionStore';
import { statusStyles } from '../../../assets/assets';

const ViewRegion = () => {
  const { regionId } = useParams();
  const navigate = useNavigate();
  
  // Connect to your Zustand Store
  const { regions, cities, fetchCitiesByState, isLoading } = useRegionsStore();

  // Find the specific state from the store
  const region = useMemo(() => {
    return regions.find(r => r._id === regionId);
  }, [regions, regionId]);

  useEffect(() => {
    if (regionId) {
      fetchCitiesByState(regionId);
    }
  }, [regionId, fetchCitiesByState]);

  if (isLoading && !region) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A699]"></div>
      </div>
    );
  }

  if (!region) return <div className="p-10 text-center font-bold">Region not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-[#F7F7F7] min-h-screen flex flex-col"
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/regions')}
            className="p-3 bg-white rounded-2xl shadow-sm text-gray-500 hover:text-[#00A699] transition-all border border-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{region.stateName}</h1>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 mt-1">
              <Globe size={14} className="text-[#00A699]" /> {region.regionType} Territory
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/admin/regions/${regionId}/edit`)}
            className="flex items-center gap-2 px-6 py-3 bg-[#00A699] rounded-2xl font-black text-white hover:bg-[#008f84] transition-all shadow-lg shadow-teal-100"
          >
            <Edit size={18} /> Edit Region
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Left: Summary Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative rounded-xl overflow-hidden aspect-3/2 shadow-xl border-4 border-white">
            <img 
               src={region.stateImage} 
               referrerPolicy="no-referrer" 
               className="w-full h-full object-cover" 
               alt="" 
            />
            <div className="absolute top-6 right-6">
              <span className={`px-5 py-2 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 
                ${statusStyles[region.status]}`}>
                {region.status}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest flex items-center gap-2 border-b border-gray-50 pb-2">
              <List size={16} className="text-[#00A699]"/> State Overview
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed italic">
              {region.overview || "No overview provided for this territory."}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <TrendingUp className="text-[#00A699] mb-2" size={18} />
                <p className="text-[9px] font-black text-gray-400 uppercase">Connectivity</p>
                <p className="text-sm font-black text-gray-800">{region.reach}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <Building2 className="text-[#00A699] mb-2" size={18} />
                <p className="text-[9px] font-black text-gray-400 uppercase">Managed Cities</p>
                <p className="text-sm font-black text-gray-800">{cities.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: City Cards with Places Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Cities</h2>
            <span className="px-4 py-1 bg-teal-50 text-[#00A699] text-[10px] font-black rounded-full uppercase">
              {cities.length} Total
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {cities.map((city) => (
                <motion.div 
                  key={city._id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm group"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={city.cityImage} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt=""
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                       <p className="text-white text-xs font-medium leading-tight">
                         {city.overview}
                       </p>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-none">{city.cityName}</h3>
                        <p className="text-[10px] font-black text-[#00A699] uppercase tracking-widest mt-2 flex items-center gap-1">
                           <MapPin size={10}/> Rating: {city.rating || "5.0"}
                        </p>
                      </div>
                    </div>

                  {/* Places Management Sub-Actions */}
                  <div className="flex gap-3 mt-8 border-t border-gray-50 pt-6">
                    {[
                      { label: 'View', icon: <Eye size={16} />, path: `/admin/regions/${region.stateName}/cities/${city._id}/places`, title: 'View Places' },
                      { label: 'Add', icon: <Plus size={16} />, path: `/admin/regions/${region.stateName}/cities/${city._id}/placesadd`, title: 'Add Place' },
                      { label: 'Setup', icon: <List size={16} />, path: `/admin/regions/${region.stateName}/cities/${city._id}/places/123344/edit`, title: 'Settings' }
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => navigate(btn.path)}
                        title={btn.title}
                        className="flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-slate-50 text-slate-400 hover:bg-[#00A699] hover:text-white transition-all duration-300 group/btn"
                      >
                        <div className="transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5">
                          {btn.icon}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                          {btn.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewRegion;