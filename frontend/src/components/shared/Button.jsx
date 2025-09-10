// src/components/shared/Button.jsx
import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, loading = false, variant = 'primary', fullWidth = false, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
};

export default Button;

// src/components/shared/Spinner.jsx
