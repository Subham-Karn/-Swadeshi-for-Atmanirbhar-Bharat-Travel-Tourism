import express from "express";
import { 
    createCity, 
    fetchCitiesByState, 
    fetchCityById, 
    updateCity, 
    deleteCity 
} from "../controller/CityController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetching Data
router.get("/state/:regionId", fetchCitiesByState);
router.get("/:id", fetchCityById);

// Administrative Controls
router.post("/", protect , isAdmin, createCity);
router.patch("/:id",protect , isAdmin,  updateCity);
router.delete("/:id",protect , isAdmin,  deleteCity);

export default router;