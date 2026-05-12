import mongoose from "mongoose";
import City from "../schemas/Cities.js";
import State from "../schemas/States.js";

export const createCity = async (req, res) => {
  // Start a Mongoose Session for Atomic Transactions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      regionId,
      regionType,
      cityName,
      cityImages,
      isPopular,
      overview,
      bestTimeToVisit,
      rating,
    } = req.body;

    if (!regionId || !cityName || !overview) {
      return res.status(400).json({
        success: false,
        message: "Required fields: regionId, cityName, and overview.",
      });
    }
    if (!mongoose.isValidObjectId(regionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Region (State) ID." });
    }
    const existingCity = await City.findOne({ cityName, regionId }).session(
      session,
    );
    if (existingCity) {
      return res.status(409).json({
        success: false,
        message: "A city with this name already exists in this state.",
      });
    }
    const stateExists = await State.findById(regionId).session(session);
    if (!stateExists) {
      return res
        .status(404)
        .json({
          success: false,
          message: "The parent State/Region does not exist.",
        });
    }

    const city = await City.create(
      [
        {
          uid: req.user?._id,
          regionId,
          regionType,
          cityName,
          cityImages: cityImages || [],
          isPopular: isPopular || false,
          overview,
          bestTimeToVisit,
          rating: rating || 0,
          createdAt: new Date(),
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "City created and state count updated successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const fetchCitiesByState = async (req, res) => {
  try {
    const { regionId } = req.params;
    if (!regionId) {
      return res.status(400).json({
        success: false,
        message: "Region ID is required",
      });
    }

    if (!mongoose.isValidObjectId(regionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Region ID format",
      });
    }
    const cities = await City.find({
      regionId: new mongoose.Types.ObjectId(regionId),
    })
      .populate("uid", "name")
      .sort({ cityName: 1 })
      .lean();
    return res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error("FetchCities Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const fetchCityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid City ID format" 
      });
    }

    const city = await City.findById(id).populate("uid", "name");

    if (!city) {
      return res.status(404).json({ 
        success: false, 
        message: "City not found" 
      });
    }

    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid City ID format" 
      });
    }

    const city = await  City.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument:"after", runValidators: true }
    );

    if (!city) {
      return res.status(404).json({ 
        success: false, 
        message: "City not found" 
      });
    }

    res.status(200).json({ success: true, data: city });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCity = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: "Invalid City ID format" 
      });
    }

    const city = await City.findById(id).session(session);

    if (!city) {
      await session.abortTransaction();
      return res.status(404).json({ 
        success: false, 
        message: "City not found" 
      });
    }

    const regionId = city.regionId;

    await city.deleteOne({ session });

    await State.findByIdAndUpdate(
      regionId, 
      { $inc: { citiesCount: -1 } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "City node purged" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
