const express = require('express');
const router = express.Router();
const CategoryImage = require('../models/CategoryImage');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');
const { MAIN_CATEGORIES } = require('../config/categories');

// GET /api/collections - public. Always returns all 7 main categories, with
// whatever image/tagline has been set (empty string if an admin hasn't
// uploaded one yet - the frontend shows a graceful placeholder in that case).
router.get('/', async (req, res) => {
  try {
    const saved = await CategoryImage.find();
    const byCategory = {};
    saved.forEach((c) => { byCategory[c.category] = c.toJSON(); });

    const result = MAIN_CATEGORIES.map((category) => ({
      category,
      image: byCategory[category]?.image || '',
      tagline: byCategory[category]?.tagline || '',
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// PUT /api/collections/:category - admin only. Upserts (one doc per category,
// no create/delete needed since the category list itself is fixed).
router.put('/:category', adminAuth, requirePermission('content:write'), async (req, res) => {
  const { category } = req.params;
  if (!MAIN_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `"${category}" is not a valid main category` });
  }
  try {
    const { image, tagline } = req.body;
    const updated = await CategoryImage.findOneAndUpdate(
      { category },
      { image, tagline },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(updated.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update collection' });
  }
});

module.exports = router;