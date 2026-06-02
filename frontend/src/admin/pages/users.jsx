import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, SlidersHorizontal, Plus, MoreVertical, 
  Mail, Calendar, MapPin, UserX, UserCheck
} from 'lucide-react';

// --- USERS MANAGEMENT DUMMY DATA ---
const DUMMY_USERS = [
  { _id: "U-8821", name: "Aarav Mehta", email: "aarav.mehta@registry.com", role: "Super Admin", status: "Active", joined: "May 12, 2026", location: "Mumbai, MH" },
  { _id: "U-8820", name: "Deepika Rao", email: "deepika.r@registry.com", role: "Editor", status: "Active", joined: "May 18, 2026", location: "Bengaluru, KA" },
  { _id: "U-8819", name: "Devansh Joshi", email: "joshidev@registry.com", role: "Viewer", status: "Suspended", joined: "Apr 02, 2026", location: "Jaipur, RJ" },
  { _id: "U-8818", name: "Ananya Sen", email: "ananya.sen@registry.com", role: "Editor", status: "Active", joined: "Mar 29, 2026", location: "Kolkata, WB" },
  { _id: "U-8817", name: "Kabir Thapar", email: "kabir.t@registry.com", role: "Viewer", status: "Active", joined: "Jan 15, 2026", location: "New Delhi, DL" }
];

// --- HORIZONTAL PROFILE CARD COMPONENT ---

const UserRowCard = ({ user, index, onToggleStatus }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getRoleColors = (role) => {
    switch(role) {
      case 'Super Admin': return 'bg-purple-50 border-purple-100 text-purple-600';
      case 'Editor': return 'bg-blue-50 border-blue-100 text-blue-600';
      default: return 'bg-slate-50 border-slate-100 text-slate-600';
    }
  };

  const avatarInitials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.04 }}
      className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md hover:border-slate-200 transition-all duration-300 group relative"
    >
      {/* Left Data Core: Avatar & Primary Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-500 uppercase tracking-tight shrink-0 group-hover:bg-[#00A699]/10 group-hover:border-[#00A699]/20 group-hover:text-[#00A699] transition-all">
          {avatarInitials}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase truncate">
              {user.name}
            </h4>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${getRoleColors(user.role)}`}>
              {user.role}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1 normal-case font-medium text-slate-500">
              <Mail size={12} className="text-slate-300" /> {user.email}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-300" /> {user.location}
            </span>
          </div>
        </div>
      </div>

      {/* Right Data Core: Audit Timeline & Status Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-50 sm:border-0 pt-3 sm:pt-0 shrink-0">
        <div className="flex items-center gap-2 text-left sm:text-right">
          <Calendar size={12} className="text-slate-300 sm:hidden" />
          <div>
            <span className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Registered</span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{user.joined}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
            user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {user.status}
          </span>

          {/* Context Options Anchor */}
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/40 p-1 z-20">
                  <button 
                    onClick={() => { onToggleStatus(user._id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    {user.status === 'Active' ? (
                      <>
                        <UserX size={14} className="text-red-500" />
                        <span className="text-red-600">Suspend Access</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} className="text-emerald-500" />
                        <span className="text-emerald-600">Activate Access</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- HORIZONTAL CARD SKELETON PANEL ---

const UserRowSkeleton = () => (
  <div className="p-4 bg-white border border-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-12" />
        </div>
        <div className="h-2.5 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
    <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-slate-50 sm:border-0 pt-3 sm:pt-0 shrink-0 pl-4">
      <div className="hidden sm:block h-5 bg-slate-100 rounded w-16" />
      <div className="w-16 h-5 bg-slate-100 rounded-full" />
      <div className="w-4 h-4 bg-slate-50 rounded" />
    </div>
  </div>
);

// --- MAIN LIST HOUSING PANEL ---

const AdminUsersManagementPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(DUMMY_USERS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(user => {
      if (user._id === id) {
        return { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return user;
    }));
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased p-4 md:p-8 font-sans selection:bg-[#00A699]/10 selection:text-[#00A699]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Module Header Area */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00A699]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A699]">Access & Authority Ledger</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              User <span className="text-slate-400 font-normal">Ledger</span>
            </h1>
          </div>
          <button className="flex items-center gap-2 bg-[#00A699] hover:bg-[#008c82] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-[#00A699]/10 active:scale-95 w-full sm:w-auto justify-center">
            <Plus size={16} />
            <span>Add New Operator</span>
          </button>
        </header>

        {/* Query & Count Header Control Ribbon */}
        <div className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 justify-between items-center shadow-sm shadow-slate-100/50">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00A699] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter platform profiles..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-sm font-medium py-3 pl-11 pr-4 rounded-xl border border-transparent focus:outline-none focus:border-slate-200 focus:bg-white text-slate-700 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
              <SlidersHorizontal size={16} />
            </button>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Total Seats: {filteredUsers.length}</span>
          </div>
        </div>

        {/* VERTICAL STACK CONTAINER OF HORIZONTAL CARDS */}
        <main className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Accounts</h2>
            {isLoading && <span className="text-xs text-slate-400 font-medium animate-pulse">Syncing permissions...</span>}
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <UserRowSkeleton key={i} />)
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <UserRowCard 
                    key={user._id} 
                    user={user} 
                    index={idx} 
                    onToggleStatus={handleToggleStatus} 
                  />
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider border border-dashed border-slate-100 rounded-2xl">
                  No active application accounts match your search parameters.
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminUsersManagementPage;