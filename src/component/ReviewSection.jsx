import React, { useState, useEffect } from "react";
import "../css/ReviewSection.css";

export default function ReviewSection({ rating, courseId, onShowAuth }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    feedback: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('gg website user');
    return userStr ? JSON.parse(userStr) : null;
  };

  // Get token from localStorage
  const getToken = () => {
    const tokenStr = localStorage.getItem('gg website token');
    return tokenStr ? JSON.parse(tokenStr) : null;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return getCurrentUser() && getToken();
  };

  // Show login popup (you can replace this with your actual login modal)
  const showLoginPopup = () => {
    if (onShowAuth) {
      onShowAuth();
    } else {
      // Fallback to alert if no auth handler provided
      alert("Please login to add a review");
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the correct API endpoint
        const apiUrl = `${import.meta.env.VITE_API_BASE_URL}frontend/courses/${courseId}/reviews`;
        console.log('Fetching reviews from:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const data = await response.json();
        console.log("Reviews API response:", data);

        if (data.status === 'success') {
          // Check if data.data exists and is an array
          if (data.data && Array.isArray(data.data)) {
            // Transform API data to match the expected format
            const transformedReviews = data.data.map(review => ({
              id: review.id,
              name: review.user?.name || 'Anonymous',
              userId: review.user?.id || null,
              stars: review.rating || 0,
              comment: review.feedback || '',
              date: review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Unknown date',
              avatar: "/pro.png" // Default avatar since API doesn't provide one
            }));
            setReviews(transformedReviews);
          } else {
            // Handle empty reviews case
            setReviews([]);
          }
        } else {
          setError(data.message || 'Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchReviews();
    }
  }, [courseId]);

  const handleAddReview = () => {
    if (!isAuthenticated()) {
      showLoginPopup();
      return;
    }
    setShowAddReview(true);
    setEditingReview(null);
    setFormData({ rating: 5, feedback: "" });
  };

  const handleEditReview = (review) => {
    if (!isAuthenticated()) {
      showLoginPopup();
      return;
    }
    setEditingReview(review);
    setShowAddReview(true);
    setFormData({ rating: review.stars, feedback: review.comment });
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setShowDeletePopup(true);
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      setSubmitting(true);
      setError(null); // Clear any previous errors
      const token = getToken();
      const deleteUrl = `${import.meta.env.VITE_API_BASE_URL}frontend/courses/reviews/${reviewToDelete.id}`;
      
      console.log('Deleting review:', { url: deleteUrl, reviewId: reviewToDelete.id });
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Delete review response:', data);

      if (response.ok && data.status === 'success') {
        // Remove the review from the list
        setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewToDelete.id));
        setShowDeletePopup(false);
        setReviewToDelete(null);
        console.log('Review deleted successfully');
      } else {
        const errorMessage = data.message || 'Failed to delete review';
        console.error('Failed to delete review:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      showLoginPopup();
      return;
    }

    if (!formData.feedback.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null); // Clear any previous errors
      const token = getToken();
      const currentUser = getCurrentUser();

      const requestBody = {
        course_id: parseInt(courseId),
        rating: formData.rating,
        feedback: formData.feedback.trim()
      };

      let url = `${import.meta.env.VITE_API_BASE_URL}frontend/courses/reviews`;
      let method = 'POST';

      if (editingReview) {
        url = `${import.meta.env.VITE_API_BASE_URL}frontend/courses/reviews/${editingReview.id}`;
        method = 'PUT';
      }

      console.log('Submitting review:', { url, method, requestBody, token: token ? 'present' : 'missing' });

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Review submission response:', data);

      if (response.ok && data.status === 'success') {
        if (editingReview) {
          // Update existing review in the list
          setReviews(prevReviews => prevReviews.map(review => 
            review.id === editingReview.id 
              ? {
                  ...review,
                  stars: formData.rating,
                  comment: formData.feedback.trim(),
                  date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              : review
          ));
          console.log('Review updated successfully');
        } else {
          // Add new review to the list
          const newReview = {
            id: data.data?.id || Date.now(), // Use API response ID or fallback
            name: currentUser.name,
            userId: currentUser.id,
            stars: formData.rating,
            comment: formData.feedback.trim(),
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            avatar: "/pro.png"
          };
          setReviews(prevReviews => [newReview, ...prevReviews]);
          console.log('Review added successfully');
        }
        
        setShowAddReview(false);
        setEditingReview(null);
        setFormData({ rating: 5, feedback: "" });
      } else {
        const errorMessage = data.message || `Failed to ${editingReview ? 'update' : 'add'} review`;
        console.error('Review submission failed:', errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowAddReview(false);
    setEditingReview(null);
    setFormData({ rating: 5, feedback: "" });
  };

  const stars = [5, 4, 3, 2, 1];
  const total = reviews.length;
  const currentUser = getCurrentUser();

  if (loading) {
    return (
      <div className="review-section-container">
        <div className="review-section-layout">
          {/* Left Summary Section */}
          <div className="review-section-summary">
            <h4>Summary</h4>
            <div className="review-section-rating-value">{rating}{<span style={{color:'#F2E01B'}}>★</span>}</div>
            <div className="review-section-total-reviews">Loading reviews...</div>
          </div>
          
          {/* Right Section */}
          <div className="review-section-right-column">
            <div className="review-section-grid">
              <div className="review-section-card">
                <div className="review-section-card-header">
                  <div className="review-section-avatar-name">
                    <img src="/pro.png" alt="user" />
                    <h5>Loading...</h5>
                  </div>
                  <div className="review-section-meta-content">
                    <div className="review-section-meta">
                      <div className="review-section-stars">★★★★★</div>
                      <div className="review-section-date">Loading...</div>
                    </div>
                    <div className="review-section-comment">Loading review content...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-section-container">
        <div className="review-section-layout">
          {/* Left Summary Section */}
          <div className="review-section-summary">
            <h4>Summary</h4>
            <div className="review-section-rating-value">{rating}{<span style={{color:'#F2E01B'}}>★</span>}</div>
            <div className="review-section-total-reviews">0 Reviews</div>
          </div>
          
          {/* Right Section */}
          <div className="review-section-right-column">
          <div className="review-section-card-error">
               No reviews yet, be the first to review
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-section-container">
      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="review-section-popup-overlay">
          <div className="review-section-popup">
            <h4 className="review-section-popup-title">
              Delete Review
            </h4>
            <p className="review-section-popup-message">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="review-section-popup-buttons">
              <button
                onClick={handleDeleteReview}
                disabled={submitting}
                className="review-section-popup-delete-button"
              >
                {submitting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setReviewToDelete(null);
                }}
                className="review-section-popup-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="review-section-layout">
        {/* Left Column - Summary Section */}
        <div className="review-section-summary">
          <h4>Summary</h4>
          <div className="review-section-rating-value">{rating}{<span style={{color:'#F2E01B'}}>★</span>}</div>
          <div className="review-section-total-reviews">{total} Reviews</div>

          {stars.map((star) => {
            const count = reviews.filter((r) => r.stars === star).length;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="review-section-rating-bar-container">
                <div className="review-section-star-label">{star}★</div>
                <div className="review-section-rating-bar">
                  <div
                    className="review-section-rating-bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="review-section-star-count">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Right Column - Add Review + Review List */}
        <div className="review-section-right-column">
          {/* Top Section - Add Review */}
          <div className="review-section-add-review-container">
            {!showAddReview ? (
              <div>
                <button 
                  onClick={handleAddReview}
                  className="review-section-add-button"
                >
                  {isAuthenticated() ? 'Add Review' : 'Login to Add Review'}
                </button>
                {!isAuthenticated() && (
                  <p className="review-section-auth-note">
                    You need to be logged in to write a review
                  </p>
                )}
              </div>
            ) : (
              <div className="review-section-form-container">
                <h4 className="review-section-form-title">
                  {editingReview ? 'Edit Review' : 'Add Review'}
                </h4>
                <form onSubmit={handleSubmitReview} className="review-section-form">
                  <div className="review-section-form-group">
                    <label className="review-section-form-label">
                      Rating:
                    </label>
                    <div className="review-section-star-container">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className={`review-section-star-button ${star <= formData.rating ? 'active' : ''}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="review-section-form-group">
                    <label className="review-section-form-label">
                      Feedback:
                    </label>
                    <textarea
                      value={formData.feedback}
                      onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                      className="review-section-textarea"
                      placeholder="Share your experience with this course..."
                      required
                    />
                  </div>
                  
                  <div className="review-section-button-group">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="review-section-submit-button"
                    >
                      {submitting ? 'Submitting...' : (editingReview ? 'Update Review' : 'Submit Review')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="review-section-cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Section - Review List */}
          <div className="review-section-grid">
            {reviews.length > 0 ? (
              reviews.map((review, i) => (
                <div key={i} className="review-section-card">
                  <div className="review-section-card-header">
                    {/* Left: Image + Name */}
                    <div className="review-section-avatar-name">
                      <img src={review.avatar} alt="user" />
                      <h5>{review.name}</h5>
                    </div>

                    {/* Right: Stars, date, comment */}
                    <div className="review-section-meta-content">
                      <div className="review-section-meta">
                        <div className="review-section-stars">
                          {'★'.repeat(review.stars)}
                          {'☆'.repeat(5 - review.stars)}
                        </div>
                        <div className="review-section-date">Reviewed on {review.date}</div>
                      </div>
                      <div className="review-section-comment">{review.comment}</div>
                      
                      {/* Edit/Delete buttons for user's own reviews */}
                      {currentUser && review.userId === currentUser.id && (
                        <div className="review-section-action-buttons">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="review-section-edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(review)}
                            disabled={submitting}
                            className="review-section-delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="review-section-card">
                <div className="review-section-card-error">
                No reviews yet, be the first to review
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
