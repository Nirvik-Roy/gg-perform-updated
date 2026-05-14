import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import {
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaFileInvoice,
  FaUser,
  FaPowerOff,
} from "react-icons/fa";

import "./Accountbar.css";

const Accountbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { icon: <MdOutlineDashboard />, label: "Dashboard", to: "" },
    { icon: <FaChalkboardTeacher />, label: "Courses", to: "courses" },
    { icon: <FaCalendarAlt />, label: "Appointments", to: "appointments" },
    {
      icon: <FaFileInvoice />,
      label: "Purchase History",
      to: "purchase-history",
    },
    { icon: <FaUser />, label: "My Profile", to: "my-profile" },
    { icon: <FaPowerOff />, label: "Log Out", to: "auth", absolute: true },
  ];

  return (
    <div className="accountbar-container">
      {/* Sidebar */}
      <div className="accountbar-sidebar">
        {tabs.map(({ icon, label, badge, to, absolute }, idx) => {
          const fullPath = absolute
            ? `/${to}`
            : `/MyAccount${to ? `/${to}` : ""}`;
          const isActive = location.pathname.startsWith(fullPath);
          return (
            <button
              key={idx}
              onClick={() => navigate(fullPath)}
              className={`accountbar-button ${isActive ? "active" : "inactive"
                }`}
            >
              <div className="accountbar-button-left">
                <span className="accountbar-icon">{icon}</span>
                <span>{label}</span>
              </div>
              {badge && <span className="accountbar-badge">{badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Nested route content */}
      <div className="accountbar-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Accountbar;
