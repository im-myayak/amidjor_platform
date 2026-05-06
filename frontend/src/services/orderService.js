import api from './api';

export const createOrder = (payload) => api.post('/orders/', payload);
export const fetchOrders = () => api.get('/orders/');
// Note: Order status changes are admin-only via PATCH /orders/{id}/
