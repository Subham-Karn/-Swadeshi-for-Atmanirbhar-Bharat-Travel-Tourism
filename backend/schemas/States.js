import mongoose from "mongoose";

const StateSchema = new mongoose.Schema({
    uid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Added reference for clarity
        required: true 
    },
    regionType: { 
        type: String, 
        required: true,
        enum: ['North', 'South', 'East', 'West', 'Central', 'North-East'] 
    },
    stateName: { type: String, required: true, unique: true }, // Added unique
    stateImage: { type:[ String], required: true },
    citiesCount: { type: Number, required: true, default: 0 },
    status: { 
        type: String, 
        enum: ["Active", "Seasonal", "Inactive"], 
        default: "Active", 
        required: true 
    },
    isPopular: { type: Boolean, default: false }, 
    rating: { type: Number, default: 0, min: 0, max: 5 }, 
    overview: { type: String, required: true },
    bestTimeToVisit: { type: String, required: true },
    reach: { type: String, required: true },
},
    { timestamps: true }
);


export default mongoose.model("State", StateSchema);