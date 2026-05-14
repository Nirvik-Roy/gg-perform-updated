// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import '../css/SearchBar.css';

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef(null);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce search to avoid too many API calls
    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
      />
      <FiSearch className="search-icon" />
    </form>
  );
}
