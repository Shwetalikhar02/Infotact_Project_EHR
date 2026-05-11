import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Stethoscope, Calendar, Activity, CheckCircle,
  XCircle, TrendingUp, DollarSign, UserPlus, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { DashboardLayout, StatCard } from '@/components/DashboardLayout';
import { DOCTORS, WEEKLY_APPOINTMENTS, ADMIN_STATS } from '@/data/index';
import { DOCTOR_STATUS_CONFIG } from '@/lib/index';
import type { DoctorStatus } from '@/lib/index';
import { useAuthStore } from '@/store/authStore';

const ACTIVITY_LOG = [
  { id: 1, action: 'New patient registered',       user: 'patient@gmail.com',   time: '2m ago',  type: 'user' },
  { id: 2, action: 'Appointment approved',          user: 'doctor@gmail.com',    time: '15m ago', type: 'appointment' },
  { id: 3, action: 'Prescription generated',       user: 'Dr. Michael Chen',    time: '1h ago',  type: 'prescription' },
  { id: 4, action: 'Doctor account activated',     user: 'Admin',               time: '2h ago',  type: 'admin' },
  { id: 5, action: 'Video consultation completed', user: 'Dr. Priya Sharma',    time: '3h ago',  type: 'call' },
  { id: 6, action: 'New doctor application',       user: 'Dr. Lisa Thompson',   time: '5h ago',  type: 'user' },
];

const PIE_DATA = [
  { name: 'Patients', value: 11200, color: '#3b82f6' },
  { name: 'Doctors',  value: 284,   color: '#00BFA5' },
  { name: 'Admins',   value: 12,    color: '#a855f7' },
];

