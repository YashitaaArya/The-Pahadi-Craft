const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  // Not required at schema level anymore - Google sign-in doesn't collect a
  // phone number, and we still want a customer record created even with
  // partial info rather than the save silently failing.
  phone: { type: String, default: '' },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  photo: String,
  // Lets you segment "active in the last N days" for promotions later.
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);