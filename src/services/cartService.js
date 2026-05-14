const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}frontend/cart`;

// Get authentication token
const getAuthToken = () => {
  const token = localStorage.getItem('gg website token');
  try {
    return JSON.parse(token);
  } catch (error) {
    // If parsing fails, return the token as is (it might already be a string)
    return token;
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  const token = getAuthToken();
  const user = localStorage.getItem('gg website user');
  return token && user && token !== 'null' && user !== 'null';
};

// Get cart items
export const getCartItems = async () => {
  if (!isAuthenticated()) {
    console.log('User not authenticated, returning empty cart');
    return [];
  }

  try {
    const token = getAuthToken();
    console.log('Fetching cart items with token:', token ? 'Token exists' : 'No token');
    
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Cart API response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Cart API response data:', data);
    
    // Log the structure of cart items to understand what fields are available
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log('First cart item structure:', data.data[0]);
      console.log('Available fields:', Object.keys(data.data[0]));
    }
    
    // Handle different possible response structures
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error fetching cart items:', err);
    throw new Error('Failed to load cart items');
  }
};

// Add item to cart
export const addItemToCart = async (courseId) => {
  if (!isAuthenticated()) {
    throw new Error('Please login to add items to cart');
  }

  try {
    const token = getAuthToken();
    console.log('Adding item to cart with courseId:', courseId, 'token:', token ? 'Token exists' : 'No token');
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_id: courseId
      }),
    });

    console.log('Add to cart API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Add to cart API error response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Add to cart API success response:', responseData);
    return true;
  } catch (err) {
    console.error('Error adding item to cart:', err);
    throw new Error('Failed to add item to cart');
  }
};

// Remove item from cart
export const removeItemFromCart = async (itemId) => {
  if (!isAuthenticated()) {
    throw new Error('Please login to remove items from cart');
  }

  try {
    const token = getAuthToken();
    console.log('Removing item from cart with itemId:', itemId, 'token:', token ? 'Token exists' : 'No token');
    console.log('DELETE request URL:', `${API_BASE_URL}/${itemId}`);
    
    const response = await fetch(`${API_BASE_URL}/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Remove from cart API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Remove from cart API error response:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Remove from cart API success response:', responseData);
    return true;
  } catch (err) {
    console.error('Error removing item from cart:', err);
    throw new Error('Failed to remove item from cart');
  }
};

// Export authentication helper
export const checkAuth = () => isAuthenticated();
