const mongoose = require('mongoose');

// One row per product page view. Powers the analytics section: daily
// visitor counts and most-viewed products per week. Kept deliberately
// lightweight - just what's needed to aggregate, nothing identifying.
const productViewSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  productName: { type: String, default: '' },
  viewedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: false });

module.exports = mongoose.model('ProductView', productViewSchema);