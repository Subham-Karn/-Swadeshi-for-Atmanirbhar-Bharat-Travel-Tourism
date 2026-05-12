import express from "express";
import  { getAllDestinationsCards, getDestinationsCities,  } from "../controller/DestinationController.js";

const router = express.Router();


// get all Destinations city info by Id
router.get("/all/:id", getDestinationsCities);


// get all Destinations
router.get("/all",getAllDestinationsCards);


export default router;