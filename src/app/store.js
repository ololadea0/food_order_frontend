import { configureStore } from '@reduxjs/toolkit';
import foodReducer from '../slice/foodSlice';
import authReducer from '../slice/authSlice';
import cartReducer from '../slice/cartSlice';
import orderReducer from '../slice/orderSlice';
import paymentReducer from '../slice/paymentSlice';


const store = configureStore({
    reducer: {
        food: foodReducer,
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        payment: paymentReducer
    },
});

export default store;