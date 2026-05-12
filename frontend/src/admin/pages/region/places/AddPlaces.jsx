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
} from "lucide-react";
import { usePlaceStore } from "../../../../store/usePlaceStore";
import TextEditor from "../../../components/TextEditor";
import { formatGoogleDriveUrl } from "../../../../util/formatGoogleDriveUrl";
import MultiPhotoModal from "../../../modals/MultiPhotoModal";
import toast from "react-hot-toast";

// Aligned with your Schema Enum (lowercase values as per schema)
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

  // Updated State to match Mongoose Schema
  const [forms, setForms] = useState({
    name: "",
    cityId: cityId || "",
    cityName: cityName || "",
    category: "heritage",
    location: "", // Added
    images: [],
    coverImage: "",
    overview: "",
    entryFee: "Free", // Added
    timings: "09:00 AM - 06:00 PM", // Added
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
              cityId: place.cityId || "",
              cityName: place.cityName || "",
              images: place.images || [],
              coverImage: place.coverImage || "",
              category: place.category || "heritage",
              overview: place.overview || "",
              location: place.location || "",
              entryFee: place.entryFee || "Free",
              timings: place.timings || "09:00 AM - 06:00 PM",
              isPopular: place.isPopular || false,
            });
          }
        } catch (error) {
          toast.error("Failed to load details");
        }
      };
      loadPlaceDetails();
    }
  }, [isEditMode, placeId, fetchPlaceById]);

  const handleInputChange = (field, value) => {
    setForms((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Basic frontend validation
    if (!forms.name || !forms.location || !forms.overview) {
      return toast.error("Please fill in all required fields");
    }

    try {
      if (isEditMode) {
        await updatePlace(placeId, forms);
      } else {
        await addPlace(forms);
      }
      toast.success(`Place ${isEditMode ? "updated" : "created"} successfully`);
      navigate(`/admin/regions/${stateName}/${forms.cityName}/${forms.cityId}/places`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save place");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] font-sans p-6">
      <MultiPhotoModal
        images={forms.images}
        onClose={() => setIsPhotoModalOpen(false)}
        isOpen={isPhotoModalOpen}
        onSync={(links) => handleInputChange("images", links)}
      />

      {isLoading && <LoadingOverlay isEditMode={isEditMode} />}

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {isEditMode ? "Update Node" : "Create Node"}
              </h1>
              <p className="text-[10px] font-bold text-[#00A699] uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} /> {cityName} / {stateName}
              </p>
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-3 px-10 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#008f84] transition-all">
            <Save size={18} /> {isEditMode ? "Update Changes" : "Save Place"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: MEDIA */}
          <section className="lg:col-span-5 p-6 rounded-xl border border-slate-100 bg-white shadow-xl">
            <div className="space-y-4 mb-8">
              <span className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.2em]">Asset Matrix</span>
              <NodeCoverImage src={forms.coverImage} alt={forms.name} />
              <NodeGalleryStack images={forms.images} />
            </div>

            <div className="space-y-4">
              <InputLink 
                label="Cover Image URL" 
                value={forms.coverImage} 
                onChange={(val) => handleInputChange("coverImage", formatGoogleDriveUrl(val))} 
              />
              <button onClick={() => setIsPhotoModalOpen(true)} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest">
                <ImageIcon size={18} /> Manage Gallery Stack
              </button>
            </div>
          </section>

          {/* RIGHT: CONFIGURATION */}
          <section className="lg:col-span-7 p-8 rounded-xl border border-slate-100 bg-white shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-teal-50 text-[#00A699] rounded-2xl"><Globe size={22} /></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBase label="Place Name" value={forms.name} onChange={(val) => handleInputChange("name", val)} placeholder="e.g. Amer Fort" />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={forms.category} 
                    onChange={(e) => handleInputChange("category", e.target.value)} 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] outline-none font-black text-[10px] uppercase"
                  >
                    {CategoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Location (Required by Schema) */}
              <InputBase 
                label="Physical Location" 
                icon={<MapPin size={16}/>} 
                value={forms.location} 
                onChange={(val) => handleInputChange("location", val)} 
                placeholder="Full address or area..." 
              />

              {/* Row 3: Logistics (Fee & Timings) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputBase label="Entry Fee" icon={<Ticket size={16}/>} value={forms.entryFee} onChange={(val) => handleInputChange("entryFee", val)} placeholder="e.g. ₹200 or Free" />
                <InputBase label="Timings" icon={<Clock size={16}/>} value={forms.timings} onChange={(val) => handleInputChange("timings", val)} placeholder="09:00 AM - 06:00 PM" />
              </div>

              {/* Toggle: Popular */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Featured Status</span>
                    <span className="text-[9px] font-bold text-slate-400">Toggle for Hero Grid layout</span>
                </div>
                <button
                  onClick={() => handleInputChange("isPopular", !forms.isPopular)}
                  className={`w-12 h-6 rounded-full transition-all relative ${forms.isPopular ? "bg-orange-500" : "bg-slate-300"}`}
                >
                  <motion.div animate={{ x: forms.isPopular ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                </button>
              </div>

              <TextEditor title="Overview Documentation" value={forms.overview} onChange={(e) => handleInputChange("overview", e.target.value)} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* Helper Components to keep code clean */
const InputBase = ({ label, value, onChange, placeholder, icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 pl-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-bold text-xs"
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
        placeholder="Enter Drive ID or URL..."
        className="w-full px-5 py-4 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent text-xs font-bold text-slate-700 transition-all focus:bg-white focus:border-[#00A699] outline-none"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00A699]"><Link size={16} /></div>
    </div>
  </div>
);

const LoadingOverlay = ({ isEditMode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <motion.div className="p-8 bg-white rounded-3xl shadow-2xl flex flex-col items-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-t-[#00A699] border-slate-100 rounded-full" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-900">
        {isEditMode ? "Syncing Details..." : "Registering Node..."}
      </span>
    </motion.div>
  </div>
);

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
