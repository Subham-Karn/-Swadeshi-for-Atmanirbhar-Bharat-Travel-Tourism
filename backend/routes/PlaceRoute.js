import express from 'express';
import PlaceController from '../controller/PlaceController.js';
const router = express.Router();


// Create a new Place
router.post('/create', PlaceController.createPlace);

// Update an existing Place
router.put('/update/:placeId', PlaceController.updatePlace);


// Get all Places for a specific City
router.get('/city/:cityId', PlaceController.getPlacesByCity);

// Get a specific Place by ID
router.get('/view/:placeId', PlaceController.getPlaceById);

// Get a specific City by ID
router.get('/city/view/:cityId', PlaceController.getCityById);

// Delete a Place
router.delete('/delete/:placeId', PlaceController.deletePlace);

export default router;