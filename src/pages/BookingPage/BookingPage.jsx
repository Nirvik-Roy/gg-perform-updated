import React, { useState, useMemo, useEffect } from "react";
import "./booking.css";
import Calendar from "../../component/Calendar";
import TimeSlots from "../../component/TimeSlots";
import ServiceSelect from "../../component/ServiceSelect";
import BasicDetailsForm from "../../component/BasicDetailsForm";
import Coupon from "../../component/Coupon";
import BookingSummary from "../../component/BookingSummary";
import { useBanner } from "../../context/BannerContext";
import CalendarTimeSelector from "../../component/calendar-time-selector";
import { loadStripe } from "@stripe/stripe-js";


const SERVICES = {
  1: { price: 20, label: "Service 1" },
  2: { price: 35, label: "Service 2" },
};

export default function BookingPage() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();

  // Local coupon state for booking page (separate from cart)
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState("");

  const [services, setServices] = useState([]);
  // master state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [serviceId, setServiceId] = useState("");
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Authentication check function
  const checkAuth = () => {
    const token = localStorage.getItem('gg website token');
    const user = localStorage.getItem('gg website user');
    return token && user && token !== 'null' && user !== 'null';
  };

  // price calc
  // const basePrice = serviceId ? SERVICES[serviceId].price : 0;
  const selectedService = serviceId ? services.find(service => service.id == serviceId) : null;
  const basePrice = selectedService ? (parseFloat(selectedService.price) || 0) : 0;

  // Debug logging to help identify the issue
  // console.log('BookingPage Debug:', {
  //   serviceId,
  //   serviceIdType: typeof serviceId,
  //   services,
  //   selectedService,
  //   basePrice
  // });

  // Calculate discount properly
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const couponValueNumber = Number(appliedCoupon.value) || 0;
    const basePriceNumber = Number(basePrice) || 0;

    if (appliedCoupon.discount_type === 'percentage') {
      return (basePriceNumber * couponValueNumber) / 100;
    }

    return couponValueNumber;
  };

  const discount = calculateDiscount();
  const total = useMemo(() => Math.max(basePrice - discount, 0), [basePrice, discount]);

  const formValid =
    serviceId &&
    time;
  // Removed customer details validation since BasicDetailsForm is commented out
  // customer.firstName &&
  // customer.lastName &&
  // customer.email &&
  // customer.phone;

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }
  useEffect(() => {
    setBannerTitle("Booking");
    setBreadcrumb("Booking");
    setBannerImage("/other-banner.png");
    const fetchData = async () => {
      const data = await fetchServices();
      // console.log('Raw services data from API:', data);
      const filteredData = data.map((service) => ({
        price: service?.sale_price || service?.original_price,
        name: service.name,
        id: service.id,
      }));
      // console.log('Filtered services data:', filteredData);
      setServices(filteredData);
    }
    fetchData();
  }, []);

  // Local coupon functions for booking page
  const handleApplyCoupon = async (code) => {
    // console.log('=== BOOKING PAGE COUPON APPLICATION STARTED ===');
    // console.log('🎫 Coupon code:', code);
    // console.log('💰 Current base price:', basePrice);

    if (!code.trim()) {
      // console.log('❌ Empty coupon code');
      setCouponError('Please enter a coupon code');
      return false;
    }

    if (!checkAuth()) {
      // console.log('❌ User not authenticated for coupon');
      setCouponError('Please login to apply coupons');
      return false;
    }

    // console.log('✅ Starting booking page coupon API call...');
    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess("");

    try {
      // console.log('🌐 Making coupon API call...');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/apply-coupon`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          code: code.trim()
        })
      });

      // console.log('📡 Coupon API Response Status:', response.status, response.statusText);
      const data = await response.json();
      console.log('📥 Coupon API Response Data:', data);

      if (data.status === 'success') {
        // console.log('✅ Booking page coupon API call successful!');

        if (data.data.coupon.applicable_for === 'courses') {
          const errorMessage = 'This coupon is not applicable for appointments, it is applicable for courses only'
          setCouponError(errorMessage);
          return false;
        }


        // The API validates the coupon and returns the discount info
        const discountAmount = data.data?.discount_amount || 0;
        const discountType = data.data?.discount_type || 'fixed';
        const couponValue = data.data?.value || 0;
        const couponCodeFromAPI = data.data?.code || code.trim();

        // console.log('🎯 Booking page coupon details from API:', {
        //   discountAmount,
        //   discountType,
        //   couponValue,
        //   couponCodeFromAPI
        // });

        // Calculate final discount based on API response
        let finalDiscount = 0;
        if (discountType === 'percentage') {
          finalDiscount = (basePrice * couponValue) / 100;
          // console.log('📊 Booking page percentage discount calculation:', `${basePrice} × ${couponValue}% = ${finalDiscount}`);
        } else {
          finalDiscount = couponValue;
          // console.log('📊 Booking page fixed discount amount:', finalDiscount);
        }

        // Create the applied coupon object with data from API
        const appliedCouponData = {
          code: couponCodeFromAPI,
          discountAmount: finalDiscount,
          discount_type: discountType,
          value: couponValue
        };

        console.log('💾 Booking page final coupon data:', appliedCouponData);

        // Set local coupon state (separate from cart)
        setAppliedCoupon(appliedCouponData);
        setCouponSuccess('Coupon applied successfully!');
        // console.log('✅ Booking page coupon applied successfully!');
        return true;
      } else {
        // console.log('❌ Booking page coupon API returned error:', data.message);
        throw new Error(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      console.error('💥 ERROR applying booking page coupon:', err);
      console.error('💥 Booking page coupon error details:', {
        name: err.name,
        message: err.message
      });
      setCouponError(err.message || 'Failed to apply coupon');
      return false;
    } finally {
      console.log('🏁 Booking page coupon application process completed');
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    // Remove local coupon state (separate from cart)
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess("");
    console.log('Booking page coupon removed successfully');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  const handleConfirm = async () => {
    // console.log('=== BOOKING CONFIRMATION STARTED ===');
    // console.log('Current form state:', {
    //   date,
    //   time,
    //   serviceId,
    //   customer,
    //   appliedCoupon,
    //   basePrice,
    //   discount,
    //   total
    // });

    if (!checkAuth()) {
      // console.log('❌ Authentication failed - user not logged in');
      setSubmitError('Please login to book appointments');
      return;
    }

    if (!formValid) {
      // console.log('❌ Form validation failed:', {
      // serviceId: !!serviceId,
      // time: !!time
      // Removed customer details validation since BasicDetailsForm is commented out
      // firstName: !!customer.firstName,
      // lastName: !!customer.lastName,
      // email: !!customer.email,
      // phone: !!customer.phone
      // });
      setSubmitError('Please select a service and time');
      return;
    }

    if (!date) {
      // console.log('❌ Date not selected');
      setSubmitError('Please select a date');
      return;
    }

    if (!time) {
      // console.log('❌ Time not selected');
      setSubmitError('Please select a time');
      return;
    }

    if (!serviceId) {
      // console.log('❌ Service not selected');
      setSubmitError('Please select a service');
      return;
    }

    // console.log('✅ All validations passed, starting API call...');
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // console.log('🔄 Processing form data...');

      // Format date to YYYY-MM-DD
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
      // console.log('📅 Original date:', date, '→ Formatted date:', formattedDate);

      // Parse time to get start and end time
      let startTime, endTime;
      if (time.includes(' - ')) {
        [startTime, endTime] = time.split(' - ');
        // console.log('⏰ Time format: "start - end" →', { startTime, endTime });
      } else if (time.includes(' to ')) {
        [startTime, endTime] = time.split(' to ');
        // console.log('⏰ Time format: "start to end" →', { startTime, endTime });
      } else {
        // If no separator, assume it's just a start time and add 1 hour
        startTime = time;
        const timeParts = time.split(':');
        const hour = parseInt(timeParts[0]);
        const minute = timeParts[1] || '00';
        const endHour = hour + 1;
        endTime = `${endHour.toString().padStart(2, '0')}:${minute}`;
        // console.log('⏰ Time format: single time →', { startTime, endTime });
      }

      const requestBody = {
        date: formattedDate,
        start_time: startTime,
        end_time: endTime,
        service_id: parseInt(serviceId),
        total: basePrice,
        coupon_discount: discount,
        coupon_id: appliedCoupon?.id,
        final_total: total
      };

      console.log('📤 API Request Body:', requestBody);
      // console.log('🔑 Using token:', localStorage.getItem('gg website token') ? 'Token exists' : 'No token found');

      // console.log('🌐 Making API call to:', `${import.meta.env.VITE_API_BASE_URL}frontend/appointments`);  

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/appointments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('📥 API Response Data:', data);

      if (data.status === 'success') {
        // console.log('✅ BOOKING SUCCESSFUL!');
        // console.log('📋 Appointment details:', data.data || 'No additional data');
        console.log('🔑 session id:', data.data.sessionId);
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.data.sessionId })
        setSubmitSuccess(true);
        // Clear form after successful booking
        setTimeout(() => {
          console.log('🔄 Reloading page in 2 seconds...');
          // window.location.reload();
        }, 2000);
      } else {
        console.log('❌ API returned error status:', data.status);
        console.log('❌ Error message:', data.message);
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('💥 ERROR during booking:', err);
      console.error('💥 Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setSubmitError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      console.log('🏁 Booking process completed');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="booking-wrapper">
      {/* top: calendar + times */}
      {/* <div className="booking-top">
        <Calendar selected={date} onSelect={setDate} />
        <TimeSlots selected={time} onSelect={setTime} />
      </div> */}
      <CalendarTimeSelector selectedDate={date} selectedTime={time} onDateSelect={setDate} onTimeSelect={setTime} />

      <ServiceSelect value={serviceId} onChange={setServiceId} />

      {/* <BasicDetailsForm data={customer} onChange={setCustomer} /> */}
      <Coupon
        appliedCoupon={appliedCoupon}
        onApply={handleApplyCoupon}
        onRemove={handleRemoveCoupon}
        isLoading={couponLoading}
        error={couponError}
        success={couponSuccess}
        orderTotal={basePrice}
      />
      {/* Order Summary with Savings Display */}
      <div style={{
        backgroundColor: '#FAFAFA',
        border: '1px solid #E8E8E8',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '24px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px',
          borderBottom: '1px solid #E0E0E0',
          paddingBottom: '8px'
        }}>
          Order Summary
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Price:</span>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>${basePrice.toFixed(2)}</span>
          </div>

          {appliedCoupon && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              color: 'green',
              fontWeight: '600'
            }}>
              <span style={{ fontSize: '14px' }}>Coupon Discount ({appliedCoupon.code}):</span>
              <span style={{ fontSize: '16px' }}>-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Show savings prominently when coupon is applied */}
        {appliedCoupon && discount > 0 && (
          <div style={{
            backgroundColor: '#E8F5E8',
            border: '1px solid #C8E6C9',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#2E7D32',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💰 You Saved:
            </span>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#2E7D32'
            }}>
              ${discount.toFixed(2)}
            </span>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '18px',
          fontWeight: '700',
          color: '#333',
          padding: '16px 0',
          borderTop: '2px solid #E0E0E0',
          borderBottom: '2px solid #E0E0E0',
          marginBottom: '16px'
        }}>
          <span>Final Total:</span>
          <span style={{ color: '#6a0dad' }}>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Error Display */}
      {submitError && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          marginTop: '16px',
          borderRadius: '8px',
          border: '1px solid #ffcdd2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{submitError}</span>
          <button
            onClick={() => setSubmitError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#c62828',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Success Display */}
      {submitSuccess && (
        <div style={{
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          padding: '12px 16px',
          marginTop: '16px',
          borderRadius: '8px',
          border: '1px solid #c8e6c9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✓</span>
          <span>Appointment booked successfully! Redirecting...</span>
        </div>
      )}

      <BookingSummary
        price={total}
        onCancel={() => window.location.reload()}
        onConfirm={handleConfirm}
        disabled={!formValid || isSubmitting}
        isLoading={isSubmitting}
      />
    </main>
  );
}
