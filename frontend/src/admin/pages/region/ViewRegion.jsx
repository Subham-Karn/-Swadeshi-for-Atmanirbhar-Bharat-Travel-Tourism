import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Plus,
  Info,
  Calendar,
  Search,
  Loader2,
  Navigation,
  MapPin,
  User,
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import StateHeader from "../../components/StateHeader";
import { useCitiesStore } from "../../../store/useCitiesStore";
import { processDataList } from "../../../util/dataUtils";

const Viewcity = () => {
  const { stateId } = useParams();
  const { state } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const { cities, fetchCitiesByStateId, isLoading } = useCitiesStore();
  const citiesData = useMemo(() => {
    return processDataList(cities);
  }, [cities]);
  const navigate = useNavigate();
  const handleAdd = () => {
    console.log("Opening Add City Modal...");
  };

  useEffect(() => {
    fetchCitiesByStateId(stateId);
  }, [fetchCitiesByStateId, stateId]);

  const filteredCities = useMemo(() => {
    if (filterType === "All") {
      return citiesData;
    } else {
      return citiesData.filter((city) => city.category === filterType);
    }
  }, [citiesData, filterType]);

  return (
    <div className="w-full min-h-screen font-sans">
      {/* Header */}
      <StateHeader {...state} onAddCity={handleAdd} />
      {/* ─── FILTER TOOLBAR ─── */}
      <div className="flex flex-col lg:flex-row gap-4 my-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by state name..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:border-[#00A699] font-bold text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-8 py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 shadow-sm outline-none cursor-pointer"
        >
          <option value="All">All Zones</option>
          {["North", "South", "East", "West", "Central", "North-East"].map(
            (t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ),
          )}
        </select>
      </div>
      {/*City Cards */}
      <AnimatePresence mode="popLayout" initial={false}>
        <div className="flex flex-col gap-2 w-full h-70 overflow-y-auto">
          {filteredCities.map((city, idx) => (
            <AdminStateCard
              key={city._id}
              city={city}
              index={idx}
              onDelete={() => openDeleteModal(region)}
              onEdit={() => navigate(`/admin/regions/${region._id}/edit`)}
              onView={() =>
                navigate(`/admin/regions/${region._id}/view`, { state: region })
              }
            />
          ))}
        </div>
      </AnimatePresence>
      {isLoading && (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-[#00A699]" size={40} />
        </div>
      )}
    </div>
  );
};

export default Viewcity;

const AdminStateCard = ({ city, index, onDelete, onEdit, onView }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white border relative border-slate-50 rounded-xl p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 hover:shadow-xl hover:shadow-slate-100 transition-all group"
  >
    <NewBadge isNew={city.isNew} />
    {/* Visual & Name Column */}
    <div className="col-span-4 flex items-center gap-6">
      <div className="w-24 h-24 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 relative shadow-md">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 2500 + index * 300 }}
          className="h-full w-full"
        >
          {city.cityImages?.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {city.isPopular && (
          <div className="absolute top-1 right-1 z-10 bg-orange-500 p-1 rounded-full text-white shadow-lg">
            <Star size={10} fill="currentColor" />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
          {city.cityName || "Not Available"}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-widest">
          <MapPin size={10} /> {city.reach || "Not Available"}
        </p>
      </div>
    </div>

    {/* city Column */}
    <div className="col-span-2">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-[#00A699] uppercase tracking-widest mb-1">
          City Type
        </span>
        <span className="text-sm font-black text-slate-700 uppercase">
          {city.cityType} India
        </span>
      </div>
    </div>

    {/* Cities Column */}
    <div className="col-span-2 text-center">
      <div className="inline-flex flex-col items-center px-5 py-2 bg-slate-50 rounded-2xl">
        <span className="text-xl font-black text-slate-900 leading-none">
          {0}
        </span>
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
          Places
        </span>
      </div>
    </div>

    {/* Creator Column */}
    <div className="col-span-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#00A699]">
          <User size={14} />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Created By
          </span>
          <span className="text-xs font-bold text-slate-700">
            {city.uid.name || "NA"}
          </span>
        </div>
      </div>
    </div>

    {/* Actions Column */}
    <div className="col-span-2 flex items-center justify-end gap-2">
      <ActionBtn
        icon={<Eye size={18} />}
        onClick={onView}
        label="View"
        type="teal"
      />
      <ActionBtn
        icon={<SquarePen size={18} />}
        onClick={onEdit}
        label="Edit"
        type="slate"
      />
      <ActionBtn
        icon={<Trash2 size={18} />}
        onClick={onDelete}
        label="Delete"
        type="red"
      />
    </div>
  </motion.div>
);

const ActionBtn = ({ icon, onClick, type }) => {
  const styles = {
    teal: "bg-teal-50 text-[#00A699] hover:bg-[#00A699] hover:text-white",
    slate: "bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white",
    red: "bg-red-50 text-red-400 hover:bg-red-500 hover:text-white",
  };
  return (
    <button
      onClick={onClick}
      className={`p-3.5 rounded-2xl transition-all shadow-sm ${styles[type]}`}
    >
      {icon}
    </button>
  );
};

const NewBadge = ({ isNew }) => {
  if (!isNew) return null;

  return (
    <div className="absolute -top-1 -left-1 z-20">
      <div className="relative">
        {/* Subtle Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#00A699] animate-ping opacity-20" />

        {/* Main Badge */}
        <span className="relative bg-[#00A699] text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg shadow-teal-100 flex items-center gap-1 border border-white/20">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          New
        </span>
      </div>
    </div>
  );
};
