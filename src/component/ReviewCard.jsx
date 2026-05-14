// src/components/ReviewCard.jsx
import React from "react";
import "../css/ReviewCard.css";

export default function ReviewCard({ name, rating, review }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <h4>{name}</h4>
        <div className="review-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: i < rating ? "#FFD700" : "#ccc" }}>★</span>
          ))}
        </div>
      </div>
      <p className="review-text">{review}</p>
    </div>
  );
}
