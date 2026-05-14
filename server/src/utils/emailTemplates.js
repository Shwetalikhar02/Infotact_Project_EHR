// ─────────────────────────────────────────────────────────────────────────────
// Shared base layout wrapper for all emails
// ─────────────────────────────────────────────────────────────────────────────
const baseLayout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>EHR Health Portal</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a73e8 0%,#0d47a1 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:0.5px;">
                🏥 EHR Health Portal
              </h1>
              <p style="margin:6px 0 0;color:#bbdefb;font-size:13px;">Secure · Smart · Compassionate Healthcare</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                © ${new Date().getFullYear()} EHR Health Portal. All rights reserved.<br/>
                If you did not request this email, please ignore it or
                <a href="mailto:${process.env.EMAIL_USER}" style="color:#1a73e8;text-decoration:none;">contact support</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Welcome Email — sent on successful registration
// ─────────────────────────────────────────────────────────────────────────────
export const welcomeEmail = (name, role) => {
  const roleLabels = {
    patient: 'Patient',
    doctor: 'Doctor',
    admin: 'Administrator',
    receptionist: 'Receptionist',
  };
  const roleIcons = {
    patient: '🩺',
    doctor: '👨‍⚕️',
    admin: '🛡️',
    receptionist: '📋',
  };
  const displayRole = roleLabels[role] || role;
  const icon = roleIcons[role] || '👤';

  const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Welcome aboard, ${name}! 🎉</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;">We're thrilled to have you join the EHR Health Portal family.</p>

    <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border-left:4px solid #1a73e8;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;color:#1e40af;font-size:15px;">
        ${icon} Your account has been created as a <strong>${displayRole}</strong>.
      </p>
    </div>

    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
      With EHR Health Portal you can:
    </p>
    <ul style="color:#475569;font-size:15px;line-height:2;padding-left:20px;margin:0 0 28px;">
      <li>📅 Book and manage appointments</li>
      <li>📁 Access your secure health records</li>
      <li>💬 Communicate with your care team</li>
      <li>🔒 Enjoy bank-grade data security</li>
    </ul>

    <div style="text-align:center;margin-bottom:28px;">
      <a href="${process.env.FRONTEND_URL}" style="display:inline-block;background:linear-gradient(135deg,#1a73e8,#0d47a1);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
        Go to Dashboard →
      </a>
    </div>

    <p style="color:#94a3b8;font-size:13px;margin:0;">
      If you did not create this account, please disregard this email or contact our support team immediately.
    </p>
  `;
  return baseLayout(content);
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. Password Reset Email — sent on forgot password request
// ─────────────────────────────────────────────────────────────────────────────
export const passwordResetEmail = (name, resetLink) => {
  const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Reset Your Password 🔐</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;">Hi <strong>${name}</strong>, we received a request to reset your password.</p>

    <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;color:#c2410c;font-size:14px;">
        ⚠️ This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email — your account is safe.
      </p>
    </div>

    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
      Click the button below to create a new password. For security reasons, this link can only be used once.
    </p>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#ef4444,#b91c1c);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.3px;">
        Reset My Password →
      </a>
    </div>

    <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break:break-all;background:#f1f5f9;padding:12px;border-radius:6px;font-size:12px;color:#475569;margin:0;">
      ${resetLink}
    </p>
  `;
  return baseLayout(content);
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. Feedback Thank-You Email — sent to user after submitting feedback
// ─────────────────────────────────────────────────────────────────────────────
export const feedbackThankYouEmail = (name) => {
  const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">Thank You for Your Feedback! 💙</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;">Hi <strong>${name}</strong>, we've received your message and truly appreciate you taking the time to share your thoughts.</p>

    <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border-left:4px solid #16a34a;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <p style="margin:0;color:#166534;font-size:15px;">
        ✅ Your feedback has been successfully submitted and our team will review it shortly.
      </p>
    </div>

    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Your input helps us continuously improve EHR Health Portal to better serve you and all our users. We value every piece of feedback — it drives us to build a better experience for everyone.
    </p>

    <div style="background:#f8fafc;border-radius:8px;padding:20px 24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;color:#64748b;font-size:14px;">Have more to share or need assistance?</p>
      <a href="mailto:${process.env.EMAIL_USER}" style="display:inline-block;margin-top:12px;background:#f1f5f9;color:#1a73e8;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:600;border:1px solid #cbd5e1;">
        Contact Support
      </a>
    </div>

    <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">
      — The EHR Health Portal Team ❤️
    </p>
  `;
  return baseLayout(content);
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. Admin Feedback Notification — sent to admin with full feedback details
// ─────────────────────────────────────────────────────────────────────────────
export const adminFeedbackNotificationEmail = ({ name, email, rating, message }) => {
  const stars = '⭐'.repeat(Math.min(Math.max(Number(rating) || 0, 0), 5));
  const ratingColor = rating >= 4 ? '#16a34a' : rating >= 3 ? '#d97706' : '#dc2626';

  const content = `
    <h2 style="margin:0 0 8px;color:#1e293b;font-size:22px;">New Feedback Received 📬</h2>
    <p style="margin:0 0 24px;color:#64748b;font-size:15px;">A user has submitted feedback through the EHR Health Portal.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px;">
      <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px 8px 0 0;padding:16px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:100px;">Name</td>
              <td style="color:#1e293b;font-size:15px;font-weight:600;">${name}</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;padding:16px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:100px;">Email</td>
              <td style="color:#1a73e8;font-size:15px;">
                <a href="mailto:${email}" style="color:#1a73e8;text-decoration:none;">${email}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#f8fafc;border:1px solid #e2e8f0;border-top:none;padding:16px 20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:100px;">Rating</td>
              <td style="font-size:15px;">
                <span style="color:${ratingColor};font-weight:700;">${rating}/5</span>
                &nbsp; ${stars}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:16px 20px;">
          <p style="margin:0 0 8px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
          <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;background:#f8fafc;padding:14px;border-radius:6px;border-left:3px solid #1a73e8;">
            ${message}
          </p>
        </td>
      </tr>
    </table>

    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL}/admin" style="display:inline-block;background:linear-gradient(135deg,#1a73e8,#0d47a1);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
        View Admin Dashboard →
      </a>
    </div>
  `;
  return baseLayout(content);
};
