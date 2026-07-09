import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CreditCard, Eye, IndianRupee as DollarSign,
  TrendingUp, ArrowUpRight, CheckCircle2, Clock,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// --- LIGHT THEME COMPONENT BLOCKS ---

const StatCard = ({ title, count, growth, icon: Icon, color }) => (
  <div className="relative overflow-hidden bg-white border border-slate-100 rounded-xl p-6 shadow-sm shadow-slate-100/50 transition-all duration-300 hover:shadow-md hover:border-slate-200 group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400">{title}</span>
      <div className={`p-2.5 rounded-xl transition-colors ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <div className="flex items-baseline gap-3">
      <h3 className="text-3xl font-black tracking-tight text-slate-800">{count}</h3>
      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-0.5">
        <TrendingUp size={10} /> +{growth}%
      </span>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-3 bg-slate-100 rounded w-24" />
      <div className="w-9 h-9 bg-slate-50 rounded-xl" />
    </div>
    <div className="space-y-2">
      <div className="h-8 bg-slate-200 rounded w-32" />
      <div className="h-4 bg-slate-100 rounded w-16" />
    </div>
  </div>
);

const ListRowSkeleton = () => (
  <div className="p-4 bg-white border border-slate-50 rounded-2xl flex items-center justify-between animate-pulse">
    <div className="space-y-2 flex-1 max-w-sm">
      <div className="h-3.5 bg-slate-200 rounded-md w-2/3" />
      <div className="h-2.5 bg-slate-100 rounded-md w-1/2" />
    </div>
    <div className="h-5 bg-slate-100 rounded-md w-16" />
  </div>
);

// --- MAIN DASHBOARD LAYOUT ---

const AdminDashboardPage = () => {
  const { adminDashboard, fetchAdminDashboard, loading } = useAuthStore();

  useEffect(() => {
    fetchAdminDashboard();
  }, [fetchAdminDashboard]);

  const metrics = adminDashboard?.metrics || {};
  const stats = [
    { id: 1, title: "Total Users", count: (metrics.totalUsers || 0).toLocaleString(), growth: "Live", icon: Users, color: "bg-blue-500/10 text-blue-600" },
    { id: 2, title: "Total Bookings", count: (metrics.totalBookings || 0).toLocaleString(), growth: "Live", icon: CreditCard, color: "bg-[#00A699]/10 text-[#00A699]" },
    { id: 3, title: "Total Trips", count: (metrics.totalTrips || 0).toLocaleString(), growth: "Live", icon: Eye, color: "bg-purple-500/10 text-purple-600" },
    { id: 4, title: "Gross Revenue", count: `₹${(metrics.grossRevenue || 0).toLocaleString()}`, growth: "Live", icon: DollarSign, color: "bg-amber-500/10 text-amber-600" }
  ];
  const recentBookings = adminDashboard?.recentBookings || [];

  return (
    <div className="min-h-screen  text-slate-800 antialiased  font-sans selection:bg-[#00A699]/10 selection:text-[#00A699]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Dashboard Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Admin Dashboard
            </h1>
            <p className='text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 flex items-center gap-2'>
              <ShieldCheck size={14} className="text-[#00A699]" /> Admin Dashboard Management
            </p>
          </div>
        </header>

        {/* Core Operational Grid Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            stats.map((stat) => <StatCard key={stat.id} {...stat} />)
          )}
        </section>
          <section className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 px-2">
              <div>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Recent Bookings</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Latest financial transactions</p>
              </div>
              <button className="text-[10px] font-black text-[#00A699] uppercase tracking-widest flex items-center gap-1 hover:underline">
                All Bookings <ArrowUpRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} />)
                ) : recentBookings.length === 0 ? (
                  <div className="p-6 text-center text-xs font-bold uppercase tracking-wider text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    No booking records yet.
                  </div>
                ) : (
                  recentBookings.map((booking, idx) => (
                    <motion.div
                      key={booking._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all group"
                    >
                      <div className="min-w-0 flex items-center gap-3.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          booking.bookingStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {booking.bookingStatus === 'confirmed' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-[#00A699] transition-colors truncate">
                            {booking.userId?.name || booking.customerDetails?.fullName || "Guest traveler"}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 line-clamp-1">
                            {booking.tripId?.title || "Trip booking"} · {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <span className="block text-sm font-black text-slate-800">₹{booking.paymentDetails?.paidAmount?.toLocaleString() || 0}</span>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
                          booking.bookingStatus === 'confirmed' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                            : 'bg-amber-50 border-amber-100 text-amber-600'
                        }`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
