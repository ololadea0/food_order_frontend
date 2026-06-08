import React, { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import Spinner from "../components/Spinner";
import uploadService from "../services/uploadService";
import {
  createFood,
  deleteFood,
  fetchFoods,
  reset,
  updateFood,
} from "../slice/foodSlice";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  preparationTime: "",
  image: "",
  available: true,
  additionalInfo: "",
};

function AdminFood() {
  const dispatch = useDispatch();
  const { foods, isLoading, isError, message } = useSelector(
    (state) => state.food,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }
  }, [dispatch, isError, message]);

  const sortedFoods = useMemo(
    () =>
      [...foods].sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      ),
    [foods],
  );

  const openCreateForm = () => {
    setEditingFoodId(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (food) => {
    setEditingFoodId(food._id);
    setFormData({
      name: food.name || "",
      category: food.category || "",
      description: food.description || "",
      price: food.price || "",
      preparationTime: food.preparationTime || "",
      image: food.image || "",
      available: food.available !== false,
      additionalInfo: food.additionalInfo || "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingFoodId(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadService.uploadImage(file);
      const imageUrl = response.imageUrl || response.path || response.url;

      if (!imageUrl) {
        throw new Error("Upload succeeded but no image URL was returned");
      }

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error.message || "Unable to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      preparationTime: Number(formData.preparationTime),
      image: formData.image,
      available: formData.available,
      additionalInfo: formData.additionalInfo.trim(),
    };

    if (
      !payload.name ||
      !payload.category ||
      !payload.description ||
      !payload.image
    ) {
      toast.error(
        "Name, category, description, preparation time, and uploaded image are required",
      );
      return;
    }

    if (Number.isNaN(payload.price) || payload.price < 0) {
      toast.error("Price must be a valid number");
      return;
    }

    if (Number.isNaN(payload.preparationTime) || payload.preparationTime <= 0) {
      toast.error("Preparation time must be a valid number");
      return;
    }

    try {
      if (editingFoodId) {
        await dispatch(
          updateFood({ id: editingFoodId, foodData: payload }),
        ).unwrap();
        toast.success("Food updated successfully");
      } else {
        await dispatch(createFood(payload)).unwrap();
        toast.success("Food created successfully");
      }

      closeForm();
    } catch (error) {
      toast.error(error || "Unable to save food");
    }
  };

  const handleDelete = async (foodId, foodName) => {
    const shouldDelete = window.confirm(`Delete "${foodName}" from the menu?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await dispatch(deleteFood(foodId)).unwrap();
      toast.success("Food deleted successfully");
    } catch (error) {
      toast.error(error || "Unable to delete food");
    }
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AdminLayout title="Manage Foods">
      <div className="mb-6">
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF5722] transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Food</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl text-[#2C2C2C] mb-6">
            {editingFoodId ? "Edit Food" : "Add New Food"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className="block text-sm text-gray-600 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Preparation Time
              </label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Price</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt={formData.name || "Food preview"}
                  className="mt-3 h-16 w-16 rounded-lg object-cover"
                />
              )}
              {isUploading && (
                <p className="text-sm text-gray-600 mt-2">Uploading image...</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-2">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., Delivery fee applies to delivery orders only"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <input
                id="available"
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              <label htmlFor="available" className="text-sm text-gray-600">
                Available for ordering
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF5722] transition-colors disabled:opacity-60"
              >
                {editingFoodId ? "Update Food" : "Create Food"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Preparation Time
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && foods.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : sortedFoods.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-sm text-gray-600"
                  >
                    No foods found.
                  </td>
                </tr>
              ) : (
                sortedFoods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-[#2C2C2C]">
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                        {food.category} - {food.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      {food.preparationTime} minutes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      ₦{Number(food.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          food.available !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {food.available !== false ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(food)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(food._id, food.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminFood;
