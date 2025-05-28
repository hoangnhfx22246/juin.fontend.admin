import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from "../api/product";
import { showNotification } from "../util/notification";

const initialState = {
  products: [],
  isLoading: false,
  error: null,
  filters: {
    search: "",
    categoryId: null,
    brandId: null,
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

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params) => {
    try {
      const response = await productAPI.getProducts(params);
      return response;
    } catch (error) {
      showNotification.error(error.response.data.message);
      throw error;
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, thunkAPI) => {
    try {
      const response = await productAPI.createProduct(formData);
      return response;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await productAPI.updateProduct(id, formData);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await productAPI.deleteProduct(id);
      return id;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const patchProduct = createAsyncThunk(
  "products/patchProduct",
  async (id, thunkAPI) => {
    try {
      await productAPI.patchProduct(id);
      return id;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);
const productSlice = createSlice({
  name: "products",
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
      // 👤 Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // showNotification.info("Loading products...");
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;

        // showNotification.success("Products loaded successfully!");
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // 👤 Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Creating product...");
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.isLoading = false;
        showNotification.success("Product created successfully!");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error created product");
      })
      // 👤 Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Updating product...");
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.isLoading = false;
        showNotification.success("Product updated successfully!");
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error created product");
      })
      // 👤 Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Deleting product...");
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (cat) => cat._id !== action.payload
        );
        state.isLoading = false;
        showNotification.success("Product deleted successfully!");
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error(state.error);
      })
      // 👤 Patch product
      .addCase(patchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Updating product...");
      })
      .addCase(patchProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (cat) => cat._id === action.payload
        );
        if (index !== -1) {
          state.products[index].status =
            state.products[index].status === "active" ? "inactive" : "active";
        }
        state.isLoading = false;

        showNotification.success("Product updated successfully!");
      })
      .addCase(patchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error(state.error);
      });
  },
});

export const { setFilter, setPage, setSortState, setSort } =
  productSlice.actions;
export default productSlice.reducer;
