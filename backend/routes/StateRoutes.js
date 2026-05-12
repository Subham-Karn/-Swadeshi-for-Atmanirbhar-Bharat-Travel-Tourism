import express from "express";
import { 
    createRegion, 
    fetchStates, 
    fetchStateById, 
    updateRegion, 
    deleteRegion 
} from "../controller/StateController.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", fetchStates);
router.get("/:id", fetchStateById);

router.post("/", protect ,isAdmin, createRegion);
router.patch("/:id",protect ,isAdmin, updateRegion);
router.delete("/:id",protect ,isAdmin, deleteRegion);

export default router;