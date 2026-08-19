import mongoose from 'mongoose';

export let isMongoConnected = false;

/**
 * Reconciles any in-memory writes created during a transient database disconnect back into MongoDB
 * to prevent split-brain state or orphaned records.
 */
const reconcileDataOnReconnect = async () => {
  try {
    const { inMemoryUsers } = await import('../controllers/authController.js');
    const { inMemoryBookings, inMemoryPayments } = await import('../controllers/bookingController.js');
    const { inMemoryTrains } = await import('../controllers/trainController.js');
    const User = (await import('../models/User.js')).default;
    const Booking = (await import('../models/Booking.js')).default;
    const Payment = (await import('../models/Payment.js')).default;
    const Train = (await import('../models/Train.js')).default;

    // 1. Reconcile temporary in-memory users into MongoDB
    for (const memUser of [...inMemoryUsers]) {
      if (memUser._id && memUser._id.startsWith('usr_') && !['usr_admin_1', 'usr_passenger_1'].includes(memUser._id)) {
        if (typeof memUser.passwordHash !== 'string' || !/^\$2[aby]\$\d{2}\$/.test(memUser.passwordHash)) continue;

        await User.updateOne(
          { email: memUser.email },
          {
            $set: {
              name: memUser.name,
              email: memUser.email,
              phone: memUser.phone,
              password: memUser.passwordHash,
              role: memUser.role || 'passenger'
            }
          },
          { upsert: true }
        );
        inMemoryUsers.splice(inMemoryUsers.indexOf(memUser), 1);
      }
    }

    // 2. Reconcile temporary in-memory bookings into MongoDB
    for (const memBooking of [...inMemoryBookings]) {
      if (memBooking._id && memBooking._id.startsWith('bk_') && memBooking._id !== 'bk_9823410582') {
        const exists = await Booking.findOne({ pnr: memBooking.pnr });
        if (!exists) {
          let trainObjId = memBooking.trainId;
          if (!mongoose.Types.ObjectId.isValid(trainObjId)) {
            const trainNumber = memBooking.trainNumber || memBooking.train?.trainNumber;
            const matchingTrain = inMemoryTrains.find((train) => String(train.trainNumber) === String(trainNumber));
            if (matchingTrain) {
              const persistedTrain = await Train.findOne({ trainNumber: matchingTrain.trainNumber });
              if (persistedTrain) trainObjId = persistedTrain._id;
            }
          }

          let userObjId = memBooking.userId;
          if (!mongoose.Types.ObjectId.isValid(userObjId)) {
            const passengerEmail = memBooking.passengerEmail || memBooking.user?.email || memBooking.passengers?.find((passenger) => passenger?.email)?.email;
            const matchingUser = passengerEmail ? await User.findOne({ email: passengerEmail }) : null;
            if (matchingUser) userObjId = matchingUser._id;
          }

          if (!mongoose.Types.ObjectId.isValid(trainObjId) || !mongoose.Types.ObjectId.isValid(userObjId)) {
            console.error(`[Database Event] Skipping booking ${memBooking.pnr}: owner or train could not be resolved.`);
            continue;
          }

          const newBooking = await Booking.create({
            pnr: memBooking.pnr,
            userId: userObjId,
            trainId: trainObjId,
            travelDate: memBooking.travelDate,
            classType: memBooking.classType,
            passengers: memBooking.passengers,
            totalFare: memBooking.totalFare,
            status: memBooking.status
          });

          const matchingPayment = inMemoryPayments.find((p) => p.bookingId === memBooking._id);
          if (matchingPayment) {
            await Payment.create({
              transactionId: matchingPayment.transactionId,
              bookingId: newBooking._id,
              userId: userObjId,
              amount: matchingPayment.amount,
              paymentMethod: matchingPayment.paymentMethod,
              status: matchingPayment.status
            });
          }

          inMemoryBookings.splice(inMemoryBookings.indexOf(memBooking), 1);
        }
      }
    }

    console.log('[Database Event] ✅ State reconciliation completed successfully.');
  } catch (err) {
    isMongoConnected = false;
    console.error(`[Database Event] Reconnection state reconciliation failed: ${err.message}`);
    throw err;
  }
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rtbs';
    const isAtlas = mongoURI.includes('mongodb+srv://');

    console.log(`[Database] Connecting to ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}...`);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: isAtlas ? 10000 : 3000
    });

    isMongoConnected = true;
    console.log('=========================================================');
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`Database Host: ${conn.connection.host}`);
    console.log(`Database Mode: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Localhost Database'}`);
    console.log('=========================================================');
    return conn;
  } catch (error) {
    isMongoConnected = false;
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rtbs';
    const isAtlas = mongoURI.includes('mongodb+srv://');

    console.log('---------------------------------------------------------');
    console.log(`[Database Notice] MongoDB initial connection unavailable: ${error.message}`);
    if (isAtlas) {
      console.log('⚠️ Could not reach MongoDB Atlas. Check your Network Access IP whitelist, Atlas credentials, or MONGO_URI in .env');
    } else {
      console.log('ℹ️ Localhost MongoDB service not detected on default port 27017.');
    }

    if (process.env.NODE_ENV === 'production') {
      console.error('[Database Fatal] Failing closed in production mode. Refusing to operate on unpersisted in-memory state.');
      throw error;
    }

    console.log('⚡ Running in Hybrid In-Memory Mode with full system functionality for development/testing.');
    console.log('---------------------------------------------------------');
  }
};

// Event listeners for connection lifecycle
mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('[Database Event] MongoDB connection lost. Switched to In-Memory Fallback.');
});

mongoose.connection.on('reconnected', async () => {
  console.log('[Database Event] MongoDB connection restored. Initiating state reconciliation...');
  isMongoConnected = false;
  await reconcileDataOnReconnect();
  isMongoConnected = true;
  console.log('[Database Event] ✅ MongoDB reconnected and active.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Event] MongoDB runtime error: ${err.message}`);
});

export default connectDB;
