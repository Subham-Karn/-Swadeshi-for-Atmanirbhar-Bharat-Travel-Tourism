import mongoose from "mongoose";

const CitySchema = new mongoose.Schema({
    uid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    regionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "State", // Links this city to a specific State
        required: true 
    },
    regionType: { 
        type: String, 
        required: true,
        enum: ['North', 'South', 'East', 'West', 'Central', 'North-East'] // Matches State
    },
    cityName: { type: String, required: true },
    cityImage: { type: String, required: true },
    isPopular: { type: Boolean, default: false },
    overview: { type: String, required: true },
    bestTimeToVisit: { type: String, required: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
},
    { timestamps: true }
);

export default mongoose.model("City", CitySchema);