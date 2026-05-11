// ─── Route Paths ────────────────────────────────────────────────────────────
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  // Patient
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_BOOK: '/patient/book',
  PATIENT_PRESCRIPTIONS: '/patient/prescriptions',
  PATIENT_PROFILE: '/patient/profile',
  PATIENT_RECORDS: '/patient/records',
  // Doctor
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_APPOINTMENTS: '/doctor/appointments',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_PRESCRIPTION: '/doctor/prescription',
  DOCTOR_PROFILE: '/doctor/profile',
  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_PATIENTS: '/admin/patients',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  // Shared
  CALL: '/call/:appointmentId',
} as const;

// ─── Types ───────────────────────────────────────────────────────────────────
export type UserRole = 'patient' | 'doctor' | 'admin';
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'scheduled';
export type DoctorStatus = 'active' | 'pending' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  rating?: number;
  totalPatients?: number;
  experience?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  availability: string[];
  status: DoctorStatus;
  email: string;
  patients: number;
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient';
  senderName: string;
  message: string;
  timestamp: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
export const SPECIALTIES = [
  'All Specialties',
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Gynecology',
  'Oncology',
  'Ophthalmology',
] as const;

export const STATUS_CONFIG: Record<AppointmentStatus, { label: string; className: string }> = {
  upcoming:  { label: 'Upcoming',  className: 'bg-blue-100 text-blue-700 border-blue-200' },
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700 border-red-200' },
  pending:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

export const DOCTOR_STATUS_CONFIG: Record<DoctorStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700 border-red-200' },
};
