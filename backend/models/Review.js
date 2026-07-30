const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, default: '' },
  userName: { type: String, default: 'Anonymous' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('Review', reviewSchema);
