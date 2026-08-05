import Train from '../models/Train.js';
import { isMongoConnected } from '../config/db.js';

export const inMemoryTrains = [
  {
    _id: 'trn_12002',
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
    _id: 'trn_12952',
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
    _id: 'trn_12302',
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
    _id: 'trn_12028',
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
    _id: 'trn_22436',
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
    _id: 'trn_12958',
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

export const getTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (isMongoConnected) {
      let query = {};
      if (source && source.trim() !== '') {
        query.source = { $regex: new RegExp(source, 'i') };
      }
      if (destination && destination.trim() !== '') {
        query.destination = { $regex: new RegExp(destination, 'i') };
      }

      const trains = await Train.find(query).sort({ trainNumber: 1 });
      const sources = await Train.distinct('source');
      const destinations = await Train.distinct('destination');
      const stations = Array.from(new Set([...sources, ...destinations])).sort();

      return res.json({ trains, stations });
    } else {
      let trains = [...inMemoryTrains];
      if (source && source.trim() !== '') {
        trains = trains.filter((t) => t.source.toLowerCase().includes(source.toLowerCase()));
      }
      if (destination && destination.trim() !== '') {
        trains = trains.filter((t) => t.destination.toLowerCase().includes(destination.toLowerCase()));
      }

      const sources = inMemoryTrains.map((t) => t.source);
      const destinations = inMemoryTrains.map((t) => t.destination);
      const stations = Array.from(new Set([...sources, ...destinations])).sort();

      return res.json({ trains, stations });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrainById = async (req, res) => {
  try {
    if (isMongoConnected) {
      const train = await Train.findById(req.params.id);
      if (!train) return res.status(404).json({ message: 'Train not found' });
      return res.json(train);
    } else {
      const train = inMemoryTrains.find((t) => t._id === req.params.id);
      if (!train) return res.status(404).json({ message: 'Train not found' });
      return res.json(train);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTrain = async (req, res) => {
  try {
    const { trainNumber, trainName, source, destination, departureTime, arrivalTime, duration, distanceKm, runsOn, classes } = req.body;

    if (isMongoConnected) {
      const existing = await Train.findOne({ trainNumber });
      if (existing) return res.status(400).json({ message: 'Train number already exists' });

      const train = await Train.create({
        trainNumber,
        trainName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        distanceKm: Number(distanceKm) || 500,
        runsOn: runsOn || ['Daily'],
        classes: classes || [
          { className: '1A', fare: 2400, totalSeats: 40, availableSeats: 40 },
          { className: '2A', fare: 1500, totalSeats: 60, availableSeats: 60 },
          { className: '3A', fare: 950, totalSeats: 80, availableSeats: 80 },
          { className: 'SL', fare: 380, totalSeats: 120, availableSeats: 120 }
        ]
      });
      return res.status(201).json(train);
    } else {
      const existing = inMemoryTrains.find((t) => t.trainNumber === trainNumber);
      if (existing) return res.status(400).json({ message: 'Train number already exists' });

      const newTrain = {
        _id: `trn_${Date.now()}`,
        trainNumber,
        trainName,
        source,
        destination,
        departureTime,
        arrivalTime,
        duration,
        distanceKm: Number(distanceKm) || 500,
        runsOn: runsOn || ['Daily'],
        classes: classes || [
          { className: '1A', fare: 2400, totalSeats: 40, availableSeats: 40 },
          { className: '2A', fare: 1500, totalSeats: 60, availableSeats: 60 },
          { className: '3A', fare: 950, totalSeats: 80, availableSeats: 80 },
          { className: 'SL', fare: 380, totalSeats: 120, availableSeats: 120 }
        ]
      };
      inMemoryTrains.push(newTrain);
      return res.status(201).json(newTrain);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrain = async (req, res) => {
  try {
    if (isMongoConnected) {
      const train = await Train.findById(req.params.id);
      if (!train) return res.status(404).json({ message: 'Train not found' });
      Object.assign(train, req.body);
      const updatedTrain = await train.save();
      return res.json(updatedTrain);
    } else {
      const index = inMemoryTrains.findIndex((t) => t._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Train not found' });
      inMemoryTrains[index] = { ...inMemoryTrains[index], ...req.body };
      return res.json(inMemoryTrains[index]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrain = async (req, res) => {
  try {
    if (isMongoConnected) {
      const train = await Train.findByIdAndDelete(req.params.id);
      if (!train) return res.status(404).json({ message: 'Train not found' });
      return res.json({ message: 'Train deleted successfully' });
    } else {
      const index = inMemoryTrains.findIndex((t) => t._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Train not found' });
      inMemoryTrains.splice(index, 1);
      return res.json({ message: 'Train deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
