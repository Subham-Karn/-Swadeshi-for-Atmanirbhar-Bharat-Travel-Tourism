import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Star, CheckCircle2, 
  ChevronLeft, Share2, Heart, ShieldCheck,
  TrendingUp, Building2, Edit, List, Plus, Eye
} from 'lucide-react';
import { useRegionsStore } from '../../../store/useRegionStore';
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
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A699]"></div>
      </div>
    );
  }

  if (!region) return null;

  return (
    <div className=" min-h-screen">
      {/* 1. Header Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#00A699] font-black text-xs uppercase tracking-[0.3em] mb-3">
              <MapPin size={14} /> {region.regionType} Territory
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase">
              {region.stateName}
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/admin/regions')}
              className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-gray-400"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => navigate(`/admin/regions/${regionId}/edit`)}
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00A699] transition-all shadow-xl"
            >
              <Edit size={16} className="inline mr-2" /> Edit Region
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cinematic Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        <div className="md:col-span-2 h-125 rounded-[3rem] overflow-hidden shadow-2xl">
          <img 
            src={region.stateImage} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
            alt="Territory Main" 
          />
        </div>
        <div className="hidden md:flex flex-col gap-4">
          <div className="h-[242px] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={region.stateImages?.[1] || region.stateImage} 
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all" 
              alt="Sub" 
            />
          </div>
          <div className="h-[242px] rounded-[2.5rem] bg-gray-900 relative flex items-center justify-center text-white overflow-hidden shadow-lg">
              <img src={region.stateImage} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-md" alt="Overlay" />
              <div className="relative z-10 text-center">
                <span className="block font-black text-3xl">{region.stateImages?.length || 1}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Gallery Assets</span>
              </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Left: Territory Data */}
        <div className="lg:col-span-2">
          {/* Quick Stats Strip */}
          <div className="flex flex-wrap gap-8 mb-12 pb-10 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 text-[#00A699] rounded-xl"><TrendingUp size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Market Reach</p>
                <span className="font-black text-gray-700 text-lg">{region.reach}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Building2 size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Managed Nodes</p>
                <span className="font-black text-gray-700 text-lg">{cities.length} Active Cities</span>
              </div>
            </div>
          </div>

          {/* Dynamic Overview Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Overview</h3>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            <div className="prose prose-slate max-w-none prose-p:text-gray-500 prose-p:leading-relaxed prose-p:text-lg">
              {region.overview ? parseCustomSyntax(region.overview) : "Awaiting territory deployment documentation..."}
            </div>
          </section>

          {/* Active Nodes (Cities) Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Active Nodes</h3>
              <span className="px-4 py-1 bg-gray-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                Deployment Matrix
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cities.map((city) => (
                <motion.div 
                  key={city._id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all p-4"
                >
                  <div className="h-56 rounded-[2rem] overflow-hidden relative group">
                    <img src={city.cityImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#00A699]">
                      ★ {city.rating || "5.0"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-2xl font-black text-gray-800 uppercase tracking-tight mb-6">{city.cityName}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/admin/regions/${region.stateName}/cities/${city._id}/places`)} className="flex-1 py-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-[#00A699] hover:text-white transition-all flex justify-center"><Eye size={18} /></button>
                      <button onClick={() => navigate(`/admin/regions/${region.stateName}/cities/${city._id}/placesadd`)} className="flex-1 py-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-orange-500 hover:text-white transition-all flex justify-center"><Plus size={18} /></button>
                      <button onClick={() => navigate(`/admin/regions/${region.stateName}/cities/${city._id}/edit`)} className="flex-1 py-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-gray-900 hover:text-white transition-all flex justify-center"><List size={18} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Sticky Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-10 bg-white border border-gray-100 rounded-[3rem] shadow-2xl shadow-gray-200/60">
            <div className="flex flex-col mb-10 pb-8 border-b border-gray-50">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Current Status</span>
              <div className="flex items-center justify-between">
                <p className="text-4xl font-black text-gray-900 uppercase tracking-tighter">{region.status}</p>
                <div className={`w-3 h-3 rounded-full animate-pulse ${region.status === 'Active' ? 'bg-[#00A699]' : 'bg-orange-500'}`}></div>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="text-orange-400 fill-orange-400" size={16} />
                  <span className="text-sm font-black text-gray-700 uppercase tracking-widest">Popularity</span>
                </div>
                <span className="text-xs font-bold text-gray-400">{region.isPopular ? "High Priority" : "Standard"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-400">
                  <ShieldCheck size={16} className="text-[#00A699]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Data</span>
                </div>
                <span className="text-[10px] font-black text-gray-300">ADMIN SECURE</span>
              </div>
            </div>

            <button className="w-full bg-[#00A699] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-100 hover:bg-[#008f84] transition-all active:scale-[0.98]">
              MANAGE DEPLOYMENT
            </button>
            
            <p className="text-center mt-6 text-[9px] font-black text-gray-300 uppercase tracking-widest">
              Last Sync: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRegion;