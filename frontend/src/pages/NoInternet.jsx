import React from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Globe } from "lucide-react";

const NoInternet = () => {
  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.href = "/";
    } else {
      // Small pulse effect to show it checked
      console.log("Still offline...");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-red-50 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <WifiOff size={40} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">
          Connection Lost
        </h1>
        
        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
          The terminal has lost contact with the global network. Please check your local uplink and try again.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleRetry}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-[#00A699] transition-all"
          >
            <RefreshCw size={16} /> Reconnect System
          </button>
          
          <div className="flex items-center justify-center gap-2 pt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Status: Offline Mode
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NoInternet;