import React, { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ChevronLeft, X } from 'lucide-react';
import { slider } from '../../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';

const Slider = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for Desktop collapse
  const [isOpen, setIsOpen] = useState(true);
  // State for Mobile drawer
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navContent = (
    <>
      {/* Header Section */}
      <div className="flex items-center justify-between p-5 h-20 border-b border-gray-100 overflow-hidden">
        <AnimatePresence mode="wait">
          {(isOpen || isMobileOpen) && (
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="font-bold text-xl whitespace-nowrap text-gray-800"
            >
              Admin <span className="text-[#00A699]">Panel</span>
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Desktop Toggle Button */}
        <button
          onClick={() => (isMobileOpen ? setIsMobileOpen(false) : setIsOpen(!isOpen))}
          className="p-2 rounded-lg hover:bg-teal-50 transition-colors text-gray-400 hover:text-[#00A699]"
        >
          {isMobileOpen ? <X size={22} /> : isOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
        {slider.map((item, index) => {
          const active = isActive(item.link);
          return (
            <div
              key={index}
              onClick={() => {
                navigate(item.link);
                setIsMobileOpen(false); // Close drawer on mobile after clicking
              }}
              className={`relative flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 group
                ${active 
                  ? 'bg-teal-50 text-[#00A699]' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
            >
              {active && (
                <motion.div 
                  layoutId="activePill"
                  className="absolute left-0 w-1 h-6 bg-[#00A699] rounded-r-full" 
                />
              )}

              <div className={`shrink-0 flex justify-center ${active ? 'text-[#00A699]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </div>

              <AnimatePresence>
                {(isOpen || isMobileOpen) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-semibold whitespace-nowrap overflow-hidden text-sm md:text-base"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip (Desktop only, when collapsed) */}
              {!isOpen && !isMobileOpen && (
                <div className="hidden md:block absolute left-16 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-gray-800 text-white text-xs px-3 py-2 rounded-md z-100 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="w-9 h-9 rounded-lg bg-[#00A699] shrink-0 flex items-center justify-center text-white font-bold">JD</div>
          {(isOpen || isMobileOpen) && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">John Doe</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. MOBILE TRIGGER BUTTON (Visible only on mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-3 bg-white shadow-md border border-gray-200 rounded-full text-[#00A699]"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 2. MOBILE OVERLAY (Dark background when sidebar is open) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-60 md:hidden "
          />
        )}
      </AnimatePresence>

      {/* 3. MOBILE SIDEBAR (Drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-70 bg-white z-70 flex flex-col shadow-2xl md:hidden"
          >
            {navContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. DESKTOP SIDEBAR (Static) */}
      <motion.div
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative hidden md:flex h-screen flex-col shadow-xl border-r bg-white border-gray-200"
      >
        {navContent}
      </motion.div>
    </>
  );
};

export default Slider;