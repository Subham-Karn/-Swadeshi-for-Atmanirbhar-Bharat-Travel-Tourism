import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Trip title or custom itinerary name is required"],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Trip must be explicitly owned by a registered User ID"]
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: [true, "Target destination Place ID is required"]
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    default: null
  },
  transportOptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transport'
  }],
  startDate: {
    type: Date,
    required: [true, "Trip start date parameters are required"]
  },
  endDate: {
    type: Date,
    required: [true, "Trip completion/end date parameters are required"]
  },
  numberOfDays: {
    type: Number,
    min: [1, "Trip duration cannot fall below 1 operational day"],
    required: [true, "Calculated total trip duration days field is required"]
  },
  customNotes: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'completed', 'cancelled'],
    default: 'upcoming',
    lowercase: true,
    trim: true
  },
  budgetCalculation: {
    estimatedTotalCost: {
      type: Number,
      default: 0,
      min: [0, "Total cost metric cannot fall below a zero index balance"]
    },
    currency: {
      type: String,
      default: "INR",
      trim: true
    }
  }
}, { timestamps: true });

tripSchema.index({ userId: 1, startDate: -1 });
tripSchema.index({ title: 'text' });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;