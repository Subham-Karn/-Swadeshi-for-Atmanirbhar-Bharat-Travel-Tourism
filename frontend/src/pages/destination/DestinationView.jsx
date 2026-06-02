import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Building2, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { useDestinationsStore } from '../../store/useDestinationsStore';

const DestinationView = ({}) => {
  const { id , stateName} = useParams();
  const navigate = useNavigate();
  const {state} = useLocation();
  const {destinationsById: destination , fetchDestinationsById , isLoading} = useDestinationsStore();
 if(!id || id === undefined || !state){
    return (
      <div className='text-center text-2xl font-bold text-gray-500'>No destination found</div>
    )
 }
   
  useEffect(()=>{
    fetchDestinationsById(id);
    document.title = `Bharat Darshan - ${stateName}`;
  },[fetchDestinationsById])
  if (isLoading) return <DestinationSkeleton />;

  return (
    <div className="bg-white min-h-screen mt-3">
      {/* 1. Header Section */}
      <header className="pt-20 pb-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#00A699] font-bold text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Destinations
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#00A699]/10 text-[#00A699] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {state.regionType || "Not Specified"}
                </span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={12} /> India
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
                Explore <span className="text-[#00A699]">{state.stateName.trim().replace("-", " ") || "Not Specified"}</span>
              </h1>

              <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                {state.overview || "Not Specified"}
              </p>
            </div>
            
            {/* Stats Card */}
            <div className="bg-gray-50 p-6 rounded-2xl flex items-center gap-5 border border-gray-100 shrink-0 self-start">
              <div className="w-14 h-14 bg-[#00A699] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#00A699]/20">
                <Building2 size={28} />
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900 leading-none">
                  {state.citiesCount || 0}
                </p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Available Cities</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Cities Grid Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        {
          destination?.length === 0 ? (
            <div className="text-center text-2xl font-bold text-gray-500">No cities found</div>
          ): (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {destination.map((city, index) => (
                    <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer"
                    >
                    <div className="relative h-85 w-full rounded-[2.5rem] overflow-hidden mb-5 shadow-xl bg-gray-100">
                        <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        loop={true}
                        className="h-full w-full city-swiper"
                        >
                        {city.cityImages?.map((img, imgIdx) => (
                            <SwiperSlide key={imgIdx}>
                            <img 
                                src={img} 
                                alt={city.name} 
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            </SwiperSlide>
                        ))}
                        </Swiper>
                        
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none z-10" />
                        
                        <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase z-20">
                        {city.spots || "0" } Sightseeing Spots
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-3">
                        <div>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#00A699] transition-colors tracking-tight">
                            {city.cityName || "Not Specified"}
                        </h3>
                        <p className="text-gray-400 text-sm font-bold">Discover {city.cityName || "Not Specified"}</p>
                        </div>
                        <Link to={`/destinations/${state.stateName}/${id}/${city.cityName}/${city._id}`} state={{city}} className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-[#00A699] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                        <ChevronRight size={22} />
                        </Link>
                    </div>
                    </motion.div>
                ))}
                </div>
          )
        }

      </section>

      {/* Custom Swiper/Skeleton Styles */}
      <style>{`
        .city-swiper .swiper-pagination-bullet { background: white !important; opacity: 0.6; }
        .city-swiper .swiper-pagination-bullet-active { background: #00A699 !important; opacity: 1; width: 18px; border-radius: 4px; transition: all 0.3s; }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f7f7f7 25%, #efefef 50%, #f7f7f7 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
};

/* --- Skeleton Component --- */
const DestinationSkeleton = () => (
  <div className="bg-white min-h-screen mt-3">
    <header className="pt-20 pb-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
          <div className="space-y-6 flex-1">
            <div className="h-20 w-3/4 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-50 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-50 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-50 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-28 w-60 bg-gray-100 rounded-2xl animate-pulse shrink-0" />
        </div>
      </div>
    </header>
    <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-5">
            <div className="h-85 w-full rounded-[2.5rem] bg-gray-100 skeleton-shimmer" />
            <div className="flex justify-between items-center px-3">
              <div className="space-y-3">
                <div className="h-7 w-40 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-4 w-24 bg-gray-50 rounded-md animate-pulse" />
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default DestinationView;