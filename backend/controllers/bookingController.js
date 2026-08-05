import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Payment from '../models/Payment.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryTrains } from './trainController.js';
import { inMemoryUsers } from './authController.js';

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

export const createBooking = async (req, res) => {
  try {
    const { trainId, travelDate, classType, passengers, paymentMethod } = req.body;

    if (!trainId || !travelDate || !classType || !passengers || passengers.length === 0) {
      return res.status(400).json({ message: 'Missing booking details' });
    }

    if (isMongoConnected) {
      const train = await Train.findById(trainId);
      if (!train) return res.status(404).json({ message: 'Train not found' });

      const trainClass = train.classes.find((c) => c.className === classType);
      if (!trainClass || trainClass.availableSeats < passengers.length) {
        return res.status(400).json({ message: 'Seats not available for selected class' });
      }

      const classPrefix = classType === '1A' ? 'H1' : classType === '2A' ? 'A1' : classType === '3A' ? 'B1' : 'S1';
      const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

      const formattedPassengers = passengers.map((p, index) => ({
        name: p.name,
        age: Number(p.age),
        gender: p.gender || 'Male',
        seatNumber: `${classPrefix}-${Math.floor(Math.random() * 50) + 1}`,
        berth: p.berth || berths[index % berths.length]
      }));

      const totalFare = trainClass.fare * passengers.length;
      const pnr = `PNR-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const booking = await Booking.create({
        pnr,
        userId: req.user._id,
        trainId,
        travelDate,
        classType,
        passengers: formattedPassengers,
        totalFare,
        status: 'Confirmed'
      });

      trainClass.availableSeats -= passengers.length;
      await train.save();

      const payment = await Payment.create({
        transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingId: booking._id,
        userId: req.user._id,
        amount: totalFare,
        paymentMethod: paymentMethod || 'UPI',
        status: 'Success'
      });

      const populatedBooking = await Booking.findById(booking._id).populate('trainId');
      return res.status(201).json({ message: 'Ticket booked successfully!', booking: populatedBooking, payment });
    } else {
      const train = inMemoryTrains.find((t) => t._id === trainId);
      if (!train) return res.status(404).json({ message: 'Train not found' });

      const trainClass = train.classes.find((c) => c.className === classType);
      if (!trainClass || trainClass.availableSeats < passengers.length) {
        return res.status(400).json({ message: 'Seats not available for selected class' });
      }

      const classPrefix = classType === '1A' ? 'H1' : classType === '2A' ? 'A1' : classType === '3A' ? 'B1' : 'S1';
      const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];

      const formattedPassengers = passengers.map((p, index) => ({
        name: p.name,
        age: Number(p.age),
        gender: p.gender || 'Male',
        seatNumber: `${classPrefix}-${Math.floor(Math.random() * 50) + 1}`,
        berth: p.berth || berths[index % berths.length]
      }));

      const totalFare = trainClass.fare * passengers.length;
      const pnr = `PNR-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      trainClass.availableSeats -= passengers.length;

      const newBooking = {
        _id: `bk_${Date.now()}`,
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
        _id: `pmt_${Date.now()}`,
        transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingId: newBooking._id,
        userId: req.user._id,
        amount: totalFare,
        paymentMethod: paymentMethod || 'UPI',
        status: 'Success',
        paymentDate: new Date()
      };
      inMemoryPayments.push(newPayment);

      const populatedBooking = { ...newBooking, trainId: train };
      return res.status(201).json({ message: 'Ticket booked successfully!', booking: populatedBooking, payment: newPayment });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingByPNR = async (req, res) => {
  try {
    const { pnr } = req.params;
    if (isMongoConnected) {
      const booking = await Booking.findOne({ pnr }).populate('trainId').populate('userId', 'name email phone');
      if (!booking) return res.status(404).json({ message: 'No booking found for this PNR number' });
      const payment = await Payment.findOne({ bookingId: booking._id });
      return res.json({ booking, payment });
    } else {
      const booking = inMemoryBookings.find((b) => b.pnr === pnr);
      if (!booking) return res.status(404).json({ message: 'No booking found for this PNR number' });
      const train = inMemoryTrains.find((t) => t._id === booking.trainId);
      const user = inMemoryUsers.find((u) => u._id === booking.userId);
      const payment = inMemoryPayments.find((p) => p.bookingId === booking._id);

      return res.json({
        booking: { ...booking, trainId: train, userId: user },
        payment
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    if (isMongoConnected) {
      const bookings = await Booking.find({ userId: req.user._id }).populate('trainId').sort({ createdAt: -1 });
      const bookingIds = bookings.map((b) => b._id);
      const payments = await Payment.find({ bookingId: { $in: bookingIds } });
      return res.json({ bookings, payments });
    } else {
      const userBookings = inMemoryBookings
        .filter((b) => b.userId === req.user._id)
        .map((b) => ({
          ...b,
          trainId: inMemoryTrains.find((t) => t._id === b.trainId)
        }));
      const bookingIds = userBookings.map((b) => b._id);
      const userPayments = inMemoryPayments.filter((p) => bookingIds.includes(p.bookingId));

      return res.json({ bookings: userBookings, payments: userPayments });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { pnr } = req.params;

    if (isMongoConnected) {
      const booking = await Booking.findOne({ pnr });
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }
      if (booking.status === 'Cancelled') return res.status(400).json({ message: 'Booking is already cancelled' });

      booking.status = 'Cancelled';
      await booking.save();

      const train = await Train.findById(booking.trainId);
      if (train) {
        const trainClass = train.classes.find((c) => c.className === booking.classType);
        if (trainClass) {
          trainClass.availableSeats += booking.passengers.length;
          await train.save();
        }
      }

      const payment = await Payment.findOne({ bookingId: booking._id });
      if (payment) {
        payment.status = 'Refunded';
        await payment.save();
      }

      return res.json({ message: 'Ticket cancelled successfully.', booking, refundAmount: booking.totalFare, payment });
    } else {
      const booking = inMemoryBookings.find((b) => b.pnr === pnr);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      if (booking.userId !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this booking' });
      }

      if (booking.status === 'Cancelled') return res.status(400).json({ message: 'Booking is already cancelled' });

      booking.status = 'Cancelled';
      const train = inMemoryTrains.find((t) => t._id === booking.trainId);
      if (train) {
        const trainClass = train.classes.find((c) => c.className === booking.classType);
        if (trainClass) trainClass.availableSeats += booking.passengers.length;
      }

      const payment = inMemoryPayments.find((p) => p.bookingId === booking._id);
      if (payment) payment.status = 'Refunded';

      return res.json({ message: 'Ticket cancelled successfully.', booking, refundAmount: booking.totalFare, payment });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
