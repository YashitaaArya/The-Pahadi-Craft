const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

// POST /api/newsletter/subscribe - public
router.post('/subscribe', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      // Already subscribed - treat as success rather than an error, no need
      // to tell the visitor "you already did this" like it's a mistake.
      return res.json({ success: true, alreadySubscribed: true });
    }

    await Newsletter.create({ email });
    res.status(201).json({ success: true, alreadySubscribed: false });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

// GET /api/newsletter - admin only, list of subscribers for promotions/campaigns
router.get('/', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers.map((s) => s.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

module.exports = router;