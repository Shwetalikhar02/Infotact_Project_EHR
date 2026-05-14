import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getDoctors,
  forgotPassword,
  resetPassword,
  validateResetToken,
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
router.post('/reset-password/:token', resetPassword); // changed to POST per requirements
router.get('/reset-password/:token/validate', validateResetToken);

// ── Private routes ─────────────────────────────────────────────────────────
router.get('/profile', protect, auditLog('VIEW_PROFILE'), getUserProfile);

export default router;
