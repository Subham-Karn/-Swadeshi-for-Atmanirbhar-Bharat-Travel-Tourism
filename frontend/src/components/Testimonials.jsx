import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    text: "The Munnar trip was life-changing. Everything from the tea garden stay to the local guide was perfectly managed. Truly the soul of India!",
    rating: 5,
    trip: "Kerala Backwaters"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    text: "Varanasi was overwhelming in the best way. Bharat Darshan made sure I felt safe and culturally connected. Highly recommended for solo travelers.",
    rating: 5,
    trip: "Spiritual Varanasi"
  },
  {
    id: 3,
    name: "Priya Sharma",
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
    text: "We booked the Rajasthan Heritage tour for our anniversary. The luxury tents in the desert were magical. Flawless execution!",
    rating: 4,
    trip: "Royal Rajasthan"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-teal-50 text-[#00A699] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Star size={14} fill="currentColor" />
            Traveler Stories
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
            Voices of <span className="text-[#00A699]">Explorers</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-xl font-medium">
            Join thousands of happy travelers who discovered the magic of India through our curated experiences.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-[#F9FAFB] p-8 rounded-[2.5rem] border border-gray-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-teal-900/5"
            >
              <Quote className="absolute top-8 right-8 text-teal-100 group-hover:text-[#00A699] transition-colors" size={40} />
              
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#00A699] text-white p-1 rounded-full border-2 border-white">
                    <CheckCircle size={10} fill="currentColor" />
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-none">{item.name}</h4>
                  <p className="text-xs text-gray-400 mt-1 font-bold">{item.location}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < item.rating ? "text-orange-400" : "text-gray-200"} 
                    fill={i < item.rating ? "currentColor" : "none"} 
                  />
                ))}
              </div>

              <p className="text-gray-600 italic text-sm leading-relaxed mb-6">
                "{item.text}"
              </p>

              <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[10px] font-black text-[#00A699] uppercase tracking-widest">
                  Trip: {item.trip}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Verified Traveler
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Trust Bar */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap justify-center items-center gap-10 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           <span className="text-xl font-black text-gray-900 tracking-tighter italic">TripAdvisor</span>
           <span className="text-xl font-black text-gray-900 tracking-tighter italic">Lonely Planet</span>
           <span className="text-xl font-black text-gray-900 tracking-tighter italic">National Geographic</span>
           <span className="text-xl font-black text-gray-900 tracking-tighter italic">Condé Nast</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;