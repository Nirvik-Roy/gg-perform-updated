// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const EmailVerificationFailed = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const reason = params.get('reason');

//   return (
//     <div style={{ maxWidth: 600, margin: '60px auto', padding: '20px', textAlign: 'center' }}>
//       <h2 style={{ marginBottom: 10 }}>Email verification failed</h2>
//       <p>{reason ? reason.replaceAll('_', ' ') : 'Invalid or expired verification link.'}</p>
//       <button
//         type="button"
//         onClick={() => navigate('/auth')}
//         style={{ marginTop: 30, padding: '10px 16px', cursor: 'pointer' }}
//       >
//         Go to Login
//       </button>
//     </div>
//   );
// };

// export default EmailVerificationFailed;


import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerificationFailed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const reason = params.get("reason");

  // Temporary handler for resend click
  const handleResend = () => {
    alert("Verification email has been resent! Please check your inbox.");
    // 🔹 Later you can integrate an actual API call here, e.g.:
    // axios.post('/api/auth/resend-verification', { email })
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <div className="icon-container">
          <div className="error-icon">
            <div className="error-circle"></div>
            <div className="error-cross"></div>
          </div>
        </div>

        <h2 className="title error">❌ Email Verification Failed</h2>
        <p className="subtitle">
          {reason
            ? reason.replaceAll("_", " ")
            : "Invalid or expired verification link."}
        </p>
        <p className="note">
          Please try verifying again or request a new verification email.
        </p>

        <div className="button-group">
          <button className="btn resend" onClick={handleResend}>
            🔄 Resend Verification Email
          </button>
          {/* <button className="btn" onClick={() => navigate("/auth")}>
            Go to Login
          </button> */}
        </div>
      </div>

      <style>{`
        .verify-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 90vh;
          // background: linear-gradient(135deg, #ffebee, #fff3e0);
          font-family: 'Poppins', sans-serif;
        }

        .verify-box {
          background: #fff;
          padding: 40px 50px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeIn 1s ease-in-out;
          max-width: 520px;
        }

        .title {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }

        .title.error {
          color: #c62828;
        }

        .subtitle {
          font-size: 1rem;
          color: #555;
          margin-bottom: 20px;
        }

        .note {
          font-size: 0.9rem;
          color: #777;
          margin-bottom: 30px;
        }

        .button-group {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        .btn {
          background-color: #c62828;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: 0.3s ease;
        }

        .btn:hover {
          background-color: #b71c1c;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(198, 40, 40, 0.3);
        }

        .btn.resend {
          background-color: #ef6c00;
        }

        .btn.resend:hover {
          background-color: #e65100;
          box-shadow: 0 4px 10px rgba(239, 108, 0, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Error icon animation */
        .icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 25px;
        }

        .error-icon {
          position: relative;
          width: 80px;
          height: 80px;
          animation: pop 0.6s ease-out;
        }

        .error-circle {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #ffcdd2;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .error-cross {
          position: absolute;
          width: 50px;
          height: 6px;
          background: #c62828;
          top: 37px;
          left: 15px;
          transform: rotate(45deg);
          animation: crossAppear 0.6s ease forwards;
        }

        .error-cross::after {
          content: '';
          position: absolute;
          width: 50px;
          height: 6px;
          background: #c62828;
          transform: rotate(-90deg);
          top: 0;
          left: 0;
        }

        @keyframes pop {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes crossAppear {
          from { opacity: 0; transform: rotate(45deg) scale(0.8); }
          to { opacity: 1; transform: rotate(45deg) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationFailed;
