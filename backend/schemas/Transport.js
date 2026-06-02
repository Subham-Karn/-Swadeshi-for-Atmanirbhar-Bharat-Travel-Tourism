import mongoose from "mongoose";

const transportSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['bus', 'metro', 'train', 'cab', 'autorickshaw', 'ferry'],
    required: [true, "Mode of transport is required"],
    lowercase: true,
    trim: true
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, "Transport option must be linked to a City ID"]
  },
  cityName: {
    type: String,
    required: [true, "City name is required for quick lookup"]
  },
  connectedPlaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  providerName: {
    type: String,
    required: [true, "Service provider name or agency is required"],
    trim: true
  },
  routes: [{
    type: String,
    required: [true, "At least one primary route or key stops description is required"]
  }],
  timings: {
    type: String,
    default: "6:00 AM - 10:00 PM",
    required: [true, "Operating hours/timings are required"]
  },
  frequency: {
    type: String
  },
  estimatedCost: {
    type: String,
    default: "Varies",
    required: [true, "An approximate fare structure description is required"]
  },
  coverage: {
    type: String,
    enum: ['city-wide', 'inter-city', 'localized-only'],
    default: 'city-wide',
    lowercase: true,
    trim: true
  },
  tips: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

transportSchema.index({ cityName: 'text', mode: 'text', providerName: 'text' });

const Transport = mongoose.model('Transport', transportSchema);
export default Transport;