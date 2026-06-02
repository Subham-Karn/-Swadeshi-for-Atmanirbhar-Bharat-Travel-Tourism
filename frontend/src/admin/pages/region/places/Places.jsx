import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRegionsStore } from "../../../../store/useRegionStore";
import {
  ChevronLeft,
  Plus,
  Star,
  MapPin,
  Navigation,
  Search,
  Filter,
  Edit3,
  Trash2,
  ChevronRight,
  Globe,
  Info,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlaceStore } from "../../../../store/usePlaceStore";
import { useCitiesStore } from "../../../../store/useCitiesStore";
import CityHeader from "../../../components/CityHeader";
import FilterTool from "../../../components/FilterTool";
const CategoryOptions = [
  { value: "heritage", label: "Heritage" },
  { value: "religious", label: "Religious" },
  { value: "historic", label: "Historic" },
  { value: "nature", label: "Nature" },
  { value: "market", label: "Market" },
  { value: "modern", label: "Modern" },
];

const Places = () => {
  const navigate = useNavigate();
  const { cityId, stateName, cityName } = useParams();
  const { state } = useLocation();
  const { fetchCityById } = useCitiesStore();
  const { places, fetchPlacesByCity, isLoading, deletePlace } = usePlaceStore();
  const [city, setCity] = useState(state);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
const fetchCity = useCallback(async () => {
  if (!cityId) return;
  try {
    const response = await fetchCityById(cityId);
    console.log(response);
    
    setCity(response); 
  } catch (error) {
    console.error("Error fetching city details from API backend:", error);
  }
}, [cityId]);

useEffect(() => {
  if (state) {
    setCity(state);
  } else if (cityId) {
    fetchCity();
  }
}, [state, cityId, fetchCity]);
useEffect(() => {
  if (cityId) {
    fetchPlacesByCity(cityId);
  }
}, [fetchPlacesByCity, cityId]);

  
  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch = place.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "All" ||
        place.category.toLowerCase() === filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory, places]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const paginatedPlaces = filteredPlaces.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      await deletePlace(id);
    }
  };

  return (
    <div className="w-full space-y-6 min-h-screen">
      {/* Header Card */}
      <CityHeader
        {...city}
        onAddPlace={() => navigate("add")}
        onAddHotel={() =>
          navigate(`/admin/regions/${cityName}/${cityId}/hotels`)
        }
        onAddTransport={() =>
          navigate(`/admin/regions/${cityName}/${cityId}/transport`)
        }
      />

      {/* Filter Tool */}
      <FilterTool
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterType={setFilterCategory}
        filterType={filterCategory}
        selectData={CategoryOptions}
        selectTitle="Categories"
      />

      {/* 4. Vertical Place Cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {/* Skeleton Loader */}
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <PlaceVerticalCard key={i} loading={true} index={i} />
            ))
          ) : paginatedPlaces.length > 0 ? (
            paginatedPlaces.map((place, index) => (
              <PlaceVerticalCard
                key={place._id}
                loading={false}
                place={place}
                index={index}
                onEdit={() =>
                  navigate(
                    `/admin/regions/${stateName}/cities/${cityName}/${cityId}/places/${place._id}/edit`,
                  )
                }
                onDelete={() => handleDelete(place._id)}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                No places registered in this city yet
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Pagination - Same as your previous logic */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          {/* ... Pagination Buttons ... */}
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center gap-5">
    <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  </div>
);

const PlaceVerticalCard = ({ place, index, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 animate-pulse">
        <div className="h-32 w-full md:w-48 shrink-0 rounded-2xl bg-slate-100" />
        <div className="flex-1 w-full space-y-3">
          <div className="h-6 w-1/3 bg-slate-100 rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-50 rounded-lg" />
          <div className="h-4 w-1/4 bg-slate-50 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-white border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-xl transition-all"
    >
      {/* Media Thumbnail */}
      <div className="h-32 w-full md:w-48 shrink-0 rounded-2xl overflow-hidden relative shadow-inner bg-slate-50">
        <img
          src={place.images?.[0]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt={place.name}
        />
        {place.isPopular && (
          <div className="absolute top-2 right-2 bg-orange-500 p-1.5 rounded-lg shadow-lg">
            <Star fill="white" className="text-white" size={12} />
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="flex-1 w-full text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <span className="text-[9px] font-black text-[#00A699] uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-md">
                {place.category}
              </span>
              {/* WHO CREATED - User Stamp */}
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 border-l border-slate-200 pl-2">
                <User size={10} />
                <span>By {place.createdBy?.name || "Administrator"}</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              {place.name}
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <div className="flex items-center gap-1 text-orange-500">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-black">{place.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <MapPin size={12} />
                <span className="text-[10px] font-bold truncate max-w-50">
                  {place.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00A699] transition-all"
            >
              <Edit3 size={14} /> Update
            </button>
            <button
              onClick={onDelete}
              className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Places;

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
          <Calendar size={10} /> {city.bestTimeToVisit || "Not Available"}
        </p>
      </div>
    </div>

    {/* city Column */}
    <div className="col-span-2">
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-[#00A699] uppercase tracking-widest mb-1">
          Region Type
        </span>
        <span className="text-sm font-black text-slate-700 uppercase">
          {city.regionType} India
        </span>
      </div>
    </div>

    {/* Cities Column */}
    <div className="col-span-2 text-center">
      <div className="inline-flex flex-col items-center px-5 py-2 bg-slate-50 rounded-2xl">
        <span className="text-xl font-black  text-slate-900 leading-none">
          {city.placeCount || 0}
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
