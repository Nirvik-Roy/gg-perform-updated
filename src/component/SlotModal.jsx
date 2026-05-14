import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "./SlotModalCalendar.css";
import "./SlotModal.css";

const SlotModal = ({
  open,
  onClose,
  sessionNumber,
  onSave,
  selectedDate: initialDate,
  selectedSlot: initialSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [selectedSlot, setSelectedSlot] = useState(initialSlot ?? 0);

  useEffect(() => {
    setSelectedDate(initialDate || new Date());
    setSelectedSlot(initialSlot ?? 0);
  }, [initialDate, initialSlot, open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Cleanup function to restore scrolling
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  const timeSlots = new Array(9).fill("10:30AM - 11:30PM");

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const availableDates = [1, 2, 3, 4, 5].map(
    (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  );
  const unavailableDates = [21, 20, 12, 19, 26].map(
    (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  );

  if (!open) return null;

  return (
    <div className="slotmodal-backdrop">
      <div className="slotmodal-container">
        <button className="slotmodal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="slotmodal-title">Session {sessionNumber}</h2>

        <div className="slotmodal-content">
          <div className="slotmodal-card">
            <div className="slotmodal-calendar">
              <h3 className="slotmodal-section-title">Select Date</h3>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                minDate={new Date()}
                calendarClassName="slotmodal-datepicker"
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                  <div className="slotmodal-datepicker-header">
                    <button onClick={decreaseMonth} className="slotmodal-chevron">
                      <FaChevronLeft size={18} />
                    </button>
                    <span className="slotmodal-month-label">
                      {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
                    </span>
                    <button onClick={increaseMonth} className="slotmodal-chevron">
                      <FaChevronRight size={18} />
                    </button>
                  </div>
                )}
                dayClassName={(date) => {
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                  const isAvailable = availableDates.includes(dateStr);
                  const isUnavailable = unavailableDates.includes(dateStr);
                  const today = new Date();
                  const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return [
                    "slotmodal-day",
                    isAvailable ? "slot-available" : isUnavailable ? "slot-unavailable" : "slot-normal",
                    isPast ? "slot-past" : "",
                    isSelected ? "slot-selected" : "slot-hover",
                  ].join(" ");
                }}
              />
            </div>

            <div className="slotmodal-divider" />

            <div className="slotmodal-times">
              <h3 className="slotmodal-section-title">Select Time</h3>
              <div className="slotmodal-times-grid">
                {timeSlots.map((slot, i) => (
                  <button
                    key={i}
                    className={`slotmodal-time-btn ${selectedSlot === i ? "active" : ""}`}
                    onClick={() => setSelectedSlot(i)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="slotmodal-footer">
          <button onClick={onClose} className="slotmodal-cancel">
            Cancel
          </button>
          <button
            className="slotmodal-save"
            onClick={() => {
              if (onSave) onSave(sessionNumber, selectedDate, selectedSlot);
              if (onClose) onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlotModal;