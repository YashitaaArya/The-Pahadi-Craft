const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

let transporter = null;
const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD);

if (emailConfigured) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD.replace(/\s/g, ''),
    },
  });
} else {
  console.warn('EMAIL settings are not configured - contact form messages will still save to the database, but email notification will be unavailable.');
}

async function sendContactEmail({ name, email, subject, message }) {
  const recipient = process.env.EMAIL_USER;
  if (!transporter) throw new Error('No email provider is configured');
  await transporter.sendMail({
    from: `"Pahadi Craft Website" <${process.env.EMAIL_USER}>`,
    to: recipient,
    replyTo: email || undefined,
    subject: `New contact form message${subject ? `: ${subject}` : ''}`,
    text: `A customer contacted you through the website.\n\nName: ${name}\nEmail: ${email || 'not provided'}\n\nMessage:\n${message}\n\nReply directly to this email to respond to them.`,
  });
}

// POST /api/contact - public
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    if (email && !EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const saved = await ContactMessage.create({ name, email, subject, message });

    if (!transporter) {
      return res.status(503).json({
        error: 'Your message was saved, but email notifications are not configured on the server.',
        saved: true,
        id: saved.id,
      });
    }

    try {
      await sendContactEmail({ name, email, subject, message });
    } catch (emailErr) {
      console.error('Contact email send failed:', emailErr);
    }

    res.status(201).json({
      success: true,
      id: saved.id,
      emailNotification: transporter ? 'sent_or_pending' : 'not_configured',
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

// GET /api/contact/unread-count - admin only. Powers the sidebar notification
// dot, so the admin knows a new message arrived without opening the page.
router.get('/unread-count', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ status: 'new' });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// GET /api/contact - admin only. Supports ?search= to filter by customer
// name, email, subject, or message body.
router.get('/', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && String(search).trim()) {
      const re = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query = { $or: [{ name: re }, { email: re }, { subject: re }, { message: re }] };
    }
    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });
    res.json(messages.map((m) => m.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// PATCH /api/contact/:id - admin only, mark as read/responded
router.patch('/:id', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Message not found' });
    res.json(updated.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// DELETE /api/contact/:id - admin only, delete one message
router.delete('/:id', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Message not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// POST /api/contact/bulk-delete - admin only. Body: { ids: string[] }
router.post('/bulk-delete', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Provide an array of message ids to delete' });
    }
    const result = await ContactMessage.deleteMany({ _id: { $in: ids } });
    res.json({ deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete the selected messages' });
  }
});

module.exports = router;