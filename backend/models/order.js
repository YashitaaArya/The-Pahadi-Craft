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
      image: String,
      quantity: Number,
      price: Number,
      selectedColorVariant: {
        colorName: String,
        hexCode: String,
        sku: String
      },
      selectedFragranceVariant: {
        fragranceName: String,
        sku: String
      }
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
    enum: ['pending', 'processing', 'dispatched', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: { type: String, default: '' },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'processing', 'dispatched', 'shipped', 'delivered', 'cancelled']
    },
    changedAt: { type: Date, default: Date.now }
  }],
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
