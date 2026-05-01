import { AnimatePresence , motion } from "framer-motion";
import { Plus , X , ImageIcon , Trash2} from "lucide-react";
import { useEffect, useState } from "react";
import { formatGoogleDriveUrl } from "../../util/formatGoogleDriveUrl";

const MultiPhotoModal = ({ isOpen, onClose, images, onSync }) => {
const [tempLinks, setTempLinks] = useState([]);
  
  const updateLink = (index, val) => {
    const updated = [...tempLinks];
    updated[index] = formatGoogleDriveUrl(val);
    setTempLinks(updated);
  };
  
  useEffect(() => {
    if (images) {
      setTempLinks(images);
    }
  }, [images, isOpen]);

  const addField = () => setTempLinks([...tempLinks, ""]);

  const removeLink = (index) => setTempLinks(tempLinks.filter((_, i) => i !== index));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 " />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-h-[80vh] flex flex-col">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Gallery Nodes</h2>
              <button onClick={onClose} className="p-2 bg-slate-50 rounded-full"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {tempLinks.map((link, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-slate-200">
                    {link ? <img src={link} referrerPolicy="no-referrer" className="w-full h-full object-cover" /> : <ImageIcon className="m-auto h-full text-slate-200" size={20}/>}
                  </div>
                  <input 
                    className="flex-1 bg-transparent outline-none font-medium text-sm" 
                    placeholder="Paste Drive Link..." 
                    value={link} 
                    onChange={(e) => updateLink(idx, e.target.value)}
                  />
                  <button onClick={() => removeLink(idx)} className="text-red-400 p-2"><Trash2 size={16}/></button>
                </div>
              ))}
              <button onClick={addField} className="w-full py-4 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs uppercase hover:bg-slate-50 transition-all">
                <Plus size={18} /> Add Photo Slot
              </button>
            </div>

            <button 
              onClick={() => { onSync(tempLinks.filter(l => l !== "")); onClose(); }}
              className="mt-8 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
            >
              Sync Gallery ({tempLinks.length})
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MultiPhotoModal