import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, MapPin, Star, CheckCircle2, XCircle, 
  ChevronDown, Calendar, Users, ShieldCheck, ArrowRight 
} from 'lucide-react';

const TripDetails = () => {
  const { tripId } = useParams();
  const [activeDay, setActiveDay] = useState(0);

  // Dummy Data for a specific trip
  const trip = {
    title: "Mesmerizing Kerala: Backwaters & Hills",
    location: "Kerala, India",
    duration: "6 Days / 5 Nights",
    rating: 4.9,
    reviews: 128,
    price: 24999,
    banner: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    description: "Experience the perfect blend of misty tea gardens in Munnar and the serene, emerald backwaters of Alleppey. This curated journey is designed for those looking to escape the hustle and embrace nature's tranquility.",
    inclusions: ["4-Star Hotels", "Private Car", "Daily Breakfast", "Houseboat Stay", "Entry Fees"],
    exclusions: ["Airfare", "Personal Expenses", "Lunch & Dinner", "Insurance"],
    itinerary: [
      { day: 1, title: "Arrival in Kochi & Transfer to Munnar", activities: "Pick up from Kochi airport, scenic drive through waterfalls, check-in at Munnar resort." },
      { day: 2, title: "Munnar Tea Garden Exploration", activities: "Visit Mattupetty Dam, Eravikulam National Park, and local tea museums." },
      { day: 3, title: "Drive to Thekkady (Periyar)", activities: "Elephant rides, spice plantation tours, and evening martial arts show." },
      { day: 4, title: "Houseboat Experience in Alleppey", activities: "Board a traditional Kettuvallam, cruise through narrow canals, and overnight stay on water." },
      { day: 5, title: "Relaxation at Marari Beach", activities: "A day at the quiet white sand beaches of Mararikulam." },
      { day: 6, title: "Departure from Kochi", activities: "Shopping at LuLu Mall and transfer to airport for your flight home." }
    ]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFDFD] min-h-screen pb-20">
      {/* 1. Hero Header */}
      <section className="relative h-[50vh] w-full overflow-hidden">
        <img src={trip.banner} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-0 w-full px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-teal-400 font-black text-xs uppercase tracking-widest mb-2">
              <Star size={14} fill="currentColor" /> {trip.rating} ({trip.reviews} Reviews)
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">{trip.title}</h1>
            <div className="flex items-center gap-4 text-white/80 mt-4 font-bold text-sm">
              <span className="flex items-center gap-1"><Clock size={16} /> {trip.duration}</span>
              <span className="flex items-center gap-1"><MapPin size={16} /> {trip.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Layout */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Trip Overview</h2>
            <p className="text-gray-600 leading-relaxed font-medium">{trip.description}</p>
          </section>

          {/* Itinerary Accordion */}
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Itinerary</h2>
            <div className="space-y-4">
              {trip.itinerary.map((item, index) => (
                <div key={index} className="border border-gray-100 rounded-3xl bg-white overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setActiveDay(activeDay === index ? -1 : index)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className="bg-[#00A699] text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xs">
                        {item.day}
                      </span>
                      <span className="font-black text-gray-800">{item.title}</span>
                    </div>
                    <ChevronDown className={`transition-transform ${activeDay === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDay === index && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="px-8 pb-8 text-sm text-gray-500 font-medium leading-relaxed border-t border-gray-50 pt-4">
                      {item.activities}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Inclusions / Exclusions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-teal-50/50 p-8 rounded-[2rem] border border-teal-100/50">
              <h3 className="font-black text-[#00A699] mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} /> What's Included
              </h3>
              <ul className="space-y-3">
                {trip.inclusions.map(i => <li key={i} className="text-sm font-bold text-gray-600 flex items-center gap-2">• {i}</li>)}
              </ul>
            </div>
            <div className="bg-red-50/50 p-8 rounded-[2rem] border border-red-100/50">
              <h3 className="font-black text-red-400 mb-4 flex items-center gap-2">
                <XCircle size={20} /> What's Excluded
              </h3>
              <ul className="space-y-3">
                {trip.exclusions.map(i => <li key={i} className="text-sm font-bold text-gray-600 flex items-center gap-2">• {i}</li>)}
              </ul>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Booking Widget */}
        <aside>
          <div className="sticky top-32 bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/10 p-8 border border-gray-100">
            <div className="mb-6">
              <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Price</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">₹{trip.price.toLocaleString()}</span>
                <span className="text-gray-400 font-bold text-sm">/ person</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3 text-gray-600 font-bold text-sm">
                  <Calendar size={18} className="text-[#00A699]" /> Travel Date
                </div>
                <span className="text-xs font-black text-gray-400 uppercase">Select</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3 text-gray-600 font-bold text-sm">
                  <Users size={18} className="text-[#00A699]" /> Travelers
                </div>
                <span className="text-xs font-black text-gray-400 uppercase">2 Person</span>
              </div>
            </div>

            <button className="w-full bg-[#00A699] text-white py-5 rounded-2xl font-black tracking-widest shadow-lg shadow-teal-200 hover:bg-[#008f84] transition-all active:scale-95 flex items-center justify-center gap-2 mb-4">
              BOOK THIS TRIP <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-[#00A699]" /> Secure & Verified Booking
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default TripDetails;