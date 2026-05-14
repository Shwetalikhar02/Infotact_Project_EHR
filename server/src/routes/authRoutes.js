import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getDoctors,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { auditLog } from '../middlewares/auditMiddleware.js';

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────────────────
router.post('/register', auditLog('USER_REGISTER'), registerUser);
router.post('/login', auditLog('USER_LOGIN'), loginUser);
router.get('/doctors', getDoctors); // Public route — anyone can see doctors

// ── Password Reset routes ──────────────────────────────────────────────────
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// ── Private routes ─────────────────────────────────────────────────────────
router.get('/profile', protect, auditLog('VIEW_PROFILE'), getUserProfile);

export default router;
