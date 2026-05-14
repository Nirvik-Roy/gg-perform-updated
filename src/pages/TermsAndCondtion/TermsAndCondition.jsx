
import React, { useEffect, useState } from "react";
import { useBanner } from "../../context/BannerContext";

function TermsAndCondition() {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [termsContent, setTermsContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBannerTitle("Terms & Condition");
    setBreadcrumb("Terms & Condtion");
    setBannerImage("/other-banner.png");

    // Fetch terms and conditions content from API
    const fetchTermsAndConditions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/legal-pages/terms`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Handle the specific API response format
        if (result.status === "success" && result.data && result.data.content) {
          setTermsContent(result.data.content);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching terms and conditions:", err);
        setError("Failed to load terms and conditions content");
        // Fallback to default content if API fails
        
      } finally {
        setLoading(false);
      }
    };

    fetchTermsAndConditions();
  }, []);

  if (loading) {
    return (
      <div>
        <p>Loading terms and conditions...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' ,color: '#343434',fontSize: '18px',fontWeight: '400',lineHeight: '20px',letterSpacing: '0px'}}>
      <div dangerouslySetInnerHTML={{ __html: termsContent }} />
    </div>
  );
}

export default TermsAndCondition;
