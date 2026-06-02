import Trip from "../schemas/Trip.js";
import mongoose from "mongoose";

export const createTrip = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { 
      title, userId, placeId, hotelId, transportOptions, 
      startDate, endDate, customNotes, status, budgetCalculation 
    } = req.body;

    if (!title || !userId || !placeId || !startDate || !endDate) {
      return res.status(422).json({
        success: false,
        message: "Missing required validation fields: title, userId, placeId, startDate, and endDate must be defined."
      });
    }

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(placeId)) {
      return res.status(422).json({ success: false, message: "Invalid relational format detected for user or target place." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ success: false, message: "Invalid timeline matrix. Start date must occur before the end date." });
    }

    const diffTime = Math.abs(end - start);
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const newTrip = new Trip({
      title,
      userId,
      placeId,
      hotelId: hotelId || null,
      transportOptions: transportOptions || [],
      startDate: start,
      endDate: end,
      numberOfDays,
      customNotes: Array.isArray(customNotes) ? customNotes : customNotes ? [customNotes] : [],
      status: status || 'upcoming',
      budgetCalculation: {
        estimatedTotalCost: Number(budgetCalculation?.estimatedTotalCost) || 0,
        currency: budgetCalculation?.currency || 'INR'
      }
    });

    await newTrip.save({ session });
    await session.commitTransaction();

    const populatedTrip = await Trip.findById(newTrip._id)
      .populate("placeId", "name cityName coverImage location category")
      .populate("hotelId", "name pricePerNight location tier")
      .lean();

    return res.status(201).json({ 
      success: true, 
      message: "Trip itinerary compiled and registered successfully.",
      data: populatedTrip 
    });

  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllTripsForAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status.toLowerCase().trim();
    }
    if (search) {
      query.$text = { $search: search };
    }

    const [trips, totalRecords] = await Promise.all([
      Trip.find(query)
        .populate("placeId", "name cityName location")
        .populate("hotelId", "name pricePerNight tier")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Trip.countDocuments(query)
    ]);

    return res.status(200).json({ 
      success: true, 
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        hasNextPage: page * limit < totalRecords
      },
      data: trips 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID format." });
    }

    const trip = await Trip.findById(id)
      .populate("placeId")
      .populate("hotelId")
      .populate("transportOptions")
      .lean();

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip itinerary could not be located." });
    }

    return res.status(200).json({
      success: true,
      data: trip
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Malformed or invalid User ID reference format." });
    }

    const trips = await Trip.find({ userId })
      .populate("placeId", "name cityName coverImage location category overview rating entryFee timings bestTime")
      .populate("hotelId", "name location description tier amenities pricePerNight rating coverImage images contactNumber bookingLink")
      .populate("transportOptions", "mode providerName routes timings frequency estimatedCost coverage tips")
      .sort({ startDate: 1 })
      .lean();

    return res.status(200).json({ 
      success: true, 
      count: trips.length,
      data: trips 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTripByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID format." });
    }

    const { customNotes } = req.body;
    const updateData = { ...req.body };

    if (customNotes) {
      updateData.customNotes = Array.isArray(customNotes) ? customNotes : [customNotes];
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    .populate("placeId", "name cityName")
    .populate("hotelId", "name pricePerNight")
    .lean();

    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: "Trip configuration profile not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: updatedTrip
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID format." });
    }

    const validStatuses = ['draft', 'upcoming', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status.toLowerCase().trim())) {
      return res.status(400).json({ success: false, message: `Invalid status configuration. Value must match: ${validStatuses.join(', ')}` });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: { status: status.toLowerCase().trim() } },
      { new: true, runValidators: true }
    )
    .populate("placeId", "name cityName")
    .lean();

    if (!updatedTrip) {
      return res.status(404).json({ success: false, message: "Target trip profile record could not be found." });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Trip status execution tier altered dynamically.",
      data: updatedTrip 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid Trip ID format." });
    }

    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({ success: false, message: "Target trip profile record could not be found." });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Trip itinerary systematically purged from cloud document datastore storage pools." 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};