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