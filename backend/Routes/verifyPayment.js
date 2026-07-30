const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { sendSMS, sendWhatsApp } = require('./sendNotifications');
const Order = require("../models/order");
const User = require("../models/User"); // Fix capitalization

router.post('/', async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userDetails,
    firebaseUser, // Rename from user to firebaseUser to avoid conflict
  } = req.body;

  // console.log("Payment Verification Request:", {
  //   orderDetails: userDetails,
  //   firebase: firebaseUser
  // });

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      const { name, phone, amount, address, city, state, zip, country, items } = userDetails;

      // 1. Find or create user with error handling
      let dbUser;
      try {
        dbUser = await User.findOne({ uid: firebaseUser.uid });
        if (!dbUser) {
          dbUser = await User.create({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || name,
            email: firebaseUser.email,
            phone: phone,
            photo: firebaseUser.photoURL || null, // Ensure null if no photo
          });
        } else {
          // Update user info if needed
          await User.findByIdAndUpdate(dbUser._id, {
            name: firebaseUser.displayName || name,
            photo: firebaseUser.photoURL || dbUser.photo, // Keep existing photo if no new one
            phone: phone || dbUser.phone
          });
        }
      } catch (dbError) {
        console.error("Database Error (User):", dbError);
        throw new Error('Failed to process user data');
      }

      // 2. Create order with error handling
      let order;
      try {
        order = await Order.create({
          user: dbUser._id, // <-- Use MongoDB ObjectId, not Firebase UID
          name,
          phone,
          address,
          city,
          state,
          zip,
          country,
          items: items.map(item => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price
          })),
          totalAmount: amount,
          razorpay_order_id,
          razorpay_payment_id,
          paymentStatus: 'completed'
        });
      } catch (dbError) {
        console.error("Database Error (Order):", dbError);
        throw new Error('Failed to save order');
      }

      // Format amount to 2 decimal places
      const formattedAmount = Number(amount).toFixed(2);

      // User notifications
      const notificationResults = {
        sms: await sendSMS(
          phone,
          `Thank you ${name}! Your order of ₹${formattedAmount} has been confirmed. Order ID: ${razorpay_order_id}`
        ),
        whatsapp: await sendWhatsApp(
          phone,
          `🎉 *Order Confirmation*\n\nDear ${name},\n\nYour order has been successfully placed!\n\n*Amount:* ₹${formattedAmount}\n*Order ID:* ${razorpay_order_id}\n\nThank you for shopping with us! We'll keep you updated on your order status.`
        )
      };

      // Company notifications
      const companyPhone = process.env.COMPANY_PHONE?.replace(/^\+91/, '');
      if (companyPhone) {
        await sendWhatsApp(
          companyPhone,
          `🛍️ *New Order Alert!*\n\n*Customer:* ${name}\n*Phone:* ${phone}\n*Amount:* ₹${formattedAmount}\n*Order ID:* ${razorpay_order_id}`
        );
      }

      res.json({
        success: true,
        message: "Payment verified and order saved successfully",
        orderId: order._id,
        notifications: notificationResults
      });
    } catch (err) {
      console.error("Error processing payment:", err);
      res.status(500).json({
        success: false,
        message: "Payment verified but order processing failed",
        error: err.message
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid payment signature'
    });
  }
});

module.exports = router;
