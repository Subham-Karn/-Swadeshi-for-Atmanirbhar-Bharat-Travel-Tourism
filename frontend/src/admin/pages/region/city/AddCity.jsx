import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  ChevronLeft,
  ImageIcon,
  Globe,
  Plus,
  Zap,
  MapPin,
  Calendar,
  Star,
  Info,
  Link
} from "lucide-react";
import { useRegionsStore } from "../../../../store/useRegionStore";
import TextEditor from "../../../components/TextEditor";
import { formatGoogleDriveUrl } from "../../../../util/formatGoogleDriveUrl";
import MultiPhotoModal from "../../../modals/MultiPhotoModal";
import toast from "react-hot-toast";

const RegionTypeOptions = [
  { value: "North", label: "North India" },
  { value: "South", label: "South India" },
  { value: "East", label: "East India" },
  { value: "West", label: "West India" },
  { value: "Central", label: "Central India" },
  { value: "North-East", label: "North-East India" },
];

const AddCity = () => {
  const { regionId, stateName, cityId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(cityId && location.pathname.includes("edit"));

  const { fetchCityById, addCity, updateCity, isLoading } = useRegionsStore();

  // State aligned with Mongoose Schema
  const [forms, setForms] = useState({
    regionId: regionId || "",
    regionType: "North",
    cityName: "",
    cityImages: [],
    isPopular: false,
    overview: "",
    bestTimeToVisit: "",
    rating: 0,
  });

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const loadCity = async () => {
        const data = await fetchCityById(cityId);
        if (data) setForms(data);
      };
      loadCity();
    }
  }, [isEditMode, cityId, fetchCityById]);

  const handleInputChange = (field, value) => {
    setForms((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!forms.cityName || !forms.overview || forms.cityImages.length === 0) {
      return toast.error("Please fill all required fields and add images");
    }

    try {
      if (isEditMode) {
        await updateCity(cityId, forms);
        toast.success("City node updated");
      } else {
        await addCity(forms);
        toast.success("New city registered");
      }
      navigate(`/admin/regions/${stateName}/${regionId}/cities`);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-6">
      <MultiPhotoModal
        images={forms.cityImages}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onSync={(links) => handleInputChange("cityImages", links)}
      />

      {isLoading && <AdminLoader label={isEditMode ? "Updating City..." : "Creating City..."} />}

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {isEditMode ? "Modify City Node" : "Register New City"}
              </h1>
              <p className="text-[10px] font-bold text-[#00A699] uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} /> Parent State: {stateName}
              </p>
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center gap-3 px-10 py-4 bg-[#00A699] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#008f84] active:scale-95 transition-all">
            <Save size={18} /> {isEditMode ? "Commit Changes" : "Deploy City"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: MEDIA & ASSETS */}
          <section className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
               <span className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.2em] mb-4 block">City Image Gallery</span>
               
               {/* Main Preview */}
               <div className="aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden mb-4 relative group">
                 {forms.cityImages.length > 0 ? (
                   <img src={forms.cityImages[0]} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                     <ImageIcon size={40} strokeWidth={1} />
                     <span className="text-[10px] font-black mt-2 uppercase tracking-widest">No Images Linked</span>
                   </div>
                 )}
               </div>

               {/* Gallery Grid */}
               <div className="grid grid-cols-4 gap-2 mb-6">
                 {forms.cityImages.slice(1, 5).map((img, i) => (
                   <div key={i} className="aspect-square rounded-xl bg-slate-100 overflow-hidden">
                     <img src={img} className="w-full h-full object-cover" alt="thumb" referrerPolicy="no-referrer" />
                   </div>
                 ))}
                 {forms.cityImages.length < 5 && [...Array(Math.max(0, 4 - (forms.cityImages.length - 1)))].map((_, i) => (
                   <div key={i} className="aspect-square rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-200">
                     <Plus size={14} />
                   </div>
                 ))}
               </div>

               <button 
                 onClick={() => setIsPhotoModalOpen(true)}
                 className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all"
               >
                 <Layers size={18} /> Manage Gallery Stack
               </button>
            </div>
          </section>

          {/* RIGHT: CONFIGURATION */}
          <section className="lg:col-span-7 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-[#00A699]/10 text-[#00A699] rounded-2xl"><Globe size={22} /></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Global Parameters</h2>
            </div>

            <div className="space-y-6">
              {/* Row 1: Name & RegionType */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminInput label="City Name" value={forms.cityName} onChange={(val) => handleInputChange("cityName", val)} placeholder="e.g. Jaipur" />
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Region Zone</label>
                  <select 
                    value={forms.regionType} 
                    onChange={(e) => handleInputChange("regionType", e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] outline-none font-black text-[10px] uppercase"
                  >
                    {RegionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Row 2: Best Time & Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AdminInput icon={<Calendar size={16}/>} label="Best Time to Visit" value={forms.bestTimeToVisit} onChange={(val) => handleInputChange("bestTimeToVisit", val)} placeholder="e.g. October to March" />
                <AdminInput icon={<Star size={16}/>} label="Initial Rating" type="number" value={forms.rating} onChange={(val) => handleInputChange("rating", val)} placeholder="0.0 - 5.0" />
              </div>

              {/* Popularity Toggle */}
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Featured Status</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Mark this city as a popular destination</p>
                </div>
                <button
                  onClick={() => handleInputChange("isPopular", !forms.isPopular)}
                  className={`w-12 h-6 rounded-full relative transition-all ${forms.isPopular ? "bg-orange-500" : "bg-slate-300"}`}
                >
                  <motion.div animate={{ x: forms.isPopular ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
              </div>

              {/* Overview */}
              <TextEditor title="City Intelligence/Overview" value={forms.overview} onChange={(e) => handleInputChange("overview", e.target.value)} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* --- SHARED INPUT COMPONENT --- */
const AdminInput = ({ label, value, onChange, placeholder, type = "text", icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-bold text-xs transition-all"
      />
      {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
    </div>
  </div>
);

const AdminLoader = ({ label }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
    <div className="p-8 bg-white rounded-3xl shadow-2xl flex flex-col items-center gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-4 border-t-[#00A699] border-slate-100 rounded-full" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-900">{label}</span>
    </div>
  </div>
);

export default AddCity;