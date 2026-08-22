const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const createOrder = require('./Routes/createOrder');
const verifyPayment = require('./Routes/verifyPayment');
const orders = require('./Routes/orders');
const userRoute = require('./Routes/user.route');
const products = require('./Routes/products');
const admin = require('./Routes/admin');
const adminData = require('./Routes/adminData');
const upload = require('./Routes/upload');
const newsletter = require('./Routes/newsletter');
const collections = require('./Routes/collections');
const contact = require('./Routes/contact');
const press = require('./Routes/press');
const aboutContent = require('./Routes/about');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const app = express();

const allowedOrigins = new Set([
  'https://thepahadicraft.com',
  'https://www.thepahadicraft.com',
  'http://localhost:5173',
]);
if (process.env.EXTRA_CORS_ORIGIN) {
  process.env.EXTRA_CORS_ORIGIN
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
    .forEach((origin) => allowedOrigins.add(origin));
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/create-order', createOrder);
app.use('/api/verify-payment', verifyPayment);
app.use('/api/orders', orders);
app.use('/api/user', userRoute);
app.use('/api/products', products);
app.use('/api/admin', admin);
app.use('/api/upload', upload);
app.use('/api/newsletter', newsletter);
app.use('/api/collections', collections);
app.use('/api/contact', contact);
app.use('/api/press', press);
app.use('/api/about', aboutContent);
app.use('/api', adminData); // /api/analytics, /api/users, /api/reviews, /api/testimonials, /api/feedback, /api/banners

app.get('/', (req, res) => {
  res.send('Welcome to the Pahadi Craft API');
});

// Error handling middleware - must be registered AFTER routes to actually catch errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});