import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaSave, FaTimes } from 'react-icons/fa';
import { useBanner } from '../../../context/BannerContext';
import './EditProfile.css';

function EditProfile() {
  const navigate = useNavigate();
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [formData, setFormData] = useState({
    firstName: 'Bidisha',
    lastName: 'Bhowmick',
    email: 'bidishab@gmail.com',
    phone: '1234567890',
    countryCode: '+1'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setBannerTitle("My Account");
    setBreadcrumb("My Account");
    setBannerImage("/other-banner.png");
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);

  // Load user data from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('gg website user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Split full name into first and last name
        const nameParts = (user.name || 'Bidisha Bhowmick').split(' ');
        setFormData({
          firstName: nameParts[0] || 'Bidisha',
          lastName: nameParts.slice(1).join(' ') || 'Bhowmick',
          email: user.email || 'bidishab@gmail.com',
          phone: user.phone ? user.phone.replace(/\D/g, '') : '1234567890',
          countryCode: user.phone ? user.phone.match(/^\+\d+/)?.[0] || '+1' : '+1'
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: `${formData.countryCode} ${formData.phone}`,
        })
      })

      const data = await response.json();
      console.log("data from update profile", data);

      if (data.status === "success") {
        // Save to localStorage
        const storedUser = localStorage.getItem('gg website user');
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            const updatedUser = {
              ...user,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: `${formData.countryCode} ${formData.phone}`
            };
            localStorage.setItem('gg website user', JSON.stringify(updatedUser));
          } catch (error) {
            console.error('Error updating user data:', error);
          }
        }

        // Navigate back to profile page
        navigate('/MyAccount/profile');
      }
    }
    else {
      console.log("form is not valid");
    }
  };

  const handleCancel = () => {
    navigate('/MyAccount/profile');
  };

  const countryCodes = [
    { code: '+1', country: 'US/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'India' },
    { code: '+61', country: 'Australia' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' }
  ];

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <button className="switch-back-button" onClick={() => navigate('/MyAccount/profile')}>
          {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg> */}
          {/* <FaArrowLeft /> */}
          <img src="/arrow.png" alt="" />
          Edit Profile
        </button>
      </div>

      <div className="edit-profile-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">
              First Name<span className="edit-profile-required">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={errors.firstName ? 'error' : ''}
              placeholder="Enter first name"
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">
              Last Name<span className="edit-profile-required">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={errors.lastName ? 'error' : ''}
              placeholder="Enter last name"
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">
              Email<span className="edit-profile-required">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`${errors.email ? 'error' : ''} disabled`}
              placeholder="Enter email"
              disabled
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              Phone<span className="edit-profile-required">*</span>
            </label>
            <div className="phone-input-group">
              <select
                value={formData.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                className="country-code-select"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
