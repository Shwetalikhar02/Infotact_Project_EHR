import nodemailer from 'nodemailer';

/**
 * Sends an email using Gmail SMTP via Nodemailer.
 *
 * @param {string} to      - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html    - HTML body content
 */
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password (not your account password)
    },
  });

  const mailOptions = {
    from: `"EHR Health Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Email] Message sent: ${info.messageId} → ${to}`);
  return info;
};

export default sendEmail;
