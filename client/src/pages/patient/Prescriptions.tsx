import { motion } from 'framer-motion';
import { FileText, Download, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { CURRENT_PATIENT, PRESCRIPTIONS } from '@/data/index';

export default function PatientPrescriptions() {
  return (
    <DashboardLayout role="patient" userName={CURRENT_PATIENT.name} userEmail={CURRENT_PATIENT.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">My Prescriptions</h1>
        <p className="text-muted-foreground text-sm mt-1">All your digital prescriptions in one place.</p>
      </div>

      <div className="space-y-5">
        {PRESCRIPTIONS.map((rx, i) => (
          <motion.div
            key={rx.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Rx #{rx.id.toUpperCase()}</p>
                <p className="text-white/60 text-xs">{rx.date} • {rx.doctorName}</p>
              </div>
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full gap-2 text-xs">
                <Download size={13} /> Download PDF
              </Button>
            </div>

            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Patient</p>
                  <p className="text-foreground font-medium text-sm">{rx.patientName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-1">Diagnosis</p>
                  <p className="text-foreground font-medium text-sm">{rx.diagnosis}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-3">Prescribed Medicines</p>
                <div className="space-y-2">
                  {rx.medicines.map(med => (
                    <div key={med.id} className="flex items-start gap-3 p-3 bg-muted rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Pill size={14} className="text-accent" />
                      </div>
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <p className="text-muted-foreground text-xs">Medicine</p>
                          <p className="text-foreground text-sm font-medium">{med.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Dosage</p>
                          <p className="text-foreground text-sm">{med.dosage}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Frequency</p>
                          <p className="text-foreground text-sm">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Duration</p>
                          <p className="text-foreground text-sm">{med.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {rx.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-medium text-blue-700 mb-1">Doctor's Notes</p>
                  <p className="text-blue-800 text-sm">{rx.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
