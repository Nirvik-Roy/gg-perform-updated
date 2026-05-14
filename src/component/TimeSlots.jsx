import React from "react";
import "../css/timeslots.css";

const TIMES = [
  "10:30AM - 11:30PM",
  "11:30AM - 12:30PM",
  "12:30PM - 1:30PM",
  "1:30PM - 2:30PM",
  "2:30PM - 3:30PM",
  "3:30PM - 4:30PM",
  "4:30PM - 5:30PM",
  "5:30PM - 6:30PM",
];

export default function TimeSlots({ selected, onSelect }) {
  return (
    <section className="timeslots">
      <h4>Select Time</h4>
      <div className="timeslots-grid">
        {TIMES.map((slot) => (
          <button
            key={slot}
            className={`slot ${selected === slot ? "active" : ""}`}
            onClick={() => onSelect(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
    </section>
  );
}
