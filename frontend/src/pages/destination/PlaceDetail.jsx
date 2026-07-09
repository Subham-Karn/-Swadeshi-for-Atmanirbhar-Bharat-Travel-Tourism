import React, { useEffect, useState, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Star, Clock, Ticket,
  Car, Train, Plane, ShieldCheck, Wallet,
  ChevronRight, HelpCircle, Ship, Hotel, Navigation,
  Images, ChevronLeft, X, ZoomIn
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

/* ─── Transport Icon Map ──────────────────────────────────── */
const TRANSPORT_ICON_MAP = {
  car: Car, cab: Car, train: Train,
  bus: Train, metro: Train, plane: Plane,
  ferry: Ship, autorickshaw: Car
};

/* ─── Skeleton ────────────────────────────────────────────── */
const SkeletonSection = () => (
  <div className="bg-[#f8fafb] min-h-screen mt-15 animate-pulse">
    <div className="h-[65vh] w-full bg-slate-200 relative">
      <div className="absolute top-10 left-6 md:left-12 w-12 h-12 bg-slate-300 rounded-full" />
      <div className="absolute bottom-10 left-6 md:left-12 space-y-4 w-2/3">
        <div className="h-16 bg-slate-300 rounded-2xl w-3/4" />
        <div className="h-6 bg-slate-300 rounded-xl w-1/2" />
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-2 space-y-12">
        <div className="p-8 bg-white rounded-[2.5rem] h-96 border border-slate-100" />
        <div className="p-8 bg-white rounded-[2.5rem] h-80 border border-slate-100" />
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white border border-slate-100 rounded-[2.5rem] h-80" />
      </div>
    </div>
  </div>
);

/* ─── Metric Card ─────────────────────────────────────────── */
const MetricCard = memo(({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,166,153,0.13)' }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="p-5 bg-linear-to-br from-white to-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between gap-3 cursor-default"
  >
    <div className="w-11 h-11 bg-[#00A699]/10 rounded-2xl flex items-center justify-center">
      <Icon className="text-[#00A699]" size={20} />
    </div>
    <div>
      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-black text-slate-800 text-sm leading-snug">{value}</p>
    </div>
  </motion.div>
));
MetricCard.displayName = 'MetricCard';

/* ─── Transport Card ──────────────────────────────────────── */
const TransportCard = memo(({ mode, providerName, routes, timings, frequency, estimatedCost, tips }) => {
  const IconComponent = TRANSPORT_ICON_MAP[mode?.toLowerCase()] || HelpCircle;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}
      className="p-6 rounded-3xl bg-white border border-slate-100 transition-all"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#00A699]/10 text-[#00A699] rounded-2xl flex items-center justify-center shadow-inner">
            <IconComponent size={26} />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase bg-[#00A699]/10 text-[#00A699] px-2.5 py-1 rounded-full tracking-widest">{mode}</span>
            <h4 className="font-black text-slate-800 text-lg mt-1 leading-tight">{providerName}</h4>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Est. Fare</p>
          <p className="font-black text-[#00A699] text-2xl mt-0.5">{estimatedCost}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
            <Navigation size={12} className="text-[#00A699]" /> Route Stops
          </div>
          <p className="text-sm font-semibold text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
            {routes?.join(' → ') || 'City-wide coverage.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[['Timings', timings], ['Frequency', frequency || 'Regular']].map(([k, v]) => (
            <div key={k} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{k}</p>
              <p className="font-black text-slate-700 text-sm">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {tips?.length > 0 && (
        <div className="mt-1 pt-3 border-t border-slate-100">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1 mb-2">✦ Travel Tips</p>
            <ul className="space-y-1.5 text-xs font-semibold text-amber-800/70 list-disc list-inside">
              {tips.map((tip, i) => <li key={i} className="leading-relaxed">{tip}</li>)}
            </ul>
          </div>
        </div>
      )}
    </motion.div>
  );
});
TransportCard.displayName = 'TransportCard';

/* ─── Image Gallery Selector ──────────────────────────────── */
const ImageGallery = ({ images = [], activeIdx, onChange }) => {
  if (images.length <= 1) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2.5 rounded-2xl border border-white/10"
    >
      <Images size={14} className="text-white/70 mr-1 shrink-0" />
      {images.map((img, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0
            ${activeIdx === i ? 'border-[#00A699] scale-110 shadow-lg shadow-[#00A699]/30' : 'border-white/20 opacity-60 hover:opacity-90 hover:scale-105'}`}
          title={`View photo ${i + 1}`}
        >
          <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
        </button>
      ))}
    </motion.div>
  );
};

/* ─── Lightbox ────────────────────────────────────────────── */
const Lightbox = ({ images, activeIdx, onClose, onNav }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
        <X size={20} />
      </button>
      {images.length > 1 && <>
        <button onClick={(e) => { e.stopPropagation(); onNav(-1); }} className="absolute left-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onNav(1); }} className="absolute right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      </>}
      <motion.img
        key={activeIdx}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        src={images[activeIdx]}
        alt="Full view"
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs font-bold">
        {activeIdx + 1} / {images.length}
      </div>
    </motion.div>
  </AnimatePresence>
);

/* ─── Main Component ──────────────────────────────────────── */
const PlaceDetail = () => {
  const { placeId: id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const fetchCurrentPlace = useCallback(async (pId) => {
    try {
      setLoading(true);
      const response = await api.get(`/places/city/place/${pId}`);
      const data = response.data?.data || response.data || null;
      setCurrentPlace(data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to load place data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (id) fetchCurrentPlace(id); }, [id, fetchCurrentPlace]);

  if (loading) return <SkeletonSection />;

  if (!currentPlace) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafb] p-6">
        <div className="w-16 h-16 bg-[#00A699]/10 rounded-3xl flex items-center justify-center mb-6">
          <MapPin size={32} className="text-[#00A699]" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">Destination not found</h3>
        <p className="text-slate-400 mb-8 font-semibold text-center">We couldn't locate the destination data. It may have moved or been removed.</p>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-7 py-3.5 bg-[#00A699] text-white font-black rounded-2xl hover:bg-[#008d82] transition-colors shadow-lg shadow-[#00A699]/20">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );
  }

  /* Collect all available images */
  const allImages = [
    ...(currentPlace.coverImage ? [currentPlace.coverImage] : []),
    ...(currentPlace.images || []),
  ].filter((img, i, arr) => arr.indexOf(img) === i); // dedupe

  const heroImage = allImages[activeImgIdx]
    || 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200';

  const handleLightboxNav = (dir) => {
    setActiveImgIdx((prev) => (prev + dir + allImages.length) % allImages.length);
  };

  return (
    <div className="bg-[#f8fafb] min-h-screen mt-15 pb-20" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Hero ── */}
      <section className="relative h-[65vh] w-full overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={heroImage}
            src={heroImage}
            alt={currentPlace.name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        </AnimatePresence>

        {/* linear overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-[#f8fafb]" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />

        {/* Back btn */}
        <div className="absolute top-10 left-0 w-full px-6 md:px-12 flex justify-between z-10">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg rounded-full flex items-center justify-center border border-white/60 hover:bg-white hover:scale-105 transition-all"
          >
            <ArrowLeft size={22} />
          </motion.button>

          {/* Lightbox zoom trigger */}
          {allImages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setLightboxOpen(true)}
              className="w-12 h-12 bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg rounded-full flex items-center justify-center border border-white/60 hover:bg-white hover:scale-105 transition-all"
              title="View full image"
            >
              <ZoomIn size={20} />
            </motion.button>
          )}
        </div>

        {/* Title */}
        <div className="absolute bottom-14 left-0 w-full px-6 md:px-12 z-10">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-xl leading-none">
              {currentPlace.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className="flex items-center gap-1.5 text-amber-400 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-black border border-amber-400/20">
                <Star size={14} fill="currentColor" /> {currentPlace.rating || '5.0'}
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-bold border border-white/10">
                <MapPin size={14} className="text-[#00A699]" /> {currentPlace.location}
              </span>
              {currentPlace.category && (
                <span className="bg-[#00A699]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-black md:uppercase tracking-widest border border-[#00A699]/30 capitalize">
                  {currentPlace.category}
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Image gallery thumbnails */}
        <ImageGallery images={allImages} activeIdx={activeImgIdx} onChange={setActiveImgIdx} />
      </section>

      {/* ── Main Grid ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-10">

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-[#00A699] rounded-full" />
              <h2 className="text-2xl font-black text-slate-800">About the Destination</h2>
            </div>
            <p className="text-slate-500 text-base leading-relaxed whitespace-pre-line font-medium">{currentPlace.overview}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-9">
              <MetricCard icon={Ticket} label="Entry Fee" value={currentPlace.entryFee || 'Free Entry'} />
              <MetricCard icon={Clock} label="Timings" value={currentPlace.timings || '9:00 AM – 6:00 PM'} />
              <MetricCard icon={ShieldCheck} label="Best Time" value={currentPlace.bestTime || 'October – March'} />
            </div>
          </motion.div>

          {/* Transport */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-8 bg-[#00A699] rounded-full" />
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Navigation className="text-[#00A699]" size={24} /> Available Transports
              </h2>
            </div>
            <p className="text-slate-400 text-sm font-semibold mb-7 pl-4">Transit networks and service routes mapped to this destination.</p>

            {currentPlace.transport?.length > 0 ? (
              <div className="space-y-5">
                {currentPlace.transport.map((t, i) => (
                  <TransportCard key={t._id || i} {...t} />
                ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-bold">
                No transport guides available for this destination yet.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Nearby Hotels ── */}
      {currentPlace.nearbyHotels?.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="max-w-7xl mx-auto px-6 md:px-12 mt-2"
        >
          <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-1 h-8 bg-[#00A699] rounded-full" />
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <Hotel className="text-[#00A699]" size={24} /> Stay Nearby
                  </h2>
                </div>
                <p className="text-slate-400 text-sm font-semibold pl-4">Recommended stays close to this destination.</p>
              </div>
              <button className="text-sm font-bold text-slate-400 hover:text-[#00A699] flex items-center gap-1 transition-colors group">
                View All <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentPlace.nearbyHotels.map((h, i) => (
                <motion.div
                  key={h._id || i}
                  whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.10)' }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className="group cursor-pointer bg-white rounded-2xl border border-slate-100 overflow-hidden"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={h.coverImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-black text-slate-700 capitalize shadow-sm border border-slate-100">
                      {h.tier}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-xl text-xs font-black text-amber-400 border border-amber-400/20">
                      <Star size={11} fill="currentColor" /> {h.rating || '4.0'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-black text-slate-800 truncate text-base">{h.name}</h4>
                    <p className="text-slate-400 text-xs font-semibold mt-1 truncate flex items-center gap-1">
                      <MapPin size={11} className="text-[#00A699] shrink-0" /> {h.location}
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                      <p className="text-[#00A699] font-black text-base">
                        ₹{h.pricePerNight} <span className="text-xs font-semibold text-slate-400">/ night</span>
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs font-black text-[#00A699] bg-[#00A699]/10 px-3 py-1.5 rounded-xl hover:bg-[#00A699] hover:text-white transition-colors"
                      >
                        Book
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={allImages}
          activeIdx={activeImgIdx}
          onClose={() => setLightboxOpen(false)}
          onNav={handleLightboxNav}
        />
      )}
    </div>
  );
};

export default PlaceDetail;