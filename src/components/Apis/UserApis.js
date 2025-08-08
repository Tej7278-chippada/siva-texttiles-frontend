// src/components/UserApis.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// Function to check and refresh the token
const refreshAuthToken = async () => {
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/refresh-token`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const newToken = data.authToken;

      // Update tokens in localStorage
      const tokens = JSON.parse(localStorage.getItem('authTokens')) || {};
      const tokenUsername = localStorage.getItem('tokenUsername');
      tokens[tokenUsername] = newToken;
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      localStorage.setItem('authToken', newToken);
    } catch (error) {
      console.error('Error refreshing token:', error);
      // If token refresh fails, log the user out
      localStorage.clear();
      // localStorage.removeItem('authToken');
      // localStorage.removeItem('authTokens');
      // localStorage.removeItem('tokenUsername');
      // localStorage.removeItem('userId');
      // localStorage.removeItem('currentPage');
      window.location.reload();
    }
  }
};

// Add interceptors to refresh token if expired
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAuthToken();
      const newAuthToken = localStorage.getItem('authToken');
      if (newAuthToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAuthToken}`;
        return API(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Add activity listener to refresh tokens proactively
let activityTimeout;
const extendSession = () => {
  clearTimeout(activityTimeout);
  activityTimeout = setTimeout(refreshAuthToken, 10 * 60 * 1000); // 10 minutes
};
['mousemove', 'keydown', 'scroll', 'click'].forEach((event) =>
  window.addEventListener(event, extendSession)
);

export default API;

// Fetch backend sample code
export const fetchBackendData = () => {
//   const authToken = localStorage.getItem('authToken');
//   const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return API.get('/backend-data'
    // , { headers }
);
};

export const fetchProducts = (skip = 0, limit = 12, filters = {}, searchQuery = '') => {
  const params = { skip, limit,
    categoriesFemale: filters.categoriesFemale,
    categoriesMale: filters.categoriesMale,
    categoriesKids: filters.categoriesKids,
    gender: filters.gender,
    stockStatus: filters.stockStatus,
    price: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
    // postType: filters.serviceType ? 'ServiceOffering' : 'HelpRequest' // added this line for only shows the Helper posts on ALL section
  };

  // Add search query parameter
  if (searchQuery && searchQuery.trim()) {
    params.search = searchQuery.trim();
  }
  
  return API.get('/api/products/products', { params });
};

// fetch product by id
export const fetchProductById = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  return await API.get(`/api/products/${id}`, { headers });
};

export const fetchWishlist = async () => {
  const authToken = localStorage.getItem('authToken');
  return await API.get('/api/wishlist', {
      headers: {
          Authorization: `Bearer ${authToken}`,
      },
  });
};

export const checkProductInWishlist = async (productId) => {
  const authToken = localStorage.getItem('authToken');
  const response = await API.get(`/api/wishlist/is-in-wishlist/${productId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return response.data.isInWishlist;
};


export const addToWishlist = async (productId) => {
    const authToken = localStorage.getItem('authToken');
    return await API.post('/api/wishlist/add', { productId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};

export const removeFromWishlist = async (productId) => {
    const authToken = localStorage.getItem('authToken');
    return await API.post('/api/wishlist/remove', { productId }, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};

export const likeProduct = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const response = await API.post(`/api/likes/${id}/like`, {}, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data;
};

export const checkIfLiked = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const response = await API.get(`/api/likes/${id}/isLiked`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return response.data.isLiked;
};

export const fetchLikesCount = async (id) => {
  const response = await API.get(`/api/likes/${id}/count`);
  return response.data.likes;
};

export const addComment = async (id, comment) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  try {
      const response = await API.post(`/api/products/${id}/comment`, comment, { headers });
      return response.data;
  } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
  }
};

export const addDeliveryAddresses = async (deliveryAddresses) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

  try {
      const response = await API.post('/api/auth/add-deliveryAddress', deliveryAddresses, { headers });
      return response.data;
  } catch (error) {
      console.error('Error adding deliveryAddresses:', error);
      throw error;
  }
};

export const fetchProductStockCount = async (id, size, color) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  const params = {};
  
  if (size) params.size = size;
  if (color) params.color = color;
  
  return await API.get(`/api/products/${id}/stock-count`, { 
    headers,
    params 
  });
};

export const saveOrder = async (order) => {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return await API.post("/api/orders", order, { headers });
};

// Send Order Confirmation Email
export const sendOrderConfirmationEmail = async (payload) => {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return await API.post("/api/orders/send-email", payload, { headers });
};

export const fetchUserOrders = async () => {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return await API.get("/api/orders/my-orders", { headers });
};

export const fetchOrderById = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.get(`/api/orders/${id}`, { headers });
};

export const fetchRatingByOrderId = async (orderId) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.get(`/api/ratings?orderId=${orderId}`, { headers });
};

export const submitRating = async (ratingData) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.post('/api/ratings', ratingData, { headers });
};

export const updateRating = async (ratingId, ratingData) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.put(`/api/ratings/${ratingId}`, ratingData, { headers });
};

export const deleteRating = async (ratingId) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.delete(`/api/ratings/${ratingId}`, { headers });
};

export const fetchRatingsofProduct = async (prodId) => {
  return await API.get(`/api/ratings/product/${prodId}`);
};

export const updateDeliveryAddress = async (orderId, addressData) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.put(`/api/orders/${orderId}/address`, addressData, { headers });
};