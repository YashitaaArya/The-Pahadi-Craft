const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

// Ensures exactly one AboutContent document always exists.
async function getOrCreate() {
  let doc = await AboutContent.findOne();
  if (!doc) {
    doc = await AboutContent.create({});
  }
  return doc;
}

// GET /api/about - public
router.get('/', async (req, res) => {
  try {
    const doc = await getOrCreate();
    res.json(doc.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch about content' });
  }
});

// PUT /api/about - admin only
router.put('/', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const doc = await getOrCreate();

    const allowedFields = [
      'candlelightDukeLogo',
      'pahadiCraftLogo',
      'founderPhoto',
      'founderName',
      'founderTitle',
      'founderBio',
      'historyIntro',
      'historyJourney',
      'historyToday',
      'vision',
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        doc[field] = req.body[field];
      }
    });

    await doc.save();
    res.json(doc.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update about content' });
  }
});

module.exports = router;