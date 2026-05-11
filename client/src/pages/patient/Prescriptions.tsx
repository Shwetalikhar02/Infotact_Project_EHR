import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calendar, User, Download, X, Pill, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PRESCRIPTIONS } from '@/data/index';
import { useAuthStore } from '@/store/authStore';
import type { Prescription } from '@/lib/index';

export default function PatientPrescriptions() {
  const user = useAuthStore(state => state.user);
  const [selected, setSelected] = useState<Prescription | null>(null);

  const handleDownload = (rx: Prescription) => {
    // Simulate PDF download
    const content = `
MEDICONNECT - DIGITAL PRESCRIPTION
====================================
Patient: ${rx.patientName}
Doctor: ${rx.doctorName}
Date: ${rx.date}
Diagnosis: ${rx.diagnosis}

MEDICATIONS:
${rx.medicines.map((m, i) => `${i+1}. ${m.name} ${m.dosage} - ${m.frequency} for ${m.duration}`).join('\n')}

${rx.notes ? 'Notes: ' + rx.notes : ''}

Digitally signed - MediConnect EHR System
HIPAA Compliant
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription-${rx.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="patient" userName={user?.name || 'Patient'} userEmail={user?.email || ''}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">My Prescriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">View and download your digital prescriptions.</p>
      </div>

      {PRESCRIPTIONS.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <FileText size={48} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No prescriptions yet</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {PRESCRIPTIONS.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              {/* Card Header */}
              <div className="bg-primary/5 border-b border-border px-5 py-3 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText size={15} className="text-accent" />
                  </div>
                  <span className="text-foreground font-semibold text-sm">Prescription</span>
                </div>
                <span className="text-muted-foreground text-xs font-mono">#{rx.id.toUpperCase()}</span>
              </div>

              <div className="p-5">
                {/* Diagnosis */}
                <h3 className="text-foreground font-bold text-base mb-1">{rx.diagnosis}</h3>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><User size={12} /> {rx.doctorName}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> {rx.date}</span>
                </div>

                {/* Medicines preview */}
                <div className="space-y-1.5 mb-4">
                  {rx.medicines.slice(0, 2).map(med => (
                    <div key={med.id} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
                      <Pill size={12} className="text-accent shrink-0" />
                      <span className="text-foreground text-xs font-medium">{med.name}</span>
                      <span className="text-muted-foreground text-xs ml-auto">{med.dosage}</span>
                    </div>
                  ))}
                  {rx.medicines.length > 2 && (
                    <p className="text-muted-foreground text-xs pl-1">+{rx.medicines.length - 2} more medicines</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-full gap-1.5 text-xs"
                    onClick={() => setSelected(rx)}
                  >
                    <ChevronRight size={13} /> View Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() => handleDownload(rx)}
                  >
                    <Download size={13} /> PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="bg-primary px-6 py-4 rounded-t-2xl flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-bold">MediConnect Prescription</h2>
                    <p className="text-white/60 text-xs">#{selected.id.toUpperCase()}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 font-mono text-sm">
                  {/* Letterhead */}
                  <div className="border-b-2 border-primary pb-4 mb-4 flex justify-between">
                    <div>
                      <p className="text-primary font-bold text-lg not-italic font-sans">MediConnect</p>
                      <p className="text-muted-foreground text-xs">Telemedicine Platform</p>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-semibold text-xs">{selected.doctorName}</p>
                      <p className="text-muted-foreground text-xs">Lic. No: MED-{selected.doctorId.toUpperCase()}2026</p>
                    </div>
                  </div>

                  <p className="text-primary text-4xl font-bold mb-4">℞</p>

                  <div className="space-y-2 mb-5">
                    {[
                      { label: 'Patient', val: selected.patientName },
                      { label: 'Date', val: selected.date },
                      { label: 'Diagnosis', val: selected.diagnosis },
                    ].map(f => (
                      <div key={f.label} className="flex gap-3">
                        <span className="text-muted-foreground text-xs w-20 shrink-0">{f.label}:</span>
                        <span className="text-foreground text-xs font-medium">{f.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-dashed border-border pt-4 mb-4">
                    <p className="text-muted-foreground text-xs uppercase tracking-wide mb-3">Medications</p>
                    <div className="space-y-3">
                      {selected.medicines.map((med, i) => (
                        <div key={med.id} className="border-l-2 border-accent pl-3">
                          <p className="text-foreground text-xs font-bold">{i+1}. {med.name} – {med.dosage}</p>
                          <p className="text-muted-foreground text-xs">Freq: {med.frequency}</p>
                          <p className="text-muted-foreground text-xs">Duration: {med.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selected.notes && (
                    <div className="border-t border-dashed border-border pt-4 mb-4">
                      <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-foreground text-xs">{selected.notes}</p>
                    </div>
                  )}

                  <div className="border-t border-border pt-4 text-center">
                    <p className="text-muted-foreground text-xs">Digitally signed — MediConnect EHR System</p>
                    <p className="text-muted-foreground text-xs mt-0.5">🔒 HIPAA Compliant</p>
                  </div>
                </div>

                <div className="px-6 pb-5 flex gap-3">
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90 text-white rounded-full gap-2"
                    onClick={() => handleDownload(selected)}
                  >
                    <Download size={15} /> Download PDF
                  </Button>
                  <Button variant="outline" className="rounded-full" onClick={() => setSelected(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
