import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryAPI } from "../api/category";
import { showNotification } from "../util/notification";

const initialState = {
  categories: [],
  parentCategories: [],
  isLoading: false,
  error: null,
  filters: {
    search: "",
    parentId: null,
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

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params, thunkAPI) => {
    try {
      const response = await categoryAPI.getCategories(params);
      return response;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (formData, thunkAPI) => {
    try {
      const response = await categoryAPI.createCategory(formData);
      return response;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await categoryAPI.updateCategory(id, formData);
      return response;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, thunkAPI) => {
    try {
      await categoryAPI.deleteCategory(id);
      return id;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchParentCategories = createAsyncThunk(
  "categories/fetchParentCategories",
  async (thunkAPI) => {
    try {
      const response = await categoryAPI.getParentCategories();
      return response;
    } catch (err) {
      // Có thể là err.response.data nếu dùng axios

      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
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
      // 👤 Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // showNotification.info("Loading categories...");
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.categories;
        state.pagination = action.payload.pagination;

        // showNotification.success("Categories loaded successfully!");
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error fetching categories");
      })
      // 👤 Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Creating category...");
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
        state.isLoading = false;
        showNotification.success("Category created successfully!");
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error created category");
      })
      // 👤 Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Updating category...");
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.isLoading = false;
        showNotification.success("Category updated successfully!");
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error updating category");
      })
      // 👤 Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        showNotification.info("Deleting category...");
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
        state.isLoading = false;
        showNotification.success("Category deleted successfully!");
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error(state.error);
      })
      // 👤 Fetch parent categorie
      .addCase(fetchParentCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParentCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parentCategories = action.payload.parentCategories;
      })
      .addCase(fetchParentCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        showNotification.error("error fetching parent categories");
      });
  },
});

export const { setFilter, setPage, setSortState, setSort } =
  categorySlice.actions;
export default categorySlice.reducer;
