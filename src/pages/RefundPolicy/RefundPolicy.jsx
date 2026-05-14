
import React, { useEffect, useState } from "react";
import { useBanner } from "../../context/BannerContext";

function RefundPolicy() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [refundContent, setRefundContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBannerTitle("Refund Policy");
    setBreadcrumb("Refund Policy");
    setBannerImage("/other-banner.png");

    // Fetch refund policy content from API
    const fetchRefundPolicy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/legal-pages/refund`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Handle the specific API response format
        if (result.status === "success" && result.data && result.data.content) {
          setRefundContent(result.data.content);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching refund policy:", err);
        setError("Failed to load refund policy content");
        // Fallback to default content if API fails
        
      } finally {
        setLoading(false);
      }
    };

    fetchRefundPolicy();
  }, []);

  if (loading) {
    return (
      <div>
        <p>Loading refund policy...</p>
      </div>
    );
  }


  return (
    <div style={{ padding: '20px' ,color: '#343434',fontSize: '18px',fontWeight: '400',lineHeight: '20px',letterSpacing: '0px'}}>
      <div dangerouslySetInnerHTML={{ __html: refundContent }} />
    </div>
  );
}

export default RefundPolicy;
