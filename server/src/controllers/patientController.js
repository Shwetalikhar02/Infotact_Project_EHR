import Patient from '../models/Patient.js';
import { encrypt, decrypt } from '../utils/encryption.js';

/**
 * Helper function to safely encrypt an object or string
 */
const encryptData = (data) => {
  if (!data) return undefined;
  const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data);
  return encrypt(stringifiedData);
};

/**
 * Helper function to safely decrypt a string and parse it back to an object
 */
const decryptData = (encryptedString) => {
  if (!encryptedString) return undefined;
  try {
    const decryptedString = decrypt(encryptedString);
    // Attempt to parse JSON, if it fails, return the string itself
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
 * @desc    Create or update patient profile
 * @route   POST /api/patients
 * @access  Private (Patient/Admin/Receptionist)
 */
export const createOrUpdatePatientProfile = async (req, res) => {
  try {
    const {
      userId, // ID of the user this profile belongs to
      dateOfBirth,
      gender,
      contactNumber,
      address,
      emergencyContact,
      medicalHistory,
      currentMedications,
      allergies,
    } = req.body;

    // Check permissions: A patient can only create/update their own profile
    const targetUserId = req.user.role === 'patient' ? req.user._id : (userId || req.user._id);

    if (req.user.role === 'patient' && userId && userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update another patient profile' });
    }

    const profileFields = {
      user: targetUserId,
      dateOfBirth,
      gender,
      contactNumber,
      address,
      emergencyContact,
    };

    // Encrypt sensitive PHI before storing
    if (medicalHistory) profileFields.medicalHistory = encryptData(medicalHistory);
    if (currentMedications) profileFields.currentMedications = encryptData(currentMedications);
    if (allergies) profileFields.allergies = encryptData(allergies);

    // Find and update, or create new
    let patient = await Patient.findOne({ user: targetUserId });

    if (patient) {
      // Update
      patient = await Patient.findOneAndUpdate(
        { user: targetUserId },
        { $set: profileFields },
        { new: true }
      );
      return res.json(patient);
    }

    // Create
    patient = new Patient(profileFields);
    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error managing patient profile' });
  }
};

/**
 * @desc    Get current logged in patient profile
 * @route   GET /api/patients/me
 * @access  Private (Patient)
 */
export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id }).populate('user', ['name', 'email']);

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Decrypt sensitive data
    const patientObj = patient.toObject();
    patientObj.medicalHistory = decryptData(patientObj.medicalHistory);
    patientObj.currentMedications = decryptData(patientObj.currentMedications);
    patientObj.allergies = decryptData(patientObj.allergies);

    res.json(patientObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * @desc    Get patient profile by ID
 * @route   GET /api/patients/:id
 * @access  Private (Doctor/Admin)
 */
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', ['name', 'email']);

    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    // Decrypt sensitive data
    const patientObj = patient.toObject();
    patientObj.medicalHistory = decryptData(patientObj.medicalHistory);
    patientObj.currentMedications = decryptData(patientObj.currentMedications);
    patientObj.allergies = decryptData(patientObj.allergies);

    res.json(patientObj);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    res.status(500).json({ message: 'Server error fetching patient' });
  }
};

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 * @access  Private (Doctor/Admin/Receptionist)
 */
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('user', ['name', 'email']);

    // Map through patients and decrypt their data if the user is a Doctor/Admin
    // Receptionists will get redacted information for PHI
    const decryptedPatients = patients.map(patient => {
      const pObj = patient.toObject();
      
      if (req.user.role === 'receptionist') {
        pObj.medicalHistory = '[REDACTED]';
        pObj.currentMedications = '[REDACTED]';
        pObj.allergies = '[REDACTED]';
      } else {
        pObj.medicalHistory = decryptData(pObj.medicalHistory);
        pObj.currentMedications = decryptData(pObj.currentMedications);
        pObj.allergies = decryptData(pObj.allergies);
      }
      
      return pObj;
    });

    res.json(decryptedPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
};
