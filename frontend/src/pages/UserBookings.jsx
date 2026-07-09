import React, { useEffect, useState, useMemo } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { 
  Receipt, Calendar, MapPin, ArrowRight, ShieldCheck, 
  Search, SlidersHorizontal, ChevronDown, Compass, Fuel, Bed
} from 'lucide-react';

const UserBookings = () => {
  const navigate = useNavigate();
  const { bookings, fetchUserBookings, isLoading } = useBookingStore();
  const { user } = useAuthStore();
  const userId = user?.id || user?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All States");

  useEffect(() => {
    if (userId) {
      fetchUserBookings(userId);
    }
  }, [userId, fetchUserBookings]);

  // --- Analytical Layout Aggregations ---
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.bookingStatus === 'confirmed').length;
    const totalSpent = bookings
      .filter(b => b.paymentDetails?.paymentStatus === 'completed')
      .reduce((sum, b) => sum + (b.paymentDetails?.paidAmount || 0), 0);

    return { total, confirmed, totalSpent };
  }, [bookings]);

  // --- Filtering Evaluation Chain ---
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch = 
        b.bookingId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tripId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tripId?.placeId?.cityName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        statusFilter === "All States" || 
        b.bookingStatus?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-sm font-black text-slate-700 tracking-wider uppercase">Syncing Ticket Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        
        {/* --- Top Layout Header Row --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-[#00A699] font-black text-[10px] tracking-widest uppercase rounded-lg border border-teal-100/60">
              <Compass size={12} /> Personal Receipt Vault
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              MY <span className="text-[#00A699]">RESERVATIONS</span>
            </h1>
            <p className="text-xs font-bold text-slate-400">Track paid invoices, confirmed states, and travel credentials.</p>
          </div>
        </div>

        {/* --- Analytics Mini Metrics Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-[#00A699] flex items-center justify-center shrink-0">
              <Receipt size={20} />
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Tickets</span>
              <p className="text-xl font-black text-slate-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Verified Confirmed</span>
              <p className="text-xl font-black text-slate-800">{stats.confirmed}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <span className="font-black text-sm">₹</span>
            </div>
            <div>
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Total Capital Allocated</span>
              <p className="text-xl font-black text-slate-800">₹{stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* --- Filter Toolbar Row --- */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="relative w-full sm:flex-1 shadow-3xs rounded-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text" 
              placeholder="Search by ticket ID, location, package descriptor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-xl font-bold text-xs outline-none focus:border-[#00A699] focus:bg-white transition-all"
            />
          </div>

          <div className="relative w-full sm:w-40 shrink-0 shadow-3xs rounded-xl bg-slate-50/50 border border-slate-200/60">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-3 pr-8 py-3 bg-transparent appearance-none font-black text-[10px] uppercase text-slate-600 tracking-wider outline-none cursor-pointer"
            >
              <option value="All States">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
          </div>
        </div>

        {/* --- Modern Cards Display Registry --- */}
        <div className="space-y-5">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => {
              const tripDetails = b.tripId;
              const placeDetails = tripDetails?.placeId;

              return (
                <div 
                  key={b._id} 
                  className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-2xs hover:shadow-sm transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  {/* Left Column: Visual & Package Context */}
                  <div className="flex items-start sm:items-center gap-5 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 shrink-0 shadow-3xs">
                      <img 
                        src={placeDetails?.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"} 
                        className="w-full h-full object-cover" 
                        alt="" 
                      />
                    </div>
                    
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          ID: #{b.bookingId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wide border ${
                          b.bookingStatus === 'confirmed' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-800 tracking-tight truncate leading-tight">
                        {tripDetails?.title || "Custom Pack Expedition"}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-400">
                        <span className="flex items-center gap-0.5 text-[#00A699] capitalize">
                          <MapPin size={12} /> {placeDetails?.cityName || "Patna"}
                        </span>
                        <span>•</span>
                        <span>{b.seatsCount || 1} Traveler Slots</span>
                        {tripDetails?.hotelId && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 max-w-[120px] truncate"><Bed size={12}/> Stay Included</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Pricing & Detail Navigation Action */}
                  <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-slate-50 shrink-0">
                    <div className="md:text-right">
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Paid Amount</span>
                      <p className="text-xl font-black text-[#00A699] leading-tight">
                        ₹{b.paymentDetails?.paidAmount?.toLocaleString() || "0"}
                      </p>
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        Via {b.paymentDetails?.gateway || 'Razorpay'}
                      </span>
                    </div>

                    <button 
                      onClick={() => navigate(`/bookings/details/${b._id}`)}
                      className="h-10 px-4 bg-slate-50 hover:bg-[#00A699] hover:text-white rounded-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-3xs transition-all"
                    >
                      View Invoice <ArrowRight size={13} />
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 font-bold text-slate-400 text-sm">
              No reservation profiles matched your active query filter.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserBookings;
