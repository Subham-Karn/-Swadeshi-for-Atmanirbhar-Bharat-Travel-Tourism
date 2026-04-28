import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Menu, X, Globe, ChevronRight, 
  LogOut, Briefcase, Settings, ChevronDown, 
  UserStar
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiIndiaGate } from "react-icons/gi";
import { useAuthStore } from '../store/useAuthStore'; // Import your store

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  
  const { user, logout } = useAuthStore(); // Pull user and logout from store
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Handle Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(!isHomePage || window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const getProfileName  = (name = "" ) =>{
  let nameArr = name.split(" ");
   return nameArr[0][0].toUpperCase() + nameArr[1][0].toUpperCase();
}

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Destinations', path: '/destinations' },
    { name: 'Trips', path: '/trips' },
    { name: 'About India', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const textColor = isScrolled ? 'text-gray-800' : 'text-white';
  const subTextColor = isScrolled ? 'text-gray-600' : 'text-gray-100';

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <nav className={`p-4 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#00A699] p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg">
            <GiIndiaGate size={24} className="text-white" />
          </div>
          <span className={`text-xl font-black tracking-tighter transition-colors ${textColor}`}>
            BHARAT<span className="text-[#00A699]">DARSHAN</span>
          </span>
        </Link>

        {/* Desktop Links (No changes here) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className={`text-sm font-bold transition-all hover:text-[#00A699] relative group ${subTextColor}`}>
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#00A699] transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => navigate('/search')} className={`p-2 rounded-full hover:bg-teal-50 hover:text-[#00A699] transition-all ${textColor}`}>
            <Search size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-300/50" />

          {user ? (
            /* --- USER DROPDOWN SECTION --- */
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className={`flex items-center gap-2 p-1.5 rounded-full hover:bg-teal-50 transition-all border-2 ${isScrolled ? 'border-gray-100' : 'border-white/20'}`}
              >
                <div className="w-8 h-8 bg-[#00A699] rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                  {getProfileName(user.name)}
                </div>
                <ChevronDown size={16} className={textColor} />
              </button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden py-2"
                  >
                    <div className="px-6 py-4 border-b border-gray-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
                      <p className="text-gray-900 font-bold truncate">{user.name}</p>
                    </div>

                    <div className="p-2">
                      <button onClick={() => navigate('/my-bookings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-teal-50 hover:text-[#00A699] rounded-2xl transition-all">
                        <Briefcase size={18} /> My Bookings
                      </button>
                    </div>
                    {
                      user?.role.toLowerCase() === 'admin' && (
                        <div className="p-2">
                          <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-teal-50 hover:text-[#00A699] rounded-2xl transition-all">
                            <UserStar size={18} /> Vist Admin
                          </button>
                        </div>
                      )
                    }
                    <div className="px-2 pt-2 border-t border-gray-50">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* --- LOGIN BUTTON --- */
            <button 
              onClick={() => navigate("/auth/login")} 
              className="flex items-center gap-2 bg-[#00A699] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-[#008f84] transition-all active:scale-95"
            >
              <User size={18} />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle (No changes here) */}
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
          <div className="fixed inset-0 z-100 md:hidden">
            {/* 1. Frosted Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-gray-900/40 "
            />
            
            {/* 2. Content Card (Bottom Sheet Style) */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 shadow-2xl flex flex-col gap-6"
            >
              {/* Handle Indicator */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2" />

              {/* User Identity Section */}
              <div className="flex items-center justify-between">
                {user ? (
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#00A699] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-100">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900 leading-tight">{user.name}</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Premium Explorer</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-xl font-black text-gray-900 leading-tight">Welcome, Guest</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sign in to save trips</p>
                  </div>
                )}
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                  <X size={20} />
                </button>
              </div>

              {/* Action Grid */}
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <button onClick={() => navigate('/my-bookings')} className="flex w-full items-start gap-3 p-5 bg-teal-50 rounded-3xl border border-teal-100 group">
                      <Briefcase className="text-[#00A699]" size={24} />
                      <span className="text-sm font-black text-gray-900">Bookings</span>
                    </button>
                    {
                      user?.role.toLowerCase() === 'admin' && (
                        <button onClick={() => navigate('/admin')} className="flex w-full items-start gap-3 p-5 bg-teal-50 rounded-3xl border border-teal-100 group">
                          <UserStar className="text-[#00A699]" size={24} />
                          <span className="text-sm font-black text-gray-900">Admin</span>
                        </button>
                      )
                    }
                  </>
                ) : (
                  <button 
                    onClick={() => navigate('/auth/login')}
                    className="col-span-2 flex items-center justify-center gap-3 p-5 bg-gray-900 text-white rounded-3xl font-black tracking-widest active:scale-[0.98] transition-transform"
                  >
                    <User size={20} /> LOGIN TO ACCOUNT
                  </button>
                )}
              </div>

              {/* Navigation List */}
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-2">Quick Navigation</p>
                <div className="grid grid-cols-1 gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`group flex items-center justify-between p-4 rounded-2xl transition-all ${
                        location.pathname === link.path ? 'bg-teal-500 text-white' : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="font-bold">{link.name}</span>
                      <ChevronRight size={18} className={location.pathname === link.path ? 'text-white' : 'text-gray-300'} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Logout Button (Only if Logged In) */}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-5 text-red-500 font-black text-xs uppercase tracking-widest border-2 border-red-50 rounded-3xl hover:bg-red-50 transition-all"
                >
                  <LogOut size={18} /> Log Out
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;