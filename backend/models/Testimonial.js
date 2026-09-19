const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Photos of the actual product/purchase the customer shared.
  images: { type: [String], default: [] },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  // No approval gate: reviews go live immediately so the section stays
  // organic. Admin keeps full edit/delete control instead of approval.
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true });

testimonialSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);