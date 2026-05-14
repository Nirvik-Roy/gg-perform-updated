import React, { useState, useEffect } from "react";
import { FiPlus, FiX, FiCheck, FiTag, FiDollarSign, FiPercent } from "react-icons/fi";

export default function Coupon({ appliedCoupon, onApply, onRemove, isLoading, error, success, orderTotal = 0, pendingCouponCode, setPendingCouponCode }) {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState("");
  const [showError, setShowError] = useState(false);

  // Update pending coupon code when local code changes
  useEffect(() => {
    if (setPendingCouponCode) {
      setPendingCouponCode(code);
    }
  }, [code, setPendingCouponCode]);

  // Auto-dismiss error message after 4 seconds
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    } else {
      setShowError(false);
    }
  }, [error]);

  const handleApply = async () => {
    if (code.trim()) {
      const success = await onApply(code, orderTotal);
      if (success) {
        setShow(false);
        setCode("");
        // Clear pending coupon code when successfully applied
        if (setPendingCouponCode) {
          setPendingCouponCode("");
        }
      }
    }
  };

  const handleRemove = () => {
    onRemove();
    setShow(false);
    setCode("");
    // Clear pending coupon code when removed
    if (setPendingCouponCode) {
      setPendingCouponCode("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const calculateSavings = () => {
    const total = Number(orderTotal) || 0;
    if (!appliedCoupon || !total) return 0;

    const couponValue = parseFloat(appliedCoupon.value);
    if (Number.isNaN(couponValue)) return 0;

    if (appliedCoupon.discount_type === 'percentage') {
      return (total * couponValue) / 100;
    }
    return couponValue;
  };

  const savings = Number(calculateSavings()) || 0;

  const styles = {
    container: {
      marginTop: "24px",
      border: "1px solid #E8E8E8",
      borderRadius: "12px",
      padding: "20px",
      backgroundColor: "#FAFAFA",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    title: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    addBtn: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
      color: "#6a0dad",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontWeight: 600,
      padding: "8px 12px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
    },
    addBtnHover: {
      backgroundColor: "#F0E6FF",
    },
    formContainer: {
      marginTop: "16px",
    },
    buttonContainer: {
      display: "flex",
      gap: "12px",
      marginTop: "12px",
      justifyContent: "flex-end",
      flexWrap: "wrap",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "14px",
      border: "2px solid #E0E0E0",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.2s ease",
      boxSizing: "border-box",
    },
    inputFocus: {
      borderColor: "#6a0dad",
    },
    applyBtn: {
      backgroundColor: "#6a0dad",
      color: "white",
      border: "none",
      padding: "12px 20px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
      minWidth: "120px",
      justifyContent: "center",
      flexShrink: 0,
    },
    applyBtnDisabled: {
      backgroundColor: "#BDBDBD",
      cursor: "not-allowed",
    },

    hideBtn: {
      background: "none",
      border: "1px solid #E0E0E0",
      color: "#666",
      fontSize: "14px",
      cursor: "pointer",
      padding: "8px 16px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
      fontWeight: "500",
      minWidth: "80px",
      justifyContent: "center",
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
    },
    hideBtnHover: {
      backgroundColor: "#F0F0F0",
    },
    appliedContainer: {
      backgroundColor: "#E8F5E8",
      border: "1px solid #C8E6C9",
      borderRadius: "8px",
      padding: "16px",
      marginTop: "16px",
    },
    appliedHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    appliedTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#2E7D32",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    removeBtn: {
      background: "none",
      border: "none",
      color: "#D32F2F",
      fontSize: "12px",
      cursor: "pointer",
      padding: "4px 8px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      transition: "background-color 0.2s ease",
    },
    removeBtnHover: {
      backgroundColor: "#FFEBEE",
    },
    savingsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#F1F8E9",
      padding: "12px 16px",
      borderRadius: "6px",
      border: "1px solid #DCEDC8",
    },
    savingsLabel: {
      fontSize: "14px",
      color: "#33691E",
      fontWeight: 500,
    },
    savingsAmount: {
      fontSize: "18px",
      fontWeight: 700,
      color: "#2E7D32",
      display: "flex",
      alignItems: "center",
      gap: "4px",
    },
    couponDetails: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "8px",
      fontSize: "13px",
      color: "#666",
    },
    errorContainer: {
      backgroundColor: "#FFEBEE",
      border: "1px solid #FFCDD2",
      borderRadius: "6px",
      padding: "12px",
      marginTop: "12px",
      transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
      opacity: showError ? 1 : 0,
      transform: showError ? "translateY(0)" : "translateY(-10px)",
    },
    errorText: {
      fontSize: "14px",
      color: "#D32F2F",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    successContainer: {
      backgroundColor: "#E8F5E8",
      border: "1px solid #C8E6C9",
      borderRadius: "6px",
      padding: "12px",
      marginTop: "12px",
    },
    successText: {
      fontSize: "14px",
      color: "#2E7D32",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    loadingSpinner: {
      width: "16px",
      height: "16px",
      border: "2px solid transparent",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>
          <FiTag size={18} />
          Coupon Code
        </span>

        {!show && !appliedCoupon && (
          <button 
            style={styles.addBtn} 
            onClick={() => setShow(true)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = styles.addBtnHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <FiPlus size={16} />
            Add Coupon
          </button>
        )}
      </div>

      {show && !appliedCoupon && (
        <div style={styles.formContainer}>
          <input
            type="text"
            placeholder="Enter your coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              ...styles.input,
              borderColor: code.trim() && !appliedCoupon ? '#FF9800' : '#E0E0E0',
              borderWidth: code.trim() && !appliedCoupon ? '2px' : '2px'
            }}
            className="coupon-input"
            disabled={isLoading}
            onFocus={(e) => {
              e.target.style.borderColor = styles.inputFocus.borderColor;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = code.trim() && !appliedCoupon ? '#FF9800' : '#E0E0E0';
            }}
          />
          {code.trim() && !appliedCoupon && (
            <div style={{
              fontSize: '12px',
              color: '#FF9800',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⚠️ Please apply the coupon before proceeding
            </div>
          )}
          <div style={styles.buttonContainer} className="coupon-button-container">
            <button 
              style={{
                ...styles.applyBtn,
                ...(isLoading ? styles.applyBtnDisabled : {})
              }} 
              className="coupon-apply-btn"
              onClick={handleApply}
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Applying...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Apply
                </>
              )}
            </button>
            <button 
              style={styles.hideBtn} 
              className="coupon-cancel-btn"
              onClick={() => {
                setShow(false);
                setCode("");
                // Clear pending coupon code when cancelled
                if (setPendingCouponCode) {
                  setPendingCouponCode("");
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.hideBtnHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {appliedCoupon && (
        <div style={styles.appliedContainer}>
          <div style={styles.appliedHeader}>
            <div style={styles.appliedTitle}>
              <FiCheck size={18} />
              Coupon Applied Successfully!
            </div>
            <button 
              style={styles.removeBtn} 
              onClick={handleRemove}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.removeBtnHover.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <FiX size={14} />
              Remove
            </button>
          </div>
          
          <div style={styles.couponDetails}>
            <strong>Code:</strong> {appliedCoupon.code}
            <span>•</span>
            <span>
              {appliedCoupon.discount_type === 'percentage' ? (
                <>
                  <FiPercent size={12} />
                  {appliedCoupon.value}% off
                </>
              ) : (
                <>
                  <FiDollarSign size={12} />
                  ${appliedCoupon.value} off
                </>
              )}
            </span>
          </div>

          {savings > 0 && (
            <div style={styles.savingsContainer}>
              <span style={styles.savingsLabel}>💰 You Save:</span>
              <span style={styles.savingsAmount}>
                <FiDollarSign size={16} />
                {savings.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {showError && error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorText}>
            <FiX size={16} />
            {error}
            <FiX 
              size={16} 
              style={{ 
                marginLeft: 'auto', 
                cursor: 'pointer', 
                opacity: 0.7,
                padding: '2px'
              }}
              onClick={() => setShowError(false)}
              title="Dismiss"
            />
          </div>
        </div>
      )}

      {success && (
        <div style={styles.successContainer}>
          <div style={styles.successText}>
            <FiCheck size={16} />
            {success}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .coupon-input {
            width: 100%;
          }
          
          .coupon-button-container {
            flex-direction: column;
            gap: 8px;
          }
          
          .coupon-apply-btn,
          .coupon-cancel-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
