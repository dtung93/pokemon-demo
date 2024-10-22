import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/', 
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // GET request
  get: (url: string, params?: any) => api.get(url, { params })
};

export default apiService;
