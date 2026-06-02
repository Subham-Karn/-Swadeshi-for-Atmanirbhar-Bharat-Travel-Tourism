import { Search } from "lucide-react";
import React, { useState } from "react";

const FilterTool = ({
  setFilterType,
  filterType,
  searchQuery,
  setSearchQuery,
  selectData = [],
  selectTitle = "NA",
}) => {
    
  return (
    <div className="flex flex-col lg:flex-row gap-4 my-6">
      <div className="relative flex-1">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
          size={18}
        />
        <input
          type="text"
          placeholder="Search by City Name..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:border-[#00A699] font-bold text-sm transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="px-8 py-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 shadow-sm outline-none cursor-pointer"
      >
        <option value="All">All {selectTitle}</option>
        {selectData.map((t) => (
          <option key={t} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterTool;
