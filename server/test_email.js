import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the server directory
dotenv.config({ path: path.resolve('c:/Users/hp/Infotact_Project_EHR/server/.env') });

async function testEmail() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  console.log("Password length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"EHR Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject: "Test Email Configuration",
      text: "If you see this, email is working!",
    });
    console.log("SUCCESS! Email sent:", info.messageId);
  } catch (error) {
    console.error("ERROR sending email:");
    console.error(error.message);
  }
}

testEmail();
