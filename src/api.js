import axios from 'axios';

const BASE_URL = 'https://nfse-container.neemindev.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
