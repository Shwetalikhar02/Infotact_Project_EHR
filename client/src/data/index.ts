import type { Appointment, Doctor, Prescription, User, ChatMessage } from '@/lib/index';

// ─── Current User Mocks ──────────────────────────────────────────────────────
export const CURRENT_PATIENT: User = {
  id: 'p1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 234-5678',
  role: 'patient',
};

export const CURRENT_DOCTOR: User = {
  id: 'd1',
  name: 'Dr. Michael Chen',
  email: 'dr.chen@mediconnect.com',
  phone: '+1 (555) 345-6789',
  role: 'doctor',
  specialty: 'Cardiology',
};

export const CURRENT_ADMIN: User = {
  id: 'a1',
  name: 'Admin User',
  email: 'admin@mediconnect.com',
  phone: '+1 (555) 100-0000',
  role: 'admin',
};

// ─── Doctors List ─────────────────────────────────────────────────────────────
export const DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Michael Chen', specialty: 'Cardiology', rating: 4.9, reviews: 312, experience: '15 yrs', availability: ['Mon', 'Wed', 'Fri'], status: 'active', email: 'dr.chen@mediconnect.com', patients: 1240 },
  { id: 'd2', name: 'Dr. Priya Sharma', specialty: 'Dermatology', rating: 4.8, reviews: 278, experience: '11 yrs', availability: ['Tue', 'Thu', 'Sat'], status: 'active', email: 'dr.sharma@mediconnect.com', patients: 987 },
  { id: 'd3', name: 'Dr. James Wilson', specialty: 'General Medicine', rating: 4.7, reviews: 445, experience: '20 yrs', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'active', email: 'dr.wilson@mediconnect.com', patients: 2150 },
  { id: 'd4', name: 'Dr. Emily Rodriguez', specialty: 'Neurology', rating: 4.9, reviews: 198, experience: '12 yrs', availability: ['Mon', 'Thu'], status: 'active', email: 'dr.rodriguez@mediconnect.com', patients: 634 },
  { id: 'd5', name: 'Dr. David Kim', specialty: 'Orthopedics', rating: 4.6, reviews: 362, experience: '18 yrs', availability: ['Tue', 'Fri'], status: 'active', email: 'dr.kim@mediconnect.com', patients: 1567 },
  { id: 'd6', name: 'Dr. Lisa Thompson', specialty: 'Pediatrics', rating: 4.9, reviews: 521, experience: '14 yrs', availability: ['Mon', 'Wed', 'Fri', 'Sat'], status: 'pending', email: 'dr.thompson@mediconnect.com', patients: 0 },
  { id: 'd7', name: 'Dr. Robert Patel', specialty: 'Psychiatry', rating: 4.8, reviews: 156, experience: '10 yrs', availability: ['Tue', 'Thu'], status: 'active', email: 'dr.patel@mediconnect.com', patients: 423 },
  { id: 'd8', name: 'Dr. Aisha Okafor', specialty: 'Gynecology', rating: 4.9, reviews: 289, experience: '16 yrs', availability: ['Mon', 'Tue', 'Thu'], status: 'pending', email: 'dr.okafor@mediconnect.com', patients: 0 },
];

// ─── Patient Appointments ────────────────────────────────────────────────────
export const PATIENT_APPOINTMENTS: Appointment[] = [
  { id: 'apt1', patientId: 'p1', patientName: 'Sarah Johnson', doctorId: 'd1', doctorName: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2026-05-06', time: '10:00 AM', status: 'upcoming' },
  { id: 'apt2', patientId: 'p1', patientName: 'Sarah Johnson', doctorId: 'd2', doctorName: 'Dr. Priya Sharma', specialty: 'Dermatology', date: '2026-05-10', time: '2:30 PM', status: 'upcoming' },
  { id: 'apt3', patientId: 'p1', patientName: 'Sarah Johnson', doctorId: 'd3', doctorName: 'Dr. James Wilson', specialty: 'General Medicine', date: '2026-04-20', time: '11:00 AM', status: 'completed' },
  { id: 'apt4', patientId: 'p1', patientName: 'Sarah Johnson', doctorId: 'd4', doctorName: 'Dr. Emily Rodriguez', specialty: 'Neurology', date: '2026-04-15', time: '9:00 AM', status: 'completed' },
  { id: 'apt5', patientId: 'p1', patientName: 'Sarah Johnson', doctorId: 'd5', doctorName: 'Dr. David Kim', specialty: 'Orthopedics', date: '2026-04-08', time: '3:00 PM', status: 'cancelled' },
];

// ─── Doctor Appointments ─────────────────────────────────────────────────────
export const DOCTOR_APPOINTMENTS: Appointment[] = [
  { id: 'dapt1', patientId: 'p2', patientName: 'James Martinez', doctorId: 'd1', doctorName: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2026-05-02', time: '9:00 AM', status: 'upcoming' },
  { id: 'dapt2', patientId: 'p3', patientName: 'Linda Cooper', doctorId: 'd1', doctorName: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2026-05-02', time: '10:30 AM', status: 'upcoming' },
  { id: 'dapt3', patientId: 'p4', patientName: 'Robert Garcia', doctorId: 'd1', doctorName: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2026-05-02', time: '12:00 PM', status: 'upcoming' },
  { id: 'dapt4', patientId: 'p5', patientName: 'Emma Wilson', doctorId: 'd1', doctorName: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2026-05-02', time: '2:00 PM', status: 'pending' },
  { id: 'dapt5', patientId: 'p6', patientName: 'Thomas Brown', doctorId: 'd1', doctorName: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2026-05-02', time: '3:30 PM', status: 'pending' },
  { id: 'dapt6', patientId: 'p7', patientName: 'Maria Davis', doctorId: 'd1', doctorName: 'Dr. Michael Chen', specialty: 'Cardiology', date: '2026-04-30', time: '11:00 AM', status: 'completed' },
];

// ─── Prescriptions ───────────────────────────────────────────────────────────
export const PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx1',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    doctorId: 'd3',
    doctorName: 'Dr. James Wilson',
    date: '2026-04-20',
    diagnosis: 'Seasonal Allergic Rhinitis',
    medicines: [
      { id: 'm1', name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
      { id: 'm2', name: 'Fluticasone Nasal Spray', dosage: '50mcg', frequency: 'Twice daily', duration: '30 days' },
    ],
    notes: 'Avoid known allergens. Stay hydrated.',
  },
  {
    id: 'rx2',
    patientId: 'p1',
    patientName: 'Sarah Johnson',
    doctorId: 'd4',
    doctorName: 'Dr. Emily Rodriguez',
    date: '2026-04-15',
    diagnosis: 'Tension Headache',
    medicines: [
      { id: 'm3', name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed (max 3x daily)', duration: '7 days' },
      { id: 'm4', name: 'Magnesium Citrate', dosage: '200mg', frequency: 'Once daily at night', duration: '60 days' },
    ],
    notes: 'Rest in a quiet, dark room during episodes. Limit screen time.',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  { id: 1, name: 'Jennifer Adams', role: 'Patient', rating: 5, text: 'MediConnect has completely transformed how I manage my health. Getting a consultation from home saved me hours, and the prescription was delivered digitally instantly!' },
  { id: 2, name: 'Dr. Marcus Lee', role: 'Cardiologist', rating: 5, text: 'As a doctor, I can now reach more patients and provide better continuity of care. The EHR integration is seamless and the video quality is excellent.' },
  { id: 3, name: 'Carlos Mendez', role: 'Patient', rating: 5, text: 'The scheduling is incredibly easy. I booked my appointment in minutes and joined the video call with one click. Truly healthcare at my fingertips.' },
];

// ─── Chat Messages ────────────────────────────────────────────────────────────
export const CHAT_MESSAGES: ChatMessage[] = [
  { id: 'msg1', sender: 'doctor', senderName: 'Dr. Chen', message: 'Hello! How are you feeling today?', timestamp: '10:01 AM' },
  { id: 'msg2', sender: 'patient', senderName: 'Sarah', message: 'Hi Doctor, I\'ve been experiencing some chest discomfort since yesterday.', timestamp: '10:02 AM' },
  { id: 'msg3', sender: 'doctor', senderName: 'Dr. Chen', message: 'I see. Can you describe the pain? Is it sharp or dull? Any shortness of breath?', timestamp: '10:03 AM' },
  { id: 'msg4', sender: 'patient', senderName: 'Sarah', message: 'It\'s more of a dull ache. No breathing issues, but I feel a little tired.', timestamp: '10:04 AM' },
  { id: 'msg5', sender: 'doctor', senderName: 'Dr. Chen', message: 'Thank you. I\'ll review your recent ECG report. Have you had any recent stressful events?', timestamp: '10:05 AM' },
];

// ─── Admin Analytics ─────────────────────────────────────────────────────────
export const WEEKLY_APPOINTMENTS = [
  { day: 'Mon', appointments: 42 },
  { day: 'Tue', appointments: 58 },
  { day: 'Wed', appointments: 71 },
  { day: 'Thu', appointments: 65 },
  { day: 'Fri', appointments: 83 },
  { day: 'Sat', appointments: 37 },
  { day: 'Sun', appointments: 19 },
];

export const ADMIN_STATS = {
  totalUsers: 12847,
  activeDoctors: 284,
  appointmentsToday: 156,
  systemStatus: 'Operational',
};
