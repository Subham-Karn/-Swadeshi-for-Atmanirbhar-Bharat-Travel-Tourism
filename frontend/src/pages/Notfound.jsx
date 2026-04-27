import React from 'react';
import { motion } from 'framer-motion';
import { Map, ArrowLeft, Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* Animated Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 bg-teal-50 text-[#00A699] rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <Map size={64} />
        </motion.div>

        <h1 className="text-8xl md:text-9xl font-black text-gray-200 tracking-tighter leading-none mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
          YOU'VE WANDERED <span className="text-[#00A699]">OFF TRACK.</span>
        </h2>
        <p className="text-gray-500 font-medium mb-12 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved to a different destination.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-black tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <Home size={18} /> BACK TO HOME
          </button>
          <button 
            onClick={() => navigate('/destinations')}
            className="w-full md:w-auto border-2 border-gray-100 text-gray-400 px-10 py-4 rounded-2xl font-black tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <Search size={18} /> EXPLORE TRIPS
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;