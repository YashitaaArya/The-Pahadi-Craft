const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const AdminUser = require('../models/AdminUser');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');
const { getPermissions } = require('../config/roles');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const permissions = getPermissions(admin.adminRole);

    const token = jwt.sign(
      { id: admin._id.toString(), email: admin.email, type: 'admin', adminRole: admin.adminRole },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const adminUserJson = admin.toJSON();
    adminUserJson.permissions = permissions;

    res.json({ token, adminUser: adminUserJson });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error during admin login' });
  }
});

// --- Admin team management - developer only ---

// GET /api/admin/team - list every admin login
router.get('/team', adminAuth, requirePermission('admins:manage'), async (req, res) => {
  try {
    const admins = await AdminUser.find().sort({ createdAt: -1 });
    res.json(admins.map((a) => {
      const json = a.toJSON();
      json.permissions = getPermissions(a.adminRole);
      return json;
    }));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin team' });
  }
});

// POST /api/admin/team - create a new admin login
router.post('/team', adminAuth, requirePermission('admins:manage'), async (req, res) => {
  try {
    const { email, password, name, adminRole } = req.body;
    if (!email || !password || !name || !adminRole) {
      return res.status(400).json({ error: 'email, password, name, and adminRole are all required' });
    }
    if (!['developer', 'owner', 'sales'].includes(adminRole)) {
      return res.status(400).json({ error: 'adminRole must be developer, owner, or sales' });
    }
    const existing = await AdminUser.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An admin with this email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await AdminUser.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      name,
      adminRole,
    });
    const json = admin.toJSON();
    json.permissions = getPermissions(admin.adminRole);
    res.status(201).json(json);
  } catch (err) {
    console.error('Error creating admin team member:', err);
    res.status(500).json({ error: 'Failed to create admin login' });
  }
});

// DELETE /api/admin/team/:id - remove an admin login
router.delete('/team/:id', adminAuth, requirePermission('admins:manage'), async (req, res) => {
  try {
    if (req.admin.id === req.params.id) {
      return res.status(400).json({ error: "You can't delete your own login while logged in as it" });
    }
    const admin = await AdminUser.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: 'Admin login not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete admin login' });
  }
});

module.exports = router;
