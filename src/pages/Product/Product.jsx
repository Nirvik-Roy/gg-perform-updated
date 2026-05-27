import React, { useState, useEffect } from "react";
import "../Training/Training.css";
import SortBar from "../../component/SortBar.jsx";
import Pagination from "../../component/Pagination.jsx";
import SearchBar from "../../component/SearchBar.jsx";
import { FiX } from "react-icons/fi";
import { useBanner } from '../../context/BannerContext.jsx';
import ProductCard from '../../component/ProductCard/ProductCard.jsx';
import { useNavigate } from "react-router-dom";
import { getProducts, getProductCategories } from '../../utils/productUtils'; // ✅ import utils
import { toast } from 'react-hot-toast';
import { addToCartApi } from "../../utils/cart.js";
import AuthModal from "../../component/AuthModal.jsx";
import { getCartItems } from "../../services/cartService.js";
import { useCart } from "../../context/CartContext.jsx";

export default function Product() {
    const { refreshCart } = useCart()
    const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
    const navigate = useNavigate();

    // ─── Banner ────────────────────────────────────────────────────
    useEffect(() => {
        setBannerTitle('Products');
        setBreadcrumb('Products');
        setBannerImage('/other-banner.png');
    }, [setBannerTitle, setBreadcrumb, setBannerImage]);

    // ─── States ────────────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSort, setCurrentSort] = useState('latest');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const [priceRange, setPriceRange] = useState(1000);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showAllCategories, setShowAllCategories] = useState(false);

    const itemsPerPage = 9;
    const VISIBLE_CATEGORIES = 4;
    const [authModal, setShowAuthModal] = useState(false)
    const goToCart = () => {
        const token = localStorage.getItem('gg website token');
        const user = localStorage.getItem('gg website user');

        if (!token || !user) {
            setShowAuthModal(true);
            return;
        }

        navigate("/cart");
    };
    // ─── Fetch Products ────────────────────────────────────────────
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProducts();
            console.log(data)
            setProducts(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load products');
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    // ─── Fetch Categories ──────────────────────────────────────────
    const fetchCategories = async () => {
        try {
            const data = await getProductCategories();
            setCategories(data);
        } catch (err) {
            toast.error('Failed to load categories');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // ─── Handle Resize ─────────────────────────────────────────────
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) setSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ─── Reset Page on Filter Change ───────────────────────────────
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSubCategory, searchTerm, priceRange]);

    // ─── Toggle Category Expand ────────────────────────────────────
    const toggleCategoryExpand = (categoryId) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    // ─── Category Click ────────────────────────────────────────────
    const handleCategoryClick = (categoryId) => {
        if (selectedCategory === categoryId) {
            setSelectedCategory(null);
            setSelectedSubCategory(null);
        } else {
            setSelectedCategory(categoryId);
            setSelectedSubCategory(null);
        }
    };

    // ─── SubCategory Click ─────────────────────────────────────────
    const handleSubCategoryClick = (subCategoryId) => {
        if (selectedSubCategory === subCategoryId) {
            setSelectedSubCategory(null);
        } else {
            setSelectedSubCategory(subCategoryId);
        }
    };

    // ─── Add To Cart ───────────────────────────────────────────────
    const addToCart = async (productId) => {
        const token = localStorage.getItem('gg website token')
        if (token) {
            try {
                // Call your addToCart API here
                const res = await addToCartApi({
                    product_id: productId
                });
                if (res?.status === 'success') {
                    toast.success('Product added to cart!');
                    refreshCart()
                }

            } catch (err) {
                toast.error('Failed to add product to cart');
            }
        } else {
            goToCart()
        }
    };

    // ─── Filter Products ───────────────────────────────────────────
    const getFilteredProducts = () => {
        if (products?.length > 0) {
            let filtered = products;

            // ── Filter by Category ──
            if (selectedCategory) {
                filtered = filtered?.filter(
                    (product) => product.product_category_id === selectedCategory
                );
            }

            // ── Filter by SubCategory ──
            if (selectedSubCategory) {
                filtered = filtered.filter(
                    (product) => product.product_subcategory_id === selectedSubCategory
                );
            }

            // ── Filter by Price Range ──
            filtered = filtered?.filter(
                (product) => (product.sale_price ?? product.original_price) <= priceRange
            );

            // ── Filter by Search Term ──
            if (searchTerm.trim()) {
                const searchLower = searchTerm.toLowerCase();

                const nameMatches = filtered.filter((product) =>
                    product.name.toLowerCase().includes(searchLower)
                );

                const descriptionMatches = filtered.filter(
                    (product) =>
                        !product.name.toLowerCase().includes(searchLower) &&
                        product.short_description?.toLowerCase().includes(searchLower)
                );

                const categoryMatches = filtered.filter(
                    (product) =>
                        !product.name.toLowerCase().includes(searchLower) &&
                        !product.short_description?.toLowerCase().includes(searchLower) &&
                        product.category_name?.toLowerCase().includes(searchLower)
                );

                filtered = [...nameMatches, ...descriptionMatches, ...categoryMatches];
            }

            return filtered;
        }
        return []
    };

    // ─── Sort Products ─────────────────────────────────────────────
    const getSortedProducts = () => {
        if (products?.length > 0) {
            let sorted = [...getFilteredProducts()];

            switch (currentSort) {
                case 'lowToHigh':
                    sorted.sort(
                        (a, b) =>
                            (a.sale_price ?? a.original_price) -
                            (b.sale_price ?? b.original_price)
                    );
                    break;
                case 'highToLow':
                    sorted.sort(
                        (a, b) =>
                            (b.sale_price ?? b.original_price) -
                            (a.sale_price ?? a.original_price)
                    );
                    break;
                case 'latest':
                default:
                    sorted.sort(
                        (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    );
                    break;
            }

            return sorted;
        } else {
            return []
        }
    };

    const sortedProducts = getSortedProducts();
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = sortedProducts?.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(sortedProducts?.length / itemsPerPage);

    const handleSortChange = (sortValue) => {
        setCurrentSort(sortValue);
        setCurrentPage(1);
    };

    const handleSearch = (searchValue) => {
        setSearchTerm(searchValue);
        setCurrentPage(1);
    };

    // ─── Reset Price Filter ────────────────────────────────────────
    const handleResetPrice = () => {
        setPriceRange(1000);
    };

    // ─── Visible Categories ────────────────────────────────────────
    const visibleCategories = showAllCategories
        ? categories
        : categories?.slice(0, VISIBLE_CATEGORIES);

    // ─── Sidebar Content ───────────────────────────────────────────
    const SidebarContent = () => (
        <div className="fs1000">

            {/* ── Categories ── */}
            <div className="fs1001">
                <div className="fs1002">
                    <p className="fs1003">Categories</p>
                    <span className="fs1004">
                        <i className="fa-solid fa-angle-down" />
                    </span>
                </div>

                <div className="fs1005">
                    {/* All Categories Option */}
                    <div
                        className={`fs1006 ${!selectedCategory ? 'fs1006_active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(null);
                            setSelectedSubCategory(null);
                        }}
                    >
                        <p className="fs1007">All Categories</p>
                    </div>

                    {visibleCategories.map((category) => (
                        <div key={category.id}>
                            {/* Parent Category */}
                            <div
                                className={`fs1006 ${selectedCategory === category.id ? 'fs1006_active' : ''}`}
                                onClick={() => {
                                    handleCategoryClick(category.id);
                                    if (category.children?.length > 0) {
                                        toggleCategoryExpand(category.id);
                                    }
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <p className="fs1007">{category.name}</p>
                                {category.children?.length > 0 && (
                                    <i className={`fa-solid fa-angle-${expandedCategories[category.id] ? 'up' : 'down'}`}
                                        style={{ fontSize: '12px' }}
                                    />
                                )}
                            </div>

                            {/* Sub Categories */}
                            {expandedCategories[category.id] &&
                                category.children?.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className={`fs1006 ${selectedSubCategory === sub.id ? 'fs1006_active' : ''}`}
                                        onClick={() => handleSubCategoryClick(sub.id)}
                                        style={{
                                            paddingLeft: '20px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <p className="fs1007">{sub.name}</p>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                {/* View More / Less */}
                {categories.length > VISIBLE_CATEGORIES && (
                    <p
                        className="fs1008"
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        style={{ cursor: 'pointer' }}
                    >
                        {showAllCategories ? 'View Less' : 'View More'}
                    </p>
                )}
            </div>

            {/* ── Filter By Price ── */}
            <div className="fs1010">
                <div className="fs1002">
                    <p className="fs1003">Filter By Price</p>
                    <span className="fs1004">
                        <i className="fa-solid fa-angle-down" />
                    </span>
                </div>

                {/* Price Display */}
                <div className="fs1011">
                    <span className="fs1012">${priceRange}</span>
                </div>

                {/* Range Slider */}
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="fs1013"
                />

                {/* Buttons */}
                <div className="fs1014">
                    <button
                        className="fs1015"
                        onClick={() => setCurrentPage(1)}
                    >
                        Filter
                    </button>
                    <button
                        className="fs1016"
                        onClick={handleResetPrice}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );

    // ─── Loading ───────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="training-list-wrapper">
                <div className="loading-container">
                    <div className="loading-spinner" />
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    // ─── Error ─────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="training-list-wrapper">
                <div className="error-container">
                    <h3>Error Loading Products</h3>
                    <p>{error}</p>
                    <button onClick={fetchProducts}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <>
            {authModal && <AuthModal isOpen={authModal} onClose={(()=>setShowAuthModal(false))}/>}
            {/* ── Mobile Hamburger ── */}
            {isMobile && !isSidebarOpen && (
                <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
                    Filters
                    <img src="/filter.png" alt="" />
                </button>
            )}

            {/* ── Mobile Sidebar Drawer ── */}
            {isMobile && isSidebarOpen && (
                <div className="mobile-sidebar">
                    <button className="exit-btn" onClick={() => setSidebarOpen(false)}>
                        <FiX />
                    </button>
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search products..."
                    />
                    <SidebarContent />
                </div>
            )}

            {/* ── Main Content ── */}
            <div className="training-list-wrapper">

                {/* Desktop Sidebar */}
                {!isMobile && (
                    <div className="sidebar" style={{ flex: '0 0 345px' }}>
                        <SidebarContent />
                    </div>
                )}

                <div className="content">
                    <SortBar
                        total={sortedProducts.length}
                        onSortChange={handleSortChange}
                        currentSort={currentSort}
                    />

                    <div className="card-grid" style={{ gap: '40px' }}>
                        {currentItems?.length > 0 ? (
                            currentItems?.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    image={item.main_image}
                                    name={item.name}
                                    originalPrice={item.original_price}
                                    salePrice={item.sale_price}
                                    onView={() => navigate(`/products/${item.id}`)}
                                    onAddToCart={() => addToCart(item.id)}
                                />
                            ))
                        ) : (
                            <div className="no-results">
                                <h3>No results found</h3>
                                <p>Try adjusting your search or filters.</p>
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