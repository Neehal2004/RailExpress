import Train from '../models/Train.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryTrains } from './trainController.js';
import { inMemoryBookings, inMemoryPayments } from './bookingController.js';
import { inMemoryUsers } from './authController.js';
import asyncHandler from '../utils/asyncHandler.js';

// Helper to sanitize user object and ensure password/passwordHash is never leaked
const sanitizeUser = (user, includePhone = false) => {
  if (!user) return null;
  const safe = {
    _id: user._id,
    name: user.name,
    email: user.email
  };
  if (includePhone && user.phone) {
    safe.phone = user.phone;
  }
  return safe;
};

// Helper to project train summary fields
const sanitizeTrain = (train, includeDepartureTime = false) => {
  if (!train) return null;
  const safe = {
    _id: train._id,
    trainName: train.trainName,
    trainNumber: train.trainNumber,
    source: train.source,
    destination: train.destination
  };
  if (includeDepartureTime) safe.departureTime = train.departureTime;
  return safe;
};

/**
 * @desc    Get aggregated system statistics for admin dashboard
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  if (isMongoConnected) {
    const totalTrains = await Train.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'passenger' });
    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

    const payments = await Payment.find();
    let totalRevenue = 0;
    let totalRefunds = 0;

    payments.forEach((p) => {
      if (p.status === 'Success') totalRevenue += p.amount;
      else if (p.status === 'Refunded') totalRefunds += p.amount;
    });

    const recentBookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('trainId', 'trainName trainNumber source destination')
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      totalTrains,
      totalUsers,
      totalBookings,
      activeBookings,
      cancelledBookings,
      totalRevenue,
      totalRefunds,
      recentBookings
    });
  } else {
    const totalTrains = inMemoryTrains.length;
    const totalUsers = inMemoryUsers.filter((u) => u.role === 'passenger').length;
    const totalBookings = inMemoryBookings.length;
    const activeBookings = inMemoryBookings.filter((b) => b.status === 'Confirmed').length;
    const cancelledBookings = inMemoryBookings.filter((b) => b.status === 'Cancelled').length;

    let totalRevenue = 0;
    let totalRefunds = 0;
    inMemoryPayments.forEach((p) => {
      if (p.status === 'Success') totalRevenue += p.amount;
      else if (p.status === 'Refunded') totalRefunds += p.amount;
    });

    // Match MongoDB branch: sort descending by recent and limit to 10, sanitizing user without passwordHash
    const recentBookings = inMemoryBookings
      .slice()
      .reverse()
      .slice(0, 10)
      .map((b) => {
        const user = inMemoryUsers.find((u) => u._id === b.userId);
        const train = inMemoryTrains.find((t) => t._id === b.trainId);
        return {
          ...b,
          userId: sanitizeUser(user, false),
          trainId: sanitizeTrain(train, true)
        };
      });

    return res.status(200).json({
      success: true,
      totalTrains,
      totalUsers,
      totalBookings,
      activeBookings,
      cancelledBookings,
      totalRevenue,
      totalRefunds,
      recentBookings
    });
  }
});

/**
 * @desc    Get all booking records for admin oversight
 * @route   GET /api/admin/bookings
 * @access  Private/Admin
 */
export const getAllBookings = asyncHandler(async (req, res) => {
  if (isMongoConnected) {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('trainId', 'trainName trainNumber source destination departureTime')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } else {
    const bookings = inMemoryBookings
      .slice()
      .reverse()
      .map((b) => {
        const user = inMemoryUsers.find((u) => u._id === b.userId);
        const train = inMemoryTrains.find((t) => t._id === b.trainId);
        return {
          ...b,
          userId: sanitizeUser(user, true),
          trainId: sanitizeTrain(train)
        };
      });
    return res.status(200).json(bookings);
  }
});

/**
 * @desc    Get all payment ledger records for admin audit
 * @route   GET /api/admin/payments
 * @access  Private/Admin
 */
export const getPaymentTransactions = asyncHandler(async (req, res) => {
  if (isMongoConnected) {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate({ path: 'bookingId', select: 'pnr classType totalFare status' })
      .sort({ createdAt: -1 });

    return res.status(200).json(payments);
  } else {
    const payments = inMemoryPayments
      .slice()
      .reverse()
      .map((p) => {
        const user = inMemoryUsers.find((u) => u._id === p.userId);
        const booking = inMemoryBookings.find((b) => b._id === p.bookingId);
        return {
          ...p,
          userId: sanitizeUser(user, false),
          bookingId: booking
            ? {
                _id: booking._id,
                pnr: booking.pnr,
                classType: booking.classType,
                totalFare: booking.totalFare,
                status: booking.status
              }
            : null
        };
      });
    return res.status(200).json(payments);
  }
});
