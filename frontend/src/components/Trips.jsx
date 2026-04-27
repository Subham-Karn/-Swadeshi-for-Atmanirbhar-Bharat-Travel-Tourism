import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const trips = [
  {
    id: 1,
    title: "Spiritual Varanasi & Ganges",
    duration: "4 Days / 3 Nights",
    price: "₹12,499",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1000",
    tag: "Trending"
  },
  {
    id: 2,
    title: "Royal Rajasthan Heritage",
    duration: "7 Days / 6 Nights",
    price: "₹24,999",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1590050853549-3663675003c2?q=80&w=1000",
    tag: "Best Seller"
  },
  {
    id: 3,
    title: "Leh-Ladakh Bike Expedition",
    duration: "10 Days / 9 Nights",
    price: "₹35,000",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1581791534721-e599df4417f7?q=80&w=1000",
    tag: "Adventure"
  }
];

const Trips = () => {
  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-[#00A699] font-black uppercase tracking-widest text-sm mb-4">Ready-to-Go</h2>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Curated <span className="text-[#00A699]">Trip Packages</span>
          </h1>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <motion.div 
              key={trip.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group"
            >
              {/* Image Header */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#00A699] uppercase shadow-sm">
                  {trip.tag}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Details Body */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-orange-400">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-bold text-gray-700">{trip.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                    <Clock size={14} /> {trip.duration}
                  </div>
                </div>

                <h3 className="text-xl font-black text-gray-800 mb-4 group-hover:text-[#00A699] transition-colors">
                  {trip.title}
                </h3>

                <div className="space-y-2 mb-6">
                  {['Accomodation', 'Meals Included', 'Expert Guide'].map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-gray-500 text-xs">
                      <CheckCircle2 size={14} className="text-[#00A699]" /> {feat}
                    </div>
                  ))}
                </div>

                {/* Footer / Price */}
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 font-bold uppercase block">Starts from</span>
                    <span className="text-2xl font-black text-gray-900">{trip.price}</span>
                  </div>
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#00A699] transition-all active:scale-95">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Explore All Button */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 text-gray-800 font-black border-b-4 border-[#00A699] pb-1 hover:text-[#00A699] transition-all">
            View All Specialized Itineraries <ArrowUpRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Trips;