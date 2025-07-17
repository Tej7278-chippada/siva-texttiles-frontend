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
  return API.post('/api/products/add', data, { headers });
};

export const updateProduct = (id, data) => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${authToken}`,
  };
  return API.put(`/api/products/${id}`, data, { headers });
};

export const deleteProduct = (id) => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return API.delete(`/api/products/${id}`, { headers });
};

// Fetch seller's own posts
export const fetchSellerProducts = () => {
  const authToken = localStorage.getItem('authToken');
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  return API.get('/api/products/my-products', { headers });
};

export const searchProducts = (query, page = 1, limit = 20) => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  return API.get(`/api/products/searchProducts?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, { headers });
};

export const filterProductsByGender = (genderType, page = 1, limit = 20, search = '') => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  return API.get(`/api/products/filterProducts?genderType=${genderType}&page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, { headers });
};

export const getProductCounts = () => {
  const authToken = localStorage.getItem('authToken');
  const headers = {
    Authorization: `Bearer ${authToken}`,
  };
  return API.get('/api/products/productCounts', { headers });
};