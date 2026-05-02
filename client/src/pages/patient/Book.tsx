import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Calendar, ChevronDown, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardLayout } from '@/components/DashboardLayout';
import { SPECIALTIES } from '@/lib/index';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

const TIME_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

export default function PatientBook() {
  const [specialty, setSpecialty] = useState('All Specialties');
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [booked, setBooked] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    api.get('/auth/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error fetching doctors", err));
  }, []);

  const filtered = doctors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleBook = async () => {
    try {
      // Parse the time slot into a JS Date object
      // format: selectedDate="2026-05-02", selectedSlot="9:00 AM"
      const timeParts = selectedSlot.match(/(\d+):(\d+)\s(AM|PM)/);
      let hours = 0;
      let minutes = 0;
      if (timeParts) {
        hours = parseInt(timeParts[1]);
        minutes = parseInt(timeParts[2]);
        if (timeParts[3] === 'PM' && hours < 12) hours += 12;
        if (timeParts[3] === 'AM' && hours === 12) hours = 0;
      }

      const dateObj = new Date(selectedDate);
      dateObj.setHours(hours, minutes, 0, 0);

      await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        appointmentDate: dateObj.toISOString(),
        reasonForVisit: reasonForVisit || 'General Consultation'
      });

      setBooked(true);
      setTimeout(() => {
        setShowConfirm(false);
        setBooked(false);
        setSelectedDoctor(null);
        setSelectedSlot('');
        setSelectedDate('');
        setReasonForVisit('');
      }, 2000);
    } catch (error) {
      console.error("Failed to book appointment", error);
      alert("Failed to book appointment");
    }
  };

  return (
    <DashboardLayout role="patient" userName={user?.name || ''} userEmail={user?.email || ''}>
      <div className="mb-6">
        <h1 className="text-foreground font-bold text-2xl">Book Appointment</h1>
        <p className="text-muted-foreground text-sm mt-1">Search and book appointments with our specialist doctors.</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name..."
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
            key={doctor._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-card rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
              selectedDoctor?._id === doctor._id ? 'border-accent ring-2 ring-accent/30' : 'border-border hover:border-accent/50'
            }`}
            onClick={() => setSelectedDoctor(doctor)}
          >
            {/* Doctor Avatar */}
            <div className="bg-primary h-24 flex items-end justify-center pb-0 relative">
              <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white flex items-center justify-center translate-y-8">
                <span className="text-white font-bold text-xl">
                  {doctor.name.split(' ').slice(1).join(' ').charAt(0) || doctor.name.charAt(0)}
                </span>
              </div>
            </div>

            <div className="pt-10 px-4 pb-4 text-center">
              <h3 className="text-foreground font-semibold text-sm">{doctor.name}</h3>
              <p className="text-accent text-xs font-medium mt-0.5">Specialist</p>

              <div className="flex items-center justify-center gap-1 mt-2">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-foreground text-xs font-semibold">5.0</span>
                <span className="text-muted-foreground text-xs">(120)</span>
              </div>

              <p className="text-muted-foreground text-xs mt-1">10+ years experience</p>

              <Button
                size="sm"
                className={`w-full rounded-full text-xs mt-4 ${
                  selectedDoctor?._id === doctor._id
                    ? 'bg-accent hover:bg-accent/90 text-white'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
                onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doctor); }}
              >
                {selectedDoctor?._id === doctor._id ? '✓ Selected' : 'Book Now'}
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

                <div className="flex flex-col justify-end">
                  <Button
                    onClick={() => selectedDate && selectedSlot && setShowConfirm(true)}
                    disabled={!selectedDate || !selectedSlot}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 whitespace-nowrap mt-4"
                  >
                    <Calendar size={16} className="mr-2" />
                    Continue to Book
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
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground font-medium">{selectedSlot}</span>
                    </div>
                  </div>
                  
                  <div className="mb-5">
                    <label className="text-foreground text-sm font-medium block mb-2">Reason for Visit</label>
                    <Input 
                      placeholder="E.g., Annual Checkup, Fever..." 
                      value={reasonForVisit}
                      onChange={(e) => setReasonForVisit(e.target.value)}
                    />
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
