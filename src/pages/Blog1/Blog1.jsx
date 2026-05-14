import React, { useState, useEffect } from "react";
import { useBanner } from '../../context/BannerContext';
import { useBlog } from '../../context/BlogContext';
import './Blog1.css';
import { FiX } from "react-icons/fi";
import BlogCategorySidebar from "../../component/BlogCategorySidebar";
import Pagination from "../../component/Pagination";
import CourseCard from "../../component/CourseCard";
import SearchBar from "../../component/SearchBar";
import PopularPosts from "../../component/PopularPosts";
// import SortBar from "../../component/SortBar";

function Blog1() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const { blogs, loading, error } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentSort, setCurrentSort] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setBannerTitle('Blog');
    setBreadcrumb('Blog');
    setBannerImage('/other-banner.png');
  }, []);

  const cardsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter blogs based on search term with title priority
  const getSearchedBlogs = () => {
    let filtered = blogs;
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      // First, get exact title matches (highest priority)
      const titleMatches = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchLower)
      );
      
      // Then, get description matches (medium priority)
      const descriptionMatches = filtered.filter(blog => 
        !blog.title.toLowerCase().includes(searchLower) && 
        blog.description.toLowerCase().includes(searchLower)
      );
      
      // Finally, get category matches (lowest priority)
      const categoryMatches = filtered.filter(blog => 
        !blog.title.toLowerCase().includes(searchLower) && 
        !blog.description.toLowerCase().includes(searchLower) &&
        blog.category.toLowerCase().includes(searchLower)
      );
      
      // Combine results with title matches first
      filtered = [...titleMatches, ...descriptionMatches, ...categoryMatches];
    }
    
    return filtered;
  };

  const searchedBlogs = getSearchedBlogs();

  // Filter blogs based on selected category
  const getFilteredBlogs = () => {
    if (selectedCategory) {
      return searchedBlogs.filter(blog => blog.category === selectedCategory);
      // return searchedBlogs.filter(blog => blog.category.title === selectedCategory);
    }
    return searchedBlogs;
  };

  const filteredBlogs = getFilteredBlogs();

  // Sort blogs based on current sort option
  const getSortedBlogs = () => {
    let sortedBlogs = [...filteredBlogs];
    
    switch (currentSort) {
      case 'latest':
        // Sort by date (newest first) - assuming blogs have a date field
        sortedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        // Sort by date (oldest first)
        sortedBlogs.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'rating':
        // Sort by rating if available, otherwise keep original order
        if (sortedBlogs[0]?.rating) {
          sortedBlogs.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        break;
      default:
        // Keep original order
        break;
    }
    
    return sortedBlogs;
  };

  const sortedBlogs = getSortedBlogs();

  // Reset to first page when category, sort, or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, currentSort, searchTerm]);

  const totalPages = Math.ceil(sortedBlogs.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentItems = sortedBlogs.slice(startIndex, endIndex);

  const handleSortChange = (sortValue) => {
    setCurrentSort(sortValue);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div className="courses-page">
        <div className="loading-container">
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-page">
        <div className="error-container">
          <p>Error loading blogs: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Fixed Hamburger for Mobile */}
      {isMobile && !isSidebarOpen && (
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
          
          Filters
          <img src="/filter.png" alt="" />
        </button>
      )}

      {/* ✅ Mobile Sidebar Drawer */}
      {isMobile && isSidebarOpen && (
        <div className="mobile-sidebar">
          <button className="exit-btn" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
          <SearchBar onSearch={handleSearch} placeholder="Search blogs by title..." />
          <BlogCategorySidebar 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <PopularPosts />
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="courses-page">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="sidebar">
            <SearchBar onSearch={handleSearch} placeholder="Search blogs by title..." />
            <BlogCategorySidebar 
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <PopularPosts />
          </aside>
        )}

        <main className="main1-content">
          {/* <SortBar 
            total={sortedBlogs.length} 
            onSortChange={handleSortChange}
            currentSort={currentSort}
          /> */}
          
          <div className="cards-grid">
            {currentItems.length > 0 ? (
              currentItems.map((data) => (
                <CourseCard
                  key={data.id}
                  data={data}
                />
              ))
            ) : (
              <div className="no-results">
                <h3>No results found</h3>
                <p>Try adjusting your search terms or browse all blogs.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Blog1;
