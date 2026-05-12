import User from "../schemas/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail, sendVerificationEmail } from "../util/emailService.js";
import { generateAccessToken } from "../util/generateToken.js";

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken  };
};

export const requestSignup = async (req, res) => {
  const { name, username, gender, age, email, phone, address, password } =
    req.body;
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Account already exists." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate(
      { email },
      {
        name,
        username,
        gender,
        age,
        phone,
        address,
        password: hashedPassword,
        otp,
        otpExpires,
        isVerified: false,
      },
      { upsert: true, returnDocument: "after" },
    );

    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent)
      return res.status(500).json({ message: "Email service failed." });

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Signup request failed." });
  }
};

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
        { expiresIn: "15m" },
      );
      res.json({ accessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Session refresh failed." });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "User is not verified." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { accessToken, refreshToken } = generateTokens(user);
      user.refreshTokens.push(refreshToken);
      await user.save();
      res
        .status(200)
        .json({
          message: "Login successful.",
          user: { id: user._id, name: user.name, role: user.role },
          accessToken,
          refreshToken,
        });
    } else {
      return res.status(400).json({ message: "Invalid password." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email:email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    const secret = process.env.JWT_SECRET + user.password;

    const payload = {
      email: user.email.toLowerCase(),
      id: user._id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;

    const message = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #00A699;">Password Reset Request</h2>
        <p>You requested a password reset for your account.</p>
        <p>This link is valid for <b>15 minutes</b> only:</p>
        <br>
          ${resetUrl}
        <br>
        <a href="${resetUrl}" style="background: #00A699; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Link",
      html:message,
    });

    res.status(200).json({ 
      success: true, 
      message: "Reset link sent to registered email." 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const secret = process.env.JWT_SECRET + user.password;

  try {
    const decoded = jwt.verify(token, secret);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword; 
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Link is invalid or has expired." });
  }
};

export const logout = async (req, res) => {
  const { token } = req.body;
  console.log(token);
  

  try {
    if (!token) {
      return res
        .status(400)
        .json({
          sucess: false,
          message: "Refresh token is required for logout.",
        });
    }

    const result = await User.updateOne(
      { new: true },
      { refreshTokens: token },
      { $pull: { refreshTokens: token } },
    );
    if (result.matchedCount === 0) {
      return res
        .status(200)
        .json({ sucess: true, message: "Session already expired or invalid." });
    }

    res
      .status(200)
      .json({
        sucess: true,
        message: "Logged out successfully. Session expired.",
      });
  } catch (error) {
    console.error("Logout Error:", error);
    res
      .status(500)
      .json({ sucess: false, message: "Error during logout process." });
  }
};
