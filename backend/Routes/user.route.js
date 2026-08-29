const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user on login or profile update
router.post('/save', async (req, res) => {
  try {
    const { uid, email, name, photo, phone, street, city, state, pincode } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ success: false, message: 'uid and email are required' });
    }

    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({
        uid,
        email,
        name: name || '',
        photo: photo || '',
        phone: phone || '',
        address: {
          street: street || '',
          city: city || '',
          state: state || '',
          pincode: pincode || ''
        },
        lastLogin: new Date(),
      });
    } else {
      user = await User.findByIdAndUpdate(
        user._id,
        {
          email,
          name: name || user.name,
          photo: photo || user.photo,
          // Only overwrite phone/address if new values were actually sent -
          // a plain sign-in (no form data) shouldn't blank out what a
          // previous sign-up already collected.
          phone: phone || user.phone,
          address: {
            street: street || user.address?.street,
            city: city || user.address?.city,
            state: state || user.address?.state,
            pincode: pincode || user.address?.pincode
          },
          lastLogin: new Date(),
        },
        { new: true }
      );
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ success: false, message: 'Server error while saving user' });
  }
});

// GET /api/user/liked-products?uid=xxx - returns the list of product ids this customer has liked
router.get('/liked-products', async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: 'uid is required' });
    const user = await User.findOne({ uid });
    res.json({ likedProducts: user?.likedProducts || [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch liked products' });
  }
});

// POST /api/user/liked-products/toggle - requires uid + productId, toggles the like
router.post('/liked-products/toggle', async (req, res) => {
  try {
    const { uid, productId } = req.body;
    if (!uid || !productId) {
      return res.status(400).json({ error: 'uid and productId are required' });
    }
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'Sign in to like products.' });

    const alreadyLiked = user.likedProducts.includes(productId);
    if (alreadyLiked) {
      user.likedProducts = user.likedProducts.filter((id) => id !== productId);
    } else {
      user.likedProducts.push(productId);
    }
    await user.save();
    res.json({ liked: !alreadyLiked, likedProducts: user.likedProducts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update liked products' });
  }
});

module.exports = router;