import express from 'express';
import sendEmail from '../utils/sendEmail.js';
import { adminFeedbackNotificationEmail, feedbackThankYouEmail } from '../utils/emailTemplates.js';

const router = express.Router();

/**
 * @desc    Submit feedback — sends confirmation to user and notification to admin
 * @route   POST /api/feedback
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: 'Please provide name, email, rating, and message.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // ── 1. Send Thank-You email to the user ───────────────────────────────
    await sendEmail(
      email,
      'Thank You for Your Feedback — EHR Health Portal',
      feedbackThankYouEmail(name)
    );

    // ── 2. Send Notification email to admin ───────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    await sendEmail(
      adminEmail,
      `New Feedback Received from ${name} (${rating}/5 ⭐)`,
      adminFeedbackNotificationEmail({ name, email, rating, message })
    );

    res.status(200).json({ message: 'Feedback submitted successfully. A confirmation email has been sent.' });
  } catch (error) {
    console.error('[Feedback] Error:', error);
    res.status(500).json({ message: 'Failed to submit feedback. Please try again later.' });
  }
});

export default router;
