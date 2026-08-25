import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';
import { inMemoryUsers } from '../controllers/authController.js';
import { getAuth } from '@clerk/express';

export const protect = async (req, res, next) => {
  // 1. Try Clerk authentication first if Clerk session/auth exists on request
  try {
    const authState = getAuth(req);
    if (authState && authState.userId) {
      req.user = {
        _id: authState.userId,
        id: authState.userId,
        name: authState.sessionClaims?.name || authState.sessionClaims?.email || 'Passenger',
        email: authState.sessionClaims?.email || '',
        role: authState.sessionClaims?.role || (authState.userId.includes('admin') ? 'admin' : 'passenger')
      };
      return next();
    }
  } catch (clerkErr) {
    // Continue to standard bearer token check if Clerk auth check is inactive or throws
  }

  // 2. Standard Bearer Token Fallback
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required: No authorization token provided'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Token is empty or malformed'
    });
  }

  // Check if token is a Clerk user ID string passed directly or JWT
  if (token.startsWith('user_')) {
    req.user = {
      _id: token,
      id: token,
      name: 'Clerk User',
      role: 'passenger'
    };
    return next();
  }

  const jwtSecret = process.env.JWT_SECRET || 'rtbs_jwt_secret_key_123';

  try {
    const decoded = jwt.verify(token, jwtSecret);

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
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User account no longer exists'
      });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Authorization token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid or corrupt token'
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required'
    });
  }
};
