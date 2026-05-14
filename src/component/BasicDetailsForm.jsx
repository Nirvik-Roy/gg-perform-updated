import React from "react";
import "../css/form-elements.css";

export default function BasicDetailsForm({ data, onChange }) {
  const handle = (key) => (e) => onChange({ ...data, [key]: e.target.value });

  return (
    <>
    <div className="basic-details">
      <h4>Basic Details</h4>
      <div className="grid-2">
        <div className="field-group">
          <label>First Name*</label>
          <input value={data.firstName} onChange={handle("firstName")} required />
        </div>
        <div className="field-group">
          <label>Last Name*</label>
          <input value={data.lastName} onChange={handle("lastName")} required />
        </div>
        <div className="field-group">
          <label>Email*</label>
          <input
            type="email"
            value={data.email}
            onChange={handle("email")}
            required
          />
        </div>
        <div className="field-group">
          <label>Phone*</label>
          <input value={data.phone} onChange={handle("phone")} required />
        </div>
      </div>
      </div>
    </>
  );
}
