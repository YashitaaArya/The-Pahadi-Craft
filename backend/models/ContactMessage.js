const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
}, { timestamps: true });

contactMessageSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);