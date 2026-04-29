import { AnimatePresence , motion } from "framer-motion";
import { Building2, ChevronRight , X , Hash} from "lucide-react";

const CityCountModal = ({ isOpen, onClose, onCitySelect, currentCount }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-5">
          {/* Backdrop with Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-50"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-[#00A699]">
                  <Building2 size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                  City Configuration
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 pt-4 space-y-8">
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Enter the number of cities you wish to deploy in this territory. This will generate dynamic nodes for data entry.
              </p>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] ml-2">
                  City Count (Nodes)
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00A699] transition-colors">
                    <Hash size={18} />
                  </div>
                  <input 
                    type="number" 
                    placeholder="e.g. 5"
                    defaultValue={currentCount}
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-[#00A699] focus:bg-white rounded-3xl outline-none font-black text-slate-900 transition-all text-lg shadow-inner"
                    onChange={(e) => onCitySelect(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={onClose}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00A699] transition-all shadow-xl shadow-slate-200 group"
              >
                Sync Data Nodes
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CityCountModal