import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Plus, Calendar, Navigation, Info, Star } from 'lucide-react';

const StateHeader = ({ 
  stateName = "Unknown",
  regionType = "Region",
  stateImage = [],
  overview = "",
  bestTimeToVisit = "N/A",
  reach = "N/A",
  citiesCount = 0,
  rating = 5.0,
  isPopular = false,
  onAddCity = () => {} 
}) => {
  return (
    <header className="max-w-8xl mx-auto px-4 mb-4">
      <div className="bg-white shadow-lg shadow-gray-200/40 rounded-2xl p-3 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        
        {/* --- LEFT: Compact Square Swiper --- */}
        <div className="w-full md:w-40 lg:w-48 h-32 md:h-32 rounded-xl overflow-hidden shrink-0 relative group shadow-sm">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="h-full w-full"
          >
            {stateImage.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} className="w-full h-full object-cover" alt={stateName} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/20">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-black text-gray-800">{rating}</span>
          </div>
        </div>

        {/* --- RIGHT: Information Section --- */}
        <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
          
          {/* Top Line: Badges & Title & Button */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[#00A699] text-[9px] font-black uppercase tracking-widest">
                  {regionType} India
                </span>
                {isPopular && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#0F172A] tracking-tighter uppercase leading-none">
                {stateName} <span className="text-[#00A699] lowercase italic font-serif font-normal text-xl">registry</span>
              </h1>
            </div>

            <button 
              onClick={onAddCity}
              className="flex items-center gap-2 bg-[#00A699] hover:bg-[#008c82] text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md shadow-[#00A699]/20 active:scale-95"
            >
              <Plus size={16} />
              <span className="hidden sm:inline uppercase tracking-tighter">Add City</span>
            </button>
          </div>

          {/* Middle: Description (Limited to 1 line to save height) */}
          <p className="text-gray-500 text-xs md:text-sm font-medium line-clamp-1 mb-3">
            {overview}
          </p>

          {/* Bottom: Compact Data Stats (No borders, very slim) */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <CompactStat icon={Calendar} label="Season" value={bestTimeToVisit} />
            <CompactStat icon={Navigation} label="Reach" value={reach} />
            <CompactStat icon={Info} label="Status" value={`${citiesCount} Active`} />
          </div>

        </div>
      </div>
    </header>
  );
};

// Slim Helper for Stats
const CompactStat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 group/item">
    <Icon size={14} className="text-[#00A699]" />
    <div className="flex items-baseline gap-1.5">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{label}:</span>
      <span className="text-xs font-bold text-gray-800">{value}</span>
    </div>
  </div>
);

export default StateHeader;