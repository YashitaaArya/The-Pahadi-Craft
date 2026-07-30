const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  active: { type: Boolean, default: true },
  position: { type: Number, default: 0 },
}, { timestamps: true });

bannerSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('Banner', bannerSchema);
