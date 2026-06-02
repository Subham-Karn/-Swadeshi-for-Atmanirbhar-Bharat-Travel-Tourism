import State from "../schemas/States.js";
import City from "../schemas/Cities.js";
import Transport from "../schemas/Transport.js";
import Hotel from "../schemas/Hotels.js";
import Place from "../schemas/Place.js";

export const createRegion = async (req, res) => {
  try {
    const {
      stateName,
      regionType,
      stateImage,
      overview,
      bestTimeToVisit,
      reach,
      isPopular,
      status,
    } = req.body;

    const existingState = await State.findOne({ stateName });
    if (existingState) {
      return res
        .status(400)
        .json({ success: false, message: "State already registered" });
    }

    const state = await State.create({
      uid: req.user?._id,
      stateName,
      regionType,
      stateImage,
      overview,
      bestTimeToVisit,
      reach,
      isPopular,
      status,
    });

    res.status(201).json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchStates = async (req, res) => {
  try {
    const states = await State.find()
    .populate("uid", "name")
    .sort({ stateName: 1 });
    res.status(200).json({ success: true, count: states.length, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id).populate(
      "uid",
      "name email",
    );
    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }
    res.status(200).json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRegion = async (req, res) => {
  try {
    const state = await State.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    res.status(200).json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRegion = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Region/State ID format" 
      });
    }
    const state = await State.findById(id).session(session);
    if (!state) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "State not found" });
    }
    const linkedCities = await City.find({ regionId: id }).select("_id").session(session);
    const cityIds = linkedCities.map(city => city._id);
    if (cityIds.length > 0) {
      await Place.deleteMany({ cityId: { $in: cityIds } }).session(session);
      await Hotel.deleteMany({ cityId: { $in: cityIds } }).session(session);
      await Transport.deleteMany({ cityId: { $in: cityIds } }).session(session);
      await City.deleteMany({ regionId: id }).session(session);
    }
    await state.deleteOne({ session });
    await session.commitTransaction();
    return res.status(200).json({ 
      success: true, 
      message: "Region/State and all deeply nested hierarchy data trees (Cities, Places, Hotels, Transports) cleanly purged." 
    });

  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};
