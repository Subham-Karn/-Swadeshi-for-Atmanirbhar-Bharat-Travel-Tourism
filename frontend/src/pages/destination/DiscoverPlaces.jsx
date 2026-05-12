import React from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { ArrowLeft, MapPin, Star, Clock, Ticket, ChevronRight } from 'lucide-react';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
const dummyPlaces = [
    {
      id: "p1",
      name: "Amer Fort",
      isPopular: true,
      rating: 4.9,
      duration: "3-4 Hours",
      entryFee: "₹200",
      description: "A majestic fort known for its artistic Hindu style elements. Located high on a hill, it is the principal tourist attraction in Jaipur, featuring the stunning Sheesh Mahal (Mirror Palace).",
      images: [
        "https://images.unsplash.com/photo-1590593162211-f98f7f462389?q=80&w=1000",
        "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=1000",
      ]
    },
    {
      id: "p2",
      name: "Hawa Mahal",
      isPopular: false,
      rating: 4.7,
      duration: "1 Hour",
      entryFee: "₹50",
      description: "The 'Palace of Breeze' constructed of red and pink sandstone. Its unique five-floor exterior is akin to a honeycomb with its 953 small windows called Jharokhas.",
      images: [
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000",
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1000"
      ]
    },
    {
      id: "p3",
      name: "City Palace",
      isPopular: false,
      rating: 4.8,
      duration: "2-3 Hours",
      entryFee: "₹300",
      description: "A complex of courtyards, gardens and buildings, the City Palace is a striking blend of Rajasthani and Mughal architecture right in the heart of the Old City.",
      images: [
        "https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?q=80&w=1000",
      ]
    },
    {
      id: "p4",
      name: "Nahargarh Fort",
      isPopular: true,
      rating: 4.6,
      duration: "2 Hours",
      entryFee: "₹100",
      description: "Standing on the edge of the Aravalli Hills, this fort offers the most breathtaking panoramic views of the entire Pink City, especially during sunset.",
      images: [
        "https://images.unsplash.com/photo-1592342533815-373322d7a27b?q=80&w=1000",
        "https://images.unsplash.com/photo-160564942838d-756bd02c0c97?q=80&w=1000"
      ]
    },
    {
      id: "p5",
      name: "Jantar Mantar",
      isPopular: false,
      rating: 4.5,
      duration: "1.5 Hours",
      entryFee: "₹100",
      description: "A UNESCO World Heritage site featuring the world's largest stone sundial. It is a collection of nineteen architectural astronomical instruments.",
      images: [
        "https://images.unsplash.com/photo-1635338006453-61109033320c?q=80&w=1000",
      ]
    }
  ];

const DiscoverPlaces = () => {
  const { cityName , stateName , id , cityId} = useParams();
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const  places  = dummyPlaces
 const  isLoading = false;

  if (isLoading) return <PlacesSkeleton />;

  return (
    <div className="bg-white min-h-screen mt-3">
      {/* 1. Header Section - State Page Style */}
      <header className="pt-20 pb-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-[#00A699] font-bold text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to {state?.stateName || 'Cities'}
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#00A699]/10 text-[#00A699] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {state?.regionType || 'Destination'}
                </span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={12} /> {state?.stateName}, India
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-6">
                Discover <span className="text-[#00A699]">{cityName}</span>
              </h1>

              <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                Explore the most iconic landmarks, hidden trails, and cultural hotspots in {cityName}. 
                Plan your perfect itinerary with our handpicked selection of must-visit places.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-4xl border border-gray-100 shrink-0 self-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-400/20">
                  <Star size={24} fill="white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900 leading-none">4.8</p>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Places Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {places.map((place, index) => {
            const isPopular = place.isPopular;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                // If popular, it takes up 2 columns on large screens
                className={`group cursor-pointer ${isPopular ? 'lg:col-span-2' : 'col-span-1'}`}
              >
                <div className={`relative ${isPopular ? 'h-125' : 'h-96'} w-full rounded-[2.5rem] overflow-hidden mb-5 shadow-xl`}>
                  
                  {/* Image Slider for Places */}
                  <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 4000 + (index * 200) }}
                    pagination={{ clickable: true }}
                    className="h-full w-full"
                  >
                    {place.images?.map((img, idx) => (
                      <SwiperSlide key={idx}>
                        <img src={img} alt={place.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
                  
                  {isPopular && (
                    <div className="absolute top-6 left-6 z-20">
                      <span className="bg-yellow-400 text-black text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                        ⭐ Popular Choice
                      </span>
                    </div>
                  )}

                  {/* Place Content */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock size={12} /> {place.duration || '2-3 Hours'}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Ticket size={12} /> {place.entryFee || 'Free Entry'}
                      </span>
                    </div>

                    <h3 className={`${isPopular ? 'text-4xl' : 'text-2xl'} font-black text-white mb-2 tracking-tight`}>
                      {place.name}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 max-w-lg mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {place.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={16} fill="currentColor" />
                        <span className="text-white font-bold text-sm">{place.rating || '4.5'}</span>
                      </div>
                      <Link to={`/destinations/${stateName}/${id}/${cityName}/${cityId}/${place.name}/${place.id}`} className="w-10 h-10 rounded-full bg-[#00A699] text-white flex items-center justify-center translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

/* --- Skeleton for Places Page --- */
const PlacesSkeleton = () => (
  <div className="bg-white min-h-screen mt-3">
    <header className="pt-20 pb-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
        <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="h-16 w-1/2 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-20 w-2/3 bg-gray-50 rounded-lg animate-pulse" />
      </div>
    </header>
    <div className="py-20 max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="h-96 w-full rounded-[2.5rem] bg-gray-100 animate-pulse" />
      ))}
    </div>
  </div>
);

export default DiscoverPlaces;