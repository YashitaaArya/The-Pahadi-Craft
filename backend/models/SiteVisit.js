const mongoose = require('mongoose');

// One row per site visit (per session, not per page). Used only to count
// daily visitors for the analytics dashboard - no IP, no personal data.
const siteVisitSchema = new mongoose.Schema({
  path: { type: String, default: '/' },
  sessionId: { type: String, default: '' },
  visitedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: false });

module.exports = mongoose.model('SiteVisit', siteVisitSchema);