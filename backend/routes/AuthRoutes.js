import express from "express";
import { 
  requestSignup, 
  verifyAndCreateUser, 
  refreshSession 
} from "../controller/AuthController.js";

const router = express.Router();

/**
 * @route   POST /api/auth/request-signup
 * @desc    Validate data, hash password, and send OTP
 * @access  Public
 */
router.post("/request-signup", requestSignup);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP, flip isVerified to true, and issue tokens
 * @access  Public
 */
router.post("/verify-otp", verifyAndCreateUser);

/**
 * @route   POST /api/auth/refresh
 * @desc    Use Refresh Token to get a new Access Token
 * @access  Public (via token)
 */
router.post("/refresh", refreshSession);

/**
 * @route   POST /api/auth/logout
 * @desc    Remove refresh token from DB
 * @access  Private (Needs specific middleware we will create later)
 */
// router.post("/logout", logout);

export default router;