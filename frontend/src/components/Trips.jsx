import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Tag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { useTripStore } from '../store/useTripStore';

import 'swiper/css';
import 'swiper/css/free-mode';
import { useAuthStore } from '../store/useAuthStore';

const Trips = () => {
  const navigate = useNavigate();
  const {user} = useAuthStore();
  const { trips, fetchUserTrips, isLoading } = useTripStore();

  useEffect(() => {
    fetchUserTrips(user?.id);
  }, [fetchUserTrips]);

  console.log(trips);
  

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-[#00A699] font-black uppercase tracking-widest text-sm mb-2">My Journeys</h2>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Planned Expeditions</h1>
          </div>
        </div>

        {isLoading ? (
          <TripsSkeleton />
        ) : (
          <Swiper
            modules={[FreeMode]}
            spaceBetween={24}
            slidesPerView={1}
            freeMode={true}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
          >
            {trips.slice(0, 4).map((trip) => (
              <SwiperSlide key={trip._id} className="h-auto">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-2xl transition-all h-full flex flex-col"
                >
                  {/* Image & Badges */}
                  <div className="relative h-56 rounded-xl overflow-hidden mb-4">
                    <img src={trip.placeId?.coverImage} alt={trip.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 backdrop-blur-md bg-white/30 text-white rounded-xl text-[10px] font-black uppercase tracking-wider">
                        {trip.status}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-2 flex-grow space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                      <Calendar size={12} /> {trip.numberOfDays} Days
                    </div>
                    <h3 className="text-lg font-black text-slate-800 line-clamp-1">{trip.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-bold">
                      <MapPin size={12} className="text-[#00A699]" /> {trip.placeId?.cityName}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between px-2">
                    <p className="text-xl font-black text-slate-900">₹{trip.budgetCalculation?.estimatedTotalCost?.toLocaleString()}</p>
                    <button onClick={() => navigate(`/trips/details/${trip._id}`)} className="h-10 w-10 bg-slate-50 hover:bg-[#00A699] hover:text-white rounded-full flex items-center justify-center transition-all">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

/* --- Enhanced Skeleton Loader --- */
const TripsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-[400px] rounded-[2.5rem] bg-gray-50 p-4 space-y-4 animate-pulse">
        <div className="h-56 bg-gray-200 rounded-[2rem]" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-6 w-full bg-gray-200 rounded" />
        <div className="h-10 w-full mt-auto bg-gray-200 rounded-2xl" />
      </div>
    ))}
  </div>
);

export default Trips;