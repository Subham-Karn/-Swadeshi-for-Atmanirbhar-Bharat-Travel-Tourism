import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  
  // Verification Fields
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },

  // Session Management
  refreshTokens: [{ type: String }] 
}, {
  timestamps: true
});

// Auto-delete unverified users after 15 minutes to keep DB clean
UserSchema.index({ otpExpires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("User", UserSchema);