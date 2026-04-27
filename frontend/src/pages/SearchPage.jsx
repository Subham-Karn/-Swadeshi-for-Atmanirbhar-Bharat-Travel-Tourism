import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, MapPin, ChevronRight, X, IndianRupee } from 'lucide-react';

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState(50000);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Adventure", "Heritage", "Beach", "Hill Station", "Spiritual"];

  // Dummy Data
  const searchResults = [
    { id: 1, title: "Zanskar Valley Trek", location: "Ladakh", price: 42000, rating: 4.9, category: "Adventure", img: "https://images.unsplash.com/photo-1581791534721-e599df4417f7" },
    { id: 2, title: "Hampi Ruins Tour", location: "Karnataka", price: 8500, rating: 4.7, category: "Heritage", img: "https://images.unsplash.com/photo-1581404554128-5032fe6a4053" },
    { id: 3, title: "Varkala Cliff Stay", location: "Kerala", price: 12000, rating: 4.8, category: "Beach", img: "https://images.unsplash.com/photo-1590516773341-a6797a7e10df" },
    { id: 4, title: "Kasol Riverside", location: "Himachal", price: 5500, rating: 4.5, category: "Hill Station", img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23" },
  ];

  return (
      <div className="min-h-screen bg-[#FDFDFD] pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Main Search Bar Area */}
          <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-teal-900/5 flex flex-col md:flex-row items-center gap-4 mb-12 border border-gray-100">
            <div className="flex-grow flex items-center gap-3 px-4 w-full">
              <Search className="text-[#00A699]" size={24} />
              <input 
                type="text" 
                placeholder="Search by city, state, or experience..." 
                className="w-full bg-transparent border-none outline-none font-bold text-gray-700 placeholder:text-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button className="w-full md:w-auto bg-[#00A699] text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-[#008f84] active:scale-95">
              SEARCH
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-72 space-y-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Filter By
                </h3>
                
                {/* Categories */}
                <div className="space-y-3">
                  <p className="font-black text-gray-900 text-sm mb-4">Experience Category</p>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="cat" 
                        className="w-4 h-4 accent-[#00A699]" 
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span className={`text-sm font-bold transition-colors ${selectedCategory === cat ? 'text-[#00A699]' : 'text-gray-500 group-hover:text-gray-800'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-black text-gray-900 text-sm">Max Budget</p>
                  <span className="text-[#00A699] font-black text-sm">₹{priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min="2000" 
                  max="100000" 
                  step="1000"
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00A699]"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">
                  <span>₹2k</span>
                  <span>₹100k</span>
                </div>
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {searchResults.map(trip => (
                  <div key={trip.id} className="group cursor-pointer">
                    <div className="relative h-64 rounded-[2rem] overflow-hidden mb-4 shadow-md">
                      <img src={trip.img} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-[#00A699]">
                        {trip.category}
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">{trip.title}</h3>
                        <div className="flex items-center gap-1 text-gray-900 font-bold text-sm">
                          <Star size={14} fill="currentColor" className="text-orange-400" /> {trip.rating}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs font-bold mb-3 flex items-center gap-1">
                        <MapPin size={12} /> {trip.location}, India
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-black text-gray-900">₹{trip.price.toLocaleString()}<span className="text-xs text-gray-400 font-medium"> / person</span></p>
                        <button className="text-[#00A699] font-black text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
  );
};

export default SearchPage;