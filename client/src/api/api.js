// src/api/api.js
// Centralized API utility for authenticated requests

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Fetch wrapper that automatically includes authentication token
 * @param {string} endpoint - API endpoint (e.g., '/api/users/get-signup')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Fetch promise
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  // Handle both absolute and relative URLs
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_URL}${endpoint}`;

  return fetch(url, config);
};

export default fetchWithAuth;