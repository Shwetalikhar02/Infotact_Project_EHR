import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Stethoscope, Calendar, Activity, CheckCircle,
  XCircle, BarChart2, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { DashboardLayout, StatCard } from '@/components/DashboardLayout';
import { CURRENT_ADMIN, DOCTORS, WEEKLY_APPOINTMENTS, ADMIN_STATS } from '@/data/index';
import { DOCTOR_STATUS_CONFIG } from '@/lib/index';
import type { DoctorStatus } from '@/lib/index';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState(DOCTORS);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const updateDoctorStatus = (id: string, status: DoctorStatus) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const activeCount = doctors.filter(d => d.status === 'active').length;
  const pendingCount = doctors.filter(d => d.status === 'pending').length;

  return (
    <DashboardLayout role="admin" userName={CURRENT_ADMIN.name} userEmail={CURRENT_ADMIN.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">System overview and management for May 2, 2026.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard title="Total Users" value={loading ? '' : ADMIN_STATS.totalUsers.toLocaleString()} icon={<Users size={18} />} subtitle="Patients & Doctors" accentColor="bg-blue-500" loading={loading} />
        <StatCard title="Active Doctors" value={loading ? '' : activeCount} icon={<Stethoscope size={18} />} subtitle={`${pendingCount} pending approval`} accentColor="bg-accent" loading={loading} />
        <StatCard title="Appointments Today" value={loading ? '' : ADMIN_STATS.appointmentsToday} icon={<Calendar size={18} />} subtitle="Across all specialties" accentColor="bg-purple-500" loading={loading} />
        <StatCard
          title="System Status"
          value={loading ? '' : '99.9%'}
          icon={<Activity size={18} />}
          subtitle={ADMIN_STATS.systemStatus}
          accentColor="bg-green-500"
          loading={loading}
        />
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        {/* Analytics Chart */}
        <div className="xl:col-span-3">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-foreground font-semibold text-base">Appointments This Week</h2>
                <p className="text-muted-foreground text-xs mt-0.5">May 2026 — Daily breakdown</p>
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
                { label: 'Daily Average', value: Math.round(WEEKLY_APPOINTMENTS.reduce((s, d) => s + d.appointments, 0) / 7) },
                { label: 'Peak Day', value: WEEKLY_APPOINTMENTS.reduce((a, b) => a.appointments > b.appointments ? a : b).day },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-foreground font-bold text-lg">{item.value}</p>
                  <p className="text-muted-foreground text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 mt-5">
            <h3 className="text-foreground font-semibold text-sm mb-4 flex items-center gap-2">
              <Activity size={16} className="text-accent" /> System Health
            </h3>
            <div className="space-y-3">
              {[
                { label: 'API Uptime', value: 99.9, color: 'bg-green-500' },
                { label: 'Video Service', value: 98.7, color: 'bg-green-500' },
                { label: 'Database', value: 100, color: 'bg-green-500' },
                { label: 'Storage', value: 72, color: 'bg-yellow-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <p className="text-muted-foreground text-xs w-24 shrink-0">{item.label}</p>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                  </div>
                  <p className="text-foreground text-xs font-mono w-12 text-right">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Table */}
        <div className="xl:col-span-2">
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

            <div className="overflow-y-auto max-h-[600px] divide-y divide-border">
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
