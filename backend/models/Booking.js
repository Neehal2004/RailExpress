import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  seatNumber: { type: String, required: true },
  berth: { type: String, default: 'Lower' }
});

const bookingSchema = new mongoose.Schema(
  {
    pnr: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
    travelDate: { type: String, required: true },
    classType: { type: String, required: true },
    passengers: [passengerSchema],
    totalFare: { type: Number, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
    bookingDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
