import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, Star, ChevronLeft, ChevronRight, 
  MapPin, AlignLeft, Activity, Pencil, 
  Layers, CheckCircle2, AlertCircle
} from 'lucide-react';
import { parseCustomSyntax } from '../../engine/useTextEngine';

const CityNodeCard = ({ city, onOpen }) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const images = city.cityImages || city.images || [];

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-300"
    >
      <div className="flex flex-col lg:flex-row items-center gap-6 p-4">
        
        {/* 1. COMPACT MEDIA UNIT (Table Column) */}
        <div className="w-full lg:w-48 shrink-0">
          <div className="relative h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <AnimatePresence mode="wait">
              {images.length > 0 ? (
                <motion.img
                  key={activeImgIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={images[activeImgIdx]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={city.cityName}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon size={24} strokeWidth={1} />
                </div>
              )}
            </AnimatePresence>

            {/* Slider Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                {images.slice(0, 5).map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full ${i === activeImgIdx ? 'bg-white' : 'bg-white/40'}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. IDENTITY BLOCK (Table Column) */}
        <div className="flex-1 min-w-50">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
              {city.cityName || "Unregistered"}
            </h3>
            {city.isPopular && (
              <Star size={12} className="text-orange-500 fill-orange-500" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Activity size={12} className="text-slate-300" /> {city._id?.slice(-8) || "NO-REF"}
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00A699] uppercase tracking-widest">
              <Layers size={12} /> {images.length} Assets
            </div>
          </div>
        </div>

        {/* 3. INTELLIGENCE PREVIEW (Table Column) */}
        <div className="hidden xl:block flex-2 max-w-md">
          <div className="flex items-center gap-2 mb-1 text-slate-300">
            <AlignLeft size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">Briefing</span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
             {city.overview ? city.overview.replace(/[#*]/g, '') : "Awaiting documentation..."}
          </p>
        </div>

        {/* 4. STATUS & PRIORITY (Table Column) */}
        <div className="flex items-center gap-8 px-4 border-l border-slate-50">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Deployment</span>
            <div className="flex items-center gap-1.5">
               <CheckCircle2 size={12} className="text-[#00A699]" />
               <span className="text-[10px] font-black text-slate-700 uppercase">Active</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Priority</span>
            <span className={`text-[10px] font-black uppercase ${city.isPopular ? 'text-orange-500' : 'text-slate-400'}`}>
              {city.isPopular ? 'High' : 'Normal'}
            </span>
          </div>
        </div>

        {/* 5. ACTION UNIT */}
        <div className="flex items-center gap-2">
           <button 
             onClick={(e) => { e.stopPropagation(); prevImg(e); }}
             className="p-2 hover:bg-slate-100 rounded-full text-slate-300 hover:text-slate-900 transition-colors"
           >
             <ChevronLeft size={18} />
           </button>
           <button 
             onClick={(e) => { e.stopPropagation(); nextImg(e); }}
             className="p-2 hover:bg-slate-100 rounded-full text-slate-300 hover:text-slate-900 transition-colors"
           >
             <ChevronRight size={18} />
           </button>
           <div className="w-px h-8 bg-slate-100 mx-2" />
           <button 
             onClick={() => onOpen(city)}
             className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#00A699] hover:border-[#00A699] hover:shadow-lg hover:shadow-teal-100/50 transition-all active:scale-95"
           >
             <Pencil size={18} />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CityNodeCard;