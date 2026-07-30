// Run this once after connecting your MongoDB Atlas database to create your
// first admin login and a few sample products so the store isn't empty.
//
// Usage:
//   node scripts/seed.js
//
// Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env if present,
// otherwise falls back to the defaults below (change your password after first login).

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const Product = require('../models/Product');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@thepahadicraft.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe@123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Super Admin';

const sampleProducts = [
  {
    name: 'Himachali Saffron Candle',
    description: 'A hand-poured saffron candle infused with natural Himalayan fragrance.',
    price: 899,
    image: 'https://via.placeholder.com/300x300?text=Saffron+Candle',
    category: 'Candles',
    subcategory: 'Premium',
    stock: 28,
    sku: 'CND-001',
    featured: true,
    trending: true,
    ratings: 4.8,
    reviewCount: 34,
    orderCount: 112,
    tags: ['handmade', 'himachali', 'saffron'],
    artisanInfo: 'Crafted by local artisans from Kullu.',
    discount: 10,
  },
  {
    name: 'Terracotta Oil Lamp',
    description: 'Traditional terracotta lamp designed for festive home decor.',
    price: 549,
    image: 'https://via.placeholder.com/300x300?text=Terracotta+Lamp',
    category: 'Terracotta',
    subcategory: 'Lamps',
    stock: 18,
    sku: 'TRC-002',
    featured: false,
    trending: true,
    ratings: 4.6,
    reviewCount: 21,
    orderCount: 68,
    tags: ['terracotta', 'festival', 'decor'],
    artisanInfo: 'Made by artisans from the Himachal valleys.',
    discount: 5,
  },
  {
    name: 'Himalayan Soap Bar',
    description: 'Natural handmade soap with Himalayan herbs and essential oils.',
    price: 299,
    image: 'https://via.placeholder.com/300x300?text=Soap+Bar',
    category: 'Soaps',
    subcategory: 'Handmade',
    stock: 42,
    sku: 'SOAP-003',
    featured: true,
    trending: false,
    ratings: 4.9,
    reviewCount: 18,
    orderCount: 75,
    tags: ['natural', 'herbal', 'artisan'],
    artisanInfo: 'Made by hand in the foothills of Himachal.',
    discount: 0,
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not set in .env. Add it before running the seed script.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existingAdmin = await AdminUser.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existingAdmin) {
    console.log(`ℹ️  Admin user ${ADMIN_EMAIL} already exists, skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await AdminUser.create({
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      name: ADMIN_NAME,
      adminRole: 'super-admin',
      permissions: ['all'],
    });
    console.log(`✅ Created admin user: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log('   ⚠️  Log in and change this password, or set ADMIN_PASSWORD in .env before seeding.');
  }

  const productCount = await Product.countDocuments();
  if (productCount > 0) {
    console.log(`ℹ️  ${productCount} product(s) already exist, skipping sample product seed.`);
  } else {
    await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${sampleProducts.length} sample products.`);
  }

  await mongoose.disconnect();
  console.log('✅ Done. You can now log in to the admin dashboard.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
