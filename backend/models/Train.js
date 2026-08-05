import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  className: { type: String, required: true, enum: ['1A', '2A', '3A', 'SL', 'CC'] },
  fare: { type: Number, required: true },
  totalSeats: { type: Number, required: true, default: 60 },
  availableSeats: { type: Number, required: true, default: 60 }
});

const trainSchema = new mongoose.Schema(
  {
    trainNumber: { type: String, required: true, unique: true, trim: true },
    trainName: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    departureTime: { type: String, required: true }, // e.g. "06:00 AM"
    arrivalTime: { type: String, required: true },   // e.g. "02:15 PM"
    duration: { type: String, required: true },       // e.g. "8h 15m"
    distanceKm: { type: Number, required: true },
    runsOn: { type: [String], default: ['Daily'] },
    classes: [classSchema]
  },
  { timestamps: true }
);

const Train = mongoose.model('Train', trainSchema);
export default Train;
