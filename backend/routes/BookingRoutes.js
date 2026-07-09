import express from "express";
import { 
  createBooking, 
  getAdminAllBookings, 
  getUserBookings, 
  updateBookingStatusByAdmin 
} from "../controller/BookingController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/admin/all", protect, isAdmin, getAdminAllBookings);
router.patch("/admin/status/:id", protect, isAdmin, updateBookingStatusByAdmin);
router.get("/user/:userId", protect, getUserBookings);

export default router;
