import axios from "./axiosInstance";

const API_BASE_URL = "/uploads/upload"; // Proxy to backend server

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error.message ||
    "An unknown error occurred."
  );
};

// Upload image to Cloudinary
const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(API_BASE_URL, formData);
    return response.data; // Assuming the backend returns the uploaded image URL in response.data
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(getErrorMessage(error));
  }
};

const uploadService = {
  uploadImage,
};

export default uploadService;
