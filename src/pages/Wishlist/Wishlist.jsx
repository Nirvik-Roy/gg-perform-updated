
// import React from 'react'
// import { useEffect } from 'react';
// import { useBanner } from '../../context/BannerContext';
// import { useWishlist } from '../../context/WishlistContext';
// import { useCart } from '../../context/CartContext';
// import './Wishlist.css';


// export default function Wishlist() {
//   const { wishlistItems, removeFromWishlist } = useWishlist();
//   const { addToCart } = useCart();

//     const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
//  useEffect(() => {
//     setBannerTitle("Wishlist");
//     setBreadcrumb("Wishlist");
//     setBannerImage('/other-Banner.png');
//   }, []);

//   return (
//     <div className="wishlist-container">
//       <div className="wishlist-header">
//         <h2>My wishlist</h2>
//         <span>{wishlistItems.length} items</span>
//       </div>

//       {wishlistItems.map((item) => (
//         <div key={item.id} className="wishlist-card">
//           <div className="wishlist-info">
//             <img src={item.image} alt={item.title} className="wishlist-img" />

//             <div className="wishlist-details">
//               {/* badges / rating / title exactly as in cart */}
//               <h4>{item.title}</h4>
//               <div className="price">
//                 <span className="original">${item.originalPrice}</span>
//                 <span className="discounted">${item.price}</span>
//               </div>
//             </div>
//           </div>

//           <div className="wishlist-actions">
//             <button
//               className="delete-btn"
//               onClick={() => removeFromWishlist(item.id)}
//               title="Remove from wishlist"
//             >
//               🗑
//             </button>
//             <button
//               className="add-to-cart"
//               onClick={() => addToCart(item)}
//             >
//               Add to cart
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useBanner } from '../../context/BannerContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './Wishlist.css';

export default function Wishlist() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const {
    wishlistItems,
    removeFromWishlist,
    loading: wishlistLoading,
    error: wishlistError,
    clearError,
    isAuthenticated
  } = useWishlist();
  
  const { refreshCart } = useCart();
  
  // Separate loading state for add to cart operations
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  useEffect(() => {
    setBannerTitle("Wishlist");
    setBreadcrumb("Wishlist");
    setBannerImage('/other-Banner.png');
  }, []);

  const getTagsFromArray = (tagArray) => {
    return (tagArray || []).map((tag) => {
      // Handle tags from API response object fields
      if (tag === 'Live Sessions') return { label: tag, className: 'wishlist-tag-live' };
      if (tag === 'fixed') return { label: tag, className: 'wishlist-tag-fixed' };
      if (tag === 'Resource Only') return { label: tag, className: 'wishlist-tag-resource' };
      if (tag === 'flexible') return { label: tag, className: 'wishlist-tag-schedule' };

      // Default case for any other tags from API
      return { label: tag, className: 'wishlist-tag-default' };
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

  const handleAddToCart = async (item) => {
    if (!isAuthenticated()) {
      return;
    }

    setAddToCartLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/cart`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ course_id: item.course_id || item.id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Add to cart response:', data);

      if (data.status === 'success') {
        console.log('Item added to cart successfully');
        
        // Remove from wishlist after adding to cart
        await removeFromWishlist(item.id);
        
        // Refresh cart to show the newly added item
        if (refreshCart) {
          await refreshCart();
        }
      } else {
        throw new Error(data.message || 'Failed to add item to cart');
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
    } finally {
      setAddToCartLoading(false);
    }
  };

  // If not authenticated, show login message
  if (!isAuthenticated()) {
    return (
      <div className="wishlist-wrapper">
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666'
        }}>
          <h2>Please Login</h2>
          <p>You need to be logged in to view your wishlist.</p>
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
    <div className="wishlist-wrapper">
      {/* Error Display */}
      {wishlistError && (
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
          <span>{wishlistError}</span>
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
      {wishlistLoading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666'
        }}>
          Loading wishlist items...
        </div>
      )}

      <div className="wishlist-topbar">
        <h2>My wishlist</h2>
        <span>{wishlistItems.length} items</span>
      </div>

      {/* Empty Wishlist State */}
      {!wishlistLoading && wishlistItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666'
        }}>
          <h3>Your wishlist is empty</h3>
          <p>Add some courses to your wishlist to get started!</p>
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

      {/* Wishlist Items */}
      {wishlistItems.map((item) => {
        // Map API response to display format
        const displayItem = {
          id: item.course?.id,
          title: item.course?.course_name || 'Unknown Course',
          image: item.course?.featured_image || '/course.png',
          price: item.course?.sale_price || 0,
          originalPrice: item.course?.original_price || 0,
          // rating: item.course?.rating || item.course?.course_rating || item.rating || 0,
          // reviews: item.course?.reviews || item.course?.course_reviews || item.reviews || 0,
          tag: []
        };

        // Extract tags from API response object fields
        if (item.course?.course_type) {
          displayItem.tag.push(item.course.course_type);
        }
        if (item.course?.live_session_type) {
          displayItem.tag.push(item.course.live_session_type);
        }
        if (item.course?.tags && Array.isArray(item.course.tags)) {
          displayItem.tag.push(...item.course.tags);
        }

        const tags = getTagsFromArray(displayItem.tag);

        return (
          <div key={item.id} className="wishlist-item">
            <div className="wishlist-item-info">
              <img
                src={displayItem.image}
                alt={displayItem.title}
                className="wishlist-item-img"
                onError={(e) => {
                  e.target.src = '/course.png';
                }}
              />

              <div className="wishlist-item-details">
                <div className="wishlist-labels">
                  {tags.map((tag, index) => (
                    <span key={index} className={`wishlist-label ${tag.className}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>

                {/* <div className="wishlist-rating" style={{ marginTop: '15px' }}>
                  {renderStars(displayItem.rating)}
                  <span className="review" style={{ color: '#777', fontSize: '14px', marginTop: '5px' }}>({displayItem.reviews}+ Reviews)</span>
                </div> */}

                <h4 className="wishlist-title">{displayItem.title}</h4>

                <div className="wishlist-price">
                  <span className="wishlist-price-old">${parseFloat(displayItem.originalPrice).toFixed(2)}</span>
                  <span className="wishlist-price-new">${parseFloat(displayItem.price).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="wishlist-buttons">
              <button
                className="wishlist-remove-btn"
                onClick={() => removeFromWishlist(item.course?.id)}
                disabled={wishlistLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: wishlistLoading ? 'not-allowed' : 'pointer',
                  opacity: wishlistLoading ? 0.5 : 1
                }}
                title="Remove from wishlist"
              >
                <img src="/dustbin.svg" alt="" />
              </button>
              <button
                className="wishlist-cart-btn"
                onClick={() => handleAddToCart({
                  id: displayItem.id,
                  course_id: item.course?.id,
                  ...displayItem
                })}
                disabled={addToCartLoading}
                style={{
                  opacity: addToCartLoading ? 0.5 : 1,
                  cursor: addToCartLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {addToCartLoading ? 'Processing...' : 'Add to cart'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
