import State from "../schemas/States.js";
import City from "../schemas/Cities.js";

export const createRegion = async (req, res) => {
  try {
    const { stateData, cityData, userId } = req.body;

    // 1. Validation
    if (!stateData || !cityData || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required State, City, or User identification." 
      });
    }

    // 2. Check if State already exists
    let state = await State.findOne({ stateName: stateData.stateName });

    if (!state) {
      // Create new State if it doesn't exist
      state = await State.create({
        uid: userId,
        regionType: stateData.regionType,
        stateName: stateData.stateName,
        stateImage: stateData.stateImage,
        citiesCount: stateData.citiesCount || 1,
        status: stateData.status || "Active",
        isPopular: stateData.isPopular || false,
        rating: stateData.rating || 0,
        overview: stateData.overview,
        bestTimeToVisit: stateData.bestTimeToVisit,
        reach: stateData.reach,
      });
    } else {
      // If State exists, increment the city count
      state.citiesCount += 1;
      await state.save();
    }

    // 3. Create the City linked to the State
    const city = await City.create({
      uid: userId,
      regionId: state._id, // The bridge between State and City
      regionType: state.regionType,
      cityName: cityData.cityName,
      cityImage: cityData.cityImage,
      isPopular: cityData.isPopular || false,
      overview: cityData.overview,
      bestTimeToVisit: cityData.bestTimeToVisit,
      rating: cityData.rating || 0,
    });

    res.status(201).json({
      success: true,
      message: "Region workflow completed successfully.",
      data: {
        state,
        city
      }
    });

  } catch (error) {
    console.error("Region Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
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


// Update State or City
export const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, updateData } = req.body; // type: 'state' or 'city'

    if (type === "state") {
      const updatedState = await State.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: updatedState });
    }

    if (type === "city") {
      const updatedCity = await City.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: updatedCity });
    }

    res.status(400).json({ success: false, message: "Invalid type specified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete Region Logic
export const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query; // type: 'state' or 'city'

    if (type === "state") {
      // 1. Delete the State
      const deletedState = await State.findByIdAndDelete(id);
      if (!deletedState) return res.status(404).json({ message: "State not found" });

      // 2. Cascade Delete: Remove all cities belonging to this state
      await City.deleteMany({ regionId: id });

      return res.status(200).json({ 
        success: true, 
        message: "State and all associated cities deleted successfully." 
      });
    }

    if (type === "city") {
      // 1. Find city to get the regionId before deleting
      const city = await City.findById(id);
      if (!city) return res.status(404).json({ message: "City not found" });

      // 2. Delete the City
      await City.findByIdAndDelete(id);

      // 3. Decrement the citiesCount in the parent State
      await State.findByIdAndUpdate(city.regionId, { $inc: { citiesCount: -1 } });

      return res.status(200).json({ success: true, message: "City deleted successfully." });
    }

    res.status(400).json({ success: false, message: "Invalid type specified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};