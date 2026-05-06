import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error) => {
  if (error.response) {
    const message = error.response.data?.detail || error.response.data || error.message;
    const status = error.response.status;
    const err = new Error(message);
    err.status = status;
    throw err;
  }

  if (error.request) {
    const err = new Error('No response received from server.');
    err.status = null;
    throw err;
  }

  throw new Error(error.message);
};

export const getProducts = async () => {
  try {
    const response = await api.get('products/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getProductDetail = async (productId) => {
  try {
    const response = await api.get(`products/${productId}/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createOrder = async (orderPayload) => {
  try {
    const response = await api.post('orders/', orderPayload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export default api;
