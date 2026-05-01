import React, { useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, ImageIcon, Star, Save, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import TerritoryEditor from "../components/TerritoryEditor";
import MultiPhotoModal from "./MultiPhotoModal";

const CityNodeAddModal = ({ isOpen, onClose, onAdd, initialData }) => {
  const [cityData, setCityData] = useState({
    cityName: "",
    cityImages: [],
    overview: "",
    isPopular: false,
  });

  // CRITICAL FIX: Sync initialData with local state when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setCityData({
        cityName: initialData.cityName || "",
        cityImages: initialData.cityImages || [],
        overview: initialData.overview || "",
        isPopular: initialData.isPopular || false,
      });
    } else {
      // Reset to empty if no initialData (for adding new)
      setCityData({ cityName: "", cityImages: [], overview: "", isPopular: false });
    }
    setActiveImgIdx(0); // Reset slider index
  }, [initialData, isOpen]);

  const [isCityGalleryOpen, setIsCityGalleryOpen] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images = cityData.cityImages || [];

  const handleAdd = () => {
    if (!cityData.cityName.trim()) return;
    
    // Pass back the data with the original _id if it exists (crucial for updating)
    onAdd({ ...cityData, _id: initialData?._id });
    
    setCityData({ cityName: "", cityImages: [], overview: "", isPopular: false });
    setActiveImgIdx(0);
    onClose();
  };

  const handleCityGallerySync = (links) => {
    setCityData((prev) => ({ ...prev, cityImages: links }));
    setActiveImgIdx(0);
    setIsCityGalleryOpen(false);
  };

  const nextImg = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setActiveImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImg = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setActiveImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <MultiPhotoModal
            isOpen={isCityGalleryOpen}
            onClose={() => setIsCityGalleryOpen(false)}
            images={cityData.cityImages}
            onSync={handleCityGallerySync}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-[#F7F7F7] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-50 rounded-2xl text-[#00A699]">
                  {initialData ? <Save size={24} /> : <Plus size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {initialData ? "Update City Node" : "Deploy New City Node"}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Territory Expansion Unit</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="group">
                {/* Image Preview Slider */}
                <div className={`relative w-full h-72 rounded-xl overflow-hidden bg-slate-200 border-4 transition-all shadow-inner ${cityData.isPopular ? 'border-orange-400' : 'border-white'}`}>
                  <AnimatePresence mode="wait">
                    {images.length > 0 ? (
                      <motion.div 
                        key={activeImgIdx} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="relative w-full h-full"
                      >
                        <img 
                          src={images[activeImgIdx]} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover" 
                          alt="City Preview" 
                        />
                        
                        <div className="absolute top-5 left-5 bg-black/30 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00A699] animate-pulse" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">
                            {activeImgIdx + 1} / {images.length} Assets
                          </span>
                        </div>

                        {images.length > 1 && (
                          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={prevImg} className="p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-900 shadow-xl">
                              <ChevronLeft size={16} />
                            </button>
                            <button onClick={nextImg} className="p-2 bg-white/90 backdrop-blur-md rounded-full text-slate-900 shadow-xl">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                        <ImageIcon size={48} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Assets Linked</p>
                      </div>
                    )}
                  </AnimatePresence>
                  
                  <div className="absolute bottom-5 right-8 pointer-events-none z-20">
                    <p className="text-white font-black text-3xl uppercase drop-shadow-2xl italic tracking-tighter opacity-90 text-right">
                      {cityData.cityName || "Node ID"}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCityGalleryOpen(true)}
                  className="w-full py-4 mt-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-[#00A699] transition-all"
                >
                  <ImageIcon size={18} /> Manage Gallery ({images.length})
                </button> 
              </div>

              {/* Form Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City Identity</label>
                  <input
                    type="text"
                    className="w-full p-4 bg-white rounded-2xl border-2 border-transparent focus:border-[#00A699] outline-none font-bold text-slate-700 shadow-sm"
                    placeholder="e.g. Varanasi"
                    value={cityData.cityName}
                    onChange={(e) => setCityData({ ...cityData, cityName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Status</label>
                  <div 
                    onClick={() => setCityData({ ...cityData, isPopular: !cityData.isPopular })}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${cityData.isPopular ? 'bg-orange-50 border-orange-200 shadow-inner' : 'bg-white border-transparent shadow-sm'}`}
                  >
                    <span className={`font-bold text-xs uppercase tracking-tight ${cityData.isPopular ? 'text-orange-600' : 'text-slate-400'}`}>
                      {cityData.isPopular ? "Popular Destination" : "Standard Node"}
                    </span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${cityData.isPopular ? 'bg-orange-500' : 'bg-slate-200'}`}>
                      <motion.div 
                        animate={{ x: cityData.isPopular ? 22 : 4 }}
                        className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Overview (Custom Syntax)</label>
                <TerritoryEditor
                  value={cityData.overview}
                  onChange={(e) => setCityData({ ...cityData, overview: e.target.value })}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white border-t border-slate-100 flex gap-4 shrink-0">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!cityData.cityName.trim()}
                className="flex-2 py-4 bg-[#00A699] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-[#008f84] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {initialData ? <Save size={18} /> : <Plus size={18} />} 
                {initialData ? "Apply Changes" : "Add Node to Territory"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CityNodeAddModal;