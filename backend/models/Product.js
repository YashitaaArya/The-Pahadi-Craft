const mongoose = require('mongoose');
const { MAIN_CATEGORIES } = require('../config/categories');

const colorVariantSchema = new mongoose.Schema({
  colorName: { type: String, required: true },   // e.g. "Terracotta Orange"
  hexCode: { type: String, default: '#C9A66B' },  // used to render the round swatch
  images: { type: [String], default: [] },        // photos of the product in this color
  stock: { type: Number, default: 0 },
  sku: { type: String, default: '' },
}, { _id: false });

const fragranceVariantSchema = new mongoose.Schema({
  fragranceName: { type: String, required: true },
  stock: { type: Number, default: 0 },
  sku: { type: String, default: '' },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  additionalImages: { type: [String], default: [] },

  // 3-tier categorization
  mainCategory: { type: String, enum: MAIN_CATEGORIES, required: true },
  primeSubcategory: { type: String, default: '' },       // e.g. "Glass Jar Candles"
  secondarySubcategory: { type: String, default: '' },    // finer-grained, optional

  // Legacy single-level fields - kept so nothing already saved breaks;
  // new products should use mainCategory/primeSubcategory instead.
  category: { type: String, default: '' },
  subcategory: { type: String, default: '' },

  scented: { type: Boolean, default: false },
  size: { type: String, default: '' },       // free text, e.g. "4 x 6 in"
  material: { type: String, default: '' },
  numberOfItems: { type: Number, default: 1, min: 1 },
  volume: { type: String, default: '' },     // free text, e.g. "250ml"
  Weight: { type: String, default: '' },   // free text, e.g. "500g"

  colorVariants: { type: [colorVariantSchema], default: [] },
  fragranceVariants: { type: [fragranceVariantSchema], default: [] },

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