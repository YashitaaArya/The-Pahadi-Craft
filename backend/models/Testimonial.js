const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

testimonialSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
