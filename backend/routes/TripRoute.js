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

const router = express.Router();

router.get("/admin/all", getAllTripsForAdmin);
router.get("/admin/detail/:id", getTripById); 
router.post("/admin/create", createTrip);
router.put("/admin/update/:id", updateTripByAdmin);
router.patch("/admin/status/:id", updateTripStatus);
router.delete("/admin/delete/:id", deleteTrip);

router.get("/user/:userId", getUserTrips);

export default router;