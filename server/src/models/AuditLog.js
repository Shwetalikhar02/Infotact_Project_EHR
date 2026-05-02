import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true, // For faster querying by action
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Might be null for actions like failed login or public routes
      index: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Flexible payload for different action types
      required: true,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt (which acts as the timestamp)
  }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
