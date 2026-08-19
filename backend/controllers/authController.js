import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { isMongoConnected } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';

// In-Memory store fallback
export const inMemoryUsers = [
  {
    _id: 'usr_admin_1',
    name: 'System Admin',
    email: 'admin@railway.com',
    phone: '9876543210',
    passwordHash: bcrypt.hashSync('Admin@123', 10),
    role: 'admin'
  },
  {
    _id: 'usr_passenger_1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9123456789',
    passwordHash: bcrypt.hashSync('User@123', 10),
    role: 'passenger'
  }
];

const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user (Strictly passenger role, unique UUID for in-memory)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const role = 'passenger'; // Role is strictly server-enforced, never accepted from client

  if (isMongoConnected) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role
    });

    return res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    const userExists = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Cryptographically unique in-memory ID
    const newUser = {
      _id: `usr_${crypto.randomUUID()}`,
      name,
      email,
      phone,
      passwordHash: bcrypt.hashSync(password, 10),
      role
    };
    inMemoryUsers.push(newUser);

    return res.status(201).json({
      success: true,
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      token: generateToken(newUser._id)
    });
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (isMongoConnected) {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } else {
    const user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid email or password'
  });
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});
