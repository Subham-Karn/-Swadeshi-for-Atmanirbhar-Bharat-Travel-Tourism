import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Navigation } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen min-h-175 w-full flex items-center justify-center overflow-hidden bg-slate-900">
      
      {/* 1. Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop" 
          alt="Taj Mahal India" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-white" />
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#00A699] animate-pulse" />
          <span className="text-xs md:text-sm font-bold tracking-widest uppercase">Explore the Soul of India</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]"
        >
          WANDER <br /> 
          <span className="text-[#00A699]">WITHOUT LIMITS.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-12 font-medium"
        >
          From the snow-capped Himalayas to the tropical backwaters of Kerala, 
          discover India's hidden gems with Bharat Darshan.
        </motion.p>

        {/* 3. Integrated Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-3xl md:rounded-full p-4 shadow-2xl flex flex-col md:flex-row items-center gap-4 text-gray-800"
        >
          {/* Location Input */}
          <div className="flex flex-1 items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-2">
            <MapPin className="text-[#00A699]" size={20} />
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Location</span>
              <input 
                type="text" 
                placeholder="Where to go?" 
                className="bg-transparent outline-none font-bold text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Date Input (Visual Only) */}
          <div className="flex flex-1 items-center gap-3 px-4 w-full border-b md:border-b-0 md:border-r border-gray-100 py-2">
            <Calendar className="text-[#00A699]" size={20} />
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Duration</span>
              <span className="text-sm font-bold text-gray-600">Select Dates</span>
            </div>
          </div>

          {/* Search Button */}
          <button className="w-full md:w-auto bg-[#00A699] text-white px-10 py-4 rounded-2xl md:rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#008f84] transition-all active:scale-95 group">
            <Search size={20} />
            <span>Search</span>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;