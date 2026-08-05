import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { isMongoConnected } from '../config/db.js';
import bcrypt from 'bcryptjs';

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
  return jwt.sign({ id }, process.env.JWT_SECRET || 'rtbs_jwt_secret_key_123', {
    expiresIn: '30d'
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (isMongoConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({ name, email, phone, password, role: role || 'passenger' });
      return res.status(201).json({
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
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email,
        phone,
        passwordHash: bcrypt.hashSync(password, 10),
        role: role || 'passenger'
      };
      inMemoryUsers.push(newUser);

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        token: generateToken(newUser._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isMongoConnected) {
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        return res.json({
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
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        });
      }
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  res.json(req.user);
};
