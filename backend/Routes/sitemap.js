const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

const SITE_URL = 'https://thepahadicraft.com';

// GET /api/blog-sitemap.xml - dynamically includes every published blog post,
// since new posts get added over time and a static file can't keep up.
// Submit this to Google Search Console alongside the main sitemap.xml.
router.get('/blog-sitemap.xml', async (req, res) => {
  try {
    const posts = await BlogPost.find({ status: 'published' }).select('slug updatedAt');
    const urls = posts.map((p) => `
  <url>
    <loc>${SITE_URL}/blog/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString().split('T')[0]}</lastmod>
    <priority>0.6</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Failed to generate sitemap');
  }
});

module.exports = router;