import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

const Login = ({ onSubmit, switchToRegister, route }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    setIsLoading(true);
    setError('');

    try {
      const dataToSend = new FormData();
      dataToSend.append('email', formData.email);
      dataToSend.append('password', formData.password);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: dataToSend,
      });
      const data = await response.json();
      console.log("data from login", data);
      
      if (data.status === 'success') {
        console.log("data token", data.data.token);
        console.log("data user", data.data.user);
        localStorage.setItem('gg website token', JSON.stringify(data.data.token));
        localStorage.setItem('gg website user', JSON.stringify(data.data.user));
        setTimeout(() => {
          navigate(route);
        }, 500);
      } else {
        // Login failed
        setError(data.message || 'Login failed. Please check your credentials.');
        console.log("Login failed:", data);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.log("error from login", error);
    } finally {
      setIsLoading(false);
      setFormData({
        email: '',
        password: '',
      });
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px',
          border: '1px solid #ff9999'
        }}>
          {error}
        </div>
      )}

      <div>
        <label className="m-label">
          Email <span className="required">*</span>
        </label>
        <input
          type="email"
          required
          className="input"
          placeholder="Enter your email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>
      <div>
        <label className="m-label">
          Password <span className="required">*</span>
        </label>
        <input
          type="password"
          required
          className="input"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <button 
        type="submit" 
        className="login-button"
        disabled={isLoading}
        style={{ 
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>

      <p className="forgot-password" onClick={() => navigate(`forgot-password`)}>
        Forget your password?
      </p>
    </form>
  );
};

export default Login;