const activityTypeColor: Record<string, string> = {
  user:         'bg-blue-500',
  appointment:  'bg-accent',
  prescription: 'bg-purple-500',
  admin:        'bg-red-500',
  call:         'bg-green-500',
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState(DOCTORS);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const updateDoctorStatus = (id: string, status: DoctorStatus) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const activeCount  = doctors.filter(d => d.status === 'active').length;
  const pendingCount = doctors.filter(d => d.status === 'pending').length;
  const adminName    = user?.name || 'Admin User';
  const adminEmail   = user?.email || 'admin@gmail.com';

  return (
    <DashboardLayout role="admin" userName={adminName} userEmail={adminEmail}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">System overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard title="Total Users"          value={loading ? '' : ADMIN_STATS.totalUsers.toLocaleString()} icon={<Users size={18} />}       subtitle="Patients & Doctors"       accentColor="bg-blue-500"   loading={loading} />
        <StatCard title="Active Doctors"       value={loading ? '' : activeCount}                             icon={<Stethoscope size={18} />}   subtitle={`${pendingCount} pending`} accentColor="bg-accent"     loading={loading} />
        <StatCard title="Appointments Today"   value={loading ? '' : ADMIN_STATS.appointmentsToday}          icon={<Calendar size={18} />}      subtitle="Across all specialties"   accentColor="bg-purple-500" loading={loading} />
        <StatCard title="Revenue This Month"   value={loading ? '' : '$48,392'}                              icon={<DollarSign size={18} />}    subtitle="+18.2% vs last month"     accentColor="bg-green-500"  loading={loading} />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-7">
        <StatCard title="Active Sessions"  value={loading ? '' : '23'}  icon={<Zap size={18} />}        subtitle="Live video calls"      accentColor="bg-accent"     loading={loading} />
        <StatCard title="New Users Today"  value={loading ? '' : '47'}  icon={<UserPlus size={18} />}   subtitle="Registrations today"   accentColor="bg-blue-500"   loading={loading} />
        <StatCard title="System Uptime"    value={loading ? '' : '99.9%'} icon={<Activity size={18} />} subtitle="All services nominal"  accentColor="bg-green-500"  loading={loading} />
      </div>

      <div className="grid xl:grid-cols-5 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="xl:col-span-3">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-foreground font-semibold text-base">Appointments This Week</h2>
                <p className="text-muted-foreground text-xs mt-0.5">Daily breakdown</p>
              </div>
              <div className="flex items-center gap-1.5 text-accent text-sm font-medium">
                <TrendingUp size={16} />
                <span>+12.4%</span>
              </div>
            </div>

            {loading ? (
              <div className="h-52 bg-muted rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={WEEKLY_APPOINTMENTS} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: 'var(--foreground)',
                    }}
                    cursor={{ fill: 'var(--muted)', radius: 4 }}
                    formatter={(value: number) => [value, 'Appointments']}
                  />
                  <Bar dataKey="appointments" fill="var(--accent)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Weekly Summary */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border">
              {[
                { label: 'Total This Week', value: WEEKLY_APPOINTMENTS.reduce((s, d) => s + d.appointments, 0) },
                { label: 'Daily Average',   value: Math.round(WEEKLY_APPOINTMENTS.reduce((s, d) => s + d.appointments, 0) / 7) },
                { label: 'Peak Day',        value: WEEKLY_APPOINTMENTS.reduce((a, b) => a.appointments > b.appointments ? a : b).day },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-foreground font-bold text-lg">{item.value}</p>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="xl:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 h-full">
            <h2 className="text-foreground font-semibold text-base mb-1">User Distribution</h2>
            <p className="text-muted-foreground text-xs mb-4">Patients vs Doctors vs Admins</p>
            {loading ? (
              <div className="h-44 bg-muted rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PIE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                    formatter={(v: number) => [v.toLocaleString(), 'Users']}
                  />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        {/* Activity Log */}
        <div className="xl:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-foreground font-semibold text-sm">Recent Activity</h2>
              <p className="text-muted-foreground text-xs">System events log</p>
            </div>
            <div className="divide-y divide-border">
              {ACTIVITY_LOG.map((log, i) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${activityTypeColor[log.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-xs">{log.action}</p>
                    <p className="text-muted-foreground text-xs">{log.user}</p>
                  </div>
                  <span className="text-muted-foreground text-xs shrink-0">{log.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Management */}
        <div className="xl:col-span-3">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-foreground font-semibold text-sm">Doctor Management</h2>
                <p className="text-muted-foreground text-xs">{doctors.length} total doctors</p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{activeCount} Active</span>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">{pendingCount} Pending</span>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[400px] divide-y divide-border">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-5 py-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-32 bg-muted rounded" />
                        <div className="h-2.5 w-24 bg-muted rounded" />
                      </div>
                      <div className="h-5 w-16 bg-muted rounded-full" />
                    </div>
                  </div>
                ))
              ) : (
                doctors.map((doc, i) => {
                  const statusCfg = DOCTOR_STATUS_CONFIG[doc.status];
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="px-5 py-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-white font-semibold text-xs">{doc.name.split(' ').pop()?.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground text-sm font-medium truncate">{doc.name}</p>
                          <p className="text-muted-foreground text-xs">{doc.specialty}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${statusCfg.className} shrink-0`}>
                          {statusCfg.label}
                        </span>
                      </div>

                      {doc.status === 'pending' && (
                        <div className="flex gap-2 pl-11">
                          <Button
                            size="sm"
                            className="flex-1 h-7 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs gap-1"
                            onClick={() => updateDoctorStatus(doc.id, 'active')}
                          >
                            <CheckCircle size={12} /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs gap-1"
                            onClick={() => updateDoctorStatus(doc.id, 'suspended')}
                          >
                            <XCircle size={12} /> Reject
                          </Button>
                        </div>
                      )}

                      {doc.status === 'active' && (
                        <div className="flex gap-2 pl-11">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs gap-1"
                            onClick={() => updateDoctorStatus(doc.id, 'suspended')}
                          >
                            <XCircle size={12} /> Suspend
                          </Button>
                        </div>
                      )}

                      {doc.status === 'suspended' && (
                        <div className="flex gap-2 pl-11">
                          <Button
                            size="sm"
                            className="h-7 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs gap-1"
                            onClick={() => updateDoctorStatus(doc.id, 'active')}
                          >
                            <CheckCircle size={12} /> Reinstate
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
