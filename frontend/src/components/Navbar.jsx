import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Menu, X, Globe, ChevronRight, IndianRupee } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiIndiaGate } from "react-icons/gi";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(!isHomePage || window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Destinations', path: '/destinations' },
    { name: 'Trips', path: '/trips' },
    { name: 'About India', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const textColor = isScrolled ? 'text-gray-800' : 'text-white';
  const subTextColor = isScrolled ? 'text-gray-600' : 'text-gray-100';

  return (
    <nav 
     className={`p-4 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#00A699] p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg ">
            <GiIndiaGate size={24} className="text-white" />
          </div>
          <span className={`text-xl font-black tracking-tighter transition-colors ${textColor}`}>
            BHARAT<span className="text-[#00A699]">DARSHAN</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-bold transition-all hover:text-[#00A699] relative group ${subTextColor}`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#00A699] transition-all duration-300 ${
                location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={()=> navigate('/search')} className={`p-2 rounded-full hover:bg-teal-50 hover:text-[#00A699] transition-all ${textColor}`}>
            <Search size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-300/50" />

          <button onClick={()=>navigate("/auth/login")} className="flex items-center gap-2 bg-[#00A699] text-white px-6 py-2.5 rounded-full font-bold shadow-lg  hover:bg-[#008f84]  transition-all active:scale-95">
            <User size={18} />
            <span>Login</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={28} className="text-gray-800" />
          ) : (
            <Menu size={28} className={textColor} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
            />
            
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden overflow-hidden"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-bold text-gray-800 p-3 hover:bg-teal-50 rounded-xl flex justify-between items-center transition-colors"
                >
                  {link.name}
                  <ChevronRight size={18} className="text-[#00A699]" />
                </Link>
              ))}
              <hr className="border-gray-100 my-2" />
              <button className="w-full bg-[#00A699] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-transform">
                Sign In to Bharat Darshan
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;