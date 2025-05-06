import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserAPI, updateUserAPI } from "../api/user";

//gọi async thunk getUserAPI để lấy thông tin người dùng
export const getUser = createAsyncThunk(
  "user/getUser",
  async (userId, thunkAPI) => {
    try {
      const response = await getUserAPI(userId); // Gọi API lấy thông tin người dùng
      return response; // Trả về dữ liệu từ API (thông tin người dùng)
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);
//gọi async thunk updateUserAPI để cập nhật thông tin người dùng
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, formData }, thunkAPI) => {
    try {
      const response = await updateUserAPI(userId, formData); // Gọi API cập nhật thông tin người dùng
      return response; // Trả về dữ liệu từ API (thông tin người dùng đã cập nhật)
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

// Tạo slice cho user
const initialState = {
  userData: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    clearUser: (state) => {
      state.userData = null; // Xóa thông tin người dùng
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true; // Đang tải dữ liệu
        state.error = null; // Xóa lỗi trước đó
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false; // Tải dữ liệu xong
        state.userData = action.payload; // Lưu thông tin người dùng vào state
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false; // Kết thúc tải dữ liệu
        state.error = action.payload; // Lưu lỗi vào state
      })

      // Xử lý cập nhật thông tin người dùng
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true; // Đang tải dữ liệu
        state.error = null; // Xóa lỗi trước đó
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false; // Tải dữ liệu xong
        state.userData = action.payload; // Cập nhật thông tin người dùng vào state
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false; // Kết thúc tải dữ liệu
        state.error = action.payload; // Lưu lỗi vào state
      });
  },
});

export const { clearUser } = userSlice.actions; // Xuất action clearUser để xóa thông tin người dùng
export default userSlice.reducer; // Xuất reducer để sử dụng trong store
