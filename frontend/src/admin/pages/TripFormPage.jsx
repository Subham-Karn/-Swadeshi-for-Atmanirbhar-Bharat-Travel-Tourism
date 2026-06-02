import React, { useEffect, useState, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Hotel, Navigation, Calendar, 
  Wallet, FileText, CheckCircle2, Search, X, Layers, AlertCircle
} from 'lucide-react';
import { useTripStore } from '../../store/useTripStore';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';

const SearchSelectorModal = memo(({ isOpen, onClose, title, items, selectedId, onSelect, searchKey = 'name', subKey }) => {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;

  const filteredItems = items.filter(item => 
    item[searchKey]?.toLowerCase().includes(search.toLowerCase()) ||
    (subKey && item[subKey]?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-100 w-full max-w-xl p-6 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800">{title}</h3>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search matching options dynamic registries..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-[#00A699] focus:bg-white transition-all"
          />
        </div>

        <div className="mt-4 overflow-y-auto flex-1 space-y-2 pr-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = Array.isArray(selectedId) ? selectedId.includes(item._id) : selectedId === item._id;
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    onSelect(item._id);
                    if (!Array.isArray(selectedId)) onClose();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? 'border-[#00A699] bg-teal-50/40' : 'border-slate-100 bg-slate-50/30 hover:border-slate-200'
                  }`}
                >
                  <div>
                    <p className="font-black text-slate-800 text-sm">{item[searchKey]}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">
                      {subKey ? item[subKey] : item.cityName || item.providerName || item.category}
                    </p>
                  </div>
                  {isSelected && <CheckCircle2 size={18} className="text-[#00A699]" fill="currentColor" stroke="white" />}
                </div>
              );
            })
          ) : (
            <p className="text-center py-8 text-sm font-bold text-slate-400">No matching search profile configurations matched.</p>
          )}
        </div>
      </div>
    </div>
  );
});
SearchSelectorModal.displayName = 'SearchSelectorModal';

const TripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createTrip } = useTripStore();

  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [transports, setTransports] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const {user} = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    placeId: '',
    hotelId: '',
    transportOptions: [],
    startDate: '',
    endDate: '',
    estimatedTotalCost: 0,
    status: 'upcoming',
    notes: ''
  });

  useEffect(() => {
    const fetchDependenciesAndTrip = async () => {
      try {
        setLoading(true);
        const [pRes, hRes, tRes] = await Promise.all([
          api.get('/places/all'),
          api.get('/hotels/all'),
          api.get('/transports/all')
        ]);
        
        const fetchedPlaces = pRes.data?.data || pRes.data || [];
        const fetchedHotels = hRes.data?.data || hRes.data || [];
        const fetchedTransports = tRes.data?.data || tRes.data || [];

        setPlaces(fetchedPlaces);
        setHotels(fetchedHotels);
        setTransports(fetchedTransports);

        if (id) {
          const tripResponse = await api.get(`/trips/admin/detail/${id}`);
          const trip = tripResponse.data?.data || tripResponse.data;
          if (trip) {
            setFormData({
              title: trip.title || '',
              userId: trip.userId || user?._id,
              placeId: trip.placeId?._id || trip.placeId || '',
              hotelId: trip.hotelId?._id || trip.hotelId || '',
              transportOptions: trip.transportOptions?.map(t => t._id || t) || [],
              startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : '',
              endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : '',
              estimatedTotalCost: trip.budgetCalculation?.estimatedTotalCost || 0,
              status: trip.status || 'upcoming',
              notes: Array.isArray(trip.customNotes) ? trip.customNotes.join(', ') : trip.customNotes || ''
            });
          }
        }
      } catch (err) {
        toast.error("Failed to sync required data collections");
      } finally {
        setLoading(false);
      }
    };
    fetchDependenciesAndTrip();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransportToggle = (tId) => {
    setFormData(prev => {
      const exists = prev.transportOptions.includes(tId);
      return {
        ...prev,
        transportOptions: exists 
          ? prev.transportOptions.filter(i => i !== tId)
          : [...prev.transportOptions, tId]
      };
    });
  };

  const calculateNights = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 1;
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
  };

  const activePlace = places.find(p => p._id === formData.placeId);
  const activeHotel = hotels.find(h => h._id === formData.hotelId);
  const filteredHotels = hotels.filter(h => h.cityId === activePlace?.cityId);
  const filteredTransports = transports.filter(t => t.cityId === activePlace?.cityId);

  const totalNights = calculateNights();
  const hotelTotalCost = activeHotel ? (activeHotel.pricePerNight * totalNights) : 0;
  const grossCalculatedCost = Number(formData.estimatedTotalCost) + hotelTotalCost;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.placeId || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all baseline operational parameters");
      return;
    }

    const payload = {
      title: formData.title,
      userId: user?._id,
      placeId: formData.placeId,
      hotelId: formData.hotelId || null,
      transportOptions: formData.transportOptions,
      startDate: formData.startDate,
      endDate: formData.endDate,
      numberOfDays: totalNights,
      customNotes: formData.notes ? formData.notes.split(',').map(n => n.trim()).filter(Boolean) : [],
      status: formData.status,
      budgetCalculation: {
        estimatedTotalCost: grossCalculatedCost,
        currency: 'INR'
      }
    };

    try {
      if (id) {
        await api.put(`/trips/admin/update/${id}`, payload);
        toast.success('Itinerary adjustments logged successfully');
      } else {
        await createTrip(payload);
      }
      navigate('/admin/trips');
    } catch (err) {
      toast.error('Data system rejection error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A699]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-2xs transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {id ? "Modify Trip Parameters" : "Compile Unified Itinerary"}
            </h1>
            <p className="text-sm font-bold text-slate-400 mt-0.5">Configure and review complete dynamic travel infrastructure details.</p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <FileText className="text-[#00A699]" size={22} />
                <h3 className="text-lg font-black text-slate-800">1. Core Information Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Itinerary Title *</label>
                  <input 
                    type="text" required name="title" value={formData.title} onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm focus:border-[#00A699] outline-none transition-all" 
                    placeholder="e.g., Corporate Retreat 2026" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Workflow State</label>
                  <select 
                    name="status" value={formData.status} onChange={handleInputChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm focus:border-[#00A699] outline-none bg-white transition-all"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Start Date *</label>
                  <input type="date" required name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-[#00A699]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">End Date *</label>
                  <input type="date" required name="endDate" value={formData.endDate} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-[#00A699]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Base Trip Fee (INR)</label>
                  <input type="number" required name="estimatedTotalCost" value={formData.estimatedTotalCost} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-[#00A699]" min="0" placeholder="15000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Custom Advisory Notes (Comma Separated Array)</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-[#00A699] h-20 resize-none" placeholder="Banned mobile phones, Carry extra ID proof cards, Check-in early" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2.5">
                  <MapPin className="text-[#00A699]" size={22} />
                  <h3 className="text-lg font-black text-slate-800">2. Destination Spot Selection *</h3>
                </div>
                <button 
                  type="button" onClick={() => setActiveModal('place')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  {formData.placeId ? 'Change Destination' : 'Select Destination'}
                </button>
              </div>
              {activePlace ? (
                <div className="p-4 rounded-2xl bg-teal-50/20 border border-teal-100/50 flex justify-between items-center animate-fadeIn">
                  <div>
                    <h5 className="font-black text-slate-800 text-base">{activePlace.name}</h5>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 capitalize">{activePlace.cityName} • {activePlace.category} Registry</p>
                  </div>
                  <span className="text-xs font-black text-[#00A699] bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-3xs">Mapped Node</span>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400 bg-slate-50/50 rounded-xl p-4 text-center border border-dashed border-slate-200">No destination spot currently assigned to this itinerary.</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2.5">
                  <Hotel className="text-[#00A699]" size={22} />
                  <h3 className="text-lg font-black text-slate-800">3. Hospitality Accommodation</h3>
                </div>
                <button 
                  type="button" disabled={!formData.placeId} onClick={() => setActiveModal('hotel')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  {formData.hotelId ? 'Change Stay Lodge' : 'Select Stay Lodge'}
                </button>
              </div>
              {activeHotel ? (
                <div className="p-4 rounded-2xl bg-amber-50/20 border border-amber-100/50 flex justify-between items-center animate-fadeIn">
                  <div>
                    <h5 className="font-black text-slate-800 text-base">{activeHotel.name}</h5>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 capitalize">{activeHotel.tier} Tier Class • {activeHotel.location.slice(0, 45)}...</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-700 text-sm">₹{activeHotel.pricePerNight}</p>
                    <p className="text-[10px] text-slate-400 font-bold">/ night basis</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400 bg-slate-50/50 rounded-xl p-4 text-center border border-dashed border-slate-200">No hotel option selected for this destination cluster.</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                <div className="flex items-center gap-2.5">
                  <Navigation className="text-[#00A699]" size={22} />
                  <h3 className="text-lg font-black text-slate-800">4. Transit Systems Channel Link</h3>
                </div>
                <button 
                  type="button" disabled={!formData.placeId} onClick={() => setActiveModal('transport')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  Manage Transit Vectors ({formData.transportOptions.length})
                </button>
              </div>
              {formData.transportOptions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                  {transports.filter(t => formData.transportOptions.includes(t._id)).map(t => (
                    <div key={t._id} className="p-3 bg-indigo-50/20 border border-indigo-100/40 rounded-xl flex justify-between items-center text-xs font-bold text-slate-600">
                      <span className="capitalize font-black text-slate-700">[{t.mode}] {t.providerName}</span>
                      <span className="text-[#00A699] font-black">{t.estimatedCost}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400 bg-slate-50/50 rounded-xl p-4 text-center border border-dashed border-slate-200">No local city transport avenues mapped onto this itinerary.</p>
              )}
            </div>

          </div>

          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-2xs space-y-5">
              <h4 className="font-black text-slate-800 text-base border-b border-slate-50 pb-2">Itinerary Manifest Status</h4>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Itinerary Allocation Name</p>
                  <p className="font-black text-slate-700 text-sm truncate">{formData.title || "Pending Identifier Input"}</p>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-9 h-9 bg-[#00A699]/10 rounded-xl flex items-center justify-center text-[#00A699] shrink-0"><MapPin size={16} /></div>
                  <div className="truncate"><p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Destination Spot</p><p className="font-black text-slate-800 text-xs truncate">{activePlace ? activePlace.name : "Unassigned"}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-9 h-9 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0"><Hotel size={16} /></div>
                  <div className="truncate">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Stay Node</p>
                    <p className="font-black text-slate-800 text-xs truncate">{activeHotel ? `${activeHotel.name} (${totalNights} Nights)` : "None Allocated"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0"><Layers size={16} /></div>
                  <div className="truncate"><p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Transit Channels</p><p className="font-black text-slate-800 text-xs truncate">{formData.transportOptions.length} Systems Mapped</p></div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Total Valuation</span>
                  <div className="text-right">
                    <p className="font-black text-[#00A699] text-lg">₹{grossCalculatedCost.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Gross Cost</p>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full mt-2 py-4 bg-[#00A699] text-white rounded-2xl font-black text-sm hover:bg-[#008d82] transition-all shadow-sm tracking-wide">
                {id ? "Commit System Modifications" : "Complete Document Compilation"}
              </button>
            </div>
          </div>

        </form>
      </div>

      <SearchSelectorModal 
        isOpen={activeModal === 'place'} onClose={() => setActiveModal(null)}
        title="Search & Assign Destination Spot" items={places}
        selectedId={formData.placeId} onSelect={(pId) => setFormData(prev => ({ ...prev, placeId: pId, hotelId: '', transportOptions: [] }))}
      />

      <SearchSelectorModal 
        isOpen={activeModal === 'hotel'} onClose={() => setActiveModal(null)}
        title="Search & Assign Accommodation" items={filteredHotels}
        selectedId={formData.hotelId} onSelect={(hId) => setFormData(prev => ({ ...prev, hotelId: hId }))}
      />

      <SearchSelectorModal 
        isOpen={activeModal === 'transport'} onClose={() => setActiveModal(null)}
        title="Manage City Transit Options" items={filteredTransports} searchKey="providerName" subKey="mode"
        selectedId={formData.transportOptions} onSelect={handleTransportToggle}
      />
    </div>
  );
};

export default TripForm;