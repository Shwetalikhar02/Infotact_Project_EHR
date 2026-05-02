import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, Shield, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTE_PATHS } from '@/lib/index';
import type { UserRole } from '@/lib/index';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('patient');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: 'patient', label: 'Patient', icon: <User size={16} /> },
    { value: 'doctor', label: 'Doctor', icon: <Stethoscope size={16} /> },
    { value: 'admin', label: 'Admin', icon: <Shield size={16} /> },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    if (role === 'patient') navigate(ROUTE_PATHS.PATIENT_DASHBOARD);
    else if (role === 'doctor') navigate(ROUTE_PATHS.DOCTOR_DASHBOARD);
    else navigate(ROUTE_PATHS.ADMIN_DASHBOARD);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex flex-col w-5/12 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-accent/10 translate-x-1/3" />
          <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full bg-white/5 -translate-x-1/4" />
        </div>
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">MediConnect</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-white font-bold text-4xl leading-tight mb-4">
                Join 50,000+<br />
                <span className="text-accent">patients & doctors</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                Create your free account and experience healthcare that fits your schedule.
              </p>
            </motion.div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Doctors' },
                { value: '50K+', label: 'Patients' },
                { value: '4.9★', label: 'App Rating' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-4 text-center border border-white/10">
                  <p className="text-accent font-bold text-xl">{stat.value}</p>
                  <p className="text-white/60 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 w-fit">
            <Shield size={14} className="text-accent" />
            <span className="text-accent text-sm font-semibold">HIPAA Compliant</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="text-foreground font-bold text-lg">MediConnect</span>
          </div>

          <div className="mb-6">
            <h2 className="text-foreground font-bold text-2xl mb-1">Create your account</h2>
            <p className="text-muted-foreground text-sm">Get started with MediConnect for free</p>
          </div>

          {/* Role Selector */}
          <div className="mb-5">
            <Label className="text-foreground text-sm font-medium mb-2 block">I am a</Label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                    role === r.value
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {r.icon}
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="name" className="text-foreground text-sm font-medium mb-1.5 block">Full Name</Label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Dr. Jane Smith"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={`pl-9 ${errors.name ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-foreground text-sm font-medium mb-1.5 block">Email Address</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={`pl-9 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-foreground text-sm font-medium mb-1.5 block">Phone Number</Label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className={`pl-9 ${errors.phone ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-foreground text-sm font-medium mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`pl-9 pr-9 ${errors.password ? 'border-destructive' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-accent hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-accent hover:underline">Privacy Policy</a>.
            </p>

            <Button
              type="submit"
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{' '}
            <Link to={ROUTE_PATHS.LOGIN} className="text-accent font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
