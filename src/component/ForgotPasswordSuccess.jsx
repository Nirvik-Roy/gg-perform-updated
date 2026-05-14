import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordSuccess.css';

const ForgotPasswordSuccess = ({ onBackToLogin, email }) => {
  const navigate = useNavigate();

  const handleSetNewPassword = () => {
    // navigate('/new-password');
  };

  return (
    <div className="forgot-password-success-container">
      <div className="forgot-password-success-form">
        <div className="success-icon">
          ✓
        </div>
        
        <h1 className="success-title">Check your email</h1>
        
        <p className="success-description">
          We have sent a password reset link to
        </p>
        
        <p className="email-display">
          {email}
        </p>
        
        <p className="success-instructions">
          Click the link in the email to reset your password. If you don't see the email, check your spam folder.
        </p>

        <div className="action-buttons">
          <button 
            className="resend-button"
            onClick={() => {
              // This will be integrated with API in the future
              navigate('/auth/forgot-password');
            }}
          >
            Resend Email
          </button>
          
          {/* <button 
            className="set-new-password-button"
            onClick={handleSetNewPassword}
          >
            Set New Password
          </button> */}
          
          <button 
            className="back-to-login-button"
            onClick={onBackToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSuccess;
