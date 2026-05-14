// src/pages/SingleCourse/SingleCourse.jsx
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import { useBanner } from "../../context/BannerContext";
import CommonAccordion from "../../component/CommonAccordion";
import ReviewCard from "../../component/ReviewCard";
import './single-course.css';
import CommonButton from "../../component/CommonButton";

export default function SingleCourse() {
//   const { courseId } = useParams();
 const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
   useEffect(() => {
      setBannerTitle("Booking");
      setBreadcrumb("Booking");
      setBannerImage("/other-banner.png");
    }, []);
  const [courseData] = useState({
    courseName: "React Masterclass",
    courseType: "Live Sessions",
    description: "Detailed course on React and state management.",
    category: "Frontend",
    originalPrice: "200",
    salePrice: "149",
    courseImage: ["/demo-large-image.svg"],
    faqActive: true,
    reviewsActive: true,
    faqs: [
      { heading: "What is included?", description: "Videos, projects, support." },
      { heading: "Any prerequisites?", description: "Basic JS knowledge." },
    ],
    reviews: [
      { name: "Alice", rating: 5, review: "Excellent course!" },
      { name: "Bob", rating: 4, review: "Very useful and easy to follow." },
    ],
  });


  return (
    <div className="single-course-container">
      <div className="single-course-button-container">
        <CommonButton text="Delete" backgroundColor="#F3F3F3" color="#0D0D0D" borderColor="#F3F3F3" />
        <CommonButton text="Edit" backgroundColor="#6600CC" color="#FFFFFF" borderColor="#6600CC" />
      </div>

      <div className="single-course-details-container">
        <div className="single-course-image">
          <img src={courseData.courseImage[0]} alt="Course" />
        </div>
        <div className="single-course-details">
          <div className="single-course-tag-container">
            <div className="single-course-tag">{courseData.courseType}</div>
          </div>
          <h1>{courseData.courseName}</h1>
          <h4>{courseData.category}</h4>
          <div className="single-course-price">
            <p className="single-course-original-price">${courseData.originalPrice}</p>
            <p>${courseData.salePrice}</p>
          </div>
          <p className="single-course-description">{courseData.description}</p>
        </div>
      </div>

      {courseData.faqActive && (
        <>
          <h2 className="single-course-section-title">FAQs</h2>
          <CommonAccordion data={courseData.faqs} />
        </>
      )}

      {courseData.reviewsActive && (
        <>
          <h2 className="single-course-section-title">Reviews</h2>
          <div className="review-section">
            {courseData.reviews.map((rev, i) => (
              <ReviewCard key={i} {...rev} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
