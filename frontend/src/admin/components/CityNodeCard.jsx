import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import MultiPhotoModal from '../modals/MultiPhotoModal';
import TerritoryEditor from './TerritoryEditor';

const CityNodeCard = ({ city, index, onCityChange }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
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
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-8 rounded-xl border border-gray-100 shadow-xl shadow-slate-200/40 relative mb-10 group"
  >
    <MultiPhotoModal
      isOpen={isGalleryOpen}
      onClose={() => setIsGalleryOpen(false)}
      images={images}
      onSync={(links) => onCityChange(index, "cityImages", links)}
    />

    <div className="flex flex-col gap-8 w-full">
      
      {/* Top Row: Info & Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left: Inputs */}
        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
              City Designation
            </label>
            <input
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white font-bold text-slate-700 outline-none transition-all shadow-inner"
              placeholder="e.g. Patna"
              value={city.cityName}
              onChange={(e) => onCityChange(index, "cityName", e.target.value)}
            />
          </div>

          <button
            onClick={() => setIsGalleryOpen(true)}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-slate-300 hover:bg-[#00A699] transition-all group/btn"
          >
            <ImageIcon size={18} className="group-hover/btn:rotate-6 transition-transform" /> 
            Manage Node Gallery
          </button>
        </div>

        {/* Right: Slider Preview */}
        <div className={`relative w-full h-56 rounded-xl overflow-hidden bg-slate-50 border-2 transition-all shadow-md ${city.isPopular ? 'border-orange-400' : 'border-transparent'}`}>
          <AnimatePresence mode="wait">
            {images.length > 0 ? (
              <motion.div key={activeImgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full">
                <img src={images[activeImgIdx]} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="City" />
                
                <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00A699] animate-pulse" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">
                    {activeImgIdx + 1} / {images.length} Assets
                  </span>
                </div>

                {images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button onClick={prevImg} className="p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-900 shadow-xl hover:scale-110 transition-transform">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextImg} className="p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-900 shadow-xl hover:scale-110 transition-transform">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-200 gap-2">
                <ImageIcon size={48} strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-widest">No Assets Uploaded</p>
              </div>
            )}
          </AnimatePresence>

          {/* Popularity Toggle Overlay */}
          <div className="absolute top-5 right-5 z-20">
            <button 
                onClick={() => onCityChange(index, "isPopular", !city.isPopular)}
                className={`p-2.5 rounded-2xl backdrop-blur-md border border-white/20 transition-all shadow-lg ${city.isPopular ? 'bg-orange-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}>
                <Star size={16} fill={city.isPopular ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="absolute bottom-5 right-8 pointer-events-none z-20">
            <p className="text-white font-black text-2xl uppercase drop-shadow-2xl italic tracking-tighter opacity-90">
                {city.cityName || "Node"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Full Width Editor */}
      <div className="w-full pt-4 border-t border-slate-50">
        <TerritoryEditor
          value={city.overview || city.description || ""}
          onChange={(e) => onCityChange(index, "overview", e.target.value)}
        />
      </div>

    </div>
  </motion.div>
  );
};

export default CityNodeCard;