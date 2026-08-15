const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');
const { MAIN_CATEGORIES } = require('../config/categories');

// GET /api/products/categories - public. The fixed main category list, plus
// prime/secondary subcategory values already in use, so the admin form can
// suggest them instead of everyone typing free text from scratch.
router.get('/categories', async (req, res) => {
  try {
    const [primeSubcategories, secondarySubcategories] = await Promise.all([
      Product.distinct('primeSubcategory'),
      Product.distinct('secondarySubcategory'),
    ]);
    res.json({
      mainCategories: MAIN_CATEGORIES,
      primeSubcategories: primeSubcategories.filter(Boolean).sort(),
      secondarySubcategories: secondarySubcategories.filter(Boolean).sort(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/products - public, used by the storefront
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products.map((p) => p.toJSON()));
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product.toJSON());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST /api/products - admin only
router.post('/', adminAuth, requirePermission('products:write'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product.toJSON());
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ error: err.message || 'Failed to create product' });
  }
});

// PUT /api/products/:id - admin only
router.put('/:id', adminAuth, requirePermission('products:write'), async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.id; // don't let the frontend overwrite the mongo _id
    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product.toJSON());
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json({ error: err.message || 'Failed to update product' });
  }
});

// DELETE /api/products/:id - admin only
router.delete('/:id', adminAuth, requirePermission('products:write'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;