import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowLeft, MapPin, Star, Clock, Ticket, ChevronRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { usePlaceStore } from '../../store/usePlaceStore';
import { useCitiesStore } from '../../store/useCitiesStore';

const DiscoverPlaces = () => {
  const { cityName, stateName, cityId } = useParams();
  const navigate = useNavigate();
  
  const { fetchPlacesByCity, isLoading: isPlacesLoading, places } = usePlaceStore();
  const { fetchCityById } = useCitiesStore();
  
  const [city, setCity] = useState(null);
  const [isCityLoading, setIsCityLoading] = useState(true);

  const loadCityData = useCallback(async () => {
    if (!cityId) return;
    try {
      const data = await fetchCityById(cityId);
      setCity(data);
    } catch (err) {
      console.error("Failed to fetch city", err);
    } finally {
      setIsCityLoading(false);
    }
  }, [cityId, fetchCityById]);

  useEffect(() => {
    loadCityData();
    fetchPlacesByCity(cityId);
  }, [cityId, fetchPlacesByCity, loadCityData]);

  if (isCityLoading || isPlacesLoading) return <PlacesSkeleton />;

  return (
    <div className="bg-white min-h-screen mt-3">
      <header className="pt-20 pb-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#00A699] font-bold text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to {stateName}
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#00A699]/10 text-[#00A699] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {city?.regionType || 'Destination'}
                </span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={12} /> {stateName}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
                Discover <span className="text-[#00A699]">{cityName}</span>
              </h1>
              <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                {city?.overview}
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Star size={24} fill="white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 leading-none">{city?.rating || 0}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence>
            {places.map((place) => (
              <motion.div
                key={place._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`group cursor-pointer ${place.isPopular ? 'lg:col-span-2' : 'col-span-1'}`}
              >
                <div className={`relative ${place.isPopular ? 'h-[500px]' : 'h-96'} w-full rounded-[2.5rem] overflow-hidden mb-5 shadow-xl`}>
                  <Swiper modules={[Autoplay, Pagination, EffectFade]} effect="fade" autoplay={{ delay: 4000 }} pagination={{ clickable: true }} className="h-full">
                    {place.images?.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <img src={img} alt={place.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <h3 className="text-3xl font-black text-white mb-2">{place.name}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {place.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <span className="text-white/80 text-xs font-bold flex items-center gap-1"><Clock size={12} /> {place.duration}</span>
                        <span className="text-white/80 text-xs font-bold flex items-center gap-1"><Ticket size={12} /> {place.entryFee}</span>
                      </div>
                      <Link to={`/destinations/${stateName}/${cityName}/${cityId}/${place.name}/${place._id}`} className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-[#00A699] hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

const PlacesSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
    <div className="md:col-span-2 h-[500px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
    <div className="h-[400px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
    <div className="h-[400px] rounded-[2.5rem] bg-gray-100 animate-pulse" />
  </div>
);

export default DiscoverPlaces;