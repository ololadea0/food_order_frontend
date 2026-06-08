import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import paymentService from "../services/paymentService";

const initialState = {
  payment: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const initializePayment = createAsyncThunk(
  "payment/initialize",
  async (paymentData, thunkAPI) => {
    try {
      return await paymentService.initializePayment(paymentData);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// verify payment
export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (reference, thunkAPI) => {
    try {
      return await paymentService.verifyPayment(reference);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(initializePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payment = action.payload;
      })
      .addCase(initializePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.payment = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;
