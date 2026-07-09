import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPlus, Globe, MapPin, Navigation, Star, 
  Building2, Search, FilterX, Eye, SquarePen, 
  Loader2, Trash2, ChevronLeft, ChevronRight, Map, User,
  Activity, ShieldCheck, Clock
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { processDataList } from '../../../util/dataUtils';
import { useStateStore } from '../../../store/useStateStore';
import DeleteModal from '../../modals/DeleteModal';

const Regions = () => {
  const {fetchStates , states , isLoading , deleteState: deleteRegion} = useStateStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRegion, setTargetRegion] = useState(null);
  const navigate = useNavigate();
 const regions = useMemo(() => {
  return processDataList(states);
}, [states]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(()=>{
    fetchStates();
  },[fetchStates]);

  const openDeleteModal = (region) => {
    setTargetRegion(region);
    setIsModalOpen(true);
  };

  const handleConfirmedDelete = async () => {
    if (!targetRegion) return;
      await deleteRegion(targetRegion._id);
      setIsModalOpen(false);
      fetchStates();
  };


  const filteredRegions = useMemo(() => {
    return regions.filter((r) => {
      const matchesSearch = r.stateName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "All" || r.regionType === filterType;
      return matchesSearch && matchesType;
    });
  }, [regions, searchQuery, filterType]);


  return (
    <div className='w-full min-h-screen font-sans'>
      {/* ─── HEADER ACTIONS ─── */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'>
        <div>
          <h1 className='text-4xl font-black text-slate-900 tracking-tighter'>STATE REGISTRY</h1>
          <p className='text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2'>
            <ShieldCheck size={14} className="text-[#00A699]" /> Verified Territory Management
          </p>
        </div>
          <DeleteModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmedDelete}
          itemName={targetRegion?.stateName}
          title="Purge State Hub"
          isLoading={isLoading}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/admin/regions/add`)}
          className='flex items-center justify-center gap-3 bg-[#00A699] text-white px-8 py-4 rounded-2xl shadow-xl shadow-teal-100 font-black text-xs uppercase tracking-widest'
        >
          <MapPlus size={18} strokeWidth={3} /> Add State
        </motion.button>
      </div>

      {/* ─── ANALYTICS CARDS ─── */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10'>
        <AnalyticCard icon={<Globe />} label="Total Coverage" value={regions.length} sub="States Active" />
        <AnalyticCard icon={<Building2 />} label="Node Density" value={regions.reduce((a, b) => a + (b.citiesCount || 0), 0)} sub="Total Cities" />
        <AnalyticCard icon={<Star />} label="Featured" value={regions.filter(r => r.isPopular).length} sub="High Traffic" />
        <AnalyticCard icon={<Activity />} label="System Health" value="98%" sub="Uptime Active" />
      </div>

      {/* ─── FILTER TOOLBAR ─── */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by state name..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:border-[#00A699] font-bold text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-8 py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 shadow-sm outline-none cursor-pointer"
        >
          <option value="All">All Zones</option>
          {['North', 'South', 'East', 'West', 'Central', 'North-East'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* ─── TABLE-CARD CONTAINER ─── */}
      <div className="space-y-4">
        {/* Desktop Headings */}
        <div className="hidden lg:grid grid-cols-12 px-10 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div className="col-span-4">Regions Detail</div>
          <div className="col-span-2">Regions Type</div>
          <div className="col-span-2 text-center">Cities</div>
          <div className="col-span-2">Created By</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <AnimatePresence mode='popLayout'>
          {filteredRegions.map((region, idx) => (
            <AdminStateCard 
              key={region._id} 
              region={region} 
              index={idx}
              onDelete={() => openDeleteModal(region)}
              onEdit={() => navigate(`/admin/regions/${region._id}/edit`)}
              onView={() => navigate(`/admin/regions/${region._id}/view` , { state: region })}
            />
          ))}
        </AnimatePresence>

        {isLoading && <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#00A699]" size={40} /></div>}
      </div>
    </div>
  );
};

/* ─── TABLE-CARD ROW COMPONENT ─── */
const AdminStateCard = ({ region, index, onDelete, onEdit, onView }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white border relative border-slate-50 rounded-xl p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all group"
  >
   <NewBadge isNew={region.isNew} />
    {/* Visual & Name Column */}
    <div className="col-span-4 flex items-center gap-6">
      <div className="w-24 h-24 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 relative shadow-md">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 2500 + (index * 300) }}
          className="h-full w-full"
        >
          {region.stateImage?.map((img, i) => (
            <SwiperSlide key={i}>
              <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </SwiperSlide>
          ))}
        </Swiper>
        {region.isPopular && (
          <div className="absolute top-1 right-1 z-10 bg-orange-500 p-1 rounded-full text-white shadow-lg">
            <Star size={10} fill="currentColor" />
          </div>
        )}
      </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {region.stateName}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-start gap-1 uppercase max-w-3xl tracking-widest leading-normal line-clamp-2">
            <MapPin size={10} className="shrink-0 mt-0.5 text-[#00A699]" /> 
            <span>{region.reach}</span>
          </p>
        </div>
    </div>

    {/* Region Column */}
    <div className="col-span-2">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-[#00A699] uppercase tracking-widest mb-1">Region Type</span>
        <span className="text-sm font-black text-slate-700 uppercase">{region.regionType} India</span>
      </div>
    </div>

    {/* Cities Column */}
    <div className="col-span-2 text-center">
      <div className="inline-flex flex-col items-center px-5 py-2 bg-slate-50 rounded-2xl">
        <span className="text-xl font-black text-slate-900 leading-none">{region.citiesCount || 0}</span>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Cities</span>
      </div>
    </div>

    {/* Creator Column */}
    <div className="col-span-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#00A699]">
          <User size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Created By</span>
          <span className="text-xs font-bold text-slate-700">{region?.uid?.name || "NA"}</span>
        </div> 
      </div>
    </div>

    {/* Actions Column */}
    <div className="col-span-2 flex items-center justify-end gap-2">
      <ActionBtn icon={<Eye size={18}/>} onClick={onView} label="View" type="teal" />
      <ActionBtn icon={<SquarePen size={18}/>} onClick={onEdit} label="Edit" type="slate" />
      <ActionBtn icon={<Trash2 size={18}/>} onClick={onDelete} label="Delete" type="red" />
    </div>
  </motion.div>
);

/* ─── MINI COMPONENTS ─── */
const AnalyticCard = ({ icon, label, value, sub }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
    <div className="w-14 h-14 rounded-2xl bg-[#00A699]/5 text-[#00A699] flex items-center justify-center shadow-inner">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-2xl font-black text-slate-900 leading-none">{value}</h2>
      <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">{sub}</p>
    </div>
  </div>
);

const ActionBtn = ({ icon, onClick, type }) => {
  const styles = {
    teal: "bg-teal-50 text-[#00A699] hover:bg-[#00A699] hover:text-white",
    slate: "bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white",
    red: "bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"
  };
  return (
    <button onClick={onClick} className={`p-3.5 rounded-2xl transition-all shadow-sm ${styles[type]}`}>
      {icon}
    </button>
  );
};

const NewBadge = ({ isNew }) => {
  if (!isNew) return null;

  return (
    <div className="absolute -top-1 -left-1 z-20">
      <div className="relative">
        {/* Subtle Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#00A699] animate-ping opacity-20" />
        
        {/* Main Badge */}
        <span className="relative bg-[#00A699] text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg shadow-teal-100 flex items-center gap-1 border border-white/20">
           <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
           New
        </span>
      </div>
    </div>
  );
};
export default Regions;