import axiosPrivate from "../util/axiosPrivate";
import axiosPublic from "../util/axiosPublic";
import { getCsrfToken } from "./csrfToken";

export const brandAPI = {
  // Get all brands with pagination and filters
  getBrands: async () => {
    const response = await axiosPublic.get("/api/brands");
    return response.data;
  },

  // Create new brand with image upload
  createBrands: async (name) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.post(
      "/api/brands",
      { name: name },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // Delete brand
  deleteBrand: async (id) => {
    await getCsrfToken(); // Lấy token CSRF từ server khi Đăng ký người dùng
    const response = await axiosPrivate.delete(`/api/brands/${id}`);
    return response.data;
  },
};
