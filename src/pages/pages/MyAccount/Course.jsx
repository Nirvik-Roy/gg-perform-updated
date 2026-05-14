import React, { useState, useEffect } from "react";
import CourseCard from "../../../component/CourseCard_1";
import { useBanner } from "../../../context/BannerContext";

import "./Courses.css";

const statusOptions = ["All", "In Progress", "Completed"];

function Course() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBannerTitle("My Account");
    setBreadcrumb("My Account");
    setBannerImage("/other-banner.png");
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ggperform-api.webprismits.us/api/v1/frontend/courses');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          // Transform API data to match CourseCard component structure
          const transformedCourses = data.data.map(course => {
            // Calculate average rating from reviews array
            let averageRating = 0;
            let reviewCount = 0;
            
            if (course.reviews && course.reviews.length > 0) {
              const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
              averageRating = totalRating / course.reviews.length;
              reviewCount = course.reviews.length;
            }

            return {
              id: course.id,
              name: course.course_name,
              content: course.course_type, // "Live Sessions" or "Resource Only"
              status: "In Progress", // Default status - you can customize this logic
              time: course.live_session_type, // "fixed", "flexible", or null
              image: course.featured_image || "/course.png", // Use API image or fallback
              rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
              reviews: reviewCount, // Actual review count from API
              reviewsData: course.reviews || [], // Store actual reviews data
            };
          });
          
          setCourses(transformedCourses);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  const filteredCourses =
    selectedStatus === "All"
      ? courses
      : courses.filter(
        (course) =>
          course.status?.toLowerCase().trim() ===
          selectedStatus.toLowerCase().trim()
      );

  // Loading state
  if (loading) {
    return (
      <div className="course-container">
        <h2 className="course-title">Courses</h2>
        <div className="loading-message">Loading courses...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="course-container">
        <h2 className="course-title">Courses</h2>
        <div className="error-message">
          Error loading courses: {error}
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-container">
      <h2 className="course-title">Courses</h2>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`filter-button ${selectedStatus === status ? "active" : "inactive"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Render Filtered Courses */}
      {filteredCourses.length ? (
        <CourseCard courseData={filteredCourses} />
      ) : (
        <p className="no-courses">No courses found.</p>
      )}
    </div>
  );
}

export default Course;

