const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB - client-side compression should keep real uploads well under this
});

const cloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn('⚠️  Cloudinary credentials are missing - /api/upload will return an error until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.');
}

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// POST /api/upload - admin only, takes one image file, returns its hosted URL
router.post('/', adminAuth, requirePermission('products:write'), (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'That image is too large (max 15MB). Try a smaller photo.' });
      }
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    next();
  });
}, async (req, res) => {
  if (!cloudinaryConfigured) {
    return res.status(503).json({ error: 'Image uploads are not configured yet. Set the CLOUDINARY_* environment variables.' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No image file was provided (expected a "image" form field).' });
  }
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image files are allowed.' });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, 'pahadi-craft/products');
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed. Please try again.' });
  }
});

// POST /api/upload/customer-review - requires a logged-in customer's uid
// (same trust pattern as /api/user/save and /api/custom-order elsewhere in
// this app), NOT admin auth - lets a real buyer attach a photo of what they
// received to their testimonial, without opening this up to fully anonymous
// uploads.
router.post('/customer-review', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'That image is too large (max 15MB). Try a smaller photo.' });
      }
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    next();
  });
}, async (req, res) => {
  if (!cloudinaryConfigured) {
    return res.status(503).json({ error: 'Image uploads are not configured yet.' });
  }
  if (!req.body.uid) {
    return res.status(401).json({ error: 'Sign in to attach a photo to your review.' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'No image file was provided.' });
  }
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(400).json({ error: 'Only image files are allowed.' });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer, 'pahadi-craft/customer-reviews');
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed. Please try again.' });
  }
});

module.exports = router;