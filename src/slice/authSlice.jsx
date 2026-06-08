import authService from "../services/authService";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const user = authService.getCurrentUser();

const initialState = {
  user: user || null,
  role: user?.role || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.registerUser(userData);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      return await authService.loginUser(credentials);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const user = authService.getCurrentUser();

      if (!user?.token) {
        throw new Error("No authenticated user found.");
      }

      return await authService.getUserProfile();
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      return await authService.updateUserProfile(profileData);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, thunkAPI) => {
    try {
      return await authService.updatePassword(passwordData);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Async thunk for user logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  authService.logoutUser();
});

// Slice for authentication
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message =
          action.payload?.message || "Password updated successfully.";
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message =
          action.error.message || "An unknown error occurred during logout.";
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
