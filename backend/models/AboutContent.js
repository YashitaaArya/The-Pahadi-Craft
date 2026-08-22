const mongoose = require('mongoose');

// Singleton document (only one ever exists) powering the editable parts of
// the About Us page: the brand history logo transition and the founder section.
const aboutContentSchema = new mongoose.Schema({
  candlelightDukeLogo: { type: String, default: '' },
  pahadiCraftLogo: { type: String, default: '' },
  founderPhoto: { type: String, default: '' },
  founderName: { type: String, default: 'Neety Arya' },
  founderTitle: { type: String, default: 'Founder, Pahadi Craft' },
  founderBio: { type: String, default: '' },
}, { timestamps: true });

aboutContentSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => { ret.id = ret._id.toString(); delete ret._id; delete ret.__v; return ret; }
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);