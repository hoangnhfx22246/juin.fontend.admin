import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../util/notification";
import { orderAPI } from "../api/order";

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
  filters: {
    search: "",
    status: null,
    paymentMethod: null,
  },
  sort: {
    field: "createdAt",
    order: "desc", // 'asc' or 'desc'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (params) => {
    try {
      const response = await orderAPI.getOrders(params);
      return response;
    } catch (error) {
      showNotification.error(error.response.data.message);
      throw error;
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (formData, thunkAPI) => {
    try {
      const response = await orderAPI.createOrder(formData);
      return response;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await orderAPI.updateOrder(id, formData);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);
export const patchOrder = createAsyncThunk(
  "orders/patchOrder",
  async (id, thunkAPI) => {
    try {
      await orderAPI.patchOrder(id);
      return id;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setSort: (state, action) => {
      const { field, order } = action.payload;
      state.sort.field = field;
      state.sort.order = order;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // 👤 Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // showNotification.info("Loading orders...");
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;

        // showNotification.success("Orders loaded successfully!");
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // 👤 Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Creating order...");
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.isLoading = false;
        showNotification.success("Order created successfully!");
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error created order");
      })
      // 👤 Update order
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Updating order...");
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.isLoading = false;
        showNotification.success("Order updated successfully!");
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error created order");
      })
      // 👤 Patch order
      .addCase(patchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Updating order...");
      })
      .addCase(patchOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (cat) => cat._id === action.payload
        );
        if (index !== -1) {
          state.orders[index].status =
            state.orders[index].status === "active" ? "inactive" : "active";
        }
        state.isLoading = false;

        showNotification.success("Order updated successfully!");
      })
      .addCase(patchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error(state.error);
      });
  },
});

export const { setFilter, setPage, setSortState, setSort } = orderSlice.actions;
export default orderSlice.reducer;
