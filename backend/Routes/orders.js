const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

// GET /api/orders - admin only, lists all orders in the shape the dashboard expects
router.get('/', adminAuth, requirePermission('orders:read'), async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    const formatted = orders.map((o) => {
      const json = o.toJSON();
      return {
        id: json.id,
        userId: o.user ? o.user._id.toString() : '',
        customerName: json.name || (o.user && o.user.name) || '',
        customerEmail: (o.user && o.user.email) || '',
        items: (json.items || []).map((it) => ({
          product: { id: it.productId, name: it.name, price: it.price },
          quantity: it.quantity,
        })),
        status: json.status || 'pending',
        total: json.totalAmount || 0,
        shippingAddress: {
          street: json.address || '',
          city: json.city || '',
          state: json.state || '',
          zipCode: json.zip || '',
          country: json.country || '',
        },
        paymentStatus: json.paymentStatus === 'completed' ? 'paid' : json.paymentStatus,
        createdAt: json.createdAt,
        trackingNumber: json.trackingNumber || '',
      };
    });
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/orders/:id/status - admin only
router.patch('/:id/status', adminAuth, requirePermission('orders:write'), async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const update = {};
    if (status) update.status = status;
    if (trackingNumber !== undefined) update.trackingNumber = trackingNumber;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Route handlers
router.get('/me/:uid',  async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const orders = await Order.find({ user: user._id })
            .select('orderAmount orderStatus createdAt items totalAmount')
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            orders,
            count: orders.length 
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching orders' 
        });
    }
});

// Single export for router
module.exports = router;

