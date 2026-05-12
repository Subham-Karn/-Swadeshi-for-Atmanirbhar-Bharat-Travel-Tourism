import State from "../schemas/States.js";
import City from "../schemas/Cities.js";

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
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res
        .status(404)
        .json({ success: false, message: "State not found" });
    }

    await City.deleteMany({ regionId: state._id });
    await state.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "State and associated cities purged" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
