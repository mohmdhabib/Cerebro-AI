// src/components/shared/Button.jsx
import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  loading = false,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300";

  const variantStyles = {
    primary:
      "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-600 disabled:text-gray-400",
    secondary:
      "text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 focus:ring-blue-400 disabled:bg-gray-800 disabled:text-gray-500",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${
        loading || disabled ? "cursor-not-allowed opacity-75" : ""
      }`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  );
};

export default Button;

// src/components/shared/Spinner.jsx
