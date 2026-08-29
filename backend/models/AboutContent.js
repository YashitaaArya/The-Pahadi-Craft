const mongoose = require('mongoose');

// Singleton document powering the editable parts of the About Us page:
// brand history, founder story and long-term vision.
const aboutContentSchema = new mongoose.Schema({
  candlelightDukeLogo: { type: String, default: '' },
  pahadiCraftLogo: { type: String, default: '' },

  founderPhoto: { type: String, default: '' },
  founderName: { type: String, default: 'Neety Arya' },
  founderTitle: { type: String, default: 'Founder, Pahadicraft' },
  founderBio: { type: String, default: '' },

  historyIntro: { type: String, default: '' },
  historyJourney: { type: String, default: '' },
  historyToday: { type: String, default: '' },

  vision: { type: String, default: '' },
}, { timestamps: true });

aboutContentSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);