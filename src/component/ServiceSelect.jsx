import React, { useEffect, useState } from "react";
import "../css/form-elements.css";


export default function ServiceSelect({ value, onChange }) {
  const [services, setServices] = useState([]);
  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchServices();
      const filteredData = data.map((service) => ({
        value: service.id,
        label: service.name,
      }));
      setServices(filteredData);
    }
    fetchData();
  }, []);
  return (
    <div className="field-group">
      <label>Service Details</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select Service</option>
        {services.map((s, index) => (
          <option key={index} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}
