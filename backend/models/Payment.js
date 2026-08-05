import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: ['UPI', 'Card', 'NetBanking'] },
    status: { type: String, enum: ['Success', 'Refunded', 'Failed'], default: 'Success' },
    paymentDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
