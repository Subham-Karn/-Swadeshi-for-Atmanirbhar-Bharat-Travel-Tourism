import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ChevronLeft,
  ImageIcon,
  Globe,
  Plus,
  Zap,
  Link,
  MapPin,
  Clock,
  Ticket,
  CalendarDays,
} from "lucide-react";
import { usePlaceStore } from "../../../../store/usePlaceStore";
import { formatGoogleDriveUrl } from "../../../../util/formatGoogleDriveUrl";
import MultiPhotoModal from "../../../modals/MultiPhotoModal";
import toast from "react-hot-toast";
import OverviewInput from "../../../components/OverviewInput";

// Aligned with your Schema Enum precisely (lowercase values as per schema)
const CategoryOptions = [
  { value: "heritage", label: "Heritage" },
  { value: "religious", label: "Religious" },
  { value: "historic", label: "Historic" },
  { value: "nature", label: "Nature" },
  { value: "market", label: "Market" },
  { value: "modern", label: "Modern" },
];

const AddPlaces = () => {
  const { cityId, placeId, cityName, stateName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = Boolean(placeId && location.pathname.includes("edit"));

  const { fetchPlaceById, isLoading, addPlace, updatePlace } = usePlaceStore();

  // Fully updated state to cleanly pair with all Mongoose schema attributes
  const [forms, setForms] = useState({
    name: "",
    location: "",
    cityId: cityId || "",
    cityName: cityName || "",
    category: "heritage",
    overview: "",
    images: [],
    coverImage: "",
    entryFee: "Free",            
    bestTime: "",                
    timings: "9:00 AM - 6:00 PM",
    isPopular: false,
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const loadPlaceDetails = async () => {
        try {
          const place = await fetchPlaceById(placeId);
          if (place) {
            setForms({
              name: place.name || "",
              location: place.location || "",
              cityId: place.cityId || cityId || "",
              cityName: place.cityName || cityName || "",
              category: place.category || "heritage",
              overview: place.overview || "",
              images: place.images || [],
              coverImage: place.coverImage || "",
              entryFee: place.entryFee || "Free",
              bestTime: place.bestTime || "",
              timings: place.timings || "9:00 AM - 6:00 PM",
              isPopular: place.isPopular || false,
            });
          }
        } catch (error) {
          toast.error("Failed to load details");
        }
      };
      loadPlaceDetails();
    }
  }, [isEditMode, placeId, fetchPlaceById, cityId, cityName]);

  const handleInputChange = (field, value) => {
    setForms((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!forms.name.trim()) return toast.error("Place name is required");
    if (!forms.location.trim()) return toast.error("Physical address or exact location is required");
    if (!forms.cityId) return toast.error("Place must be linked to a City ID");
    if (!forms.cityName.trim()) return toast.error("City name is required for quick lookup");
    if (!forms.category) return toast.error("Place type is required");
    if (!forms.overview.trim()) return toast.error("Detailed description/overview is required");
    if (!forms.entryFee.trim()) return toast.error("Entry fee details are required (Use 'Free' if applicable)");
    if (forms.images.length === 0) return toast.error("At least one image is required in the gallery stack");

    try {
      if (isEditMode) {
        await updatePlace(placeId, forms);
      } else {
        await addPlace(forms);
      }
      navigate(`/admin/regions/${stateName?.replace(/\s+/g, "-")}/cities/${forms.cityName?.replace(/\s+/g, "-")}/${cityId}/places`);
    } catch (err) {
      console.error("Error saving document context:", err);
    }
  };

  return (
    <div className="min-h-screen  font-sans">
      <MultiPhotoModal
        images={forms.images}
        onClose={() => setIsPhotoModalOpen(false)}
        isOpen={isPhotoModalOpen}
        onSync={(links) => handleInputChange("images", links)}
      />

      {isLoading && <LoadingOverlay isEditMode={isEditMode} />}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {isEditMode ? "Update Place" : "Create Place"}
              </h1>
              <p className="text-[10px] font-black text-[#00A699] uppercase tracking-widest flex items-center gap-2">
                {forms.cityName || cityName} / {stateName}
              </p>
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-3 px-10 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#008f84] transition-all">
            <Save size={18} /> {isEditMode ? "Update Changes" : "Save Place"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SECTION: MEDIA */}
          <section className="lg:col-span-5 p-6 rounded-3xl border border-slate-100 bg-white shadow-xs">
            <div className="space-y-4 mb-8">
              <span className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.2em]">Add Images</span>
              <NodeCoverImage src={forms.coverImage} alt={forms.name} />
              <NodeGalleryStack images={forms.images} />
            </div>

            <div className="space-y-4">
              <InputLink 
                label="Cover Image URL" 
                value={forms.coverImage} 
                onChange={(val) => handleInputChange("coverImage", formatGoogleDriveUrl(val))} 
              />
              <button onClick={() => setIsPhotoModalOpen(true)} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest transition-colors">
                <ImageIcon size={18} /> Manage Gallery Stack ({forms.images.length})
              </button>
            </div>
          </section>

          {/* RIGHT SECTION: ATOMIC SCHEMA CONFIGURATION */}
          <section className="lg:col-span-7 p-8 rounded-3xl border border-slate-100 bg-white shadow-xs">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-teal-50 text-[#00A699] rounded-2xl"><Globe size={22} /></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Add Place Details</h2>
            </div>

            <div className="space-y-6">
              {/* Core Context Block: Name & Category Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBase label="Place Name *" value={forms.name} onChange={(val) => handleInputChange("name", val)} placeholder="e.g. Amer Fort" />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category Type *</label>
                  <select 
                    value={forms.category} 
                    onChange={(e) => handleInputChange("category", e.target.value)} 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-black text-[10px] tracking-wider uppercase transition-all"
                  >
                    {CategoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Physical Location Input Field (Required by Schema) */}
              <InputBase 
                label="Physical Address / Exact Location *" 
                icon={<MapPin size={16}/>} 
                value={forms.location} 
                onChange={(val) => handleInputChange("location", val)} 
                placeholder="e.g. Devisinghpura, Amer, Jaipur, Rajasthan 302028" 
              />

              {/* Logistics & Timing Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBase label="Entry Fee Details *" icon={<Ticket size={16}/>} value={forms.entryFee} onChange={(val) => handleInputChange("entryFee", val)} placeholder="e.g. Free, ₹50, or $15" />
                <InputBase label="Hours of Operation (Timings)" icon={<Clock size={16}/>} value={forms.timings} onChange={(val) => handleInputChange("timings", val)} placeholder="e.g. 9:00 AM - 6:00 PM" />
              </div>

              {/* Seasonality Configuration: Best Time to Visit */}
              <InputBase 
                label="Best Time to Visit" 
                icon={<CalendarDays size={16}/>} 
                value={forms.bestTime} 
                onChange={(val) => handleInputChange("bestTime", val)} 
                placeholder="e.g. October to March" 
              />

              {/* Feature Banner Toggle Trigger */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Popular / Featured Status</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Toggle to feature on customer hero displays</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInputChange("isPopular", !forms.isPopular)}
                  className={`w-12 h-6 rounded-full transition-all relative outline-none ${forms.isPopular ? "bg-[#00A699]" : "bg-slate-300"}`}
                >
                  <motion.div animate={{ x: forms.isPopular ? 26 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Text Area Summary Controller Wrapper */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Overview / Description *</label>
                <OverviewInput onChange={(e) => handleInputChange("overview", e.target.value)} value={forms.overview} placeholder="Provide descriptive context regarding history, architecture, and visitor parameters..." />
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- HELPER WRAPPER INTERFACE FIELDS ---

const InputBase = ({ label, value, onChange, placeholder, icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 pr-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-bold text-xs text-slate-700 transition-all placeholder:text-slate-400"
        placeholder={placeholder}
      />
      {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
    </div>
  </div>
);

const InputLink = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter Drive ID or raw resource URL..."
        className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent text-xs font-bold text-slate-700 transition-all focus:bg-white focus:border-[#00A699] outline-none placeholder:text-slate-400"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00A699] transition-colors"><Link size={16} /></div>
    </div>
  </div>
);

const LoadingOverlay = ({ isEditMode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
    <motion.div className="p-8 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-t-[#00A699] border-slate-100 rounded-full" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-900">
        {isEditMode ? "Syncing Details..." : "Registering Destination..."}
      </span>
    </motion.div>
  </div>
);

const NodeCoverImage = ({ src, alt }) => {
  return (
    <div className="relative aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden group">
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
            <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-3"
          >
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <ImageIcon size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              No Cover Image Set Yet
            </span>
          </motion.div>
        )}
      </AnimatePresence>
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
              className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-xs"
            >
              <img
                src={img}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all"
                alt={`Gallery segment ${idx}`}
                referrerPolicy="no-referrer"
              />
              {idx === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center text-white">
                  <span className="text-xs font-black">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </motion.div>
          ))
        : [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-300"
            >
              <Plus size={14} />
            </div>
          ))}
    </div>
  );
};

export default AddPlaces;