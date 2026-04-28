import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Calendar, Star, CheckCircle2, 
  ChevronRight, Share2, Heart, ShieldCheck 
} from 'lucide-react';

const DestinationDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  // Mock Data (Replace with your actual fetch logic)
  const destination = {
    title: "Varanasi: The Spiritual Soul",
    location: "Uttar Pradesh, India",
    price: 12500,
    duration: "4 Days, 3 Nights",
    rating: 4.9,
    reviews: 128,
    description: "Experience the timeless essence of India in Varanasi. From the mesmerizing Ganga Aarti to the winding alleys of the old city, every corner tells a story of faith and history.",
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200",
      "https://images.unsplash.com/photo-1590050752117-23a9d7fc240b?q=80&w=800",
    ],
    highlights: ["Ganga Aarti at Dashashwamedh Ghat", "Sarnath Temple Visit", "Early Morning Boat Ride", "Banarasi Silk Weaving Tour"]
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#00A699] font-black text-xs uppercase tracking-widest mb-2">
              <MapPin size={14} /> {destination.location}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              {destination.title}
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsLiked(!isLiked)} className="p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
              <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
            <button className="p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
              <Share2 size={20} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="md:col-span-2 h-[400px] rounded-[2.5rem] overflow-hidden">
          <img src={destination.images[0]} className="w-full h-full object-cover" alt="Main" />
        </div>
        <div className="hidden md:flex flex-col gap-4">
          <div className="h-[192px] rounded-[2rem] overflow-hidden">
            <img src={destination.images[1]} className="w-full h-full object-cover" alt="Sub" />
          </div>
          <div className="h-[192px] rounded-[2rem] bg-gray-900 relative flex items-center justify-center text-white overflow-hidden">
             <img src={destination.images[0]} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" alt="Overlay" />
             <span className="relative z-10 font-black text-xl">+12 Photos</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info */}
        <div className="lg:col-span-2">
          <div className="flex gap-8 mb-10 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 text-[#00A699] rounded-lg"><Clock size={18} /></div>
              <span className="font-bold text-gray-600">{destination.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 text-[#00A699] rounded-lg"><Star size={18} /></div>
              <span className="font-bold text-gray-600">{destination.rating} ({destination.reviews} reviews)</span>
            </div>
          </div>

          <section className="mb-10">
            <h3 className="text-2xl font-black text-gray-900 mb-4">Overview</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              {destination.description}
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Experience Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {destination.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <CheckCircle2 className="text-[#00A699]" size={20} />
                  <span className="font-bold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Starting from</span>
                <p className="text-3xl font-black text-gray-900">₹{destination.price.toLocaleString()}</p>
              </div>
              <div className="bg-teal-50 text-[#00A699] px-3 py-1 rounded-full text-xs font-black uppercase">
                Best Price
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">Check Availability</span>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </div>
              <div className="flex items-center gap-2 px-2 text-[10px] font-black text-gray-400 uppercase">
                <ShieldCheck size={14} className="text-[#00A699]" />
                Free Cancellation until 48h before
              </div>
            </div>

            <button className="w-full bg-[#00A699] text-white py-5 rounded-2xl font-black tracking-widest shadow-lg shadow-teal-100 hover:bg-[#008f84] transition-all active:scale-[0.98]">
              BOOK JOURNEY NOW
            </button>
            
            <p className="text-center mt-4 text-xs font-bold text-gray-400">No payment required yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;