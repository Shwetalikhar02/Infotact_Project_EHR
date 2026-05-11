import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, FileText, Printer, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface MedRow {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const emptyMed = (): MedRow => ({ id: Math.random().toString(36).slice(2), name: '', dosage: '', frequency: '', duration: '' });

export default function DoctorPrescription() {
  const user = useAuthStore(state => state.user);
  const doctorName = user?.name || 'Dr. Demo Doctor';
  const doctorEmail = user?.email || 'doctor@gmail.com';
  const [patient, setPatient] = useState('James Martinez');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<MedRow[]>([emptyMed()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addMed = () => setMedicines(m => [...m, emptyMed()]);
  const removeMed = (id: string) => setMedicines(m => m.filter(x => x.id !== id));
  const updateMed = (id: string, field: keyof MedRow, value: string) => {
    setMedicines(m => m.map(x => x.id === id ? { ...x, [field]: value } : x));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!patient.trim()) errs.patient = 'Patient name is required';
    if (!diagnosis.trim()) errs.diagnosis = 'Diagnosis is required';
    medicines.forEach((med, i) => {
      if (!med.name.trim()) errs[`med_name_${i}`] = 'Required';
      if (!med.dosage.trim()) errs[`med_dosage_${i}`] = 'Required';
    });
    return errs;
  };

  const handleGenerate = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    toast.success('Prescription PDF generated successfully!', {
      description: 'The prescription has been digitally signed and sent to the patient.',
      icon: <CheckCircle size={16} />,
    });
  };

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <DashboardLayout role="doctor" userName={doctorName} userEmail={doctorEmail}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Write Prescription</h1>
        <p className="text-muted-foreground text-sm mt-1">Create and issue a digital prescription for your patient.</p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Form Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <h2 className="text-foreground font-semibold text-base mb-5 flex items-center gap-2">
              <FileText size={18} className="text-accent" /> Prescription Details
            </h2>

            <div className="space-y-4">
              {/* Patient Name */}
              <div>
                <Label className="text-foreground text-sm font-medium mb-1.5 block">Patient Name</Label>
                <Input
                  value={patient}
                  onChange={e => setPatient(e.target.value)}
                  placeholder="Patient name"
                  className={errors.patient ? 'border-destructive' : ''}
                />
                {errors.patient && <p className="text-destructive text-xs mt-1">{errors.patient}</p>}
              </div>

              {/* Diagnosis */}
              <div>
                <Label className="text-foreground text-sm font-medium mb-1.5 block">Diagnosis</Label>
                <Input
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g., Hypertension Grade II"
                  className={errors.diagnosis ? 'border-destructive' : ''}
                />
                {errors.diagnosis && <p className="text-destructive text-xs mt-1">{errors.diagnosis}</p>}
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-foreground text-sm font-medium">Medicines</Label>
                  <Button size="sm" variant="outline" onClick={addMed} className="rounded-full gap-1.5 text-xs border-accent/30 text-accent hover:bg-accent/5">
                    <Plus size={13} /> Add Medicine
                  </Button>
                </div>

                <div className="space-y-3">
                  {medicines.map((med, i) => (
                    <div key={med.id} className="bg-muted rounded-xl p-4 border border-border relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-foreground text-xs font-semibold">Medicine #{i + 1}</span>
                        {medicines.length > 1 && (
                          <button onClick={() => removeMed(med.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground mb-1 block">Medicine Name *</Label>
                          <Input
                            value={med.name}
                            onChange={e => updateMed(med.id, 'name', e.target.value)}
                            placeholder="e.g., Amoxicillin"
                            className={`text-sm ${errors[`med_name_${i}`] ? 'border-destructive' : ''}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Dosage *</Label>
                          <Input
                            value={med.dosage}
                            onChange={e => updateMed(med.id, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                            className={`text-sm ${errors[`med_dosage_${i}`] ? 'border-destructive' : ''}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-1 block">Frequency</Label>
                          <Input value={med.frequency} onChange={e => updateMed(med.id, 'frequency', e.target.value)} placeholder="e.g., 3x daily" className="text-sm" />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs text-muted-foreground mb-1 block">Duration</Label>
                          <Input value={med.duration} onChange={e => updateMed(med.id, 'duration', e.target.value)} placeholder="e.g., 7 days" className="text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-foreground text-sm font-medium mb-1.5 block">Additional Notes</Label>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Special instructions, dietary advice, follow-up schedule..."
                  rows={3}
                />
              </div>

              <Button onClick={handleGenerate} className="w-full rounded-full bg-accent hover:bg-accent/90 text-white gap-2 py-2.5 font-semibold">
                <Printer size={16} /> Generate PDF Prescription
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden sticky top-4">
            {/* Preview Header */}
            <div className="bg-primary px-6 py-4">
              <h3 className="text-white font-bold text-sm uppercase tracking-wide">Prescription Preview</h3>
            </div>

            {/* Prescription Document */}
            <div className="p-6 font-mono text-sm">
              {/* Letterhead */}
              <div className="border-b-2 border-primary pb-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-primary font-bold text-base not-italic font-sans">MediConnect</p>
                    <p className="text-muted-foreground text-xs">Telemedicine Platform</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-semibold text-xs">{doctorName}</p>
                    <p className="text-muted-foreground text-xs">Specialist</p>
                    <p className="text-muted-foreground text-xs">Lic. No: MED-2026-001</p>
                  </div>
                </div>
              </div>

              {/* Rx Symbol */}
              <p className="text-primary text-3xl font-bold mb-3">℞</p>

              <div className="space-y-2 mb-4">
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-xs w-20 shrink-0">Patient:</span>
                  <span className="text-foreground text-xs font-medium">{patient || '—'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-xs w-20 shrink-0">Date:</span>
                  <span className="text-foreground text-xs">{today}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-xs w-20 shrink-0">Diagnosis:</span>
                  <span className="text-foreground text-xs font-medium">{diagnosis || '—'}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-border pt-4 mb-4">
                <p className="text-muted-foreground text-xs mb-2 uppercase tracking-wide">Medications</p>
                {medicines.filter(m => m.name).length === 0 ? (
                  <p className="text-muted-foreground text-xs italic">No medicines added yet...</p>
                ) : (
                  <div className="space-y-3">
                    {medicines.filter(m => m.name).map((med, i) => (
                      <div key={med.id} className="border-l-2 border-accent pl-3">
                        <p className="text-foreground text-xs font-bold">{i + 1}. {med.name} {med.dosage && `– ${med.dosage}`}</p>
                        {med.frequency && <p className="text-muted-foreground text-xs">Freq: {med.frequency}</p>}
                        {med.duration && <p className="text-muted-foreground text-xs">Duration: {med.duration}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notes && (
                <div className="border-t border-dashed border-border pt-4 mb-4">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-foreground text-xs">{notes}</p>
                </div>
              )}

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-muted-foreground text-xs text-center">Digitally signed — MediConnect EHR System</p>
                <p className="text-muted-foreground text-xs text-center mt-0.5 font-sans">🔒 HIPAA Compliant</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
