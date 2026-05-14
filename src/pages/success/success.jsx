import { useEffect } from "react";
import { useBanner } from "../../context/BannerContext";
import { useNavigate } from "react-router-dom";

function Success() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const navigate = useNavigate();

  useEffect(() => {
    setBannerTitle("Payment Successful");
    setBreadcrumb("Success");
    setBannerImage("/other-banner.png");
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      padding: '2rem',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(102, 0, 204, 0.1)',
        border: '1px solid rgba(102, 0, 204, 0.1)',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 10px 25px rgba(76, 175, 80, 0.3)',
          animation: 'pulse 2s infinite'
        }}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </div>

        {/* Success Message */}
        <h1 style={{
          color: '#2E7D32',
          fontSize: '2.5rem',
          fontWeight: '700',
          margin: '0 0 1rem',
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Payment Successful!
        </h1>

        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          margin: '0 0 2rem',
          fontWeight: '400'
        }}>
          Thank you for your purchase! Your payment has been processed successfully and your order has been confirmed.
        </p>

        {/* Order Details */}
        <div style={{
          background: 'rgba(102, 0, 204, 0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          margin: '2rem 0',
          border: '1px solid rgba(102, 0, 204, 0.1)'
        }}>
          <h3 style={{
            color: '#6600CC',
            fontSize: '1.2rem',
            fontWeight: '600',
            margin: '0 0 1rem'
          }}>
            What's Next?
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: '0',
            margin: '0',
            textAlign: 'left'
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0.75rem 0',
              color: '#555',
              fontSize: '0.95rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4CAF50',
                marginRight: '12px',
                flexShrink: '0'
              }}></span>
              You'll receive a confirmation email shortly
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0.75rem 0',
              color: '#555',
              fontSize: '0.95rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4CAF50',
                marginRight: '12px',
                flexShrink: '0'
              }}></span>
              Access your courses from your dashboard
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              margin: '0.75rem 0',
              color: '#555',
              fontSize: '0.95rem'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4CAF50',
                marginRight: '12px',
                flexShrink: '0'
              }}></span>
              Start learning immediately
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => navigate('/MyAccount')}
            style={{
              background: 'linear-gradient(135deg, #6600CC 0%, #7a5af8 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 0, 204, 0.3)',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 0, 204, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 0, 204, 0.3)';
            }}
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => navigate('/training')}
            style={{
              background: 'transparent',
              color: '#6600CC',
              border: '2px solid #6600CC',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#6600CC';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#6600CC';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Browse More Courses
          </button>
        </div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(102, 0, 204, 0.1) 0%, rgba(122, 90, 248, 0.1) 100%)',
          borderRadius: '50%',
          zIndex: '-1'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(69, 160, 73, 0.1) 100%)',
          borderRadius: '50%',
          zIndex: '-1'
        }}></div>

        <style>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }

          @media (max-width: 768px) {
            .success-container {
              padding: 2rem 1rem !important;
            }
            .success-title {
              font-size: 2rem !important;
            }
            .action-buttons {
              flex-direction: column !important;
            }
            .action-button {
              width: 100% !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Success;