const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  // Order fulfillment status - separate from payment status, used by the admin dashboard
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema);
