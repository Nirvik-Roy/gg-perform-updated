// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const EmailVerified = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const status = params.get('status'); // success | already_verified

//   // useEffect(() => {
//   //   const timeoutId = setTimeout(() => {
//   //     navigate('/auth');
//   //   }, 5500);
//   //   return () => clearTimeout(timeoutId);
//   // }, [navigate]);

//   const renderMessage = () => {
//     if (status === 'already_verified') {
//       return (
//         <>
//           <h1 style={{ marginBottom: 40,color: "green" }}> Your email is already verified 
//           </h1>
//           <p>You can log in to your account now.</p>
//           <button>
//             Click here to login 
//           </button>
//         </>
//       );
//     }
//     return (
//       <>
//         <h2 style={{ marginBottom: 10 }}>Email verified successfully</h2>
//         {/* <p>Redirecting you to the login page...</p> */}
//       </>
//     );
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: '60px auto', padding: '20px', textAlign: 'center' }}>
//       {renderMessage()}
      
//       {/* <p style={{ marginTop: 20, fontSize: 12, color: '#666' }}>If you are not redirected automatically, <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/auth')}>click here</span>.</p> */}
//     </div>
//   );
// };

// export default EmailVerified;


import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get("status"); // success | already_verified

  // Redirect after a delay (optional)
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     navigate("/auth");
  //   }, 5500);
  //   return () => clearTimeout(timeoutId);
  // }, [navigate]);

  const renderMessage = () => {
    if (status === "already_verified") {
      return (
        <>
          <h1 className="title success">Your email is already verified</h1>
          <p className="subtitle">You can log in to your account now.</p>
          <button className="btn" onClick={() => navigate("/auth")}>
            Click here to Login
          </button>
        </>
      );
    }
    return (
      <>
        <h2 className="title success">✅ Email Verified Successfully!</h2>
        <p className="subtitle">You can now log in to your account.</p>
        <button className="btn" onClick={() => navigate("/auth")}>
          Go to Login Page
        </button>
      </>
    );
  };

  return (
    <div className="verify-container">
      <div className="verify-box">
        <div className="icon-container">
          <div className="checkmark-circle">
            <div className="background"></div>
            <div className="checkmark draw"></div>
          </div>
        </div>
        {renderMessage()}
      </div>

      <style>{`
        .verify-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 90vh;
          // background: linear-gradient(135deg, #e0f7fa, #f1f8e9);
          font-family: 'Poppins', sans-serif;
        }

        .verify-box {
          background: #fff;
          padding: 40px 50px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          text-align: center;
          animation: fadeIn 1s ease-in-out;
        }

        .title {
          font-size: 1.8rem;
          color: #2e7d32;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1rem;
          color: #555;
          margin-bottom: 25px;
        }

        .btn {
          background-color: #2e7d32;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: 0.3s ease;
        }

        .btn:hover {
          background-color: #1b5e20;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(46, 125, 50, 0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Checkmark animation */
        .icon-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .checkmark-circle {
          width: 80px;
          height: 80px;
          position: relative;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #c8e6c9;
          animation: pop 0.6s ease-out;
        }

        @keyframes pop {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }

        .checkmark {
          width: 28px;
          height: 56px;
          border-right: 6px solid #2e7d32;
          border-bottom: 6px solid #2e7d32;
          transform: rotate(45deg);
          margin-top: -8px;
          animation: draw 0.8s ease forwards;
        }

        @keyframes draw {
          from { opacity: 0; height: 0; }
          to { opacity: 1; height: 56px; }
        }
      `}</style>
    </div>
  );
};

export default EmailVerified;
