import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanner } from '../../../context/BannerContext';
import './MyProfile.css';

function MyProfile() {
  const navigate = useNavigate();
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [userData, setUserData] = useState({
    name: 'Bidisha Bhowmick',
    email: 'shallamb@gmail.com',
    phone: '+1 (234) 464-0600',
    profileImage: '/pp1.png' // Using existing profile image from public folder
  });

  const [changePasswordData, setChangePasswordData] = useState({
    newPassword: '',
    confirmNewPassword: '',
    currentPassword: ''
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false
  });

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
        setUserData(prevData => ({
          ...prevData,
          name: user.name || prevData.name,
          email: user.email || prevData.email,
          phone: user.phone || prevData.phone
        }));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleEditProfile = () => {
    navigate('/MyAccount/edit-profile');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!changePasswordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!changePasswordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (changePasswordData.newPassword.length < 8) {
      newErrors.newPassword = 'New password must be at least 8 characters';
    }
    
    if (!changePasswordData.confirmNewPassword.trim()) {
      newErrors.confirmNewPassword = 'Please confirm your new password';
    } else if (changePasswordData.newPassword !== changePasswordData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async () => {
    // Clear previous errors
    setErrors({});
    setApiError('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/profile/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          current_password: changePasswordData.currentPassword,
          new_password: changePasswordData.newPassword,
          new_password_confirmation: changePasswordData.confirmNewPassword
        })
      });
      
      const data = await response.json();
      console.log("data from change password", data);
      
      if (data.status === "success") {
        setShowChangePassword(false);
        setChangePasswordData({
          newPassword: '',
          confirmNewPassword: '',
          currentPassword: ''
        });
        setShowPasswords({
          currentPassword: false,
          newPassword: false,
          confirmNewPassword: false
        });
        setErrors({});
        setApiError('');
      } else {
        // Handle API errors
        if (data.errors) {
          const apiErrors = {};
          Object.keys(data.errors).forEach(key => {
            if (key === 'current_password') {
              apiErrors.currentPassword = data.errors[key][0];
            } else if (key === 'new_password') {
              apiErrors.newPassword = data.errors[key][0];
            } else if (key === 'new_password_confirmation') {
              apiErrors.confirmNewPassword = data.errors[key][0];
            }
          });
          setErrors(apiErrors);
        } else {
          setApiError(data.message || 'An error occurred while changing password');
        }
      }
    } catch (error) {
      console.log("error from change password", error);
      setApiError('Network error. Please try again.');
    }
  };

  const closeModal = () => {
    setShowChangePassword(false);
    setChangePasswordData({
      newPassword: '',
      confirmNewPassword: '',
      currentPassword: ''
    });
    setShowPasswords({
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false
    });
    setErrors({});
    setApiError('');
  };


  return (
    <div className="my-profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <div className="profile-actions">
          <button
            className="change-password-btn"
            onClick={() => setShowChangePassword(true)}
          >
            Change Password
          </button>
          <button
            className="edit-profile-btn"
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-picture-section">
          <div className="profile-picture">
            <img src="/pro.png" alt="Profile" />
          </div>
        </div>

        <div className="profile-info-section">
          <div className="info-item">
            <label>Name:</label>
            <span>{userData.name}</span>
          </div>

          <div className="info-item">
            <label>Email:</label>
            <span>{userData.email}</span>
          </div>

          <div className="info-item">
            <label>Phone:</label>
            <span>{userData.phone}</span>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal-overlay">
          <div className="change-password-modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button
                className="close-modal"
                onClick={closeModal}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              {apiError && (
                <div className="error-message">
                  {apiError}
                </div>
              )}
              
              <div className="modal-form-group">
                <label>Current Password:</label>
                <div className="password-input-container">
                  <input 
                    type={showPasswords.currentPassword ? "text" : "password"} 
                    placeholder="Enter current password" 
                    value={changePasswordData.currentPassword} 
                    onChange={(e) => setChangePasswordData({ ...changePasswordData, currentPassword: e.target.value })} 
                    className={errors.currentPassword ? 'error-input' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                  >
                    {showPasswords.currentPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.currentPassword && (
                  <span className="error-text">{errors.currentPassword}</span>
                )}
              </div>
              
              <div className="modal-form-group">
                <label>New Password:</label>
                <div className="password-input-container">
                  <input 
                    type={showPasswords.newPassword ? "text" : "password"} 
                    placeholder="Enter new password" 
                    value={changePasswordData.newPassword} 
                    onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })} 
                    className={errors.newPassword ? 'error-input' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('newPassword')}
                  >
                    {showPasswords.newPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="error-text">{errors.newPassword}</span>
                )}
              </div>
              
              <div className="modal-form-group">
                <label>Confirm New Password:</label>
                <div className="password-input-container">
                  <input 
                    type={showPasswords.confirmNewPassword ? "text" : "password"} 
                    placeholder="Confirm new password" 
                    value={changePasswordData.confirmNewPassword} 
                    onChange={(e) => setChangePasswordData({ ...changePasswordData, confirmNewPassword: e.target.value })} 
                    className={errors.confirmNewPassword ? 'error-input' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirmNewPassword')}
                  >
                    {showPasswords.confirmNewPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmNewPassword && (
                  <span className="error-text">{errors.confirmNewPassword}</span>
                )}
              </div>
              
              <div className="modal-actions">
                <button
                  className="save-btn"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
                <button
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyProfile;
