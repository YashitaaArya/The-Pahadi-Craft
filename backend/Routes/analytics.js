const express = require('express');
const router = express.Router();
const ProductView = require('../models/ProductView');
const SiteVisit = require('../models/SiteVisit');
const Product = require('../models/Product');
const Order = require('../models/order');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

// --- Public tracking endpoints (called by the storefront) ---

// POST /api/analytics/visit - records one site visit per session
router.post('/visit', async (req, res) => {
  try {
    const { path, sessionId } = req.body;
    await SiteVisit.create({ path: path || '/', sessionId: sessionId || '' });
    res.status(204).send();
  } catch (err) {
    // Tracking failures should never break the site for a visitor
    res.status(204).send();
  }
});

// POST /api/analytics/product-view - records a product detail view
router.post('/product-view', async (req, res) => {
  try {
    const { productId, productName } = req.body;
    if (productId) {
      await ProductView.create({ productId, productName: productName || '' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(204).send();
  }
});

// --- Admin dashboard ---

// GET /api/analytics/overview - admin only
router.get('/overview', adminAuth, requirePermission('analytics:read'), async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7);
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);

    // Visitors per day, last 14 days
    const visitorsPerDay = [];
    for (let i = 13; i >= 0; i--) {
      const dayStart = new Date(now); dayStart.setDate(now.getDate() - i); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart); dayEnd.setHours(23, 59, 59, 999);
      const count = await SiteVisit.countDocuments({ visitedAt: { $gte: dayStart, $lte: dayEnd } });
      visitorsPerDay.push({ date: dayStart.toISOString().split('T')[0], visitors: count });
    }

    // Most viewed products this week
    const mostViewedThisWeek = await ProductView.aggregate([
      { $match: { viewedAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$productId', name: { $first: '$productName' }, views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    // Most liked products (from the real likedProducts arrays on users)
    const likeAgg = await User.aggregate([
      { $unwind: '$likedProducts' },
      { $group: { _id: '$likedProducts', likes: { $sum: 1 } } },
      { $sort: { likes: -1 } },
      { $limit: 10 },
    ]);
    const likedIds = likeAgg.map((l) => l._id);
    const likedProductDocs = await Product.find({ _id: { $in: likedIds } }).select('name').lean();
    const nameById = {};
    likedProductDocs.forEach((p) => { nameById[p._id.toString()] = p.name; });
    const mostLiked = likeAgg.map((l) => ({
      productId: l._id,
      name: nameById[l._id] || 'Unknown product',
      likes: l.likes,
    }));

    // Best sellers by order count, last 30 days
    const recentOrders = await Order.find({ createdAt: { $gte: thirtyDaysAgo } }).lean();
    const soldCount = {};
    recentOrders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const key = it.name || it.productId;
        if (!key) return;
        soldCount[key] = (soldCount[key] || 0) + (it.quantity || 1);
      });
    });
    const bestSellers = Object.entries(soldCount)
      .map(([name, qty]) => ({ name, quantitySold: qty }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    // Headline totals
    const [totalVisitsAllTime, visitsLast7, totalProducts, totalCustomers] = await Promise.all([
      SiteVisit.countDocuments(),
      SiteVisit.countDocuments({ visitedAt: { $gte: sevenDaysAgo } }),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    const revenueLast30 = recentOrders
      .filter((o) => o.paymentStatus === 'completed')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      visitorsPerDay,
      mostViewedThisWeek: mostViewedThisWeek.map((m) => ({ productId: m._id, name: m.name || 'Unknown', views: m.views })),
      mostLiked,
      bestSellers,
      totals: {
        totalVisitsAllTime,
        visitsLast7,
        totalProducts,
        totalCustomers,
        ordersLast30: recentOrders.length,
        revenueLast30,
      },
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

module.exports = router;