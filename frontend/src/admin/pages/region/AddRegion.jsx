import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Globe, Save, Building2, MapPin, ImageIcon } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRegionsStore } from "../../../store/useRegionStore";

const AddRegion = () => {
  const { regionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { regions, cities } = useRegionsStore();

  const [formData, setFormData] = useState({
    regionType: "North India",
    state: "",
    stateImage: "",
    citiesCount: 0,
    status: "Active",
    reach: "High",
  });
  const [citiesData, setCitiesData] = useState([]);

  useEffect(() => {
    const isEditMode = location.pathname.endsWith("/edit");

    if (isEditMode && regionId) {
      const region = regions.find((r) => r.id === parseInt(regionId));
      const regionCities = cities.filter((c) => c.regionId === parseInt(regionId));

      if (region) {
        setFormData({
          regionType: region.regionType,
          state: region.state,
          stateImage: region.stateImage,
          citiesCount: regionCities.length,
          status: region.status,
          reach: region.reach,
        });
        // Map store data to your local form structure
        setCitiesData(regionCities.map(c => ({
          cityName: c.cityName || "",
          imageUrl: c.imageUrl || "",
          description: c.description || ""
        })));
      }
    } else {
      // Reset form for Add Mode
      setFormData({
        regionType: "North India",
        state: "",
        stateImage: "",
        citiesCount: 0,
        status: "Active",
        reach: "High",
      });
      setCitiesData([]);
    }
  }, [regionId, location.pathname, regions, cities]);

  const handleCitiesCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setFormData({ ...formData, citiesCount: count });

    const newCities = [...citiesData];
    if (count > newCities.length) {
      for (let i = newCities.length; i < count; i++) {
        newCities.push({ cityName: "", imageUrl: "", description: "" });
      }
    } else {
      newCities.splice(count);
    }
    setCitiesData(newCities);
  };

  const handleCityDataChange = (index, field, value) => {
    const updatedCities = [...citiesData];
    updatedCities[index][field] = value;
    setCitiesData(updatedCities);
  };

  const handleSubmit = () => {
    const finalPayload = { ...formData, cities: citiesData };
    console.log("Saving Data:", finalPayload);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#F7F7F7] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-[#00A699]">
          <ChevronLeft size={20} /> <span className="font-medium">Back</span>
        </button>
        <button onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-[#00A699] text-white font-bold shadow-lg flex items-center gap-2 hover:bg-[#008f84] transition-all">
          <Save size={18} /> {location.pathname.endsWith("/edit") ? "Update Region" : "Save Entire Region"}
        </button>
      </div>

      <div className="w-full space-y-8">
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Globe className="text-[#00A699]" /> Region Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Region Type</label>
                  <select
                    name="regionType"
                    value={formData.regionType}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A699] outline-none bg-gray-50"
                    onChange={(e) => setFormData({ ...formData, regionType: e.target.value })}
                  >
                    <option>North India</option>
                    <option>South India</option>
                    <option>West India</option>
                    <option>East India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">State Name</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state} // CRITICAL: Added value
                    placeholder="e.g. Kerala"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#00A699]"
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">State Image URL</label>
                <input
                  type="text"
                  name="stateImage"
                  value={formData.stateImage} // CRITICAL: Added value
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#00A699]"
                  onChange={(e) => setFormData({ ...formData, stateImage: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status} // CRITICAL: Added value
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00A699] outline-none bg-gray-50"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">How Many Cities?</label>
                  <input
                    type="number"
                    value={formData.citiesCount} // CRITICAL: Added value
                    className="w-full px-4 py-3 rounded-xl border-2 border-teal-100 bg-teal-50/30 outline-none focus:border-[#00A699] font-bold text-[#00A699]"
                    onChange={handleCitiesCountChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reach Level</label>
                <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({ ...formData, reach: level })}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                        formData.reach === level ? "bg-white text-[#00A699] shadow-sm" : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Cities */}
        <AnimatePresence>
          {citiesData.length > 0 ? (
            <div className="space-y-6">
              {citiesData.map((city, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00A699]"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <input 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#00A699]" 
                        placeholder="City Name" 
                        value={city.cityName} 
                        onChange={(e) => handleCityDataChange(index, "cityName", e.target.value)} 
                      />
                      <input 
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#00A699]" 
                        placeholder="Image URL" 
                        value={city.imageUrl} 
                        onChange={(e) => handleCityDataChange(index, "imageUrl", e.target.value)} 
                      />
                    </div>
                    <textarea 
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 outline-none focus:border-[#00A699] resize-none" 
                      placeholder="Description" 
                      rows="3" 
                      value={city.description} 
                      onChange={(e) => handleCityDataChange(index, "description", e.target.value)} 
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400">Enter city count above to edit locations</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AddRegion;