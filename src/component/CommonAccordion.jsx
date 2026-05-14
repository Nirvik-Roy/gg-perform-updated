// src/components/CommonAccordion.jsx
import React, { useState } from "react";
// import "./CommonAccordion.css"; // optional styling

export default function CommonAccordion({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="accordion-container">
      {data.map((item, index) => (
        <div key={index} className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleAccordion(index)}
          >
            <h3>{item.heading}</h3>
            <span>{activeIndex === index ? "-" : "+"}</span>
          </div>
          {activeIndex === index && (
            <div className="accordion-body">
              <p>{item.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}