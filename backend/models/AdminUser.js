const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' }, // matches frontend User.role
  adminRole: {
  type: String,
  enum: [
    'developer',
    'owner',
    'sales',
    'admin',
    'super-admin'
  ],
  default: 'sales'
},
  permissions: { type: [String], default: [] }, // legacy field, kept for backward compatibility - not used for enforcement
  lastLogin: { type: Date },
}, { timestamps: true });

adminUserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  }
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
