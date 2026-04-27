import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, ArrowRight, Star, Compass, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Dummy Data: All Destinations across India
const indiaDestinations = [
  { id: 1, name: "Munnar", state: "Kerala", category: "Hill Station", price: "₹8,000", rating: 4.8, img: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b", slug: "munnar" },
  { id: 2, name: "Jaipur", state: "Rajasthan", category: "Heritage", price: "₹12,000", rating: 4.7, img: "https://images.unsplash.com/photo-1524230572899-a752b3835840", slug: "jaipur" },
  { id: 3, name: "Leh", state: "Ladakh", category: "Adventure", price: "₹35,000", rating: 4.9, img: "https://images.unsplash.com/photo-1581791534721-e599df4417f7", slug: "leh" },
  { id: 4, name: "Alleppey", state: "Kerala", category: "Beach", price: "₹10,000", rating: 4.6, img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2", slug: "alleppey" },
  { id: 5, name: "Jodhpur", state: "Rajasthan", category: "Heritage", price: "₹9,500", rating: 4.5, img: "https://images.unsplash.com/photo-1599661046289-e31887846eac", slug: "jodhpur" },
  { id: 6, name: "Rishikesh", state: "Uttarakhand", category: "Spiritual", price: "₹7,000", rating: 4.9, img: "https://images.unsplash.com/photo-1545208393-2160291ba89e", slug: "rishikesh" },
];

const DestinationExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Hill Station", "Heritage", "Adventure", "Beach", "Spiritual"];

  const filteredResults = indiaDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          dest.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === "All" || dest.category === selectedCat;
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
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00A699] transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="Search by city, state or vibe..." 
                className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#00A699]/20 font-bold text-gray-700 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#00A699] text-white px-10 py-5 rounded-[2rem] font-black tracking-widest hover:bg-[#008f84] transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100">
              <Compass size={20} className="animate-spin-slow" /> DISCOVER
            </button>
          </div>
        </div>

        {/* --- Filter Chips --- */}
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
          <AnimatePresence mode='popLayout'>
            {filteredResults.map((dest) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={dest.id}
                className="group relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200"
              >
                {/* Background Image */}
                <img src={dest.img} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {dest.category}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-black uppercase tracking-[0.2em] mb-2">
                    <MapPin size={14} /> {dest.state}
                  </div>
                  <h3 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">
                    {dest.name}
                  </h3>
                  
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div>
                       <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Avg. Package</p>
                       <p className="text-white text-xl font-black">{dest.price}</p>
                    </div>
                    {/* EXPLORE BUTTON */}
                    <button 
                      onClick={() => navigate(`/destinations/${dest.state.toLowerCase()}`)}
                      className="bg-white text-gray-900 w-14 h-14 rounded-full flex items-center justify-center hover:bg-[#00A699] hover:text-white transition-all active:scale-95 shadow-xl"
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- Empty State --- */}
        {filteredResults.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-black text-gray-400">No hidden gems found here...</h2>
            <p className="text-gray-400 mt-2">Try searching for 'Kerala' or 'Heritage'</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationExplorer;