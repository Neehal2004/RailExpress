import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Train from '../models/Train.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rtbs';

const sampleTrains = [
  {
    trainNumber: '12002',
    trainName: 'Vande Bharat Express',
    source: 'New Delhi (NDLS)',
    destination: 'Bhopal (BPL)',
    departureTime: '06:00 AM',
    arrivalTime: '02:00 PM',
    duration: '8h 00m',
    distanceKm: 708,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    classes: [
      { className: '1A', fare: 2650, totalSeats: 40, availableSeats: 32 },
      { className: 'CC', fare: 1450, totalSeats: 120, availableSeats: 94 }
    ]
  },
  {
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    source: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '04:55 PM',
    arrivalTime: '08:35 AM',
    duration: '15h 40m',
    distanceKm: 1384,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 4200, totalSeats: 30, availableSeats: 18 },
      { className: '2A', fare: 2850, totalSeats: 80, availableSeats: 54 },
      { className: '3A', fare: 2100, totalSeats: 120, availableSeats: 88 }
    ]
  },
  {
    trainNumber: '12302',
    trainName: 'Howrah Rajdhani Express',
    source: 'New Delhi (NDLS)',
    destination: 'Howrah (HWH)',
    departureTime: '04:50 PM',
    arrivalTime: '09:55 AM',
    duration: '17h 05m',
    distanceKm: 1447,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 4400, totalSeats: 30, availableSeats: 12 },
      { className: '2A', fare: 2950, totalSeats: 70, availableSeats: 45 },
      { className: '3A', fare: 2200, totalSeats: 110, availableSeats: 76 },
      { className: 'SL', fare: 720, totalSeats: 150, availableSeats: 110 }
    ]
  },
  {
    trainNumber: '12028',
    trainName: 'Bengaluru Shatabdi Express',
    source: 'KSR Bengaluru (SBC)',
    destination: 'Chennai Central (MAS)',
    departureTime: '06:00 AM',
    arrivalTime: '11:00 AM',
    duration: '5h 00m',
    distanceKm: 362,
    runsOn: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 1850, totalSeats: 30, availableSeats: 22 },
      { className: 'CC', fare: 980, totalSeats: 140, availableSeats: 105 }
    ]
  },
  {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    source: 'New Delhi (NDLS)',
    destination: 'Varanasi (BSB)',
    departureTime: '06:00 AM',
    arrivalTime: '02:00 PM',
    duration: '8h 00m',
    distanceKm: 759,
    runsOn: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 2800, totalSeats: 36, availableSeats: 28 },
      { className: 'CC', fare: 1550, totalSeats: 110, availableSeats: 82 }
    ]
  },
  {
    trainNumber: '12958',
    trainName: 'Swarna Jayanti Rajdhani',
    source: 'New Delhi (NDLS)',
    destination: 'Ahmedabad (ADI)',
    departureTime: '07:55 PM',
    arrivalTime: '09:40 AM',
    duration: '13h 45m',
    distanceKm: 934,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 3600, totalSeats: 24, availableSeats: 16 },
      { className: '2A', fare: 2400, totalSeats: 60, availableSeats: 41 },
      { className: '3A', fare: 1750, totalSeats: 100, availableSeats: 69 },
      { className: 'SL', fare: 590, totalSeats: 120, availableSeats: 92 }
    ]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for Seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Train.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});

    // Seed Admin & User
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@railway.com',
      phone: '9876543210',
      password: 'Admin@123',
      role: 'admin'
    });

    const passenger = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9123456789',
      password: 'User@123',
      role: 'passenger'
    });

    // Seed Trains
    const trains = await Train.insertMany(sampleTrains);

    // Seed a Sample Booking for John Doe
    const sampleTrain = trains[1]; // Mumbai Rajdhani
    const pnr = 'PNR-9823410582';
    const sampleBooking = await Booking.create({
      pnr,
      userId: passenger._id,
      trainId: sampleTrain._id,
      travelDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      classType: '3A',
      passengers: [
        { name: 'John Doe', age: 29, gender: 'Male', seatNumber: 'B1-24', berth: 'Lower' },
        { name: 'Jane Doe', age: 27, gender: 'Female', seatNumber: 'B1-25', berth: 'Middle' }
      ],
      totalFare: sampleTrain.classes.find(c => c.className === '3A').fare * 2,
      status: 'Confirmed'
    });

    await Payment.create({
      transactionId: `TXN-${Date.now()}-8821`,
      bookingId: sampleBooking._id,
      userId: passenger._id,
      amount: sampleBooking.totalFare,
      paymentMethod: 'UPI',
      status: 'Success'
    });

    console.log('Database Seeded Successfully!');
    console.log('Admin Account: admin@railway.com / Admin@123');
    console.log('Passenger Account: john@example.com / User@123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
