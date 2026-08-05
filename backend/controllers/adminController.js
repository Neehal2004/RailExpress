import Train from '../models/Train.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryTrains } from './trainController.js';
import { inMemoryBookings, inMemoryPayments } from './bookingController.js';
import { inMemoryUsers } from './authController.js';

export const getDashboardStats = async (req, res) => {
  try {
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

      return res.json({
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

      const recentBookings = inMemoryBookings.map((b) => ({
        ...b,
        userId: inMemoryUsers.find((u) => u._id === b.userId),
        trainId: inMemoryTrains.find((t) => t._id === b.trainId)
      }));

      return res.json({
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    if (isMongoConnected) {
      const bookings = await Booking.find()
        .populate('userId', 'name email phone')
        .populate('trainId', 'trainName trainNumber source destination departureTime')
        .sort({ createdAt: -1 });

      return res.json(bookings);
    } else {
      const bookings = inMemoryBookings.map((b) => ({
        ...b,
        userId: inMemoryUsers.find((u) => u._id === b.userId),
        trainId: inMemoryTrains.find((t) => t._id === b.trainId)
      }));
      return res.json(bookings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentTransactions = async (req, res) => {
  try {
    if (isMongoConnected) {
      const payments = await Payment.find()
        .populate('userId', 'name email')
        .populate({ path: 'bookingId', select: 'pnr classType totalFare status' })
        .sort({ createdAt: -1 });

      return res.json(payments);
    } else {
      const payments = inMemoryPayments.map((p) => ({
        ...p,
        userId: inMemoryUsers.find((u) => u._id === p.userId),
        bookingId: inMemoryBookings.find((b) => b._id === p.bookingId)
      }));
      return res.json(payments);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
