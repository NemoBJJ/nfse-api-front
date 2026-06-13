import axios from 'axios';

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const BASE_URL = isDevelopment
  ? 'http://localhost:8085/api'          // Porta 8085 = NFSe
  : 'https://nfse-api-hkf5.onrender.com/api';  // URL do Render

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;