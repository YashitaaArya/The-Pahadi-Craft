import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

export { toast };

export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
          },
          icon: '✅',
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
          },
          icon: '❌',
        },
      }}
    />
  );
};

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showInfo = (message: string) => {
  toast((t) => (
    <span style={{ color: '#3b82f6' }}>{message}</span>
  ), {
    style: {
      background: '#e0f2fe',
    },
  });
};

export const showWarning = (message: string) => {
  toast((t) => (
    <span style={{ color: '#f59e0b' }}>{message}</span>
  ), {
    style: {
      background: '#fef3c7',
    },
  });
};

// Custom cart notification with brand colors
export const showCartNotification = (productName?: string) => {
  toast.custom((t) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
        t.visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, #5A4232 0%, #6B5344 100%)',
        color: '#FFF8F2',
        boxShadow: '0 10px 25px rgba(90, 66, 50, 0.3)',
      }}
    >
      <ShoppingCart className="w-5 h-5 flex-shrink-0" style={{ color: '#C9A66B' }} />
      <div className="flex-1">
        <p className="font-semibold text-sm">Item added to your cart!</p>
        <p className="text-xs opacity-90 mt-0.5">Happy Shopping! 🎉</p>
      </div>
    </div>
  ), {
    duration: 3000,
    style: {
      background: 'transparent',
      boxShadow: 'none',
      padding: 0,
    },
  });
};
