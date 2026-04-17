import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyMasterPassword,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login); // rate limit sirf login pe
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/verify-master', protect, verifyMasterPassword);

export default router;