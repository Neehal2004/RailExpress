import Train from '../models/Train.js';
import { isMongoConnected } from '../config/db.js';

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const inMemoryTrains = [
  // 1. New Delhi ⇄ Bhopal
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
    _id: 'trn_12001',
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
    _id: 'trn_12951',
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
    _id: 'trn_12301',
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
    _id: 'trn_12027',
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
    _id: 'trn_22435',
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
  },
  {
    _id: 'trn_12957',
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
    _id: 'trn_20978',
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
    _id: 'trn_20977',
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
    _id: 'trn_20901',
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
    _id: 'trn_20902',
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
    _id: 'trn_12123',
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
    _id: 'trn_12124',
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
    _id: 'trn_11140',
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
    _id: 'trn_11139',
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
    _id: 'trn_12333',
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
    _id: 'trn_12334',
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
    _id: 'trn_82502',
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
    _id: 'trn_82501',
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
    _id: 'trn_12840',
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
    _id: 'trn_12839',
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
    _id: 'trn_12648',
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
    _id: 'trn_12647',
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
    _id: 'trn_12310',
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
    _id: 'trn_12309',
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

export const getTrains = async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (isMongoConnected) {
      let query = {};
      if (source && source.trim() !== '') {
        const cleanSource = escapeRegex(source.trim());
        query.source = { $regex: new RegExp(cleanSource, 'i') };
      }
      if (destination && destination.trim() !== '') {
        const cleanDest = escapeRegex(destination.trim());
        query.destination = { $regex: new RegExp(cleanDest, 'i') };
      }

      const trains = await Train.find(query).sort({ trainNumber: 1 });
      const sources = await Train.distinct('source');
      const destinations = await Train.distinct('destination');
      const stations = Array.from(new Set([...sources, ...destinations])).sort();

      return res.json({ trains, stations });
    } else {
      let trains = [...inMemoryTrains];
      if (source && source.trim() !== '') {
        const searchSource = source.trim().toLowerCase();
        trains = trains.filter((t) => t.source.toLowerCase().includes(searchSource));
      }
      if (destination && destination.trim() !== '') {
        const searchDest = destination.trim().toLowerCase();
        trains = trains.filter((t) => t.destination.toLowerCase().includes(searchDest));
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
