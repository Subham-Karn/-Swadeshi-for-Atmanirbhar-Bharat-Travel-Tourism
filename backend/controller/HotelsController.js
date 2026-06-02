import Hotel from "../schemas/Hotels.js"; 
import City from "../schemas/Cities.js";
import mongoose from "mongoose";


export const createHotel = async (req, res) => {
  try {
    const { cityId, cityName } = req.params; 
    const { 
      name, 
      location, 
      description, 
      tier, 
      amenities, 
      pricePerNight, 
      rating, 
      coverImage, 
      images, 
      contactNumber, 
      bookingLink, 
      isFeatured,
      nearbyPlaces 
    } = req.body;

    if (!name || !location || !description || !pricePerNight || !coverImage) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing mandatory fields: name, location, description, pricePerNight, or coverImage." 
      });
    }

    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid linked City Object ID structure." });
    }


    const cityExists = await City.findById(cityId);
    if (!cityExists) {
      return res.status(404).json({ success: false, message: "Parent City node reference not found inside database index." });
    }
    const newHotel = await Hotel.create({
      name,
      cityId,
      cityName: cityName || cityExists.cityName,
      nearbyPlaces: nearbyPlaces || [], 
      location,
      description,
      tier: tier ? tier.toLowerCase().trim() : "mid-range",
      amenities: amenities || [],
      pricePerNight: Number(pricePerNight),
      rating: rating ? Number(rating) : 4.0,
      coverImage,
      images: images || [coverImage],
      contactNumber,
      bookingLink,
      isFeatured: isFeatured || false,
      createdBy: req.user?._id 
    });

    return res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHotelsByCityId = async (req, res) => {
  try {
    const { cityId } = req.params;

    if (!mongoose.isValidObjectId(cityId)) {
      return res.status(400).json({ success: false, message: "Invalid City reference format." });
    }

    const hotels = await Hotel.find({ cityId }).sort({ pricePerNight: 1 });
    return res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Object ID string format." });
    }

    // Hydrates the nearbyPlaces array with active live variables from the Place collection
    const hotel = await Hotel.findById(id)
      .populate("cityId", "cityName stateName")
      .populate("nearbyPlaces", "name category rating coverImage entryFee");

    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel profile index location entry not found." });
    }

    return res.status(200).json({ success: true, data: hotel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid format structure matching ID schema." });
    }

   
    if (req.body.tier) {
      req.body.tier = req.body.tier.toLowerCase().trim();
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { returnDocument: "after", runValidators: true } 
    );

    if (!updatedHotel) {
      return res.status(404).json({ success: false, message: "Targeted accommodation record not found." });
    }

    return res.status(200).json({ success: true, data: updatedHotel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid validation string pattern." });
    }

    const deletedHotel = await Hotel.findByIdAndDelete(id);
    if (!deletedHotel) {
      return res.status(404).json({ success: false, message: "Target accommodation record not found." });
    }

    return res.status(200).json({ success: true, message: "Hotel resource purged successfully from platform log registries." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};