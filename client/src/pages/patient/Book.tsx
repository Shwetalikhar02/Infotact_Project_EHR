import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Calendar, ChevronDown, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/DashboardLayout';
import { DOCTORS, CURRENT_PATIENT } from '@/data/index';
import { SPECIALTIES, ROUTE_PATHS } from '@/lib/index';
import type { Doctor } from '@/lib/index';

const TIME_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

export default function PatientBook() {
  const [specialty, setSpecialty] = useState('All Specialties');
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [booked, setBooked] = useState(false);

  const filtered = DOCTORS.filter(d => {
    const matchSpec = specialty === 'All Specialties' || d.specialty === specialty;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    return matchSpec && matchSearch && d.status === 'active';
  });

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => {
      setShowConfirm(false);
      setBooked(false);
      setSelectedDoctor(null);
      setSelectedSlot('');
      setSelectedDate('');
    }, 2000);
  };

  return (
    <DashboardLayout role="patient" userName={CURRENT_PATIENT.name} userEmail={CURRENT_PATIENT.email}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Book Appointment</h1>
        <p className="text-muted-foreground text-sm mt-1">Search and book appointments with our specialist doctors.</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name or specialty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={specialty}
            onChange={e => setSpecialty(e.target.value)}
            className="w-full sm:w-52 appearance-none bg-background border border-input rounded-lg px-3 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((doctor, i) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
              selectedDoctor?.id === doctor.id ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:border-accent/50'
            }`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            {/* Doctor Avatar */}
            <div className="bg-primary h-24 flex items-end justify-center pb-0 relative">
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center translate-y-8">
                <span className="text-white font-bold text-xl">
                  {doctor.name.split(' ').slice(1).join(' ').charAt(0)}
                </span>
              </div>
            </div>

            <div className="pt-10 px-4 pb-4 text-center">
              <h3 className="text-foreground font-semibold text-sm">{doctor.name}</h3>
              <p className="text-accent text-xs font-medium mt-0.5">{doctor.specialty}</p>

              <div className="flex items-center justify-center gap-1 mt-2">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-foreground text-xs font-semibold">{doctor.rating}</span>
                <span className="text-muted-foreground text-xs">({doctor.reviews})</span>
              </div>

              <p className="text-muted-foreground text-xs mt-1">{doctor.experience} experience</p>

              {/* Availability Tags */}
              <div className="flex flex-wrap gap-1 justify-center mt-3 mb-3">
                {doctor.availability.slice(0, 3).map(day => (
                  <span key={day} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{day}</span>
                ))}
              </div>

              <Button
                size="sm"
                className={`w-full rounded-full text-xs ${
                  selectedDoctor?.id === doctor.id
                    ? 'bg-accent hover:bg-accent/90 text-white'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
                onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doctor); }}
              >
                {selectedDoctor?.id === doctor.id ? '✓ Selected' : 'Book Now'}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground">No doctors found matching your criteria.</p>
        </div>
      )}

      {/* Slot Picker — appears when doctor selected */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-2xl p-5 z-30 lg:relative lg:rounded-2xl lg:mt-6 lg:shadow-sm lg:border"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-foreground font-semibold">Select Date & Time</h3>
                  <p className="text-muted-foreground text-sm">Booking with {selectedDoctor.name}</p>
                </div>
                <button onClick={() => setSelectedDoctor(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Date Picker */}
                <div className="flex-1">
                  <label className="text-foreground text-sm font-medium block mb-2">Select Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full border border-input rounded-lg px-3 py-2 text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Time Slots */}
                <div className="flex-1">
                  <label className="text-foreground text-sm font-medium block mb-2">Select Time Slot</label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          selectedSlot === slot
                            ? 'bg-accent text-white border-accent'
                            : 'bg-muted text-muted-foreground border-border hover:border-accent/50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() => selectedDate && selectedSlot && setShowConfirm(true)}
                    disabled={!selectedDate || !selectedSlot}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 whitespace-nowrap"
                  >
                    <Calendar size={16} className="mr-2" />
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && selectedDoctor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border"
            >
              {booked ? (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-foreground font-bold text-xl mb-2">Appointment Booked!</h3>
                  <p className="text-muted-foreground text-sm">Your appointment with {selectedDoctor.name} has been confirmed.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-foreground font-bold text-lg mb-4">Confirm Appointment</h3>
                  <div className="bg-muted rounded-xl p-4 space-y-3 mb-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Doctor</span>
                      <span className="text-foreground font-medium">{selectedDoctor.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Specialty</span>
                      <span className="text-foreground font-medium">{selectedDoctor.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground font-medium">{selectedSlot}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowConfirm(false)}>Cancel</Button>
                    <Button className="flex-1 rounded-full bg-accent hover:bg-accent/90 text-white" onClick={handleBook}>
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
