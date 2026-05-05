import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Place name is required"],
    trim: true 
  },
  cityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'City', 
    required: [true, "A place must be linked to a parent City Node"] 
  },
  cityName: { 
    type: String, 
    required: true 
  },

  // 2. CATEGORIZATION
  category: { 
    type: String, 
    enum: ['Heritage', 'Religious', 'Historic', 'Nature', 'Market', 'Modern'],
    default: 'Heritage',
    required: [true, "Place type is required"],
    trim: true,
    lowercase: true
  },

  // 3. MEDIA ASSETS
  images: [{ 
    type: String 
  }],
  coverImage: { 
    type: String 
  },

  // 4. INTELLIGENCE DATA
  overview: { 
    type: String, 
    required: [true, "Briefing/Overview documentation is required"] 
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

  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { timestamps: true });


placeSchema.index({ name: 'text', cityName: 'text' });

const  Place = mongoose.model('Place', placeSchema);

export default Place;