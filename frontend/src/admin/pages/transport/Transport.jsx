import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreVertical,
  MapPin,
  Clock,
  Ticket,
  Shuffle,
  Trash2,
  Edit3,
  Bus,
  Train,
  Navigation,
  Compass,
  Lightbulb,
} from "lucide-react";
import { useTransportStore } from "../../../store/useTransportStore"; 
import toast from "react-hot-toast";

const Transport = () => {
  const { cityId, cityName, stateName } = useParams();
  const navigate = useNavigate();
  const {
    cityTransport,
    isLoading,
    searchQuery,
    selectedMode,
    fetchTransportByCityId,
    setSearchQuery,
    setSelectedMode,
    deleteTransport,
  } = useTransportStore();

  useEffect(() => {
    if (cityName && cityId) {
      fetchTransportByCityId(cityName, cityId);
    }
  }, [stateName, cityName, cityId, fetchTransportByCityId]);

  const handleDeleteRoute = async (id) => {
    if (window.confirm("Are you sure you want to delete this transport line from active operations?")) {
      try {
        await deleteTransport(id);
        toast.success("Transit network configuration purged from live registry");
      } catch (err) {
        toast.error(err.message || "Failed to complete data deletion request");
      }
    }
  };
  const stats = {
    totalLines: cityTransport.length,
    cityWideCount: cityTransport.filter((t) => t.coverage === "city-wide").length,
    activeModes: new Set(cityTransport.map((t) => t.mode)).size,
  };


  const filteredTransit = cityTransport.filter((line) => {
    const matchesSearch =
      line.providerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.routes?.some((stop) => stop.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMode = selectedMode === "all" || line.mode === selectedMode;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="min-h-screen text-slate-800 antialiased font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER REGISTRY CONTROLS --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Transport <span className="text-slate-400 font-normal">Networks</span>
            </h1>
            <p className="text-[#00A699] tracking-wide uppercase text-xs font-black mt-1">
              {cityName || "Active Index"} Transit Mapping Context
            </p>
          </div>
          <button
            onClick={() => navigate("add")}
            className="flex items-center gap-2 bg-[#00A699] hover:bg-primary text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-[#00A699]/10 active:scale-95 w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add New Transport</span>
          </button>
        </header>

        {/* --- PERFORMANCE METRIC CARDS --- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatMiniCard title="Total Transport Profiles" value={stats.totalLines} descriptor={`Registered lines inside ${cityName || "City"}`} />
          <StatMiniCard title="City-Wide Connectivity" value={stats.cityWideCount} descriptor="High coverage options" />
          <StatMiniCard title="Operational Modes" value={stats.activeModes} descriptor="Distinct transit styles deployed" />
        </section>

        {/* --- SYSTEM FILTER REGISTRY CONTROLS --- */}
        <div className="bg-white border w-full border-slate-100 rounded-2xl p-2 flex flex-col lg:flex-row gap-3 justify-between items-center shadow-sm">
          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00A699] transition-colors" size={16} />
            <input
              type="text"
              value={searchQuery}
              placeholder="Search by operator name or stop stations..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-sm font-medium py-3 pl-11 pr-4 rounded-xl border border-transparent focus:outline-none focus:border-slate-200 focus:bg-white text-slate-700 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-start lg:justify-end">
            {["all", "bus", "metro", "train", "cab", "autorickshaw", "ferry"].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                  selectedMode === mode
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* --- TRANSPORT SCROLLABLE LIST LOG CONTAINER --- */}
        <main className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Transports</h2>
            {isLoading && <span className="text-xs text-[#00A699] font-black uppercase tracking-wider animate-pulse">Syncing Transports mapping...</span>}
          </div>

          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <TransitRowSkeleton key={i} />)
              ) : filteredTransit.length > 0 ? (
                filteredTransit.map((transit, idx) => (
                  <TransitListRow
                    key={transit._id}
                    transit={transit}
                    index={idx}
                    onDelete={handleDeleteRoute}
                    onEdit={(id) => navigate(`/admin/regions/${cityName}/${cityId}/transport/${id}/edit`)}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-wider border border-dashed border-slate-100 rounded-2xl bg-slate-50/10">
                  No registered Transport routes fit your criteria queries.
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>

      </div>
    </div>
  );
};

// --- SUB-COMPONENT: SCANNABLE HORIZONTAL TRANSIT ROW ---
const TransitListRow = ({ transit, index, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTransitIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case "metro":
      case "train":
        return <Train size={18} />;
      case "bus":
        return <Bus size={18} />;
      default:
        return <Navigation size={18} />;
    }
  };

  const getCoverageStyle = (coverage) => {
    switch (coverage?.toLowerCase()) {
      case "city-wide": return "bg-teal-50 border-teal-100 text-[#00A699]";
      case "inter-city": return "bg-purple-50 border-purple-100 text-purple-600";
      default: return "bg-blue-50 border-blue-100 text-blue-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ delay: index * 0.03 }}
      className="p-5 bg-white border border-slate-100 rounded-2xl flex flex-col lg:flex-row lg:items-start justify-between gap-5 hover:shadow-md hover:border-slate-200 transition-all duration-300 group relative"
    >
      {/* Left Area Layout: Mode Icon & Complete Route Parameters */}
      <div className="flex items-start gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#00A699]/10 group-hover:border-[#00A699]/20 group-hover:text-[#00A699] transition-all shrink-0">
          {getTransitIcon(transit.mode)}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {/* Identity Parameters Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-black text-slate-800 tracking-tight uppercase truncate">
              {transit.providerName}
            </h4>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border shrink-0 ${getCoverageStyle(transit.coverage)}`}>
              {transit.coverage ? transit.coverage.replace("-", " ") : "city-wide"}
            </span>
          </div>

          {/* Graphical Route Chain Displayer */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight text-slate-600 pt-1">
            {transit.routes?.map((stop, sIdx) => (
              <React.Fragment key={sIdx}>
                <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-slate-700 shadow-3xs truncate max-w-35">
                  {stop}
                </span>
                {sIdx < transit.routes.length - 1 && (
                  <Shuffle size={10} className="text-slate-300 rotate-90 lg:rotate-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Operational Log Strings */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">
            <span className="flex items-center gap-1"><Clock size={12} className="text-slate-300" /> {transit.timings}</span>
            <span className="flex items-center gap-1"><Compass size={12} className="text-slate-300" /> {transit.frequency || "Variable Interval"}</span>
          </div>

          {/* Multi-line Commuter Advice Item Display Block */}
          {transit.tips?.length > 0 && (
            <div className="mt-2 text-[10px] font-medium text-slate-500 bg-amber-50/40 border border-amber-100/50 p-2.5 rounded-xl flex items-start gap-1.5 max-w-2xl">
              <Lightbulb size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-normal normal-case"><span className="font-black uppercase tracking-wider text-amber-600 text-[8px] mr-1">Pro Tip:</span>{transit.tips[0]}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Area Layout: Fare Indicators & Administrative Action Drops */}
      <div className="flex items-center justify-between lg:justify-end gap-6 border-t border-slate-50 lg:border-0 pt-3 lg:pt-1 shrink-0">
        <div className="flex items-center gap-2 text-left lg:text-right">
          <Ticket size={14} className="text-[#00A699]" />
          <div>
            <span className="hidden lg:block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Fare Index</span>
            <span className="text-xs font-black text-slate-800 tracking-tight">{transit.estimatedCost}</span>
          </div>
        </div>

        {/* Dynamic Multi-menu drop wrapper layout */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-xl shadow-xl p-1 z-20">
                <button
                  onClick={() => {
                    onEdit(transit._id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Edit3 size={13} className="text-blue-500" />
                  <span>Edit Route</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(transit._id);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={13} className="text-red-500" />
                  <span>Delete Route</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- MINI HELPERS ---
const StatMiniCard = ({ title, value, descriptor }) => (
  <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm shadow-slate-100/50">
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">{title}</span>
    <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{value}</h3>
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-0.5">{descriptor}</span>
  </div>
);

const TransitRowSkeleton = () => (
  <div className="p-5 bg-white border border-slate-50 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
      <div className="space-y-3 flex-1 min-w-0">
        <div className="h-3.5 bg-slate-200 rounded w-1/4" />
        <div className="h-6 bg-slate-100 rounded w-2/3" />
        <div className="h-3 bg-slate-50 rounded w-1/3" />
      </div>
    </div>
    <div className="w-24 h-6 bg-slate-100 rounded-md shrink-0 pl-4" />
  </div>
);

export default Transport;