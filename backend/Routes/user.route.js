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
        }
      });
    } else {
      user = await User.findByIdAndUpdate(
        user._id,
        {
          email,
          name: name || user.name,
          photo: photo || user.photo,
          phone: phone || user.phone,
          address: {
            street: street || user.address?.street,
            city: city || user.address?.city,
            state: state || user.address?.state,
            pincode: pincode || user.address?.pincode
          }
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

module.exports = router;
