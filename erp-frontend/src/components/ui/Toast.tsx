// src/components/ui/Toast.tsx
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import type { ToastOptions } from 'react-hot-toast';

// Custom toast functions with Arabic support and consistent styling
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: 4000,
      position: 'bottom-center',
      style: {
        background: '#10B981',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        direction: 'rtl',
        textAlign: 'right',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#10B981',
      },
      ...options,
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: 6000,
      position: 'bottom-center',
      style: {
        background: '#EF4444',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        direction: 'rtl',
        textAlign: 'right',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#EF4444',
      },
      ...options,
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: 4000,
      position: 'bottom-center',
      icon: 'ℹ️',
      style: {
        background: '#3B82F6',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        direction: 'rtl',
        textAlign: 'right',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      ...options,
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast(message, {
      duration: 5000,
      position: 'bottom-center',
      icon: '⚠️',
      style: {
        background: '#F59E0B',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        direction: 'rtl',
        textAlign: 'right',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      ...options,
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    return toast.loading(message, {
      position: 'bottom-center',
      style: {
        background: '#6B7280',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        direction: 'rtl',
        textAlign: 'right',
        borderRadius: '8px',
        padding: '12px 16px',
      },
      ...options,
    });
  },
};

// Enhanced Toaster component with Arabic support
export const AppToaster: React.FC = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          direction: 'rtl',
          textAlign: 'right',
        },
      }}
    />
  );
};