import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Place name is required"], 
    trim: true 
  },
  location: { 
    type: String, 
    required: [true, "Physical address or exact location is required"] 
  },
  cityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'City', 
    required: [true, "Place must be linked to a City ID"] 
  },
  cityName: { 
    type: String, 
    required: [true, "City name is required for quick lookup"] 
  },
  category: { 
    type: String, 
    enum: ['heritage', 'religious', 'historic', 'nature', 'market', 'modern'],
    default: 'heritage',
    required: [true, "Place type is required"],
    trim: true,
    lowercase: true
  },
  overview: { 
    type: String, 
    required: [true, "Detailed description/overview is required"] 
  },
  rating: { 
    type: Number, 
    default: 5.0, 
    min: 0, 
    max: 5 
  },
  isPopular: { 
    type: Boolean, 
    default: false 
  },
  images: [{ 
    type: String,
    required: [true, "At least one image is required"]
  }],
  coverImage: { 
    type: String 
  },
  entryFee: { 
    type: String, 
    default: "Free" 
  },
  bestTime: { 
    type: String 
  },
  timings: { 
    type: String, 
    default: "9:00 AM - 6:00 PM" 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });

placeSchema.index({ name: 'text', cityName: 'text' });

const Place = mongoose.model('Place', placeSchema);

export default Place;