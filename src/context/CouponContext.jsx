import React, { createContext, useContext, useState, useCallback } from 'react';
import { couponService } from '../services/couponService';

const CouponContext = createContext();

export const useCouponContext = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCouponContext must be used within a CouponProvider');
  }
  return context;
};

export const CouponProvider = ({ children }) => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const applyCoupon = useCallback(async (code, orderTotal = 0, couponData = null) => {
    if (!code.trim()) {
      setError('Please enter a coupon code');
      return false;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // If couponData is provided (from direct API call), use it directly
      if (couponData) {
        const discount = couponService.calculateDiscount(couponData, orderTotal);
        setAppliedCoupon({
          ...couponData,
          discountAmount: discount
        });
        setSuccess('Coupon applied successfully!');
        return true;
      }

      // Fallback to old method if no couponData provided
      const result = await couponService.validateCoupon(code);
      
      if (result.valid) {
        const discount = couponService.calculateDiscount(result.coupon, orderTotal);
        setAppliedCoupon({
          ...result.coupon,
          discountAmount: discount
        });
        setSuccess(result.message);
        return true;
      } else {
        setError(result.message);
        setAppliedCoupon(null);
        return false;
      }
    } catch (err) {
      setError('Failed to validate coupon. Please try again.');
      setAppliedCoupon(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setError('');
    setSuccess('');
  }, []);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const setErrorMessage = useCallback((message) => {
    setError(message);
    setSuccess('');
  }, []);

  const value = {
    appliedCoupon,
    isLoading,
    error,
    success,
    applyCoupon,
    removeCoupon,
    clearMessages,
    setErrorMessage
  };

  return (
    <CouponContext.Provider value={value}>
      {children}
    </CouponContext.Provider>
  );
}; 