const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

const router = express.Router();

// Accept the file into memory (not disk) - it's small (product photos), and
// we stream it straight to Cloudinary without ever writing it to this server.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per image
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

// POST /api/upload - takes one image file, returns its hosted URL
router.post('/', adminAuth, requirePermission('products:write'), upload.single('image'), async (req, res) => {
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
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'pahadi-craft/products' },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Image upload failed. Please try again.' });
  }
});

module.exports = router;
