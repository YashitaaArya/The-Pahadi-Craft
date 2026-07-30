const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  category: { type: String, default: 'general' },
  subject: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
  response: { type: String, default: '' },
}, { timestamps: true });

feedbackSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
