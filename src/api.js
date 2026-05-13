import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getHealth = () => api.get('/health');
export const getData = () => api.get('/data');
export const getCars = () => api.get('/cars');

export default api;
