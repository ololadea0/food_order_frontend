import axios from "./axiosInstance";

const API_BASE_URL = "/payments";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error.message ||
    "An unknown error occurred."
  );
};

// Initialize Payment Intent
const initializePayment = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/initialize`, {
      orderId,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Verify Payment
const verifyPayment = async (reference) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify`, {
      reference,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

const paymentService = { initializePayment, verifyPayment };
export default paymentService;
