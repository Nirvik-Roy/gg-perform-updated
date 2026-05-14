// import React from "react";
// import "../css/SessionTimingModal.css";

// export default function SessionTimingModal({ isOpen, onClose }) {
//   if (!isOpen) return null;

//   const timings = [
//     "Senin 08.00-09.00", "Selasa 10.00-11.00", "Rabu 12.00-13.00",
//     "Kamis 14.00-15.00", "Jumat 16.00-17.00", "Sabtu 18.00-19.00",
//     "Minggu 20.00-21.00", "Senin 09.00-10.00", "Rabu 11.00-12.00"
//   ];

//   return (
//     <div className="session-modal-overlay">
//       <div className="session-modal">
//         <div className="session-modal-header">
//           <h3>Session Timings</h3>
//           <button onClick={onClose}>✕</button>
//         </div>
//         <div className="session-grid">
//           {timings.map((time, index) => (
//             <div key={index} className="session-tile">
//               📅 <br />
//               {time}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import "../css/SessionTimingModal.css";

export default function SessionTimingModal({ isOpen, onClose, sessions = [] }) {
  if (!isOpen) return null;

  // Transform API session data to match the component's expected format
  const transformedSessions = sessions.length > 0 
    ? sessions.map((session, index) => {
        // Format date from "2025-08-05" to "05/08/2025"
        const dateObj = new Date(session.date);
        const formattedDate = dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        
        // Format time from "10:00:00" to "10:00 AM"
        const startTime = new Date(`2000-01-01T${session.start_time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        const endTime = new Date(`2000-01-01T${session.end_time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });

        return {
          label: `Session ${index + 1}`,
          date: formattedDate,
          time: `${startTime} - ${endTime}`
        };
      })
    : [
        // Fallback sessions if no API data
        { label: "Session 1", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 2", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 3", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 4", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 5", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 6", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 7", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 8", date: "26/06/2024", time: "9:00PM - 10:00PM" },
        { label: "Session 9", date: "26/06/2024", time: "9:00PM - 10:00PM" },
      ];

  return (
    <div className="session-modal-overlay">
      <div className="session-modal">
        <div className="session-modal-header">
          <h3 className="session-title">Session Timmings</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="session-grid">
          {transformedSessions.map((s, index) => (
            <div key={index} className="session-tile">
              <div className="calendar-icon">
                <img src="/Calendar.png" alt="calendar" />
              </div>
              <div className="session-info">
                <p className="session-label">{s.label}</p>
                <p className="session-date">{s.date}</p>
                <p className="session-time">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
