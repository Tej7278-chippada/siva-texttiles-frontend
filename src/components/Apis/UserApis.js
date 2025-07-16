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