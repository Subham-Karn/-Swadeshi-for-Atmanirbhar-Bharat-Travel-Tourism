import express from "express";
import { 
  createPlace, 
  getAllPlaces, 
  getPlaceById, 
  updatePlace, 
  deletePlace, 
  getPlaceCountByCityId
} from "../controller/PlaceController.js";

const router = express.Router();

router.get("/", getAllPlaces);
router.get("/:id", getPlaceById);
router.get("/city/:cityId", getPlaceCountByCityId);
router.post("/", createPlace); 
router.patch("/:id", updatePlace);
router.delete("/:id", deletePlace);

export default router;