import React from "react";
import { MdOutlineCalendarMonth, MdOutlineAccessTime } from "react-icons/md";
import "./SlotCard.css";

const timeSlots = [
  "10:30AM - 11:30PM", "10:30AM - 11:30PM", "10:30AM - 11:30PM",
  "10:30AM - 11:30PM", "10:30AM - 11:30PM", "10:30AM - 11:30PM",
  "10:30AM - 11:30PM", "10:30AM - 11:30PM", "10:30AM - 11:30PM"
];

const SlotCard = ({ sessionNumber, onOpenModal, selectedDate, selectedSlot }) => {
  return (
    <div
      className={`slot-card ${selectedDate && selectedSlot != null ? 'selected' : 'not-selected'}`}
    >
      <div className="slot-content">
        <div className="slot-icon-wrapper">
          <MdOutlineCalendarMonth size={selectedDate ? 40 : 68} color="#222" />
          <div className="slot-clock-icon">
            <MdOutlineAccessTime size={18} color="#FFD600" />
          </div>
        </div>
        <p className="slot-session">Session {sessionNumber}</p>
        {selectedDate && (
          <div className="slot-details">
            <div className="slot-date">
              <span className="slot-date-text">
                {new Date(selectedDate).toLocaleDateString()}
              </span>
            </div>
            {selectedSlot != null && (
              <div className="slot-time">
                <span className="slot-time-text">{timeSlots[selectedSlot]}</span>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="slot-button-container">
        <button className="slot-button" onClick={onOpenModal}>
          {selectedDate ? "Reschedule" : "Select Time & Date"}
        </button>
      </div>
    </div>
  );
};

export default SlotCard;
