import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRegister, validateLogin } from '../middleware/validatorMiddleware.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiterMiddleware.js';

const router = express.Router();

router.post('/register', registerLimiter, validateRegister, registerUser);
router.post('/login', loginLimiter, validateLogin, loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
