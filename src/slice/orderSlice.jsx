import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "../services/orderService";

const initialState = {
  order: null,
  orders: [],
  checkoutData: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, thunkAPI) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get my Orders
export const getMyOrders = createAsyncThunk(
  "orders/myorders",
  async (_, thunkAPI) => {
    try {
      return await orderService.getMyOrders();
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Get Single Order
export const getOrderbyId = createAsyncThunk(
  "orders/getById",
  async (id, thunkAPI) => {
    try {
      return await orderService.getOrderById(id);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

// Cancel Order
export const cancelOrder = createAsyncThunk(
  "orders/cancel",
  async (id, thunkAPI) => {
    try {
      return await orderService.cancelOrder(id);
    } catch (error) {
      const message = error.message || "An unknown error occurred.";
      return thunkAPI.rejectWithValue(message);
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    reset(state) {
      state.order = null;
      state.checkoutData = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    saveCheckoutData(state, action) {
      // Starting a fresh checkout should clear any stale order/payment flow
      // state carried over from an earlier purchase attempt.
      state.checkoutData = action.payload;
      state.order = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET MY ORDERS
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // GET SINGLE ORDER
      .addCase(getOrderbyId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getOrderbyId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(getOrderbyId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // CANCEL ORDER
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.order = action.payload;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, saveCheckoutData } = orderSlice.actions;
export default orderSlice.reducer;
