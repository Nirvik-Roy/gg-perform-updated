import React, { useEffect, useState } from "react";
import { useBanner } from "../../context/BannerContext";

function PrivacyPolicy() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [privacyContent, setPrivacyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBannerTitle("Privacy Policy");
    setBreadcrumb("Privacy Policy");
    setBannerImage("/other-banner.png");

    // Fetch privacy policy content from API
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/legal-pages/privacy`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Handle the specific API response format
        if (result.status === "success" && result.data && result.data.content) {
          setPrivacyContent(result.data.content);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching privacy policy:", err);
        setError("Failed to load privacy policy content");
        // Fallback to default content if API fails
        
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  if (loading) {
    return (
      <div>
        <p>Loading privacy policy...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' ,color: '#343434',fontSize: '18px',fontWeight: '400',lineHeight: '20px',letterSpacing: '0px'}}>
      <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
    </div>
  );
}

export default PrivacyPolicy;
