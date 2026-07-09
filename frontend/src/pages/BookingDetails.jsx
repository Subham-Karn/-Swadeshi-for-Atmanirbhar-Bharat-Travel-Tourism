import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  ArrowLeft, Calendar, MapPin, Hotel, Navigation, 
  User, CreditCard, ShieldCheck, Printer, CheckCircle2, 
  Clock, Info, Building, Hash, Milestone, Plane
} from 'lucide-react';

const UserBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bookings, fetchUserBookings, isLoading } = useBookingStore();
  const userId = user?.id || user?._id;

  // Sync user's booking history if local component cache store is empty
  useEffect(() => {
    if (userId && bookings.length === 0) {
      fetchUserBookings(userId);
    }
  }, [userId, bookings.length, fetchUserBookings]);

  // Extract the precise target booking element
  const booking = useMemo(() => {
    return bookings.find(b => b._id === id);
  }, [id, bookings]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-sm font-black text-slate-700 tracking-wider uppercase">Syncing Travel Voucher Matrix...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <ShieldCheck className="text-rose-500 mb-4" size={48} />
        <h3 className="text-xl font-black text-slate-800">Reservation Pass Expired or Unreachable</h3>
        <p className="text-xs font-bold text-slate-400 mt-1 max-w-xs text-center">We could not match this ID verification token with your user record account profiles.</p>
        <button onClick={() => navigate('/trips')} className="mt-5 px-6 py-2.5 bg-[#00A699] text-white font-black rounded-xl text-xs uppercase tracking-wider">
          Back to Explorations
        </button>
      </div>
    );
  }

  const trip = booking.tripId;
  const place = trip?.placeId;
  const hotel = trip?.hotelId;

  return (
    <div className="min-h-screen bg-slate-50/60 pt-28 pb-20 print:bg-white print:pt-0 print:pb-0">
      <div className="max-w-5xl mx-auto px-4 space-y-8 print:max-w-full print:px-0">
        
        {/* --- Top Action Navigation Strip (Hidden during Printing workflows) --- */}
        <div className="flex items-center justify-between print:hidden">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200/60 transition-all shadow-xs"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> My Bookings
          </button>
          
          <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border shadow-3xs ${
            booking.bookingStatus === 'confirmed' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-amber-50 text-amber-700 border-amber-100'
          }`}>
            Pass State: {booking.bookingStatus}
          </span>
        </div>

        {/* --- High-Fidelity Boarding Ticket Pass Layout --- */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xs overflow-hidden print:border-none print:shadow-none">
          
          {/* Top Primary Accent banner block */}
          <div className="bg-slate-950 p-8 md:p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
            <div className="space-y-1.5">
              <span className="text-[#00A699] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Hash size={13} /> OFFICIAL TRAVEL PASS
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                {trip?.title || "Custom Itinerary Gateway"}
              </h1>
              <p className="text-slate-400 font-bold text-xs">
                Booking Reference ID: <span className="text-white font-mono font-black select-all">#{booking.bookingId}</span>
              </p>
            </div>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-3.5 bg-[#00A699] hover:bg-[#008d82] text-white rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-md shrink-0 print:hidden"
            >
              <Printer size={15} /> Print Pass Statement
            </button>
          </div>

          {/* Core Voucher Breakdown Grid Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {/* Left Multi-Segment details channel block */}
            <div className="lg:col-span-7 p-6 md:p-8 space-y-8">
              
              {/* Timeline Sector section */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#00A699]" /> Travel Windows Matrix
                </h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100/60">
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Departure Date</span>
                    <span className="text-sm font-black text-slate-800">
                      {trip?.startDate ? new Date(trip.startDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'Pending'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Return Phase</span>
                    <span className="text-sm font-black text-slate-800">
                      {trip?.endDate ? new Date(trip.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Destination Hub details layout block */}
              {place && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#00A699]" /> Target Destination Spot
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50/40 p-4 rounded-2xl border border-slate-100/60">
                    <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                      <img src={place.coverImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="space-y-1 w-full">
                      <h4 className="text-base font-black text-slate-800 leading-tight">{place.name}</h4>
                      <p className="text-xs font-bold text-slate-400 capitalize">{place.cityName} • {place.category} Registry</p>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed pt-1">{place.overview}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Accommodation details layout block */}
              {hotel && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Hotel size={14} className="text-[#00A699]" /> Base Stay Lodge Allocation
                  </h3>
                  <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-3xs space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-base font-black text-slate-800 leading-tight">{hotel.name}</h4>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                          <Building size={12} /> {hotel.location}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-50 rounded text-amber-700 text-[9px] font-black uppercase tracking-wider border border-amber-100 shrink-0">
                        {hotel.tier || 'Luxury'} Tier
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transit vectors sub layout listing block */}
              {trip?.transportOptions && trip.transportOptions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Plane size={14} className="text-[#00A699]" /> Active Transit Vector Pipelines
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trip.transportOptions.map((transit, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="truncate">[{transit.mode || 'Transit'}] {transit.providerName}</span>
                        <span className="text-slate-400 font-black">Linked</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Financial Settlement sidebar channel block */}
            <div className="lg:col-span-5 p-6 md:p-8 bg-slate-50/40 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-100">
                Receipt Verification Manifest
              </h3>

              {/* Traveler breakdown slots data block */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-3xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#00A699] flex items-center justify-center shrink-0">
                    <User size={15} />
                  </div>
                  <div>
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Account Holder</span>
                    <p className="text-xs font-black text-slate-800">{booking.userId?.name || "Global Explorer"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Allotted Capacity</span>
                  <p className="text-sm font-black text-slate-800">{booking.seatsCount || 1} Slots</p>
                </div>
              </div>

              {/* Payment Summary data block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-3xs">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Transaction Engine</span>
                  <span className="text-slate-800 font-black">{booking.paymentDetails?.gateway || 'Razorpay Link'}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                  <span>Settlement Status</span>
                  <span className="text-emerald-600 font-black uppercase text-[10px]">
                    {booking.paymentDetails?.paymentStatus || 'Completed'}
                  </span>
                </div>
                
                <div className="p-2.5 bg-slate-50 rounded-xl font-mono text-[10px] text-slate-600 truncate border border-slate-100/80">
                  <span className="block font-sans text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Payment Hash Key Reference</span>
                  {booking.paymentDetails?.transactionId || "N/A"}
                </div>
              </div>

              {/* Advisory instruction card wrapper box */}
              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/50 flex items-start gap-2.5 text-xs text-amber-800 font-medium leading-relaxed">
                <Info size={16} className="shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="block font-black text-[9px] uppercase tracking-wider text-amber-700 mb-0.5">Travel Gate Requirements</span>
                  Please present this digital pass barcode page or the printed voucher manifest directly at the check-in nodes.
                </div>
              </div>

              {/* Grand Total Pricing Aggregator */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wide">Total Amount Paid</span>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#00A699] tracking-tight leading-none">
                    ₹{booking.paymentDetails?.paidAmount?.toLocaleString() || "0"}
                  </p>
                  <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-1">All Settlement Complete</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default UserBookingDetails;
