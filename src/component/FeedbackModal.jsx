import React, { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose, courseName, courseId }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleStarClick = (starIndex) => {
    setRating(starIndex + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }

    try {
      // Get user token from localStorage
      const tokenData = localStorage.getItem('gg website token');
      const userData = localStorage.getItem('gg website user');
      
      if (!tokenData || !userData) {
        alert('Please login to submit a review');
        onClose();
        return;
      }

      const token = JSON.parse(tokenData);
      const user = JSON.parse(userData);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/courses/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          feedback: feedback,
          course_id: courseId,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Review submitted successfully!');
        onClose();
        setRating(0);
        setFeedback('');
      } else {
        alert(data.message || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  const handleCancel = () => {
    onClose();
    setRating(0);
    setFeedback('');
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={handleCancel}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h3>We'd love your feedback</h3>
          <button className="feedback-modal-close" onClick={handleCancel}>
            ×
          </button>
        </div>
        
        <div className="feedback-modal-content">
          <p className="feedback-question">
            Based on your experience, how easy or difficult was it to interact with our company
          </p>
          
          <div className="star-rating">
            {[0, 1, 2, 3, 4].map((starIndex) => (
              <button
                key={starIndex}
                className={`star ${starIndex < rating ? 'filled' : 'empty'}`}
                onClick={() => handleStarClick(starIndex)}
              >
                ★
              </button>
            ))}
          </div>
          
          <div className="feedback-textarea-container">
            <label htmlFor="feedback-textarea">Share details of your experience</label>
            <textarea
              id="feedback-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl lacinia nunc, a fermentum nunc nulla at quam."
              rows={4}
            />
          </div>
          
          <div className="feedback-modal-buttons">
            <button className="feedback-modal-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="feedback-modal-share" onClick={handleSubmit}>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
