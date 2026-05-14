import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, message = "You need to be logged in to add items to your cart." }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/auth');
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleCancel}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-content">
          <h3>Login Required</h3>
          <p>{message}</p>
          <div className="auth-modal-buttons">
            <button className="auth-modal-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="auth-modal-login" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
