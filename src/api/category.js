import axiosPrivate from "../util/axiosPrivate";
import axiosPublic from "../util/axiosPublic";
import { getCsrfToken } from "./csrfToken";

export const categoryAPI = {
  // Get all categories with pagination and filters
  getCategories: async (params) => {
    const response = await axiosPrivate.get("/api/categories", { params });
    return response.data;
  },

  // Create new category with image upload
  createCategory: async (formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.post("/api/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update category
  updateCategory: async (id, formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.put(`/api/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.delete(`/api/categories/${id}`);
    return response.data;
  },

  getParentCategories: async () => {
    const response = await axiosPublic.get("/api/categories/parents");
    return response.data;
  },
};
