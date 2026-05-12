import Place from "../schemas/Place.js";
import City from "../schemas/Cities.js";
import mongoose from "mongoose";


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
    const { name, cityId, cityName, category, overview, images, entryFee, timings, location, isPopular } = req.body;

    if (!name || !cityId || !cityName || !overview || !images?.length) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    const cityExists = await City.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({ success: false, message: "Linked City node not found" });
    }

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
      createdBy: req.user?._id 
    });

    await City.findByIdAndUpdate(cityId, { $inc: { placeCount: 1 } });

    return res.status(201).json({ success: true, data: newPlace });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Place name already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchPlacesByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;

    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid City ID" });
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

    const place = await Place.findById(id).populate("cityId", "cityName");

    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    return res.status(200).json({ success: true, data: place });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
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
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ success: false, message: "Place not found" });
    }

    const cityId = place.cityId;
    await place.deleteOne();

    // Sync count with City
    await City.findByIdAndUpdate(cityId, { $inc: { placeCount: -1 } });

    return res.status(200).json({ success: true, message: "Place removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};