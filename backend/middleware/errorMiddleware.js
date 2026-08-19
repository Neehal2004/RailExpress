/**
 * Centralized Error Handling and 404 Route Middleware
 */

// 404 Handler for undefined API routes
export const notFound = (req, res, next) => {
  const error = new Error(`API endpoint not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Centralized Error Handler
export const errorHandler = (err, req, res, next) => {
  // Guard against non-error (2xx/3xx) status codes leaking into error responses
  let statusCode = (res.statusCode >= 400 && res.statusCode < 600)
    ? res.statusCode
    : (err.statusCode >= 400 && err.statusCode < 600 ? err.statusCode : 500);

  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (Invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource ID format: '${err.value}'`;
  }

  // Handle Mongoose Schema ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Validation Error: ${errors.join('. ')}`;
  }

  // Handle Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue).join(', ') : 'field';
    message = `Duplicate value error: An entry with this ${field} already exists`;
  }

  // Handle JWT Malformed / Signature Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Authentication failed: Invalid authorization token';
  }

  // Handle JWT Token Expired Error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication failed: Authorization token has expired';
  }

  // Log error on server console for debugging without exposing to client
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[API Error] ${req.method} ${req.originalUrl} - ${statusCode}: ${err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
