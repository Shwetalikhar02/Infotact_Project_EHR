import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit, Shield, Calendar, Save, X, Droplets, AlertCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PATIENT_APPOINTMENTS } from '@/data/index';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function PatientProfile() {
  const user = useAuthStore(state => state.user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:             user?.name || 'Patient User',
    email:            user?.email || 'patient@gmail.com',
    phone:            '+1 (555) 234-5678',
    bloodGroup:       'O+',
    allergies:        'Penicillin, Pollen',
    emergencyContact: 'John Johnson — +1 (555) 999-0000',
  });
  const [saved, setSaved] = useState({ ...form });

  const handleSave = () => {
    setSaved({ ...form });
    setEditing(false);
    toast.success('Profile updated successfully!');
  };
  const handleCancel = () => {
    setForm({ ...saved });
    setEditing(false);
  };

  const name = saved.name;
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DashboardLayout role="patient" userName={user?.name || saved.name} userEmail={user?.email || saved.email}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-bold text-2xl">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your personal health information.</p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="bg-primary text-primary-foreground rounded-full gap-2">
            <Edit size={15} /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-accent text-white rounded-full gap-2">
              <Save size={15} /> Save
            </Button>
            <Button onClick={handleCancel} variant="outline" className="rounded-full gap-2">
              <X size={15} /> Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-accent/70 h-28 relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full bg-white border-4 border-card flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-2xl">{initials}</span>
              </div>
            </div>
            <div className="pt-14 px-5 pb-5 text-center">
              <h2 className="text-foreground font-bold text-lg">{saved.name}</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Patient</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Shield size={13} className="text-accent" />
                <span className="text-accent text-xs font-medium">Verified Patient</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mt-4 space-y-3">
            {[
              { label: 'Total Appointments', value: PATIENT_APPOINTMENTS.length, icon: <Calendar size={14} className="text-accent" /> },
              { label: 'Completed',          value: PATIENT_APPOINTMENTS.filter(a => a.status === 'completed').length, icon: <Shield size={14} className="text-green-500" /> },
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

          {/* Health Quick Info */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mt-4">
            <h3 className="text-foreground font-semibold text-sm mb-3">Health Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets size={14} className="text-red-500" />
                  <span className="text-muted-foreground text-sm">Blood Group</span>
                </div>
                <span className="text-foreground font-bold text-sm">{saved.bloodGroup}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={14} className="text-yellow-500" />
                  <span className="text-muted-foreground text-sm">Allergies</span>
                </div>
                <p className="text-foreground text-xs bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1.5 text-yellow-800">
                  {saved.allergies || 'None recorded'}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={14} className="text-red-500" />
                  <span className="text-muted-foreground text-sm">Emergency Contact</span>
                </div>
                <p className="text-foreground text-xs">{saved.emergencyContact}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info / Edit Form */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="text-foreground font-semibold text-base mb-5 flex items-center gap-2">
              <User size={16} className="text-accent" />
              Personal Information
            </h3>

            {editing ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',          key: 'name',             icon: <User size={15} />,        type: 'text' },
                  { label: 'Email Address',      key: 'email',            icon: <Mail size={15} />,        type: 'email' },
                  { label: 'Phone',              key: 'phone',            icon: <Phone size={15} />,       type: 'tel' },
                  { label: 'Blood Group',        key: 'bloodGroup',       icon: <Droplets size={15} />,    type: 'text' },
                  { label: 'Allergies',          key: 'allergies',        icon: <AlertCircle size={15} />, type: 'text' },
                  { label: 'Emergency Contact',  key: 'emergencyContact', icon: <Heart size={15} />,       type: 'text' },
                ].map(field => (
                  <div key={field.key}>
                    <Label className="text-muted-foreground text-xs font-medium mb-1.5 block">{field.label}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{field.icon}</span>
                      <Input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name',          value: saved.name,             icon: <User size={15} /> },
                  { label: 'Email Address',      value: saved.email,            icon: <Mail size={15} /> },
                  { label: 'Phone',              value: saved.phone,            icon: <Phone size={15} /> },
                  { label: 'Blood Group',        value: saved.bloodGroup,       icon: <Droplets size={15} /> },
                  { label: 'Allergies',          value: saved.allergies,        icon: <AlertCircle size={15} /> },
                  { label: 'Emergency Contact',  value: saved.emergencyContact, icon: <Heart size={15} /> },
                  { label: 'Patient ID',         value: `MED-${(user?._id || 'P001').slice(-6).toUpperCase()}`, icon: <Shield size={15} /> },
                ].map(field => (
                  <div key={field.label} className="bg-muted rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-muted-foreground">{field.icon}</span>
                      <span className="text-muted-foreground text-xs font-medium">{field.label}</span>
                    </div>
                    <p className="text-foreground text-sm font-medium">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
