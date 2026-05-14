// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const EmailVerificationSent = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Optionally, we could show this page indefinitely until user checks email
//     // No auto-redirect here; user needs to click the email link
//   }, []);

//   return (
//     <div style={{ maxWidth: 600, margin: '60px auto', padding: '20px', textAlign: 'center' }}>
//       <h2 style={{ marginBottom: 10 }}>Verification email sent</h2>
//       <p>Please check your inbox and click the verification link to activate your account.</p>
//       <p style={{ marginTop: 20 }}>Didn't receive an email? Check your spam folder.</p>
//       <button
//         type="button"
//         onClick={() => navigate('/auth')}
//         style={{ marginTop: 30, padding: '10px 16px', cursor: 'pointer' }}
//       >
//         Back to Login
//       </button>
//     </div>
//   );
// };

// export default EmailVerificationSent;


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerificationSent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally keep this static until user checks email
  }, []);

  return (
    <div className="verify-container">
      <div className="verify-box">
        <div className="icon-container">
          <div className="envelope">
            <div className="envelope-top"></div>
            <div className="envelope-bottom"></div>
            <div className="letter"></div>
          </div>
        </div>

        <h2 className="title">📧 Verification Email Sent</h2>
        <p className="subtitle">
          Please check your inbox and click the verification link to activate your account.
        </p>
        <p className="note">Didn’t receive an email? Check your spam folder.</p>

        <button className="btn" onClick={() => navigate("/auth")}>
          Back to Login
        </button>
      </div>

      <style>{`
        .verify-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 90vh;
          // background: linear-gradient(135deg, #e3f2fd, #f1f8e9);
          font-family: 'Poppins', sans-serif;
        }

        .verify-box {
          background: #fff;
          padding: 40px 50px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          animation: fadeIn 1s ease-in-out;
          max-width: 500px;
        }

        .title {
          font-size: 1.8rem;
          color: #1565c0;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1rem;
          color: #555;
          margin-bottom: 20px;
        }

        .note {
          font-size: 0.9rem;
          color: #777;
          margin-bottom: 25px;
        }

        .btn {
          background-color: #1565c0;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: 0.3s ease;
        }

        .btn:hover {
          background-color: #0d47a1;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(21, 101, 192, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Envelope Animation */
        .icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 25px;
        }

        .envelope {
          position: relative;
          width: 80px;
          height: 60px;
          background: #90caf9;
          border-radius: 6px;
          overflow: hidden;
          animation: bounce 2s infinite;
        }

        .envelope-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 40px;
          background: #64b5f6;
          clip-path: polygon(0 0, 50% 50%, 100% 0);
        }

        .envelope-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 80px;
          height: 40px;
          background: #42a5f5;
          clip-path: polygon(0 100%, 50% 50%, 100% 100%);
        }

        .letter {
          position: absolute;
          top: 10px;
          left: 10px;
          width: 60px;
          height: 40px;
          background: #fff;
          border-radius: 4px;
          animation: slideUp 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes slideUp {
          0%, 100% { transform: translateY(10px); opacity: 1; }
          50% { transform: translateY(-8px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default EmailVerificationSent;
