import express from "express";
import { createRegion, deleteRegion, getCitiesByState, getStates, updateRegion } from "../controller/RegionController.js";
const router = express.Router();


router.post("/create", createRegion);
router.get("/states", getStates);
router.get("/cities/:stateId", getCitiesByState);
router.patch("/update/:id", updateRegion);
router.delete("/delete/city/:id", deleteRegion);
router.delete("/delete/region/:id", deleteRegion);

export default router;

