import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PasswordResetSuccess.css';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/auth');
  };

  return (
    <div className="password-reset-success-container">
      <div className="password-reset-success-form">
        <div className="success-icon">
          ✓
        </div>
        
        <h1 className="success-title">Successful</h1>
        
        <p className="success-description">
          Your password has been reset successfully
        </p>

        <button 
          className="continue-button"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
