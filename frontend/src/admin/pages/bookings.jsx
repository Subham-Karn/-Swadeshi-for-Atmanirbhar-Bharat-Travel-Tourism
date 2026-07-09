import React, { useEffect, useState, useMemo } from 'react';
import { useBookingStore } from '../../store/useBookingStore';
import { 
  ShieldCheck, User, Search, Eye, CheckCircle2, XCircle, 
  CreditCard, Calendar, SlidersHorizontal, Activity, ChevronDown 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminBookings = () => {
  const { adminBookings, fetchAdminBookings, alterStatus } = useBookingStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Zones");
  const navigate = useNavigate();
  useEffect(() => {
    fetchAdminBookings();
  }, []);

  const handleStateShift = async (id, bStatus, pStatus) => {
    const ok = await alterStatus(id, { bookingStatus: bStatus, paymentStatus: pStatus });
    if (ok) fetchAdminBookings();
  };

  // --- Analytical Layout Multipliers ---
  const metrics = useMemo(() => {
    const total = adminBookings.length;
    const confirmed = adminBookings.filter(b => b.bookingStatus === 'confirmed').length;
    const pending = adminBookings.filter(b => b.bookingStatus === 'pending').length;
    const grossRevenue = adminBookings
      .filter(b => b.paymentDetails?.paymentStatus === 'completed')
      .reduce((sum, b) => sum + (b.paymentDetails?.paidAmount || 0), 0);

    return { total, confirmed, pending, grossRevenue };
  }, [adminBookings]);

  // --- Search Filtering Engine ---
  const filteredBookings = useMemo(() => {
    return adminBookings.filter((bk) => {
      const matchesSearch = 
        bk.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bk.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bk.tripId?.title?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "All Zones" || 
        bk.bookingStatus?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [adminBookings, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- Header Architecture --- */}
        <div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight uppercase">
            BOOKING MANIFESTS
          </h1>
          <p className="text-xs font-bold text-[#00A699] flex items-center gap-1 mt-0.5">
            <ShieldCheck size={14} /> LIVE RESERVATION INFRASTRUCTURE MANAGEMENT
          </p>
        </div>

        {/* --- Top 4 Segmented Metrics Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00A699] flex items-center justify-center shrink-0">
              <Calendar size={22} />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Coverage</span>
              <p className="text-2xl font-black text-slate-800">{metrics.total}</p>
              <span className="text-[10px] font-bold text-slate-400">BOOKINGS LOGGED</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00A699] flex items-center justify-center shrink-0">
              <SlidersHorizontal size={22} />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Nodes</span>
              <p className="text-2xl font-black text-slate-800">{metrics.confirmed}</p>
              <span className="text-[10px] font-bold text-slate-400">CONFIRMED ITINERARIES</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00A699] flex items-center justify-center shrink-0">
              <CreditCard size={22} />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Financial Pool</span>
              <p className="text-xl font-black text-slate-800">₹{metrics.grossRevenue.toLocaleString()}</p>
              <span className="text-[10px] font-bold text-slate-400">GROSS REVENUE RECORDED</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#00A699] flex items-center justify-center shrink-0">
              <Activity size={22} />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">System Health</span>
              <p className="text-2xl font-black text-slate-800">98%</p>
              <span className="text-[10px] font-bold text-slate-400">TRANSACTION UPTIME</span>
            </div>
          </div>

        </div>

        {/* --- Central Filtering Input Controls --- */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full flex-1 max-w-2xl shadow-2xs rounded-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search bookings by client names, unique codes, itinerary descriptors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/60 rounded-xl font-bold text-xs outline-none focus:border-[#00A699] transition-all"
            />
          </div>

          <div className="relative w-full sm:w-44 shrink-0 shadow-2xs rounded-xl bg-white border border-slate-200/60">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 bg-transparent appearance-none font-black text-[10px] uppercase text-slate-600 tracking-wider outline-none cursor-pointer"
            >
              <option value="All Zones">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>
        </div>

        {/* --- Structured Text Grid Labels --- */}
        <div className="hidden lg:grid grid-cols-12 px-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">
          <div className="col-span-4">Itinerary Manifest Details</div>
          <div className="col-span-3">Itinerary Type</div>
          <div className="col-span-1 text-center">Allocated</div>
          <div className="col-span-2">Reserved By</div>
          <div className="col-span-2 text-right pr-6">Action Matrix</div>
        </div>

        {/* --- Card Row Dynamic View Loop --- */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((bk) => (
              <div 
                key={bk._id} 
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-sm transition-all grid grid-cols-1 lg:grid-cols-12 gap-4 items-center px-6 md:px-8"
              >
                {/* 1. Primary Left Information Block */}
                <div className="col-span-1 lg:col-span-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-50 relative">
                    <img 
                      src={bk.tripId?.placeId?.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-[#00A699] border border-white flex items-center justify-center shadow-xs" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base tracking-tight leading-tight">
                      {bk.tripId?.title || "Curated Package Expedition"}
                    </h4>
                    <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                      <span className="text-[#00A699]">#{bk.bookingId}</span> • {bk.tripId?.placeId?.name}
                    </p>
                  </div>
                </div>

                {/* 2. Content Classification Tag */}
                <div className="col-span-1 lg:col-span-3">
                  <span className="block text-[9px] font-black text-teal-600 uppercase tracking-widest mb-0.5">Package Sector</span>
                  <p className="font-black text-slate-800 text-sm uppercase tracking-wide">
                    {bk.tripId?.placeId?.category || "Heritage"} Class
                  </p>
                </div>

                {/* 3. Slot Allocation Badge */}
                <div className="col-span-1 lg:col-span-1 lg:text-center">
                  <div className="inline-flex flex-col items-center justify-center bg-slate-50 rounded-xl px-3 py-1.5 min-w-[50px] border border-slate-100">
                    <span className="font-black text-slate-800 text-base leading-none">{bk.seatsCount || 1}</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Seats</span>
                  </div>
                </div>

                {/* 4. Relational Profile Badge */}
                <div className="col-span-1 lg:col-span-2 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-50/60 text-[#00A699] flex items-center justify-center shrink-0">
                    <User size={14} />
                  </div>
                  <div className="truncate">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">User Reference</span>
                    <p className="font-bold text-slate-700 text-xs truncate">{bk.userId?.name || "Client User"}</p>
                  </div>
                </div>

                {/* 5. Cost Valuation and Clean Actions Row */}
                <div className="col-span-1 lg:col-span-2 flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Valuation</span>
                    <p className="font-black text-[#00A699]">₹{bk.paymentDetails?.paidAmount?.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`details/${bk._id}`)}
                    title="View Details"
                    className="w-9 h-9 rounded-xl bg-teal-50/50 text-[#00A699] border border-teal-100/30 flex items-center justify-center hover:bg-[#00A699] hover:text-white transition-all shadow-2xs"
                  >
                    <Eye size={15} />
                  </button>
                    <button 
                      title="Approve Transaction"
                      disabled={bk.bookingStatus === 'confirmed'}
                      onClick={() => handleStateShift(bk._id, "confirmed", "completed")}
                      className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/40 flex items-center justify-center hover:bg-emerald-500 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
                    >
                      <CheckCircle2 size={15} />
                    </button>
                    <button 
                      title="Cancel/Void Manifest"
                      disabled={bk.bookingStatus === 'cancelled'}
                      onClick={() => handleStateShift(bk._id, "cancelled", "failed")}
                      className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/40 flex items-center justify-center hover:bg-rose-500 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
                    >
                      <XCircle size={15} />
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/60 p-8 font-bold text-slate-400 text-sm">
              No live state booking records matched your active tracking definitions.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminBookings;