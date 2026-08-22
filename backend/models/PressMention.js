const mongoose = require('mongoose');

// Newspaper features, awards, and other press recognition - shown on the
// About Us page. Admin-editable so new mentions can be added without a
// code change whenever the owner shares them.
const pressMentionSchema = new mongoose.Schema({
  title: { type: String, required: true },      // e.g. "Featured in Tribune India"
  source: { type: String, default: '' },          // e.g. "The Tribune", "Himachal Awards 2023"
  description: { type: String, default: '' },     // what it's about, in the owner's own words
  image: { type: String, default: '' },           // scan/photo of the clipping or award
  link: { type: String, default: '' },             // optional link to the original article
  date: { type: String, default: '' },              // free text, e.g. "March 2023"
  position: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

pressMentionSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('PressMention', pressMentionSchema);