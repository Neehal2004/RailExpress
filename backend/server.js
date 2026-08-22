import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB, { isMongoConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import trainRoutes from './routes/trainRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Ensure JWT secret is present in production
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[Fatal Error] JWT_SECRET environment variable is missing in production. Refusing to start.');
    process.exit(1);
  } else {
    console.warn('⚠️ [Warning] JWT_SECRET is not set in .env. Authentication operations require a valid JWT_SECRET.');
  }
}

const app = express();

// Configured CORS Security
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173']
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Comprehensive Production Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Favicon route to prevent unnecessary 404 error log noise
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root route with Live Health Status
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Railway Ticket Booking System API is running...',
    databaseStatus: isMongoConnected ? 'Connected to MongoDB' : 'Hybrid In-Memory Mode (MongoDB Disconnected)',
    timestamp: new Date().toISOString()
  });
});

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_PORT_RETRIES = 5;

function startServer(port, retryCount = 0) {
  const server = app.listen(port, () => {
    console.log(`[Server] RailExpress API server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (retryCount < MAX_PORT_RETRIES) {
        console.log(`[Server] Port ${port} is occupied. Retrying on port ${port + 1} (attempt ${retryCount + 1}/${MAX_PORT_RETRIES})...`);
        startServer(port + 1, retryCount + 1);
      } else {
        console.error(`[Server Fatal] Port ${port} is occupied. Exceeded maximum retry attempts (${MAX_PORT_RETRIES}).`);
        process.exit(1);
      }
    } else {
      console.error('[Server Error]', err.message);
      process.exit(1);
    }
  });
}

startServer(DEFAULT_PORT);

// Connect to MongoDB
connectDB().catch((err) => {
  if (process.env.NODE_ENV === 'production') {
    console.error('[Server Fatal] Failed to connect to database in production mode. Process exiting.');
    process.exit(1);
  }
});
