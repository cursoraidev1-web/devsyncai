'use client';

import { ToastContainer } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

export default function ThemeAwareToast() {
  const { effectiveTheme } = useTheme();
  
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
    />
  );
}

