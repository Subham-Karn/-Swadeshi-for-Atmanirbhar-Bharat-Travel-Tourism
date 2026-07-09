import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, SlidersHorizontal, Plus, MoreVertical, 
  Mail, Calendar, MapPin, UserX, UserCheck, X, Loader2,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// --- HORIZONTAL PROFILE CARD COMPONENT ---

const UserRowCard = ({ user, index, onToggleStatus }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getRoleColors = (role) => {
    switch(role) {
      case 'Super Admin': return 'bg-purple-50 border-purple-100 text-purple-600';
      case 'admin': return 'bg-purple-50 border-purple-100 text-purple-600';
      case 'Editor': return 'bg-blue-50 border-blue-100 text-blue-600';
      default: return 'bg-slate-50 border-slate-100 text-slate-600';
    }
  };

  const status = user.isActive === false ? "Suspended" : "Active";
  const avatarInitials = (user.name || "User").split(' ').map(n => n[0]).join('').slice(0, 2);

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
              <MapPin size={12} className="text-slate-300" /> {user.address || "No address saved"}
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
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
            status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {status}
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
                    {status === 'Active' ? (
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
  const { adminUsers, fetchAdminUsers, createAdminUser, updateAdminUser, loading } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    gender: "male",
    age: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "user",
    isActive: true,
  });

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  const handleToggleStatus = (id) => {
    const target = adminUsers.find((user) => user._id === id);
    if (target) updateAdminUser(id, { isActive: target.isActive === false });
  };

  const resetForm = () => {
    setForm({
      name: "",
      username: "",
      gender: "male",
      age: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      role: "user",
      isActive: true,
    });
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    const result = await createAdminUser(form);
    if (result.success) {
      resetForm();
      setIsAddOpen(false);
    }
  };

  const filteredUsers = adminUsers.filter(user => 
    (user.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.role || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen  text-slate-800 antialiased font-sans selection:bg-[#00A699]/10 selection:text-[#00A699]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Module Header Area */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Users Management
            </h1>
            <p className='text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2'>
            <ShieldCheck size={14} className="text-[#00A699]" /> Verified Users Management
          </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-[#00A699] hover:bg-[#008c82] text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-[#00A699]/10 active:scale-95 w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add User</span>
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Total Users: {filteredUsers.length}</span>
          </div>
        </div>

        {/* VERTICAL STACK CONTAINER OF HORIZONTAL CARDS */}
        <main className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Accounts</h2>
            {loading && <span className="text-xs text-slate-400 font-medium animate-pulse">Syncing permissions...</span>}
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {loading ? (
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

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center px-4">
          <form onSubmit={handleCreateUser} className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Add User</h3>
                <p className="text-xs font-bold text-slate-400">Create a verified user or admin account.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddOpen(false);
                }}
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
              {[
                ["name", "Full Name", "text"],
                ["username", "Username", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["age", "Age", "number"],
                ["password", "Password", "password"],
              ].map(([key, label, type]) => (
                <label key={key} className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{label}</span>
                  <input
                    required
                    type={type}
                    min={key === "age" ? "1" : undefined}
                    value={form[key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699]"
                  />
                </label>
              ))}

              <label className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gender</span>
                <select
                  value={form.gender}
                  onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699] bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699] bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Address</span>
                <textarea
                  required
                  rows="3"
                  value={form.address}
                  onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699] resize-none"
                />
              </label>

              <label className="md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 accent-[#00A699]"
                />
                <span className="text-xs font-black uppercase tracking-wider text-slate-600">Account active</span>
              </label>
            </div>

            <div className="p-5 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setIsAddOpen(false);
                }}
                className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#00A699] hover:bg-[#008c82] disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" />}
                Create User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUsersManagementPage;
