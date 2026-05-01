import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Clock, Star, CheckCircle2,
  ChevronLeft, Share2, Heart, ShieldCheck,
  TrendingUp, Building2, Edit, List, Plus, Eye,
  X, ChevronRight, Grid, ZoomIn
} from 'lucide-react';
import { useRegionsStore } from '../../../store/useRegionStore';
import { parseCustomSyntax } from '../../../engine/useTextEngine';
import { formatDateTime } from '../../../util/formatDateTime';
import { renderStars } from '../../../util/renderStars';

/* ─── Flipkart-style Lightbox ─── */
const Lightbox = ({ images, activeIndex, onClose, onNav }) => {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNav]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col"
        style={{ background: 'rgba(15,15,15,0.97)' }}
        onClick={onClose}
      >
        {/* Top Bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-white/50 text-xs font-mono tracking-widest uppercase">
            Gallery · {activeIndex + 1} / {images.length}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setZoomed(z => !z)}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <ZoomIn size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Image */}
        <div
          className="flex-1 flex items-center justify-center relative overflow-hidden px-16"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onNav(-1)}
            className="absolute left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          >
            <ChevronLeft size={22} />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96, x: 30 }}
              animate={{ opacity: 1, scale: zoomed ? 1.6 : 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96, x: -30 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full max-w-3xl"
              style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
              onClick={() => setZoomed(z => !z)}
            >
              <img
                src={images[activeIndex]}
                alt={`Gallery ${activeIndex + 1}`}
                className="w-full rounded-2xl object-cover"
                style={{ maxHeight: '65vh', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => onNav(1)}
            className="absolute right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Filmstrip */}
        <div
          className="flex items-center gap-3 px-6 py-4 overflow-x-auto"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNav(i - activeIndex)}
              className="shrink-0 rounded-xl overflow-hidden transition-all"
              style={{
                width: 72, height: 52,
                border: i === activeIndex ? '2px solid #00A699' : '2px solid transparent',
                opacity: i === activeIndex ? 1 : 0.45,
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── City Card ─── */
const CityCard = ({ city, regionName, navigate }) => (
  
  <motion.div
    whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(0,166,153,0.12)' }}
    transition={{ duration: 0.2 }}
    className="rounded-3xl overflow-hidden bg-white"
    style={{ border: '1px solid #f0f0f0' }}
  >
    <div className="relative overflow-hidden" style={{ height: 180 }}>
      <img
        src={city.cityImages[0]}
        alt={city.cityName}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)' }}
      />
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{ background: 'rgba(255,255,255,0.92)', color: '#00A699' }}>
        {renderStars(city.rating || 0)} {city.rating.toFixed(1) || 0}
      </div>
      <h4 className="absolute bottom-3 left-4 text-white text-lg font-bold tracking-tight">
        {city.cityName}
      </h4>
    </div>

    <div className="p-4">
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/admin/regions/${regionName}/cities/${city._id}/places`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{ background: '#f0faf9', color: '#00A699', border: '1px solid #c8ebe9' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#00A699'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0faf9'; e.currentTarget.style.color = '#00A699'; }}
        >
          <Eye size={13} /> View
        </button>
        <button
          onClick={() => navigate(`/admin/regions/${regionName}/cities/${city._id}/placesadd`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff7ed'; e.currentTarget.style.color = '#ea580c'; }}
        >
          <Plus size={13} /> Add
        </button>
        <button
          onClick={() => navigate(`/admin/regions/${regionName}/cities/${city._id}/edit`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{ background: '#f8f8f8', color: '#555', border: '1px solid #e5e5e5' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f8f8f8'; e.currentTarget.style.color = '#555'; }}
        >
          <List size={13} /> Edit
        </button>
      </div>
    </div>
  </motion.div>
);

/* ─── Main ViewRegion ─── */
const ViewRegion = () => {
  const { regionId } = useParams();
  const navigate = useNavigate();
  const { regions, cities, fetchCitiesByState, isLoading } = useRegionsStore();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);

  const region = useMemo(() => regions.find(r => r._id === regionId), [regions, regionId]);

  useEffect(() => {
    if (regionId) fetchCitiesByState(regionId);
  }, [regionId, fetchCitiesByState]);

  const allImages = useMemo(() => {
    if (!region) return [];
    const primary = region.stateImage;
    const gallery = Array.isArray(region.stateImage) ? region.stateImage : [];
    const combined = [primary, ...gallery].flat().filter(Boolean);
    return [...new Set(combined)];
  }, [region]);

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const navLightbox = useCallback((delta) => {
    setLightboxIndex(i => (i + delta + allImages.length) % allImages.length);
  }, [allImages.length]);

  if (isLoading && !region) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#00A699', borderRightColor: '#00A699' }}
        />
      </div>
    );
  }

  if (!region) return null;
  
  const primaryImage = allImages[activeThumb] || allImages[0];

  return (
    <>
      {lightboxOpen && (
        <Lightbox
          images={allImages}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNav={navLightbox}
        />
      )}

      <div className="min-h-screen ">

        {/* ── Header ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3"
                style={{ color: '#00A699', fontSize: 11, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                <MapPin size={13} /> {region.regionType} Region
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase">
                {region.stateName}
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/regions')}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
                style={{ border: '1px solid #f0f0f0' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => navigate(`/admin/regions/${regionId}/edit`)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-xs font-bold uppercase tracking-widest transition-all"
                style={{ background: '#111' }}
                onMouseEnter={e => e.currentTarget.style.background = '#00A699'}
                onMouseLeave={e => e.currentTarget.style.background = '#111'}
              >
                <Edit size={14} /> Edit Region
              </button>
            </div>
          </div>
        </div>

        {/* Gallery ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
          <div className="flex flex-col md:flex-row gap-4" style={{ height: 460 }}>

            {/* Thumbnail Strip (left) */}
            <div 
              className="hidden md:flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar" 
              style={{ 
                width: 90, 
                maxHeight: '100%',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none'  /* IE/Edge */
              }}
            >
              <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                  display: none; /* Chrome, Safari, Opera */
                }
              `}</style>

              {allImages.map((img, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveThumb(i)}
                  className="shrink-0 rounded-xl overflow-hidden transition-all duration-300 relative group"
                  style={{
                    width: 72, 
                    height: 72,
                    border: activeThumb === i ? '3px solid #00A699' : '2px solid transparent',
                    backgroundColor: '#f8f8f8'
                  }}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${i}`} 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${activeThumb === i ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} 
                    referrerPolicy="no-referrer" 
                  />
                  
                  {/* Subtle Inner Shadow for Active State */}
                  {activeThumb === i && (
                    <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,166,153,0.3)] pointer-events-none" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Main Display */}
            <div className="flex-1 relative rounded-3xl overflow-hidden group cursor-zoom-in"
              style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.12)' }}
              onClick={() => openLightbox(activeThumb)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeThumb}
                  src={allImages[activeThumb]}
                  alt={region.stateName}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Prev/Next on main image */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveThumb(i => (i - 1 + allImages.length) % allImages.length); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-md"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveThumb(i => (i + 1) % allImages.length); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all bg-black/40 backdrop-blur-md"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Side mini images (right) - Static previews of index 1 and 2 */}
            {allImages.length > 1 && (
              <div className="hidden lg:flex flex-col gap-4" style={{ width: 220 }}>
                {allImages.slice(1, 3).map((img, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="flex-1 rounded-2xl overflow-hidden cursor-pointer relative group"
                    style={{ border: '1px solid #f0f0f0' }}
                    onClick={() => openLightbox(i + 1)}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    
                    {/* Show "+ Count" on the last side image if there are more than 3 images total */}
                    {i === 1 && allImages.length > 3 && (
                      <div className="absolute inset-0 flex items-center justify-center flex-col text-white"
                        style={{ background: 'rgba(0,0,0,0.5)' }}>
                        <span className="text-2xl font-black">+{allImages.length - 3}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Gallery</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-24">

          {/* Left */}
          <div className="lg:col-span-2">

            {/* Stats Strip */}
            <div className="flex flex-wrap gap-8 mb-12 pb-10" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#f0faf9' }}>
                  <TrendingUp size={18} style={{ color: '#00A699' }} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Market Reach</p>
                  <span className="font-black text-gray-800 text-lg">{region.reach}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: '#fff7ed' }}>
                  <Building2 size={18} style={{ color: '#ea580c' }} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Managed Cities</p>
                  <span className="font-black text-gray-800 text-lg">{cities.length} Active Cities</span>
                </div>
              </div>
            </div>

            {/* Overview */}
            <section className="mb-16">
              <div className="text-gray-500 leading-relaxed text-base" style={{ lineHeight: 1.9 }}>
                {region.overview ? parseCustomSyntax(region.overview) : 'Awaiting Region deployment documentation...'}
              </div>
            </section>

            {/* Cities */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Active Cities</h3>
                <span className="px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest"
                  style={{ background: '#111' }}>
                  {cities.length} Deployed
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cities.map((city) => (
                  
                  <CityCard key={city._id} city={city} regionName={region.stateName} navigate={navigate} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Sticky Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-3xl p-8 bg-white"
              style={{ border: '1px solid #f0f0f0', boxShadow: '0 24px 64px rgba(0,0,0,0.07)' }}>

              {/* Status */}
              <div className="flex items-center justify-between mb-6 pb-6" style={{ borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-3xl font-black text-gray-900 uppercase">{region.status}</p>
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: region.status === 'Active' ? '#00A699' : '#f97316',
                    boxShadow: `0 0 0 4px ${region.status === 'Active' ? 'rgba(0,166,153,0.2)' : 'rgba(249,115,22,0.2)'}`,
                    animation: 'pulse 2s infinite',
                  }}
                />
              </div>

              {/* Meta rows */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Star size={15} fill="#f97316" style={{ color: '#f97316' }} />, label: 'Popularity', value: region.isPopular ? 'High Priority' : 'Standard' },
                  { icon: <ShieldCheck size={15} style={{ color: '#00A699' }} />, label: 'Data', value: 'Verified' },
                  { icon: <MapPin size={15} style={{ color: '#6366f1' }} />, label: 'Region', value: region.regionType },
                  { icon: <Clock size={15} style={{ color: '#94a3b8' }} />, label: 'Last Sync', value: formatDateTime(region.updatedAt) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {icon}
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{value}</span>
                  </div>
                ))}
              </div>

              <button
                className="w-full py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98]"
                style={{ background: '#00A699', boxShadow: '0 12px 32px rgba(0,166,153,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#008a7e'}
                onMouseLeave={e => e.currentTarget.style.background = '#00A699'}
              >
                Manage Deployment
              </button>

              <p className="text-center mt-4 text-xs text-gray-300 uppercase tracking-widest font-bold">
                Admin Secure · Verified Data
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default ViewRegion;