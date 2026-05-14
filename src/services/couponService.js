const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

export const couponService = {
  // Fetch all available coupons
  async getAllCoupons() {
    try {
      const response = await fetch(`${API_BASE_URL}/coupons`);
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      throw error;
    }
  },

  // Validate a specific coupon code
  async validateCoupon(couponCode) {
    try {
      const coupons = await this.getAllCoupons();
      const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
      
      if (!coupon) {
        return {
          valid: false,
          message: 'Invalid coupon code'
        };
      }

      // Check if coupon is expired
      const currentDate = new Date();
      const startDate = new Date(coupon.start_date);
      const endDate = new Date(coupon.end_date);

      if (currentDate < startDate) {
        return {
          valid: false,
          message: 'Coupon is not yet active'
        };
      }

      if (currentDate > endDate) {
        return {
          valid: false,
          message: 'Coupon has expired'
        };
      }

      return {
        valid: true,
        coupon: coupon,
        message: 'Coupon applied successfully'
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return {
        valid: false,
        message: 'Error validating coupon'
      };
    }
  },

  // Calculate discount amount
  calculateDiscount(coupon, orderTotal) {
    if (!coupon || !orderTotal) return 0;

    if (coupon.discount_type === 'percentage') {
      return (orderTotal * parseFloat(coupon.value)) / 100;
    } else if (coupon.discount_type === 'fixed') {
      return parseFloat(coupon.value);
    }

    return 0;
  }
}; 