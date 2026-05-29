import React, { createContext, useContext, useState, useEffect } from "react";
import { getCartItems, addItemToCart, removeItemFromCart, checkAuth } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  // Fetch cart items from API
  const fetchCartItems = async () => {
    if (!checkAuth()) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const items = await getCartItems();
        console.log(items)
      if (items && items.length > 0) {
        
        const transformedItems = items.map((item) => {
          // Extract tags from API response object fields
          const apiTags = [];

          // Add course_type as tag
          if (item.course?.course_type) {
            apiTags.push(item.course.course_type);
          }

          // Add live_session_type as tag
          if (item.course?.live_session_type) {
            apiTags.push(item.course.live_session_type);
          }

          // Add any existing tags array
          if (item.course?.tags && Array.isArray(item.course.tags)) {
            apiTags.push(...item.course.tags);
          }

          return {
            id: item.course?.id || item?.id || '',
            title: item.course?.course_name || item?.product?.name || '',
            image: item.course?.featured_image || item?.product?.main_image,
            price: item.course?.sale_price || item?.product?.sale_price || item?.product_variant?.sale_price  || 0,
            originalPrice: item.course?.original_price || item?.product?.original_price || item?.product_variant?.original_price,
            rating: item.course?.rating || item.course?.course_rating || item.rating || 0,
            reviews: item.course?.reviews || item.course?.course_reviews || item.reviews || 0,
            itemType: item?.item_type,
            description:item?.product?.short_description,
            quantity:item?.quantity,
            tag: apiTags // Use tags from API object fields
          };
        });
        setCartItems(transformedItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError(err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart via API
  const addToCart = async (item) => {
    if (!checkAuth()) {
      setError('Please login to add items to cart');
      return false;
    }

    // Check if item is already in cart
    const isAlreadyInCart = cartItems.some(cartItem => cartItem.id === item.id);
    if (isAlreadyInCart) {
      setError('This item is already in your cart');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await addItemToCart(item.id);
      // Refresh cart items after adding
      await fetchCartItems();
      return true;
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart via API
  const removeFromCart = async (id) => {
    if (!checkAuth()) {
      setError('Please login to remove items from cart');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await removeItemFromCart(id);
      // Refresh cart items after removing
      await fetchCartItems();
      return true;
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear error message
  const clearError = () => {
    setError(null);
  };

  // Load cart items on mount and when authentication changes
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Watch for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      fetchCartItems();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        loading,
        error,
        clearError,
        isAuthenticated: checkAuth,
        refreshCart: fetchCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
