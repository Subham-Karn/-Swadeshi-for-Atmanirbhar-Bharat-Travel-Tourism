import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building2 } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const PopularDestinations = ({ regions = [] }) => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-sm font-black text-[#00A699] uppercase tracking-[0.3em] mb-3">
              Top Picks
            </h2>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
              Popular <span className="text-[#00A699]">Destinations</span>
            </h1>
          </div>
          <p className="text-gray-500 font-medium max-w-md">
            Handpicked states and cities that capture the true essence of Indian heritage and beauty.
          </p>
        </div>

        {/* Auto Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16 overflow-visible"
        >
          {regions.map((region, index) => (
            <SwiperSlide key={index}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="relative h-125 w-full rounded-[2.5rem] overflow-hidden group cursor-pointer shadow-xl"
              >
                {/* Image Background */}
                <img 
                  src={region.stateImage} 
                  alt={region.state} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-[#00A699] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {region.regionType}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Building2 size={10} /> {region.citiesCount || 0} Cities
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">
                    {region.state}
                  </h3>

                  <p className="text-gray-300 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore the vibrant culture and breathtaking landscapes of {region.state}. A journey you'll never forget.
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <MapPin size={16} className="text-[#00A699]" />
                      <span>View Details</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-[#00A699] flex items-center justify-center transition-transform group-hover:translate-x-2">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Global CSS for Swiper Dots */}
      <style>{`
        .swiper-pagination-bullet-active {
          background: #00A699 !important;
          width: 25px !important;
          border-radius: 5px !important;
        }
        .swiper-pagination {
          bottom: 0 !important;
        }
      `}</style>
    </section>
  );
};

export default PopularDestinations;