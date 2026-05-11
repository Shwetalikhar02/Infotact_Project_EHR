import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Mail, Phone, Edit, Shield, Save, X, Star, DollarSign, FileText, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function DoctorProfile() {
  const user = useAuthStore(state => state.user);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:            user?.name || 'Dr. Demo Doctor',
    email:           user?.email || 'doctor@gmail.com',
    phone:           '+1 (555) 345-6789',
    specialization:  'Cardiology',
    licenseNumber:   'MED-2026-CARD-001',
    consultationFee: '150',
    experience:      '12 years',
    bio:             'Board-certified cardiologist with over 12 years of experience in interventional cardiology. Specializing in heart failure management, coronary artery disease, and preventive cardiology.',
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

  const initials = saved.name.split(' ').filter(w => w !== 'Dr.').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DashboardLayout role="doctor" userName={user?.name || saved.name} userEmail={user?.email || saved.email}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-foreground font-bold text-2xl">My Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your professional information.</p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)} className="bg-primary text-primary-foreground rounded-full gap-2">
            <Edit size={15} /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-accent text-white rounded-full gap-2">
              <Save size={15} /> Save Changes
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
                <span className="text-accent font-bold text-2xl">{initials}</span>
              </div>
            </div>
            <div className="pt-14 px-5 pb-5 text-center">
              <h2 className="text-foreground font-bold text-lg">{saved.name}</h2>
              <p className="text-accent text-sm mt-0.5 font-medium">{saved.specialization}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Shield size={13} className="text-accent" />
                <span className="text-accent text-xs font-medium">Board Certified</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mt-4 space-y-3">
            {[
              { label: 'Experience',        value: saved.experience, icon: <Award size={14} className="text-accent" /> },
              { label: 'Consultation Fee',  value: `$${saved.consultationFee}`, icon: <DollarSign size={14} className="text-green-500" /> },
              { label: 'Rating',            value: '4.9 ★',          icon: <Star size={14} className="text-yellow-500" /> },
              { label: 'License No.',       value: saved.licenseNumber, icon: <FileText size={14} className="text-muted-foreground" /> },
            ].map(stat => (
              <div key={stat.label} className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  {stat.icon}
                  <span className="text-muted-foreground text-sm">{stat.label}</span>
                </div>
                <span className="text-foreground font-bold text-sm text-right">{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Edit / View Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-5">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h3 className="text-foreground font-semibold text-base mb-5 flex items-center gap-2">
              <Stethoscope size={16} className="text-accent" />
              Professional Information
            </h3>

            {editing ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name',         key: 'name',            icon: <Stethoscope size={15} />, type: 'text' },
                    { label: 'Email',             key: 'email',           icon: <Mail size={15} />,        type: 'email' },
                    { label: 'Phone',             key: 'phone',           icon: <Phone size={15} />,       type: 'tel' },
                    { label: 'Specialization',    key: 'specialization',  icon: <Award size={15} />,       type: 'text' },
                    { label: 'License Number',    key: 'licenseNumber',   icon: <FileText size={15} />,    type: 'text' },
                    { label: 'Consultation Fee ($)', key: 'consultationFee', icon: <DollarSign size={15} />, type: 'number' },
                    { label: 'Experience',        key: 'experience',      icon: <Star size={15} />,        type: 'text' },
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
                <div>
                  <Label className="text-muted-foreground text-xs font-medium mb-1.5 block">Bio / About</Label>
                  <Textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    rows={4}
                    placeholder="Write a short bio..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name',       value: saved.name },
                    { label: 'Email',           value: saved.email },
                    { label: 'Phone',           value: saved.phone },
                    { label: 'Specialization',  value: saved.specialization },
                    { label: 'License Number',  value: saved.licenseNumber },
                    { label: 'Consultation Fee', value: `$${saved.consultationFee}` },
                    { label: 'Experience',      value: saved.experience },
                  ].map(field => (
                    <div key={field.label} className="bg-muted rounded-xl p-4">
                      <span className="text-muted-foreground text-xs font-medium block mb-1">{field.label}</span>
                      <p className="text-foreground text-sm font-medium">{field.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <span className="text-muted-foreground text-xs font-medium block mb-2">Bio</span>
                  <p className="text-foreground text-sm leading-relaxed">{saved.bio}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
