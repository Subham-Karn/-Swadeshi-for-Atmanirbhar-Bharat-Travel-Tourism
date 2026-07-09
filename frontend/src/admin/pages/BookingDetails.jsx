import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../store/useBookingStore';
import { 
  ArrowLeft, Calendar, MapPin, Hotel, Navigation, 
  User, CreditCard, ShieldCheck, Printer, CheckCircle2, 
  XCircle, Clock, Info, Building, Hash
} from 'lucide-react';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings, adminBookings, fetchAdminBookings, isLoading } = useBookingStore();

  useEffect(() => {
    if (adminBookings.length === 0) {
      fetchAdminBookings();
    }
  }, [adminBookings.length, fetchAdminBookings]);

  const booking = useMemo(() => {
    return adminBookings.find(b => b._id === id) || bookings.find(b => b._id === id);
  }, [id, adminBookings, bookings]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-sm font-black text-slate-700 tracking-wider uppercase">Loading Reservation Ledger...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <ShieldCheck className="text-rose-500 mb-4" size={48} />
        <h3 className="text-xl font-black text-slate-800">Booking Record Extinguished</h3>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2.5 bg-[#00A699] text-white font-bold rounded-xl text-sm">
          Go Back
        </button>
      </div>
    );
  }

  const trip = booking.tripId;
  const place = trip?.placeId;
  const hotel = trip?.hotelId;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* --- Navigation Bar Hub --- */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200/60 transition-all shadow-xs"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border ${
              booking.bookingStatus === 'confirmed' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : booking.bookingStatus === 'cancelled'
                ? 'bg-rose-50 text-rose-700 border-rose-100'
                : 'bg-amber-50 text-amber-700 border-amber-100'
            }`}>
              Booking: {booking.bookingStatus}
            </span>
          </div>
        </div>

        {/* --- Header Profile Segment --- */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[#00A699] text-xs font-black uppercase tracking-widest flex items-center gap-1">
              <Hash size={13} /> SECURED TRANSACTION LEDGER
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Receipt Reference #{booking.bookingId}
            </h1>
            <p className="text-xs font-bold text-slate-400">
              Logged to system on {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>

          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-xs shrink-0"
          >
            <Printer size={15} /> Print Statement
          </button>
        </div>

        {/* --- Multi-Column Layout Architecture --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Main Content Pane */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Itinerary Summary Package Box */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00A699] flex items-center justify-center">
                  <Navigation size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{trip?.title || "Linked Travel Package"}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{trip?.numberOfDays || 1} Days Trip Matrix</p>
                </div>
              </div>

              {place && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-4 h-28 rounded-2xl overflow-hidden bg-slate-50">
                    <img src={place.coverImage} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="sm:col-span-8 space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-500">
                      Target Destination Node
                    </span>
                    <h4 className="text-lg font-black text-slate-800">{place.name}</h4>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-1 capitalize">
                      <MapPin size={13} /> {place.cityName} • {place.category} Sector
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Accommodation Details Block */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Hotel size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Hospitality Lodging Manifest</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{hotel?.tier || "Standard"} Tier Allocation</p>
                </div>
              </div>

              {hotel ? (
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-800">{hotel.name}</h4>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed flex items-center gap-1">
                    <Building size={14} className="text-slate-400 shrink-0" /> {hotel.location}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {hotel.amenities?.slice(0, 5).map((am, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-slate-50 text-slate-500 border border-slate-100 rounded-md text-[10px] font-bold">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-400 italic">No specific lodging mapped into this variant.</p>
              )}
            </div>

            {/* User Reference Registry Info Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Account Holder Identity</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified Client Parameters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Profile Name</span>
                  <span className="text-sm font-black text-slate-800">{booking.userId?.name || "Global Traveler"}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/60">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Communications Route</span>
                  <span className="text-sm font-black text-slate-800">{booking.userId?.email || "N/A"}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sticky Sidebar: Checkout Financial Audit Grid */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
              <h4 className="font-black text-slate-800 text-base border-b border-slate-50 pb-3">Financial Transaction Audit</h4>
              
              <div className="space-y-3.5">
                
                {/* Micro Meta Rows */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Slot Tickets Reserved</span>
                  <span className="text-slate-800 font-black">{booking.seatsCount || 1} Seats</span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    booking.paymentDetails?.paymentStatus === 'completed'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {booking.paymentDetails?.paymentStatus || 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Payment Channel</span>
                  <span className="text-slate-800 font-black text-right">{booking.paymentDetails?.gateway || 'Razorpay Link'}</span>
                </div>

                {/* Gateway Hash reference code row box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Gateway Transaction Hash</span>
                  <p className="font-mono text-[11px] font-bold text-slate-700 truncate">{booking.paymentDetails?.transactionId || "N/A"}</p>
                </div>

                {/* Advisory row box block */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1"><Info size={11}/> Operations Advisory</span>
                  <p className="text-[11px] font-bold text-slate-500 leading-tight">Present the printed sheet document upon base arrival metrics for security check-in clearances.</p>
                </div>

                {/* Master Calculation Summary Valuation Line */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wide">Gross Settled Cost</span>
                  <div className="text-right">
                    <p className="font-black text-[#00A699] text-2xl">
                      ₹{booking.paymentDetails?.paidAmount?.toLocaleString() || "0"}
                    </p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                      Net Amount ({booking.paymentDetails?.currency || 'INR'})
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BookingDetails;
