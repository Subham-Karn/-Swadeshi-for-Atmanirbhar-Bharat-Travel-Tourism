import mongoose from "mongoose";
import City from "../schemas/Cities.js";
import State from "../schemas/States.js";

export const createCity = async (req, res) => {
  try {
    const { regionId, regionType, cityName, cityImages, isPopular, overview, bestTimeToVisit, rating } = req.body;

    const city = await City.create({
      uid: req.user?._id,
      regionId,
      regionType,
      cityName,
      cityImages,
      isPopular,
      overview,
      bestTimeToVisit,
      rating
    });

    await State.findByIdAndUpdate(regionId, { $inc: { citiesCount: 1 } });

    res.status(201).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const fetchCitiesByState = async (req, res) => {
  try {
    const { regionId } = req.params;
    if (!regionId) {
      return res.status(400).json({ 
        success: false, 
        message: "Region ID is required" 
      });
    }

    if (!mongoose.isValidObjectId(regionId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Region ID format" 
      });
    }
    const cities = await City.find({ 
      regionId: new mongoose.Types.ObjectId(regionId) 
    })
    .populate("uid", "name")
    .sort({ cityName: 1 })
    .lean();
    return res.status(200).json({ 
      success: true, 
      count: cities.length, 
      data: cities 
    });

  } catch (error) {
    console.error("FetchCities Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

export const fetchCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate("uid", "name email");
    if (!city) return res.status(404).json({ success: false, message: "City not found" });
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    const city = await City.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!city) return res.status(404).json({ success: false, message: "City not found" });
    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: "City not found" });

    const regionId = city.regionId;
    await city.deleteOne();
    await State.findByIdAndUpdate(regionId, { $inc: { citiesCount: -1 } });

    res.status(200).json({ success: true, message: "City node purged" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};