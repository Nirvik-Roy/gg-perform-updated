// src/components/common-button.jsx
import React from "react";
import "../css/common-button.css";

export default function CommonButton({
  text,
  backgroundColor = "#6600CC",
  color = "#FFFFFF",
  borderColor = "#6600CC",
  onClick,
  disabled = false,
  style
}) {
  return (
    <button
      disabled={disabled}
      className="common-button"
      onClick={onClick}
      style={{
        backgroundColor,
        color,
        border: `1px solid ${borderColor}`,
        style
      }}
    >
      {text}
    </button>
  );
}
