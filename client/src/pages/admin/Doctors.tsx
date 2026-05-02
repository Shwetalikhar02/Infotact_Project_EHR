import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Star, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CURRENT_ADMIN, DOCTORS } from '@/data/index';
import { DOCTOR_STATUS_CONFIG } from '@/lib/index';
import type { DoctorStatus } from '@/lib/index';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState(DOCTORS);
  const [search, setSearch] = useState('');

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, status: DoctorStatus) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  return (
    <DashboardLayout role="admin" userName={CURRENT_ADMIN.name} userEmail={CURRENT_ADMIN.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Manage Doctors</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and manage all registered physicians.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-sm" />
          </div>
          <div className="ml-auto flex gap-2">
            {['active', 'pending', 'suspended'].map(s => {
              const cfg = DOCTOR_STATUS_CONFIG[s as DoctorStatus];
              const count = doctors.filter(d => d.status === s).length;
              return (
                <span key={s} className={`text-xs px-2.5 py-1 rounded-full font-medium border ${cfg.className}`}>
                  {count} {cfg.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wide">Doctor</th>
                <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wide">Specialty</th>
                <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wide">Rating</th>
                <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wide">Patients</th>
                <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-muted-foreground text-xs font-medium uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((doc, i) => {
                const cfg = DOCTOR_STATUS_CONFIG[doc.status];
                return (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <span className="text-white font-semibold text-sm">{doc.name.split(' ').pop()?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{doc.name}</p>
                          <p className="text-muted-foreground text-xs">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{doc.specialty}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-foreground font-medium">{doc.rating}</span>
                        <span className="text-muted-foreground text-xs">({doc.reviews})</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users size={13} />
                        <span>{doc.patients.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${cfg.className}`}>{cfg.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {doc.status === 'pending' && (
                          <>
                            <Button size="sm" className="h-7 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs gap-1" onClick={() => updateStatus(doc.id, 'active')}>
                              <CheckCircle size={12} /> Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs gap-1" onClick={() => updateStatus(doc.id, 'suspended')}>
                              <XCircle size={12} /> Reject
                            </Button>
                          </>
                        )}
                        {doc.status === 'active' && (
                          <Button size="sm" variant="outline" className="h-7 border-red-200 text-red-600 hover:bg-red-50 rounded-full text-xs gap-1" onClick={() => updateStatus(doc.id, 'suspended')}>
                            <XCircle size={12} /> Suspend
                          </Button>
                        )}
                        {doc.status === 'suspended' && (
                          <Button size="sm" className="h-7 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs gap-1" onClick={() => updateStatus(doc.id, 'active')}>
                            <CheckCircle size={12} /> Reinstate
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
