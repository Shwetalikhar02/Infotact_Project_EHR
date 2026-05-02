import express from 'express';
import {
  createOrUpdatePatientProfile,
  getMyProfile,
  getPatientById,
  getAllPatients,
} from '../controllers/patientController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { auditLog } from '../middlewares/auditMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/patients
router.post(
  '/',
  authorizeRoles('patient', 'admin', 'receptionist'),
  auditLog('CREATE_OR_UPDATE_PATIENT_RECORD'),
  createOrUpdatePatientProfile
);

// @route   GET /api/patients/me
router.get(
  '/me',
  authorizeRoles('patient'),
  auditLog('VIEW_OWN_PATIENT_RECORD'),
  getMyProfile
);

// @route   GET /api/patients/:id
router.get(
  '/:id',
  authorizeRoles('doctor', 'admin'),
  auditLog('VIEW_PATIENT_RECORD_BY_ID'),
  getPatientById
);

// @route   GET /api/patients
router.get(
  '/',
  authorizeRoles('doctor', 'admin', 'receptionist'),
  auditLog('VIEW_ALL_PATIENTS'),
  getAllPatients
);

export default router;
