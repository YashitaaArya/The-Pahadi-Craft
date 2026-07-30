const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Product = require('../models/Product');
const Order = require('../models/order');
const User = require('../models/User');
const Review = require('../models/Review');
const Testimonial = require('../models/Testimonial');
const Feedback = require('../models/Feedback');
const Banner = require('../models/Banner');

// GET /api/analytics - admin only
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, orders, topProducts] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10),
      Product.find().sort({ orderCount: -1 }).limit(5),
    ]);

    const allOrders = await Order.find();
    const totalRevenue = allOrders
      .filter((o) => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const recentOrders = orders.map((o) => {
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
          street: json.address || '', city: json.city || '',
          state: json.state || '', zipCode: json.zip || '', country: json.country || '',
        },
        paymentStatus: json.paymentStatus === 'completed' ? 'paid' : json.paymentStatus,
        createdAt: json.createdAt,
        trackingNumber: json.trackingNumber || '',
      };
    });

    // Simple sales trend for the last 7 days
    const salesTrend = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStr = day.toISOString().slice(0, 10);
      const dayOrders = allOrders.filter((o) => o.createdAt.toISOString().slice(0, 10) === dayStr);
      salesTrend.push({
        date: dayStr,
        sales: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
        orders: dayOrders.length,
      });
    }

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalUsers,
      totalCustomers: totalUsers,
      recentOrders,
      topProducts: topProducts.map((p) => p.toJSON()),
      salesTrend,
      userGrowth: [],
    });
  } catch (err) {
    console.error('Error building analytics:', err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// GET /api/users - admin only, list customers
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(
      users.map((u) => ({
        id: u._id.toString(),
        email: u.email,
        name: u.name,
        role: 'customer',
        createdAt: u.createdAt,
        phone: u.phone,
        status: 'active',
      }))
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Reviews / Testimonials / Feedback / Banners
// GET is public (so the storefront can show approved reviews/testimonials later),
// admin-only for create/update.
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews.map((r) => r.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials.map((t) => t.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

router.get('/feedback', adminAuth, async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback.map((f) => f.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ position: 1 });
    res.json(banners.map((b) => b.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

module.exports = router;
