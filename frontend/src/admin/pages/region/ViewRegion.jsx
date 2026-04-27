import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Globe, Navigation, 
  TrendingUp, Building2, Edit 
} from 'lucide-react';

const ViewRegion = () => {
  const { regionId } = useParams();
  const navigate = useNavigate();

  // Mock Data
  const region = {
    id: regionId,
    regionType: "South India",
    state: "Kerala",
    stateImage: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
    status: "Active",
    reach: "High",
    cities: [
      { cityName: "Munnar", imageUrl: "https://images.unsplash.com/photo-1510009489794-352fba39acd3", description: "Famous for its tea plantations and rolling hills." },
      { cityName: "Alleppey", imageUrl: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b", description: "Known for its beautiful backwaters and houseboat stays." },
      { cityName: "Wayanad", imageUrl: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d", description: "Green mountainous region with spice plantations." },
      { cityName: "Thekkady", imageUrl: "https://images.unsplash.com/photo-1589133405670-578dc89f6e02", description: "Home to Periyar National Park and elephant sanctuaries." },
      { cityName: "Varkala", imageUrl: "https://images.unsplash.com/photo-1584126307049-70154493f403", description: "Stunning cliffside beaches and coastal vibes." }
    ]
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-[#F7F7F7] h-full flex flex-col overflow-hidden"
    >
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/regions')}
            className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-[#00A699] transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{region.state}</h1>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <Globe size={14} /> {region.regionType}
            </p>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/admin/regions/${regionId}/edit`)}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:border-[#00A699] hover:text-[#00A699] transition-all shadow-sm"
        >
          <Edit size={18} /> Edit Details
        </button>
      </div>

      {/* Main Grid Container - Fixed Height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        
        {/* Left: Summary Cards (Static) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-lg">
            <img src={region.stateImage} alt={region.state} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4">
              <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#00A699] rounded-full text-xs font-bold shadow-sm">
                {region.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <TrendingUp className="text-[#00A699] mb-3" size={20} />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reach</p>
              <p className="text-lg font-bold text-gray-800">{region.reach}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <Building2 className="text-[#00A699] mb-3" size={20} />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cities</p>
              <p className="text-lg font-bold text-gray-800">{region.cities.length}</p>
            </div>
          </div>
        </div>

        {/* Right: Cities List (Scrollable) */}
        <div className="lg:col-span-2 flex flex-col min-h-0 h-full">
        <div className="flex items-center justify-between px-2 mb-4 shrink-0">
            <h2 className="text-xl font-bold text-gray-800">Featured Cities</h2>
            <span className="text-sm text-gray-400 font-medium">Internal Database</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-6 pb-6 
                        h-auto max-h-[70vh] 
                        min-h-[calc(100vh-220px)] ">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {region.cities.map((city, index) => (
                <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm group cursor-pointer"
                >
                <div className="h-48 overflow-hidden relative">
                    <img 
                    src={city.imageUrl} 
                    alt={city.cityName} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold">
                    #{index + 1}
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{city.cityName}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {city.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-[#00A699] font-bold text-xs uppercase tracking-widest">
                    <Navigation size={12} /> Explore More
                    </div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ViewRegion;