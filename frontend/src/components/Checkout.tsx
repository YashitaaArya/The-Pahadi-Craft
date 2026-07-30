import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Checkout: React.FC = () => {
  const { items, getTotal, clearCart, toggleCart } = useCartStore();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Load Razorpay script once
  useEffect(() => {
    const scriptId = 'razorpay-script';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const amount = getTotal();

    if (amount <= 0) {
      alert('Cart is empty');
      return;
    }

    if (!isAuthenticated || !user) {
      toggleCart();
      navigate('/auth');
      return;
    }

    if (!user?.uid) {
      alert('Authentication required');
      navigate('/auth');
      return;
    }

    setIsPaying(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-order`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ 
          amount: getTotal(),
        }),
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        let errorMsg = 'Failed to create order. Please try again later.';
        if (contentType && contentType.includes('application/json')) {
          const error = await res.json();
          errorMsg = error.message || errorMsg;
        } else {
          const text = await res.text();
          errorMsg = `Server error: ${text.slice(0, 100)}`;
        }
        throw new Error(errorMsg);
      }

      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Unexpected response from server: ${text.slice(0, 100)}`);
      }

      const orderData = await res.json();

      if (!window.Razorpay) {
        throw new Error('Payment system not ready. Please refresh the page.');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        userDetails: orderData.firebaseUser,
        name: 'Pahadi Craft',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                firebaseUser: user,
                userDetails: {
                  ...form,
                  amount: getTotal(),
                  items: items
                }
              }),
              credentials: 'include',
            });

            const verifyContentType = verifyRes.headers.get('content-type');
            if (!verifyRes.ok) {
              let errorMsg = 'Payment verification failed';
              if (verifyContentType && verifyContentType.includes('application/json')) {
                const error = await verifyRes.json();
                errorMsg = error.message || errorMsg;
              } else {
                const text = await verifyRes.text();
                errorMsg = `Server error: ${text.slice(0, 100)}`;
              }
              throw new Error(errorMsg);
            }

            if (!verifyContentType || !verifyContentType.includes('application/json')) {
              const text = await verifyRes.text();
              throw new Error(`Unexpected response from server: ${text.slice(0, 100)}`);
            }

            const result = await verifyRes.json();
            if (result.success) {
              alert('✅ Payment Successful');
              clearCart();
              setSubmitted(true);
            } else {
              throw new Error(result.message || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            alert(`❌ ${error.message}`);
          }
        },
        theme: { color: '#C9A66B' },
        prefill: {
          name: user.displayName || form.name || 'Customer',
          email: user.email || '',
          contact: user.phoneNumber || form.phone || '',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(`Checkout failed: ${err.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Optionally validate form here
    handlePayment();
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <p>Your cart is empty.</p>
          <button className="mt-4 px-4 py-2 bg-[#C9A66B] text-white rounded" onClick={() => navigate('/shop')}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow text-center">
          <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Thank you for your order!</h2>
          <p>We have received your details and will process your order soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F2]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-[#5A4232] mb-6">Checkout</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow space-y-6">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              type="tel"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">ZIP Code</label>
              <input
                name="zip"
                value={form.zip}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
                disabled
              />
            </div>
          </div>
          <div className="border-t pt-4">
            <h2 className="font-serif text-lg mb-2">Order Summary</h2>
            <ul className="mb-2">
              {items.map((item) => (
                <li key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#C9A66B] text-white py-3 rounded hover:bg-[#5A4232] transition-colors"
            disabled={isPaying}
          >
            {isPaying ? 'Processing Payment...' : 'Place Order & Pay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

