import express from 'express';
import {
  bookAppointment,
  getMyPatientAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  addClinicalNotes
} from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { auditLog } from '../middlewares/auditMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/appointments
router.post(
  '/',
  authorizeRoles('patient', 'receptionist', 'admin'),
  auditLog('BOOK_APPOINTMENT'),
  bookAppointment
);

// @route   GET /api/appointments/me
router.get(
  '/me',
  authorizeRoles('patient'),
  auditLog('VIEW_OWN_APPOINTMENTS'),
  getMyPatientAppointments
);

// @route   GET /api/appointments/doctor
router.get(
  '/doctor',
  authorizeRoles('doctor'),
  auditLog('VIEW_DOCTOR_SCHEDULE'),
  getDoctorAppointments
);

// @route   GET /api/appointments
router.get(
  '/',
  authorizeRoles('receptionist', 'admin'),
  auditLog('VIEW_ALL_APPOINTMENTS'),
  getAllAppointments
);

// @route   PUT /api/appointments/:id/status
router.put(
  '/:id/status',
  authorizeRoles('doctor', 'receptionist', 'admin'),
  auditLog('UPDATE_APPOINTMENT_STATUS'),
  updateAppointmentStatus
);

// @route   PUT /api/appointments/:id/notes
router.put(
  '/:id/notes',
  authorizeRoles('doctor', 'admin'),
  auditLog('ADD_CLINICAL_NOTES'),
  addClinicalNotes
);

export default router;
