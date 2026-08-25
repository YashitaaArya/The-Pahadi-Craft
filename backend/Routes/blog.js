const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');

// GET /api/blog - public, published posts only
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }).sort({ createdAt: -1 });
    res.json(posts.map((p) => p.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET /api/blog/admin - every post regardless of status, for the dashboard
router.get('/admin', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts.map((p) => p.toJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// GET /api/blog/:slug - public, single post, also bumps the view count
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const json = post.toJSON();
    const { uid } = req.query;
    json.likedByViewer = uid ? post.likedBy.includes(uid) : false;
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/blog/:slug/like - toggles a like. Requires a logged-in customer's
// uid, matching the trust pattern used elsewhere in this app (no separate
// Firebase token verification) - but critically, this is what actually stops
// anonymous/repeat likes, since each uid can only appear once in likedBy.
router.post('/:slug/like', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(401).json({ error: 'Sign in to like this post.' });
    }
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const alreadyLiked = post.likedBy.includes(uid);
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== uid);
    } else {
      post.likedBy.push(uid);
    }
    await post.save();

    res.json({ likes: post.likedBy.length, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update like' });
  }
});

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// POST /api/blog - admin only
router.post('/', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const body = { ...req.body };
    if (!body.slug) body.slug = slugify(body.title || '');
    const existing = await BlogPost.findOne({ slug: body.slug });
    if (existing) {
      return res.status(409).json({ error: 'A post with this URL slug already exists - try a different title or set a custom slug.' });
    }
    const post = await BlogPost.create(body);
    res.status(201).json(post.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to create post' });
  }
});

// PUT /api/blog/:id - admin only (by mongo id, for editing)
router.put('/id/:id', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.id;
    const post = await BlogPost.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post.toJSON());
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to update post' });
  }
});

// DELETE /api/blog/id/:id - admin only
router.delete('/id/:id', adminAuth, requirePermission('content:write'), async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;