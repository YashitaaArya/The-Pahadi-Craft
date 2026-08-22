const express = require('express');
const router = express.Router();
const PressMention = require('../models/PressMention');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

// GET /api/press - public, active only, shown on About Us
router.get('/', async (req, res) => {
  try {
    const mentions = await PressMention.find({ active: true }).sort({ position: 1 });
    res.json(mentions.map((m) => m.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch press mentions' });
  }
});

// GET /api/press/admin - every mention regardless of active status
router.get('/admin', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const mentions = await PressMention.find().sort({ position: 1 });
    res.json(mentions.map((m) => m.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch press mentions' });
  }
});

router.post('/', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const mention = await PressMention.create(req.body);
    res.status(201).json(mention.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create press mention' });
  }
});

router.put('/:id', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.id;
    const mention = await PressMention.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!mention) return res.status(404).json({ error: 'Press mention not found' });
    res.json(mention.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update press mention' });
  }
});

router.delete('/:id', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const mention = await PressMention.findByIdAndDelete(req.params.id);
    if (!mention) return res.status(404).json({ error: 'Press mention not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete press mention' });
  }
});

module.exports = router;