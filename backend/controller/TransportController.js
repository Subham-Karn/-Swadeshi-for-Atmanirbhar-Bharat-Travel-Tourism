import Transport from "../schemas/Transport.js"; // Ensure file casing aligns with your project
import City from "../schemas/Cities.js";
import mongoose from "mongoose";

export const createTransport = async (req, res) => {
  try {
    const { cityId, cityName } = req.params; 
    const { 
      mode, 
      providerName, 
      routes, 
      timings, 
      frequency, 
      estimatedCost, 
      coverage, 
      tips,
      connectedPlaces 
    } = req.body;

    if (!mode || !providerName || !routes?.length || !timings || !estimatedCost) {
      return res.status(400).json({ 
        success: false, 
        message: "Mandatory schema fields missing: mode, providerName, routes array, timings, and estimatedCost description are required." 
      });
    }

    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid City Object ID format string pattern." });
    }

    const cityExists = await City.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({ success: false, message: "Linked parent City node parameters could not be found inside index." });
    }

    const newTransport = await Transport.create({
      mode: mode.toLowerCase().trim(), 
      cityId,
      cityName: cityName || cityExists.cityName,
      connectedPlaces: connectedPlaces || [], 
      providerName,
      routes,
      timings: timings || "6:00 AM - 10:00 PM", 
      frequency,
      estimatedCost: estimatedCost || "Varies",
      coverage: coverage ? coverage.toLowerCase().trim() : "city-wide", 
      tips: tips || [],
      createdBy: req.user?._id 
    });

    return res.status(201).json({ success: true, data: newTransport });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllTransport = async (req, res) => {
  try {
    const transportLog = await Transport.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: transportLog.length, data: transportLog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getTransportByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;

    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid system City Object ID lookup string context." });
    }

    const cityRoutes = await Transport.find({ cityId }).sort({ mode: 1 });
    return res.status(200).json({ success: true, count: cityRoutes.length, data: cityRoutes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getTransportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid target ID format string." });
    }

    const transitLine = await Transport.findById(id)
      .populate("cityId", "cityName stateName")
      .populate("connectedPlaces", "name category coverImage rating"); // Pulls monument summaries for search drawers

    if (!transitLine) {
      return res.status(404).json({ success: false, message: "Transit network node reference profiles not found." });
    }

    return res.status(200).json({ success: true, data: transitLine });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateTransport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid lookup string context shape patterns." });
    }

    if (req.body.mode) req.body.mode = req.body.mode.toLowerCase().trim();
    if (req.body.coverage) req.body.coverage = req.body.coverage.toLowerCase().trim();

    const updatedTransit = await Transport.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedTransit) {
      return res.status(404).json({ success: false, message: "Operational transit line node index target missing." });
    }

    return res.status(200).json({ success: true, data: updatedTransit });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteTransport = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid standard schema identifier verification format." });
    }

    const removedNode = await Transport.findByIdAndDelete(id);
    if (!removedNode) {
      return res.status(404).json({ success: false, message: "Operational route document node profile missing." });
    }

    return res.status(200).json({ success: true, message: "Logistics profile row entry completely deleted from database indices." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};