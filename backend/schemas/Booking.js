import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    default: () => `BK-${Math.floor(100000 + Math.random() * 900000)}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true
  },
  paymentDetails: {
    transactionId: { type: String, default: "" },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "completed", "failed", "refunded"], 
      default: "pending" 
    },
    paidAmount: { type: Number, required: true },
    gateway: { type: String, default: "Razorpay" }
  },
  customerDetails: {
    fullName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    specialRequests: { type: String, trim: true }
  },
  seatsCount: { type: Number, default: 1 },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "pending", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
