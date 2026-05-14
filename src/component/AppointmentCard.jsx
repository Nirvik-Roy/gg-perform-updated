import React, { useEffect, useState } from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ date, time, status, canCancel, canReschedule }) => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Parse 'Wed 28' into day/date for display
  const [day, dateNum] = date.split(' ');
  
  if(width > 468){
    return (
      <div className="appointment-card">
        <div className={`appointment-date${status === 'completed' ? ' completed' : status === 'cancelled' ? ' cancelled' : ''}`}>
          <span>{day}</span>
          <span>{dateNum}</span>
        </div>
        <div className="appointment-details">
          <span className="clock-icon"><img src="/clock-icon.svg" alt="" /></span>
          <span className="appointment-time">{time}</span>
          {status === 'completed' && <span className="status-badge completed">Completed</span>}
          {status === 'cancelled' && <span className="status-text cancelled">Cancelled</span>}
        </div>
        <div className="appointment-actions">
          {canCancel && status !== 'cancelled' && (
            <button className="cancel-button">Cancel</button>
          )}
          <button
            className={`reschedule-button${!canReschedule || status === 'cancelled' ? ' muted' : ''}`}
            disabled={!canReschedule || status === 'cancelled'}
          >
            Reschedule
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="appointment-card">
        {/* Top-Left Section: Image, Timing, and Tags */}
        <div className="appointment-top-left">
          <div className={`appointment-date${status === 'completed' ? ' completed' : status === 'cancelled' ? ' cancelled' : ''}`}>
            <span>{day}</span>
            <span>{dateNum}</span>
          </div>
          <div className="appointment-details">
            <span className="clock-icon"><img src="/clock-icon.svg" alt="" /></span>
            <span className="appointment-time">{time}</span>
            {status === 'completed' && <span className="status-badge completed">Completed</span>}
            {status === 'cancelled' && <span className="status-text cancelled">Cancelled</span>}
          </div>
        </div>

        {/* Bottom-Right Section: Buttons */}
        <div className="appointment-actions">
          {canCancel && status !== 'cancelled' && (
            <button className="cancel-button">Cancel</button>
          )}
          <button
            className={`reschedule-button${!canReschedule || status === 'cancelled' ? ' muted' : ''}`}
            disabled={!canReschedule || status === 'cancelled'}
          >
            Reschedule
          </button>
        </div>
      </div>
    );
  }
};

export default AppointmentCard;
