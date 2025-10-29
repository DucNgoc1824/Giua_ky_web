import React from 'react';
import '../assets/LoadingSpinner.css';

export const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
