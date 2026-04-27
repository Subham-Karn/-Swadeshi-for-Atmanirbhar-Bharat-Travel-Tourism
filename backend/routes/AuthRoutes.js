import express from "express";
import { 
  requestSignup, 
  verifyAndCreateUser, 
  refreshSession ,
  logout,
  loginUser
} from "../controller/AuthController.js";

const router = express.Router();

router.post("/request-signup", requestSignup);
router.post("/verify-otp", verifyAndCreateUser);
router.post("/refresh", refreshSession);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;