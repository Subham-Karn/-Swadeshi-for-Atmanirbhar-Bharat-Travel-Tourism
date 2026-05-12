import express from 'express';
import { 
  createPlace, 
  updatePlace, 
  deletePlace, 
  fetchPlacesByCityId, 
  fetchPlaceById,
  getAllPlaces,
} from '../controller/PlaceController.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/all', getAllPlaces);
router.get('/:id', fetchPlaceById);
router.get('/city/:cityId', fetchPlacesByCityId);

router.post('/', protect , isAdmin, createPlace);
router.patch('/:id', protect , isAdmin, updatePlace);
router.delete('/:id', protect , isAdmin, deletePlace);

export default router;