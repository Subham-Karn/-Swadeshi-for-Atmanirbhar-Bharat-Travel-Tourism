import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Save,
  Building2,
  ImageIcon,
  Plus,
  Loader2,
  Search,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Store & Utils
import { useRegionsStore } from "../../../store/useRegionStore";
import { useAuthStore } from "../../../store/useAuthStore";

// Components & Modals
import StatePickerModal from "../../modals/StatePickerModal";
import MultiPhotoModal from "../../modals/MultiPhotoModal";
import CityNodeCard from "../../components/CityNodeCard";
import TerritoryEditor from "../../components/TerritoryEditor";
import CityNodeAddModal from "../../modals/CityNodeAddModal";

const regionTypeOptions = [
  "North",
  "South",
  "East",
  "West",
  "Central",
  "North-East",
];

const AddRegion = () => {
  const { regionId } = useParams();
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Store Actions/State
  const {
    regions,
    cities,
    createRegion,
    updateRegion,
    fetchCitiesByState,
    isLoading,
  } = useRegionsStore();

  const isEditMode = location.pathname.endsWith("/edit");

  // Local UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStateGalleryOpen, setIsStateGalleryOpen] = useState(false);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [activeStateImgIdx, setActiveStateImgIdx] = useState(0);
  const [selectedCity, setSelectedCity] = useState(null); 
  // Form States
  const [citiesData, setCitiesData] = useState([]);
  const [formData, setFormData] = useState({
    regionType: "North",
    stateName: "",
    stateImages: [],
    stateOverview: "",
    citiesCount: 0,
    status: "Active",
    reach: "High",
    bestTimeToVisit: "",
    isPopular: false,
    stateId: null,
  });

  // 1. SYNC: Load State/Territory Data in Edit Mode
  useEffect(() => {
    if (isEditMode && regionId && regions.length > 0) {
      const region = regions.find((r) => r._id === regionId);
      if (region) {
        setFormData({
          regionType: region.regionType || "North",
          stateName: region.stateName || "",
          stateImages: Array.isArray(region.stateImage)
            ? region.stateImage
            : region.stateImage
              ? [region.stateImage]
              : [],
          stateOverview: region.overview || "",
          citiesCount: region.citiesCount || 0,
          status: region.status || "Active",
          reach: region.reach || "High",
          isPopular: region.isPopular || false,
          stateId: region._id,
          bestTimeToVisit: region.bestTimeToVisit || "",
        });
        fetchCitiesByState(regionId);
      }
    }
  }, [regionId, regions, isEditMode, fetchCitiesByState]);

  // 2. SYNC: Load Cities (Nodes) in Edit Mode
  useEffect(() => {
    if (isEditMode && cities?.length > 0) {
      const mappedCities = cities.map((c) => ({
        cityName: c.cityName || "",
        cityImages: c.cityImages || c.images || [],
        overview: c.overview || "",
        isPopular: c.isPopular || false,
        _id: c._id,
      }));
      setCitiesData(mappedCities);
      setFormData((prev) => ({ ...prev, citiesCount: mappedCities.length }));
    }
  }, [cities, isEditMode]);

  // HANDLERS
  const handleSelectState = useCallback((selected) => {
    setFormData((prev) => ({
      ...prev,
      stateName: selected.stateName,
      regionType: selected.regionType || prev.regionType,
      stateImages: selected.stateImage ? [selected.stateImage] : [],
      stateOverview: selected.overview || "",
      isPopular: selected.isPopular || false,
      stateId: selected._id || null,
    }));
    setIsModalOpen(false);
    toast.success(`Node Target: ${selected.stateName}`);
  }, []);

  const handleStateGallerySync = (links) => {
    setFormData((prev) => ({ ...prev, stateImages: links }));
    setActiveStateImgIdx(0);
  };

const handleAddNewNode = (updatedCity) => {
  setCitiesData((prev) => {
    const existingIndex = prev.findIndex((c) => 
      (updatedCity._id && c._id === updatedCity._id) || 
      (updatedCity.cityName === c.cityName && c.cityName !== "")
    );

    if (existingIndex !== -1) {
      const updatedList = [...prev];
      updatedList[existingIndex] = updatedCity;
      toast.success(`${updatedCity.cityName} configuration updated`);
      return updatedList;
    } else {
      setFormData((prevForm) => ({ 
        ...prevForm, 
        citiesCount: prevForm.citiesCount + 1 
      }));
      toast.success(`${updatedCity.cityName} added to stack`);
      return [...prev, updatedCity];
    }
  });
};

  const handleOpen = (city) =>{
    setSelectedCity(city);
    setIsAddNodeModalOpen(true);
  }

  const handleSubmit = async () => {
    if (!user?._id && !user?.id) return toast.error("Authentication required");
    if (!formData.stateName) return toast.error("State Identity is required");

    const payload = {
      userId: user?._id || user?.id,
      state: {
        regionType: formData.regionType,
        stateName: formData.stateName,
        stateImage: formData.stateImages,
        overview: formData.stateOverview,
        status: formData.status,
        reach: formData.reach,
        citiesCount: citiesData.length,
        bestTimeToVisit: formData.bestTimeToVisit,
        isPopular: formData.isPopular,
      },
      cities: citiesData.map((city) => ({
        cityName: city.cityName,
        cityImages: city.cityImages || [],
        overview: city.overview,
        isPopular: city.isPopular || false,
      })),
    };

    try {
      if (isEditMode) {
        await updateRegion(regionId, payload);
      } else {
        await createRegion(payload);
      }
      toast.success(
        isEditMode ? "Configuration Updated" : "Territory Published",
      );
      setTimeout(() => navigate("/admin/regions"), 500);
    } catch (error) {
      toast.error("Process interrupted");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#F7F7F7] min-h-screen relative font-sans"
    >
      {/* 1. LOADING OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-300 bg-white/70  flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4 bg-white p-8 rounded shadow-2xl">
              <Loader2 className="w-12 h-12 text-[#00A699] animate-spin" />
              <p className="font-black text-slate-900 tracking-tighter uppercase text-sm">
                Processing Configuration...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MODALS */}
      <StatePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectState}
        currentState={formData.stateName}
      />
      <MultiPhotoModal
        isOpen={isStateGalleryOpen}
        onClose={() => setIsStateGalleryOpen(false)}
        images={formData.stateImages}
        onSync={handleStateGallerySync}
      />
      <CityNodeAddModal
        isOpen={isAddNodeModalOpen}
        initialData={selectedCity}
        onClose={() => setIsAddNodeModalOpen(false)}
        onAdd={handleAddNewNode}
      />

      <div className="w-full">
        {/* TOP BAR */}
        <div className="flex items-center justify-between gap-6 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="px-10 py-4 rounded-2xl bg-[#00A699] text-white font-black shadow-xl shadow-teal-100 hover:bg-[#008f84] transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {isEditMode ? "Save Changes" : "Publish Territory"}
          </button>
        </div>

        {/* STATE CONFIGURATION SECTION */}
        <section className="bg-white p-6 md:p-12 rounded-xl shadow-xl shadow-slate-200/40 border border-slate-100 mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
                <div className="p-3 bg-teal-50 rounded-2xl text-[#00A699]">
                  <Globe size={28} />
                </div>
                {isEditMode ? "Edit Node" : "New Node"}
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 ml-1">
                Integrated Territory Controller
              </p>
            </div>

            <div className="flex items-center gap-4 px-5 py-2 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${formData.isPopular ? "text-orange-500" : "text-slate-400"}`}
              >
                {formData.isPopular ? "High Priority" : "Standard"}
              </span>
              <button
                onClick={() =>
                  setFormData((p) => ({ ...p, isPopular: !p.isPopular }))
                }
                className={`w-12 h-6 rounded-full transition-all relative ${formData.isPopular ? "bg-orange-500" : "bg-slate-300"}`}
              >
                <motion.div
                  animate={{ x: formData.isPopular ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Slider */}
            <div className="space-y-6">
              <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-50 group">
                <AnimatePresence mode="wait">
                  {formData.stateImages?.length > 0 ? (
                    <motion.div
                      key={activeStateImgIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full relative"
                    >
                      <img
                        src={formData.stateImages[activeStateImgIdx]}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt="State"
                      />
                      <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white font-black text-[9px] uppercase tracking-widest">
                        {activeStateImgIdx + 1} / {formData.stateImages.length}{" "}
                        Assets
                      </div>
                      {formData.stateImages.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() =>
                              setActiveStateImgIdx((p) =>
                                p === 0
                                  ? formData.stateImages.length - 1
                                  : p - 1,
                              )
                            }
                            className="w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-xl hover:scale-110 transition-transform"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() =>
                              setActiveStateImgIdx((p) =>
                                p === formData.stateImages.length - 1
                                  ? 0
                                  : p + 1,
                              )
                            }
                            className="w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-xl hover:scale-110 transition-transform"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon size={48} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-widest mt-2">
                        No Visual Data
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={() => setIsStateGalleryOpen(true)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg hover:bg-[#00A699] transition-all"
              >
                <ImageIcon size={18} /> Manage Gallery Assets (
                {formData.stateImages.length})
              </button>
            </div>

            {/* Right: Inputs */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Zone
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] font-bold outline-none cursor-pointer"
                    value={formData.regionType}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, regionType: e.target.value }))
                    }
                  >
                    {regionTypeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt} India
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    Registry Name
                  </label>
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl cursor-pointer hover:border-[#00A699] flex justify-between items-center group transition-all"
                  >
                    <span
                      className={
                        formData.stateName
                          ? "font-black text-slate-900"
                          : "text-slate-300 font-bold"
                      }
                    >
                      {formData.stateName || "Assign Territory..."}
                    </span>
                    <Search
                      size={16}
                      className="text-slate-300 group-hover:text-[#00A699]"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Travel Window
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] outline-none font-bold"
                  placeholder="e.g. October - March"
                  value={formData.bestTimeToVisit}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      bestTimeToVisit: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                  Reach Index
                </label>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, reach: level })}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.reach === level ? "bg-white text-[#00A699] shadow-md" : "text-slate-400"}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <TerritoryEditor
              value={formData.stateOverview}
              onChange={(e) =>
                setFormData((p) => ({ ...p, stateOverview: e.target.value }))
              }
            />
          </div>
        </section>

        {/* CITY NODES SECTION */}
        <div className="space-y-8 pb-20">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <Building2 size={28} className="text-[#00A699]" /> Active Node
              Matrix ({citiesData.length})
            </h3>
            <button
              onClick={() => setIsAddNodeModalOpen(true)}
              className="px-8 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:scale-105 transition-transform flex items-center gap-3"
            >
              <Plus size={18} /> Deploy Single Node
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {citiesData.map((city, index) => (
              <CityNodeCard key={index} city={city} onOpen={handleOpen} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AddRegion;
