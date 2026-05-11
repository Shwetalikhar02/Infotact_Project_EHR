import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'doctor', 'patient', 'receptionist'], default: 'patient' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const DEMO_USERS = [
  { name: 'Admin User',       email: 'admin@gmail.com',   password: '00000000', role: 'admin' },
  { name: 'Dr. Demo Doctor',  email: 'doctor@gmail.com',  password: '00000000', role: 'doctor' },
  { name: 'Patient User',     email: 'patient@gmail.com', password: '00000000', role: 'patient' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const u of DEMO_USERS) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`⚠️  ${u.email} already exists — skipping`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ name: u.name, email: u.email, password: hashed, role: u.role });
      console.log(`✅ Created: ${u.email} (${u.role})`);
    }

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────');
    console.log('admin@gmail.com    | 00000000 | admin');
    console.log('doctor@gmail.com   | 00000000 | doctor');
    console.log('patient@gmail.com  | 00000000 | patient');
    console.log('─────────────────────────────────');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
