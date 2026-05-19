import React, { useState, useEffect } from "react";
import "../Training/Training.css";
import CategorySidebar from "../../component/CategorySidebar.jsx";
import SortBar from "../../component/SortBar.jsx";
import Card from "../../component/Card.jsx";
import Pagination from "../../component/Pagination.jsx";
import SearchBar from "../../component/SearchBar.jsx";
import { FiX } from "react-icons/fi";
import { useBanner } from '../../context/BannerContext.jsx';
import { useTraining } from '../../context/TrainingContext';
import ProductCard from '../../component/ProductCard/ProductCard.jsx'
import { useNavigate } from "react-router-dom";
export default function Product() {
    const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
    const { loading, error, selectedCategory } = useTraining();
    const navigate = useNavigate()
    useEffect(() => {
        setBannerTitle('Products');
        setBreadcrumb('Products');
        setBannerImage('/other-banner.png');
    }, [setBannerTitle, setBreadcrumb, setBannerImage]);

    const products = [1, 2, 3, 4, 5, 6];
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
        let filtered = products;

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
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="training-list-wrapper">
                <div className="error-container">
                    <h3>Error Loading Products</h3>
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
                    <SearchBar onSearch={handleSearch} placeholder="Search products..." />
                    {/* <CategorySidebar /> */}
                </div>
            )}

            {/* ✅ Main Content */}
            <div className="training-list-wrapper">
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <>
                        <div className="sidebar" style={{
                            flex: '0 0 345px'
                        }}>
                            {/* <SearchBar onSearch={handleSearch} placeholder="Search products..." /> */}
                            {/* <CategorySidebar /> */}

                            <div className="fs1000">

                                {/* ── Categories ── */}
                                <div className="fs1001">

                                    {/* Header */}
                                    <div className="fs1002">
                                        <p className="fs1003">Categories</p>
                                        <span className="fs1004"><i class="fa-solid fa-angle-down"></i></span>
                                    </div>

                                    {/* List */}
                                    <div className="fs1005">
                                        <div className="fs1006 fs1006_active">
                                            <p className="fs1007">Lorem ipsum dolor sit amet</p>
                                        </div>
                                        <div className="fs1006">
                                            <p className="fs1007">Lorem ipsum dolor sit amet</p>
                                        </div>
                                        <div className="fs1006">
                                            <p className="fs1007">Lorem ipsum dolor sit amet</p>
                                        </div>
                                        <div className="fs1006">
                                            <p className="fs1007">Lorem ipsum dolor sit amet</p>
                                        </div>
                                    </div>

                                    {/* View More */}
                                    <p className="fs1008">View More</p>

                                </div>

                                {/* Divider */}

                                {/* ── Filter By Price ── */}
                                <div className="fs1010">

                                    {/* Header */}
                                    <div className="fs1002">
                                        <p className="fs1003">Filter By Price</p>
                                        <span className="fs1004"><i class="fa-solid fa-angle-down"></i></span>
                                    </div>

                                    {/* Price display */}
                                    <div className="fs1011">
                                        <span className="fs1012">$1000</span>
                                    </div>

                                    {/* Range Slider */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        defaultValue="0"
                                        className="fs1013"
                                    />

                                    {/* Buttons */}
                                    <div className="fs1014">
                                        <button className="fs1015">Filter</button>
                                        <button className="fs1016">Reset</button>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </>

                )}

                <div className="content">
                    <SortBar
                        total={sortedTrainings.length}
                        onSortChange={handleSortChange}
                        currentSort={currentSort}
                    />

                    {/* <div className="card-grid">
                        {currentItems?.length > 0 ? (
                            currentItems?.map((item, index) => (
                                <Card key={`${item.id}-${index}`} data={item} />
                            ))
                        ) : (
                            <div className="no-results">
                                <h3>No results found</h3>
                                <p>Try adjusting your search terms or browse all courses.</p>
                            </div>
                        )}
                    </div> */}

                    <div className="card-grid" style={{
                        gap: '40px'
                    }}>

                        {currentItems?.map((item, index) => (
                            <ProductCard onView={(()=>navigate('/products/1'))} image={'/Frame 1000005447.png'} key={`${item.id}-${index}`} data={item} />
                        ))}

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
