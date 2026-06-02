import express from "express";
import { 
  createHotel, 
  getAllHotels, 
  getHotelsByCityId, 
  getHotelById, 
  updateHotel, 
  deleteHotel 
} from "../controller/HotelsController.js";

const router = express.Router({ mergeParams: true }); 


router.post("/:cityName/:cityId/create" , createHotel)
router.get("/:cityName/:cityId/all" , getAllHotels)


router.get("/all",getAllHotels);       


router.put("/:id/update" , updateHotel);
router.route("/:id")
  .get(getHotelById)             
  .delete(deleteHotel);     

export default router;