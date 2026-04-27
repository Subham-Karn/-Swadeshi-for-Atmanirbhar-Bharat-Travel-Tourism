import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-teal-900/5 text-center border border-gray-100"
      >
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 relative">
          <ShieldAlert size={40} />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-red-500 rounded-3xl opacity-10"
          />
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
          SESSION EXPIRED
        </h2>
        <p className="text-gray-500 font-medium mb-10 text-sm leading-relaxed">
          For your security, your session has timed out due to inactivity. Please log in again to continue planning your journey.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#00A699] text-white py-5 rounded-2xl font-black tracking-widest shadow-lg shadow-teal-100 hover:bg-[#008f84] transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={18} /> LOGIN AGAIN
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            <Lock size={12} /> Data is encrypted & secure
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SessionExpired;