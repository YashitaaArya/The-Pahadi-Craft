const mongoose = require('mongoose');
const { MAIN_CATEGORIES } = require('../config/categories');

// One document per main category - powers the homepage "Our Collections"
// section and lets an admin swap the image/tagline without touching code.
const categoryImageSchema = new mongoose.Schema({
  category: { type: String, enum: MAIN_CATEGORIES, required: true, unique: true },
  image: { type: String, default: '' },
  tagline: { type: String, default: '' },
}, { timestamps: true });

categoryImageSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('CategoryImage', categoryImageSchema);