/**
 * Input Validation Middleware for RailExpress API Endpoints
 * Validates request bodies and parameters, returning HTTP 400 with descriptive error messages.
 */

// Helper to check valid email syntax
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

// Helper to check valid date format YYYY-MM-DD or parseable date string
const isValidDateString = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

// Helper to check date is not in the past with timezone-safe local date parsing
const isDateNotPast = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return false;
  
  const clean = dateStr.trim().split('T')[0];
  const parts = clean.split('-');
  
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      // Local midnight date object (avoids UTC offset shifts)
      const inputDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate.getTime() >= today.getTime();
    }
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
};

// 1. User Registration Validation (Strictly forbids public admin role registration)
export const validateRegister = (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be at least 2 characters long'
    });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required'
    });
  }

  if (!phone || typeof phone !== 'string' || phone.trim().replace(/\D/g, '').length < 10) {
    return res.status(400).json({
      success: false,
      message: 'A valid phone number with at least 10 digits is required'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password is required and must be at least 6 characters long'
    });
  }

  // Security Guard: Prevent privilege escalation via public registration
  if (role !== undefined && (typeof role !== 'string' || role.toLowerCase() !== 'passenger')) {
    return res.status(400).json({
      success: false,
      message: "Security error: 'admin' role cannot be created via public registration"
    });
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.phone = phone.trim();
  req.body.role = 'passenger'; // Enforce passenger role on public registration
  next();
};

// 2. User Login Validation
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required'
    });
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

// 3. Train Creation Validation
export const validateTrainCreate = (req, res, next) => {
  const { trainNumber, trainName, source, destination, departureTime, arrivalTime, distanceKm } = req.body;

  if (!trainNumber || String(trainNumber).trim() === '') {
    return res.status(400).json({ success: false, message: 'Train number is required' });
  }

  if (!trainName || typeof trainName !== 'string' || trainName.trim() === '') {
    return res.status(400).json({ success: false, message: 'Train name is required' });
  }

  if (!source || typeof source !== 'string' || source.trim() === '') {
    return res.status(400).json({ success: false, message: 'Source station is required' });
  }

  if (!destination || typeof destination !== 'string' || destination.trim() === '') {
    return res.status(400).json({ success: false, message: 'Destination station is required' });
  }

  if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: 'Source and destination stations cannot be the same'
    });
  }

  if (distanceKm !== undefined && (isNaN(Number(distanceKm)) || Number(distanceKm) <= 0)) {
    return res.status(400).json({
      success: false,
      message: 'Distance must be a positive number'
    });
  }

  next();
};

// 4. Ticket Booking Validation (Guards non-object passenger entries & timezone-safe date)
export const validateBookingCreate = (req, res, next) => {
  const { trainId, travelDate, classType, passengers, paymentMethod } = req.body;

  if (!trainId || String(trainId).trim() === '') {
    return res.status(400).json({ success: false, message: 'Train ID is required' });
  }

  if (!travelDate || !isValidDateString(travelDate)) {
    return res.status(400).json({
      success: false,
      message: 'A valid journey date (YYYY-MM-DD) is required'
    });
  }

  if (!isDateNotPast(travelDate)) {
    return res.status(400).json({
      success: false,
      message: 'Journey date cannot be in the past'
    });
  }

  const allowedClasses = ['1A', '2A', '3A', 'SL', 'CC'];
  if (!classType || !allowedClasses.includes(classType)) {
    return res.status(400).json({
      success: false,
      message: `Invalid class type. Allowed classes are: ${allowedClasses.join(', ')}`
    });
  }

  if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one passenger detail is required'
    });
  }

  if (passengers.length > 4) {
    return res.status(400).json({
      success: false,
      message: 'A maximum of 4 passengers is allowed per ticket booking'
    });
  }

  const allowedGenders = ['Male', 'Female', 'Other'];
  for (let i = 0; i < passengers.length; i++) {
    const p = passengers[i];
    
    // Strict validation that each passenger entry is an object and not null / array / primitive
    if (!p || typeof p !== 'object' || Array.isArray(p)) {
      return res.status(400).json({
        success: false,
        message: `Passenger ${i + 1} must be a valid passenger details object`
      });
    }

    if (!p.name || typeof p.name !== 'string' || p.name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: `Passenger ${i + 1}: Name is required and must be at least 2 characters`
      });
    }

    const ageNum = Number(p.age);
    if (p.age === undefined || p.age === null || isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120) {
      return res.status(400).json({
        success: false,
        message: `Passenger ${i + 1}: Age must be a valid whole number between 1 and 120`
      });
    }

    if (p.gender && !allowedGenders.includes(p.gender)) {
      return res.status(400).json({
        success: false,
        message: `Passenger ${i + 1}: Gender must be 'Male', 'Female', or 'Other'`
      });
    }
  }

  if (paymentMethod && !['UPI', 'Card', 'NetBanking'].includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: "Payment method must be 'UPI', 'Card', or 'NetBanking'"
    });
  }

  next();
};

// 5. PNR Parameter Validation
export const validatePnrParam = (req, res, next) => {
  const { pnr } = req.params;
  if (!pnr || typeof pnr !== 'string' || pnr.trim().length < 5 || pnr.trim().length > 30) {
    return res.status(400).json({
      success: false,
      message: 'Invalid PNR number format'
    });
  }
  req.params.pnr = pnr.trim();
  next();
};
