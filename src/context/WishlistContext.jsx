// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

// Check authentication
const checkAuth = () => {
  const token = localStorage.getItem('gg website token');
  const user = localStorage.getItem('gg website user');
  return token && user && token !== 'null' && user !== 'null';
};

// Get wishlist items from API
const getWishlistItems = async () => {
  if (!checkAuth()) {
    return [];
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/wishlist`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Wishlist API response:', data);
    
    if (data.status === 'success') {
      return data.data || [];
    } else {
      throw new Error(data.message || 'Failed to fetch wishlist items');
    }
  } catch (err) {
    console.error('Error fetching wishlist items:', err);
    throw new Error('Failed to load wishlist items');
  }
};

// Add item to wishlist via API
const addItemToWishlist = async (courseId) => {
  if (!checkAuth()) {
    throw new Error('Please login to add items to wishlist');
  }
  try {
    const token = JSON.parse(localStorage.getItem('gg website token'));
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/wishlist`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ course_id: courseId }),
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Add to wishlist API error response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (err) {
    console.error('Error adding item to wishlist:', err);
    throw new Error('Failed to add item to wishlist');
  }
};

// Remove item from wishlist via API
const removeItemFromWishlist = async (itemId) => {
  if (!checkAuth()) {
    throw new Error('Please login to remove items from wishlist');
  }
  try {
    const token = JSON.parse(localStorage.getItem('gg website token'));
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/wishlist/${itemId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Remove from wishlist API error response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (err) {
    console.error('Error removing item from wishlist:', err);
    throw new Error('Failed to remove item from wishlist');
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist items from API
  const fetchWishlistItems = async () => {
    if (!checkAuth()) {
      setWishlistItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const items = await getWishlistItems();
      setWishlistItems(items);
    } catch (err) {
      console.error('Error fetching wishlist items:', err);
      setError(err.message);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist via API
  const addToWishlist = async (item) => {
    if (!checkAuth()) {
      setError('Please login to add items to wishlist');
      return false;
    }

    // Check if item is already in wishlist
    const isAlreadyInWishlist = wishlistItems.some(wishlistItem => 
      wishlistItem.id === item.id || wishlistItem.course?.id === item.id
    );
    if (isAlreadyInWishlist) {
      setError('This item is already in your wishlist');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await addItemToWishlist(item.id);
      await fetchWishlistItems(); // Refresh wishlist items after adding
      return true;
    } catch (err) {
      console.error('Error adding item to wishlist:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist via API
  const removeFromWishlist = async (id) => {
    if (!checkAuth()) {
      setError('Please login to remove items from wishlist');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await removeItemFromWishlist(id);
      await fetchWishlistItems(); // Refresh wishlist items after removing
      return true;
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      fetchWishlistItems();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        loading,
        error,
        clearError,
        isAuthenticated: checkAuth,
        refreshWishlist: fetchWishlistItems
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
