import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X, Loader2, ShieldAlert } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm, title, itemName, isLoading }) => {
  const [inputValue, setInputValue] = useState("");
  const isMatch = inputValue.trim() === itemName;
  useEffect(() => {
    if (!isOpen) setInputValue("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 "
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 pb-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
              {title || "Confirm Deletion"}
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              This action is permanent. All associated data and nodes linked to 
              <span className="text-slate-900 font-bold"> {itemName} </span> will be purged.
            </p>
          </div>

          {/* Input Verification */}
          <div className="px-8 py-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Type <span className="text-red-500 underline">{itemName}</span> to confirm
              </label>
              <input 
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter resource name..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-red-500 font-bold text-sm transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 pt-2 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button 
              disabled={!isMatch || isLoading}
              onClick={onConfirm}
              className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg
                ${isMatch && !isLoading 
                  ? 'bg-red-500 text-white shadow-red-100 hover:bg-red-600 active:scale-95' 
                  : 'bg-slate-200 text-white cursor-not-allowed shadow-none'}`}
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              Confirm Purge
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteModal;