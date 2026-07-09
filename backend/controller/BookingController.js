import Booking from "../schemas/Booking.js";
import Trip from "../schemas/Trip.js";
import mongoose from "mongoose";

export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { tripId, paidAmount, transactionId, seatsCount, gateway, customerDetails } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!userId || !tripId || !paidAmount || !customerDetails?.fullName || !customerDetails?.email || !customerDetails?.phone) {
      await session.abortTransaction();
      return res.status(422).json({ success: false, message: "Traveler details, trip, and payment amount are required." });
    }

    const tripExists = await Trip.findById(tripId);
    if (!tripExists) {
      await session.abortTransaction();
      return res.status(444).json({ success: false, message: "Target itinerary link configuration invalid." });
    }

    const newBooking = new Booking({
      userId,
      tripId,
      seatsCount: seatsCount || 1,
      paymentDetails: {
        transactionId: transactionId || `TXN-${Date.now()}`,
        paymentStatus: transactionId ? "completed" : "pending",
        paidAmount: Number(paidAmount),
        gateway: gateway || "Manual / UPI",
      },
      customerDetails,
      bookingStatus: transactionId ? "confirmed" : "pending"
    });

    await newBooking.save({ session });
    await session.commitTransaction();

    return res.status(201).json({ 
      success: true, 
      message: "Booking parameters compiled successfully", 
      data: newBooking 
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getAdminAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate({
        path: "tripId",
        populate: [
          { 
            path: "placeId", 
            select: "name cityName coverImage location category overview rating entryFee timings bestTime" 
          },
          { 
            path: "hotelId", 
            select: "name location description tier amenities pricePerNight rating coverImage images contactNumber bookingLink" 
          },
          { 
            path: "transportOptions" 
          }
        ]
      })
      .sort({ createdAt: -1 })
      .lean(); 

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user?.role !== "admin" && String(req.user?._id) !== String(userId)) {
      return res.status(403).json({ success: false, message: "You can only view your own bookings." });
    }
    const bookings = await Booking.find({ userId })
      .populate("userId", "name email")
      .populate({
        path: "tripId",
        populate: [
          { path: "placeId" },
          { path: "hotelId" }
        ]
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatusByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      id,
      { 
        $set: { 
          bookingStatus, 
          "paymentDetails.paymentStatus": paymentStatus 
        } 
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Registry adjusted.", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
