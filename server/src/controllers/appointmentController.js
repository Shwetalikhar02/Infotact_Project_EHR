import Appointment from '../models/Appointment.js';
import { encrypt, decrypt } from '../utils/encryption.js';

const encryptData = (data) => {
  if (!data) return undefined;
  const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
  return encrypt(stringifiedData);
};

const decryptData = (encryptedString) => {
  if (!encryptedString) return undefined;
  try {
    const decryptedString = decrypt(encryptedString);
    try {
      return JSON.parse(decryptedString);
    } catch (e) {
      return decryptedString;
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return '[Decryption Error]';
  }
};

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private (Patient/Receptionist/Admin)
 */
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, appointmentDate, reasonForVisit } = req.body;

    // Determine the patient ID
    // A patient can only book for themselves, while receptionists can book for anyone
    const finalPatientId = req.user.role === 'patient' ? req.user._id : (patientId || req.user._id);

    const appointment = await Appointment.create({
      patient: finalPatientId,
      doctor: doctorId,
      appointmentDate,
      reasonForVisit,
      status: 'scheduled',
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error booking appointment' });
  }
};

/**
 * @desc    Get all appointments for the logged-in patient
 * @route   GET /api/appointments/me
 * @access  Private (Patient)
 */
export const getMyPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', ['name', 'email'])
      .sort({ appointmentDate: 1 });

    // Patients can see their own notes and prescriptions
    const decryptedAppointments = appointments.map((appt) => {
      const apptObj = appt.toObject();
      apptObj.notes = decryptData(apptObj.notes);
      apptObj.prescription = decryptData(apptObj.prescription);
      return apptObj;
    });

    res.json(decryptedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching appointments' });
  }
};

/**
 * @desc    Get all appointments for the logged-in doctor
 * @route   GET /api/appointments/doctor
 * @access  Private (Doctor)
 */
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user._id })
      .populate('patient', ['name', 'email'])
      .sort({ appointmentDate: 1 });

    const decryptedAppointments = appointments.map((appt) => {
      const apptObj = appt.toObject();
      apptObj.notes = decryptData(apptObj.notes);
      apptObj.prescription = decryptData(apptObj.prescription);
      return apptObj;
    });

    res.json(decryptedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching schedule' });
  }
};

/**
 * @desc    Get all appointments
 * @route   GET /api/appointments
 * @access  Private (Receptionist/Admin)
 */
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', ['name', 'email'])
      .populate('doctor', ['name', 'email'])
      .sort({ appointmentDate: 1 });

    const processedAppointments = appointments.map((appt) => {
      const apptObj = appt.toObject();
      
      // Receptionists should not read clinical notes or prescriptions
      if (req.user.role === 'receptionist') {
        apptObj.notes = apptObj.notes ? '[REDACTED]' : undefined;
        apptObj.prescription = apptObj.prescription ? '[REDACTED]' : undefined;
      } else {
        apptObj.notes = decryptData(apptObj.notes);
        apptObj.prescription = decryptData(apptObj.prescription);
      }
      
      return apptObj;
    });

    res.json(processedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching all appointments' });
  }
};

/**
 * @desc    Update appointment status
 * @route   PUT /api/appointments/:id/status
 * @access  Private (Doctor/Receptionist/Admin)
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['scheduled', 'completed', 'cancelled', 'no-show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // A doctor can only update their own appointments' status
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

/**
 * @desc    Add clinical notes and prescriptions
 * @route   PUT /api/appointments/:id/notes
 * @access  Private (Doctor/Admin)
 */
export const addClinicalNotes = async (req, res) => {
  try {
    const { notes, prescription } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // A doctor can only add notes to their own appointments
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify notes for this appointment' });
    }

    if (notes) appointment.notes = encryptData(notes);
    if (prescription) appointment.prescription = encryptData(prescription);
    
    // Automatically complete the appointment if clinical notes are added
    if (appointment.status === 'scheduled') {
      appointment.status = 'completed';
    }

    await appointment.save();

    // Decrypt before sending back the updated object
    const apptObj = appointment.toObject();
    apptObj.notes = decryptData(apptObj.notes);
    apptObj.prescription = decryptData(apptObj.prescription);

    res.json(apptObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding clinical notes' });
  }
};
