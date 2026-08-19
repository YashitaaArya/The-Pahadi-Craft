const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');
const requirePermission = require('../middleware/requirePermission');
const { MAIN_CATEGORIES } = require('../config/categories');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB - plenty for a 750-row spreadsheet
});

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

// GET /api/products/bulk-import/template - admin only, downloads an .xlsx
// template with the exact columns the import expects, plus one example row.
router.get('/bulk-import/template', adminAuth, requirePermission('products:write'), (req, res) => {
  const headers = [
    'Name', 'Description', 'Price', 'Main Category', 'Prime Subcategory',
    'Secondary Subcategory', 'Scented (Yes/No)', 'Size', 'Material', 'Number of Items', 'Capacity / Volume', 'Weight',
    'Stock', 'SKU', 'Featured (Yes/No)', 'Trending (Yes/No)', 'Tags (comma separated)',
    'Artisan Info', 'Discount (%)',
  ];
  const exampleRow = [
    'Himachali Saffron Candle', 'A hand-poured saffron candle infused with natural Himalayan fragrance.',
    899, 'Candles', 'Glass Jar Candles', 'Premium', 'Yes', '4 x 6 in', 'Glass', 1, '250ml', '',
    28, 'CND-001', 'Yes', 'Yes', 'handmade, himachali, saffron',
    'Crafted by local artisans from Kullu.', 10,
  ];
  const notesRow = [
    `Main Category must be exactly one of: ${MAIN_CATEGORIES.join(' | ')}`,
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow, [], notesRow]);
  XLSX.utils.book_append_sheet(wb, ws, 'Products');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="pahadi-craft-product-template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

// Parses a "Yes"/"No"/true/false/1/0 style cell into a boolean, defaulting to false.
function parseBoolCell(value) {
  if (value === undefined || value === null || value === '') return false;
  const str = String(value).trim().toLowerCase();
  return ['yes', 'true', '1', 'y'].includes(str);
}

// POST /api/products/bulk-import - admin only. Accepts an .xlsx/.csv file,
// validates every row, inserts the valid ones, and returns a row-by-row
// report so a non-technical uploader can see exactly what to fix and
// re-upload only the failed rows rather than losing an entire batch.
router.post('/bulk-import', adminAuth, requirePermission('products:write'), (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'That file is too large (max 10MB).' });
      }
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    next();
  });
}, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided (expected a "file" form field).' });
  }

  let rows;
  try {
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  } catch (err) {
    return res.status(400).json({ error: 'Could not read that file. Make sure it is a valid .xlsx or .csv file.' });
  }

  if (rows.length === 0) {
    return res.status(400).json({ error: 'That sheet has no product rows in it.' });
  }
  if (rows.length > 2000) {
    return res.status(400).json({ error: 'That is more than 2000 rows in one file - split it into smaller batches.' });
  }

  const validProducts = [];
  const errors = [];
  const skusInThisFile = new Set();

  // Check which SKUs (non-empty ones) already exist, so re-running the same
  // file after a partial success doesn't create duplicates.
  const candidateSkus = rows.map((r) => String(r['SKU'] || '').trim()).filter(Boolean);
  const existingSkus = new Set(
    (await Product.find({ sku: { $in: candidateSkus } }).select('sku')).map((p) => p.sku)
  );

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +2: header row is row 1, data starts at row 2 in the spreadsheet
    const name = String(row['Name'] || '').trim();
    const priceRaw = row['Price'];
    const mainCategoryRaw = String(row['Main Category'] || '').trim();
    const sku = String(row['SKU'] || '').trim();

    if (!name) {
      errors.push({ row: rowNum, error: 'Missing Name' });
      return;
    }
    if (sku && (existingSkus.has(sku) || skusInThisFile.has(sku))) {
      errors.push({ row: rowNum, error: `SKU "${sku}" already exists - skipped to avoid a duplicate` });
      return;
    }
    const price = Number(priceRaw);
    if (!priceRaw || isNaN(price) || price <= 0) {
      errors.push({ row: rowNum, error: `Invalid Price ("${priceRaw}") - must be a number greater than 0` });
      return;
    }
    const matchedCategory = MAIN_CATEGORIES.find(
      (c) => c.toLowerCase() === mainCategoryRaw.toLowerCase()
    );
    if (!matchedCategory) {
      errors.push({ row: rowNum, error: `Invalid Main Category ("${mainCategoryRaw}") - must be exactly one of: ${MAIN_CATEGORIES.join(', ')}` });
      return;
    }

    if (sku) skusInThisFile.add(sku);
    const stock = Number(row['Stock']) || 0;
    const discount = Number(row['Discount (%)']) || 0;

    validProducts.push({
      name,
      description: String(row['Description'] || ''),
      price,
      mainCategory: matchedCategory,
      primeSubcategory: String(row['Prime Subcategory'] || ''),
      secondarySubcategory: String(row['Secondary Subcategory'] || ''),
      scented: parseBoolCell(row['Scented (Yes/No)']),
      size: String(row['Size'] || ''),
      material: String(row['Material'] || ''),
      numberOfItems: Math.max(1, Number(row['Number of Items']) || 1),
      volume: String(row['Capacity / Volume'] || row['Volume'] || ''),
      Weight: String(row['Weight'] || ''),
      stock,
      sku: String(row['SKU'] || ''),
      featured: parseBoolCell(row['Featured (Yes/No)']),
      trending: parseBoolCell(row['Trending (Yes/No)']),
      tags: String(row['Tags (comma separated)'] || '').split(',').map((t) => t.trim()).filter(Boolean),
      artisanInfo: String(row['Artisan Info'] || ''),
      discount,
      // No image yet - these get added in a second pass through the admin
      // dashboard's upload button, same as any product edit.
      image: '',
    });
  });

  let inserted = [];
  if (validProducts.length > 0) {
    try {
      inserted = await Product.insertMany(validProducts, { ordered: false });
    } catch (err) {
      // insertMany with ordered:false still inserts everything that succeeded
      // even if some documents failed - err.insertedDocs (older driver) or
      // err.result gives us what actually made it in either way.
      inserted = err.insertedDocs || [];
      if (err.writeErrors) {
        err.writeErrors.forEach((we) => {
          errors.push({ row: 'unknown', error: we.errmsg || 'Failed to save this product' });
        });
      }
    }
  }

  res.json({
    totalRows: rows.length,
    successCount: inserted.length,
    failCount: errors.length,
    errors,
  });
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