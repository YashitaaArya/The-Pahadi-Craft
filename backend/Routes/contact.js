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
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
} else {
  console.warn('⚠️  EMAIL_USER / EMAIL_APP_PASSWORD are not set - contact form messages will still save to the database and show in the admin dashboard, but the email notification will be skipped.');
}

// POST /api/contact - public. Saves the message (always, so nothing is lost
// even if email delivery fails) and tries to email the owner a notification.
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

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"Pahadi Craft Website" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER,
          replyTo: email || undefined,
          subject: `New contact form message${subject ? `: ${subject}` : ''}`,
          text: `A customer contacted you through the website.\n\nName: ${name}\nEmail: ${email || 'not provided'}\n\nMessage:\n${message}\n\nReply directly to this email to respond to them.`,
        });
      } catch (emailErr) {
        // The message is already saved and visible in the admin dashboard,
        // so a failed email isn't a failed request - just log it.
        console.error('Contact email send failed:', emailErr);
      }
    }

    res.status(201).json({ success: true, id: saved.id });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Something went wrong, please try again.' });
  }
});

// GET /api/contact - admin only, list of messages
router.get('/', adminAuth, requirePermission('customers:read'), async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
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

module.exports = router;