import express from "express";
import  { getAllDestinationsCards, getDestinationsCities, getDestinationsCitieswithState,  } from "../controller/DestinationController.js";

const router = express.Router();


// get all Destinations city info by Id
router.get("/all/:id", getDestinationsCities);


// get all Destinations
router.get("/all",getAllDestinationsCards);

router.get("/collections/all" , getDestinationsCitieswithState);


export default router;