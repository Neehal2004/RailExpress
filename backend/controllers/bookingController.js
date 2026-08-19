import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Payment from '../models/Payment.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryTrains } from './trainController.js';
import { inMemoryUsers } from './authController.js';
import mongoose from 'mongoose';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Dynamically size seat allocation directly from class total capacity
 */
const allocateSeatNumbers = (count, occupiedSeatNumbers = [], totalCapacity = 60) => {
  const occupiedNumbers = new Set(
    occupiedSeatNumbers
      .map((seatNumber) => Number(String(seatNumber).match(/-(\d+)$/)?.[1]))
      .filter((seatNumber) => Number.isInteger(seatNumber))
  );
  const capacity = Math.max(Number(totalCapacity) || 60, count);
  const seats = Array.from({ length: capacity }, (_, index) => index + 1);
  for (let index = seats.length - 1; index > 0; index -= 1) {
    const swapIndex = crypto.randomInt(index + 1);
    [seats[index], seats[swapIndex]] = [seats[swapIndex], seats[index]];
  }
  const availableSeats = seats.filter((seatNumber) => !occupiedNumbers.has(seatNumber));
  return availableSeats.length >= count ? availableSeats.slice(0, count) : null;
};

export const inMemoryBookings = [
  {
    _id: 'bk_9823410582',
    pnr: 'PNR-9823410582',
    userId: 'usr_passenger_1',
    trainId: 'trn_12952',
    travelDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    classType: '3A',
    passengers: [
      { name: 'John Doe', age: 29, gender: 'Male', seatNumber: 'B1-24', berth: 'Lower' },
      { name: 'Jane Doe', age: 27, gender: 'Female', seatNumber: 'B1-25', berth: 'Middle' }
    ],
    totalFare: 4200,
    status: 'Confirmed',
    bookingDate: new Date()
  }
];

export const inMemoryPayments = [
  {
    _id: 'pmt_8821',
    transactionId: 'TXN-17180000-8821',
    bookingId: 'bk_9823410582',
    userId: 'usr_passenger_1',
    amount: 4200,
    paymentMethod: 'UPI',
    status: 'Success',
    paymentDate: new Date()
  }
];

