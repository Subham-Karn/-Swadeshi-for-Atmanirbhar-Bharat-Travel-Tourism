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
import { createAdminUser, getAdminDashboard, getAdminUsers, updateAdminUser } from "../controller/AdminController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request-signup", requestSignup);
router.post("/verify-otp", verifyAndCreateUser);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/refresh", refreshSession);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/admin/dashboard", protect, isAdmin, getAdminDashboard);
router.get("/admin/users", protect, isAdmin, getAdminUsers);
router.post("/admin/users", protect, isAdmin, createAdminUser);
router.patch("/admin/users/:id", protect, isAdmin, updateAdminUser);

export default router;
