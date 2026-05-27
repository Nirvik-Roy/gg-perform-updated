import React, { useEffect, useState } from "react";
import { useBanner } from "../../context/BannerContext";
import { useCart } from "../../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
// import { useCouponContext } from "../../context/CouponContext";
// import Coupon from "../../component/Coupon";
import "./AddToCart.css";

function AddToCart() {
  const [quantities, setQuantities] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const {
    cartItems,
    removeFromCart,
    loading: cartLoading,
    error: cartError,
    clearError,
    isAuthenticated,
    refreshCart
  } = useCart();

  // Track which item is being deleted for skeleton animation
  const [deletingItemId, setDeletingItemId] = useState(null);

  // const {
  //   appliedCoupon,
  //   isLoading: couponLoading,
  //   error: couponError,
  //   success: couponSuccess,
  //   applyCoupon,
  //   removeCoupon,
  //   clearMessages
  // } = useCouponContext();

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item?.quantity || 0), 0);
  // const deliveryFee = 4.78;

  // // Calculate discount properly
  // const calculateDiscount = () => {
  //   if (!appliedCoupon) return 0;

  //   const couponValue = parseFloat(appliedCoupon.value);
  //   if (Number.isNaN(couponValue)) return 0;

  //   if (appliedCoupon.discount_type === 'percentage') {
  //     return (subtotal * couponValue) / 100;
  //   }
  //   return couponValue;
  // };

  // const discount = Number(calculateDiscount()) || 0;
  // const total = subtotal + deliveryFee - discount;
  const total = subtotal;



  const handleRemoveFromCart = async (itemId) => {
    // Prevent multiple simultaneous deletions
    if (deletingItemId !== null) {
      return;
    }

    setDeletingItemId(itemId);
    try {
      await removeFromCart(itemId);
    } finally {
      setDeletingItemId(null);
    }
  };

  useEffect(() => {
    setBannerTitle("Cart");
    setBreadcrumb("Cart");
    setBannerImage("/other-banner.png");
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);


  // Initialize quantities from cartItems
  // Initialize from item.quantity
  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach(item => {
      if (item.itemType === 'product') {
        initialQuantities[item.id] = item.quantity;
      }
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  // Add this handler
  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;

    

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      if (!response.ok) {
        // Revert on failure
        setQuantities(prev => ({ ...prev, [itemId]: newQty }));
        setQuantities(prev => ({ ...prev, [itemId]: prev[itemId] }));
        console.error("Failed to update quantity");
      }
      refreshCart()
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  const getTagsFromArray = (tagArray) => {
    return (tagArray || []).map((tag) => {
      // Handle tags from API response object fields
      if (tag === 'Live Sessions') return { label: tag, className: 'tag-live' };
      if (tag === 'fixed') return { label: tag, className: 'tag-fixed' };
      if (tag === 'Resource Only') return { label: tag, className: 'tag-resource' };
      if (tag === 'flexible') return { label: tag, className: 'tag-schedule' };

      // Default case for any other tags from API
      return { label: tag, className: 'tag-default' };
    });
  };



  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating) || 0;
    for (let i = 0; i < 5; i++) {
      stars.push(<span key={i} style={{ color: i < numRating ? '#FFD700' : '#ccc' }}>★</span>);
    }
    return stars;
  };

  // const handleApplyCoupon = async (code) => {
  //   if (!code.trim()) {
  //     setCartError('Please enter a coupon code');
  //     return false;
  //   }

  //   if (!checkAuth()) {
  //     setCartError('Please login to apply coupons');
  //     return;
  //   }

  //   setCartLoading(true);
  //   setCartError(null);

  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/apply-coupon`, {
  //       method: "POST",
  //       headers: {
  //         "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
  //         "Content-Type": "application/json",
  //         "Accept": "application/json",
  //       },
  //       body: JSON.stringify({
  //         code: code.trim()
  //       })
  //     });



  //     const data = await response.json();
  //     console.log('Coupon API response:', data);

  //     if (data.status === 'success') {
  //       // The API validates the coupon and returns the discount info
  //       const discountAmount = data.data?.discount_amount || 0;
  //       const discountType = data.data?.discount_type || 'fixed';
  //       const couponValue = data.data?.value || 0;
  //       const couponCodeFromAPI = data.data?.code || code.trim();

  //       // Calculate final discount based on API response
  //       let finalDiscount = 0;
  //       if (discountType === 'percentage') {
  //         finalDiscount = (subtotal * couponValue) / 100;
  //       } else {
  //         finalDiscount = couponValue;
  //       }

  //       // Create the applied coupon object with data from API
  //       const appliedCouponData = {
  //         code: couponCodeFromAPI,
  //         discountAmount: finalDiscount,
  //         discount_type: discountType,
  //         value: couponValue
  //       };

  //       // Update the coupon context with the validated data from API
  //       if (applyCoupon) {
  //         // Pass the coupon data directly to ensure proper discount calculation
  //       const couponData = {
  //         code: couponCodeFromAPI,
  //         discount_type: discountType,
  //         value: couponValue
  //       };
  //       applyCoupon(couponCodeFromAPI, subtotal, couponData);
  //     }

  //       console.log('Coupon applied successfully:', appliedCouponData);
  //       return true;
  //     } else {
  //       throw new Error(data.message || 'Invalid coupon code');
  //     }
  //   } catch (err) {
  //     console.error('Error applying coupon:', err);
  //       setCartError(err.message || 'Failed to apply coupon');
  //       return false;
  //     } finally {
  //       setCartLoading(false);
  //     }
  //   };

  //   const handleRemoveCoupon = () => {
  //     // Update the coupon context to remove the coupon
  //     if (removeCoupon) {
  //       removeCoupon();
  //     }

  //     console.log('Coupon removed successfully');
  //   };



  // If not authenticated, show login message
  if (!isAuthenticated()) {
    return (
      <div className="cart-container">
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666'
        }}>
          <h2>Please Login</h2>
          <p>You need to be logged in to view your cart.</p>
          <button
            onClick={() => navigate('/auth', { state: { route: location.pathname } })}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6600CC',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
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

      <div className="cart-list">
        <div className="cart-header">
          <h2>Cart</h2>
          <span>{cartItems.length} items</span>
        </div>

        {/* Loading Skeleton */}
        {cartLoading && (
          <div className="cart-loading-container">
            {[1].map((index) => (
              <div key={index} className="cart-loading-item">
                <div className="cart-loading-image"></div>
                <div className="cart-loading-content">
                  <div className="cart-loading-tags">
                    <div className="cart-loading-tag"></div>
                    <div className="cart-loading-tag"></div>
                  </div>
                  <div className="cart-loading-rating">
                    <div className="cart-loading-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="cart-loading-star"></div>
                      ))}
                    </div>
                    <div className="cart-loading-reviews"></div>
                  </div>
                  <div className="cart-loading-title"></div>
                  <div className="cart-loading-price">
                    <div className="cart-loading-old-price"></div>
                    <div className="cart-loading-new-price"></div>
                  </div>
                </div>
                <div className="cart-loading-button"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Cart State */}
        {!cartLoading && cartItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            <h3>Your cart is empty</h3>
            <p>Add some courses to get started!</p>
            <button
              onClick={() => navigate('/training')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6600CC',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                marginTop: '16px'
              }}
            >
              Browse Courses
            </button>
          </div>
        )}

        {/* Cart Items */}
        {cartItems.map((item, index) => {
          const tags = getTagsFromArray(item.tag);
          // Use strict comparison and ensure both values are defined
          const isDeleting = deletingItemId !== null &&
            deletingItemId !== undefined &&
            item.id !== null &&
            item.id !== undefined &&
            deletingItemId === item.id;


          return (
            <div className={`cart-item ${isDeleting ? 'deleting' : ''}`} key={`cart-item-${item.id}`}>
              {isDeleting && (
                <div className="cart-item-skeleton-overlay">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-tags">
                      <div className="skeleton-tag"></div>
                      <div className="skeleton-tag"></div>
                    </div>
                    <div className="skeleton-title"></div>
                    <div className="skeleton-price">
                      <div className="skeleton-old-price"></div>
                      <div className="skeleton-new-price"></div>
                    </div>
                  </div>
                  <div className="skeleton-action"></div>
                </div>
              )}

              <img
                src={item.image}
                alt={item.title}
                onError={(e) => {
                  e.target.src = '/course.png';
                }}
                style={{ opacity: isDeleting ? 0.3 : 1 }}
              />
              <div className="item-details" style={{ opacity: isDeleting ? 0.3 : 1 }}>
                <div className="labels">
                  {tags.map((tag, index) => (
                    <span key={index} className={`label ${tag.className}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                {/* <div className="rating" style={{ marginTop: '15px' }}>
                  {renderStars(item.rating)}
                  <span className="review" style={{ color: '#777', fontSize: '14px', marginTop: '5px' }}>({item.reviews}+ Reviews)</span>
                </div> */}
                <h4>{item.title}</h4>
                <p>{item?.description}</p>
                <div className="price">
                  <span className="old-price">${parseFloat(item.originalPrice).toFixed(2)}</span>
                  <span className="new-price">${parseFloat(item.price).toFixed(2)}</span>
                </div>
                {item?.itemType === 'product' && (
                  <>
                  
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '10px'
                    }}>
                      <button
                        onClick={() => handleQuantityChange(item.id, quantities[item.id] - 1)}
                        disabled={isDeleting || (quantities[item.id] ) <= 1}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: '1px solid #6600CC',
                          backgroundColor: 'white',
                          color: '#6600CC',
                          fontSize: '18px',
                          cursor: (quantities[item.id] ) <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: (quantities[item.id] ) <= 1 ? 0.4 : 1,
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                        {quantities[item.id] }
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, quantities[item.id] + 1)}
                        disabled={isDeleting}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: '1px solid #6600CC',
                          backgroundColor: '#6600CC',
                          color: 'white',
                          fontSize: '18px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </>
                )}
               
              </div>
              <div className="item-actions" style={{ opacity: isDeleting ? 0.3 : 1 }}>
                <button
                  title="Remove"
                  onClick={() => handleRemoveFromCart(item.id)}
                  disabled={isDeleting}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    opacity: isDeleting ? 0.5 : 1
                  }}
                >
                  <img src="/dustbin.svg" alt="Remove" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary - Only show if there are items */}
      {cartItems.length > 0 && (
        <div className="cart-summary">
          <div className="cart-summary-header">
            <h3>Cart Total</h3>
            <span>{cartItems.length} items</span>
          </div>

          {/* <Coupon
            appliedCoupon={appliedCoupon}
            onApply={handleApplyCoupon}
            onRemove={handleRemoveCoupon}
            isLoading={cartLoading}
            error={cartError}
            success={couponSuccess}
            orderTotal={subtotal}
          /> */}

          <div className="order-summary-heading">Order Summary</div>

          <div className="summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {/* <div className="summary-row"> */}
            {/* <span>Delivery Fee:</span> */}
            {/* <span>${deliveryFee.toFixed(2)}</span> */}
            {/* </div> */}
            {/* {appliedCoupon && (
              <div className="summary-row" style={{ color: 'green', fontWeight: '600' }}>
                <span>Coupon Discount ({appliedCoupon.code}):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )} */}
          </div>

          <div className="summary-separator"></div>

          {/* Show savings prominently when coupon is applied */}
          {/* {appliedCoupon && discount > 0 && (
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
          )} */}

          <div className="total-row" style={{
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

          <p>By placing this order, you are agreeing to Terms and Conditions.</p>

          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
            disabled={cartLoading}
            style={{
              opacity: cartLoading ? 0.5 : 1,
              cursor: cartLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {cartLoading ? 'Processing...' : 'Proceed to checkout'}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddToCart;
