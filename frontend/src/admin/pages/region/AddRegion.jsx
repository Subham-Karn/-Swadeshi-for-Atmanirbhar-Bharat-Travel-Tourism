import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Globe, Save, Building2, 
  MapPin, Search, ImageIcon, Eye, Star, Info, Loader2 
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useRegionsStore } from "../../../store/useRegionStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { formatGoogleDriveUrl } from "../../../util/formatGoogleDriveUrl";
import StatePickerModal from "../../modals/StatePickerModal";

const statusOptions = ["Active", "Inactive", "Seasonal"];
const regionTypeOptions = ['North', 'South', 'East', 'West', 'Central', 'North-East'];

const AddRegion = () => {
  const { regionId } = useParams();
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Destructure isLoading from store
  const { 
    regions, 
    cities, 
    createRegion, 
    updateRegion, 
    fetchCitiesByState, 
    isLoading 
  } = useRegionsStore();

  const isEditMode = location.pathname.endsWith("/edit");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    regionType: "North",
    stateName: "",
    stateImage: "",
    stateOverview: "",
    citiesCount: 0,
    status: "Active",
    reach: "High",
    bestTimeToVisit: "",
    isPopular: false,
    stateId: null
  });
  
  const [citiesData, setCitiesData] = useState([]);

  // Sync State Data and Trigger Cities Fetch
  useEffect(() => {
    if (isEditMode && regionId) {
      const region = regions.find((r) => r._id === regionId);
      if (region) {
        setFormData({
          regionType: region.regionType || "North",
          stateName: region.stateName || "",
          stateImage: region.stateImage || "",
          stateOverview: region.overview || "",
          citiesCount: region.citiesCount || 0,
          status: region.status || "Active",
          reach: region.reach || "High",
          isPopular: region.isPopular || false,
          stateId: region._id,
          bestTimeToVisit: region.bestTimeToVisit || ""
        });
        fetchCitiesByState(regionId);
      }
    }
  }, [regionId, regions, isEditMode, fetchCitiesByState]);

  // IMPORTANT: Sync cities from store to local form state when they arrive
  useEffect(() => {
    if (isEditMode && cities.length > 0) {
      // Only sync if the cities belong to the current region
      const mappedCities = cities.map(c => ({
        cityName: c.cityName || "",
        imageUrl: c.cityImage || "", // Map backend cityImage to frontend imageUrl
        description: c.overview || "", // Map backend overview to frontend description
        isPopular: c.isPopular || false
      }));
      setCitiesData(mappedCities);
    }
  }, [cities, isEditMode]);


  console.log(cities);
  

  const handleSelectState = useCallback((selected) => {
    setFormData(prev => ({
      ...prev,
      stateName: selected.stateName,
      regionType: selected.regionType || prev.regionType,
      stateImage: selected.stateImage || "",
      stateOverview: selected.overview || "",
      isPopular: selected.isPopular || false,
      stateId: selected._id || null
    }));
    toast.success(`Selected: ${selected.stateName}`);
  }, []);

  const handleCitiesCountChange = (e) => {
    const count = Math.max(0, parseInt(e.target.value) || 0);
    setFormData(prev => ({ ...prev, citiesCount: count }));

    setCitiesData(prev => {
      const newCities = [...prev];
      if (count > newCities.length) {
        for (let i = newCities.length; i < count; i++) {
          newCities.push({ cityName: "", imageUrl: "", description: "", isPopular: false });
        }
      } else {
        newCities.splice(count);
      }
      return newCities;
    });
  };

  const handleCityDataChange = (index, field, value) => {
    const updatedCities = [...citiesData];
    updatedCities[index][field] = field === "imageUrl" ? formatGoogleDriveUrl(value) : value;
    setCitiesData(updatedCities);
  };

  const handleSubmit = async () => {
    if (!user?._id && !user?.id) return toast.error("Please login to continue");
    if (!formData.stateName) return toast.error("State Name is required");

    const payload = {
      userId: user?._id || user?.id,
      state: {
        regionType: formData.regionType,
        stateName: formData.stateName,
        stateImage: formData.stateImage,
        overview: formData.stateOverview,
        status: formData.status,
        reach: formData.reach,
        citiesCount: formData.citiesCount,
        bestTimeToVisit: formData.bestTimeToVisit,
        isPopular: formData.isPopular
      },
      cities: citiesData 
    };

    try {
      if (isEditMode) {
        await updateRegion(regionId, payload);
      } else {
        await createRegion(payload);
      }
      setTimeout(() => navigate("/admin/regions"), 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#F7F7F7] min-h-screen relative">
      
      {/* GLOBAL LOADING OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-white/60  flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-[#00A699] animate-spin" />
              <p className="font-black text-gray-900 tracking-tighter uppercase text-sm">Processing Data...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <StatePickerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelectState}
        currentState={formData.stateName}
      />

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button 
          disabled={isLoading}
          onClick={handleSubmit} 
          className="px-6 py-3 rounded-2xl bg-[#00A699] text-white font-black shadow-xl shadow-teal-100 hover:bg-[#008f84] transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
          {isEditMode ? "Update Changes" : "Publish Region"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 pb-20">
        
        {/* Left Form Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Globe className="text-[#00A699]" /> {isEditMode ? "Edit State" : "State Details"}
              </h2>
              
              <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100">
                <span className={`text-[10px] font-black uppercase tracking-widest ${formData.isPopular ? 'text-orange-500' : 'text-gray-400'}`}>
                   {formData.isPopular ? "Popular" : "Standard"}
                </span>
                <button 
                  onClick={() => setFormData(prev => ({...prev, isPopular: !prev.isPopular}))}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.isPopular ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <motion.div 
                    animate={{ x: formData.isPopular ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                  />
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Region Type</label>
                <select 
                  className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#00A699] font-bold outline-none"
                  value={formData.regionType}
                  onChange={(e) => setFormData(prev => ({...prev, regionType: e.target.value}))}
                >
                  {regionTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Search State</label>
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl cursor-pointer hover:border-[#00A699] flex justify-between items-center group"
                >
                  <span className={formData.stateName ? "font-bold text-gray-900" : "text-gray-300 font-bold"}>
                    {formData.stateName || "Choose State..."}
                  </span>
                  <Search size={18} className="text-gray-300 group-hover:text-[#00A699]" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Overview</label>
              <textarea 
                className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#00A699] outline-none font-medium resize-none"
                rows="4"
                value={formData.stateOverview}
                onChange={(e) => setFormData(prev => ({...prev, stateOverview: e.target.value}))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Image URL</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#00A699] outline-none"
                    value={formData.stateImage}
                    onChange={(e) => setFormData(prev => ({...prev, stateImage: formatGoogleDriveUrl(e.target.value)}))}
                  />
               </div>
               <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Best Time to Visit</label>
                  <input 
                    type="text" 
                    className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-[#00A699] outline-none"
                    placeholder="e.g., Oct to March"
                    value={formData.bestTimeToVisit}
                    onChange={(e) => setFormData(prev => ({...prev, bestTimeToVisit: e.target.value}))}
                  />
               </div>
            </div>
          </section>

          {/* Cities Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <Building2 size={22} className="text-[#00A699]"/> Cities ({citiesData.length})
              </h3>
              <input 
                type="number" 
                value={formData.citiesCount}
                onChange={handleCitiesCountChange}
                className="w-20 p-2 bg-teal-50 border-2 border-teal-100 rounded-xl outline-none text-center font-black text-[#00A699]"
              />
            </div>

            <AnimatePresence>
              {citiesData.map((city, index) => (
                <motion.div 
                  key={index} 
                  layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
                >
                  <button 
                    onClick={() => handleCityDataChange(index, "isPopular", !city.isPopular)}
                    className={`absolute top-0 right-0 px-8 py-2 rounded-bl-4xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      city.isPopular ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {city.isPopular ? "★ Popular Choice" : "Mark as Popular"}
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-4">
                    <div className="space-y-4">
                      <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 font-bold outline-none focus:border-[#00A699]"
                        placeholder="City Name" value={city.cityName} onChange={(e) => handleCityDataChange(index, "cityName", e.target.value)} />
                      <input className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#00A699] text-sm"
                        placeholder="Image URL" value={city.imageUrl} onChange={(e) => handleCityDataChange(index, "imageUrl", e.target.value)} />
                      <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 outline-none focus:border-[#00A699] resize-none text-xs"
                        placeholder="Description..." rows="2" value={city.description} onChange={(e) => handleCityDataChange(index, "description", e.target.value)} />
                    </div>
                    
                    <div className={`relative h-56 rounded-2xl overflow-hidden bg-gray-100 border-2 transition-all ${city.isPopular ? 'border-orange-400 shadow-xl shadow-orange-100' : 'border-transparent shadow-md'}`}>
                      {city.imageUrl ? (
                        <img src={city.imageUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="City" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={40}/></div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 flex flex-col justify-end p-5">
                        <div className="flex items-center gap-2">
                          {city.isPopular && <Star size={12} className="text-orange-400" fill="currentColor"/>}
                          <p className="text-white font-black text-lg uppercase">{city.cityName || "Untitled City"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar: State Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Eye size={16} className="text-[#00A699]"/> Preview
            </p>
            
            <div className="relative h-72 rounded-xl overflow-hidden shadow-2xl mb-6 bg-gray-100">
              {formData.stateImage ? (
                <img src={formData.stateImage} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-700" alt="State Preview" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={64}/></div>
              )}
              
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white">
                <span className="text-[10px] font-black text-[#00A699] uppercase">{formData.regionType}</span>
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-1">
                  {formData.isPopular && <Star size={16} className="text-orange-400" fill="currentColor"/>}
                  <h3 className="text-3xl font-black text-white tracking-tighter">{formData.stateName || "State Name"}</h3>
                </div>
                <div className="text-teal-400 text-[10px] font-black uppercase tracking-widest">
                   {formData.citiesCount} Cities Available
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1.5"><Info size={12}/> Overview Snippet</p>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed italic">
                    {formData.stateOverview ? `"${formData.stateOverview.substring(0, 100)}..."` : "No overview added yet."}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-teal-50 rounded-2xl text-center border border-teal-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Accessibility</p>
                    <p className="text-sm font-black text-[#00A699] mt-1">{formData.reach}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Status</p>
                    <p className="text-sm font-black text-gray-800 mt-1">{formData.status}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddRegion;