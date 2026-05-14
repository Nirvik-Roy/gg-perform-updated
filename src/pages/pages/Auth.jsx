import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Login from '../../component/Login';
import Signup from '../../component/Signup';
import './Auth.css'; // Import the CSS for styling
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const route = location?.state ? location?.state?.route : '/home';

  const handleLogin = () => {
    localStorage.setItem('token', 'dummy_token');
    navigate('/MyAccount');
  };

  return (
    <div className="auth-container">
      <div className="auth-tab-bar">
        <button
          className={`auth-tab ${isLogin ? 'active' : 'inactive'}`}
          onClick={() => setIsLogin(true)}
        >
          Log In
        </button>
        <button
          className={`auth-tab ${!isLogin ? 'active' : 'inactive'}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>

        {/* <span
          className={`auth-tab-indicator ${isLogin ? 'left' : 'right'}`}
        /> */}
      </div>

      <div className="auth-form-slider-wrapper">
        <div
          className={`auth-form-slider ${isLogin ? 'slide-login' : 'slide-register'}`}
        >
          <div className="auth-form">
            <Login switchToRegister={() => setIsLogin(false)} route={route} />
          </div>
          <div className="auth-form">
            <Signup switchToLogin={() => setIsLogin(true)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
