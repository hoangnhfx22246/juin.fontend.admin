import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import categoryReducer from "./categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    categories: categoryReducer,
  },
});
