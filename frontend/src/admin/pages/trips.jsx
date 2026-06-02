import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Hotel, Navigation, Plus, Trash2, 
  Edit3, Clock, CheckCircle, XCircle, FileText, ArrowRight, 
  Search, Globe, Building2, Star, HeartPulse, Eye, Layers
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';

const SkeletonRowCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col lg:flex-row items-center justify-between gap-6 animate-pulse shadow-2xs">
    <div className="flex items-center gap-5 flex-1 w-full">
      <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-slate-200 rounded-md w-1/3" />
        <div className="h-4 bg-slate-200 rounded-md w-2/3" />
      </div>
    </div>
    <div className="h-8 bg-slate-200 rounded-xl w-28 hidden lg:block" />
    <div className="h-8 bg-slate-200 rounded-xl w-16 hidden lg:block" />
    <div className="h-8 bg-slate-200 rounded-xl w-32 hidden lg:block" />
    <div className="flex gap-2">
      {[...Array(3)].map((_, i) => <div key={i} className="w-10 h-10 bg-slate-200 rounded-xl" />)}
    </div>
  </div>
);

const StatCard = memo(({ icon: Icon, title, value, subtext }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex items-center gap-5">
    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#00A699] border border-slate-100/50">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-slate-800 mt-0.5">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{subtext}</p>
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

const TripAdminDashboard = () => {
  const navigate = useNavigate();
  const { adminTrips, isLoading, fetchAdminTrips, deleteTrip } = useTripStore();
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalCount: 0,
    upcomingCount: 0,
    completedCount: 0,
    cancelledCount: 0
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAdminTrips(1, 100, filterStatus, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchAdminTrips, filterStatus, searchTerm]);

  useEffect(() => {
    const counts = adminTrips.reduce((acc, trip) => {
      const s = trip.status?.toLowerCase();
      if (s === 'upcoming') acc.upcomingCount++;
      if (s === 'completed') acc.completedCount++;
      if (s === 'cancelled') acc.cancelledCount++;
      acc.totalCount++;
      return acc;
    }, { totalCount: 0, upcomingCount: 0, completedCount: 0, cancelledCount: 0 });
    
    setStats(counts);
  }, [adminTrips]);

  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase();
    const base = "px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide flex items-center gap-1.5 w-fit uppercase ";
    if (normalized === 'upcoming') return <span className={base + "bg-blue-50 text-blue-600"}><Clock size={12} /> Upcoming</span>;
    if (normalized === 'completed') return <span className={base + "bg-emerald-50 text-emerald-600"}><CheckCircle size={12} /> Completed</span>;
    if (normalized === 'cancelled') return <span className={base + "bg-rose-50 text-rose-600"}><XCircle size={12} /> Cancelled</span>;
    return <span className={base + "bg-slate-50 text-slate-600"}><FileText size={12} /> Draft</span>;
  };

  const systemHealthPct = stats.totalCount > 0 
    ? Math.round(((stats.totalCount - stats.cancelledCount) / stats.totalCount) * 100) 
    : 100;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Layout */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Itinerary Control</h1>
            <p className="text-sm font-bold text-slate-400 mt-1">Global administrative management interface over active customer trip pipelines.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/trips/create')}
            className="flex items-center gap-2 bg-[#00A699] text-white px-6 py-3.5 rounded-2xl font-black hover:bg-[#008d82] transition-colors shadow-sm text-sm"
          >
            <Plus size={18} /> Compile New Trip
          </button>
        </div>

        {/* Dynamic Analytics Block Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Globe} title="Total Coverage" value={stats.totalCount} subtext="Total Itineraries" />
          <StatCard icon={Building2} title="Active Pipeline" value={stats.upcomingCount} subtext="Upcoming Departures" />
          <StatCard icon={Star} title="Featured Roll" value={stats.completedCount} subtext="Completed Tours" />
          <StatCard icon={HeartPulse} title="System Health" value={`${systemHealthPct}%`} subtext="Success Ratio Active" />
        </div>

        {/* Search Input and Select Dropdown Filter Control Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs">
          <div className="relative lg:col-span-3 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by state name or trip title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200/60 rounded-xl font-bold text-sm outline-none focus:border-[#00A699] focus:bg-white transition-all"
            />
          </div>

          <div className="w-full lg:col-span-1">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl font-black text-xs uppercase tracking-wider text-slate-600 outline-none focus:border-[#00A699] cursor-pointer"
            >
              <option value="all">All Zones</option>
              <option value="upcoming">Upcoming Zone</option>
              <option value="completed">Completed Zone</option>
              <option value="draft">Draft Zone</option>
              <option value="cancelled">Cancelled Zone</option>
            </select>
          </div>
        </div>

        {/* Structural Labels Desk Header Row */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-8 text-xs font-black text-slate-400 uppercase tracking-widest pb-2">
          <div className="col-span-5">Itinerary Matrix Details</div>
          <div className="col-span-2">Workflow Status</div>
          <div className="col-span-1 text-center">Transit</div>
          <div className="col-span-2 text-center">Financial Valuation</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Horizontal Layout Collection Row Cards Frame */}
        <div className="space-y-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => <SkeletonRowCard key={i} />)
          ) : adminTrips.length > 0 ? (
            adminTrips.map((trip) => (
              <div 
                key={trip._id} 
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs hover:shadow-sm transition-all duration-300 flex flex-col lg:grid lg:grid-cols-12 gap-6 items-center relative overflow-hidden group"
              >
                {/* Image asset along with core textual details details */}
                <div className="col-span-5 flex items-start gap-4 w-full">
                  <div className="w-20 h-20 rounded-xl overflow-hidden relative border border-slate-100 shrink-0 shadow-2xs bg-slate-50">
                    <img 
                      src={trip.placeId?.coverImage || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=200"} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#00A699] rounded-full flex items-center justify-center text-white text-[9px] font-black">
                      ★
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <h4 className="font-black text-slate-800 text-lg tracking-tight truncate group-hover:text-[#00A699] transition-colors">
                      {trip.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-400">
                      <p className="flex items-center gap-1 text-slate-500 shrink-0">
                        <MapPin size={13} className="text-[#00A699]" /> {trip.placeId?.name || "Unassigned"}
                      </p>
                      <span className="text-slate-200 hidden sm:inline">•</span>
                      <p className="truncate max-w-50">{trip.hotelId?.name || "No Accommodation Linked"}</p>
                    </div>
                    {trip.customNotes?.length > 0 && (
                      <p className="text-[11px] font-medium text-slate-400 line-clamp-1 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100/50 w-fit">
                        "{trip.customNotes[0]}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Itinerary Status Tracking Badge Block */}
                <div className="col-span-2 w-full lg:w-auto">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block lg:hidden">Regions Type</p>
                  {getStatusBadge(trip.status)}
                </div>

                {/* Connected Transit channels block */}
                <div className="col-span-1 text-center w-full lg:w-auto flex lg:flex-col items-center justify-between lg:justify-center bg-slate-50 lg:bg-transparent p-3 lg:p-0 rounded-xl">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider lg:hidden">Cities Linked</span>
                  <div className="px-3 py-1 bg-slate-100 text-slate-700 font-black rounded-xl text-xs flex items-center gap-1">
                    {trip.transportOptions?.length || 0} <Layers size={11} className="text-slate-400" />
                  </div>
                </div>

                {/* Budget compilation calculation metric field layout block */}
                <div className="col-span-2 text-left lg:text-center w-full lg:w-auto flex lg:flex-col items-center justify-between lg:justify-center border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider lg:hidden">Total Valuation</span>
                  <div>
                    <p className="text-xl font-black text-slate-800 tracking-tight">₹{trip.budgetCalculation?.estimatedTotalCost?.toLocaleString() || '0'}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:block mt-0.5">Gross Cost</p>
                  </div>
                </div>

                {/* Operations action item buttons layout segment panel */}
                <div className="col-span-2 flex items-center justify-end gap-2 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  <button 
                    onClick={() => navigate(`/admin/trips/detail/${trip._id}`)}
                    className="w-10 h-10 rounded-xl bg-teal-50/50 text-[#00A699] flex items-center justify-center hover:bg-[#00A699] hover:text-white transition-all shadow-2xs border border-teal-100/10"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/trips/edit/${trip._id}`)}
                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-2xs border border-slate-200/50"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you absolutely certain you want to delete this trip itinerary payload from your database?')) {
                        deleteTrip(trip._id);
                      }
                    }}
                    className="w-10 h-10 rounded-xl bg-rose-50/50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-2xs border border-rose-100/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white p-16 text-center text-slate-400 font-bold rounded-xl border border-slate-100 shadow-2xs">
              No matching itinerary configurations tracked in this filtering layer.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TripAdminDashboard;