/**
 * @desc    Create a new train ticket booking & payment
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { trainId, travelDate, classType, passengers, paymentMethod } = req.body;

  // Defensive guard against null/undefined or non-object passenger entries
  const validPassengers = Array.isArray(passengers) ? passengers.filter((p) => p && typeof p === 'object' && !Array.isArray(p)) : [];
  if (validPassengers.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one valid passenger detail is required'
    });
  }

  if (isMongoConnected) {
    if (!mongoose.Types.ObjectId.isValid(trainId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid train ID format'
      });
    }

    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train schedule not found'
      });
    }

    const trainClass = train.classes.find((c) => c.className === classType);
    if (!trainClass) {
      return res.status(400).json({
        success: false,
        message: `Class ${classType} is not available on this train`
      });
    }

    const classPrefix = classType === '1A' ? 'H1' : classType === '2A' ? 'A1' : classType === '3A' ? 'B1' : 'S1';
    const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
    const totalFare = trainClass.fare * validPassengers.length;
    const pnr = `PNR-${crypto.randomInt(1000000000, 9999999999)}`;

    let booking;
    let payment;

    const executeBookingCreation = async (sess) => {
      const opts = sess ? { session: sess } : {};
      const query = Booking.find({ trainId, travelDate, classType, status: 'Confirmed' })
        .select('passengers.seatNumber')
        .lean();
      if (sess) query.session(sess);
      const existingBookings = await query;

      const occupiedSeatNumbers = existingBookings.flatMap((existingBooking) =>
        (existingBooking.passengers || []).map((passenger) => passenger.seatNumber)
      );

      // Sizing seat allocation from trainClass.totalSeats
      const seatNumbers = allocateSeatNumbers(validPassengers.length, occupiedSeatNumbers, trainClass.totalSeats);
      if (!seatNumbers) {
        const error = new Error(`Insufficient seats remaining for class ${classType}. Please choose another class or train.`);
        error.bookingError = 'INSUFFICIENT_SEATS';
        throw error;
      }

      const formattedPassengers = validPassengers.map((p, index) => ({
        name: (p.name || 'Passenger').trim(),
        age: Number(p.age) || 18,
        gender: p.gender || 'Male',
        seatNumber: `${classPrefix}-${seatNumbers[index]}`,
        berth: p.berth || berths[index % berths.length]
      }));

      const updatedTrain = await Train.findOneAndUpdate(
        {
          _id: trainId,
          classes: {
            $elemMatch: {
              className: classType,
              availableSeats: { $gte: validPassengers.length }
            }
          }
        },
        { $inc: { 'classes.$.availableSeats': -validPassengers.length } },
        { new: true, ...(sess ? { session: sess } : {}) }
      );

      if (!updatedTrain) {
        const error = new Error(`Insufficient seats remaining for class ${classType}. Please choose another class or train.`);
        error.bookingError = 'INSUFFICIENT_SEATS';
        throw error;
      }

      const createdBookings = await Booking.create([{
        pnr,
        userId: req.user._id,
        trainId,
        travelDate,
        classType,
        passengers: formattedPassengers,
        totalFare,
        status: 'Confirmed'
      }], opts);
      booking = createdBookings[0];

      const createdPayments = await Payment.create([{
        transactionId: `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        bookingId: booking._id,
        userId: req.user._id,
        amount: totalFare,
        paymentMethod: paymentMethod || 'UPI',
        status: 'Success'
      }], opts);
      payment = createdPayments[0];
    };

    const maxSeatAllocationRetries = 3;
    let transactionError;
    for (let attempt = 0; attempt < maxSeatAllocationRetries; attempt += 1) {
      let session;
      try {
        session = await mongoose.startSession();
        await session.withTransaction(async () => {
          await executeBookingCreation(session);
        });
        transactionError = null;
        break;
      } catch (txError) {
        if (txError.bookingError === 'INSUFFICIENT_SEATS') {
          return res.status(400).json({ success: false, message: txError.message });
        }

        const isDuplicateBooking = txError.code === 11000 && txError.keyPattern?.['passengers.seatNumber'];
        if (isDuplicateBooking && attempt < maxSeatAllocationRetries - 1) {
          continue;
        }

        const isStandaloneTransactionError = txError.code === 20 || txError.codeName === 'IllegalOperation';
        if (isStandaloneTransactionError) {
          transactionError = txError;
          break;
        }
        transactionError = txError;
        break;
      } finally {
        if (session) {
          await session.endSession();
        }
      }
    }

    if (transactionError) {
      throw transactionError;
    }

    const populatedBooking = await Booking.findById(booking._id).populate('trainId');

    return res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      booking: populatedBooking,
      payment
    });
  } else {
    const train = inMemoryTrains.find((t) => t._id === trainId);
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train schedule not found'
      });
    }

    const trainClass = train.classes.find((c) => c.className === classType);
    if (!trainClass) {
      return res.status(400).json({
        success: false,
        message: `Class ${classType} is not available on this train`
      });
    }

    const occupiedSeatNumbers = inMemoryBookings
      .filter((b) => b.trainId === trainId && b.classType === classType && b.status === 'Confirmed')
      .flatMap((b) => (b.passengers || []).map((p) => p.seatNumber));

    // Sizing seat allocation from trainClass.totalSeats
    const seatNumbers = allocateSeatNumbers(validPassengers.length, occupiedSeatNumbers, trainClass.totalSeats);
    if (trainClass.availableSeats < validPassengers.length || !seatNumbers) {
      return res.status(400).json({
        success: false,
        message: `Insufficient seats: Only ${trainClass.availableSeats} seat(s) remaining for class ${classType}`
      });
    }

    trainClass.availableSeats -= validPassengers.length;

    const classPrefix = classType === '1A' ? 'H1' : classType === '2A' ? 'A1' : classType === '3A' ? 'B1' : 'S1';
    const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

    const formattedPassengers = validPassengers.map((p, index) => ({
      name: (p.name || 'Passenger').trim(),
      age: Number(p.age) || 18,
      gender: p.gender || 'Male',
      seatNumber: `${classPrefix}-${seatNumbers[index]}`,
      berth: p.berth || berths[index % berths.length]
    }));

    const totalFare = trainClass.fare * validPassengers.length;
    const pnr = `PNR-${crypto.randomInt(1000000000, 9999999999)}`;

    const newBooking = {
      _id: `bk_${crypto.randomUUID()}`,
      pnr,
      userId: req.user._id,
      trainId,
      travelDate,
      classType,
      passengers: formattedPassengers,
      totalFare,
      status: 'Confirmed',
      bookingDate: new Date()
    };
    inMemoryBookings.push(newBooking);

    const newPayment = {
      _id: `pmt_${crypto.randomUUID()}`,
      transactionId: `TXN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
      bookingId: newBooking._id,
      userId: req.user._id,
      amount: totalFare,
      paymentMethod: paymentMethod || 'UPI',
      status: 'Success',
      paymentDate: new Date()
    };
    inMemoryPayments.push(newPayment);

    const populatedBooking = { ...newBooking, trainId: train };

    return res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      booking: populatedBooking,
      payment: newPayment
    });
  }
});

/**
 * @desc    Get booking details by 10-digit PNR (Public endpoint)
 * @route   GET /api/bookings/pnr/:pnr
 * @access  Public
 * @security Only exposes public train & seat info, never passenger email/phone contact data
 */
