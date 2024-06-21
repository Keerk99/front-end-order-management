import axios from "axios";

const REST_API_BASE_URL_PRODUCTS = 'http://localhost:8080/api/products';
const REST_API_BASE_URL_ORDERS = 'http://localhost:8080/api/orders';

export const listProducts = () => {
    return axios.get(REST_API_BASE_URL_PRODUCTS);
}

export const listOrders = () => {
    return axios.get(REST_API_BASE_URL_ORDERS);
}

export const createOrder = (orderData) => {
    return axios.post(REST_API_BASE_URL_ORDERS, orderData);
}

export const updateOrder = (orderId, orderData) => {
    return axios.put(`${REST_API_BASE_URL_ORDERS}/${orderId}`, orderData);
}

export const deleteOrder = (orderId) => {
    return axios.delete(`${REST_API_BASE_URL_ORDERS}/${orderId}`);
}