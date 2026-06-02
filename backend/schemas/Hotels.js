import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Hotel name is required"],
    trim: true
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, "Hotel must be linked to a City ID"]
  },
  cityName: {
    type: String,
    required: [true, "City name is required for quick lookup"]
  },
  // --- NEW FIELD: Relational array linking to nearby Tourist Spots ---
  nearbyPlaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  location: {
    type: String,
    required: [true, "Physical address or exact location is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Hotel description is required"]
  },
  tier: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury', 'premium-luxury'],
    default: 'mid-range',
    required: [true, "Accommodation tier is required"],
    lowercase: true,
    trim: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  pricePerNight: {
    type: Number,
    required: [true, "Estimated starting price per night is required"],
    min: [0, "Price cannot be negative"]
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },
  coverImage: {
    type: String,
    required: [true, "A primary cover image URL is required"]
  },
  images: [{
    type: String
  }],
  contactNumber: {
    type: String,
    trim: true
  },
  bookingLink: {
    type: String,
    trim: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

hotelSchema.index({ name: 'text', cityName: 'text', tier: 'text' });

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;