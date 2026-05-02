import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, FileText, Users, Video, Clock, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout, StatCard, SectionHeader, StatusBadge } from '@/components/DashboardLayout';
import { PRESCRIPTIONS } from '@/data/index'; // Keep mock prescriptions for now if not fully implemented in UI
import { ROUTE_PATHS, STATUS_CONFIG } from '@/lib/index';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/appointments/me');
        const mapped = data.map((d: any) => {
          const dateObj = new Date(d.appointmentDate);
          return {
            id: d._id,
            doctorName: d.doctor.name,
            specialty: 'Specialist', // Generic since it's not in User model yet
            status: d.status,
            date: dateObj.toLocaleDateString(),
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });
        setAppointments(mapped);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcoming = appointments.filter(a => a.status === 'scheduled');
  const completed = appointments.filter(a => a.status === 'completed');

  return (
    <DashboardLayout role="patient" userName={user?.name || 'Patient'} userEmail={user?.email || ''}>
      {/* Welcome Bar */}
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Good morning, {user?.name?.split(' ')[0] || 'Patient'} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your health summary for today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-7">
        <StatCard
          title="Upcoming Appointments"
          value={loading ? '' : upcoming.length}
          icon={<Calendar size={18} />}
          subtitle="Next: May 6, 2026"
          accentColor="bg-blue-500"
          loading={loading}
        />
        <StatCard
          title="Prescriptions"
          value={loading ? '' : PRESCRIPTIONS.length}
          icon={<FileText size={18} />}
          subtitle="Last: Apr 20, 2026"
          accentColor="bg-purple-500"
          loading={loading}
        />
        <StatCard
          title="Doctors Consulted"
          value={loading ? '' : completed.length}
          icon={<Users size={18} />}
          subtitle="Since joining"
          accentColor="bg-accent"
          loading={loading}
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-3">
          <SectionHeader
            title="Upcoming Appointments"
            subtitle="Your scheduled consultations"
            action={
              <Link to={ROUTE_PATHS.PATIENT_BOOK}>
                <Button size="sm" className="bg-primary text-primary-foreground rounded-full gap-1.5 text-xs">
                  <Plus size={14} /> Book New
                </Button>
              </Link>
            }
          />

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse h-24" />
              ))
            ) : upcoming.length === 0 ? (
              <div className="bg-card rounded-xl p-8 border border-border text-center">
                <Calendar size={36} className="text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">No upcoming appointments</p>
                <Link to={ROUTE_PATHS.PATIENT_BOOK}>
                  <Button size="sm" variant="outline" className="mt-3 rounded-full">Book Now</Button>
                </Link>
              </div>
            ) : (
              upcoming.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-white font-semibold text-sm">{apt.doctorName.charAt(4)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-foreground font-semibold text-sm">{apt.doctorName}</h3>
                        <StatusBadge status={apt.status} config={STATUS_CONFIG} />
                      </div>
                      <p className="text-muted-foreground text-xs mt-0.5">{apt.specialty}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={12} /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock size={12} /> {apt.time}
                        </span>
                      </div>
                    </div>
                    <Link to={`/call/${apt.id}`}>
                      <Button size="sm" className="bg-accent hover:bg-accent/90 text-white rounded-full gap-1.5 text-xs shrink-0">
                        <Video size={13} /> Join Call
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Past Appointments */}
          <div className="mt-6">
            <SectionHeader title="Recent Appointments" />
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-3 border border-border animate-pulse h-16" />
                ))
              ) : (
                appointments.filter(a => a.status !== 'scheduled').slice(0, 3).map((apt, i) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-card rounded-xl p-3 border border-border flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-muted-foreground font-medium text-xs">{apt.doctorName.charAt(4)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-medium truncate">{apt.doctorName}</p>
                      <p className="text-muted-foreground text-xs">{apt.date} • {apt.specialty}</p>
                    </div>
                    <StatusBadge status={apt.status} config={STATUS_CONFIG} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Prescriptions */}
        <div className="lg:col-span-2">
          <SectionHeader
            title="Recent Prescriptions"
            action={
              <Link to={ROUTE_PATHS.PATIENT_PRESCRIPTIONS}>
                <Button variant="ghost" size="sm" className="text-accent text-xs gap-1 rounded-full">
                  View All <ArrowRight size={13} />
                </Button>
              </Link>
            }
          />

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border animate-pulse h-28" />
              ))
            ) : (
              PRESCRIPTIONS.map((rx, i) => (
                <motion.div
                  key={rx.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl p-4 border border-border shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-foreground font-semibold text-sm">{rx.diagnosis}</p>
                      <p className="text-muted-foreground text-xs">{rx.doctorName}</p>
                    </div>
                    <span className="text-muted-foreground text-xs">{rx.date}</span>
                  </div>
                  <div className="space-y-1">
                    {rx.medicines.slice(0, 2).map(med => (
                      <div key={med.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        <span className="text-muted-foreground text-xs">{med.name} {med.dosage}</span>
                      </div>
                    ))}
                    {rx.medicines.length > 2 && (
                      <p className="text-muted-foreground text-xs pl-3">+{rx.medicines.length - 2} more</p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h3 className="text-foreground font-semibold text-sm mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Book Appointment', icon: <Plus size={16} />, path: ROUTE_PATHS.PATIENT_BOOK, color: 'bg-primary text-primary-foreground' },
                { label: 'My Prescriptions', icon: <FileText size={16} />, path: ROUTE_PATHS.PATIENT_PRESCRIPTIONS, color: 'bg-accent/10 text-accent border border-accent/20' },
              ].map((action) => (
                <Link key={action.label} to={action.path}>
                  <div className={`${action.color} rounded-xl p-3 flex flex-col items-center gap-2 text-center cursor-pointer hover:opacity-90 transition-opacity`}>
                    {action.icon}
                    <span className="text-xs font-medium">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
