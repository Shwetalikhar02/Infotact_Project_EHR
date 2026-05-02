import { motion } from 'framer-motion';
import { Users, Search, Phone, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CURRENT_DOCTOR, DOCTOR_APPOINTMENTS } from '@/data/index';
import { useState } from 'react';

export default function DoctorPatients() {
  const [search, setSearch] = useState('');
  const uniquePatients = Array.from(new Map(DOCTOR_APPOINTMENTS.map(a => [a.patientId, a])).values());
  const filtered = uniquePatients.filter(p => p.patientName.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout role="doctor" userName={CURRENT_DOCTOR.name} userEmail={CURRENT_DOCTOR.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">My Patients</h1>
        <p className="text-muted-foreground text-sm mt-1">All patients under your care.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm" />
          </div>
          <p className="text-muted-foreground text-sm ml-auto">{filtered.length} patients</p>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((p, i) => (
            <motion.div key={p.patientId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-white font-semibold text-sm">{p.patientName.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm">{p.patientName}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-muted-foreground text-xs flex items-center gap-1"><Calendar size={11} /> Last: {p.date}</span>
                  <span className="text-muted-foreground text-xs">{p.specialty}</span>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                p.status === 'completed' ? 'bg-green-100 text-green-700' :
                p.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{p.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
