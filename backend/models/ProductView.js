const mongoose = require('mongoose');

// One row per product interaction event. `type` distinguishes a page view
// from a share, so the analytics dashboard can rank both. Kept deliberately
// lightweight - just what's needed to aggregate, nothing identifying.
const productViewSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  productName: { type: String, default: '' },
  type: { type: String, enum: ['view', 'share'], default: 'view', index: true },
  viewedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: false });

module.exports = mongoose.model('ProductView', productViewSchema);