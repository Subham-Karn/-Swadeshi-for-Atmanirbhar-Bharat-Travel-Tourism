import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowRight, Compass, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDestinationsStore } from "../../store/useDestinationsStore";

const DestinationExplorer = () => {
  const { fetchDestinationsCollection, destinationsCollection, isLoading } = useDestinationsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinationsCollection();
  }, [fetchDestinationsCollection]);

  // Dynamically generate unique categories based on regionType
  const categories = ["All", ...new Set(destinationsCollection.map(d => d.regionType))];

  const filteredResults = destinationsCollection.filter(dest => {
    const matchesSearch = dest.cityName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dest.stateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === "All" || dest.regionType === selectedCat;
    return matchesSearch && matchesCat;
  });
  

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* --- Header Section --- */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none mb-6">
            FIND YOUR <span className="text-[#00A699]">SOUL PLACE.</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <div className="relative flex-grow group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input 
                type="text" 
                placeholder="Search by city, state or region..." 
                className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#00A699] text-white px-10 py-5 rounded-[2rem] font-black tracking-widest hover:bg-[#008f84] transition-all flex items-center justify-center gap-2 shadow-lg">
              <Compass size={20} /> DISCOVER
            </button>
          </div>
        </div>

        {/* --- Dynamic Filter Chips --- */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                selectedCat === cat 
                ? 'bg-gray-900 text-white shadow-xl' 
                : 'bg-gray-100 text-gray-500 hover:bg-teal-50 hover:text-[#00A699]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- Results Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            // Skeleton Loader
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-[450px] rounded-[3rem] bg-gray-200 animate-pulse" />
            ))
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredResults.map((dest) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={dest._id}
                  className="group relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl"
                >
                  {/* Background Image */}
                  <img src={dest.cityImages[0]} alt={dest.cityName} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Normal State: Details */}
                  <div className="absolute bottom-8 left-8 transition-opacity duration-300 group-hover:opacity-0">
                    <p className="text-teal-400 font-black uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
                      <MapPin size={14} /> {dest.stateName}
                    </p>
                    <h3 className="text-4xl font-black text-white">{dest.cityName}</h3>
                  </div>

                  {/* Hover State: Rating & Time */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/60 backdrop-blur-sm">
                    <div className="text-center text-white">
                      <div className="flex justify-center items-center gap-1 text-yellow-400 mb-2">
                        <Star size={24} fill="currentColor" />
                        <span className="text-3xl font-black">{dest.rating}</span>
                      </div>
                      <p className="flex items-center gap-2 text-sm font-bold opacity-90 mb-8">
                        <Calendar size={16} /> Best time: {dest.bestTimeToVisit}
                      </p>
                      <button 
                        onClick={() => navigate(`/destinations/${dest?.stateName}/${dest?.stateId}/${dest?.cityName}/${dest?._id}`)}
                        className="bg-white text-gray-900 px-8 py-3 rounded-full font-black hover:bg-[#00A699] hover:text-white transition-all shadow-xl"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* --- Empty State --- */}
        {!isLoading && filteredResults.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-black text-gray-400">No destinations found.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationExplorer;