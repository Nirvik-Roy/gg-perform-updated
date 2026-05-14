import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import ForgotPasswordSuccess from './ForgotPasswordSuccess';

const ForgotPassword = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // For now, simulate API call - replace this with actual API integration
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}auth/password/forgot`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      console.log("data from forgot password", data);
      if (data.status === 'success') {
        setShowSuccess(true);
      } else {

        setError(data.message || 'Failed to send reset link. Please try again.');
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.log("Error from forgot password:", error);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate('/auth');
    }
  };

  if (showSuccess) {
    return <ForgotPasswordSuccess onBackToLogin={handleBackToLogin} email={email} />;
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h1 className="forgot-password-title">Forgot password</h1>

        <p className="forgot-password-description">
          Enter your email for the verification process, we will send you the link to reset password
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}



        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="email-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </form>

        <button
          className="back-to-login-link"
          onClick={handleBackToLogin}
          type="button"
        >
          <span className="back-arrow">←</span>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
