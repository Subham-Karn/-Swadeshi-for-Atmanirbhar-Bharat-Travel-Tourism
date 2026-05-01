import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, Star, ChevronLeft, ChevronRight, 
  MapPin, AlignLeft, Info, Activity, 
  Pen,
  Pencil
} from 'lucide-react';
import { parseCustomSyntax } from '../../engine/useTextEngine'; // Ensure this path is correct

const CityNodeCard = ({ city , onOpen }) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60 relative mb-6 overflow-hidden group"
    >
      {/* The overall min-height is now controlled and tighter */}
      <div className="flex flex-col lg:flex-row w-full min-h-80 h-full">
        
        {/* Left: Cinematic Media Core - Reduced width to 35% for a slimmer profile */}
        <div className="lg:w-[38%] relative bg-slate-100 overflow-hidden border-r border-slate-50">
          
          {/* FIXED PENCIL BUTTON: Positioned top-left to avoid Trending Node conflict */}
          <button 
            onClick={() => onOpen(city)} 
            className="absolute top-4 left-4 z-30 text-slate-600 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:bg-[#00A699] hover:text-white"
          >
            <Pencil size={16} />
          </button>

          <AnimatePresence mode="wait">
            {images.length > 0 ? (
              <motion.div 
                key={activeImgIdx} 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="w-full h-full min-h-62.5 lg:h-full"
              >
                <img 
                  src={images[activeImgIdx]} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt={city.cityName} 
                />
                
                {/* Status Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Asset Counter - More compact */}
                <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                  <Activity size={12} className="text-teal-400" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">
                    {activeImgIdx + 1} / {images.length}
                  </span>
                </div>

                {/* Navigation: Only shows on hover, more compact */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={prevImg} className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-slate-900 transition-all">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextImg} className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white hover:text-slate-900 transition-all">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 min-h-62.5">
                <ImageIcon size={32} className="text-slate-200" />
              </div>
            )}
          </AnimatePresence>

          {/* Popular Indicator */}
          {city.isPopular && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 z-20">
              <Star size={12} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-widest">Trending Node</span>
            </div>
          )}
        </div>

        {/* Right: Intelligence Section - More compact padding */}
        <div className="lg:w-[62%] p-6 lg:p-8 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center gap-3 text-[#00A699] mb-2">
              <div className="w-6 h-0.5 bg-[#00A699]/30" />
              <MapPin size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Geographic Deployment</span>
            </div>
            
            {/* Adjusted title size for better fit */}
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">
              {city.cityName || "Unregistered"}<span className="text-[#00A699]">.</span>
            </h3>
            <p className="text-slate-400 text-[8px] font-bold uppercase tracking-[0.2em] mb-4">
              Index: {city._id?.slice(-8) || "NULL-REF"}
            </p>

            {/* Content Box - Max height and line clamping to prevent card stretching */}
            <div className="relative group/text">
              <div className="flex items-center gap-2 text-slate-300 mb-2">
                <AlignLeft size={12} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Briefing</span>
              </div>

              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 group-hover/text:border-teal-100 transition-all max-h-30 overflow-hidden relative">
                <div className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {city.overview || city.description ? (
                      parseCustomSyntax(city.overview || city.description)
                    ) : (
                      <span className="italic text-slate-400">Awaiting node documentation.</span>
                    )}
                  </div>
                  {/* Fade out effect if text is long */}
                  <div className="absolute bottom-0 left-0 w-full h-6 bg-linear-to-t from-slate-50/80 to-transparent" />
              </div>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="mt-4 flex items-center gap-6 border-t border-slate-50 pt-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Status</span>
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Operational</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Priority</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${city.isPopular ? 'text-orange-500' : 'text-slate-800'}`}>
                {city.isPopular ? 'High' : 'Standard'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CityNodeCard;