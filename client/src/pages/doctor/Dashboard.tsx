import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, ClipboardList, Calendar, Users, Clock, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout, StatCard, SectionHeader, StatusBadge } from '@/components/DashboardLayout';
import { CURRENT_DOCTOR, DOCTOR_APPOINTMENTS } from '@/data/index';
import { ROUTE_PATHS, STATUS_CONFIG } from '@/lib/index';
import type { AppointmentStatus } from '@/lib/index';

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState(DOCTOR_APPOINTMENTS);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const todayUpcoming = appointments.filter(a => a.status === 'upcoming');
  const pending = appointments.filter(a => a.status === 'pending');
  const completed = appointments.filter(a => a.status === 'completed');
  const totalPatients = new Set(appointments.map(a => a.patientId)).size;

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <DashboardLayout role="doctor" userName={CURRENT_DOCTOR.name} userEmail={CURRENT_DOCTOR.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Doctor's Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back, {CURRENT_DOCTOR.name}. Here's your schedule for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard title="Today's Appointments" value={loading ? '' : todayUpcoming.length} icon={<Calendar size={18} />} subtitle="Scheduled today" accentColor="bg-blue-500" loading={loading} />
        <StatCard title="Total Patients" value={loading ? '' : totalPatients} icon={<Users size={18} />} subtitle="All time" accentColor="bg-accent" loading={loading} />
        <StatCard title="Pending Approvals" value={loading ? '' : pending.length} icon={<Clock size={18} />} subtitle="Needs review" accentColor="bg-yellow-500" loading={loading} />
        <StatCard title="Completed Today" value={loading ? '' : completed.length} icon={<CheckCircle size={18} />} subtitle="Consultations done" accentColor="bg-green-500" loading={loading} />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Appointment Queue */}
        <div className="lg:col-span-3">
          <SectionHeader title="Today's Appointment Queue" subtitle="Active consultations for May 2, 2026" />

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse h-24" />
              ))
            ) : (
              appointments.filter(a => a.status === 'upcoming').map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                      <span className="text-accent font-bold text-sm">{apt.patientName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-foreground font-semibold text-sm">{apt.patientName}</h3>
                        <StatusBadge status={apt.status} config={STATUS_CONFIG} />
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} /> {apt.time}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">ID: {apt.id.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link to={`/call/${apt.id}`}>
                        <Button size="sm" className="bg-accent hover:bg-accent/90 text-white rounded-full gap-1.5 text-xs">
                          <Video size={13} /> Start Call
                        </Button>
                      </Link>
                      <Link to={ROUTE_PATHS.DOCTOR_PRESCRIPTION}>
                        <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5">
                          <ClipboardList size={13} /> Prescribe
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="lg:col-span-2">
          <SectionHeader title="Pending Requests" subtitle={`${pending.length} awaiting approval`} />

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse h-24" />
              ))
            ) : pending.length === 0 ? (
              <div className="bg-card rounded-xl p-6 border border-border text-center">
                <UserCheck size={32} className="text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No pending requests</p>
              </div>
            ) : (
              pending.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl p-4 border border-yellow-200 bg-yellow-50/50 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                      <span className="text-yellow-700 font-bold text-sm">{apt.patientName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-semibold text-sm">{apt.patientName}</p>
                      <p className="text-muted-foreground text-xs">{apt.time} • {apt.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full gap-1.5 text-xs"
                      onClick={() => updateStatus(apt.id, 'upcoming')}
                    >
                      <CheckCircle size={13} /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-full gap-1.5 text-xs"
                      onClick={() => updateStatus(apt.id, 'cancelled')}
                    >
                      <XCircle size={13} /> Reject
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Completed Today */}
          {completed.length > 0 && (
            <div className="mt-5">
              <h3 className="text-foreground font-semibold text-sm mb-3">Completed Today</h3>
              <div className="space-y-2">
                {completed.map((apt, i) => (
                  <div key={apt.id} className="bg-card rounded-xl p-3 border border-green-100 bg-green-50/30 flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                    <div>
                      <p className="text-foreground text-sm font-medium">{apt.patientName}</p>
                      <p className="text-muted-foreground text-xs">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
