import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

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
