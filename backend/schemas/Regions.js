import mongoose from "mongoose";


mongoose.set('strictQuery', true);
const RegionSchema = new mongoose.Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    regionType: { type: String, required: true },
    state: { type: String, required: true },
    stateImage: { type: String, required: true },
    citiesCount: { type: Number, required: true },
    status: { type: String, enum:["Active", "Seasonal" , "Inactive"] , default: "Active" , required: true },
    reach: { type: String, required: true },
},
    { timestamps: true }
);
export default mongoose.model("Region", RegionSchema);

