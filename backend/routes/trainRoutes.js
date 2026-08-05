import express from 'express';
import { getTrains, getTrainById, createTrain, updateTrain, deleteTrain } from '../controllers/trainController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTrains);
router.get('/:id', getTrainById);

// Admin train management routes
router.post('/', protect, adminOnly, createTrain);
router.put('/:id', protect, adminOnly, updateTrain);
router.delete('/:id', protect, adminOnly, deleteTrain);

export default router;
