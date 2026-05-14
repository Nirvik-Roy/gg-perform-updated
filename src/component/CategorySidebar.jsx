import React, { useState } from 'react';
import '../css/CategorySidebar.css';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useTraining } from '../context/TrainingContext';

export default function CategorySidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { categories, selectedCategory, selectCategory, clearCategoryFilter, loading } = useTraining();

  console.log('CategorySidebar received categories:', categories); // Debug: Log categories

  const handleCategoryClick = (category) => {
    selectCategory(category);
  };

  const handleClearFilter = () => {
    clearCategoryFilter();
  };

  return (
    <aside className="category-sidebar">
      <div className="sidebar-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>Categories</h3>
        {isOpen ? <FiChevronUp className="dropdown-icon" /> : <FiChevronDown className="dropdown-icon" />}
      </div>

      {isOpen && (
        <ul>
          {loading ? (
            <li className="loading-category">Loading categories...</li>
          ) : (
            <>
              <li 
                className={!selectedCategory ? 'active' : ''} 
                onClick={handleClearFilter}
              >
                All Categories
              </li>
              {categories.map((cat, idx) => (
                <li 
                  key={idx} 
                  className={selectedCategory === cat ? 'active' : ''}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </aside>
  );
}
