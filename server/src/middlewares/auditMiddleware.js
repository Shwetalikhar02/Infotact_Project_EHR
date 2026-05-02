import AuditLog from '../models/AuditLog.js';

/**
 * Middleware to log sensitive actions to the database.
 * @param {string} actionName - The name of the action being performed (e.g., 'PATIENT_RECORD_ACCESSED')
 */
export const auditLog = (actionName) => {
  return async (req, res, next) => {
    // Capture the original send function to log after the response is sent
    const originalSend = res.send;

    res.send = function (body) {
      // Restore the original send function
      res.send = originalSend;

      // Extract details for the audit log
      const logDetails = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        // Be careful not to log sensitive data like passwords from req.body
        requestBody: req.body ? { ...req.body, password: '[REDACTED]' } : null,
      };

      // Create the audit log asynchronously so it doesn't block the response
      AuditLog.create({
        action: actionName,
        userId: req.user ? req.user._id : null, // If the route is protected, we'll have req.user
        details: logDetails,
        ipAddress: req.ip || req.connection.remoteAddress,
      }).catch(err => {
        console.error('Failed to write audit log:', err);
      });

      // Send the response
      return res.send(body);
    };

    next();
  };
};
