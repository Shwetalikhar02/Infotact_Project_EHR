import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Stethoscope, Shield, Mail, Lock, User, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTE_PATHS } from '@/lib/index';
import type { UserRole } from '@/lib/index';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; name: string; desc: string }> = {
  admin:   { email: 'admin@gmail.com',   password: '00000000', name: 'Admin User',      desc: 'System management & analytics' },
  doctor:  { email: 'doctor@gmail.com',  password: '00000000', name: 'Dr. Demo Doctor', desc: 'Patient consultations & prescriptions' },
  patient: { email: 'patient@gmail.com', password: '00000000', name: 'Patient User',    desc: 'Book appointments & view records' },
};

export default function LoginPage() {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('patient');
  const [form, setForm] = useState({ email: DEMO_CREDENTIALS.patient.email, password: DEMO_CREDENTIALS.patient.password });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const roles: { value: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'patient', label: 'Patient', icon: <User size={16} />, color: 'bg-blue-500' },
    { value: 'doctor',  label: 'Doctor',  icon: <Stethoscope size={16} />, color: 'bg-accent' },
    { value: 'admin',   label: 'Admin',   icon: <Shield size={16} />, color: 'bg-purple-500' },
  ];

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setForm({ email: DEMO_CREDENTIALS[r].email, password: DEMO_CREDENTIALS[r].password });
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setErrors({});
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      const data = response.data;
      setCredentials(data, data.token);

      if (data.role === 'patient') navigate(ROUTE_PATHS.PATIENT_DASHBOARD);
      else if (data.role === 'doctor') navigate(ROUTE_PATHS.DOCTOR_DASHBOARD);
      else navigate(ROUTE_PATHS.ADMIN_DASHBOARD);

    } catch (error: any) {
      setErrors({
        email: error.response?.data?.message || 'Invalid credentials. Try the demo accounts below.',
      });
    } finally {
      setLoading(false);
    }
  };

  const cred = DEMO_CREDENTIALS[role];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-accent/10 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/5 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5" />
        </div>
        <div className="relative z-10 flex flex-col h-full p-10">
          <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Stethoscope size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">MediConnect</span>
          </Link>

          <div className="flex-1 flex flex-col justify-center max-w-md">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-white font-bold text-4xl leading-tight mb-4">
                Welcome back to<br />
                <span className="text-accent">better healthcare</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Sign in to access your personalized health dashboard, appointments, and medical records.
              </p>
            </motion.div>

            {/* Demo Credentials Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-accent" />
                <span className="text-accent text-sm font-semibold">Demo Access — Click any role to auto-fill</span>
              </div>
              <div className="space-y-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleRoleSelect(r.value)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      role === r.value
                        ? 'bg-white/15 border-white/30 shadow-sm'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${r.color} flex items-center justify-center text-white`}>
                        {r.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold">{DEMO_CREDENTIALS[r.value].email}</p>
                        <p className="text-white/50 text-xs">Password: <span className="font-mono">00000000</span></p>
                      </div>
                      {role === r.value && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* HIPAA Badge */}
          <div className="flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 w-fit">
            <Shield size={14} className="text-accent" />
            <span className="text-accent text-sm font-semibold">HIPAA Compliant Platform</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
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

          <div className="mb-8">
            <h2 className="text-foreground font-bold text-2xl mb-1">Sign in to your account</h2>
            <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <Label className="text-foreground text-sm font-medium mb-2 block">Sign in as</Label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => handleRoleSelect(r.value)}
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

          {/* Auto-filled credential hint */}
          <motion.div
            key={role}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 bg-accent/8 rounded-xl border border-accent/20 flex items-center gap-3"
          >
            <Zap size={14} className="text-accent shrink-0" />
            <div>
              <p className="text-accent text-xs font-semibold">{cred.name}</p>
              <p className="text-muted-foreground text-xs">{cred.desc}</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className={`pl-9 ${errors.email ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">Password</Label>
                <a href="#" className="text-accent text-xs hover:underline font-medium">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className={`pl-9 pr-9 ${errors.password ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
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

            <Button
              type="submit"
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 mt-2"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Mobile demo hint */}
          <div className="lg:hidden mt-5 p-3 bg-accent/10 rounded-lg border border-accent/20 space-y-2">
            <p className="text-accent text-xs font-semibold flex items-center gap-1"><Zap size={12} /> Demo Accounts</p>
            {roles.map(r => (
              <button key={r.value} onClick={() => handleRoleSelect(r.value)} className="w-full text-left">
                <p className="text-muted-foreground text-xs hover:text-foreground transition-colors">
                  <span className="font-medium text-foreground">{r.label}:</span> {DEMO_CREDENTIALS[r.value].email} / 00000000
                </p>
              </button>
            ))}
          </div>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{' '}
            <Link to={ROUTE_PATHS.REGISTER} className="text-accent font-semibold hover:underline">Create one free</Link>
          </p>

          {/* HIPAA Mobile */}
          <div className="flex items-center justify-center gap-2 mt-6 lg:hidden">
            <Shield size={12} className="text-accent" />
            <span className="text-muted-foreground text-xs">HIPAA Compliant Platform</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
