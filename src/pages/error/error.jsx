import { useEffect } from "react";
import { useBanner } from "../../context/BannerContext";
import { useNavigate } from "react-router-dom";

function Error() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const navigate = useNavigate();

  useEffect(() => {
    setBannerTitle("Payment Failed");
    setBreadcrumb("Error");
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
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(220, 38, 38, 0.1)',
        border: '1px solid rgba(220, 38, 38, 0.1)',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Error Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
          animation: 'shake 0.5s ease-in-out'
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>

        {/* Error Message */}
        <h1 style={{
          color: '#DC2626',
          fontSize: '2.5rem',
          fontWeight: '700',
          margin: '0 0 1rem',
          background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Payment Failed
        </h1>

        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          margin: '0 0 2rem',
          fontWeight: '400'
        }}>
          We're sorry, but your payment could not be processed. This could be due to insufficient funds, incorrect card details, or a temporary issue.
        </p>

        {/* Common Issues */}
        <div style={{
          background: 'rgba(220, 38, 38, 0.05)',
          borderRadius: '12px',
          padding: '1.5rem',
          margin: '2rem 0',
          border: '1px solid rgba(220, 38, 38, 0.1)'
        }}>
          <h3 style={{
            color: '#DC2626',
            fontSize: '1.2rem',
            fontWeight: '600',
            margin: '0 0 1rem'
          }}>
            Common Issues:
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
                background: '#DC2626',
                marginRight: '12px',
                flexShrink: '0'
              }}></span>
              Insufficient funds in your account
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
                background: '#DC2626',
                marginRight: '12px',
                flexShrink: '0'
              }}></span>
              Incorrect card information
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
                background: '#DC2626',
                marginRight: '12px',
                flexShrink: '0'
              }}></span>
              Card expired or blocked
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
                background: '#DC2626',
                marginRight: '12px',
                flexShrink: '0'
              }}></span>
              Temporary processing issue
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
            onClick={() => navigate('/checkout')}
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
              minWidth: '140px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
            }}
          >
            Try Again
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
            Back to Courses
          </button>
        </div>

        {/* Help Section */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(102, 0, 204, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(102, 0, 204, 0.1)'
        }}>
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            margin: '0',
            lineHeight: '1.5'
          }}>
            Need help? Contact our support team at{' '}
            <a 
              href="mailto:support@ggperform.com" 
              style={{
                color: '#6600CC',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              support@ggperform.com
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
          borderRadius: '50%',
          zIndex: '-1'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(102, 0, 204, 0.1) 0%, rgba(122, 90, 248, 0.1) 100%)',
          borderRadius: '50%',
          zIndex: '-1'
        }}></div>

        <style>{`
          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }

          @media (max-width: 768px) {
            .error-container {
              padding: 2rem 1rem !important;
            }
            .error-title {
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

export default Error;