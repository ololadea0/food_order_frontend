import foodService from "../services/foodService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  food: null,
  foods: [],
  searchTerm: "",
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Async thunk to fetch all foods
export const fetchFoods = createAsyncThunk("foods/", async (_, thunkAPI) => {
  try {
    return await foodService.fetchFoods();
  } catch (error) {
    const message = error.message || "An unknown error occurred.";
    return thunkAPI.rejectWithValue(message);
  }
});

// Async thunk to fetch single food by ID
export const fetchFoodById = createAsyncThunk(
  "foods/fetchById",
  async (id, thunkAPI) => {
    try {
      return await foodService.fetchFoodById(id);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Async thunk to create new food (admin)
export const createFood = createAsyncThunk(
  "foods/create",
  async (foodData, thunkAPI) => {
    try {
      return await foodService.createFood(foodData);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Async thunk to update existing food (admin)
export const updateFood = createAsyncThunk(
  "foods/update",
  async ({ id, foodData }, thunkAPI) => {
    try {
      return await foodService.updateFood(id, foodData);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Async thunk to delete food (admin)
export const deleteFood = createAsyncThunk(
  "foods/delete",
  async (id, thunkAPI) => {
    try {
      return await foodService.deleteFood(id);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Create the food slice
const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearSearchTerm: (state) => {
      state.searchTerm = "";
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.foods = action.payload;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchFoodById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.food = action.payload; // Store the single food in an array for consistency
      })
      .addCase(fetchFoodById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createFood.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.foods.push(action.payload); // Add the new food to the list
      })
      .addCase(createFood.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateFood.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.foods = state.foods.map((food) =>
          food._id === action.payload._id ? action.payload : food,
        );
      })
      .addCase(updateFood.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteFood.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.foods = state.foods.filter(
          (food) => food._id !== action.meta.arg,
        );
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearSearchTerm, reset, setSearchTerm } = foodSlice.actions;
export default foodSlice.reducer;
