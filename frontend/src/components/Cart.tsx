import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getDriveImage } from '../utils/driveImage';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    items,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    getTotal,
    clearCart,
  } = useCartStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Calculate subtotal (original amount without GST)
  const getSubtotal = () => {
    return items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
  };

  // Calculate GST amount (5% of subtotal)
  const getGST = () => {
    return getSubtotal() * 0.05;
  };

  // ✅ Load Razorpay script once
  useEffect(() => {
    const scriptId = 'razorpay-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toggleCart();
      navigate('/auth');
      return;
    }
    setIsLoading(true);
    toggleCart();
    navigate('/checkout');
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#5A4232]" />
                <h2 className="text-xl font-serif text-[#5A4232]">Your Cart</h2>
              </div>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-[#F5E9DA] rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#5A4232]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 bg-white rounded-lg p-4 shadow-sm"
                    >
                      <img
                        src={getDriveImage(item.product.image)}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-serif text-[#5A4232]">{item.product.name}</h3>
                        <p className="text-[#C9A66B] font-semibold">
                          ₹{item.product.price}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-[#F5E9DA] rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#5A4232]" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-[#F5E9DA] rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#5A4232]" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto p-1 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm text-gray-600">
                      ₹{getSubtotal().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GST (5%)</span>
                    <span className="text-sm text-gray-600">
                      ₹{getGST().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-serif text-[#5A4232]">Total</span>
                    <span className="font-semibold text-[#5A4232]">
                      ₹{getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-[#C9A66B] text-white py-3 rounded-full hover:bg-[#5A4232] transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Checkout'}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-red-100 text-red-700 py-2 rounded-full hover:bg-red-200 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;