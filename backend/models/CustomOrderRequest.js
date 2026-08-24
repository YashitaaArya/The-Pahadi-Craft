const mongoose = require('mongoose');

// A quote request, not a live order - custom work is priced manually by the
// owner after reviewing what the customer wants, so there's no payment here.
// Requires a logged-in customer (uid) so nothing is truly anonymous.
const customOrderRequestSchema = new mongoose.Schema({
  uid: { type: String, required: true },       // Firebase uid of the requesting customer
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  fragrance: { type: String, default: '' },
  size: { type: String, default: '' },
  container: { type: String, default: '' },
  label: { type: String, default: '' },
  quantity: { type: Number, default: 1, min: 1 },
  specialInstructions: { type: String, default: '' },
  status: { type: String, enum: ['new', 'quoted', 'confirmed', 'declined'], default: 'new' },
  quotedPrice: { type: Number },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

customOrderRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('CustomOrderRequest', customOrderRequestSchema);