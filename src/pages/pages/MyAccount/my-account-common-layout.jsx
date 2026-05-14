import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import './my-account-common-layout.css'

function MyAccountCommonLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/MyAccount',
      icon: '/dashboard-icon.svg'
    },
    {
      id: 'courses',
      label: 'Courses',
      path: '/MyAccount/courses',
      icon: '/courses-icon.svg'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      path: '/MyAccount/appointments',
      icon: '/appointment-icon.svg'
    },
    {
      id: 'purchase-history',
      label: 'Purchase History',
      path: '/MyAccount/purchase-history',
      icon: '/purchase-history-icon.svg'
    },
    {
      id: 'profile',
      label: 'My Profile',
      path: '/MyAccount/profile',
      icon: '/profile-icon.svg'
    },
    {
      id: 'logout',
      label: 'Logout',
      path: '/auth',
      icon: '/logout-icon.svg',
      isLogout: true
    }
  ];

  const handleNavigation = (item) => {
    if (item.isLogout) {
      setShowLogoutConfirm(true);
      setIsMobileMenuOpen(false);
      return;
    }
    navigate(item.path);
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    // Clear any stored authentication data
    localStorage.removeItem('gg website token');
    localStorage.removeItem('gg website user');
    setShowLogoutConfirm(false);
    navigate("/auth", { state: { route: location.pathname } });
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const isActive = (item) => {
    if (item.id === 'dashboard') {
      return location.pathname === '/MyAccount' || location.pathname === '/MyAccount/';
    }
    return location.pathname.startsWith(item.path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="my-account-common-layout-container">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-button"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <img src="/dashboard-menu-icon.svg" alt="" />
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <div className={`my-account-common-layout-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h3>My Account</h3>
          <button 
            className="close-mobile-menu"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={isActive(item) ? 'active' : ''}
            onClick={() => handleNavigation(item)}
          >
            <img src={item.icon} alt={item.label} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="my-account-common-layout-content">
        <Outlet />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay" onClick={handleLogoutCancel}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="logout-modal-content">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="logout-modal-actions">
              <button 
                className="logout-cancel-btn"
                onClick={handleLogoutCancel}
              >
                Cancel
              </button>
              <button 
                className="logout-confirm-btn"
                onClick={handleLogoutConfirm}
              >
                Yes, I am sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAccountCommonLayout;