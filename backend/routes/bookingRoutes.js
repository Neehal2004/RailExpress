import express from 'express';
import { createBooking, getBookingByPNR, getUserBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/pnr/:pnr', getBookingByPNR);
router.put('/cancel/:pnr', protect, cancelBooking);

export default router;
