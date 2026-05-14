import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FixedScheduleCard from "../../../component/FixedSchedule";
import { useBanner } from "../../../context/BannerContext";
import "./FixedSchedule.css"; // Optional for styling

const FixedSlot = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const courseName = name.replace(/-/g, " ");
  
  const [courseObj, setCourseObj] = useState(null);
  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBannerTitle("My Account");
    setBreadcrumb("My Account");
    setBannerImage("/other-banner.png");
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/courses`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          // Find the course by name
          const foundCourse = data.data.find(course => 
            course.course_name.toLowerCase() === courseName.toLowerCase()
          );
          
          if (foundCourse) {
            setCourseObj({
              id: foundCourse.id,
              name: foundCourse.course_name,
              content: foundCourse.course_type,
              time: foundCourse.live_session_type,
              image: foundCourse.featured_image || "/course.png",
            });

            // Use actual sessions data from API
            if (foundCourse.sessions && foundCourse.sessions.length > 0) {
              const transformedSessions = foundCourse.sessions.map((session, index) => ({
                sessionName: `Session ${index + 1}`,
                date: new Date(session.date).toLocaleDateString('en-GB'),
                time: session.start_time,
                meetingLink: session.zoom_join_url, // Use the actual zoom_join_url from API
              }));
              setSessionsData(transformedSessions);
            } else {
              // Fallback if no sessions data
              setSessionsData([]);
            }
          } else {
            setError('Course not found');
          }
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching course data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseName]);

  // Loading state
  if (loading) {
    return (
      <div className="viewslots-container">
        <div className="loading-message">Loading course data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="viewslots-container">
        <div className="error-message">
          Error loading course: {error}
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
    <div className="viewslots-container">
      <h2 className="viewslots-title">
      <img
          src="/arrow.png"
          alt="arrow"
          className="course-title-arrow"
          onClick={() => navigate('/MyAccount/courses')}
        />
        {courseObj ? courseObj.name : "Course Not Found"}
        
        <span className="viewslots-badge">
          {courseObj ? courseObj.time : ""}
        </span>
      </h2>

      <FixedScheduleCard sessions={sessionsData} />
    </div>
  );
};

export default FixedSlot;
