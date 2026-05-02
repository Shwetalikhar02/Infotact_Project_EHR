import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CURRENT_ADMIN, PATIENT_APPOINTMENTS } from '@/data/index';
import { STATUS_CONFIG } from '@/lib/index';

const PATIENTS_LIST = [
  { id: 'p1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 555-234-5678', appointments: 5, lastVisit: '2026-04-20' },
  { id: 'p2', name: 'James Martinez', email: 'james.m@email.com', phone: '+1 555-345-6789', appointments: 3, lastVisit: '2026-05-02' },
  { id: 'p3', name: 'Linda Cooper', email: 'linda.c@email.com', phone: '+1 555-456-7890', appointments: 2, lastVisit: '2026-05-02' },
  { id: 'p4', name: 'Robert Garcia', email: 'robert.g@email.com', phone: '+1 555-567-8901', appointments: 4, lastVisit: '2026-05-01' },
  { id: 'p5', name: 'Emma Wilson', email: 'emma.w@email.com', phone: '+1 555-678-9012', appointments: 1, lastVisit: '2026-04-28' },
  { id: 'p6', name: 'Thomas Brown', email: 'thomas.b@email.com', phone: '+1 555-789-0123', appointments: 2, lastVisit: '2026-04-25' },
  { id: 'p7', name: 'Maria Davis', email: 'maria.d@email.com', phone: '+1 555-890-1234', appointments: 6, lastVisit: '2026-04-30' },
];

export default function AdminPatients() {
  const [search, setSearch] = useState('');
  const filtered = PATIENTS_LIST.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" userName={CURRENT_ADMIN.name} userEmail={CURRENT_ADMIN.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Manage Patients</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage all registered patients on the platform.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm" />
          </div>
          <div className="ml-auto flex items-center gap-2 text-muted-foreground text-sm">
            <Users size={15} />
            {filtered.length} patients
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {['Patient', 'Email', 'Phone', 'Total Appointments', 'Last Visit'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <span className="text-accent font-semibold text-sm">{p.name.charAt(0)}</span>
                      </div>
                      <p className="text-foreground font-medium">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{p.email}</td>
                  <td className="px-5 py-4 text-muted-foreground font-mono text-xs">{p.phone}</td>
                  <td className="px-5 py-4">
                    <span className="text-foreground font-semibold">{p.appointments}</span>
                    <span className="text-muted-foreground text-xs ml-1">visits</span>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{p.lastVisit}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
