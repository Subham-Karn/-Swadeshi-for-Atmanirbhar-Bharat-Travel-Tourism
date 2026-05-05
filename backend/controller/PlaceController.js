import Place from "../schemas/Place.js";
import City from "../schemas/Cities.js";
// CREATE a new Place

const createPlace = async (req, res) => {
  try {
    const { name, cityId, cityName, category, images, coverImage, overview } =
      req.body;

    // Basic validation
    if (!name || !cityId || !cityName || !overview) {
      return res
        .status(400)
        .json({ error: "Name, City, and Overview are required fields." });
    }

    // Check if a place with the same name already exists in the same city
    const existingPlace = await Place.findOne({ name, cityId });
    if (existingPlace) {
      return res.status(400).json({
        error: "A place with the same name already exists in the same city.",
      });
    }

    // Check if a place with the same name already exists in any city
    const existingPlaceInAnyCity = await Place.findOne({ name });
    if (existingPlaceInAnyCity) {
      return res.status(400).json({
        error: "A place with the same name already exists in another city.",
      });
    }

    const newPlace = new Place({
      name,
      cityId,
      cityName,
      category,
      images,
      coverImage,
      overview,
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getCityById = async (req, res) => {
  try {
    const { cityId } = req.params;

    // Validate cityId
    if (!cityId) {
      return res.status(400).json({ error: "City ID is required" });
    }

    // Find city
    const city = await City.findById(cityId);
    // Check if city exists
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    // Prepare response
    const cityInfo = {
      _id: city._id,
      cityName: city.cityName,
      cityImages: city.cityImages?.[0] || null, 
    };

    res.status(200).json(cityInfo);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updatePlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { name, cityId, cityName, category, images, coverImage, overview } =
      req.body;

    // Validate placeId
    if (!placeId) {
      return res.status(400).json({ error: "Place ID is required" });
    }

    // Check if the place exists    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // Update the place
    place.name = name || place.name;
    place.cityId = cityId || place.cityId;
    place.cityName = cityName || place.cityName;
    place.category = category || place.category;
    place.images = images || place.images;
    place.coverImage = coverImage || place.coverImage;
    place.overview = overview || place.overview;

    const updatedPlace = await place.save();
    res.status(200).json({
      message: "Place updated successfully",
      success: true,
      place: updatedPlace,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getPlacesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    // Validate cityId
    if (!cityId) {
      return res.status(400).json({ error: "City ID is required" });
    }

    // Check if the city exists
    const city = await Place.findById(cityId);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    // Find all places that belong to the specified city
    const places = await Place.find({ cityId });
    res.status(200).json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getPlaceById = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Validate placeId
    if (!placeId) {
      return res.status(400).json({ error: "Place ID is required" });
    }

    // Check if the place exists
    if (!placeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid Place ID format" });
    }

    // Check if the place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res
      .status(200)
      .json({ message: "Place retrieved successfully", success: true, place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const deletePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    // Validate placeId
    if (!placeId) {
      return res.status(400).json({ error: "Place ID is required" });
    }

    // Check if the place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    // Delete the place
    await Place.findByIdAndDelete(placeId);
    res
      .status(200)
      .json({ message: "Place deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const PlaceController = {
  createPlace,
  updatePlace,
  getPlacesByCity,
  getPlaceById,
  deletePlace,
  getCityById,
};

export default PlaceController;
