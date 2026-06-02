import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  ChevronLeft,
  Globe,
  Plus,
  Zap,
  Clock,
  Ticket,
  MapPin,
  X,
  Search,
  Check,
  Compass,
  Shuffle,
  Lightbulb,
} from "lucide-react";
import { useTransportStore } from "../../../store/useTransportStore"; 
import { usePlaceStore } from "../../../store/usePlaceStore"; 
import toast from "react-hot-toast";

const ModeOptions = [
  { value: "bus", label: "Local Bus Service" },
  { value: "metro", label: "Metro Rail Network" },
  { value: "train", label: "Intercity Train Link" },
  { value: "cab", label: "App-Based Cab Fleet" },
  { value: "autorickshaw", label: "Auto Rickshaw" },
  { value: "ferry", label: "Coastal Ferry/Cruise" },
];

const CoverageOptions = [
  { value: "city-wide", label: "City-Wide Network" },
  { value: "inter-city", label: "Inter-City Connector" },
  { value: "localized-only", label: "Localized-Only Route" },
];

const AddTransport = () => {
  const { cityId, id:transportId, cityName, stateName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(transportId || location.pathname.includes("edit"));


  const { createTransport, updateTransport, fetchTransportById, currentTransport, isLoading } = useTransportStore();
  const { places: allPlaces, fetchPlacesByCity } = usePlaceStore();

  const [routeInput, setRouteInput] = useState("");
  const [tipInput, setTipInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [placeQuery, setPlaceQuery] = useState("");

  const [forms, setForms] = useState({
    mode: "bus",
    cityId: cityId || "",
    cityName: cityName || "",
    connectedPlaces: [],
    providerName: "",
    routes: [],
    timings: "6:00 AM - 10:00 PM",
    frequency: "",
    estimatedCost: "Varies",
    coverage: "city-wide",
    tips: [],
  });

  // Hydrate localized attractions for selection
  useEffect(() => {
    if (cityId) {
      fetchPlacesByCity(cityId);
    }
  }, [cityId, fetchPlacesByCity]);

  // Load configuration details if editing
  useEffect(() => {
    if (isEditMode && transportId) {
      fetchTransportById(transportId);
    }
  }, [isEditMode, transportId, fetchTransportById]);

  useEffect(() => {
    if (isEditMode && currentTransport && currentTransport._id === transportId) {
      setForms({
        mode: currentTransport.mode || "bus",
        cityId: currentTransport.cityId?._id || currentTransport.cityId || cityId || "",
        cityName: currentTransport.cityName || cityName || "",
        connectedPlaces: currentTransport.connectedPlaces?.map((p) => p._id || p) || [],
        providerName: currentTransport.providerName || "",
        routes: currentTransport.routes || [],
        timings: currentTransport.timings || "6:00 AM - 10:00 PM",
        frequency: currentTransport.frequency || "",
        estimatedCost: currentTransport.estimatedCost || "Varies",
        coverage: currentTransport.coverage || "city-wide",
        tips: currentTransport.tips || [],
      });
    }
  }, [currentTransport, isEditMode, transportId, cityId, cityName]);

  const handleInputChange = (field, value) => {
    setForms((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRouteStop = (e) => {
    e.preventDefault();
    if (!routeInput.trim()) return;
    if (forms.routes.includes(routeInput.trim())) return toast.error("Stop segment already exists");
    setForms((prev) => ({ ...prev, routes: [...prev.routes, routeInput.trim()] }));
    setRouteInput("");
  };

  const handleRemoveRouteStop = (index) => {
    setForms((prev) => ({ ...prev, routes: prev.routes.filter((_, i) => i !== index) }));
  };

  const handleAddTip = (e) => {
    e.preventDefault();
    if (!tipInput.trim()) return;
    if (forms.tips.includes(tipInput.trim())) return toast.error("Tip already added");
    setForms((prev) => ({ ...prev, tips: [...prev.tips, tipInput.trim()] }));
    setTipInput("");
  };

  const handleRemoveTip = (index) => {
    setForms((prev) => ({ ...prev, tips: prev.tips.filter((_, i) => i !== index) }));
  };

  const handleSelectPlace = (id) => {
    if (forms.connectedPlaces.includes(id)) {
      setForms((prev) => ({ ...prev, connectedPlaces: prev.connectedPlaces.filter((pId) => pId !== id) }));
    } else {
      setForms((prev) => ({ ...prev, connectedPlaces: [...prev.connectedPlaces, id] }));
    }
  };

  const masterPlacesSource = allPlaces?.length > 0 ? allPlaces : [];
  const filteredPlaces = masterPlacesSource.filter((place) =>
    place.name.toLowerCase().includes(placeQuery.toLowerCase()) ||
    place.cityName.toLowerCase().includes(placeQuery.toLowerCase())
  );

  const handleSave = async () => {
    if (!forms.mode) return toast.error("Mode of transport is required");
    if (!forms.providerName.trim()) return toast.error("Service provider name or agency is required");
    if (forms.routes.length === 0) return toast.error("At least one primary route stop description is required");
    if (!forms.timings.trim()) return toast.error("Operating hours/timings are required");
    if (!forms.estimatedCost.trim()) return toast.error("An approximate fare structure description is required");

    try {
      if (isEditMode) {
        await updateTransport(transportId, forms);
        toast.success("Transit system adjustments synchronized successfully");
      } else {
        await createTransport(stateName, cityName, cityId, forms);
        toast.success("Transit network operator deployed successfully");
      }
      navigate(-1);
    } catch (err) {
      toast.error(err.message || "Operation processing block exception thrown");
    }
  };

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans p-2">
      {isLoading && <LoadingOverlay isEditMode={isEditMode} />}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* --- DYNAMIC UTILITY PANEL CONTROLS --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-xs">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                {isEditMode ? "Update Route" : "Add Transports"}
              </h1>
              <p className="text-[10px] font-black text-[#00A699] uppercase tracking-widest flex items-center gap-2 mt-0.5">
                <Compass size={12} /> {cityName || forms.cityName || "Select City"} Logistics Node
              </p>
            </div>
          </div>
          <button onClick={handleSave} className="flex items-center justify-center gap-3 px-10 py-4 bg-[#00A699] hover:bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md shadow-[#00A699]/10 transition-all active:scale-95 w-full sm:w-auto">
            <Save size={18} /> {isEditMode ? "Update Transport" : "Publish Transport"}
          </button>
        </div>

        {/* --- DESIGN LAYOUT FRAME WORKSPACE GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR PANEL: STICKY ENUM CRITERIA CONTROLS */}
          <section className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="p-6 rounded-xl border border-slate-100 bg-white shadow-xs space-y-5">
              <span className="text-[10px] font-black text-[#00A699] uppercase tracking-[0.2em] block ml-1">Classification Core</span>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Mode of Transport *</label>
                <select
                  value={forms.mode}
                  onChange={(e) => handleInputChange("mode", e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-black text-[10px] tracking-wider uppercase text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  {ModeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Operational Coverage *</label>
                <select
                  value={forms.coverage}
                  onChange={(e) => handleInputChange("coverage", e.target.value)}
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-black text-[10px] tracking-wider uppercase text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  {CoverageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* RIGHT PANELS: FIELD SET MATRICES */}
          <section className="lg:col-span-7 p-6 sm:p-8 rounded-xl border border-slate-100 bg-white shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-teal-50 text-[#00A699] rounded-2xl"><Shuffle size={20} /></div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Route Identity Specifications</h2>
            </div>

            <InputBase label="Service Provider Name / Corporate Agency Name *" value={forms.providerName} onChange={(val) => handleInputChange("providerName", val)} placeholder="e.g. Delhi Metro Rail Corporation (DMRC), Uber Transit" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputBase label="Operating Hours (Timings) *" icon={<Clock size={14} />} value={forms.timings} onChange={(val) => handleInputChange("timings", val)} placeholder="e.g. 6:00 AM - 10:00 PM" />
              <InputBase label="Approximate Fare Structure Cost *" icon={<Ticket size={14} />} value={forms.estimatedCost} onChange={(val) => handleInputChange("estimatedCost", val)} placeholder="e.g. ₹10 Base fare or $2.50 per Zone" />
            </div>

            <InputBase label="Transit Frequency Pattern" value={forms.frequency} onChange={(val) => handleInputChange("frequency", val)} placeholder="e.g. Every 10 minutes, or Twice Daily schedules..." />

            {/* ATOMIC ARRAY STRING LINK MANAGER: ROUTES SCHEMA REFERENCE */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/70 shadow-2xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Key Stations & Route Terminals Array *</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={routeInput}
                  onChange={(e) => setRouteInput(e.target.value)}
                  placeholder="Type stop name parameter (e.g. Terminal 2 West Hub)..."
                  className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-slate-700 focus:border-[#00A699] transition-all"
                />
                <button type="button" onClick={handleAddRouteStop} className="px-5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"><Plus size={16} /></button>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                {forms.routes.map((stop, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-3xs">
                    <span className="truncate flex items-center gap-2"><MapPin size={12} className="text-[#00A699]" /> Route Station {idx + 1}: {stop}</span>
                    <button type="button" onClick={() => handleRemoveRouteStop(idx)} className="text-slate-400 hover:text-red-500 transition-colors p-0.5"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SCHEMA CONNECTEDPLACES INTERACTIVE ARRAY SEARCH CONNECTOR --- */}
            <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/70 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Accessible Connected Places References</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block ml-1 mt-0.5">Link specific historical monument nodes tied directly to this route path</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-200 hover:border-[#00A699] text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Search size={12} className="text-[#00A699]" />
                  {isSearchOpen ? "Hide Console" : "Find Attractions"}
                </button>
              </div>

              {/* Drawer Finder Dropdown Overlay Console Layout */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-3 bg-white border border-slate-200 p-3 rounded-xl"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input
                        type="text"
                        value={placeQuery}
                        onChange={(e) => setPlaceQuery(e.target.value)}
                        placeholder="Type attraction moniker keywords (e.g. 'Hawa', 'Fort')..."
                        className="w-full p-2.5 pl-9 bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg focus:outline-none focus:border-[#00A699] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="max-h-44 overflow-y-auto space-y-1 pr-1 border-t border-slate-100 pt-2 custom-scrollbar">
                      {filteredPlaces.length > 0 ? (
                        filteredPlaces.map((place) => {
                          const isSelected = forms.connectedPlaces.includes(place._id);
                          return (
                            <div
                              key={place._id}
                              onClick={() => handleSelectPlace(place._id)}
                              className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer border transition-all ${
                                isSelected ? "bg-teal-50/60 border-teal-100 text-teal-900 font-black" : "bg-slate-50/40 hover:bg-slate-50 border-transparent"
                              }`}
                            >
                              <div className="min-w-0">
                                <span className="block text-xs font-black text-slate-800 uppercase tracking-tight truncate">{place.name}</span>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">{place.cityName} • {place.category}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                                isSelected ? "bg-[#00A699] border-[#00A699] text-white" : "border-slate-300 text-transparent"
                              }`}>
                                <Check size={12} strokeWidth={3} />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No target records match input filter keys.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Metadata Selection Drawer */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Currently Bound Mongoose references array ({forms.connectedPlaces.length})</span>
                {forms.connectedPlaces.length > 0 ? (
                  forms.connectedPlaces.map((selectedId) => {
                    const placeDetails = masterPlacesSource.find((p) => p._id === selectedId);
                    return (
                      <div key={selectedId} className="flex items-center justify-between bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 shadow-3xs hover:border-slate-300 transition-colors">
                        <div className="min-w-0 flex items-center gap-2">
                          <Compass size={12} className="text-[#00A699] shrink-0" />
                          <span className="truncate uppercase text-slate-800 font-black tracking-tight">{placeDetails?.name || selectedId}</span>
                        </div>
                        <button type="button" onClick={() => handleSelectPlace(selectedId)} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center py-5 border border-dashed border-slate-200 rounded-xl bg-white/50 shadow-3xs">No system location nodes explicitly bound.</div>
                )}
              </div>
            </div>

            {/* ATOMIC ARRAY STRING LINK MANAGER: TIPS MODEL DATA ENTRY */}
            <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-2xs">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Commuter Guidelines & Smart Guidelines (Tips)</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tipInput}
                  onChange={(e) => setTipInput(e.target.value)}
                  placeholder="e.g. Avoid transit between 5:00 PM to 7:00 PM peak timelines..."
                  className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-slate-700 focus:border-[#00A699] transition-all"
                />
                <button type="button" onClick={handleAddTip} className="px-5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"><Plus size={16} /></button>
              </div>
              <div className="space-y-2 pt-1">
                {forms.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start justify-between bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-600 shadow-3xs">
                    <span className="pr-4 flex gap-2"><Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" /> {tip}</span>
                    <button type="button" onClick={() => handleRemoveTip(idx)} className="text-slate-400 hover:text-red-500 transition-colors p-0.5"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const InputBase = ({ label, value, onChange, placeholder, icon, type = "text" }) => (
  <div className="space-y-2 w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 pr-12 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#00A699] focus:bg-white outline-none font-bold text-xs text-slate-700 transition-all placeholder:text-slate-400 shadow-2xs"
        placeholder={placeholder}
      />
      {icon && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
    </div>
  </div>
);

const LoadingOverlay = ({ isEditMode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/10 backdrop-blur-xs">
    <div className="p-8 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-t-[#00A699] border-slate-100 rounded-full animate-spin" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-900">
        {isEditMode ? "Syncing Network Route..." : "Deploying Transit Node Line..."}
      </span>
    </div>
  </div>
);

export default AddTransport;