import React from "react";
import "./FixedScheduleCard.css";

const FixedScheduleCard = ({ sessions = [] }) => {
  return (
    <div className="fixed-schedule-card-container">
      <table className="fixed-schedule-table">
        <thead>
          <tr>
            <th>Session Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Meeting Link</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length > 0 ? (
            sessions.map((session, idx) => (
              <tr key={idx} className={idx % 2 === 1 ? "even-row" : ""}>
                <td>{session.sessionName}</td>
                <td>{session.date}</td>
                <td>{session.time}</td>
                <td>
                  {session.meetingLink ? (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="meeting-link-icon"
                      aria-label="Meeting Link"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 13a5 5 0 0 1 7.07 0l1.41 1.41a5 5 0 0 1-7.07 7.07l-1.41-1.41" />
                        <path d="M14 11a5 5 0 0 0-7.07 0l-1.41 1.41a5 5 0 0 0 7.07 7.07l1.41-1.41" />
                      </svg>
                    </a>
                  ) : (
                    <span className="no-link">—</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-session-text">No sessions available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FixedScheduleCard;
