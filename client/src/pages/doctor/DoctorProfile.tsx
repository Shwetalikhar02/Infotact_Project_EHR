import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Star, Stethoscope, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CURRENT_DOCTOR, DOCTORS } from '@/data/index';

export default function DoctorProfile() {
  const doctorData = DOCTORS.find(d => d.id === CURRENT_DOCTOR.id);

  return (
    <DashboardLayout role="doctor" userName={CURRENT_DOCTOR.name} userEmail={CURRENT_DOCTOR.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your professional information and availability.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-primary h-24 relative" />
            <div className="-mt-10 px-5 pb-5">
              <div className="w-20 h-20 rounded-full bg-accent border-4 border-card flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">{CURRENT_DOCTOR.name.split(' ').pop()?.charAt(0)}</span>
              </div>
              <div className="text-center mt-3">
                <h2 className="text-foreground font-bold text-lg">{CURRENT_DOCTOR.name}</h2>
                <p className="text-accent text-sm font-medium">{CURRENT_DOCTOR.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-foreground text-sm font-semibold">{doctorData?.rating}</span>
                  <span className="text-muted-foreground text-xs">({doctorData?.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Shield size={13} className="text-accent" />
                  <span className="text-accent text-xs font-medium">Verified Doctor</span>
                </div>
              </div>
              <Button size="sm" variant="outline" className="mt-4 rounded-full gap-2 w-full"><Edit size={14} /> Edit Profile</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mt-4 space-y-3">
            {[
              { label: 'Total Patients', value: doctorData?.patients ?? 0, icon: <User size={14} className="text-accent" /> },
              { label: 'Experience', value: doctorData?.experience ?? 'N/A', icon: <Stethoscope size={14} className="text-blue-500" /> },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">{stat.icon}<span className="text-muted-foreground text-sm">{stat.label}</span></div>
                <span className="text-foreground font-bold">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="text-foreground font-semibold text-base mb-5">Professional Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: CURRENT_DOCTOR.name, icon: <User size={15} /> },
                { label: 'Email Address', value: CURRENT_DOCTOR.email, icon: <Mail size={15} /> },
                { label: 'Phone', value: CURRENT_DOCTOR.phone, icon: <Phone size={15} /> },
                { label: 'Doctor ID', value: `DOC-${CURRENT_DOCTOR.id.toUpperCase()}001`, icon: <Shield size={15} /> },
                { label: 'Specialty', value: CURRENT_DOCTOR.specialty ?? '', icon: <Stethoscope size={15} /> },
                { label: 'License', value: `MED-LIC-2026-${CURRENT_DOCTOR.id.toUpperCase()}`, icon: <Shield size={15} /> },
              ].map(field => (
                <div key={field.label} className="bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1"><span className="text-muted-foreground">{field.icon}</span><span className="text-muted-foreground text-xs font-medium">{field.label}</span></div>
                  <p className="text-foreground text-sm font-medium font-mono">{field.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <h4 className="text-foreground text-sm font-semibold mb-3">Availability</h4>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <span key={day} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    doctorData?.availability.includes(day)
                      ? 'bg-accent/10 text-accent border-accent/20'
                      : 'bg-muted text-muted-foreground border-border'
                  }`}>{day}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
