const express = require('express');
const Razorpay = require('razorpay');
const User = require('../models/User');
require('dotenv').config();

const router = express.Router();

// Validate environment variables
const keyId = process.env.RAZORPAY_KEY_ID?.trim();
const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

// Better validation
if (!keyId || !keySecret) {
  throw new Error('Razorpay credentials are missing or invalid in .env file');
}

// Initialize Razorpay with logging
const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

// Test Razorpay connection
razorpay.orders.all()
  .then(() => console.log('✅ Razorpay connection successful'))
  .catch(err => console.error('❌ Razorpay connection failed:', err.message));

router.post('/', async (req, res) => {
  const { amount } = req.body;

  // console.log("Firebase UID:", firebaseUid);
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    console.log('Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order);

    res.json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    
    // More detailed error response
    res.status(error.statusCode || 500).json({
      error: 'Failed to create order',
      details: error.error?.description || error.message,
      code: error.error?.code
    });
  }
});

module.exports = router;
