import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Train from '../models/Train.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rtbs';

export const sampleTrains = [
  // 1. New Delhi ⇄ Bhopal
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
    trainNumber: '12001',
    trainName: 'Vande Bharat Express (Return)',
    source: 'Bhopal (BPL)',
    destination: 'New Delhi (NDLS)',
    departureTime: '03:00 PM',
    arrivalTime: '11:00 PM',
    duration: '8h 00m',
    distanceKm: 708,
    runsOn: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    classes: [
      { className: '1A', fare: 2650, totalSeats: 40, availableSeats: 35 },
      { className: 'CC', fare: 1450, totalSeats: 120, availableSeats: 102 }
    ]
  },

  // 2. New Delhi ⇄ Mumbai Central
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
    trainNumber: '12951',
    trainName: 'New Delhi Rajdhani Express (Return)',
    source: 'Mumbai Central (MMCT)',
    destination: 'New Delhi (NDLS)',
    departureTime: '05:00 PM',
    arrivalTime: '08:30 AM',
    duration: '15h 30m',
    distanceKm: 1384,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 4200, totalSeats: 30, availableSeats: 21 },
      { className: '2A', fare: 2850, totalSeats: 80, availableSeats: 62 },
      { className: '3A', fare: 2100, totalSeats: 120, availableSeats: 95 }
    ]
  },

  // 3. New Delhi ⇄ Howrah
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
    trainNumber: '12301',
    trainName: 'New Delhi Rajdhani Express (Return)',
    source: 'Howrah (HWH)',
    destination: 'New Delhi (NDLS)',
    departureTime: '04:55 PM',
    arrivalTime: '10:00 AM',
    duration: '17h 05m',
    distanceKm: 1447,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 4400, totalSeats: 30, availableSeats: 15 },
      { className: '2A', fare: 2950, totalSeats: 70, availableSeats: 50 },
      { className: '3A', fare: 2200, totalSeats: 110, availableSeats: 82 },
      { className: 'SL', fare: 720, totalSeats: 150, availableSeats: 124 }
    ]
  },

  // 4. KSR Bengaluru ⇄ Chennai Central
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
    trainNumber: '12027',
    trainName: 'Chennai Shatabdi Express (Return)',
    source: 'Chennai Central (MAS)',
    destination: 'KSR Bengaluru (SBC)',
    departureTime: '05:30 PM',
    arrivalTime: '10:30 PM',
    duration: '5h 00m',
    distanceKm: 362,
    runsOn: ['Mon', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 1850, totalSeats: 30, availableSeats: 26 },
      { className: 'CC', fare: 980, totalSeats: 140, availableSeats: 118 }
    ]
  },

  // 5. New Delhi ⇄ Varanasi
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
    trainNumber: '22435',
    trainName: 'Vande Bharat Express (Return)',
    source: 'Varanasi (BSB)',
    destination: 'New Delhi (NDLS)',
    departureTime: '03:00 PM',
    arrivalTime: '11:00 PM',
    duration: '8h 00m',
    distanceKm: 759,
    runsOn: ['Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 2800, totalSeats: 36, availableSeats: 30 },
      { className: 'CC', fare: 1550, totalSeats: 110, availableSeats: 91 }
    ]
  },

  // 6. New Delhi ⇄ Ahmedabad
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
  },
  {
    trainNumber: '12957',
    trainName: 'Swarna Jayanti Rajdhani (Return)',
    source: 'Ahmedabad (ADI)',
    destination: 'New Delhi (NDLS)',
    departureTime: '05:45 PM',
    arrivalTime: '07:30 AM',
    duration: '13h 45m',
    distanceKm: 934,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 3600, totalSeats: 24, availableSeats: 19 },
      { className: '2A', fare: 2400, totalSeats: 60, availableSeats: 47 },
      { className: '3A', fare: 1750, totalSeats: 100, availableSeats: 74 },
      { className: 'SL', fare: 590, totalSeats: 120, availableSeats: 98 }
    ]
  },

  // 7. New Delhi ⇄ Jaipur
  {
    trainNumber: '20978',
    trainName: 'Ajmer Vande Bharat Express',
    source: 'New Delhi (NDLS)',
    destination: 'Jaipur (JP)',
    departureTime: '06:10 AM',
    arrivalTime: '10:40 AM',
    duration: '4h 30m',
    distanceKm: 308,
    runsOn: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 1650, totalSeats: 30, availableSeats: 22 },
      { className: 'CC', fare: 880, totalSeats: 120, availableSeats: 98 }
    ]
  },
  {
    trainNumber: '20977',
    trainName: 'Vande Bharat Express (Return)',
    source: 'Jaipur (JP)',
    destination: 'New Delhi (NDLS)',
    departureTime: '06:00 PM',
    arrivalTime: '10:30 PM',
    duration: '4h 30m',
    distanceKm: 308,
    runsOn: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 1650, totalSeats: 30, availableSeats: 25 },
      { className: 'CC', fare: 880, totalSeats: 120, availableSeats: 104 }
    ]
  },

  // 8. Mumbai Central ⇄ Ahmedabad
  {
    trainNumber: '20901',
    trainName: 'Vande Bharat Express',
    source: 'Mumbai Central (MMCT)',
    destination: 'Ahmedabad (ADI)',
    departureTime: '06:00 AM',
    arrivalTime: '11:25 AM',
    duration: '5h 25m',
    distanceKm: 491,
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 2500, totalSeats: 40, availableSeats: 31 },
      { className: 'CC', fare: 1380, totalSeats: 130, availableSeats: 110 }
    ]
  },
  {
    trainNumber: '20902',
    trainName: 'Vande Bharat Express (Return)',
    source: 'Ahmedabad (ADI)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '03:00 PM',
    arrivalTime: '08:25 PM',
    duration: '5h 25m',
    distanceKm: 491,
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 2500, totalSeats: 40, availableSeats: 34 },
      { className: 'CC', fare: 1380, totalSeats: 130, availableSeats: 115 }
    ]
  },

  // 9. Mumbai Central ⇄ Pune
  {
    trainNumber: '12123',
    trainName: 'Deccan Queen Express',
    source: 'Mumbai Central (MMCT)',
    destination: 'Pune Junction (PUNE)',
    departureTime: '05:10 PM',
    arrivalTime: '08:25 PM',
    duration: '3h 15m',
    distanceKm: 192,
    runsOn: ['Daily'],
    classes: [
      { className: 'CC', fare: 480, totalSeats: 150, availableSeats: 120 },
      { className: 'SL', fare: 190, totalSeats: 200, availableSeats: 165 }
    ]
  },
  {
    trainNumber: '12124',
    trainName: 'Deccan Queen Express (Return)',
    source: 'Pune Junction (PUNE)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '07:15 AM',
    arrivalTime: '10:25 AM',
    duration: '3h 10m',
    distanceKm: 192,
    runsOn: ['Daily'],
    classes: [
      { className: 'CC', fare: 480, totalSeats: 150, availableSeats: 132 },
      { className: 'SL', fare: 190, totalSeats: 200, availableSeats: 178 }
    ]
  },

  // 10. KSR Bengaluru ⇄ Mumbai Central
  {
    trainNumber: '11140',
    trainName: 'Udyan Express',
    source: 'KSR Bengaluru (SBC)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: '08:50 PM',
    arrivalTime: '07:20 PM',
    duration: '22h 30m',
    distanceKm: 1134,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 3500, totalSeats: 20, availableSeats: 14 },
      { className: '2A', fare: 2300, totalSeats: 50, availableSeats: 38 },
      { className: '3A', fare: 1600, totalSeats: 90, availableSeats: 72 },
      { className: 'SL', fare: 520, totalSeats: 160, availableSeats: 130 }
    ]
  },
  {
    trainNumber: '11139',
    trainName: 'Udyan Express (Return)',
    source: 'Mumbai Central (MMCT)',
    destination: 'KSR Bengaluru (SBC)',
    departureTime: '08:25 AM',
    arrivalTime: '07:00 AM',
    duration: '22h 35m',
    distanceKm: 1134,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 3500, totalSeats: 20, availableSeats: 16 },
      { className: '2A', fare: 2300, totalSeats: 50, availableSeats: 41 },
      { className: '3A', fare: 1600, totalSeats: 90, availableSeats: 78 },
      { className: 'SL', fare: 520, totalSeats: 160, availableSeats: 142 }
    ]
  },

  // 11. Howrah ⇄ Varanasi
  {
    trainNumber: '12333',
    trainName: 'Vibhuti Express',
    source: 'Howrah (HWH)',
    destination: 'Varanasi (BSB)',
    departureTime: '08:00 PM',
    arrivalTime: '09:40 AM',
    duration: '13h 40m',
    distanceKm: 681,
    runsOn: ['Daily'],
    classes: [
      { className: '2A', fare: 1850, totalSeats: 40, availableSeats: 29 },
      { className: '3A', fare: 1300, totalSeats: 80, availableSeats: 61 },
      { className: 'SL', fare: 420, totalSeats: 180, availableSeats: 140 }
    ]
  },
  {
    trainNumber: '12334',
    trainName: 'Vibhuti Express (Return)',
    source: 'Varanasi (BSB)',
    destination: 'Howrah (HWH)',
    departureTime: '06:00 PM',
    arrivalTime: '07:35 AM',
    duration: '13h 35m',
    distanceKm: 681,
    runsOn: ['Daily'],
    classes: [
      { className: '2A', fare: 1850, totalSeats: 40, availableSeats: 32 },
      { className: '3A', fare: 1300, totalSeats: 80, availableSeats: 66 },
      { className: 'SL', fare: 420, totalSeats: 180, availableSeats: 152 }
    ]
  },

  // 12. New Delhi ⇄ Lucknow
  {
    trainNumber: '82502',
    trainName: 'Tejas Express',
    source: 'New Delhi (NDLS)',
    destination: 'Lucknow Charbagh (LKO)',
    departureTime: '03:35 PM',
    arrivalTime: '10:05 PM',
    duration: '6h 30m',
    distanceKm: 512,
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 2450, totalSeats: 30, availableSeats: 24 },
      { className: 'CC', fare: 1250, totalSeats: 110, availableSeats: 88 }
    ]
  },
  {
    trainNumber: '82501',
    trainName: 'Tejas Express (Return)',
    source: 'Lucknow Charbagh (LKO)',
    destination: 'New Delhi (NDLS)',
    departureTime: '06:10 AM',
    arrivalTime: '12:25 PM',
    duration: '6h 15m',
    distanceKm: 512,
    runsOn: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
    classes: [
      { className: '1A', fare: 2450, totalSeats: 30, availableSeats: 26 },
      { className: 'CC', fare: 1250, totalSeats: 110, availableSeats: 94 }
    ]
  },

  // 13. Chennai Central ⇄ Howrah
  {
    trainNumber: '12840',
    trainName: 'Howrah Mail',
    source: 'Chennai Central (MAS)',
    destination: 'Howrah (HWH)',
    departureTime: '07:00 PM',
    arrivalTime: '11:00 PM',
    duration: '28h 00m',
    distanceKm: 1661,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 4800, totalSeats: 20, availableSeats: 12 },
      { className: '2A', fare: 3100, totalSeats: 50, availableSeats: 36 },
      { className: '3A', fare: 2200, totalSeats: 90, availableSeats: 68 },
      { className: 'SL', fare: 780, totalSeats: 180, availableSeats: 145 }
    ]
  },
  {
    trainNumber: '12839',
    trainName: 'Chennai Mail (Return)',
    source: 'Howrah (HWH)',
    destination: 'Chennai Central (MAS)',
    departureTime: '11:55 PM',
    arrivalTime: '03:45 AM',
    duration: '27h 50m',
    distanceKm: 1661,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 4800, totalSeats: 20, availableSeats: 14 },
      { className: '2A', fare: 3100, totalSeats: 50, availableSeats: 39 },
      { className: '3A', fare: 2200, totalSeats: 90, availableSeats: 72 },
      { className: 'SL', fare: 780, totalSeats: 180, availableSeats: 154 }
    ]
  },

  // 14. New Delhi ⇄ KSR Bengaluru
  {
    trainNumber: '12648',
    trainName: 'Karnataka Sampark Kranti',
    source: 'New Delhi (NDLS)',
    destination: 'KSR Bengaluru (SBC)',
    departureTime: '08:35 AM',
    arrivalTime: '07:15 PM',
    duration: '34h 40m',
    distanceKm: 2367,
    runsOn: ['Mon', 'Wed', 'Sat'],
    classes: [
      { className: '1A', fare: 5600, totalSeats: 20, availableSeats: 15 },
      { className: '2A', fare: 3600, totalSeats: 60, availableSeats: 42 },
      { className: '3A', fare: 2500, totalSeats: 100, availableSeats: 78 },
      { className: 'SL', fare: 890, totalSeats: 200, availableSeats: 160 }
    ]
  },
  {
    trainNumber: '12647',
    trainName: 'Karnataka Sampark Kranti (Return)',
    source: 'KSR Bengaluru (SBC)',
    destination: 'New Delhi (NDLS)',
    departureTime: '10:00 PM',
    arrivalTime: '09:10 AM',
    duration: '35h 10m',
    distanceKm: 2367,
    runsOn: ['Tue', 'Thu', 'Sun'],
    classes: [
      { className: '1A', fare: 5600, totalSeats: 20, availableSeats: 17 },
      { className: '2A', fare: 3600, totalSeats: 60, availableSeats: 48 },
      { className: '3A', fare: 2500, totalSeats: 100, availableSeats: 84 },
      { className: 'SL', fare: 890, totalSeats: 200, availableSeats: 172 }
    ]
  },

  // 15. New Delhi ⇄ Patna
  {
    trainNumber: '12310',
    trainName: 'Patna Rajdhani Express',
    source: 'New Delhi (NDLS)',
    destination: 'Patna Junction (PNBE)',
    departureTime: '05:15 PM',
    arrivalTime: '05:30 AM',
    duration: '12h 15m',
    distanceKm: 998,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 3800, totalSeats: 24, availableSeats: 18 },
      { className: '2A', fare: 2600, totalSeats: 60, availableSeats: 45 },
      { className: '3A', fare: 1900, totalSeats: 100, availableSeats: 76 }
    ]
  },
  {
    trainNumber: '12309',
    trainName: 'Patna Rajdhani Express (Return)',
    source: 'Patna Junction (PNBE)',
    destination: 'New Delhi (NDLS)',
    departureTime: '07:10 PM',
    arrivalTime: '07:40 AM',
    duration: '12h 30m',
    distanceKm: 998,
    runsOn: ['Daily'],
    classes: [
      { className: '1A', fare: 3800, totalSeats: 24, availableSeats: 20 },
      { className: '2A', fare: 2600, totalSeats: 60, availableSeats: 49 },
      { className: '3A', fare: 1900, totalSeats: 100, availableSeats: 81 }
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
    const sampleTrain = trains[2]; // Mumbai Rajdhani
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

    console.log('---------------------------------------------------------');
    console.log(`Database Seeded Successfully with ${trains.length} Onward & Return Trains!`);
    console.log('Admin Account: admin@railway.com / Admin@123');
    console.log('Passenger Account: john@example.com / User@123');
    console.log('---------------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
