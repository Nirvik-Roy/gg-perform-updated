import React, { createContext, useContext, useState, useEffect } from 'react';

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/site-settings`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch site settings');
      }
      
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setSiteSettings(result.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ 
      siteSettings, 
      loading, 
      error, 
      fetchSiteSettings 
    }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext); 