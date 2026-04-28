import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, X, Check } from 'lucide-react';
import { useRegionsStore } from '../../store/useRegionStore';

const StatePickerModal = ({ isOpen, onClose, onSelect, currentState }) => {
  const { regions } = useRegionsStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStates = regions.filter(s => 
    s.stateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-gray-900/40 " 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Select State</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-400"><X size={20}/></button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search existing states..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#00A699] rounded-2xl font-bold transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-75 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {filteredStates.map((state) => (
              <button
                key={state._id}
                onClick={() => { onSelect(state); onClose(); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  currentState === state.stateName ? 'border-[#00A699] bg-teal-50' : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img src={state.stateImage} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="font-black text-gray-800">{state.stateName}</span>
                </div>
                {currentState === state.stateName && <Check size={18} className="text-[#00A699]" />}
              </button>
            ))}

            {filteredStates.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-400 font-bold mb-4">No state found for "{searchTerm}"</p>
                <button 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#00A699] text-white rounded-xl font-black text-sm shadow-lg shadow-teal-100"
                  onClick={() => {
                     // Logic to toggle to "Add New State" mode or send value back
                     onSelect({ stateName: searchTerm, isNew: true });
                     onClose();
                  }}
                >
                  <Plus size={18} /> ADD AS NEW STATE
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatePickerModal;