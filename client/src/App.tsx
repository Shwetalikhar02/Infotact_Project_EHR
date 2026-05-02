import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ROUTE_PATHS } from '@/lib/index';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import PatientDashboard from '@/pages/patient/Dashboard';
import PatientBook from '@/pages/patient/Book';
import PatientPrescriptions from '@/pages/patient/Prescriptions';
import PatientProfile from '@/pages/patient/Profile';
import DoctorDashboard from '@/pages/doctor/Dashboard';
import DoctorPrescription from '@/pages/doctor/Prescription';
import DoctorPatients from '@/pages/doctor/Patients';
import DoctorProfile from '@/pages/doctor/DoctorProfile';
import VideoCall from '@/pages/VideoCall';
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminDoctors from '@/pages/admin/Doctors';
import AdminPatients from '@/pages/admin/Patients';
import NotFound from '@/pages/not-found/Index';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path={ROUTE_PATHS.HOME} element={<LandingPage />} />
        <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
        <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />

        {/* Patient */}
        <Route path={ROUTE_PATHS.PATIENT_DASHBOARD} element={<PatientDashboard />} />
        <Route path={ROUTE_PATHS.PATIENT_BOOK} element={<PatientBook />} />
        <Route path={ROUTE_PATHS.PATIENT_PRESCRIPTIONS} element={<PatientPrescriptions />} />
        <Route path={ROUTE_PATHS.PATIENT_PROFILE} element={<PatientProfile />} />

        {/* Doctor */}
        <Route path={ROUTE_PATHS.DOCTOR_DASHBOARD} element={<DoctorDashboard />} />
        <Route path={ROUTE_PATHS.DOCTOR_APPOINTMENTS} element={<DoctorDashboard />} />
        <Route path={ROUTE_PATHS.DOCTOR_PRESCRIPTION} element={<DoctorPrescription />} />
        <Route path={ROUTE_PATHS.DOCTOR_PATIENTS} element={<DoctorPatients />} />
        <Route path={ROUTE_PATHS.DOCTOR_PROFILE} element={<DoctorProfile />} />

        {/* Video Call */}
        <Route path={ROUTE_PATHS.CALL} element={<VideoCall />} />

        {/* Admin */}
        <Route path={ROUTE_PATHS.ADMIN_DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTE_PATHS.ADMIN_DOCTORS} element={<AdminDoctors />} />
        <Route path={ROUTE_PATHS.ADMIN_PATIENTS} element={<AdminPatients />} />
        <Route path={ROUTE_PATHS.ADMIN_ANALYTICS} element={<AdminDashboard />} />
        <Route path={ROUTE_PATHS.ADMIN_SETTINGS} element={<AdminDashboard />} />

        {/* Fallbacks */}
        <Route path="/admin" element={<Navigate to={ROUTE_PATHS.ADMIN_DASHBOARD} replace />} />
        <Route path="/patient" element={<Navigate to={ROUTE_PATHS.PATIENT_DASHBOARD} replace />} />
        <Route path="/doctor" element={<Navigate to={ROUTE_PATHS.DOCTOR_DASHBOARD} replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </Router>
  );
}

export default App;
