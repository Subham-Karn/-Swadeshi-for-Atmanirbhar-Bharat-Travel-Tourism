import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ChevronLeft,
  MapPin,
  ImageIcon,
  Layers,
  Globe,
  Star,
  Info,
  CheckCircle2,
  Trash2,
  Plus,
  Zap,
  Link,
} from "lucide-react";
import { usePlaceStore } from "../../../../store/usePlaceStore";
import { useRegionsStore } from "../../../../store/useRegionStore";
import TextEditor from "../../../components/TextEditor";
import { formatGoogleDriveUrl } from "../../../../util/formatGoogleDriveUrl";
import MultiPhotoModal from "../../../modals/MultiPhotoModal";
import toast from "react-hot-toast";

const CategoryOptions = [
  { value: "historical", label: "Historical" },
  { value: "natural", label: "Natural" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
  { value: "religious", label: "Religious" },
];

const AddPlaces = () => {
  const { cityId, placeId , cityName , stateName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = Boolean(placeId && location.pathname.includes("edit"));

  const { fetchPlaceById, isLoading, addPlace, updatePlace }  = usePlaceStore();

  // State
  const [forms, setForms] = useState({
    name: "",
    cityId: cityId || "",
    cityName: cityName || "",
    images: [],
    coverImage: "",
    category: "Heritage",
    overview: "",
    isPopular: false,
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    if (isEditMode) {
      const loadPlaceDetails = async () => {
        try {
          const place = await fetchPlaceById(placeId);
          if (place) {
            setForms({ 
              name: place.name || "",
              cityId: place.cityId || "",
              cityName: place.cityName || "",
              images: place.images || [],
              coverImage: place.coverImage || "",
              category: place.category || "Heritage",
              overview: place.overview || "",
              isPopular: place.isPopular || false,
             });
          }
        } catch (error) {
          console.error("Error loading place details:", error);
        }
      };
      loadPlaceDetails();
    }
  }, [isEditMode, placeId, fetchPlaceById]);

  const handleInputChange = (field, value) => {
    setForms((prev) => ({ ...prev, [field]: value }));
  };

  const handleGallerySync = (links) => {
    setForms((prev) => ({ ...prev, images: links }));
    setActiveImgIdx(0);
  };

  const handleSave = async () => {
    try {
      if (isEditMode) {
        await updatePlace(placeId, forms);
      } else {
        await addPlace(forms);
      }
      toast.success(`Place ${isEditMode ? "updated" : "created"} successfully`);
      navigate(`/admin/regions/${stateName}/${forms.cityName}/${forms.cityId}/places`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save place");  
    }
  };


  return (
    <div className="min-h-screen bg-[#F7F7F7]  font-sans">
      {/* Another Components */}
      <MultiPhotoModal
        images={forms.images}
        onClose={() => setIsPhotoModalOpen(false)}
        isOpen={isPhotoModalOpen}
        onSync={handleGallerySync}
      />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <motion.div className="p-4 bg-white text-gray-800 rounded-xl flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-12 h-12 border-4 border-t-[#00A699] border-slate-200 rounded-full"
              />
              <span className="text-sm font-medium">
                {isEditMode ? "Loading place details..." : "Preparing place registration..."}
              </span>
          </motion.div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* HEADER ACTIONS */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {isEditMode ? "Update Place" : "Register Place"}
              </h1>
              <p className="text-[10px] font-bold text-[#00A699] uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} />{" "}
                {isEditMode
                  ? "Edit and update the place details"
                  : "Fill in the details to add a new place"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-3 px-10 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-[#008f84] transition-all active:scale-95"
          >
            <Save size={18} /> {isEditMode ? "Update Changes" : "Save Place"}
          </button>
        </div>
        {/* Body Actions Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: IMAGE & MEDIA COMMAND SECTION (5 Columns) */}
          <section className="lg:col-span-5 p-6 rounded-xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
            {/* Preview Matrix */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.2em]">
                   Place Image Preview
                </span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                </div>
              </div>

              <NodeCoverImage src={forms.coverImage} alt={forms.name} />
              <NodeGalleryStack images={forms.images} />
            </div>

            {/* Primary Link Input */}
            <motion.div className="space-y-2">
              <label
                htmlFor="coverImage"
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
              >
                COVER IMAGE URL
              </label>

              <div className="relative group">
                <input
                  id="coverImage"
                  type="text"
                  value={forms.coverImage}
                  onChange={(e) =>
                    handleInputChange(
                      "coverImage",
                      formatGoogleDriveUrl(e.target.value),
                    )
                  }
                  placeholder="Enter Drive ID or URL..."
                  className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent 
                  text-xs font-bold text-slate-700 transition-all duration-300
                  placeholder:text-slate-300 focus:bg-white focus:border-[#00A699] outline-none"
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00A699] transition-colors">
                  <Link size={16} />
                </div>
              </div>
            </motion.div>

            {/* Secondary Asset Action */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsPhotoModalOpen(true)}
              className="mt-6 w-full flex items-center justify-center gap-3 py-4 rounded-2xl 
               bg-black text-white font-black text-xs uppercase tracking-widest
              ">
              <ImageIcon size={18} /> Manage Gallery Stack
            </motion.button>
          </section>

          {/* RIGHT: CONFIGURATION & INTELLIGENCE SECTION (7 Columns) */}
          <section className="lg:col-span-7 p-8 rounded-xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-teal-50 text-[#00A699] rounded-2xl">
                <Globe size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    Place Configuration
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    Define the identity, categorization, and overview of the place
                </p>
              </div>
            </div>

            {/* Add your form inputs (Name, Category, Editor) here following the same input style */}
            <div className="space-y-6">
              {/* Example Input for the form section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Place Name
                  </label>
                  <input
                    type="text"
                    onChange={(e)=>handleInputChange("name", e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-bold text-xs"
                    placeholder="Place Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                   Place Category 
                  </label>
                  <select onChange={(e)=>handleInputChange("category" , e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-black text-[10px] uppercase">
                    {CategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4 px-3 py-2 w-fit bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest ${forms.isPopular ? "text-orange-500" : "text-slate-400"}`}
                  >
                  {forms.isPopular ? "Popular" : "Not Popular"}
                  </span>
                  <button
                    onClick={() =>
                     setForms((prev) => ({ ...prev, isPopular: !prev.isPopular }))
                  }
                  className={`w-12 h-6 rounded-full transition-all relative ${forms.isPopular ? "bg-orange-500" : "bg-slate-300"}`}
                  >
                  <motion.div
                  animate={{ x: forms.isPopular ? 24 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                        />
                  </button>
                </div>
              </div>
              <TextEditor
                title="Briefing & Overview"
                value={forms.overview}
                onChange={(e) =>
                handleInputChange("overview", e.target.value)
              }
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AddPlaces;

const NodeCoverImage = ({ src, alt }) => {
  return (
    <div className="relative aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden group">
      <AnimatePresence mode="wait">
        {src ? (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Subtle Admin Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3"
          >
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <ImageIcon size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              No Cover Image Set Yet
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Matrix Corner */}
      <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-white/40 group-hover:border-[#00A699] transition-colors" />
    </div>
  );
};

const NodeGalleryStack = ({ images = [] }) => {
  return (
    <div className="grid grid-cols-4 gap-3 mt-6">
      {images.length > 0
        ? images.slice(0, 4).map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm"
            >
              <img
                src={img}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                alt={`Gallery ${idx}`}
                referrerPolicy="no-referrer"
              />
              {/* Show count overlay on last image if more exist */}
              {idx === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white">
                  <span className="text-xs font-black">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </motion.div>
          ))
        : // Empty Slot Placeholders
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center text-slate-200"
            >
              <Plus size={14} />
            </div>
          ))}
    </div>
  );
};
