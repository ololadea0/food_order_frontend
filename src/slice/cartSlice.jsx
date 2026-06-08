import { createSlice } from "@reduxjs/toolkit";
import { logoutUser } from "./authSlice";

const cartFromStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const initialState = {
  cartItems: cartFromStorage,
};

// Save cart to localStorage whenever it changes
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x,
        );
      } else {
        state.cartItems.push(item);
      }
      saveCartToLocalStorage(state.cartItems);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload,
      );
      saveCartToLocalStorage(state.cartItems);
    },
    increaseQty: (state, action) => {
      const item = state.cartItems.find((x) => x._id === action.payload);
      if (item) {
        item.qty += 1;
        saveCartToLocalStorage(state.cartItems);
      }
    },
    decreaseQty: (state, action) => {
      const item = state.cartItems.find((x) => x._id === action.payload);
      if (item && item.qty > 1) {
        item.qty -= 1;
        saveCartToLocalStorage(state.cartItems);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
      saveCartToLocalStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      // Only clear cart on logout
      state.cartItems = [];
      saveCartToLocalStorage([]);
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
