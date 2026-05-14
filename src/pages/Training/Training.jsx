import React, { useState, useEffect } from "react";
import "./Training.css";
import CategorySidebar from "../../component/CategorySidebar";
import SortBar from "../../component/SortBar";
import Card from "../../component/Card";
import Pagination from "../../component/Pagination";
import SearchBar from "../../component/SearchBar";
import { FiX } from "react-icons/fi";
import { useBanner } from '../../context/BannerContext';
import { useTraining } from '../../context/TrainingContext';

export default function Training() {
    const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const { getAllTrainings, loading, error, selectedCategory } = useTraining();
  
    useEffect(() => {
    setBannerTitle('Training');
    setBreadcrumb('Training');
    setBannerImage('/other-banner.png');
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);
  
  const trainings = getAllTrainings();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 9;
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

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Filter trainings based on search term with title priority
  const getFilteredTrainings = () => {
    let filtered = trainings;
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      
      // First, get exact title matches (highest priority)
      const titleMatches = filtered.filter(training => 
        training.title.toLowerCase().includes(searchLower)
      );
      
      // Then, get description matches (medium priority)
      const descriptionMatches = filtered.filter(training => 
        !training.title.toLowerCase().includes(searchLower) && 
        training.description.toLowerCase().includes(searchLower)
      );
      
      // Finally, get category matches (lowest priority)
      const categoryMatches = filtered.filter(training => 
        !training.title.toLowerCase().includes(searchLower) && 
        !training.description.toLowerCase().includes(searchLower) &&
        training.category.toLowerCase().includes(searchLower)
      );
      
      // Combine results with title matches first
      filtered = [...titleMatches, ...descriptionMatches, ...categoryMatches];
    }
    
    return filtered;
  };

  const filteredTrainings = getFilteredTrainings();

  // Sort trainings based on current sort option
  const getSortedTrainings = () => {
    let sortedTrainings = [...filteredTrainings];
    
    switch (currentSort) {
      case 'lowToHigh':
        sortedTrainings.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case 'highToLow':
        sortedTrainings.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case 'rating':
        sortedTrainings.sort((a, b) => b.rating - a.rating);
        break;
      case 'latest':
      default:
        // Keep original order (latest first based on API response)
        break;
    }
    
    return sortedTrainings;
  };

  const sortedTrainings = getSortedTrainings();

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedTrainings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedTrainings.length / itemsPerPage);

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
      <div className="training-list-wrapper">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="training-list-wrapper">
        <div className="error-container">
          <h3>Error Loading Courses</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
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
          <SearchBar onSearch={handleSearch} placeholder="Search courses..." />
          <CategorySidebar />
        </div>
      )}

      {/* ✅ Main Content */}
      <div className="training-list-wrapper">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="sidebar">
            <SearchBar onSearch={handleSearch} placeholder="Search courses..." />
            <CategorySidebar />
          </div>
        )}

        <div className="content">
          <SortBar 
            total={sortedTrainings.length} 
            onSortChange={handleSortChange}
            currentSort={currentSort}
          />

          <div className="card-grid">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <Card key={`${item.id}-${index}`} data={item} />
              ))
            ) : (
              <div className="no-results">
                <h3>No results found</h3>
                <p>Try adjusting your search terms or browse all courses.</p>
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </>
  );
}
