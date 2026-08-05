import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryUsers } from '../controllers/authController.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rtbs_jwt_secret_key_123');

      if (isMongoConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const memUser = inMemoryUsers.find((u) => u._id === decoded.id);
        if (memUser) {
          req.user = {
            _id: memUser._id,
            name: memUser.name,
            email: memUser.email,
            phone: memUser.phone,
            role: memUser.role
          };
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User authorization token expired or invalid' });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};
