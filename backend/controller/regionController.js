import State from "../schemas/States.js";
import City from "../schemas/Cities.js";

export const createRegion = async (req, res) => {
  try {
    // 1. Destructure exactly what the frontend sends
    const { state, cities, userId } = req.body;
    // 2. Strict Validation Check
    if (!state || !cities || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing: ${!state ? 'State ' : ''}${!cities ? 'Cities ' : ''}${!userId ? 'User' : ''}` 
      });
    }

    // 3. Find or Create State
    let stateDoc = await State.findOne({ stateName: state.stateName });

    if (!stateDoc) {
      stateDoc = await State.create({
        uid: userId,
        regionType: state.regionType,
        stateName: state.stateName,
        stateImage: state.stateImage,
        citiesCount: state.citiesCount || cities.length,
        status: state.status || "Active",
        isPopular: state.isPopular || false,
        bestTimeToVisit: state.bestTimeToVisit ||"NA",
        overview: state.overview || state.stateOverview,
        reach: state.reach,
      });
    } else {
      stateDoc.citiesCount += cities.length;
      await stateDoc.save();
    }

    // 4. Create all Cities from the array
    const createdCities = await Promise.all(
      cities.map(item => City.create({
        uid: userId,
        regionId: stateDoc._id,
        regionType: stateDoc.regionType,
        cityName: item.cityName,
        cityImage: item.imageUrl, // Mapping frontend 'imageUrl' to backend 'cityImage'
        overview: item.overview, // Mapping frontend 'description' to backend 'overview'
        isPopular: item.isPopular || false
      }))
    );

    res.status(201).json({ success: true, data: { state: stateDoc, cities: createdCities } });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStates = async (req, res) => {
  try {
    const states = await State.find({ status: "Active" }).sort({ stateName: 1 });
    res.status(200).json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching states" });
  }
};


export const getCitiesByState = async (req, res) => {
  try {
    const { stateId } = req.params;
    const cities = await City.find({ regionId: stateId });
    res.status(200).json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cities" });
  }
};


export const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { state: stateData, cities: citiesArray, userId } = req.body;
    const updatedState = await State.findByIdAndUpdate(
      id,
      { $set: stateData },
      { returnDocument:"after", runValidators: true }
    );

    if (!updatedState) return res.status(404).json({ success: false, message: "State not found" });
    await City.deleteMany({ regionId: id });
    
    if (citiesArray && citiesArray.length > 0) {
      const cityDocs = citiesArray.map(city => ({
        ...city,
        uid: userId,
        regionId: id,
        regionType: updatedState.regionType,
        cityImage: city.imageUrl,
        overview: city.overview
      }));
      await City.insertMany(cityDocs);
    }

    res.status(200).json({ success: true, data: updatedState });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedState = await State.findByIdAndDelete(id);
    if (!deletedState) return res.status(404).json({ success: false, message: "State not found" });
    await City.deleteMany({ regionId: id });

    res.status(200).json({ success: true, message: "Region and all cities deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const deleteCityByState = async (req , res) =>{
  const {id} = req.params
  try {
    const deletedCity = await City.findByIdAndDelete(id);
    if (!deletedCity) return res.status(404).json({ success: false, message: "City not found" });
    res.status(200).json({ success: true, message: "City deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}