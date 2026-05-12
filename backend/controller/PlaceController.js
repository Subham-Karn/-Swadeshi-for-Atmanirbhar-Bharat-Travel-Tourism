import Place from "../schemas/Place.js";
import City from "../schemas/Cities.js";
import mongoose from "mongoose";

export const createPlace = async (req, res) => {
  try {
    const { name, cityId, cityName, category, overview, images, entryFee, timings, location, isPopular } = req.body;

    // 1. Basic Validation
    if (!name || !cityId || !cityName || !overview || !images?.length) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    // 2. Verify City Exists
    const cityExists = await City.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({ success: false, message: "Linked City node not found" });
    }

    // 3. Create Place
    const newPlace = await Place.create({
      name,
      cityId,
      cityName,
      category,
      overview,
      images,
      entryFee,
      timings,
      location,
      isPopular,
      createdBy: req.user?._id // Assuming you have auth middleware
    });

    return res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Place name already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPlaces = async (req, res) => {
  try {
    const { cityId, category, search, popular } = req.query;
    let query = {};

    // Filters
    if (cityId) query.cityId = cityId;
    if (category) query.category = category.toLowerCase();
    if (popular) query.isPopular = popular === 'true';

    // Text Search Logic
    if (search) {
      query.$text = { $search: search };
    }

    const places = await Place.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: places.length, data: places });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate("cityId", "stateName");
    
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.status(200).json({ success: true, data: place });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Invalid ID format" });
  }
};


export const getPlaceCountByCityId = async (req , res)=>{
  try {
      const {cityId} = req.params;
      if(!cityId){
        return res.status(400).json({success:false , message:"City ID is required"});
      }
      if(!mongoose.isValidObjectId(cityId)){
        return res.status(400).json({success:false , message:"Invalid City ID format"});
      }
      const count = await Place.countDocuments({cityId: new mongoose.Types.ObjectId(cityId)});
      return res.status(200).json({success:true , count});

  } catch (error) {
    return res.status(500).json({success:false , message:error.message});
  }
}


export const updatePlace = async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.status(200).json({ success: true, data: updatedPlace });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.status(200).json({ success: true, message: "Place removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};