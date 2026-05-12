import express from "express";
import { 
  requestSignup, 
  verifyAndCreateUser, 
  refreshSession ,
  logout,
  loginUser,
  forgetPassword,
  resetPassword
} from "../controller/AuthController.js";

const router = express.Router();

router.post("/request-signup", requestSignup);
router.post("/verify-otp", verifyAndCreateUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/refresh", refreshSession);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;