// src/components/UserApis.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });


export default API;

// Fetch backend sample code
export const fetchBackendData = () => {
//   const authToken = localStorage.getItem('authToken');
//   const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return API.get('/backend-data'
    // , { headers }
);
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

export const fetchProductStockCount = async (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  
  return await API.get(`/api/products/${id}/stock-count`, { headers });
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