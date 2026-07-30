const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  additionalImages: { type: [String], default: [] },
  category: { type: String, required: true },
  subcategory: { type: String, default: '' },
  fragranceNotes: { type: [String], default: [] },
  ingredients: { type: [String], default: [] },
  burnTime: { type: String, default: '' },
  weight: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  sku: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  artisanInfo: { type: String, default: '' },
  discount: { type: Number, default: 0 },
}, { timestamps: true });

// Match the frontend's Product type: it expects `id`, not `_id`.
productSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema);
