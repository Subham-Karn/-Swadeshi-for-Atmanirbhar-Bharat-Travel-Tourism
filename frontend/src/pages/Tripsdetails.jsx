import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTripStore } from '../store/useTripStore';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  ArrowLeft, Calendar, MapPin, Hotel, Navigation, 
  Info, ShieldAlert, Sparkles, Building, CheckCircle2, Loader2, X, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tripsdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { trips, isLoading: tripLoading } = useTripStore();
  const { bookings, checkoutAndBook, fetchUserBookings, isLoading: bookingLoading } = useBookingStore();
  const { user } = useAuthStore();

  const [seats, setSeats] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    specialRequests: "",
    gateway: "UPI",
    transactionId: "",
  });

  const userId = user?.id || user?._id;

  // Sync personal booking history to detect existing reservations
  useEffect(() => {
    if (userId) {
      fetchUserBookings(userId);
    }
  }, [userId, fetchUserBookings]);

  // Find target trip from store state
  const trip = trips.find(t => t._id === id);
  const existingBooking = bookings.find(b => b.tripId?._id === id || b.tripId === id);

  if (tripLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center space-y-2 animate-pulse">
          <p className="text-sm font-black text-slate-700 tracking-wider uppercase">Loading Itinerary Details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <ShieldAlert className="text-rose-500 mb-4" size={48} />
        <h3 className="text-xl font-black text-slate-800">Itinerary Profile Not Found</h3>
        <button onClick={() => navigate('/trips')} className="mt-4 px-6 py-2.5 bg-[#00A699] text-white font-bold rounded-xl text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const basePricePerPerson = trip.budgetCalculation?.estimatedTotalCost || 0;
  const dynamicCalculatedTotal = basePricePerPerson * seats;

  const handleBookingExecution = async () => {
    if (!userId) {
      toast.error("Please log in to finalize itinerary checkout");
      navigate('/auth/login');
      return;
    }

    if (!bookingForm.fullName || !bookingForm.email || !bookingForm.phone || !bookingForm.transactionId) {
      toast.error("Please fill traveler and payment details before booking");
      return;
    }

    const payload = {
      tripId: trip._id,
      seatsCount: seats,
      paidAmount: dynamicCalculatedTotal,
      transactionId: bookingForm.transactionId,
      gateway: bookingForm.gateway,
      customerDetails: {
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        specialRequests: bookingForm.specialRequests,
      },
    };

    const res = await checkoutAndBook(payload);
    if (res?.success) {
      await fetchUserBookings(userId);
      setIsCheckoutOpen(false);
      navigate(`/bookings/details/${res.data?._id}`);
    }
  };

  const handleHotelBooking = () => {
    const hotel = trip?.hotelId;
    if (!hotel) return;

    const googleHotelsUrl = `https://www.google.com/travel/hotels?q=${encodeURIComponent(`${hotel.name} ${hotel.location || hotel.cityName || ""}`)}`;
    window.open(hotel.bookingLink || googleHotelsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Action Line */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200/60 transition-all shadow-xs"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to List
          </button>
          <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border ${
            existingBooking 
              ? 'bg-teal-50 text-teal-700 border-teal-100' 
              : 'bg-amber-50 text-amber-700 border-amber-100'
          }`}>
            {existingBooking ? 'Reserved & Verified' : `Status: ${trip.status || 'Active'}`}
          </span>
        </div>

        {/* Hero Visual Matrix */}
        <div className="relative h-[400px] md:h-[480px] w-full rounded-[2.5rem] overflow-hidden shadow-md group">
          <img 
            src={trip.placeId?.coverImage || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000" 
            alt={trip.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-8 left-6 md:left-10 right-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00A699] text-white font-black text-[10px] tracking-widest uppercase rounded-lg">
                <Sparkles size={12} /> Curated Destination Manifest
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-sm">
                {trip.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 font-bold text-sm">
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-[#00A699]" /> 
                  {new Date(trip.startDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})} — {new Date(trip.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}
                </span>
                <span className="hidden sm:inline text-white/30">•</span>
                <span className="px-2.5 py-0.5 bg-white/10 rounded-md backdrop-blur-xs text-xs font-black uppercase text-teal-300">
                  {trip.numberOfDays || 1} Days Matrix
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Details Asymmetric Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Infrastructure Blocks */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Block 1: Destination Node Profile */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#00A699]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Destination Overview</h3>
                  <p className="text-xs font-bold text-slate-400 capitalize">{trip.placeId?.cityName} • {trip.placeId?.category || 'Heritage'} Sector</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xl font-black text-slate-800">{trip.placeId?.name || "Target Node"}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {trip.placeId?.overview || "No extended overview profile mapped onto this cluster database configuration."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100/60">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Operational Timings</span>
                  <span className="text-xs font-bold text-slate-700">{trip.placeId?.timings || "All Day Available"}</span>
                </div>
                <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100/60">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Access Requirements</span>
                  <span className="text-xs font-bold text-slate-700">{trip.placeId?.entryFee || "Standard Credentials"}</span>
                </div>
              </div>
            </div>

            {/* Block 2: Hospitality Lodge Segment */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Hotel size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Hospitality & Base Lodge</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{trip.hotelId?.tier || "Standard"} Tier Rating Class</p>
                </div>
              </div>

              {trip.hotelId ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-800">{trip.hotelId.name}</h4>
                      <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <Building size={13} /> {trip.hotelId.location}
                      </p>
                    </div>
                    <div className="text-right shrink-0 bg-amber-50/40 border border-amber-100/50 p-3 rounded-xl">
                      <span className="block text-[9px] font-black text-amber-600 uppercase tracking-wider">Night Scale</span>
                      <span className="text-base font-black text-slate-800">₹{trip.hotelId.pricePerNight?.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    {trip.hotelId.description || "Premium stay amenities initialized with streamlined security registers."}
                  </p>

                  {trip.hotelId.amenities && (
                    <div className="pt-2">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Facility Access Allotments</span>
                      <div className="flex flex-wrap gap-2">
                        {trip.hotelId.amenities.map((amenity, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100 font-bold text-xs text-slate-600">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleHotelBooking}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <ExternalLink size={14} /> Book Hotel on Google
                  </button>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-xl">No accommodation has been routed for this unified itinerary segment.</p>
              )}
            </div>

          </div>

          {/* Right Column: Dynamic Booking Checkout & Pricing Manifest */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
              <h4 className="font-black text-slate-800 text-base border-b border-slate-50 pb-3">Cost Configuration Manifest</h4>
              
              <div className="space-y-3">
                {/* Transit Vector Blocks */}
                <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/40 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-wider">
                    <Navigation size={14} /> Transit System Log
                  </div>
                  {trip.transportOptions && trip.transportOptions.length > 0 ? (
                    trip.transportOptions.map((transit, index) => (
                      <div key={index} className="flex justify-between items-center text-xs font-bold text-slate-700 pt-1">
                        <span className="truncate">[{transit.mode || "Transit"}] {transit.providerName}</span>
                        <span className="font-black text-slate-800">₹{transit.estimatedCost?.toLocaleString() || "0"}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-bold text-slate-400 italic">No transit lanes assigned</p>
                  )}
                </div>

                {/* Advisories */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <Info size={12} /> Custom Advisory Notes
                  </div>
                  <div className="text-slate-600 font-bold text-xs space-y-0.5">
                    {trip.customNotes && trip.customNotes.length > 0 ? (
                      trip.customNotes.map((note, i) => <p key={i}>• {note}</p>)
                    ) : (
                      <p className="italic text-slate-400">Standard configurations apply</p>
                    )}
                  </div>
                </div>

                {/* Interactive Dynamic Seat Selector (Hidden if already reserved) */}
                {!existingBooking && (
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Traveler Slots</span>
                      <span className="text-xs font-bold text-slate-700">Select seats number</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                      <button 
                        type="button"
                        onClick={() => setSeats(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-50 font-black text-slate-600 flex items-center justify-center hover:bg-slate-100 text-sm"
                      >
                        -
                      </button>
                      <span className="font-black text-sm text-slate-800 px-1">{seats}</span>
                      <button 
                        type="button"
                        onClick={() => setSeats(prev => Math.min(10, prev + 1))}
                        className="w-8 h-8 rounded-lg bg-slate-50 font-black text-slate-600 flex items-center justify-center hover:bg-slate-100 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Pricing Calculation Summary */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wide">
                    {existingBooking ? 'Total Amount Settled' : 'Total Valuation Summary'}
                  </span>
                  <div className="text-right">
                    <p className="font-black text-[#00A699] text-2xl">
                      ₹{(existingBooking ? existingBooking.paymentDetails?.paidAmount : dynamicCalculatedTotal)?.toLocaleString() || "0"}
                    </p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                      {existingBooking ? `Invoice Registered (${existingBooking.bookingId})` : `All Taxes Inclusive (${trip.budgetCalculation?.currency || 'INR'})`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bridge Button Conditional Trigger */}
              {existingBooking ? (
                <div className="p-4 bg-teal-50 border border-teal-100/80 text-[#00A699] rounded-2xl flex items-center gap-3">
                  <CheckCircle2 size={24} className="shrink-0" />
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide">Itinerary Secured</p>
                    <p className="text-xs font-medium text-teal-600/90">Your seat allocation parameters have been updated across master server data pools.</p>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setBookingForm((prev) => ({
                      ...prev,
                      fullName: prev.fullName || user?.name || "",
                      email: prev.email || user?.email || "",
                    }));
                    setIsCheckoutOpen(true);
                  }}
                  disabled={bookingLoading}
                  className="w-full py-4 bg-[#00A699] hover:bg-[#008d82] disabled:bg-slate-200 text-white rounded-2xl font-black text-sm active:scale-98 transition-all shadow-xs tracking-wide uppercase flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    `Book Now (₹${basePricePerPerson.toLocaleString()} / seat)`
                  )}
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center px-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleBookingExecution();
            }}
            className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Booking Details</h3>
                <p className="text-xs font-bold text-slate-400">Traveler and payment information</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Full Name</span>
                <input
                  required
                  value={bookingForm.fullName}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699]"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email</span>
                <input
                  required
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699]"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone</span>
                <input
                  required
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699]"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Payment Method</span>
                <select
                  value={bookingForm.gateway}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, gateway: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699] bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                </select>
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Payment Transaction ID</span>
                <input
                  required
                  placeholder="Enter UPI/card/bank reference number"
                  value={bookingForm.transactionId}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, transactionId: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699]"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Special Requests</span>
                <textarea
                  rows="3"
                  value={bookingForm.specialRequests}
                  onChange={(e) => setBookingForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-[#00A699] resize-none"
                />
              </label>
            </div>

            <div className="p-5 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Amount Payable</p>
                <p className="text-2xl font-black text-[#00A699]">₹{dynamicCalculatedTotal.toLocaleString()}</p>
              </div>
              <button
                type="submit"
                disabled={bookingLoading}
                className="px-6 py-3.5 rounded-xl bg-[#00A699] hover:bg-[#008d82] disabled:bg-slate-300 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {bookingLoading && <Loader2 className="animate-spin" size={16} />}
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Tripsdetails;
