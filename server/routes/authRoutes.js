import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyMasterPassword,
  googleLogin,
  setupMasterPassword,
} from '../controllers/authController.js';

import protect from '../middleware/authMiddleware.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/verify-master', protect, verifyMasterPassword);
router.post('/google', googleLogin);
router.post('/setup-master', protect, setupMasterPassword);

export default router;