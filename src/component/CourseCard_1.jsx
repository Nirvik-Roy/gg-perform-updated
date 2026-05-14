import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";
import "./CourseCard.css"; // External CSS

// Export static course array for backward compatibility with ViewSlot and FixedSchedule components
export const Courses = [
  {
    id: 1,
    name: "Course 1",
    content: "Resource only",
    status: "Completed",
    time: null,
    image: "/course.png",
  },
  {
    id: 2,
    name: "Course 2",
    content: "Live session",
    status: "",
    time: "fixed",
    image: "/course.png",
  },
  {
    id: 3,
    name: "Course 3",
    content: "Live session",
    status: "Completed",
    time: "fixed",
    image: "/course.png",
  },
  {
    id: 4,
    name: "Course 4",
    content: "Live session",
    status: "In Progress",
    time: "fixed",
    image: "/course.png",
  },
  {
    id: 5,
    name: "Course 5",
    content: "Live session",
    status: "In Progress",
    time: "flexible",
    image: "/course.png",
  },
];

const CourseCard = ({ courseData }) => {
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStatusColor = (status) => {
    if (!status) return "";
    return status.toLowerCase() === "completed"
      ? "status-completed"
      : "status-inprogress";
  };

  const getContentColor = (content) =>
    content?.toLowerCase().includes("resource")
      ? "content-resource"
      : "content-live";

  const getTimeColor = (time) =>
    time?.toLowerCase() === "fixed"
      ? "time-fixed"
      : "time-flexible";

  const handleAddReview = (course) => {
    setSelectedCourse(course);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="course-card-container">
      {courseData.map((item, index) => {
        if (width <= 468) {
          return (
            <div key={index} className="course-item">
              {/* Left Section: Image */}
              <img
                src={item.image}
                alt={item.name}
                className="course-image"
              />

              {/* Right Section: Content */}
              <div className="course-right-section">
                {/* Top Section: Name and Button */}
                <div className="course-top-section">
                  <h3 className="course-name">{item.name}</h3>
 
                  {/* Button */}
                  {item.content.toLowerCase().includes("resource") ? (
                    <div className="course-buttons-container">
                       {/* <button 
                        className="course-review-button"
                        onClick={() => handleAddReview(item)}
                      >
                        Add Review
                      </button> */}
                      <button className="course-button">
                        Download
                        <img
                          src="/downloads.png"
                          alt="download"
                          className="button-icon"
                        />
                      </button>
                     
                    </div>
                  ) : (
                    <button
                      className="course-button"
                      onClick={() => {
                        const slug = item.name.replace(/\s+/g, '-').toLowerCase();
                        const path =
                          item.time?.toLowerCase() === "fixed"
                            ? `/MyAccount/courses/fixed/${slug}`
                            : `/MyAccount/courses/${slug}`;
                        navigate(path);
                      }}
                    >
                      View Slots
                      <img
                        src="/export.png"
                        alt="view"
                        className="button-icon"
                      />
                    </button>
                  )}
                </div>

                {/* Bottom Section: Tags */}
                <div className="course-tags-section">
                  {item.content && (
                    <span className={`course-tag ${getContentColor(item.content)}`}>
                      {item.content.toLowerCase().includes("live")
                        ? "Live Sessions"
                        : "Resource Only"}
                    </span>
                  )}
                  {item.time && (
                    <span className={`course-tag ${getTimeColor(item.time)}`}>
                      {item.time.charAt(0).toUpperCase() + item.time.slice(1)}
                    </span>
                  )}
                  {item.status && (
                    <span className={`course-tag ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div key={index} className="course-item">
              <div className="course-left">
                <img
                  src={item.image}
                  alt={item.name}
                  className="course-image"
                />
                <div>
                  <div className="course-tags">
                    <h3 className="course-name">{item.name}</h3>
                    
                    {item.content && (
                      <span className={`course-tag ${getContentColor(item.content)}`}>
                        {item.content.toLowerCase().includes("live")
                          ? "Live Sessions"
                          : "Resource Only"}
                      </span>
                    )}
                    {item.time && (
                      <span className={`course-tag ${getTimeColor(item.time)}`}>
                        {item.time.charAt(0).toUpperCase() + item.time.slice(1)}
                      </span>
                    )}
                    {item.status && (
                      <span className={`course-tag ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right-side Button */}
              {item.content.toLowerCase().includes("resource") ? (
                <div className="course-buttons-container">
                  {/* <button 
                    className="course-review-button"
                    onClick={() => handleAddReview(item)}
                  >
                    Add Review
                  </button> */}
                  <button className="course-button">
                    Download
                    <img
                      src="/downloads.png"
                      alt="download"
                      className="button-icon"
                    />
                  </button>
                </div>
              ) : (
                <button
                  className="course-button"
                  onClick={() => {
                    const slug = item.name.replace(/\s+/g, '-').toLowerCase();
                    const path =
                      item.time?.toLowerCase() === "fixed"
                        ? `/MyAccount/courses/fixed/${slug}`
                        : `/MyAccount/courses/${slug}`;
                    navigate(path);
                  }}
                >
                  View Slots
                  <img
                    src="/export.png"
                    alt="view"
                    className="button-icon"
                  />
                </button>
              )}
            </div>
          )
        }
      })}
      
      {/* <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        courseName={selectedCourse?.name}
        courseId={selectedCourse?.id}
      /> */}
    </div>
  );
};

export default CourseCard;

// StarRating component for displaying ratings
function StarRating({ rating = 0, maxStars = 5, reviews = 0 }) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full-star">★</span>);
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half-star">
          <span className="star-half">★</span>
          <span className="star-empty">☆</span>
        </span>
      );
    }

    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty-star">☆</span>);
    }

    return stars;
  };

  return (
    <div className="star-rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
      {renderStars()}
      <span className="rating-value" style={{ fontSize: '12px', color: '#666' }}>
        ({reviews || 0} Review{(reviews || 0) !== 1 ? 's' : ''})
      </span>
    </div>
  );
}
