const express = require('express');
const router = express.Router();
const CustomOrderRequest = require('../models/CustomOrderRequest');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

// POST /api/custom-order - requires the frontend to send a logged-in
// customer's uid/name/email (same trust model as /api/user/save - no
// separate Firebase token verification here, matching the existing pattern
// used across this app). This is a quote request, not a payable order.
router.post('/', async (req, res) => {
  try {
    const { uid, customerName, customerEmail } = req.body;
    if (!uid || !customerName || !customerEmail) {
      return res.status(401).json({ error: 'You need to be signed in to submit a custom order request.' });
    }
    const request = await CustomOrderRequest.create(req.body);
    res.status(201).json(request.toJSON());
  } catch (err) {
    console.error('Custom order request error:', err);
    res.status(400).json({ error: 'Failed to submit your request, please try again.' });
  }
});

// GET /api/custom-order - admin only
router.get('/', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const requests = await CustomOrderRequest.find().sort({ createdAt: -1 });
    res.json(requests.map((r) => r.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch custom order requests' });
  }
});

// PATCH /api/custom-order/:id - admin only, update status/quote/notes
router.patch('/:id', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const { status, quotedPrice, adminNotes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (quotedPrice !== undefined) update.quotedPrice = quotedPrice;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    const updated = await CustomOrderRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ error: 'Request not found' });
    res.json(updated.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Failed to update request' });
  }
});

module.exports = router;