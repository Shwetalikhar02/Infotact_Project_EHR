import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');
    
    const user = await User.create({
      name: 'test2',
      email: 'test2@example.com',
      password: 'password123',
      role: 'patient'
    });
    console.log(user);
    
  } catch (err) {
    console.error('ERROR OCCURRED:', err);
  } finally {
    process.exit(0);
  }
};

test();
