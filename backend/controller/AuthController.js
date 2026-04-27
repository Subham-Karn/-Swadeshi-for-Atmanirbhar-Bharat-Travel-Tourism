import User from "../schemas/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../util/emailService.js";

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short lived
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' } // Long lived
  );
  return { accessToken, refreshToken };
};

// --- STEP 1: REQUEST SIGNUP ---
export const requestSignup = async (req, res) => {
  const { name, username, gender, age, email, phone, address, password } = req.body;
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { phone }] });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Account already exists." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate(
      { email },
      { name, username, gender, age, phone, address, password: hashedPassword, otp, otpExpires, isVerified: false },
      { upsert: true, new: true }
    );

    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) return res.status(500).json({ message: "Email service failed." });

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Signup request failed." });
  }
};

// --- STEP 2: VERIFY OTP & LOGIN ---
export const verifyAndCreateUser = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshTokens.push(refreshToken); 
    await user.save();

    res.status(201).json({
      message: "Verified!",
      user: { id: user._id, name: user.name, role: user.role },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed." });
  }
};

export const refreshSession = async (req, res) => {
  const { token } = req.body; // The Refresh Token
  if (!token) return res.status(401).json({ message: "No token provided." });

  try {
    const user = await User.findOne({ refreshTokens: token });
    if (!user) return res.status(403).json({ message: "Invalid session." });

    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token expired." });
      
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Session refresh failed." });
  }
};