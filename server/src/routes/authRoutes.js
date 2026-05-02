import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getDoctors,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { auditLog } from '../middlewares/auditMiddleware.js';

const router = express.Router();

// Public routes (with audit logging for login attempts)
router.post('/register', auditLog('USER_REGISTER'), registerUser);
router.post('/login', auditLog('USER_LOGIN'), loginUser);
router.get('/doctors', getDoctors); // Public route so anyone can see doctors

// Private routes
router.get('/profile', protect, auditLog('VIEW_PROFILE'), getUserProfile);

export default router;
