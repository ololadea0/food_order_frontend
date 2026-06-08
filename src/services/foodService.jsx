import axios from "./axiosInstance";

const API_BASE_URL = "/foods"; // Proxy to backend server

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error.message ||
    "An unknown error occurred."
  );
};

// Fetch all foods
const fetchFoods = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Fetch single food by ID
const fetchFoodById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching food with ID ${id}:`, error);
    throw new Error(getErrorMessage(error));
  }
};

// Create new food (admin)
const createFood = async (foodData) => {
  try {
    const response = await axios.post(API_BASE_URL, foodData);
    return response.data;
  } catch (error) {
    console.error("Error creating food:", error);
    throw new Error(getErrorMessage(error));
  }
};

// Update existing food (admin)
const updateFood = async (id, foodData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, foodData);
    return response.data;
  } catch (error) {
    console.error(`Error updating food with ID ${id}:`, error);
    throw new Error(getErrorMessage(error));
  }
};

// Delete food (admin)
//
const deleteFood = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting food with ID ${id}:`, error);
    throw new Error(getErrorMessage(error));
  }
};

const foodService = {
  fetchFoods,
  fetchFoodById,
  createFood,
  updateFood,
  deleteFood,
};

export default foodService;
