import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './NewPassword.css';
import PasswordResetSuccess from './PasswordResetSuccess';

const NewPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const emailParam = searchParams.get('email');
      const tokenParam = searchParams.get('token');

      // Check if email and token are present
      if (!emailParam || !tokenParam) {
        setError('Request failed. Invalid or missing parameters.');
        setIsVerifying(false);
        return;
      }

      setEmail(emailParam);
      setToken(tokenParam);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}auth/password/verify`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailParam,
            token: tokenParam,
          }),
        });

        const data = await response.json();
        console.log('Token verification response:', data);

        if (data.status === 'success') {
          setIsTokenValid(true);
          setError('');
        } else {
          setError(data.message || 'Token verification failed. Please try again.');
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setError('Network error. Please check your connection and try again.');
        setIsTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}auth/password/reset`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          email: email,
          password: formData.newPassword,
          password_confirmation: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      console.log('Password reset response:', data);

      if (data.status === 'success') {
        // Navigate to login page
        navigate('/auth');
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToForgotPassword = () => {
    navigate('/auth/forget-password');
  };

  // Show loading while verifying token
  if (isVerifying) {
    return (
      <div className="new-password-container">
        <div className="new-password-form">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Verifying your request...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token verification failed
  if (!isTokenValid) {
    return (
      <div className="new-password-container">
        <div className="new-password-form">
          <h1 className="new-password-title">Request Failed</h1>
          
          <div className="error-message">
            {error}
          </div>

          <button 
            onClick={handleGoToForgotPassword}
            className="login-button"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="new-password-container">
      <div className="new-password-form">
        <h1 className="new-password-title">New Password</h1>
        
        <p className="new-password-description">
          Set the new password for your account so you can login.
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="newPassword" className="input-label">
              New Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                className="password-input"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('newPassword')}
                disabled={isLoading}
              >
                {showNewPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className="password-input"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                disabled={isLoading}
              >
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Setting Password...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
