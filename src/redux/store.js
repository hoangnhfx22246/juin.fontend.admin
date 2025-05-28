import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import categoryReducer from "./categorySlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
  },
});
