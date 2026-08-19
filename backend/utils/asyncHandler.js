/**
 * Async handler utility to wrap async route handlers
 * and automatically forward errors to the centralized error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
