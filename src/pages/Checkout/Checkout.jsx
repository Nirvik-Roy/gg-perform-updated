import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useBanner } from "../../context/BannerContext";
import { useCouponContext } from "../../context/CouponContext";
import Coupon from "../../component/Coupon";
import "./Checkout.css";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

export default function Checkout() {
  const { removeFromCart, loading: cartLoading, error: cartError, clearError } = useCart();
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const {
    appliedCoupon,
    isLoading: couponLoading,
    error: couponError,
    success: couponSuccess,
    applyCoupon,
    removeCoupon,
    clearMessages,
    setErrorMessage
  } = useCouponContext();

  const [payment, setPayment] = useState("bank"); // "bank" | "card"
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [localCouponLoading, setLocalCouponLoading] = useState(false);
  const [pendingCouponCode, setPendingCouponCode] = useState('');
  // ──────────────────────────────────────  banner

  const fetchCartData = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/cart`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("gg website token"))}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
    const data = await response.json();
    console.log("cart data ", data);
    if (data.status === 'success') {
      return data.data;
    } else {
      return [];
    }
  }
  useEffect(() => {
    setBannerTitle("Checkout");
    setBreadcrumb("Checkout");
    setBannerImage("/other-banner.png");
    const token = localStorage.getItem("gg website token");
    const user = localStorage.getItem("gg website user");
    if (!token || !user) {
      navigate("/auth", { state: { route: location.pathname } });
    }
    const fetchingCartData = async () => {
      const data = await fetchCartData();
      const filteredData = data.map((item) => {
        const apiTags = [];

        // Add course_type as tag
        if (item.course?.course_type) {
          apiTags.push(item.course.course_type);
        }

        // Add live_session_type as tag
        if (item.course?.live_session_type) {
          apiTags.push(item.course.live_session_type);
        }

        // Add any existing tags array
        if (item.course?.tags && Array.isArray(item.course.tags)) {
          apiTags.push(...item.course.tags);
        }

        // Ensure price is a valid number
        const price = parseFloat(item.course?.sale_price) || 0;
        const originalPrice = parseFloat(item.course?.original_price) || 0;

        // Calculate average rating from reviews array
        let averageRating = 0;
        let reviewCount = 0;
        
        if (item.course?.reviews && item.course.reviews.length > 0) {
          const totalRating = item.course.reviews.reduce((sum, review) => sum + review.rating, 0);
          averageRating = totalRating / item.course.reviews.length;
          reviewCount = item.course.reviews.length;
        }

        console.log('Processing item:', {
          title: item.course?.course_name,
          rawPrice: item.course?.sale_price,
          parsedPrice: price,
          rawOriginalPrice: item.course?.original_price,
          parsedOriginalPrice: originalPrice,
          calculatedRating: averageRating || 0,
          // calculatedReviews: reviewCount || 0,
          reviewCount: reviewCount
        });

        return {
          id: item.course?.id,
          title: item.course?.course_name || 'Unknown Course',
          image: item.course?.featured_image || '/course.png',
          price: price,
          originalPrice: originalPrice,
          rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
          reviews: reviewCount, // Actual review count from API
          reviewsData: item.course?.reviews || [], // Store actual reviews data
          tag: apiTags // Use tags from API object fields
        };
      })
      setCartItems(filteredData);
    }
    fetchingCartData();
  }, []);

  // ──────────────────────────────────────  helpers
  // const deliveryFee = 4.78;

  // Calculate subtotal with proper number parsing
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + price;
  }, 0);

  // Calculate discount properly
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    const couponValue = parseFloat(appliedCoupon.value);
    if (Number.isNaN(couponValue)) return 0;

    if (appliedCoupon.discount_type === 'percentage') {
      return (subtotal * couponValue) / 100;
    }
    return couponValue;
  };

  const discount = Number(calculateDiscount()) || 0;
  const grandTotal = Number((subtotal - discount)).toFixed(2);

  // Debug logging for calculations (moved after all variables are declared)
  console.log('Checkout calculations:', {
    cartItems: cartItems.map(item => ({ title: item.title, price: item.price, parsedPrice: parseFloat(item.price) || 0 })),
    subtotal,
    // deliveryFee,
    discount,
    grandTotal
  });

  const getTags = (arr = []) =>
    arr.map((t) => {
      if (t === "Resource Only") return { txt: t, cls: "tag-resource" };
      if (t === "Live Sessions") return { txt: t, cls: "tag-live" };
      if (t === "Flexible") return { txt: t, cls: "tag-schedule" };
      if (t === "Fixed") return { txt: t, cls: "tag-fixed" };
      return { txt: t, cls: "tag-default" };
    });

  const stars = (r) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < r ? "#FFD700" : "#ccc" }}>
        ★
      </span>
    ));

  const handleApplyCoupon = async (code) => {
    if (!code.trim()) {
      return false;
    }

    setLocalCouponLoading(true);

    try {
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

      const data = await response.json();
      console.log('Coupon API response:', data);

      if (data.status === 'success') {

        if (data.data.coupon.applicable_for === 'appointments') {
          const errorMessage = 'This coupon is not applicable for courses, it is applicable for appointments only'
          if (clearMessages) {
            clearMessages();
          }
          if (setErrorMessage) {
            setErrorMessage(errorMessage);
          }
          setTimeout(() => {
            setLocalCouponLoading(false);
          }, 500);
          return false;
        }

        if (data.data.coupon.applicable_for === 'courses') {
          const extractAllCourseIdsFromCart = cartItems.map(item => item.id);
          if(!data.data.coupon.applicable_course_ids.includesAll(extractAllCourseIdsFromCart)) {
            const errorMessage = 'This coupon is not applicable for the courses in the cart'
            if (clearMessages) {
              clearMessages();
            }
            if (setErrorMessage) {
              setErrorMessage(errorMessage);
            }
            setTimeout(() => {
              setLocalCouponLoading(false);
            }, 500);
            return false;
          }
        }

        // The API validates the coupon and returns the discount info
        const discountAmount = data.data?.discount_amount || 0;
        const discountType = data.data?.discount_type || 'fixed';
        const couponValue = data.data?.value || 0;
        const couponCodeFromAPI = data.data?.code || code.trim();

        // Calculate final discount based on API response
        let finalDiscount = 0;
        if (discountType === 'percentage') {
          finalDiscount = (subtotal * couponValue) / 100;
        } else {
          finalDiscount = couponValue;
        }

        // Create the applied coupon object with data from API
        const appliedCouponData = {
          code: couponCodeFromAPI,
          discountAmount: finalDiscount,
          discount_type: discountType,
          value: couponValue
        };

        // Update the coupon context with the validated data from API
        if (applyCoupon) {
          // Pass the coupon data directly to ensure proper discount calculation
          const couponData = {
            code: couponCodeFromAPI,
            discount_type: discountType,
            value: couponValue
          };
          applyCoupon(couponCodeFromAPI, subtotal, couponData);
        }

        console.log('Coupon applied successfully:', appliedCouponData);
        // Add a small delay to show the loading state
        setTimeout(() => {
          setLocalCouponLoading(false);
        }, 500);
        return true;
      } else if (data.status === 'error') {
        // Handle API error status specifically
        const errorMessage = data.message || 'Invalid coupon code';
        console.error('Coupon API error:', errorMessage);

        // Clear any existing messages first
        if (clearMessages) {
          clearMessages();
        }

        // Set the error message directly using the context's setErrorMessage function
        if (setErrorMessage) {
          setErrorMessage(errorMessage);
        }

        setTimeout(() => {
          setLocalCouponLoading(false);
        }, 500);
        return false;
      } else {
        throw new Error(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      console.error('Error applying coupon:', err);
      // Add a small delay to show the loading state
      setTimeout(() => {
        setLocalCouponLoading(false);
      }, 500);
      return false;
    }
  };

  const handleRemoveCoupon = () => {
    setLocalCouponLoading(true);

    // Update the coupon context to remove the coupon
    if (removeCoupon) {
      removeCoupon();
    }

    console.log('Coupon removed successfully');
    setLocalCouponLoading(false);
  };

  const stripePromis = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

  const handleProceed = async () => {
    try {
      // Check if there's a pending coupon code that needs to be validated
      if (pendingCouponCode.trim() && !appliedCoupon) {
        // If there's a coupon code entered but not applied, validate it first
        const isValidCoupon = await handleApplyCoupon(pendingCouponCode.trim());

        if (!isValidCoupon) {
          // If coupon validation fails, don't proceed
          console.log("Coupon validation failed, cannot proceed");
          return;
        }
      }

      // Prepare the request body
      const requestBody = {};

      // Only include coupon_code if there's an applied coupon
      if (appliedCoupon?.code) {
        requestBody.coupon_code = appliedCoupon.code;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}checkout/create-session`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json();
      console.log("Stripe session data:", data)

      if (response.ok && data.id) {
        const stripe = await stripePromis;
        await stripe.redirectToCheckout({ sessionId: data.id })
      } else {
        console.error("Failed to create Stripe session:", data);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("error in handleProceed", error)
      // You might want to show an error message to the user here
    }
  }

  // ──────────────────────────────────────  render
  return (
    <div className="checkout">
      {/* Error Display */}
      {cartError && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{cartError}</span>
          <button
            onClick={clearError}
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

      {/* Loading State */}
      {cartLoading && (
        <div className="checkout-loading-spinner">
          <div className="checkout-loading-spinner-icon"></div>
          <div className="checkout-loading-spinner-text">Loading your cart items...</div>
        </div>
      )}

      {/* ─────────────── LEFT ─────────────── */}
      <div className="checkout-left">
        <h2>Checkout</h2>

        {/* Basic Details - Commented out
        <section className="card">
          <h4>Basic Details</h4>
          <div className="grid-2">
            <label>
              First Name*
              <input placeholder="First name" />
            </label>
            <label>
              Last Name* <input placeholder="Last name" />
            </label>
            <label>
              Email* <input type="email" placeholder="example@mail.com" />
            </label>
            <label>
              Phone* <input placeholder="+91 1234567890" />
            </label>
          </div>
        </section>

        <section className="card">
          <h4>Payment Method</h4>

          <div
            className="pay-option"
            style={{ border: "none" }}
            onClick={() => setPayment("bank")}
          >
            <input type="radio" checked={payment === "bank"} readOnly />
            <span>Bank Transfer</span>
          </div>
          {payment === "bank" && (
            <div className="pay-box">
              <label>
                Account Holder* <input placeholder="e.g. Bidisha Bhowmick" />
              </label>
              <label>
                Account No.* <input placeholder="1234 5678 9101" />
              </label>
              <label>
                IFSC Code* <input placeholder="SBIN0001234" />
              </label>
            </div>
          )}

          <div className="pay-option" onClick={() => setPayment("card")}>
            <input type="radio" checked={payment === "card"} readOnly />
            <span>Credit Card / Debit Card</span>
          </div>
          {payment === "card" && (
            <div className="pay-box">
              <label>
                Card Holder Name* <input placeholder="Bidisha Bhowmick" />
              </label>
              <label>
                Card Number* <input placeholder="1234 4567 7897 7897" />
              </label>
              <label>
                Expire Date* <input placeholder="06/2027" />
              </label>
              <label>
                CVC* <input placeholder="***" />
              </label>
            </div>
          )}
        </section>
        */}

        {/* Cart Items Display */}
        <section className="card">
          <h4>Your Cart Items</h4>
          <div className="cart-items-container">
            {cartLoading ? (
              <div className="checkout-loading-container">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="checkout-loading-item">
                    <div className="checkout-loading-image"></div>
                    <div className="checkout-loading-content">
                      <div className="checkout-loading-tags">
                        <div className="checkout-loading-tag"></div>
                        <div className="checkout-loading-tag"></div>
                      </div>
                      <div className="checkout-loading-rating">
                        {/* <div className="checkout-loading-stars">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="checkout-loading-star"></div>
                          ))}
                        </div> */}
                        <div className="checkout-loading-reviews"></div>
                      </div>
                      <div className="checkout-loading-title"></div>
                      <div className="checkout-loading-price">
                        <div className="checkout-loading-old-price"></div>
                        <div className="checkout-loading-new-price"></div>
                      </div>
                    </div>
                    <div className="checkout-loading-button"></div>
                  </div>
                ))}
              </div>
            ) : cartItems.length > 0 ? (
              cartItems.map((it) => (
                <div key={it.id} className="cart-item-display">
                  <div className="cart-item-image">
                    <img src={it.image} alt={it.title} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-tags">
                      {getTags(it.tag).map(({ txt, cls }) => (
                        <span key={txt} className={`cart-tag ${cls}`}>
                          {txt}
                        </span>
                      ))}
                    </div>
                    {/* <div className="cart-item-rating">
                      {stars(it.rating)}
                      <span className="cart-reviews">({it.reviews} Review{it.reviews !== 1 ? 's' : ''})</span>
                    </div> */}
                    <h5 className="cart-item-title">{it.title}</h5>
                    <div className="cart-item-price">
                      <span className="cart-old-price">${(parseFloat(it.originalPrice) || 0).toFixed(2)}</span>
                      <span className="cart-new-price">${(parseFloat(it.price) || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      title="Remove"
                      onClick={async () => {
                        try {
                          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/cart/${it.id}`, {
                            method: "DELETE",
                            headers: {
                              "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
                              "Content-Type": "application/json",
                              "Accept": "application/json",
                            }
                          });

                          if (response.ok) {
                            const data = await response.json();
                            if (data.status === 'success') {
                              const updatedCartItems = cartItems.filter(item => item.id !== it.id);
                              setCartItems(updatedCartItems);
                              console.log('Item removed from cart successfully');
                            } else {
                              console.error('Failed to remove item:', data.message);
                            }
                          } else {
                            console.error('Failed to remove item from cart');
                          }
                        } catch (error) {
                          console.error('Error removing item from cart:', error);
                        }
                      }}
                      disabled={cartLoading}
                      className="cart-remove-btn"
                    >
                      <img
                        src="/dustbin.svg"
                        alt="Remove"
                        style={{ width: "18px", height: "18px" }}
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <button
                  onClick={() => navigate('/training')}
                  className="continue-shopping-btn"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Coupon - Commented out old coupon section */}
        {/* <div className="coupon-row">
          <span>Coupon</span>
          {!appliedCoupon ? (
            <button onClick={() => setShowCoupon(!showCoupon)}>
              {showCoupon ? "Hide" : "+ Add Coupon"}
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'green' }}>
                {appliedCoupon.code} - {appliedCoupon.discount_type === 'percentage'
                  ? `${appliedCoupon.value}% off`
                  : `$${appliedCoupon.value} off`
                }
              </span>
              <button
                onClick={handleRemoveCoupon}
                style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {showCoupon && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              className="coupon-input"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={couponLoading}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={couponLoading || !couponCode.trim()}
              style={{
                marginTop: '8px',
                padding: '8px 16px',
                backgroundColor: couponLoading || !couponCode.trim() ? '#ccc' : '#6600CC',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: couponLoading || !couponCode.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                width: '100%'
              }}
            >
              {couponLoading ? 'Applying...' : 'Apply Coupon'}
            </button>
            {couponError && (
              <div style={{ color: '#d32f2f', fontSize: '12px', marginTop: '4px' }}>
                {couponError}
              </div>
            )}
            {couponSuccess && (
              <div style={{ color: 'green', fontSize: '12px', marginTop: '4px' }}>
                {couponSuccess}
              </div>
            )}
          </div>
        )} */}
      </div>

      {/* ─────────────── RIGHT ─────────────── */}
      <div className="checkout-right">
        <h3>Review Order</h3>
        {/* <span className="item-count">{cartItems.length} items</span> */}

        {/* Loading Skeleton for Cart Items */}
        {cartLoading && (
          <div className="checkout-loading-container">
            {[1, 2, 3].map((index) => (
              <div key={index} className="checkout-loading-item">
                <div className="checkout-loading-image"></div>
                <div className="checkout-loading-content">
                  <div className="checkout-loading-tags">
                    <div className="checkout-loading-tag"></div>
                    <div className="checkout-loading-tag"></div>
                  </div>
                  <div className="checkout-loading-rating">
                    <div className="checkout-loading-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="checkout-loading-star"></div>
                      ))}
                    </div>
                    <div className="checkout-loading-reviews"></div>
                  </div>
                  <div className="checkout-loading-title"></div>
                  <div className="checkout-loading-price">
                    <div className="checkout-loading-old-price"></div>
                    <div className="checkout-loading-new-price"></div>
                  </div>
                </div>
                <div className="checkout-loading-button"></div>
              </div>
            ))}
          </div>
        )}

        {/* Cart items */}
        {/* {!cartLoading && cartItems.map((it) => (
          <div key={it.id} className="review-item">
            <img src={it.image} alt={it.title} />
            <div className="details">
              <div className="tag-wrap">
                {getTags(it.tag).map(({ txt, cls }) => (
                  <span key={txt} className={`label ${cls}`}>
                    {txt}
                  </span>
                ))}
              </div>
              <div className="check-rating">
                {stars(it.rating)}
                <span className="check-review">({it.reviews}+ Reviews)</span>
              </div>
              <h4>{it.title}</h4>
                             <div className="check-price">
                 <span className="old">${(parseFloat(it.originalPrice) || 0).toFixed(2)}</span>
                 <span className="new">${(parseFloat(it.price) || 0).toFixed(2)}</span>
               </div>
            </div>
            <div className="actions">
              <button
                title="Remove"
                onClick={async () => {
                  try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/cart/${it.id}`, {
                      method: "DELETE",
                      headers: {
                        "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                      }
                    });

                    if (response.ok) {
                      const data = await response.json();
                      if (data.status === 'success') {
                        // Remove item from local state immediately
                        const updatedCartItems = cartItems.filter(item => item.id !== it.id);
                        setCartItems(updatedCartItems);
                        console.log('Item removed from cart successfully');
                      } else {
                        console.error('Failed to remove item:', data.message);
                      }
                    } else {
                      console.error('Failed to remove item from cart');
                    }
                  } catch (error) {
                    console.error('Error removing item from cart:', error);
                  }
                }}
                disabled={cartLoading}
              >
                <img
                  src="/dustbin.svg"
                  alt=""
                  style={{ width: "18px", height: "18px" }}
                />
              </button>
            </div>
          </div>
        ))} */}

        {/* Coupon Component */}
        <Coupon
          appliedCoupon={appliedCoupon}
          onApply={handleApplyCoupon}
          onRemove={handleRemoveCoupon}
          isLoading={localCouponLoading || couponLoading}
          error={couponError}
          success={couponSuccess}
          orderTotal={subtotal}
          pendingCouponCode={pendingCouponCode}
          setPendingCouponCode={setPendingCouponCode}
        />

        {/* Order Summary */}
        <div className="summary">
          <h4>Order Summary</h4>
          <div className="row">
            <span>Subtotal</span>
            <span>${(subtotal || 0).toFixed(2)}</span>
          </div>
          {/* <div className="row">
            <span>Delivery fee</span>
            <span>${(deliveryFee || 0).toFixed(2)}</span>
          </div> */}
          {appliedCoupon && (
            <div className="row" style={{ color: 'green', fontWeight: '600' }}>
              <span>Coupon Discount ({appliedCoupon.code}):</span>
              <span>-${(discount || 0).toFixed(2)}</span>
            </div>
          )}
        </div>

        <hr />

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
              ${(discount || 0).toFixed(2)}
            </span>
          </div>
        )}

        <div className="row total" style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#333',
          padding: '16px 0',
          borderTop: '2px solid #E0E0E0',
          borderBottom: '2px solid #E0E0E0',
          marginBottom: '16px'
        }}>
          <span>Final Total:</span>
          <span style={{ color: '#6a0dad' }}>${grandTotal}</span>
        </div>

        <p className="terms">
          By placing this order, you are agreeing to Terms and Conditions.
        </p>
        <button
          className="proceed"
          onClick={handleProceed}
          disabled={pendingCouponCode.trim() && !appliedCoupon}
          style={{
            opacity: pendingCouponCode.trim() && !appliedCoupon ? 0.6 : 1,
            cursor: pendingCouponCode.trim() && !appliedCoupon ? 'not-allowed' : 'pointer'
          }}
        >
          {pendingCouponCode.trim() && !appliedCoupon ? 'Apply Coupon First' : 'Proceed'}
        </button>
      </div>
    </div>
  );
}
