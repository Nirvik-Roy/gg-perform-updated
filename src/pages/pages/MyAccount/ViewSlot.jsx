import React, { useEffect, useState } from "react";
import SlotCard from "../../../component/SlotCard";
import SlotModal from "../../../component/SlotModal";
import { useParams, useNavigate } from "react-router-dom";
import { Courses as CourseList } from "../../../component/CourseCard_1";
import { useBanner } from "../../../context/BannerContext";

import Toast from "../../../component/Toast";
// ...other imports

import './ViewSlots.css';
// ...other imports


const ViewSlots = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const courseName = name.replace(/-/g, " ");
  const courseObj = CourseList.find(c => c.name.toLowerCase() === courseName.toLowerCase());
  const sessionCount = 10;

  useEffect(() => {
    setBannerTitle("My Account");
    setBreadcrumb("My Account");
    setBannerImage("/other-banner.png");
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalSession, setModalSession] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleSaveSlot = (sessionNumber, date, slot) => {
    setSelectedSlots(prev => ({ ...prev, [sessionNumber]: { date, slot } }));
    setModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  return (
    <>
      <Toast message="Slot saved successfully!" show={showToast} />
      <div className="viewslots-container">
        <h2 className="viewslots-title">
          <img
            src="/arrow.png"
            alt="arrow"
            className="course-title-arrow"
            onClick={() => navigate('/MyAccount/courses')}
          />
          {courseObj ? courseObj.name : "Course Not Found"}
          <span className="viewslots-badge">{courseObj ? courseObj.time : ""}</span>
        </h2>

        <div className="viewslots-grid"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
            gap: "1rem",
            marginTop: "1.5rem"
          }}>
          {Array.from({ length: sessionCount }, (_, index) => {
            const sessionNum = index + 1;
            const selected = selectedSlots[sessionNum] || {};
            return (
              <SlotCard
                key={index}
                sessionNumber={sessionNum}
                onOpenModal={() => { setModalOpen(true); setModalSession(sessionNum); }}
                selectedDate={selected.date}
                selectedSlot={selected.slot}
              />
            );
          })}
        </div>

        {modalOpen && (
          <SlotModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            sessionNumber={modalSession}
            onSave={handleSaveSlot}
            selectedDate={selectedSlots[modalSession]?.date}
            selectedSlot={selectedSlots[modalSession]?.slot}
          />
        )}
      </div>
    </>
  );
};

export default ViewSlots;