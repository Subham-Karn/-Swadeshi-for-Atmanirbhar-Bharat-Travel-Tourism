import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  DollarSign,
  Star,
  Phone,
  X,
  Search,
  Check,
  Layers,
  IndianRupee,
} from "lucide-react";
import { useHotelStore } from "../../../store/useHotelsStore";
import { usePlaceStore } from "../../../store/usePlaceStore";
import MultiPhotoModal from "../../modals/MultiPhotoModal";
import toast from "react-hot-toast";

const TierOptions = [
  { value: "budget", label: "Budget" },
  { value: "mid-range", label: "Mid-Range" },
  { value: "luxury", label: "Luxury" },
  { value: "premium-luxury", label: "Premium Luxury" },
];

const AddHotels = () => {
  const { cityId, id:hotelId, cityName, stateName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = Boolean(hotelId || location.pathname.includes("edit"));
  const { createHotel, updateHotel, fetchHotelById, currentHotel, isLoading } =
    useHotelStore();
  const {
    places: allPlaces,
    fetchAllPlaces,
    fetchPlacesByCity,
  } = usePlaceStore();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [forms, setForms] = useState({
    name: "",
    cityId: cityId || "",
    cityName: cityName || "",
    location: "",
    description: "",
    tier: "mid-range",
    amenities: [],
    pricePerNight: "",
    rating: 4.0,
    coverImage: "",
    images: [],
    contactNumber: "",
    bookingLink: "",
    isFeatured: false,
    nearbyPlaces: [],
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");

  useEffect(() => {
    if (cityId) fetchPlacesByCity(cityId);
  }, [fetchPlacesByCity]);

  useEffect(() => {
    if (isEditMode && hotelId) {
      fetchHotelById(hotelId);
    }
  }, [isEditMode, hotelId, fetchHotelById]);

  useEffect(() => {
    if (isEditMode && currentHotel && currentHotel._id === hotelId) {
      setForms({
        name: currentHotel.name || "",
        cityId: currentHotel.cityId?._id || currentHotel.cityId || cityId || "",
        cityName: currentHotel.cityName || cityName || "",
        location: currentHotel.location || "",
        description: currentHotel.description || "",
        tier: currentHotel.tier || "mid-range",
        amenities: currentHotel.amenities || [],
        pricePerNight: currentHotel.pricePerNight || "",
        rating: currentHotel.rating || 4.0,
        coverImage: currentHotel.coverImage || "",
        images: currentHotel.images || [],
        contactNumber: currentHotel.contactNumber || "",
        bookingLink: currentHotel.bookingLink || "",
        isFeatured: currentHotel.isFeatured || false,
        nearbyPlaces: currentHotel.nearbyPlaces?.map((p) => p._id || p) || [],
      });
    }
  }, [currentHotel, isEditMode, hotelId, cityId, cityName]);

  const handleInputChange = (field, value) => {
    setForms((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoverImageChange = (url) => {
    setForms((prev) => {
      const cleanedGallery = prev.images.filter(
        (img) => img !== prev.coverImage && img !== url,
      );
      return {
        ...prev,
        coverImage: url,
        images: url ? [url, ...cleanedGallery] : cleanedGallery,
      };
    });
  };

  const handleAddAmenity = (e) => {
    e.preventDefault();
    if (!amenityInput.trim()) return;
    if (forms.amenities.includes(amenityInput.trim()))
      return toast.error("Amenity already added");
    setForms((prev) => ({
      ...prev,
      amenities: [...prev.amenities, amenityInput.trim()],
    }));
    setAmenityInput("");
  };

  const handleRemoveAmenity = (index) => {
    setForms((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSelectPlace = (id) => {
    if (forms.nearbyPlaces.includes(id)) {
      setForms((prev) => ({
        ...prev,
        nearbyPlaces: prev.nearbyPlaces.filter((pId) => pId !== id),
      }));
    } else {
      setForms((prev) => ({
        ...prev,
        nearbyPlaces: [...prev.nearbyPlaces, id],
      }));
    }
  };

  const masterPlacesSource = allPlaces?.length > 0 ? allPlaces : [];
  const filteredPlaces = masterPlacesSource.filter(
    (place) =>
      place.name.toLowerCase().includes(placeQuery.toLowerCase()) ||
      place.cityName.toLowerCase().includes(placeQuery.toLowerCase()),
  );

  const handleSave = async () => {
    if (!forms.name.trim()) return toast.error("Hotel name is required");
    if (!forms.location.trim())
      return toast.error("Physical location address is required");
    if (!forms.pricePerNight || Number(forms.pricePerNight) <= 0)
      return toast.error("Valid price calculation required");
    if (!forms.coverImage.trim())
      return toast.error("Primary cover image URL is mandatory");

    try {
      if (isEditMode) {
        await updateHotel(hotelId, forms);
        toast.success("Hotel changes successfully");
      } else {
        await createHotel(stateName, cityName, cityId, forms);
        toast.success("Hotel added successfully");
      }
      navigate(-1);
    } catch (err) {
      toast.error(
        err.message || "Operation processing execution block anomaly",
      );
    }
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans p-2">
      {isLoading && <LoadingOverlay isEditMode={isEditMode} />}
      <MultiPhotoModal
       isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={forms.images}
        onSync={(image) => handleInputChange("images", image)}
      />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- HEADER CONTROLS --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-xs"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {isEditMode ? "Update Hotels" : "Register Hotel"}
              </h1>
              <p className="text-[10px] font-black text-[#00A699] uppercase tracking-widest flex items-center gap-2 mt-0.5">
                {cityName || forms.cityName || "Jaipur"} Add Hotels
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-3 px-10 py-4 bg-[#00A699] hover:bg-[#008f84] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md shadow-[#00A699]/10 transition-all active:scale-95 w-full sm:w-auto"
          >
            <Save size={18} /> {isEditMode ? "Update Changes" : "Publish Hotel"}
          </button>
        </div>

        {/* --- MAIN INTERFACE WORKSPACE GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: STICKY MEDIA WORKSPACE */}
          <section className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="p-6 rounded-xl border border-slate-100 bg-white shadow-xs space-y-4">
              <span className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.2em] block ml-1">
                Media Asset Core
              </span>

              <div className="relative aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center shadow-2xs">
                {forms.coverImage ? (
                  <img
                    src={forms.coverImage}
                    className="w-full h-full object-cover"
                    alt="Hotel core backdrop preview"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center text-slate-300 space-y-2">
                    <ImageIcon
                      size={32}
                      strokeWidth={1.5}
                      className="mx-auto text-slate-200"
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest block">
                      Awaiting Image Payload URL
                    </span>
                  </div>
                )}
              </div>
              <InputBase
                label="Primary Cover Image Link *"
                icon={<Link size={14} />}
                value={forms.coverImage}
                onChange={handleCoverImageChange}
                placeholder="Paste raw asset link url..."
              />
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all"
              >
                <Layers size={18} /> Edit Gallery Stack
              </button>
            </div>
          </section>

          {/* RIGHT SIDEBAR: SCROLLABLE DATA FIELD CANVAS */}
          <section className="lg:col-span-7 p-6 sm:p-8 rounded-xl border border-slate-100 bg-white shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-teal-50 text-[#00A699] rounded-2xl">
                <Globe size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                Specification Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputBase
                label="Hotel Identity Name *"
                value={forms.name}
                onChange={(val) => handleInputChange("name", val)}
                placeholder="e.g. Radisson Blu Luxury Stay"
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                  Luxury Tier Type *
                </label>
                <select
                  value={forms.tier}
                  onChange={(e) => handleInputChange("tier", e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-black text-[10px] tracking-wider uppercase text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  {TierOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <InputBase
                label="Estimated Price Per Night ($) *"
                icon={<IndianRupee size={14} />}
                type="number"
                value={forms.pricePerNight}
                onChange={(val) => handleInputChange("pricePerNight", val)}
                placeholder="e.g. 150"
              />
              <InputBase
                label="Operator Star Rating (0 - 5)"
                icon={<Star size={14} />}
                type="number"
                value={forms.rating}
                onChange={(val) => handleInputChange("rating", val)}
                placeholder="e.g. 4.5"
              />
            </div>

            <InputBase
              label="Physical Address / Coordinates *"
              icon={<MapPin size={14} />}
              value={forms.location}
              onChange={(val) => handleInputChange("location", val)}
              placeholder="Exact street, area, landmark configurations..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputBase
                label="Desk Contact Line"
                icon={<Phone size={14} />}
                value={forms.contactNumber}
                onChange={(val) => handleInputChange("contactNumber", val)}
                placeholder="e.g. +91 22 4192 8800"
              />
              <InputBase
                label="Direct External Booking URL Link"
                icon={<Link size={14} />}
                value={forms.bookingLink}
                onChange={(val) => handleInputChange("bookingLink", val)}
                placeholder="e.g. URL routing links..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                Accommodation Overview Description *
              </label>
              <textarea
                value={forms.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Detail room specifications, reservation parameters, and checking-in guidelines..."
                className="w-full h-28 p-4 bg-slate-50 border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-bold text-xs text-slate-700 rounded-2xl transition-all resize-none shadow-2xs"
              />
            </div>

            {/* Amenities Section */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/70 shadow-2xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
                Amenity Feature Tags
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="e.g. Infinity Pool, Free Breakfast"
                  className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-slate-700 focus:border-[#00A699] transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {forms.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 pl-2.5 pr-1.5 py-1 rounded-lg shadow-3xs"
                  >
                    {item}{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(idx)}
                      className="text-slate-400 hover:text-red-500 p-0.5 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Searchable Places System Section */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/70 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">
                    Nearby Attractions Linkage
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block ml-1 mt-0.5">
                    Toggle lookup container grid to bind target assets
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 hover:border-[#00A699] text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Search size={12} className="text-[#00A699]" />
                  {isSearchOpen ? "Hide Finder Console" : "Find Attractions"}
                </button>
              </div>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-3 bg-white border border-slate-200 p-3 rounded-xl"
                  >
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={14}
                      />
                      <input
                        type="text"
                        value={placeQuery}
                        onChange={(e) => setPlaceQuery(e.target.value)}
                        placeholder="Filter database landmarks..."
                        className="w-full p-2.5 pl-9 bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:border-[#00A699] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="max-h-44 overflow-y-auto space-y-1 pr-1 border-t border-slate-100 pt-2 custom-scrollbar">
                      {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => {
                          const isSelected = forms.nearbyPlaces.includes(
                            place._id,
                          );
                          return (
                            <div
                              key={place._id}
                              onClick={() => handleSelectPlace(place._id)}
                              className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer border transition-all ${
                                isSelected
                                  ? "bg-teal-50/60 border-teal-100 text-teal-900"
                                  : "bg-slate-50/40 hover:bg-slate-50 border-transparent"
                              }`}
                            >
                              <div className="min-w-0">
                                <span className="block text-xs font-black text-slate-800 uppercase tracking-tight truncate">
                                  {place.name}
                                </span>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">
                                  {place.cityName} • {place.category}
                                </span>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                                  isSelected
                                    ? "bg-[#00A699] border-[#00A699] text-white"
                                    : "border-slate-300 text-transparent"
                                }`}
                              >
                                <Check size={12} strokeWidth={3} />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          No matching attractions located.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Verification UI */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                  Linked Reference Pins ({forms.nearbyPlaces.length})
                </span>
                {forms.nearbyPlaces.length > 0 ? (
                  forms.nearbyPlaces.map((selectedId) => {
                    const placeDetails = masterPlacesSource.find(
                      (p) => p._id === selectedId,
                    );
                    return (
                      <div
                        key={selectedId}
                        className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-3xs hover:border-slate-300 transition-colors"
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <MapPin
                            size={12}
                            className="text-[#00A699] shrink-0"
                          />
                          <span className="truncate uppercase text-slate-800 font-black tracking-tight">
                            {placeDetails?.name || selectedId}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectPlace(selectedId)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center py-5 border border-dashed border-slate-200 rounded-xl bg-white/50 shadow-3xs">
                    No attractions selected.
                  </div>
                )}
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-2xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  Featured Spotlight Flag
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Promote hotel profile inside parent dashboard sliders
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleInputChange("isFeatured", !forms.isFeatured)
                }
                className={`w-12 h-6 rounded-full transition-all relative outline-none shrink-0 ${forms.isFeatured ? "bg-[#00A699]" : "bg-slate-300"}`}
              >
                <motion.div
                  animate={{ x: forms.isFeatured ? 26 : 4 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const InputBase = ({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}) => (
  <div className="space-y-2 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 pr-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-bold text-xs text-slate-700 transition-all placeholder:text-slate-400 shadow-2xs"
        placeholder={placeholder}
      />
      {icon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>
      )}
    </div>
  </div>
);

const LoadingOverlay = ({ isEditMode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-xs">
    <div className="p-8 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-t-[#00A699] border-slate-100 rounded-full animate-spin" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-900">
        {isEditMode ? "Syncing Parameters..." : "Registering Hotel Profile..."}
      </span>
    </div>
  </div>
);

export default AddHotels;
