import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserAPI, logoutUserAPI, registerUserAPI } from "../api/auth"; // Import API loginUser từ userApi

// 👉 Thunk để gọi API register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const response = await registerUserAPI(formData); // 👈 Phải dùng await
      return response; // Trả về dữ liệu từ API (user + token)
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

// 👉 Thunk để gọi API login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const response = await loginUserAPI(formData); // 👈 Phải dùng await

      return response; // Trả về dữ liệu từ API (user + token)
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

// 👉 Thunk để gọi API logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      await logoutUserAPI(); // Gọi API logout
      return; // Không cần trả về gì cả
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
  accessToken: JSON.parse(localStorage.getItem("accessToken")) || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // 👤 Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem(
          "currentUser",
          JSON.stringify(action.payload.user)
        );
        localStorage.setItem(
          "accessToken",
          JSON.stringify(action.payload.accessToken)
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // 🔐 Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem(
          "currentUser",
          JSON.stringify(action.payload.user)
        );
        localStorage.setItem(
          "accessToken",
          JSON.stringify(action.payload.accessToken)
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 🔐 Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser = null;
        state.accessToken = null;
        localStorage.removeItem("currentUser");
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export const { setCurrentUser, updateAccessToken } = authSlice.actions; // Xuất action setCurrentUser
export default authSlice.reducer;
