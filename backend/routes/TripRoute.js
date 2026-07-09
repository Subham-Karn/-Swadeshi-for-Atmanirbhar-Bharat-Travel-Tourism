import express from "express";
import {
  createTrip,
  getAllTripsForAdmin,
  getUserTrips,
  updateTripStatus,
  deleteTrip,
  getTripById,     
  updateTripByAdmin   
} from "../controller/TripController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/all", protect, isAdmin, getAllTripsForAdmin);
router.get("/admin/detail/:id", protect, isAdmin, getTripById); 
router.post("/admin/create", protect, isAdmin, createTrip);
router.put("/admin/update/:id", protect, isAdmin, updateTripByAdmin);
router.patch("/admin/status/:id", protect, isAdmin, updateTripStatus);
router.delete("/admin/delete/:id", protect, isAdmin, deleteTrip);

router.get("/user/:userId", getUserTrips);

export default router;