export const getBookingByPNR = asyncHandler(async (req, res) => {
  const { pnr } = req.params;

  if (isMongoConnected) {
    const booking = await Booking.findOne({ pnr })
      .populate('trainId', 'trainName trainNumber source destination departureTime arrivalTime duration');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No booking record found for this PNR number'
      });
    }

    const redactedBooking = {
      _id: booking._id,
      pnr: booking.pnr,
      status: booking.status,
      travelDate: booking.travelDate,
      classType: booking.classType,
      totalFare: booking.totalFare,
      bookingDate: booking.bookingDate,
      trainId: booking.trainId,
      passengers: (booking.passengers || []).map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        seatNumber: p.seatNumber,
        berth: p.berth
      }))
    };

    return res.status(200).json({
      success: true,
      ...redactedBooking,
      booking: redactedBooking
    });
  } else {
    const booking = inMemoryBookings.find((b) => b.pnr === pnr);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No booking record found for this PNR number'
      });
    }

    const train = inMemoryTrains.find((t) => t._id === booking.trainId);
    const sanitizedTrain = train
      ? {
          _id: train._id,
          trainName: train.trainName,
          trainNumber: train.trainNumber,
          source: train.source,
          destination: train.destination,
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          duration: train.duration
        }
      : null;

    const redactedBooking = {
      _id: booking._id,
      pnr: booking.pnr,
      status: booking.status,
      travelDate: booking.travelDate,
      classType: booking.classType,
      totalFare: booking.totalFare,
      bookingDate: booking.bookingDate,
      trainId: sanitizedTrain,
      passengers: (booking.passengers || []).map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        seatNumber: p.seatNumber,
        berth: p.berth
      }))
    };

    return res.status(200).json({
      success: true,
      ...redactedBooking,
      booking: redactedBooking
    });
  }
});

/**
 * @desc    Get travel booking history of authenticated user
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getUserBookings = asyncHandler(async (req, res) => {
  if (isMongoConnected) {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('trainId')
      .sort({ createdAt: -1 });

    const bookingIds = bookings.map((b) => b._id);
    const payments = await Payment.find({ bookingId: { $in: bookingIds } });

    return res.status(200).json({
      success: true,
      bookings,
      payments
    });
  } else {
    const userBookings = inMemoryBookings
      .filter((b) => b.userId === req.user._id)
      .map((b) => ({
        ...b,
        trainId: inMemoryTrains.find((t) => t._id === b.trainId)
      }));

    const bookingIds = userBookings.map((b) => b._id);
    const userPayments = inMemoryPayments.filter((p) => bookingIds.includes(p.bookingId));

    return res.status(200).json({
      success: true,
      bookings: userBookings,
      payments: userPayments
    });
  }
});

/**
 * @desc    Cancel a booked ticket by PNR
 * @route   PUT /api/bookings/cancel/:pnr
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req, res) => {
  const { pnr } = req.params;

  if (isMongoConnected) {
    const booking = await Booking.findOne({ pnr });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to cancel this booking'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This ticket is already cancelled'
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    // Atomically restock train seats
    await Train.findOneAndUpdate(
      { _id: booking.trainId, 'classes.className': booking.classType },
      { $inc: { 'classes.$.availableSeats': booking.passengers.length } }
    );

    const payment = await Payment.findOne({ bookingId: booking._id });
    if (payment) {
      payment.status = 'Refunded';
      await payment.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Ticket cancelled successfully. Refund initiated.',
      booking,
      refundAmount: booking.totalFare,
      payment
    });
  } else {
    const booking = inMemoryBookings.find((b) => b.pnr === pnr);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    if (booking.userId !== req.user._id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to cancel this booking'
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This ticket is already cancelled'
      });
    }

    booking.status = 'Cancelled';
    const train = inMemoryTrains.find((t) => t._id === booking.trainId);
    if (train) {
      const trainClass = train.classes.find((c) => c.className === booking.classType);
      if (trainClass) trainClass.availableSeats += booking.passengers.length;
    }

    const payment = inMemoryPayments.find((p) => p.bookingId === booking._id);
    if (payment) payment.status = 'Refunded';

    return res.status(200).json({
      success: true,
      message: 'Ticket cancelled successfully. Refund initiated.',
      booking,
      refundAmount: booking.totalFare,
      payment
    });
  }
});
