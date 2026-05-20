import axios from 'axios';

const API_URL = 'https://break-mhhd.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getHealth = () => api.get('/api/health');
export const getData = () => api.get('/api/data');
export const getCars = () => api.get('/api/cars');
export const deleteCar = (id) => api.delete(`/api/cars/${id}`);
export const updateCar = (id, data) => api.put(`/api/cars/${id}`, data);
export const createCar = (data) => api.post('/api/cars', data);


export default api;
