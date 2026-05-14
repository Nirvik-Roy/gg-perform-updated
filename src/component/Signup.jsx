import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = ({ onSubmit, switchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log("formData", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Registration successful
        console.log("Registration successful:", data);
        navigate('/email-verification-sent');
      } else {
        // Registration failed
        setError(data.message || 'Registration failed. Please try again.');
        console.log("Registration failed:", data);
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.log("error from signup", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="signup-form"
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

      <div className="name-row">
        <div className="name-field">
          <label className="s-label">
            First Name <span className="required">*</span>
          </label>
          <input
            type="text"
            required
            className="input"
            placeholder="Enter your first name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="name-field">
          <label className="s-label">
            Last Name <span className="required">*</span>
          </label>
          <input
            type="text"
            required
            className="input"
            placeholder="Enter your last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="contact-row">
        <div className="contact-field">
          <label className="s-label">
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
        <div className="contact-field">
          <label className="s-label">
            Phone <span className="required">*</span>
          </label>
          <input
            type="tel"
            required
            className="input"
            placeholder="Enter your phone number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="s-label">
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

      <div>
        <label className="s-label">
          Confirm Password <span className="required">*</span>
        </label>
        <input
          type="password"
          required
          className="input"
          placeholder="Confirm your password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="signup-button"
        disabled={isLoading}
        style={{
          opacity: isLoading ? 0.7 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Registering...' : 'Proceed'}
      </button>

      <p className="login-link">
        Already have an account?{' '}
        <span
          onClick={isLoading ? null : switchToLogin}
          className="login-text"
          style={{
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1
          }}
        >
          Login
        </span>
      </p>
    </form>
  );
};

export default Signup;
