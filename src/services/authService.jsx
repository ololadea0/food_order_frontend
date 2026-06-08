import axios from "./axiosInstance";

const API_BASE_URL = "/users"; // Proxy to backend server

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error.message ||
    "An unknown error occurred."
  );
};

// User registration

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    if (response.data) {
      // Store user data in localStorage for future authenticated requests
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// User login
const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    if (response.data) {
      // Store user data in localStorage for future authenticated requests
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update User Profile
const updateUserProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/profile`, userData);
    const existingUser = getCurrentUser();
    if (existingUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...existingUser, ...response.data }),
      );
    }
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// get User profile
const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// change user password
const updatePassword = async (passwordData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Logout user by removing user data from localStorage
const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
};

// Get current logged in user from localStorage
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const authService = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
  updatePassword,
  updateUserProfile,
};

export default authService;
