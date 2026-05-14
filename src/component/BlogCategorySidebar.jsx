import React, { useState } from 'react';
import '../css/CategorySidebar.css';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useBlog } from '../context/BlogContext';

export default function BlogCategorySidebar({ selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const { blogs, loading, error } = useBlog();

  // Extract unique categories from blog posts (category is already a string from BlogContext)
  const categories = [...new Set(blogs.map(blog => blog.category))].filter(Boolean);

  const handleCategoryClick = (category) => {
    const newCategory = category === selectedCategory ? null : category;
    onCategoryChange(newCategory);
  };

  const handleClearFilter = () => {
    onCategoryChange(null);
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
              {categories && categories.length > 0 ? (
                categories.map((cat, idx) => (
                  <li 
                    key={idx} 
                    className={selectedCategory === cat ? 'active' : ''}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {cat}
                  </li>
                ))
              ) : (
                <li className="no-categories">No categories available</li>
              )}
            </>
          )}
        </ul>
      )}
    </aside>
  );
}
