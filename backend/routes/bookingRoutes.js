import express from 'express';
import {
  createBooking,
  getBookingByPNR,
  getUserBookings,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateBookingCreate, validatePnrParam } from '../middleware/validatorMiddleware.js';
import { bookingLimiter } from '../middleware/rateLimiterMiddleware.js';

const router = express.Router();

router.post('/', protect, bookingLimiter, validateBookingCreate, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/pnr/:pnr', validatePnrParam, getBookingByPNR);
router.put('/cancel/:pnr', protect, validatePnrParam, cancelBooking);

export default router;
