import mongoose from "mongoose";

const  CitySchema = new mongoose.Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, required: true},
    regionId: {type: mongoose.Schema.Types.ObjectId, required: true},
    regionType: { type: String, required: true },
    city: { type: String, required: true },
    cityImage: { type: String, required: true },
    status: { type: String, enum:["Active", "Seasonal" , "Inactive"] , default: "Active" , required: true },
    reach: { type: String, required: true },
},
    { timestamps: true }
);
export default mongoose.model("City", CitySchema);