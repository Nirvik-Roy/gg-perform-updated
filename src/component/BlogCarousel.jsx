import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../css/TopCourses.css"; // For section + pagination styling
import "../css/CourseCard.css"; // For card styling
import "../css/BlogCarousel.css";
import { useBlog } from '../context/BlogContext';

export default function BlogCarousel() {
  const { blogs, loading, error } = useBlog();
  const [topBlogs, setTopBlogs] = useState([]);

  useEffect(() => {
    // Get top 5 blogs (you can modify this logic as needed)
    const topFive = blogs.slice(0, 5);
    setTopBlogs(topFive);
  }, [blogs]);

  // Show loading state
  if (loading) {
    return (
      <div className="top-courses-section">
        <div className="new-courses-header">
          <h2>Blogs</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="top-courses-section">
        <div className="new-courses-header">
          <h2>Blogs</h2>
        </div>
        <div className="error-container">
          <h3>Error Loading Blogs</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="top-courses-section">
      <div className="new-courses-header">
        <h2>Blogs</h2>
      </div>

      <Swiper
        spaceBetween={20}
        loop={true}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        breakpoints={{
          0: {
            slidesPerView: 1, // show 1 card + a peek
          },
          480: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[Autoplay, Pagination]}
        className="top-courses-swiper"
      >
        {topBlogs.map((post) => {
          // Debug: Log the post data
          console.log('Post data:', { title: post.title, category: post.category, id: post.id });
          
          // Test with just title first to see if navigation works
          const titlePart = encodeURIComponent(post.title || `post-${post.id}`);
          
          // Try both formats
          const blogUrlWithCategory = `/blog1/${encodeURIComponent(post.category || 'general')}/${titlePart}`;
          const blogUrlTitleOnly = `/blog1/${titlePart}`;
          
          console.log('URLs generated:', { 
            withCategory: blogUrlWithCategory, 
            titleOnly: blogUrlTitleOnly,
            postTitle: post.title,
            postCategory: post.category
          });
          
          // Use the category version
          const blogUrl = blogUrlWithCategory;

          return (
            <SwiperSlide key={post.id}>
              <div className="course-card">
                <div className="card-image">
                  <img src={post.image} alt={post.title} />
                </div>

                <div className="card-meta">
                  <span className="card-category">{post.category}</span>
                  <span className="card-date">{post.date}</span>
                </div>

                <h2 className="card-title">{post.title}</h2>
                <p className="card-desc">{post.description}</p>
                <div>
                  <Link
                    to={blogUrl}
                    className="read-more"
                    style={{
                      color: "#6600CC",
                      fontWeight: "700",
                      fontSize: "16px",
                      display: "block",
                      marginBottom: "5px",
                      textDecoration: "none"
                    }}
                    onClick={() => console.log('Clicking Read More, navigating to:', blogUrl)}
                  >
                    Read More...
                  </Link>
                  {/* <small style={{fontSize: "10px", color: "#666"}}>
                    URL: {blogUrl}
                  </small> */}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
