import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, Filter, Stethoscope, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PATIENT_APPOINTMENTS, PRESCRIPTIONS } from '@/data/index';
import { useAuthStore } from '@/store/authStore';

const RECORDS = PATIENT_APPOINTMENTS.map(apt => ({
  ...apt,
  hasPrescription: PRESCRIPTIONS.some(rx => rx.doctorId === apt.doctorId && apt.status === 'completed'),
  diagnosis: apt.status === 'completed' ? ['Seasonal Allergic Rhinitis', 'Tension Headache', 'Hypertension Grade I'][Math.floor(Math.random()*3)] : null,
}));

const statusColors: Record<string, string> = {
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
  upcoming:  'bg-blue-500',
  pending:   'bg-yellow-500',
  scheduled: 'bg-blue-500',
};

export default function PatientRecords() {
  const user = useAuthStore(state => state.user);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? RECORDS : RECORDS.filter(r => r.status === filter);

  return (
    <DashboardLayout role="patient" userName={user?.name || 'Patient'} userEmail={user?.email || ''}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Medical Records</h1>
        <p className="text-muted-foreground text-sm mt-1">Your complete appointment history and health timeline.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter size={14} className="text-muted-foreground" />
        {['all', 'completed', 'upcoming', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === f
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
        {[
          { label: 'Total Visits',  value: RECORDS.length,                                              color: 'text-foreground' },
          { label: 'Completed',     value: RECORDS.filter(r => r.status === 'completed').length,        color: 'text-green-600' },
          { label: 'Upcoming',      value: RECORDS.filter(r => r.status === 'upcoming').length,         color: 'text-blue-600' },
          { label: 'Prescriptions', value: RECORDS.filter(r => r.hasPrescription).length,              color: 'text-accent' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl p-4 border border-border shadow-sm text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-card rounded-xl p-12 border border-border text-center">
              <Calendar size={40} className="text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground">No records found</p>
            </div>
          ) : (
            filtered.map((record, i) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-4 pl-2"
              >
                {/* Timeline dot */}
                <div className={`w-6 h-6 rounded-full ${statusColors[record.status] || 'bg-muted'} flex items-center justify-center shrink-0 z-10 mt-3 border-2 border-background`}>
                  {record.status === 'completed' ? (
                    <CheckCircle size={12} className="text-white" />
                  ) : record.status === 'cancelled' ? (
                    <XCircle size={12} className="text-white" />
                  ) : (
                    <Clock size={12} className="text-white" />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 bg-card rounded-xl border border-border shadow-sm p-4 mb-2">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-foreground font-semibold text-sm">{record.doctorName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium text-white ${statusColors[record.status]}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Stethoscope size={11} /> {record.specialty}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {record.date}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {record.time}</span>
                      </div>
                    </div>
                    {record.hasPrescription && (
                      <div className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs px-2.5 py-1 rounded-full border border-accent/20">
                        <FileText size={11} />
                        <span>Prescription</span>
                      </div>
                    )}
                  </div>

                  {record.diagnosis && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-muted-foreground text-xs">
                        <span className="font-medium text-foreground">Diagnosis:</span> {record.diagnosis}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
