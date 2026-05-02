import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit, Shield, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CURRENT_PATIENT, PATIENT_APPOINTMENTS } from '@/data/index';

export default function PatientProfile() {
  return (
    <DashboardLayout role="patient" userName={CURRENT_PATIENT.name} userEmail={CURRENT_PATIENT.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal health information.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary h-24 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full bg-white border-4 border-card flex items-center justify-center">
                <span className="text-primary font-bold text-2xl">{CURRENT_PATIENT.name.charAt(0)}</span>
              </div>
            </div>
            <div className="pt-14 px-5 pb-5 text-center">
              <h2 className="text-foreground font-bold text-lg">{CURRENT_PATIENT.name}</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Patient</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Shield size={13} className="text-accent" />
                <span className="text-accent text-xs font-medium">Verified Patient</span>
              </div>
              <Button size="sm" variant="outline" className="mt-4 rounded-full gap-2 w-full">
                <Edit size={14} /> Edit Profile
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mt-4 space-y-3">
            {[
              { label: 'Total Appointments', value: PATIENT_APPOINTMENTS.length, icon: <Calendar size={14} className="text-accent" /> },
              { label: 'Completed', value: PATIENT_APPOINTMENTS.filter(a => a.status === 'completed').length, icon: <Shield size={14} className="text-green-500" /> },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-muted-foreground text-sm">{stat.label}</span>
                </div>
                <span className="text-foreground font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="text-foreground font-semibold text-base mb-5">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: CURRENT_PATIENT.name, icon: <User size={15} /> },
                { label: 'Email Address', value: CURRENT_PATIENT.email, icon: <Mail size={15} /> },
                { label: 'Phone', value: CURRENT_PATIENT.phone, icon: <Phone size={15} /> },
                { label: 'Patient ID', value: `MED-${CURRENT_PATIENT.id.toUpperCase()}001`, icon: <Shield size={15} /> },
              ].map(field => (
                <div key={field.label} className="bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-muted-foreground">{field.icon}</span>
                    <span className="text-muted-foreground text-xs font-medium">{field.label}</span>
                  </div>
                  <p className="text-foreground text-sm font-medium font-mono">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
