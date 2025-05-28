import axiosPrivate from "../util/axiosPrivate";
import axiosPublic from "../util/axiosPublic";
import { getCsrfToken } from "./csrfToken";

export const productAPI = {
  // Get all products with pagination and filters
  getProducts: async (params) => {
    const response = await axiosPrivate.get("/api/products", { params });
    return response.data;
  },
  getProduct: async (id) => {
    const response = await axiosPrivate.get(`/api/products/${id}`);
    return response.data;
  },

  // Create new product with image upload
  createProduct: async (formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);

    return response.data;
  },

  // Update product
  updateProduct: async (id, formData) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.put(`/api/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.delete(`/api/products/${id}`);
    return response.data;
  },

  // Patch product
  patchProduct: async (id) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.patch(`/api/products/${id}`);
    return response.data;
  },

  getParentProducts: async () => {
    const response = await axiosPublic.get("/api/products/parents");
    return response.data;
  },
};
