import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX } from "react-icons/fi";
import "../css/header.css";
import { useBanner } from "../context/BannerContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSiteSettings } from "../context/SiteSettingsContext";
import AuthModal from "./AuthModal";

export default function Header() {
  const { bannerTitle, breadcrumb, bannerDescription2, bannerDescription3, bannerDescription4 } = useBanner();
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { siteSettings, loading: siteSettingsLoading } = useSiteSettings();

  const isHome = location.pathname === "/home";

  // State for homepage content
  const [homepageContent, setHomepageContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch homepage content
  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/home-page`);

      if (!response.ok) {
        throw new Error('Failed to fetch homepage content');
      }

      const result = await response.json();

      if (result.status === 'success' && result.data && result.data.content) {
        setHomepageContent(result.data.content);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching homepage content:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch content on component mount
  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const goToCart = () => {
    const token = localStorage.getItem('gg website token');
    const user = localStorage.getItem('gg website user');

    if (!token || !user) {
      setShowAuthModal(true);
      return;
    }

    navigate("/cart");
  };

  const goToWishlist = () => {
    const token = localStorage.getItem('gg website token');
    const user = localStorage.getItem('gg website user');

    if (!token || !user) {
      setShowAuthModal(true);
      return;
    }

    navigate("/wish-list");
  };

  // ✅ Mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <header className="custom-header">
      {/* Top Nav */}
      <div className="header-overlay">
        <div className="header-container">
          <div className="header-logo">
            <img
              src={siteSettings?.logo || "/gg-logo.png"}
              alt={siteSettings?.site_identity || "Logo"}
            />
          </div>

          {/* ✅ Hamburger toggle icon */}
          <div className="nav-toggle" onClick={toggleMobileMenu}>
            {/* {isMobileMenuOpen ? <FiX /> : <FiMenu />} */}
            {isMobileMenuOpen ? (
              <FiX />
            ) : (
              <img
                src="/hamberger.png"
                alt="Close Menu"
                style={{ width: "24px", height: "24px" }}
              />
            )}
          </div>

          <div className="header-right-section" style={{ color: "white" }}>
            {/* ✅ Nav menu toggled on mobile */}
            <nav className={`header-nav ${isMobileMenuOpen ? "open" : ""}`}>
              <NavLink
                to="/home"
                end
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </NavLink>
            <NavLink
                to="/training"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Training
              </NavLink> 

              <NavLink
                to="/events"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </NavLink>
              {/* <NavLink to="/blog1" onClick={() => setIsMobileMenuOpen(false)}>
                Writing
              </NavLink> */}
              <NavLink
                to="/faq"
                end
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </NavLink>

              <div className="hamberger-cart">
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    goToCart();
                  }}
                  style={{ cursor: 'pointer', color: 'white' }}
                >
                  <FiShoppingCart /> Cart
                </div>
              </div>
              <div className="hamberger-cart">
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    goToWishlist();
                  }}
                  style={{ cursor: 'pointer', color: 'white' }}
                >
                  <FiHeart /> Wishlist
                </div>
              </div>
              <div className="hamberger-cart">
                <div
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const token = localStorage.getItem('gg website token');
                    const user = localStorage.getItem('gg website user');

                    if (token && user) {
                      navigate('/MyAccount');
                    } else {
                      navigate('/auth', {
                        state: {
                          route: location.pathname
                        }
                      });
                    }
                  }}
                  style={{ cursor: 'pointer', color: 'white' }}
                >
                  <FiUser /> User
                </div>
              </div>
              <div className="hamberger-cart">
                <NavLink
                  to="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book an Appointment
                </NavLink>
              </div>
            </nav>

            <div className="header-icons">
              <div className="cart-icon-wrapper" onClick={goToCart}>
                <FiShoppingCart
                  style={{ cursor: "pointer", fontSize: "20px" }}
                  title="Go to Cart"
                />
                {cartItems.length > 0 && (
                  <span className="cart-badge">{cartItems.length}</span>
                )}
              </div>

              <div className="wishlist-icon-wrapper" onClick={goToWishlist}>
                <FiHeart
                  style={{ cursor: "pointer", fontSize: "20px" }}
                  title="Go to Wishlist"
                />
                {wishlistItems.length > 0 && (
                  <span className="cart-badge">{wishlistItems.length}</span>
                )}
              </div>

              <div
                onClick={() => {
                  const token = localStorage.getItem('gg website token');
                  const user = localStorage.getItem('gg website user');

                  if (token && user) {
                    navigate('/MyAccount');
                  } else {
                    navigate('/auth', {
                      state: {
                        route: location.pathname
                      }
                    });
                  }
                }}
                style={{ color: "white", cursor: "pointer" }}
              >
                <FiUser />
              </div>
            </div>

            <NavLink to="/booking">
              <button className="header-btn" >Book an Appointment</button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Hero section */}
      {isHome ? (
        <div
          className="home-hero"
          style={{
            backgroundImage: `url('${homepageContent?.hero_section_image || '/home-banner.jpg'}')`,

          }}
        >
          <div className="hero-text-box" >
            {/* <h1 className="hero-title" >
              {
                homepageContent?.hero_section_heading 
                || 
                
                (
                <>
                  Train <span className="highlight-purple">Hard</span>. Live
                  <br />
                  <span className="highlight-pink">Strong</span>. Push
                  <br />
                  Beyond <span className="highlight-blue">Limits</span>.
                </>
              )}
            </h1> */}

            <h1 className="hero-title" >

              <>
                Train <span className="highlight-purple">Smarter</span>. Perform

                <span className="highlight-pink"> Better</span>. Become

                Harder to <span className="highlight-blue">Beat.</span>
              </>

            </h1>

            {/* <p>
              {homepageContent?.hero_section_description || ( */}
            <p
            // dangerouslySetInnerHTML={{
            //   __html:
            //     homepageContent?.hero_section_description ||
            //     "High-performance training systems for athletes, competitors, and driven individuals who refuse to settle for average."
            // }}


            >
              High-performance training systems for athletes, competitors, and driven individuals who refuse to settle for average.
              <br />
              <br />
              Built by <b>George Griffith</b>, performance specialist with over 25 years of coaching experience and a track record of developing elite Caribbean athletes.
            </p>
            <NavLink to={homepageContent?.hero_section_button_link || "/booking"}>
              <button className="animated-button">
                {homepageContent?.hero_section_button_name || "Book Now"}
              </button>
            </NavLink>
          </div>
          <div className="home-header-new-overlay">

          </div>
        </div>
      ) : (
        <div className="hero-center-content">
          <h1 className="hero-title">{bannerTitle}</h1>
          <p className="hero-description" style={{
            fontSize: '25px',
            margin: '0px',
            marginTop: '-10px',
            fontWeight: '500'
          }}>{bannerDescription2}</p>
          <p style={{
            fontSize: '25px',
            margin: '10px',
            fontWeight: '500'
          }}>{bannerDescription3}</p>
          <p style={{
            fontSize: '19px',
            margin: '15px',
            fontWeight: '500',
            lineHeight: '1.4'
          }}>{bannerDescription4}</p>
          {/* <div className="breadcrumb">
            <NavLink to="/home">Home</NavLink> &gt;
            {breadcrumb?.includes('/') ? (
              breadcrumb?.split('/').map((part, index, array) => (
                <span key={index}>
                  {index === 0 && part === 'Writing' ? (
                    <NavLink to="/blog1">Writing</NavLink>
                  ) : index === array.length - 1 ? (
                    <span>{part}</span>
                  ) : (
                    <span>{part}</span>
                  )}
                  {index < array.length - 1 && ' > '}
                </span>
              ))
            ) : (
              <span>{breadcrumb}</span>
            )}

            
          </div> */}
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
}
