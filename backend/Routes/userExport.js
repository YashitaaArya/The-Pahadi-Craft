const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

// GET /api/users/export - admin only. Downloads every customer record to
// date as an .xlsx file, for marketing lists, backups, or offline analysis.
router.get('/export', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();

    const rows = users.map((u) => ({
      Name: u.name || '',
      Email: u.email || '',
      Phone: u.phone || '',
      Street: u.address?.street || '',
      City: u.address?.city || '',
      State: u.address?.state || '',
      Pincode: u.address?.pincode || '',
      'Liked Products': (u.likedProducts || []).length,
      'Joined On': u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : '',
      'Last Login': u.lastLogin ? new Date(u.lastLogin).toISOString().split('T')[0] : '',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Name: '', Email: '' }]);
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const dateStamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Disposition', `attachment; filename="pahadi-craft-customers-${dateStamp}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (err) {
    console.error('User export error:', err);
    res.status(500).json({ error: 'Failed to export customer data' });
  }
});

module.exports = router;