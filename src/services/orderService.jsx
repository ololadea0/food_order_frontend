import axios from "./axiosInstance";

const API_BASE_URL = "/orders";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error.message ||
    "An unknown error occurred."
  );
};

// Create Order for user
const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, orderData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get logged in user orders
const getMyOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/myorders`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get Single Order
const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// User cancel order
const cancelOrder = async (id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Get all orders for admin
const getAdminOrders = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update order status for admin
const updateAdminOrderStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAdminOrders,
  updateAdminOrderStatus,
};

export default orderService;
