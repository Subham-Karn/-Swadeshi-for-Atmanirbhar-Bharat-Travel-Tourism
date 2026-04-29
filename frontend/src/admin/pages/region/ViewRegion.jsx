import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Globe, TrendingUp, Building2, 
  Edit, MapPin, Plus, Eye, List, Info 
} from 'lucide-react';
import { useRegionsStore } from '../../../store/useRegionStore';
import { statusStyles } from '../../../assets/assets';
import { parseCustomSyntax } from '../../../engine/useTextEngine';

const ViewRegion = () => {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const { regions, cities, fetchCitiesByState, isLoading } = useRegionsStore();

  const region = useMemo(() => regions.find(r => r._id === regionId), [regions, regionId]);

  useEffect(() => {
    if (regionId) fetchCitiesByState(regionId);
  }, [regionId, fetchCitiesByState]);

  if (isLoading && !region) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A699]"></div>
      </div>
    );
  }

  if (!region) return <div className="p-10 text-center font-black text-slate-400">Region node not found.</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-[#F7F7F7] min-h-screen flex flex-col p-4 md:p-8"
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/regions')}
            className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-[#00A699] transition-all border border-gray-100 hover:shadow-md"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{region.stateName}</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              <Globe size={14} className="text-[#00A699]" /> {region.regionType} Territory Node
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/admin/regions/${regionId}/edit`)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 rounded-2xl font-black text-xs text-white uppercase tracking-widest hover:bg-[#00A699] transition-all shadow-xl shadow-slate-200"
        >
          <Edit size={18} /> Edit Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        

      </div>
    </motion.div>
  );
};

export default ViewRegion;