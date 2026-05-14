import React, { useEffect } from 'react';
import { FiCheck, FiX, FiShoppingCart, FiHeart } from 'react-icons/fi';
import './Toast.css';

export default function Toast({ 
  isVisible, 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000 
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'cart':
        return <FiShoppingCart size={20} />;
      case 'wishlist':
        return <FiHeart size={20} />;
      case 'error':
        return <FiX size={20} />;
      case 'success':
      default:
        return <FiCheck size={20} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'cart':
        return '#4CAF50';
      case 'wishlist':
        return '#E91E63';
      case 'error':
        return '#F44336';
      case 'success':
      default:
        return '#4CAF50';
    }
  };

  return (
    <div 
      className="toast-notification"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        <div className="toast-message">
          {message}
        </div>
      </div>
      <button 
        className="toast-close" 
        onClick={onClose}
        aria-label="Close notification"
      >
        <FiX size={16} />
      </button>
    </div>
  );
}
