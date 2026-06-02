import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { Plus, Calendar, Navigation, Info, Star, ArrowLeft, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StateHeader = ({ 
  cityName = "Unknown",
  regionType = "Region",
  cityImages = [],
  overview = "",
  bestTimeToVisit = "N/A",
  reach = "N/A",
  placeCount = 0,
  rating = 5.0,
  isPopular = false,
  onAddPlace = () => {} ,
  onAddHotel = () => {},
  onAddTransport = () => {}
}) => {
  const navigate = useNavigate();

  return (
    <header className="max-w-8xl mx-auto  font-sans">
      {/* HEADER ACTIONS */}
      <div className='flex items-center justify-between px-2 my-3'>
        <button 
          onClick={() => navigate(-1)}
          className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex flex-wrap items-center gap-3">
          {/* Add New Place Button - Solid Brand Hero Accent */}
          <button 
            onClick={() => onAddPlace()} 
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#00A699]/20 hover:bg-[#008f84] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} strokeWidth={3} /> Add New Place
          </button>

          {/* Add Hotel Button - Clean Premium Border Accent */}
          <button 
            onClick={() => onAddHotel()} 
            className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-[#00A699] border-2 border-[#00A699] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#00A699]/5 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} strokeWidth={3} /> Add Hotel
          </button>

          {/* Add Transport Button - Minimal Tinted Glass Accent */}
          <button 
            onClick={() => onAddTransport()} 
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#00A699]/10 text-[#00A699] hover:bg-[#00A699]/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus size={16} strokeWidth={3} /> Add Transport
          </button>
        </div>
      </div>
      {/* Main Info Card */}
      <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-4 border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
        
        {/* --- LEFT: Image Slider --- */}
        <div className="w-full md:w-44 lg:w-52 h-40 md:h-36 rounded-xl overflow-hidden shrink-0 relative group shadow-inner">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="h-full w-full"
          >
            {cityImages.length > 0 ? (
                cityImages.map((img, i) => (
                <SwiperSlide key={i}>
                    <img src={img} className="w-full h-full object-cover" alt={cityImages} />
                </SwiperSlide>
                ))
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">No Image</div>
            )}
          </Swiper>
          <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-black text-gray-800">{rating}</span>
          </div>
        </div>

        {/* --- RIGHT: Information --- */}
        <div className="flex-1 flex flex-col justify-center min-w-0 w-full">
          
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#00A699] text-[10px] font-black uppercase tracking-[0.2em] bg-[#00A699]/5 px-2 py-0.5 rounded">
                {regionType} India
              </span>
              {isPopular && <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              {cityName}
            </h1>
          </div>

          <p className="text-gray-500 text-sm font-medium line-clamp-1 mb-4 border-l-2 border-[#00A699]/20 pl-3">
            {overview}
          </p>

          {/* Bottom Stats */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <CompactStat icon={Calendar} label="Best Time" value={bestTimeToVisit} />
            <CompactStat icon={Info} label="Total Places" value={`${placeCount} Active`} />
          </div>

        </div>
      </div>
    </header>
  );
};

// Slim Helper for Stats
const CompactStat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="bg-gray-50 p-2 rounded-lg text-[#00A699]">
        <Icon size={18} />
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</span>
      <span className="text-xs font-bold text-gray-800 leading-none">{value}</span>
    </div>
  </div>
);

export default StateHeader;