import React from 'react';
import { AlignLeft, Maximize2 } from 'lucide-react';

const OverviewInput = ({ value, onChange, title, placeholder }) => {
  return (
    <div className="space-y-2">
      {/* Label Section */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <AlignLeft size={14} className="text-[#00A699]" />
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {title || "Overview"}
          </label>
        </div>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">
          {value?.length || 0} Characters
        </span>
      </div>

      {/* Textarea Container */}
      <div className="relative group">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Describe the location, history, and key highlights..."}
          className="w-full min-h-50 p-6 bg-slate-50 rounded-xl border-2 border-transparent 
                     text-sm text-slate-600 leading-relaxed outline-none transition-all duration-300
                     placeholder:text-slate-300 focus:bg-white focus:border-[#00A699] 
                     focus:ring-4 focus:ring-teal-500/5 resize-none"
        />
        
        {/* Decorative corner icon */}
        <div className="absolute bottom-5 right-5 text-slate-200 group-focus-within:text-[#00A699] transition-colors">
          <Maximize2 size={14} />
        </div>
      </div>
      
      <p className="px-4 text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">
        * Standard text formatting: Press Enter for new paragraphs.
      </p>
    </div>
  );
};

export default OverviewInput;