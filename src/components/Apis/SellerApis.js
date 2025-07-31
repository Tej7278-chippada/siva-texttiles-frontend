// src/components/Apis/SellerApis.js
import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });


export default API;

export const addProduct = (data) => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${authToken}`,
  };
  return API.post('/api/seller/add', data, { headers });
};

export const updateProduct = (id, data) => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${authToken}`,
  };
  return API.put(`/api/seller/${id}`, data, { headers });
};

export const deleteProduct = (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return API.delete(`/api/seller/${id}`, { headers });
};

// Fetch seller's own posts
// export const fetchSellerProducts = () => {
//   const authToken = localStorage.getItem('authToken');
//   const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
//   return API.get('/api/seller/my-products', { headers });
// };
export const fetchSellerProducts = (skip = 0, limit = 12, filters = {}, searchQuery = '') => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  const params = { skip, limit,
    categoriesFemale: filters.categoriesFemale,
    categoriesMale: filters.categoriesMale,
    // categoriesKids: filters.categoriesKids,
    gender: filters.gender,
    stockStatus: filters.stockStatus,
    price: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
    // postType: filters.serviceType ? 'ServiceOffering' : 'HelpRequest' // added this line for only shows the Helper posts on ALL section
    startDate: filters?.dateRange?.startDate,
    endDate: filters?.dateRange?.endDate
  };

  // Add search query parameter
  if (searchQuery && searchQuery.trim()) {
    params.search = searchQuery.trim();
  }
  
  return API.get('/api/seller/sellerProducts', { headers, params });
};

// export const searchProducts = (query, page = 1, limit = 20) => {
//   const authToken = localStorage.getItem('authToken');
//   const headers = {
//     Authorization: `Bearer ${authToken}`,
//   };
//   return API.get(`/api/seller/searchProducts?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, { headers });
// };

// export const filterProductsByGender = (genderType, page = 1, limit = 20, search = '') => {
//   const authToken = localStorage.getItem('authToken');
//   const headers = {
//     Authorization: `Bearer ${authToken}`,
//   };
//   return API.get(`/api/seller/filterProducts?genderType=${genderType}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, { headers });
// };

// export const getProductCounts = () => {
//   const authToken = localStorage.getItem('authToken');
//   const headers = {
//     Authorization: `Bearer ${authToken}`,
//   };
//   return API.get('/api/seller/productCounts', { headers });
// };

export const fetchSellerorders = (skip = 0, limit = 12, filters = {}, searchQuery = '') => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  const params = { skip, limit,
    // categoriesFemale: filters.categoriesFemale,
    // categoriesMale: filters.categoriesMale,
    // categoriesKids: filters.categoriesKids,
    // gender: filters.gender,
    orderStatus: filters.orderStatus,
    orderPrice: `${filters.priceRange[0]}-${filters.priceRange[1]}`,
    // postType: filters.serviceType ? 'ServiceOffering' : 'HelpRequest' // added this line for only shows the Helper posts on ALL section
    startDate: filters?.dateRange?.startDate,
    endDate: filters?.dateRange?.endDate
  };

  // Add search query parameter
  if (searchQuery && searchQuery.trim()) {
    params.search = searchQuery.trim();
  }
  
  return API.get('/api/seller/sellerOrders', { headers, params });
};

export const updateOrderStatus = (orderId, status) => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  return API.patch(`/api/seller/orders/${orderId}/status`, { status }, { headers });
};

export const fetchPaymentDetails = (paymentId) => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  return API.get(`/api/seller/payments/${paymentId}`, { headers });
};