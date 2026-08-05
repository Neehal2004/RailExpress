import express from 'express';
import { getDashboardStats, getAllBookings, getPaymentTransactions } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/bookings', protect, adminOnly, getAllBookings);
router.get('/payments', protect, adminOnly, getPaymentTransactions);

export default router;
