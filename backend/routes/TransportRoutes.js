import express from "express";
import {
  createTransport,
  getAllTransport,
  getTransportByCityId,
  getTransportById,
  updateTransport,
  deleteTransport
} from "../controller/TransportController.js";

const router = express.Router({ mergeParams: true });

router.post("/:cityName/:cityId/create" , createTransport);

router.get("/:cityName/:cityId/all" , getAllTransport);

router.route("/all")
  .get(getAllTransport);      


router.put("/:id/update" , updateTransport);
router.route("/:id")
  .get(getTransportById)      
  .delete(deleteTransport);   

export default router;