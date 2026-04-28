import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Animated Icon Container */}
        <div className="relative inline-block mb-8">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto"
          >
            <Lock size={48} />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
          >
            <ShieldAlert size={20} />
          </motion.div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          ACCESS <span className="text-red-500">DENIED.</span>
        </h1>
        
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
          You don't have the required permissions to view this journey. 
          Please log in with an authorized account or head back to safety.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/auth/login')}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            <LogIn size={18} /> LOGIN IN
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full bg-white border-2 border-gray-100 text-gray-400 py-4 rounded-2xl font-black tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <ArrowLeft size={18} /> GO BACK
          </button>
        </div>

        <div className="mt-12">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                Error Code: 401 — Unauthorized
            </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;