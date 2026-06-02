import Place from "../schemas/Place.js";
import City from "../schemas/Cities.js";
import mongoose from "mongoose";
import Hotel from "../schemas/Hotels.js";
import Transport from "../schemas/Transport.js";

export const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ 
      success: true, 
      count: places.length, 
      data: places 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPlace = async (req, res) => {
  try {
    const { 
      name, 
      location, 
      cityId, 
      cityName, 
      category, 
      overview, 
      images, 
      coverImage, 
      entryFee, 
      bestTime, 
      timings, 
      isPopular 
    } = req.body;

    if (!name || !location || !cityId || !cityName || !overview || !images?.length) {
      return res.status(400).json({ 
        success: false, 
        message: "Required fields missing: name, location, cityId, cityName, overview, and images array are mandatory." 
      });
    }

    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid City Object ID format" });
    }


    const cityExists = await City.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({ success: false, message: "Linked City node not found" });
    }

    const newPlace = await Place.create({
      name,
      location,
      cityId,
      cityName,
      category: category ? category.toLowerCase().trim() : 'heritage',
      overview,
      images,
      coverImage: coverImage || images[0],
      entryFee: entryFee || "Free",
      bestTime,
      timings: timings || "9:00 AM - 6:00 PM",
      isPopular: isPopular || false,
      createdBy: req.user?._id 
    });

    // 4. Atomic Increment of parent counter metric
    await City.findByIdAndUpdate(cityId, { $inc: { placeCount: 1 } });

    return res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Place name already exists in database registry" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchPlacesByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;

    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid City ID format" });
    }

    const places = await Place.find({ cityId }).sort({ name: 1 });

    return res.status(200).json({ 
      success: true, 
      count: places.length, 
      data: places 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const fetchPlaceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const place = await Place.findById(id).populate("cityId", "cityName stateName overview rating");

    if (!place) {
      return res.status(404).json({ success: false, message: "Destination profile not found" });
    }

    return res.status(200).json({ success: true, data: place });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const fetchPlaceByIdForUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid ID format" 
      });
    }

    const place = await Place.findById(id).lean();
    if (!place) {
      return res.status(404).json({ 
        success: false, 
        message: "Destination profile not found" 
      });
    }

    const targetCityId = place.cityId?._id || place.cityId;

    const [nearbyHotels, transportOptions] = await Promise.all([
      Hotel.find({ cityId: targetCityId }).limit(6).lean(),
      Transport.find({ cityId: targetCityId }).lean()
    ]);

    const fullPlacePayload = {
      ...place,
      nearbyHotels: nearbyHotels || [],
      transport: transportOptions || []
    };

    return res.status(200).json({ 
      success: true, 
      data: fullPlacePayload 
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


export const getPlaceCountByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;
    
    if (!cityId) {
      return res.status(400).json({ success: false, message: "City ID parameter is required" });
    }
    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid City ID format" });
    }
    
    const count = await Place.countDocuments({ cityId: new mongoose.Types.ObjectId(cityId) });
    return res.status(200).json({ success: true, count });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase().trim();
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ success: false, message: "Target destination profile not found" });
    }

    return res.status(200).json({ success: true, data: updatedPlace });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ success: false, message: "Target destination profile not found" });
    }

    const cityId = place.cityId;
    await place.deleteOne();

    await City.findByIdAndUpdate(cityId, { $inc: { placeCount: -1 } });

    return res.status(200).json({ success: true, message: "Place profile removed successfully from active records" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};