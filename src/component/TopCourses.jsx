import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../css/TopCourses.css";

import Card from "./Card"; // your card component
import { useTraining } from '../context/TrainingContext';
import { forceScrollToTop } from '../utils/scrollUtils';

export default function TopCourses() {
  const { getAllTrainings, loading, error } = useTraining();
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const trainings = getAllTrainings();
    // Get top 5 courses (you can modify this logic as needed)
    // const topFive = trainings.slice(0, 5);
    const topFive = trainings.slice(0, 5);
    setTopCourses(topFive);
  }, [getAllTrainings]);

  // Show loading state
  if (loading) {
    return (
      <div className="top-courses-section">
        <div className="top-courses-header">
          <h2>Top Courses</h2>
          <Link
            to="/training"
            className="top-courses-view-all"
            onClick={forceScrollToTop}
          >
            View All
          </Link>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading top courses...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="top-courses-section">
        <div className="top-courses-header">
          <h2>Top Courses</h2>
          <Link to="/training" className="top-courses-view-all">
            View All
          </Link>
        </div>
        <div className="error-container">
          <h3>Error Loading Top Courses</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="top-courses-section">
      {/* Header */}
      <div className="top-courses-header">
        <h2>Top Courses</h2>
        <Link to="/training" className="top-courses-view-all">
          View All
        </Link>
      </div>

      {/* Swiper Slider */}
      <Swiper
        spaceBetween={20}
        loop
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        slidesPerGroup={2}
        breakpoints={{
          0: {
            slidesPerView: 1, // 1 full + part of 2nd
          },
          480: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 2.5,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        modules={[Autoplay, Pagination]}
        className="top-courses-swiper"
      >
        {topCourses.map((item) => (
          <SwiperSlide key={item.id}>
            <Card data={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
