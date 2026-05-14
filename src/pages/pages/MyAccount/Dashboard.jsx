import React, { useEffect, useState } from "react";
import { useBanner } from "../../../context/BannerContext";
import "./Dashboard.css"; // Make sure to import the CSS

const fallbackUser = {
  fullname: "Bidisha",
  email: "bidisha@example.com",
  address: "123 Street, City",
};

const Dashboard = () => {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBannerTitle("My Account");
    setBreadcrumb("My Account");
    setBannerImage("/other-banner.png");
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);

  useEffect(() => {
    fetch("/api/user/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setUser(fallbackUser);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="dashboard-loading">Loading...</p>;

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-heading">Dashboard</h2>
      <p className="dashboard-paragraph">
        From your account dashboard, you can easily check & view your{" "}
        <a href="/orders" className="dashboard-link">
          recent orders
        </a>
        .
      </p>
      <p className="dashboard-paragraph">
        Manage your{" "}
        <a href="/account/courses" className="dashboard-link">
          Courses
        </a>{" "}
        and edit your{" "}
        <a href="/account/details" className="dashboard-link">
          password and account details
        </a>
        .
      </p>
    </div>
  );
};

export default Dashboard;
