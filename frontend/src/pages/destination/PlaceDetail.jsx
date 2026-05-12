import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Star, Clock, Ticket, 
  Car, Train, Plane, Hotel, Utensils, 
  Info, ShieldCheck, Wallet, ChevronRight 
} from 'lucide-react';

const PlaceDetail = () => {
  const { placeName } = useParams();
  const navigate = useNavigate();

  // Dummy Data for a specific Place
  const place = {
    name: "Amer Fort",
    rating: 4.9,
    location: "Dehar Ke Balaji, Jaipur, Rajasthan",
    description: "Amer Fort is a UNESCO World Heritage site known for its artistic Hindu style elements. With its large ramparts and series of gates and cobbled paths, the fort overlooks Maota Lake, which is the main source of water for the Amer Palace.",
    images: ["https://images.unsplash.com/photo-1590593162211-f98f7f462389?q=80&w=1200"],
    entryFee: "₹200 (Indian) | ₹500 (Foreigners)",
    bestTime: "October to March",
    timings: "8:00 AM - 5:30 PM",
    
    // Travel Costs Section
    travelCosts: {
      budget: "₹1,500 - ₹3,000",
      avgTransport: "₹500",
      avgFood: "₹800 per day"
    },

    // Transport Options
    transport: [
      { mode: "Taxi/Auto", price: "₹200-400", time: "30 mins", icon: Car },
      { mode: "Local Bus", price: "₹20-50", time: "50 mins", icon: Train },
    ],

    // Nearby Ecosystem
    nearbyHotels: [
      { name: "The Amer Valley", price: "₹4,500", rating: 4.5, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
      { name: "Royal Heritage", price: "₹7,200", rating: 4.8, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" }
    ],
    nearbyDining: [
      { name: "1135 AD", type: "Fine Dine", rating: 4.7, img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" },
      { name: "The Stag Restro", type: "Cafe", rating: 4.4, img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400" }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Full-Screen Header */}
      <section className="relative h-[60vh] w-full">
        <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        <div className="absolute top-10 left-0 w-full px-6 md:px-12 flex justify-between">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-10 left-0 w-full px-6 md:px-12">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter">
              {place.name}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-gray-700 font-bold">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={20} fill="currentColor" /> {place.rating}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 text-gray-500">
                <MapPin size={18} /> {place.location}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Details & Transport */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Overview */}
          <div>
            <h2 className="text-3xl font-black mb-6 text-gray-900">About the Place</h2>
            <p className="text-gray-500 text-lg leading-relaxed">{place.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <Ticket className="text-[#00A699] mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase">Entry Fee</p>
                <p className="font-black text-gray-900">{place.entryFee}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <Clock className="text-[#00A699] mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase">Timings</p>
                <p className="font-black text-gray-900">{place.timings}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <ShieldCheck className="text-[#00A699] mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase">Best Time</p>
                <p className="font-black text-gray-900">{place.bestTime}</p>
              </div>
            </div>
          </div>

          {/* Transport & Access */}
          <div>
            <h2 className="text-3xl font-black mb-8 text-gray-900">How to Reach</h2>
            <div className="space-y-4">
              {place.transport.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-white border border-gray-100 hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-[#00A699] group-hover:text-white transition-colors">
                      <t.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900">{t.mode}</h4>
                      <p className="text-sm text-gray-400 font-bold">{t.time} approx.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-[#00A699] text-xl">{t.price}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Est. Cost</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Costs & Sticky Cards */}
        <div className="lg:col-span-1">
          <div className="sticky top-10 space-y-8">
            {/* Travel Budget Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00A699] rounded-full blur-3xl opacity-20" />
              <div className="flex items-center gap-3 mb-6">
                <Wallet className="text-[#00A699]" size={28} />
                <h3 className="text-2xl font-black">Travel Cost</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-400 font-bold">Daily Budget</span>
                  <span className="text-2xl font-black text-[#00A699]">{place.travelCosts.budget}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-400 font-bold">Avg Food Exp.</span>
                  <span className="font-black">{place.travelCosts.avgFood}</span>
                </div>
              </div>
              
              <button className="w-full mt-8 py-4 bg-[#00A699] rounded-2xl font-black hover:bg-[#008d82] transition-all">
                Plan My Budget
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Nearby Ecosystem Section (Hotels & Dining) */}
      <section className="py-24 bg-gray-50/50 rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Stay & <span className="text-[#00A699]">Eat Near</span></h2>
            <button className="text-sm font-bold text-gray-400 hover:text-[#00A699] flex items-center gap-2">View All <ChevronRight size={16} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {place.nearbyHotels.map((h, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="h-60 w-full rounded-[2rem] overflow-hidden mb-4 shadow-md">
                  <img src={h.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="font-black text-gray-900">{h.name}</h4>
                <div className="flex justify-between mt-1">
                  <p className="text-[#00A699] font-bold text-sm">Starts {h.price}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                    <Star size={12} fill="#fbbf24" className="text-yellow-400" /> {h.rating}
                  </div>
                </div>
              </div>
            ))}
            {place.nearbyDining.map((d, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="h-60 w-full rounded-[2rem] overflow-hidden mb-4 shadow-md">
                  <img src={d.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="font-black text-gray-900">{d.name}</h4>
                <div className="flex justify-between mt-1">
                  <p className="text-gray-500 font-bold text-sm">{d.type}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                    <Utensils size={12} className="text-[#00A699]" /> {d.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlaceDetail;