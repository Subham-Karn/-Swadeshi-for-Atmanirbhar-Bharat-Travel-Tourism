import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, List, Italic, Eye, Code, Info } from 'lucide-react';
import { parseCustomSyntax } from '../../engine/useTextEngine';

const TerritoryEditor = ({ value, onChange }) => {
  const [isPreview, setIsPreview] = useState(false);

  // Helper to inject syntax at cursor position
  const injectSyntax = (syntax) => {
    const textarea = document.getElementById('territory-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    const newValue = `${before}${syntax}${after}`;
    onChange({ target: { value: newValue } });
    
    // Reset focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntax.length, start + syntax.length);
    }, 0);
  };

  return (
    <div className="space-y-3">
      {/* 1. Header & Toolbar */}
      <div className="flex items-center justify-between px-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Territory Overview
        </label>
        
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 gap-1">
          <button 
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${!isPreview ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Editor
          </button>
          <button 
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isPreview ? 'bg-[#00A699] text-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* 2. Main Editor Area */}
      <div className="relative bg-white rounded-xl border border-gray-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        
        {/* Toolbar Suggestions */}
        {!isPreview && (
          <div className="flex items-center gap-2 p-3 border-b border-gray-50 bg-gray-50/50">
            <button onClick={() => injectSyntax('/h[]')} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-[#00A699] transition-all flex items-center gap-2 border border-transparent hover:border-gray-100">
              <Type size={14} /> <span className="text-[9px] font-black uppercase">Headline</span>
            </button>
            <button onClick={() => injectSyntax('/b{""}')} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-[#00A699] transition-all flex items-center gap-2 border border-transparent hover:border-gray-100">
              <List size={14} /> <span className="text-[9px] font-black uppercase">Bullet</span>
            </button>
            <button onClick={() => injectSyntax('/I""')} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-[#00A699] transition-all flex items-center gap-2 border border-transparent hover:border-gray-100">
              <Italic size={14} /> <span className="text-[9px] font-black uppercase">Italic</span>
            </button>
            <div className="ml-auto flex items-center gap-1.5 text-[9px] font-bold text-slate-300 uppercase tracking-widest px-2">
              <Info size={12} /> Use /h[] for Headers
            </div>
          </div>
        )}

        <div className="min-h-62.5 p-6">
          <AnimatePresence mode="wait">
            {!isPreview ? (
              <motion.textarea
                key="editor"
                id="territory-editor"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="w-full h-full min-h-50 outline-none font-mono text-sm text-slate-600 resize-none leading-relaxed bg-transparent"
                placeholder="Start typing or use /h[Headline] to style..."
                value={value}
                onChange={onChange}
              />
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="prose prose-slate max-w-none"
              >
                {value ? parseCustomSyntax(value) : <p className="text-slate-300 italic text-sm">Nothing to preview...</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TerritoryEditor;